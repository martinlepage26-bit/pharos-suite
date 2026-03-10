import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SignalStrip from '../components/SignalStrip';

const initialForm = {
  name: '',
  email: '',
  organization: '',
  topic: '',
  context: ''
};

const CONNECT_COPY = {
  en: {
    eyebrow: 'Connect',
    heroTitle: 'Start with a 30-minute review',
    heroBody: 'Enough to understand the pressure, choose between deterministic governance, a pre-mortem, or a post-mortem, and scope the first deliverables.',
    summary: [
      {
        label: 'Best for',
        title: 'Early review calibration',
        description: 'Use this page when scrutiny is coming or when a questionnaire, audit, or internal review has already exposed a gap.'
      },
      {
        label: 'Bring',
        title: 'System, pressure source, and evidence state',
        description: 'A useful first conversation starts with what is in scope, what triggered the review, and what proof already exists.'
      },
      {
        label: 'Leave with',
        title: 'A scoped next step',
        description: 'The outcome is a clearer route into deterministic governance, a pre-mortem, or a post-mortem.'
      }
    ],
    formTitle: 'Book a review',
    formBody: 'Fill in the basics. Martin will follow up with a scoped next step rather than a generic pitch.',
    prepLabel: 'Before you submit',
    prepTitle: 'The fastest way to make the first review useful',
    prepItems: [
      'Name the system, workflow, or use case in question.',
      'Name the pressure source: procurement, audit, vendor review, launch, or incident response.',
      'If evidence, documentation, or a failed review already exists, say that up front.'
    ],
    name: 'Name *',
    namePlaceholder: 'Your full name',
    email: 'Email *',
    emailPlaceholder: 'you@company.com',
    organization: 'Organization',
    organizationPlaceholder: 'Company or institution',
    topic: 'What brings you here?',
    topicPlaceholder: 'Select a topic',
    context: 'Current state (optional)',
    contextPlaceholder: "Briefly describe your current governance setup, the pressure you're facing, or what triggered this outreach.",
    submit: 'Submit request',
    submitted: 'Your mail app should open with the draft ready to send. If it does not, write to consult@govern-ai.ca.',
    directContact: 'Direct contact',
    directBody: 'If email is easier, send the same basics directly.',
    sendEmail: 'Send an email',
    linkedin: 'Connect on LinkedIn',
    internalModules: 'Internal modules',
    internalBody: 'AurorAI and CompassAI stay behind the PHAROS engagement until their hosting, lineage, and review surfaces are ready to be presented directly.',
    resources: 'Resources',
    startPrompt: 'Not sure where to start?',
    startTitle: 'Take a quick readiness signal',
    startBody: 'Answer eight questions and get a fast signal on where governance needs structure before review asks for it.',
    location: 'Montreal, Quebec, Canada',
    subject: 'PHAROS review request',
    generalInquiry: 'General inquiry',
    currentState: 'Current state',
    noContext: 'No additional context provided.',
    topics: [
      { value: 'procurement', label: 'Procurement or customer questionnaire' },
      { value: 'audit', label: 'Audit or evidence readiness' },
      { value: 'deterministic-governance', label: 'Deterministic governance' },
      { value: 'pre-mortem', label: 'Pre-mortem review' },
      { value: 'post-mortem', label: 'Post-mortem review' },
      { value: 'vendor', label: 'Vendor or third-party review' },
      { value: 'other', label: 'Something else' }
    ],
    resourcesList: [
      {
        title: 'Deterministic governance review',
        description: 'A first-pass review of governance strength, risk concentration, and the right next service.'
      },
      {
        title: 'Sample evidence packet',
        description: 'A redacted example of what a governance review packet looks like.'
      }
    ],
    modulesList: [
      {
        title: 'AurorAI',
        description: 'Document intake, extraction, quality gates, and evidence package assembly.'
      },
      {
        title: 'CompassAI',
        description: 'Use-case registry, evidence intake, risk tiering, and governance deliverables.'
      }
    ]
  },
  fr: {
    eyebrow: 'Contact',
    heroTitle: 'Commencez par un échange de 30 minutes',
    heroBody: 'Assez pour comprendre la pression en cause, choisir entre une gouvernance déterministe, une revue pré-mortem ou une revue post-mortem, puis cadrer les premiers livrables.',
    summary: [
      {
        label: 'Pour qui',
        title: 'Le cadrage initial de la revue',
        description: 'Utilisez cette page quand un examen approche ou quand un questionnaire, un audit ou une revue interne a deja revele un ecart.'
      },
      {
        label: 'Apportez',
        title: 'Systeme, source de pression et etat de la preuve',
        description: 'Un premier echange utile commence par ce qui est en portee, ce qui a declenche la revue et quelle preuve existe deja.'
      },
      {
        label: 'Vous repartez avec',
        title: 'Une prochaine etape cadree',
        description: 'Le resultat est un parcours plus net vers une gouvernance deterministe, une revue pre-mortem ou une revue post-mortem.'
      }
    ],
    formTitle: 'Réserver un échange',
    formBody: 'Donnez l’essentiel. Martin fera un suivi avec une prochaine étape cadrée plutôt qu’un discours générique.',
    prepLabel: 'Avant l’envoi',
    prepTitle: 'La façon la plus rapide de rendre le premier échange utile',
    prepItems: [
      'Nommez le système, le workflow ou le cas d’usage en question.',
      'Nommez la source de pression : approvisionnement, audit, revue fournisseur, lancement ou réponse à incident.',
      'Si de la preuve, de la documentation ou un examen raté existent déjà, dites-le d’emblée.'
    ],
    name: 'Nom *',
    namePlaceholder: 'Votre nom complet',
    email: 'Courriel *',
    emailPlaceholder: 'vous@organisation.ca',
    organization: 'Organisation',
    organizationPlaceholder: 'Entreprise ou institution',
    topic: 'Quel est votre besoin ?',
    topicPlaceholder: 'Choisir un sujet',
    context: 'Contexte actuel (facultatif)',
    contextPlaceholder: 'Décrivez brièvement votre dispositif actuel de gouvernance, la pression à laquelle vous faites face ou ce qui a déclenché la prise de contact.',
    submit: 'Envoyer la demande',
    submitted: 'Votre application de courriel devrait s’ouvrir avec le brouillon prêt à envoyer. Sinon, écrivez à consult@govern-ai.ca.',
    directContact: 'Contact direct',
    directBody: 'Si le courriel est plus simple, envoyez directement les mêmes éléments.',
    sendEmail: 'Envoyer un courriel',
    linkedin: 'Écrire sur LinkedIn',
    internalModules: 'Modules internes',
    internalBody: 'AurorAI et CompassAI demeurent derrière l’engagement PHAROS tant que leur hébergement, leur chaîne de preuve et leurs surfaces de révision ne sont pas prêts à être présentés directement.',
    resources: 'Ressources',
    startPrompt: 'Vous ne savez pas par où commencer ?',
    startTitle: 'Obtenez un signal rapide de préparation',
    startBody: 'Répondez à huit questions et obtenez un signal rapide sur l’endroit où la gouvernance a besoin de structure avant qu’un examen ne la réclame.',
    location: 'Montréal, Québec, Canada',
    subject: 'Demande de revue PHAROS',
    generalInquiry: 'Demande générale',
    currentState: 'Contexte actuel',
    noContext: 'Aucun contexte additionnel fourni.',
    topics: [
      { value: 'procurement', label: 'Approvisionnement ou questionnaire client' },
      { value: 'audit', label: 'Audit ou préparation probante' },
      { value: 'deterministic-governance', label: 'Gouvernance déterministe' },
      { value: 'pre-mortem', label: 'Revue pré-mortem' },
      { value: 'post-mortem', label: 'Revue post-mortem' },
      { value: 'vendor', label: 'Revue fournisseur ou tierce partie' },
      { value: 'other', label: 'Autre besoin' }
    ],
    resourcesList: [
      {
        title: 'Revue de gouvernance déterministe',
        description: 'Une première lecture de la solidité de la gouvernance, de la concentration du risque et du bon prochain service.'
      },
      {
        title: 'Exemple de dossier de preuve',
        description: 'Un exemple caviardé de ce à quoi ressemble un dossier de revue de gouvernance.'
      }
    ],
    modulesList: [
      {
        title: 'AurorAI',
        description: 'Accueil documentaire, extraction, portes qualité et assemblage de dossiers de preuve.'
      },
      {
        title: 'CompassAI',
        description: 'Registre des cas d’usage, réception de la preuve, hiérarchisation du risque et livrables de gouvernance.'
      }
    ]
  }
};

