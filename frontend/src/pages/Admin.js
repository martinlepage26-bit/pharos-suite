import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Pencil, Trash2, X, CheckCircle, Clock, XCircle, CalendarDays, HelpCircle, Briefcase, ChevronUp, ChevronDown, Server, Bot, Cloud, RefreshCw } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const ADMIN_SESSION_KEY = 'pharos-ai-admin-token';
const LEGACY_ADMIN_SESSION_KEY = 'pharos-suite-admin-token';

const Admin = () => {
  const { t } = useLanguage();
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return (
      window.sessionStorage.getItem(ADMIN_SESSION_KEY)
      || window.sessionStorage.getItem(LEGACY_ADMIN_SESSION_KEY)
      || ''
    );
  });
  const [passphrase, setPassphrase] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const authenticated = Boolean(authToken);

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
  const [platformStatus, setPlatformStatus] = useState(null);
  const [platformStatusLoading, setPlatformStatusLoading] = useState(false);
  const [platformStatusError, setPlatformStatusError] = useState('');

  const resetAdminSession = useCallback((message = '') => {
    setAuthToken('');
    setPassphrase('');
    setLoginError(message);
    setBookings([]);
    setFaqItems([]);
    setServicePackages([]);
    setPlatformStatus(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (authToken) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, authToken);
      window.sessionStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
    } else {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
    }
  }, [authToken]);

  const authFetch = useCallback(async (url, options = {}) => {
    if (!authToken) {
      throw new Error('Admin session missing');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${authToken}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      resetAdminSession('Your admin session expired. Please sign in again.');
      throw new Error('Admin session expired');
    }

    if (response.status === 503) {
      resetAdminSession('Admin access is not configured on the backend yet.');
      throw new Error('Admin access is not configured');
    }

    return response;
  }, [authToken, resetAdminSession]);

  const loadBookings = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/api/bookings`);
      if (!res.ok) throw new Error(`Bookings request failed with ${res.status}`);
      const data = await res.json();
      setBookings(data);
    } catch (e) { /* silent */ }
  }, [authFetch]);

  const loadFaqItems = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/api/faq`);
      if (!res.ok) throw new Error(`FAQ request failed with ${res.status}`);
      const data = await res.json();
      setFaqItems(data);
    } catch (e) { /* silent */ }
  }, [authFetch]);

  const loadServicePackages = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/api/services`);
      if (!res.ok) throw new Error(`Services request failed with ${res.status}`);
      const data = await res.json();
      setServicePackages(data);
    } catch (e) { /* silent */ }
  }, [authFetch]);

  const loadPlatformStatus = useCallback(async () => {
    setPlatformStatusLoading(true);
    setPlatformStatusError('');
    try {
      const res = await authFetch(`${API_URL}/api/admin/platform-status`);
      if (!res.ok) {
        throw new Error(`Status request failed with ${res.status}`);
      }
      const data = await res.json();
      setPlatformStatus(data);
    } catch (e) {
      setPlatformStatusError(e.message || 'Could not load platform status');
    } finally {
      setPlatformStatusLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (authenticated) {
      loadBookings();
      loadFaqItems();
      loadServicePackages();
      loadPlatformStatus();
    }
  }, [authenticated, loadBookings, loadFaqItems, loadServicePackages, loadPlatformStatus]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase })
      });

      if (response.status === 401) {
        throw new Error('Incorrect passphrase.');
      }

      if (response.status === 503) {
        throw new Error('Admin access is not configured on the backend yet.');
      }

      if (!response.ok) {
        throw new Error(`Admin login failed with ${response.status}`);
      }

      const data = await response.json();
      setAuthToken(data.token || '');
      setPassphrase('');
    } catch (error) {
      setLoginError(error.message || 'Could not sign in to Admin.');
    }
  };

  // Booking handlers
  const handleBookingStatus = async (id, status) => {
    await authFetch(`${API_URL}/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadBookings();
  };

  const handleDeleteBooking = async (id) => {
    await authFetch(`${API_URL}/api/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
  };

  // FAQ CRUD
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await authFetch(`${API_URL}/api/faq/${editingFaq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqForm)
        });
      } else {
        await authFetch(`${API_URL}/api/faq`, {
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
    await authFetch(`${API_URL}/api/faq/${id}`, { method: 'DELETE' });
    loadFaqItems();
  };

  const handleFaqOrderChange = async (item, direction) => {
    const newOrder = direction === 'up' ? item.order - 1 : item.order + 1;
    await authFetch(`${API_URL}/api/faq/${item.id}`, {
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
        await authFetch(`${API_URL}/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await authFetch(`${API_URL}/api/services`, {
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
    await authFetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
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
          {loginError ? <p className="text-sm text-red-500 mb-4">{loginError}</p> : null}
          <button type="submit" className="btn-primary w-full" data-testid="admin-login-btn">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="admin-page">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-serif text-4xl font-semibold text-[#0B0F1A] mb-0">Admin</h1>
          <button type="button" onClick={() => resetAdminSession()} className="btn-ghost text-sm">Sign out</button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
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
          <button onClick={() => setActiveTab('platform')} data-testid="admin-tab-platform"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'platform' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`}>
            <Server className="w-4 h-4" /> Platform
          </button>
        </div>

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

        {activeTab === 'platform' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A]">Platform status</h2>
                <p className="text-sm text-gray-500 mt-1">Local service health, LLM readiness, and Cloudflare readiness.</p>
              </div>
              <button onClick={loadPlatformStatus} className="btn-ghost text-sm inline-flex items-center gap-2" disabled={platformStatusLoading}>
                <RefreshCw className={`w-4 h-4 ${platformStatusLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {platformStatusError ? (
              <div className="card border border-red-200 bg-red-50 text-red-700 mb-6">
                <p className="font-medium">Platform status could not be loaded.</p>
                <p className="text-sm mt-1">{platformStatusError}</p>
              </div>
            ) : null}

            {platformStatus ? (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {platformStatus.services?.map((service) => (
                    <div key={service.key} className="card">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-gray-400 mb-2">Service</p>
                          <h3 className="text-lg font-semibold text-[#0B0F1A]">{service.name}</h3>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${service.healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {service.healthy ? 'Healthy' : 'Issue'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 break-all">{service.url}</p>
                      <p className="text-xs text-gray-500 mt-3">Status code: {service.status_code ?? 'n/a'}</p>
                      <p className="text-xs text-gray-500 mt-1">Detail: {service.detail || 'n/a'}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot className="w-5 h-5 text-[#7b2cbf]" />
                      <h3 className="text-lg font-semibold text-[#0B0F1A]">LLM and email readiness</h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="flex items-center justify-between gap-3">
                        <span>Pharos key configured</span>
                        <span className={platformStatus.llm?.pharos_configured ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.llm?.pharos_configured ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>Resend configured</span>
                        <span className={platformStatus.llm?.resend_configured ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.llm?.resend_configured ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>OpenAI configured</span>
                        <span className={platformStatus.llm?.openai_configured ? 'text-green-700' : 'text-amber-700'}>
                          {platformStatus.llm?.openai_configured ? 'Yes' : 'Optional / off'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>OpenAI base URL configured</span>
                        <span className={platformStatus.llm?.openai_base_url_configured ? 'text-green-700' : 'text-amber-700'}>
                          {platformStatus.llm?.openai_base_url_configured ? 'Yes' : 'Optional / off'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>Pharos library present</span>
                        <span className={platformStatus.llm?.pharos_library_present ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.llm?.pharos_library_present ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 break-all">Source: {platformStatus.llm?.pharos_source}</p>
                      <ul className="mt-3 space-y-2 text-xs text-gray-500">
                        {(platformStatus.llm?.notes || []).map((note) => (
                          <li key={note}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <Cloud className="w-5 h-5 text-[#7b2cbf]" />
                      <h3 className="text-lg font-semibold text-[#0B0F1A]">Cloudflare readiness</h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="flex items-center justify-between gap-3">
                        <span>Wrangler installed</span>
                        <span className={platformStatus.cloudflare?.wrangler_installed ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.cloudflare?.wrangler_installed ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>API token configured</span>
                        <span className={platformStatus.cloudflare?.api_token_configured ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.cloudflare?.api_token_configured ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>Account ID configured</span>
                        <span className={platformStatus.cloudflare?.account_id_configured ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.cloudflare?.account_id_configured ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>Zone ID configured</span>
                        <span className={platformStatus.cloudflare?.zone_id_configured ? 'text-green-700' : 'text-red-700'}>
                          {platformStatus.cloudflare?.zone_id_configured ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>Frontend config prepared</span>
                        <span className={platformStatus.cloudflare?.frontend_config_present ? 'text-green-700' : 'text-amber-700'}>
                          {platformStatus.cloudflare?.frontend_config_present ? 'Yes' : 'Not yet'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span>SPA redirects prepared</span>
                        <span className={platformStatus.cloudflare?.frontend_spa_redirects_present ? 'text-green-700' : 'text-amber-700'}>
                          {platformStatus.cloudflare?.frontend_spa_redirects_present ? 'Yes' : 'Not yet'}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className={`text-sm font-medium ${platformStatus.cloudflare?.backend_portable_now ? 'text-green-700' : 'text-amber-700'}`}>
                        Backend move as-is: {platformStatus.cloudflare?.backend_portable_now ? 'Ready' : 'Blocked'}
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-gray-500">
                        {(platformStatus.cloudflare?.notes || []).map((note) => (
                          <li key={note}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <p className="text-sm text-gray-500">{platformStatusLoading ? 'Loading platform status...' : 'No platform status loaded yet.'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
