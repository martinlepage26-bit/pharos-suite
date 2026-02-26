import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Pencil, Trash2, X, CheckCircle, Clock, XCircle, BookOpen, CalendarDays } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);
  const [pubForm, setPubForm] = useState({ type: '', title: '', venue: '', year: '', description: '', link: '', internal: false, status: 'published', abstract: '' });

  // Bookings state
  const [bookings, setBookings] = useState([]);

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

  useEffect(() => {
    if (authenticated) {
      loadPublications();
      loadBookings();
    }
  }, [authenticated, loadPublications, loadBookings]);

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
      setShowForm(false);
      setEditingPub(null);
      setPubForm({ type: '', title: '', venue: '', year: '', description: '', link: '', internal: false, status: 'published', abstract: '' });
      loadPublications();
    } catch (e) { /* silent */ }
  };

  const handleEditPub = (pub) => {
    setEditingPub(pub);
    setPubForm({ type: pub.type, title: pub.title, venue: pub.venue, year: pub.year, description: pub.description, link: pub.link, internal: pub.internal, status: pub.status, abstract: pub.abstract || '' });
    setShowForm(true);
  };

  const handleDeletePub = async (id) => {
    if (!window.confirm(t.admin.deleteConfirm)) return;
    await fetch(`${API_URL}/api/publications/${id}`, { method: 'DELETE' });
    loadPublications();
  };

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

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
  const statusIcons = { pending: Clock, confirmed: CheckCircle, cancelled: XCircle };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-6" data-testid="admin-login">
        <form onSubmit={handleLogin} className="card max-w-sm w-full text-center">
          <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-4">Admin</h2>
          <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Passphrase" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none mb-4" data-testid="admin-passphrase" />
          <button type="submit" className="btn-primary w-full" data-testid="admin-login-btn">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="admin-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6">Admin</h1>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveTab('publications')} data-testid="admin-tab-publications"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'publications' ? 'bg-[#2A206B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2A206B]'}`}>
            <BookOpen className="w-4 h-4" /> {t.admin.publications}
          </button>
          <button onClick={() => setActiveTab('bookings')} data-testid="admin-tab-bookings"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-[#2A206B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2A206B]'}`}>
            <CalendarDays className="w-4 h-4" /> {t.admin.bookings}
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{bookings.filter(b => b.status === 'pending').length}</span>
            )}
          </button>
        </div>

        {activeTab === 'publications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-semibold text-[#0B0F1A]">{t.admin.publications}</h2>
              <button onClick={() => { setShowForm(true); setEditingPub(null); setPubForm({ type: '', title: '', venue: '', year: '', description: '', link: '', internal: false, status: 'published', abstract: '' }); }} className="btn-primary flex items-center gap-2 text-sm" data-testid="add-publication-btn">
                <Plus className="w-4 h-4" /> {t.admin.addPublication}
              </button>
            </div>

            {showForm && (
              <div className="card mb-6 border-l-4 border-[#2A206B]" data-testid="publication-form">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#0B0F1A]">{editingPub ? t.admin.editPublication : t.admin.addPublication}</h3>
                  <button onClick={() => { setShowForm(false); setEditingPub(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <form onSubmit={handlePubSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.title} *</label>
                      <input type="text" value={pubForm.title} onChange={e => setPubForm(p => ({ ...p, title: e.target.value }))} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm" data-testid="pub-title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.type}</label>
                      <input type="text" value={pubForm.type} onChange={e => setPubForm(p => ({ ...p, type: e.target.value }))} placeholder="Protocol, Briefing, Working Paper..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.venue}</label>
                      <input type="text" value={pubForm.venue} onChange={e => setPubForm(p => ({ ...p, venue: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.year}</label>
                      <input type="text" value={pubForm.year} onChange={e => setPubForm(p => ({ ...p, year: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.status}</label>
                      <select value={pubForm.status} onChange={e => setPubForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm">
                        <option value="published">{t.admin.published}</option>
                        <option value="in_development">{t.admin.inDevelopment}</option>
                        <option value="draft">{t.admin.draft}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.description}</label>
                    <textarea value={pubForm.description} onChange={e => setPubForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.link}</label>
                      <input type="text" value={pubForm.link} onChange={e => setPubForm(p => ({ ...p, link: e.target.value }))} placeholder="/sealed-card or https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#2A206B] focus:outline-none text-sm" />
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
                    <button type="button" onClick={() => { setShowForm(false); setEditingPub(null); }} className="btn-ghost text-sm">{t.admin.cancel}</button>
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
                        {pub.type && <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">{pub.type}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${pub.status === 'published' ? 'bg-green-100 text-green-700' : pub.status === 'in_development' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                          {pub.status === 'published' ? t.admin.published : pub.status === 'in_development' ? t.admin.inDevelopment : t.admin.draft}
                        </span>
                        {pub.year && <span className="text-xs text-gray-400">{pub.year}</span>}
                      </div>
                      <h3 className="font-medium text-[#0B0F1A] text-sm truncate">{pub.title}</h3>
                      {pub.description && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{pub.description}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleEditPub(pub)} className="p-2 hover:bg-[#2A206B]/10 rounded-lg transition-colors" data-testid={`edit-pub-${pub.id}`}>
                        <Pencil className="w-4 h-4 text-gray-500 hover:text-[#2A206B]" />
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

        {activeTab === 'bookings' && (
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6">{t.admin.bookingsList}</h2>
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
      </div>
    </div>
  );
};

export default Admin;
