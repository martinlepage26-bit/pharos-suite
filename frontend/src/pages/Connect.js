import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, FileText, Calendar, CheckCircle } from 'lucide-react';

const Connect = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lookingFor: '',
    context: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`AI Governance Inquiry: ${formData.lookingFor || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nLooking for: ${formData.lookingFor}\n\nContext:\n${formData.context}`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleResourceRequest = (resourceName) => {
    const subject = encodeURIComponent(`Resource Request: ${resourceName}`);
    const body = encodeURIComponent(
      `I would like to request: ${resourceName}\n\nName: ${formData.name || '[Your name]'}\nEmail: ${formData.email || '[Your email]'}\n\nContext:\n[Brief description of your needs]`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
  };

  const resources = [
    {
      title: "AI Governance Audit Checklist (PDF)",
      description: "Evidence list + stakeholder questions: what good looks like under review.",
      icon: FileText,
      cta: "Request"
    },
    {
      title: "Procurement Readiness Pack (Templates)",
      description: "RACI, control register, model inventory fields, vendor review questions.",
      icon: FileText,
      cta: "Request"
    },
    {
      title: "30min Readiness Debrief",
      description: "Review your readiness score and leave with a clear control roadmap.",
      icon: Calendar,
      cta: "Book"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="connect-page">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">
          Connect
        </h1>
        <p className="text-gray-600 mb-2 max-w-2xl">
          Governance advisory, audit/procurement readiness, or a short readiness debrief.
        </p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">
          DEBRIEFS · TEMPLATES · ADVISORY
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#6366f1]" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#1a2744]">Send a message</h2>
            </div>

            <form onSubmit={handleSubmit} data-testid="contact-form">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none transition-colors"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Work email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none transition-colors"
                    data-testid="input-email"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">What are you looking for?</label>
                <input
                  type="text"
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  placeholder="e.g., Governance foundation, audit readiness, vendor review"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none transition-colors"
                  data-testid="input-looking-for"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Context (optional)</label>
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleChange}
                  placeholder="AI use cases, stakeholders involved, timeline, specific concerns..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none transition-colors"
                  data-testid="input-context"
                />
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                data-testid="submit-btn"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Opening email client...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Open email draft
                  </>
                )}
              </button>
              
              <p className="text-gray-500 text-xs mt-3 flex items-start gap-2">
                <span className="text-[#6366f1]">↗</span>
                This form opens your default email app with a pre-filled message. No data is stored on this site.
              </p>
            </form>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4">Resources</h2>
            {resources.map((resource, index) => (
              <div key={index} className="card card-hover" data-testid={`resource-${index}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <resource.icon className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a2744] mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {resource.description}
                    </p>
                    {resource.cta === 'Book' ? (
                      <Link 
                        to="/tool" 
                        className="text-[#6366f1] font-medium hover:underline text-sm inline-flex items-center gap-1"
                      >
                        Take readiness assessment first →
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleResourceRequest(resource.title)}
                        className="text-[#6366f1] font-medium hover:underline text-sm"
                      >
                        {resource.cta} via email →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Direct email option */}
            <div className="p-4 bg-[#6366f1]/5 rounded-xl border border-[#6366f1]/20">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#1a2744]">Prefer direct contact?</span><br />
                Email: <a href="mailto:martin@martinlepage.com" className="text-[#6366f1] hover:underline">martin@martinlepage.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
