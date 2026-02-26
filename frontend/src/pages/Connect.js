import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, FileText, Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ALL_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

const Connect = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('message');
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', lookingFor: '', context: '' });
  const [submitted, setSubmitted] = useState(false);

  // Calendar booking state
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', organization: '', topic: '', currentState: '' });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/bookings/booked-slots`)
      .then(res => res.json())
      .then(data => setBookedSlots(data))
      .catch(() => {});
  }, [bookingSubmitted]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBookingFormChange = (e) => setBookingForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`AI Governance Inquiry: ${formData.lookingFor || 'General'}`);
    const body = encodeURIComponent(`${t.connect.form.name}: ${formData.name}\n${t.connect.form.email}: ${formData.email}\n${t.connect.form.organization}: ${formData.organization}\n\n${t.connect.form.lookingFor}: ${formData.lookingFor}\n\n${t.connect.form.context}:\n${formData.context}`);
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setBookingSubmitting(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingForm.name,
          email: bookingForm.email,
          organization: bookingForm.organization,
          date: dateStr,
          time: selectedTime,
          topic: bookingForm.topic,
          current_state: bookingForm.currentState
        })
      });
      if (res.ok) {
        setBookingSubmitted(true);
        setBookingForm({ name: '', email: '', organization: '', topic: '', currentState: '' });
        setSelectedDate(undefined);
        setSelectedTime('');
      }
    } catch (err) {
      // silent
    }
    setBookingSubmitting(false);
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return ALL_SLOTS;
    const dateStr = selectedDate.toISOString().split('T')[0];
    const bookedTimes = bookedSlots.filter(s => s.date === dateStr).map(s => s.time);
    return ALL_SLOTS.map(slot => ({ time: slot, booked: bookedTimes.includes(slot) }));
  };

  const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;
  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formTopicKeys = ['foundation', 'riskClassification', 'auditReadiness', 'vendorAssessment', 'controlsDesign', 'oversightRetainer', 'other'];
  const topicKeys = ['foundation', 'riskClassification', 'auditReadiness', 'vendorAssessment', 'controlsDesign', 'readinessReview', 'other'];

  const resources = [
    { title: t.connect.resources.auditChecklist, description: t.connect.resources.auditChecklistDesc, icon: FileText },
    { title: t.connect.resources.riskFramework, description: t.connect.resources.riskFrameworkDesc, icon: FileText },
    { title: t.connect.resources.vendorQuestions, description: t.connect.resources.vendorQuestionsDesc, icon: FileText }
  ];

  const handleResourceRequest = (resourceName) => {
    const subject = encodeURIComponent(`Resource Request: ${resourceName}`);
    const body = encodeURIComponent(`I would like to request: ${resourceName}\n\n${t.connect.form.name}: \n${t.connect.form.organization}: \n${t.connect.form.email}: `);
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
  };

  const availableSlots = getAvailableSlots();

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="connect-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title mb-4">{t.connect.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.connect.description}</p>
        <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-8">{t.connect.keywords}</p>

        <div className="flex gap-2 mb-8">
          <button onClick={() => { setActiveTab('message'); setBookingSubmitted(false); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'message' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`} data-testid="tab-message">
            <Mail className="w-4 h-4 inline mr-2" />{t.connect.tabs.message}
          </button>
          <button onClick={() => setActiveTab('booking')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'booking' ? 'bg-[#0D0A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D0A2E]'}`} data-testid="tab-booking">
            <CalendarIcon className="w-4 h-4 inline mr-2" />{t.connect.tabs.booking}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {activeTab === 'message' ? (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0D0A2E]/10 flex items-center justify-center"><Mail className="w-5 h-5 text-[#0D0A2E]" /></div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#0B0F1A]">{t.connect.messageTitle}</h2>
                    <p className="text-sm text-gray-500">{t.connect.messageSubtitle}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.name} *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="input-name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.email} *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="input-email" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.organization}</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.lookingFor}</label>
                    <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="input-looking-for">
                      <option value="">{t.connect.form.selectTopic}</option>
                      {formTopicKeys.map(key => <option key={key} value={t.connect.formTopics[key]}>{t.connect.formTopics[key]}</option>)}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.context}</label>
                    <textarea name="context" value={formData.context} onChange={handleChange} placeholder={t.connect.form.contextPlaceholder} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none resize-none" data-testid="input-context" />
                  </div>
                  <button type="submit" className="btn-primary flex items-center gap-2" data-testid="submit-btn">
                    {submitted ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {submitted ? t.connect.form.opening : t.connect.form.submit}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card" data-testid="booking-calendar-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0D0A2E]/10 flex items-center justify-center"><CalendarIcon className="w-5 h-5 text-[#0D0A2E]" /></div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#0B0F1A]">{t.bookingCalendar.title}</h2>
                    <p className="text-sm text-gray-500">{t.bookingCalendar.subtitle}</p>
                  </div>
                </div>

                {bookingSubmitted ? (
                  <div className="text-center py-8" data-testid="booking-confirmation">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-2">{t.bookingCalendar.confirmation}</h3>
                    <button onClick={() => setBookingSubmitted(false)} className="mt-4 text-[#0D0A2E] font-medium hover:underline text-sm">
                      {language === 'fr' ? 'Nouvelle r\u00e9servation' : 'Book another'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Calendar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.bookingCalendar.selectDate}</label>
                        <div className="border border-gray-200 rounded-xl p-1 inline-block" data-testid="booking-calendar">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => { setSelectedDate(date); setSelectedTime(''); }}
                            disabled={(date) => isPast(date) || isWeekend(date)}
                            className="rounded-md"
                          />
                        </div>
                      </div>

                      {/* Time slots */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.bookingCalendar.selectTime}
                          {selectedDate && (
                            <span className="text-gray-400 font-normal ml-2">
                              {selectedDate.toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </label>
                        {selectedDate ? (
                          <div className="grid grid-cols-2 gap-2" data-testid="time-slots">
                            {availableSlots.map((slot) => {
                              const time = typeof slot === 'string' ? slot : slot.time;
                              const isBooked = typeof slot === 'object' && slot.booked;
                              return (
                                <button
                                  key={time}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => setSelectedTime(time)}
                                  data-testid={`time-slot-${time.replace(/[: ]/g, '-')}`}
                                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                                    isBooked
                                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                      : selectedTime === time
                                        ? 'bg-[#0D0A2E] text-white border-[#0D0A2E]'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#0D0A2E] hover:text-[#0D0A2E]'
                                  }`}
                                >
                                  {time}
                                  {isBooked && <span className="block text-xs">{t.bookingCalendar.booked}</span>}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm py-8">
                            <CalendarIcon className="w-5 h-5 mr-2" />
                            {t.bookingCalendar.selectDate}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2"><Clock className="w-3 h-3 inline mr-1" />{t.bookingCalendar.eastern}</p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="font-medium text-[#0B0F1A] mb-4">{t.bookingCalendar.yourDetails}</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.bookingCalendar.name} *</label>
                          <input type="text" name="name" value={bookingForm.name} onChange={handleBookingFormChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="booking-name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.bookingCalendar.email} *</label>
                          <input type="email" name="email" value={bookingForm.email} onChange={handleBookingFormChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="booking-email" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.bookingCalendar.organization}</label>
                        <input type="text" name="organization" value={bookingForm.organization} onChange={handleBookingFormChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="booking-org" />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.bookingCalendar.topic}</label>
                        <select name="topic" value={bookingForm.topic} onChange={handleBookingFormChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none" data-testid="booking-topic">
                          <option value="">{t.bookingCalendar.selectTopic}</option>
                          {topicKeys.map(key => <option key={key} value={t.connect.topics[key]}>{t.connect.topics[key]}</option>)}
                        </select>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.bookingCalendar.currentState}</label>
                        <textarea name="currentState" value={bookingForm.currentState} onChange={handleBookingFormChange} placeholder={t.bookingCalendar.currentStatePlaceholder} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0D0A2E] focus:outline-none resize-none" data-testid="booking-state" />
                      </div>
                      <button
                        type="submit"
                        disabled={!selectedDate || !selectedTime || !bookingForm.name || !bookingForm.email || bookingSubmitting}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="booking-submit-btn"
                      >
                        <CalendarIcon className="w-4 h-4" />
                        {bookingSubmitting ? t.bookingCalendar.submitting : t.bookingCalendar.submit}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#0B0F1A]">{t.connect.resources.title}</h3>
            {resources.map((resource, index) => (
              <div key={index} className="card card-hover" data-testid={`resource-${index}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0"><resource.icon className="w-4 h-4 text-[#0D0A2E]" /></div>
                  <div>
                    <h4 className="font-medium text-[#0B0F1A] text-sm mb-1">{resource.title}</h4>
                    <p className="text-gray-500 text-xs mb-2">{resource.description}</p>
                    <button onClick={() => handleResourceRequest(resource.title)} className="text-[#0D0A2E] font-medium text-xs hover:underline">{t.connect.resources.request}</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-[#0D0A2E]/5 rounded-xl border border-[#0D0A2E]/20 mt-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#0B0F1A]">{t.connect.resources.directContact}</span><br />
                <a href="mailto:martin@martinlepage.com" className="text-[#0D0A2E] hover:underline">martin@martinlepage.com</a>
              </p>
            </div>
            <Link to="/tool" className="block p-4 bg-[#0D0A2E] text-white rounded-xl hover:bg-[#0D0A2E] transition-colors">
              <p className="font-semibold mb-1">{t.connect.resources.notSure}</p>
              <p className="text-sm text-white/80">{t.connect.resources.takeSnapshot}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
