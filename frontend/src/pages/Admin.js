import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Pencil, Trash2, X, CheckCircle, Clock, XCircle, BookOpen, CalendarDays, HelpCircle, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const ADMIN_PASSPHRASE = process.env.REACT_APP_ADMIN_PASSPHRASE || 'AIG-ctrl-2026!';

const Admin = () => {
  const { t } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [activeTab, setActiveTab] = useState('publications');

  // Publications state
  const [publications, setPublications] = useState([]);
  const [editingPub, setEditingPub] = useState(null);
  const [showPubForm, setShowPubForm] = useState(false);
  const [pubForm, setPubForm] = useState({ type: '', title: '', venue: '', year: '', description: '', link: '', internal: false, status: 'published', abstract: '' });

  // Bookings state
  const [bookings, setBookings] = useState([]);

  // FAQ state
  const [faqItems, setFaqItems] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [faqForm, setFaqForm] = useState({ section: 'definitions', question: '', answer: '', order: 0, active: true });

  // Services state
  const [servicePackages, setServicePackages] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    package_number: 1, title_en: '', title_fr: '', subtitle_en: '', subtitle_fr: '',
    best_for_en: '', best_for_fr: '', deliverables_en: '', deliverables_fr: '',
    produces_en: '', produces_fr: '', active: true
  });

  const loadPublications = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/publications`);
      const data = await res.json();
      setPublications(data);
    } catch (e) { /* silent */ }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (e) { /* silent */ }
  }, []);

  const loadFaqItems = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/faq`);
      const data = await res.json();
      setFaqItems(data);
    } catch (e) { /* silent */ }
  }, []);

  const loadServicePackages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`);
      const data = await res.json();
      setServicePackages(data);
    } catch (e) { /* silent */ }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadPublications();
      loadBookings();
      loadFaqItems();
      loadServicePackages();
    }
  }, [authenticated, loadPublications, loadBookings, loadFaqItems, loadServicePackages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passphrase === ADMIN_PASSPHRASE) setAuthenticated(true);
  };

  // Publication CRUD
  const handlePubSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPub) {
        await fetch(`${API_URL}/api/publications/${editingPub.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pubForm)
        });
      } else {
        await fetch(`${API_URL}/api/publications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pubForm)
        });
      }
      setShowPubForm(false);
      setEditingPub(null);
      setPubForm({ type: '', title: '', venue: '', year: '', description: '', link: '', internal: false, status: 'published', abstract: '' });
      loadPublications();
    } catch (e) { /* silent */ }
  };

  const handleEditPub = (pub) => {
    setEditingPub(pub);
    setPubForm({ type: pub.type, title: pub.title, venue: pub.venue, year: pub.year, description: pub.description, link: pub.link, internal: pub.internal, status: pub.status, abstract: pub.abstract || '' });
    setShowPubForm(true);
  };

  const handleDeletePub = async (id) => {
    if (!window.confirm(t.admin.deleteConfirm)) return;
    await fetch(`${API_URL}/api/publications/${id}`, { method: 'DELETE' });
    loadPublications();
  };

  // Booking handlers
  const handleBookingStatus = async (id, status) => {
    await fetch(`${API_URL}/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadBookings();
  };

  const handleDeleteBooking = async (id) => {
    await fetch(`${API_URL}/api/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
  };

  // FAQ CRUD
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await fetch(`${API_URL}/api/faq/${editingFaq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqForm)
        });
      } else {
        await fetch(`${API_URL}/api/faq`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqForm)
        });
      }
      setShowFaqForm(false);
      setEditingFaq(null);
      setFaqForm({ section: 'definitions', question: '', answer: '', order: 0, active: true });
      loadFaqItems();
    } catch (e) { /* silent */ }
  };

  const handleEditFaq = (item) => {
    setEditingFaq(item);
    setFaqForm({ section: item.section, question: item.question, answer: item.answer, order: item.order, active: item.active });
    setShowFaqForm(true);
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ item?')) return;
    await fetch(`${API_URL}/api/faq/${id}`, { method: 'DELETE' });
    loadFaqItems();
  };

  const handleFaqOrderChange = async (item, direction) => {
    const newOrder = direction === 'up' ? item.order - 1 : item.order + 1;
    await fetch(`${API_URL}/api/faq/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder })
    });
    loadFaqItems();
  };

  // Service CRUD
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...serviceForm,
        deliverables_en: serviceForm.deliverables_en.split('\n').filter(s => s.trim()),
        deliverables_fr: serviceForm.deliverables_fr.split('\n').filter(s => s.trim()),
        produces_en: serviceForm.produces_en.split('\n').filter(s => s.trim()),
        produces_fr: serviceForm.produces_fr.split('\n').filter(s => s.trim()),
      };
      if (editingService) {
        await fetch(`${API_URL}/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_URL}/api/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ package_number: 1, title_en: '', title_fr: '', subtitle_en: '', subtitle_fr: '', best_for_en: '', best_for_fr: '', deliverables_en: '', deliverables_fr: '', produces_en: '', produces_fr: '', active: true });
      loadServicePackages();
    } catch (e) { /* silent */ }
  };

  const handleEditService = (pkg) => {
    setEditingService(pkg);
    setServiceForm({
      package_number: pkg.package_number,
      title_en: pkg.title_en,
      title_fr: pkg.title_fr,
      subtitle_en: pkg.subtitle_en || '',
      subtitle_fr: pkg.subtitle_fr || '',
      best_for_en: pkg.best_for_en || '',
      best_for_fr: pkg.best_for_fr || '',
      deliverables_en: (pkg.deliverables_en || []).join('\n'),
      deliverables_fr: (pkg.deliverables_fr || []).join('\n'),
      produces_en: (pkg.produces_en || []).join('\n'),
      produces_fr: (pkg.produces_fr || []).join('\n'),
      active: pkg.active
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service package?')) return;
    await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
    loadServicePackages();
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
  const statusIcons = { pending: Clock, confirmed: CheckCircle, cancelled: XCircle };
  const sectionLabels = { definitions: 'Definitions', evidence: 'Evidence', engagements: 'Engagements' };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-6" data-testid="admin-login">
        <form onSubmit={handleLogin} className="card max-w-sm w-full text-center">
          <h2 className="font-serif text-4xl font-semibold text-[#0B0F1A] mb-4">Admin</h2>
          <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Passphrase" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none mb-4" data-testid="admin-passphrase" />
          <button type="submit" className="btn-primary w-full" data-testid="admin-login-btn">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="admin-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl font-semibold text-[#0B0F1A] mb-6">Admin</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveTab('publications')} data-testid="admin-tab-publications"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'publications' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`}>
            <BookOpen className="w-4 h-4" /> {t.admin.publications}
          </button>
          <button onClick={() => setActiveTab('bookings')} data-testid="admin-tab-bookings"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`}>
            <CalendarDays className="w-4 h-4" /> {t.admin.bookings}
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{bookings.filter(b => b.status === 'pending').length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('faq')} data-testid="admin-tab-faq"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'faq' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`}>
            <HelpCircle className="w-4 h-4" /> FAQ
          </button>
          <button onClick={() => setActiveTab('services')} data-testid="admin-tab-services"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'services' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`}>
            <Briefcase className="w-4 h-4" /> Services
          </button>
        </div>

        {/* Publications Tab */}
        {activeTab === 'publications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A]">{t.admin.publications}</h2>
              <button onClick={() => { setShowPubForm(true); setEditingPub(null); setPubForm({ type: '', title: '', venue: '', year: '', description: '', link: '', internal: false, status: 'published', abstract: '' }); }} className="btn-primary flex items-center gap-2 text-sm" data-testid="add-publication-btn">
                <Plus className="w-4 h-4" /> {t.admin.addPublication}
              </button>
            </div>

            {showPubForm && (
              <div className="card mb-6 border-l-4 border-[#0D0A2E]" data-testid="publication-form">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#0B0F1A]">{editingPub ? t.admin.editPublication : t.admin.addPublication}</h3>
                  <button onClick={() => { setShowPubForm(false); setEditingPub(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <form onSubmit={handlePubSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.title} *</label>
                      <input type="text" value={pubForm.title} onChange={e => setPubForm(p => ({ ...p, title: e.target.value }))} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" data-testid="pub-title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.type}</label>
                      <input type="text" value={pubForm.type} onChange={e => setPubForm(p => ({ ...p, type: e.target.value }))} placeholder="Protocol, Briefing, Working Paper..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.venue}</label>
                      <input type="text" value={pubForm.venue} onChange={e => setPubForm(p => ({ ...p, venue: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.year}</label>
                      <input type="text" value={pubForm.year} onChange={e => setPubForm(p => ({ ...p, year: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.status}</label>
                      <select value={pubForm.status} onChange={e => setPubForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm">
                        <option value="published">{t.admin.published}</option>
                        <option value="in_development">{t.admin.inDevelopment}</option>
                        <option value="draft">{t.admin.draft}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.description}</label>
                    <textarea value={pubForm.description} onChange={e => setPubForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.link}</label>
                      <input type="text" value={pubForm.link} onChange={e => setPubForm(p => ({ ...p, link: e.target.value }))} placeholder="/sealed-card or https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={pubForm.internal} onChange={e => setPubForm(p => ({ ...p, internal: e.target.checked }))} className="rounded border-gray-300" />
                        {t.admin.internal}
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary text-sm" data-testid="pub-save-btn">{t.admin.save}</button>
                    <button type="button" onClick={() => { setShowPubForm(false); setEditingPub(null); }} className="btn-ghost text-sm">{t.admin.cancel}</button>
                  </div>
                </form>
              </div>
            )}

            {publications.length === 0 ? (
              <p className="text-gray-500 text-sm">{t.admin.noPublications}</p>
            ) : (
              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id} className="card flex items-start justify-between gap-4" data-testid={`admin-pub-${pub.id}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {pub.type && <span className="text-xs font-medium text-[#0D0A2E] uppercase tracking-wide">{pub.type}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${pub.status === 'published' ? 'bg-green-100 text-green-700' : pub.status === 'in_development' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                          {pub.status === 'published' ? t.admin.published : pub.status === 'in_development' ? t.admin.inDevelopment : t.admin.draft}
                        </span>
                        {pub.year && <span className="text-xs text-gray-400">{pub.year}</span>}
                      </div>
                      <h3 className="font-medium text-[#0B0F1A] text-sm truncate">{pub.title}</h3>
                      {pub.description && <p className="text-gray-500 text-xs mt-1 line-clamp-1 whitespace-pre-line">{pub.description}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleEditPub(pub)} className="p-2 hover:bg-[#0D0A2E]/10 rounded-lg transition-colors" data-testid={`edit-pub-${pub.id}`}>
                        <Pencil className="w-4 h-4 text-gray-500 hover:text-[#0D0A2E]" />
                      </button>
                      <button onClick={() => handleDeletePub(pub.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" data-testid={`delete-pub-${pub.id}`}>
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6">{t.admin.bookingsList}</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">{t.admin.noBookings}</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const StatusIcon = statusIcons[booking.status] || Clock;
                  return (
                    <div key={booking.id} className="card" data-testid={`booking-${booking.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusColors[booking.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {booking.status === 'pending' ? t.admin.pending : booking.status === 'confirmed' ? t.admin.confirmed : t.admin.cancelled}
                            </span>
                            <span className="text-sm font-medium text-[#0B0F1A]">{booking.date} at {booking.time}</span>
                          </div>
                          <p className="text-sm text-gray-700"><span className="font-medium">{booking.name}</span> — {booking.email}</p>
                          {booking.organization && <p className="text-xs text-gray-500">{booking.organization}</p>}
                          {booking.topic && <p className="text-xs text-gray-500 mt-1">{t.bookingCalendar.topic}: {booking.topic}</p>}
                          {booking.current_state && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{booking.current_state}</p>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleBookingStatus(booking.id, 'confirmed')} className="p-2 hover:bg-green-50 rounded-lg transition-colors" title={t.admin.confirm} data-testid={`confirm-booking-${booking.id}`}>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                              <button onClick={() => handleBookingStatus(booking.id, 'cancelled')} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title={t.admin.cancel} data-testid={`cancel-booking-${booking.id}`}>
                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteBooking(booking.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" data-testid={`delete-booking-${booking.id}`}>
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A]">FAQ Items</h2>
              <button onClick={() => { setShowFaqForm(true); setEditingFaq(null); setFaqForm({ section: 'definitions', question: '', answer: '', order: 0, active: true }); }} className="btn-primary flex items-center gap-2 text-sm" data-testid="add-faq-btn">
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>

            {showFaqForm && (
              <div className="card mb-6 border-l-4 border-[#7b2cbf]" data-testid="faq-form">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#0B0F1A]">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
                  <button onClick={() => { setShowFaqForm(false); setEditingFaq(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <form onSubmit={handleFaqSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                      <select value={faqForm.section} onChange={e => setFaqForm(f => ({ ...f, section: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm">
                        <option value="definitions">Definitions</option>
                        <option value="evidence">Evidence</option>
                        <option value="engagements">Engagements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input type="number" value={faqForm.order} onChange={e => setFaqForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={faqForm.active} onChange={e => setFaqForm(f => ({ ...f, active: e.target.checked }))} className="rounded border-gray-300" />
                        Active
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                    <input type="text" value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" data-testid="faq-question" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                    <textarea value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} required rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" data-testid="faq-answer" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary text-sm" data-testid="faq-save-btn">{t.admin.save}</button>
                    <button type="button" onClick={() => { setShowFaqForm(false); setEditingFaq(null); }} className="btn-ghost text-sm">{t.admin.cancel}</button>
                  </div>
                </form>
              </div>
            )}

            {['definitions', 'evidence', 'engagements'].map(section => {
              const sectionItems = faqItems.filter(f => f.section === section).sort((a, b) => a.order - b.order);
              return (
                <div key={section} className="mb-8">
                  <h3 className="text-sm font-semibold text-[#7b2cbf] uppercase tracking-wide mb-3">{sectionLabels[section]} ({sectionItems.length})</h3>
                  {sectionItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">No items in this section</p>
                  ) : (
                    <div className="space-y-2">
                      {sectionItems.map((item) => (
                        <div key={item.id} className={`card flex items-start justify-between gap-4 ${!item.active ? 'opacity-50' : ''}`} data-testid={`faq-item-${item.id}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400">#{item.order}</span>
                              {!item.active && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>}
                            </div>
                            <h4 className="font-medium text-[#0B0F1A] text-sm">{item.question}</h4>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2 whitespace-pre-line">{item.answer}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => handleFaqOrderChange(item, 'up')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            </button>
                            <button onClick={() => handleFaqOrderChange(item, 'down')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            <button onClick={() => handleEditFaq(item)} className="p-2 hover:bg-[#0D0A2E]/10 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4 text-gray-500 hover:text-[#0D0A2E]" />
                            </button>
                            <button onClick={() => handleDeleteFaq(item.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A]">Service Packages</h2>
              <button onClick={() => { setShowServiceForm(true); setEditingService(null); setServiceForm({ package_number: servicePackages.length + 1, title_en: '', title_fr: '', subtitle_en: '', subtitle_fr: '', best_for_en: '', best_for_fr: '', deliverables_en: '', deliverables_fr: '', produces_en: '', produces_fr: '', active: true }); }} className="btn-primary flex items-center gap-2 text-sm" data-testid="add-service-btn">
                <Plus className="w-4 h-4" /> Add Package
              </button>
            </div>

            {showServiceForm && (
              <div className="card mb-6 border-l-4 border-[#0D0A2E]" data-testid="service-form">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#0B0F1A]">{editingService ? 'Edit Package' : 'Add Package'}</h3>
                  <button onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package # *</label>
                      <input type="number" value={serviceForm.package_number} onChange={e => setServiceForm(s => ({ ...s, package_number: parseInt(e.target.value) || 1 }))} min="1" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div className="col-span-2 flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={serviceForm.active} onChange={e => setServiceForm(s => ({ ...s, active: e.target.checked }))} className="rounded border-gray-300" />
                        Active
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN) *</label>
                      <input type="text" value={serviceForm.title_en} onChange={e => setServiceForm(s => ({ ...s, title_en: e.target.value }))} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title (FR) *</label>
                      <input type="text" value={serviceForm.title_fr} onChange={e => setServiceForm(s => ({ ...s, title_fr: e.target.value }))} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (EN)</label>
                      <input type="text" value={serviceForm.subtitle_en} onChange={e => setServiceForm(s => ({ ...s, subtitle_en: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (FR)</label>
                      <input type="text" value={serviceForm.subtitle_fr} onChange={e => setServiceForm(s => ({ ...s, subtitle_fr: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Best For (EN)</label>
                      <textarea value={serviceForm.best_for_en} onChange={e => setServiceForm(s => ({ ...s, best_for_en: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Best For (FR)</label>
                      <textarea value={serviceForm.best_for_fr} onChange={e => setServiceForm(s => ({ ...s, best_for_fr: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (EN) <span className="text-gray-400 font-normal">- one per line</span></label>
                      <textarea value={serviceForm.deliverables_en} onChange={e => setServiceForm(s => ({ ...s, deliverables_en: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" placeholder="AI use case inventory&#10;Risk tiering criteria&#10;Decision rights flow" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (FR) <span className="text-gray-400 font-normal">- one per line</span></label>
                      <textarea value={serviceForm.deliverables_fr} onChange={e => setServiceForm(s => ({ ...s, deliverables_fr: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What It Produces (EN) <span className="text-gray-400 font-normal">- one per line</span></label>
                      <textarea value={serviceForm.produces_en} onChange={e => setServiceForm(s => ({ ...s, produces_en: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What It Produces (FR) <span className="text-gray-400 font-normal">- one per line</span></label>
                      <textarea value={serviceForm.produces_fr} onChange={e => setServiceForm(s => ({ ...s, produces_fr: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none text-sm resize-none" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary text-sm" data-testid="service-save-btn">{t.admin.save}</button>
                    <button type="button" onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="btn-ghost text-sm">{t.admin.cancel}</button>
                  </div>
                </form>
              </div>
            )}

            {servicePackages.length === 0 ? (
              <p className="text-gray-500 text-sm">No service packages configured</p>
            ) : (
              <div className="space-y-3">
                {servicePackages.sort((a, b) => a.package_number - b.package_number).map((pkg) => (
                  <div key={pkg.id} className={`card ${!pkg.active ? 'opacity-50' : ''}`} data-testid={`service-${pkg.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#7b2cbf] uppercase">Package {pkg.package_number}</span>
                          {!pkg.active && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>}
                        </div>
                        <h3 className="font-medium text-[#0B0F1A]">{pkg.title_en}</h3>
                        <p className="text-gray-500 text-sm">{pkg.title_fr}</p>
                        {pkg.deliverables_en?.length > 0 && (
                          <p className="text-xs text-gray-400 mt-2">{pkg.deliverables_en.length} deliverables configured</p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleEditService(pkg)} className="p-2 hover:bg-[#0D0A2E]/10 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4 text-gray-500 hover:text-[#0D0A2E]" />
                        </button>
                        <button onClick={() => handleDeleteService(pkg.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
