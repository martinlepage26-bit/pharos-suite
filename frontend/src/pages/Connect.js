import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Connect = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('message');
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', lookingFor: '', context: '' });
  const [bookingData, setBookingData] = useState({ name: '', email: '', organization: '', preferredDate: '', preferredTime: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, topic: '', currentState: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBookingChange = (e) => setBookingData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`AI Governance Inquiry: ${formData.lookingFor || 'General'}`);
    const body = encodeURIComponent(`${t.connect.form.name}: ${formData.name}\n${t.connect.form.email}: ${formData.email}\n${t.connect.form.organization}: ${formData.organization}\n\n${t.connect.form.lookingFor}: ${formData.lookingFor}\n\n${t.connect.form.context}:\n${formData.context}`);
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Governance Debrief Request: ${bookingData.topic}`);
    const body = encodeURIComponent(
      `BOOKING REQUEST - 30 Minute Governance Debrief\n\n${t.connect.form.name}: ${bookingData.name}\n${t.connect.form.email}: ${bookingData.email}\n${t.connect.form.organization}: ${bookingData.organization}\n\nPREFERRED TIME\nDate: ${bookingData.preferredDate}\nTime: ${bookingData.preferredTime}\nTimezone: ${bookingData.timezone}\n\nDISCUSSION TOPIC\n${bookingData.topic}\n\nCURRENT STATE\n${bookingData.currentState}`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const topicKeys = ['foundation', 'riskClassification', 'auditReadiness', 'vendorAssessment', 'controlsDesign', 'readinessReview', 'other'];
  const formTopicKeys = ['foundation', 'riskClassification', 'auditReadiness', 'vendorAssessment', 'controlsDesign', 'oversightRetainer', 'other'];
  const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

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

  const getMinDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="connect-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">{t.connect.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.connect.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">{t.connect.keywords}</p>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveTab('message')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'message' ? 'bg-[#6366f1] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6366f1]'}`} data-testid="tab-message">
            <Mail className="w-4 h-4 inline mr-2" />{t.connect.tabs.message}
          </button>
          <button onClick={() => setActiveTab('booking')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'booking' ? 'bg-[#6366f1] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6366f1]'}`} data-testid="tab-booking">
            <Calendar className="w-4 h-4 inline mr-2" />{t.connect.tabs.booking}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {activeTab === 'message' ? (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center"><Mail className="w-5 h-5 text-[#6366f1]" /></div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1a2744]">{t.connect.messageTitle}</h2>
                    <p className="text-sm text-gray-500">{t.connect.messageSubtitle}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.name} *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" data-testid="input-name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.email} *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" data-testid="input-email" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.organization}</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.lookingFor}</label>
                    <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" data-testid="input-looking-for">
                      <option value="">{t.connect.form.selectTopic}</option>
                      {formTopicKeys.map(key => <option key={key} value={t.connect.formTopics[key]}>{t.connect.formTopics[key]}</option>)}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.context}</label>
                    <textarea name="context" value={formData.context} onChange={handleChange} placeholder={t.connect.form.contextPlaceholder} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none" data-testid="input-context" />
                  </div>
                  <button type="submit" className="btn-primary flex items-center gap-2" data-testid="submit-btn">
                    {submitted ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {submitted ? t.connect.form.opening : t.connect.form.submit}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-[#6366f1]" /></div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1a2744]">{t.connect.booking.title}</h2>
                    <p className="text-sm text-gray-500">{t.connect.booking.subtitle}</p>
                  </div>
                </div>
                <form onSubmit={handleBookingSubmit} data-testid="booking-form">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.name} *</label>
                      <input type="text" name="name" value={bookingData.name} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.email} *</label>
                      <input type="email" name="email" value={bookingData.email} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.form.organization} *</label>
                    <input type="text" name="organization" value={bookingData.organization} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1"><Clock className="w-4 h-4 inline mr-1" />{t.connect.booking.preferredDate} *</label>
                      <input type="date" name="preferredDate" value={bookingData.preferredDate} onChange={handleBookingChange} min={getMinDate()} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.booking.preferredTime} *</label>
                      <select name="preferredTime" value={bookingData.preferredTime} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none">
                        <option value="">{t.connect.booking.selectTime}</option>
                        {timeSlots.map(slot => <option key={slot} value={slot}>{slot} (Eastern)</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.booking.topic} *</label>
                    <select name="topic" value={bookingData.topic} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none">
                      <option value="">{t.connect.booking.selectTopic}</option>
                      {topicKeys.map(key => <option key={key} value={t.connect.topics[key]}>{t.connect.topics[key]}</option>)}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.connect.booking.currentState}</label>
                    <textarea name="currentState" value={bookingData.currentState} onChange={handleBookingChange} placeholder={t.connect.booking.currentStatePlaceholder} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none" />
                  </div>
                  <button type="submit" className="btn-primary flex items-center gap-2" data-testid="booking-submit-btn">
                    {submitted ? <CheckCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    {submitted ? t.connect.form.opening : t.connect.booking.requestSlot}
                  </button>
                  <p className="text-gray-500 text-xs mt-3">{t.connect.booking.confirmation}</p>
                </form>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#1a2744]">{t.connect.resources.title}</h3>
            {resources.map((resource, index) => (
              <div key={index} className="card card-hover" data-testid={`resource-${index}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0"><resource.icon className="w-4 h-4 text-[#6366f1]" /></div>
                  <div>
                    <h4 className="font-medium text-[#1a2744] text-sm mb-1">{resource.title}</h4>
                    <p className="text-gray-500 text-xs mb-2">{resource.description}</p>
                    <button onClick={() => handleResourceRequest(resource.title)} className="text-[#6366f1] font-medium text-xs hover:underline">{t.connect.resources.request}</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-[#6366f1]/5 rounded-xl border border-[#6366f1]/20 mt-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#1a2744]">{t.connect.resources.directContact}</span><br />
                <a href="mailto:martin@martinlepage.com" className="text-[#6366f1] hover:underline">martin@martinlepage.com</a>
              </p>
            </div>
            <Link to="/tool" className="block p-4 bg-[#1a2744] text-white rounded-xl hover:bg-[#6366f1] transition-colors">
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
