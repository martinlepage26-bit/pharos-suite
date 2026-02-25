import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, FileText, Calendar, CheckCircle, Clock, User } from 'lucide-react';

const Connect = () => {
  const [activeTab, setActiveTab] = useState('message');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    lookingFor: '',
    context: ''
  });
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    organization: '',
    preferredDate: '',
    preferredTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    topic: '',
    currentState: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBookingChange = (e) => {
    setBookingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`AI Governance Inquiry: ${formData.lookingFor || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\n\nLooking for: ${formData.lookingFor}\n\nContext:\n${formData.context}`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Governance Debrief Request: ${bookingData.topic}`);
    const body = encodeURIComponent(
      `BOOKING REQUEST - 30 Minute Governance Debrief\n\n` +
      `Name: ${bookingData.name}\n` +
      `Email: ${bookingData.email}\n` +
      `Organization: ${bookingData.organization}\n\n` +
      `PREFERRED TIME\n` +
      `Date: ${bookingData.preferredDate}\n` +
      `Time: ${bookingData.preferredTime}\n` +
      `Timezone: ${bookingData.timezone}\n\n` +
      `DISCUSSION TOPIC\n` +
      `${bookingData.topic}\n\n` +
      `CURRENT STATE\n` +
      `${bookingData.currentState}`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const topics = [
    'Governance Foundation Setup',
    'Risk Classification & Tiering',
    'Audit/Procurement Readiness',
    'Vendor AI Assessment',
    'Controls & Evidence Design',
    'Readiness Score Review',
    'Other'
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const resources = [
    {
      title: "AI Governance Audit Checklist",
      description: "Evidence requirements and stakeholder questions for audit readiness.",
      icon: FileText
    },
    {
      title: "Risk Tiering Framework Template",
      description: "Classification criteria for AI use cases by impact and sensitivity.",
      icon: FileText
    },
    {
      title: "Vendor AI Review Questions",
      description: "Due diligence questionnaire for third-party AI procurement.",
      icon: FileText
    }
  ];

  const handleResourceRequest = (resourceName) => {
    const subject = encodeURIComponent(`Resource Request: ${resourceName}`);
    const body = encodeURIComponent(
      `I would like to request: ${resourceName}\n\nName: \nOrganization: \nEmail: \n\nContext: [Brief description of your governance needs]`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="connect-page">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">
          Connect
        </h1>
        <p className="text-gray-600 mb-2 max-w-2xl">
          AI governance advisory, audit and procurement readiness assessment, or a focused debrief on your governance posture.
        </p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">
          ADVISORY · ASSESSMENT · DEBRIEF
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('message')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'message'
                ? 'bg-[#6366f1] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6366f1]'
            }`}
            data-testid="tab-message"
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Send Message
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'booking'
                ? 'bg-[#6366f1] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6366f1]'
            }`}
            data-testid="tab-booking"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Book Debrief
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="md:col-span-2">
            {activeTab === 'message' ? (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1a2744]">Send a message</h2>
                    <p className="text-sm text-gray-500">General inquiries about AI governance services</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">What are you looking for?</label>
                    <select
                      name="lookingFor"
                      value={formData.lookingFor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                      data-testid="input-looking-for"
                    >
                      <option value="">Select a topic...</option>
                      <option value="Governance Foundation">Governance Foundation Setup</option>
                      <option value="Risk Classification">Risk Classification & Tiering</option>
                      <option value="Audit Readiness">Audit/Procurement Readiness</option>
                      <option value="Vendor Assessment">Vendor AI Assessment</option>
                      <option value="Controls Design">Controls & Evidence Design</option>
                      <option value="Oversight Retainer">Ongoing Oversight Retainer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                    <textarea
                      name="context"
                      value={formData.context}
                      onChange={handleChange}
                      placeholder="AI use cases in scope, governance maturity, audit timelines, specific concerns..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none"
                      data-testid="input-context"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    data-testid="submit-btn"
                  >
                    {submitted ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {submitted ? 'Opening email...' : 'Open email draft'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1a2744]">Book a 30-Minute Debrief</h2>
                    <p className="text-sm text-gray-500">Focused discussion on your AI governance posture</p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} data-testid="booking-form">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={bookingData.name}
                        onChange={handleBookingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleBookingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                    <input
                      type="text"
                      name="organization"
                      value={bookingData.organization}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={bookingData.preferredDate}
                        onChange={handleBookingChange}
                        min={getMinDate()}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                      <select
                        name="preferredTime"
                        value={bookingData.preferredTime}
                        onChange={handleBookingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                      >
                        <option value="">Select time...</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot} (Eastern)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Topic *</label>
                    <select
                      name="topic"
                      value={bookingData.topic}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                    >
                      <option value="">Select topic...</option>
                      {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Governance State</label>
                    <textarea
                      name="currentState"
                      value={bookingData.currentState}
                      onChange={handleBookingChange}
                      placeholder="Brief description: Do you have an AI inventory? Risk tiers? Existing controls? Upcoming audits?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    data-testid="booking-submit-btn"
                  >
                    {submitted ? <CheckCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    {submitted ? 'Opening email...' : 'Request this time slot'}
                  </button>

                  <p className="text-gray-500 text-xs mt-3">
                    I'll confirm availability within 24 hours. Times shown in Eastern timezone.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#1a2744]">Governance Resources</h3>
            {resources.map((resource, index) => (
              <div key={index} className="card card-hover" data-testid={`resource-${index}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <resource.icon className="w-4 h-4 text-[#6366f1]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a2744] text-sm mb-1">{resource.title}</h4>
                    <p className="text-gray-500 text-xs mb-2">{resource.description}</p>
                    <button 
                      onClick={() => handleResourceRequest(resource.title)}
                      className="text-[#6366f1] font-medium text-xs hover:underline"
                    >
                      Request →
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-[#6366f1]/5 rounded-xl border border-[#6366f1]/20 mt-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#1a2744]">Direct contact</span><br />
                <a href="mailto:martin@martinlepage.com" className="text-[#6366f1] hover:underline">martin@martinlepage.com</a>
              </p>
            </div>

            <Link 
              to="/tool" 
              className="block p-4 bg-[#1a2744] text-white rounded-xl hover:bg-[#6366f1] transition-colors"
            >
              <p className="font-semibold mb-1">Not sure where to start?</p>
              <p className="text-sm text-white/80">Take the Readiness Snapshot →</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
