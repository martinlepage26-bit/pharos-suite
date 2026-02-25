import { useState } from 'react';
import { Link } from 'react-router-dom';

const Connect = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lookingFor: '',
    context: ''
  });

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
    window.location.href = `mailto:contact@martinlepage.com?subject=${subject}&body=${body}`;
  };

  const resources = [
    {
      title: "AI Governance Audit Checklist (PDF)",
      description: "Evidence list + stakeholder questions: what good looks like under review.",
      cta: "Request"
    },
    {
      title: "Procurement Readiness Pack (Templates)",
      description: "RACI, control register, model inventory fields, vendor review questions.",
      cta: "Request"
    },
    {
      title: "30min Readiness Debrief",
      description: "Review your readiness score and leave with a clear control roadmap.",
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
            <form onSubmit={handleSubmit} data-testid="contact-form">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#1a2744] focus:outline-none"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Work email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#1a2744] focus:outline-none"
                    data-testid="input-email"
                  />
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  placeholder="What are you looking for?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#1a2744] focus:outline-none"
                  data-testid="input-looking-for"
                />
              </div>
              <div className="mb-6">
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleChange}
                  placeholder="Brief context (optional): AI use cases, stakeholders involved, timeline"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#1a2744] focus:outline-none resize-none"
                  data-testid="input-context"
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full md:w-auto"
                data-testid="submit-btn"
              >
                Open email draft
              </button>
              <p className="text-gray-500 text-xs mt-3">
                This form opens an email draft in your default mail app (no data is stored on this site).
              </p>
            </form>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="card" data-testid={`resource-${index}`}>
                <h3 className="font-serif text-lg font-semibold text-[#1a2744] mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                {resource.cta === 'Book' ? (
                  <Link to="/tool" className="text-[#1a2744] font-medium hover:underline text-sm">
                    {resource.cta}
                  </Link>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    className="text-[#1a2744] font-medium hover:underline text-sm"
                  >
                    {resource.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
