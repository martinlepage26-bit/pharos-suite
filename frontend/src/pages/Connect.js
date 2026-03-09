import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const initialForm = {
  name: '',
  email: '',
  organization: '',
  topic: '',
  context: ''
};

const topicOptions = [
  { value: 'procurement', label: 'Procurement or customer questionnaire' },
  { value: 'audit', label: 'Audit or evidence readiness' },
  { value: 'deterministic-governance', label: 'Deterministic governance' },
  { value: 'pre-mortem', label: 'Pre-mortem review' },
  { value: 'post-mortem', label: 'Post-mortem review' },
  { value: 'vendor', label: 'Vendor or third-party review' },
  { value: 'other', label: 'Something else' }
];

const resources = [
  {
    title: 'Deterministic governance review',
    description: 'A first-pass review of governance strength, risk concentration, and the right next service.'
  },
  {
    title: 'Sample evidence packet',
    description: 'A redacted example of what a governance review packet looks like.'
  }
];

const internalModules = [
  {
    title: 'AurorAI',
    description: 'Document intake, extraction, quality gates, and evidence package assembly.'
  },
  {
    title: 'CompassAI',
    description: 'Use-case registry, evidence intake, risk tiering, and governance deliverables.'
  }
];

const Connect = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`PHAROS review request: ${form.topic || 'General inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization}\nTopic: ${form.topic || 'Not specified'}\n\nCurrent state\n${form.context || 'No additional context provided.'}`
    );
    window.location.href = `mailto:consult@govern-ai.ca?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div data-testid="connect-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Connect</p>
            <h1>Start with a 30-minute review</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Enough to understand the pressure, choose between deterministic governance, a pre-mortem, or a post-mortem, and scope the first deliverables.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="connect-grid">
            <div className="reveal">
              <div className="editorial-panel">
                <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Book a review</h2>
                <p className="body-sm" style={{ marginBottom: '32px' }}>Fill in the basics. Martin will follow up with a scoped next step rather than a generic pitch.</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label htmlFor="name">Name *</label>
                    <input id="name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
                  </div>

                  <div className="form-field">
                    <label htmlFor="organization">Organization</label>
                    <input id="organization" name="organization" type="text" placeholder="Company or institution" value={form.organization} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="topic">What brings you here?</label>
                    <select id="topic" name="topic" value={form.topic} onChange={handleChange}>
                      <option value="">Select a topic</option>
                      {topicOptions.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="context">Current state (optional)</label>
                    <textarea
                      id="context"
                      name="context"
                      placeholder="Briefly describe your current governance setup, the pressure you're facing, or what triggered this outreach."
                      value={form.context}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
                    Submit request
                    <ArrowRight />
                  </button>
                </form>

                {submitted ? (
                  <p className="body-sm" style={{ marginTop: '20px' }}>
                    Your mail app should open with the draft ready to send. If it does not, write to <a href="mailto:consult@govern-ai.ca">consult@govern-ai.ca</a>.
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <div className="reveal editorial-panel-dark" style={{ color: '#F5F5F0', marginBottom: '24px' }}>
                <p className="eyebrow" style={{ marginBottom: '12px', color: 'var(--glow-primary)' }}>Direct contact</p>
                <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '4px' }}>
                  <a href="mailto:consult@govern-ai.ca">consult@govern-ai.ca</a>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(245,245,240,0.78)', marginBottom: '20px' }}>Montreal, Quebec, Canada</p>
                <a href="mailto:consult@govern-ai.ca" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send an email
                </a>
                <a href="https://www.linkedin.com/in/martin-lepage-ai/" target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '0.875rem', color: 'rgba(245,245,240,0.82)' }}>
                  Connect on LinkedIn →
                </a>
              </div>

              <div className="reveal editorial-panel">
                <p className="eyebrow" style={{ marginBottom: '16px' }}>Internal Modules</p>
                <p className="body-sm" style={{ marginBottom: '18px' }}>
                  AurorAI and CompassAI stay behind the PHAROS engagement until their hosting, lineage, and review surfaces are ready to be presented directly.
                </p>
                <div className="plain-stack" style={{ marginBottom: '24px' }}>
                  {internalModules.map((item) => (
                    <div
                      key={item.title}
                      className="plain-stack-item"
                    >
                      <p style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: '6px' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="eyebrow" style={{ marginBottom: '16px' }}>Resources</p>
                <div className="plain-stack">
                  {resources.map((item) => (
                    <div key={item.title} className="plain-stack-item">
                      <p style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '4px' }}>{item.title}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/tool" className="reveal link-slab">
                <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted-light)', marginBottom: '8px' }}>
                  Not sure where to start?
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-text)' }}>Take a quick readiness signal</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '8px' }}>
                  Answer eight questions and get a fast signal on where governance needs structure before review asks for it.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Connect;