const Connect = () => {
  const { language } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const copy = useMemo(() => CONNECT_COPY[language], [language]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${copy.subject}: ${form.topic || copy.generalInquiry}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization}\nTopic: ${form.topic || copy.generalInquiry}\n\n${copy.currentState}\n${form.context || copy.noContext}`
    );
    window.location.href = `mailto:consult@govern-ai.ca?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div data-testid="connect-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.heroTitle}</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              {copy.heroBody}
            </p>
            <SignalStrip items={copy.summary} className="signal-grid-page" />
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="connect-grid">
            <div className="reveal">
              <div className="editorial-panel">
                <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{copy.formTitle}</h2>
                <p className="body-sm" style={{ marginBottom: '32px' }}>{copy.formBody}</p>
                <div className="scope-note" style={{ marginBottom: '28px' }}>
                  <p className="eyebrow" style={{ marginBottom: '12px' }}>{copy.prepLabel}</p>
                  <strong>{copy.prepTitle}</strong>
                  <ul className="panel-list">
                    {copy.prepItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label htmlFor="name">{copy.name}</label>
                    <input id="name" name="name" type="text" placeholder={copy.namePlaceholder} value={form.name} onChange={handleChange} required />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">{copy.email}</label>
                    <input id="email" name="email" type="email" placeholder={copy.emailPlaceholder} value={form.email} onChange={handleChange} required />
                  </div>

                  <div className="form-field">
                    <label htmlFor="organization">{copy.organization}</label>
                    <input id="organization" name="organization" type="text" placeholder={copy.organizationPlaceholder} value={form.organization} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="topic">{copy.topic}</label>
                    <select id="topic" name="topic" value={form.topic} onChange={handleChange}>
                      <option value="">{copy.topicPlaceholder}</option>
                      {copy.topics.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="context">{copy.context}</label>
                    <textarea
                      id="context"
                      name="context"
                      placeholder={copy.contextPlaceholder}
                      value={form.context}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
                    {copy.submit}
                    <ArrowRight />
                  </button>
                </form>

                {submitted ? (
                  <p className="body-sm" style={{ marginTop: '20px' }}>
                    {copy.submitted.split('consult@govern-ai.ca')[0]}
                    <a href="mailto:consult@govern-ai.ca">consult@govern-ai.ca</a>
                    {copy.submitted.split('consult@govern-ai.ca')[1]}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <div className="reveal editorial-panel-dark" style={{ color: '#F5F5F0', marginBottom: '24px' }}>
                <p className="eyebrow" style={{ marginBottom: '12px', color: 'var(--glow-primary)' }}>{copy.directContact}</p>
                <p className="body-sm" style={{ color: 'rgba(245,245,240,0.78)', marginBottom: '16px' }}>
                  {copy.directBody}
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '4px' }}>
                  <a href="mailto:consult@govern-ai.ca">consult@govern-ai.ca</a>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(245,245,240,0.78)', marginBottom: '20px' }}>{copy.location}</p>
                <a href="mailto:consult@govern-ai.ca" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {copy.sendEmail}
                </a>
                <a href="https://www.linkedin.com/in/martin-lepage-ai/" target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '0.875rem', color: 'rgba(245,245,240,0.82)' }}>
                  {copy.linkedin} →
                </a>
              </div>

              <div className="reveal editorial-panel">
                <p className="eyebrow" style={{ marginBottom: '16px' }}>{copy.internalModules}</p>
                <p className="body-sm" style={{ marginBottom: '18px' }}>
                  {copy.internalBody}
                </p>
                <div className="plain-stack" style={{ marginBottom: '24px' }}>
                  {copy.modulesList.map((item) => (
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

                <p className="eyebrow" style={{ marginBottom: '16px' }}>{copy.resources}</p>
                <div className="plain-stack">
                  {copy.resourcesList.map((item) => (
                    <div key={item.title} className="plain-stack-item">
                      <p style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '4px' }}>{item.title}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/tool" className="reveal link-slab">
                <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted-light)', marginBottom: '8px' }}>
                  {copy.startPrompt}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-text)' }}>{copy.startTitle}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '8px' }}>
                  {copy.startBody}
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
