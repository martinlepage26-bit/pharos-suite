import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_ASSURANCE_META } from '../data/publicAssurance';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const initialForm = {
  name: '',
  email: '',
  organization: '',
  date: '',
  time: '',
  topic: '',
  context: ''
};

const BOOKING_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

const CONNECT_COPY = {
  en: {
    eyebrow: 'Connect',
    heroTitle: 'Start with a 30-minute review',
    heroBody: 'Enough to understand the pressure, choose between deterministic governance, a pre-mortem, or a post-mortem, and scope the first deliverables.',
    summaryRegionLabel: 'Review summary',
    summary: [
      {
        label: 'Best for',
        title: 'Early review calibration',
        description: 'Use this page when scrutiny is coming or when a questionnaire, audit, or internal review has already exposed a gap.',
        detailTitle: 'Use the first review when the route is still unclear.',
        detailPoints: [
          'A questionnaire, audit, or internal review has already exposed a gap.',
          'You need to scope the work before governance effort sprawls or stalls.',
          'You want a concrete first move instead of generic AI-governance language.'
        ]
      },
      {
        label: 'Bring',
        title: 'System, pressure source, and evidence state',
        description: 'A useful first conversation starts with what is in scope, what triggered the review, and what proof already exists.',
        detailTitle: 'Come with the operating facts, not a polished narrative.',
        detailPoints: [
          'Name the system, workflow, or use case that is in scope.',
          'State what triggered the review: procurement, audit, vendor review, launch, or incident response.',
          'Note what documentation, evidence, or failed review already exists.'
        ]
      },
      {
        label: 'Leave with',
        title: 'A scoped next step',
        description: 'The outcome is a clearer route into deterministic governance, a pre-mortem, or a post-mortem.',
        detailTitle: 'Leave with the right path and the first deliverables in view.',
        detailPoints: [
          'A route into deterministic governance when the baseline needs structure.',
          'A pre-mortem when launch or onboarding risk needs pressure before exposure.',
          'A post-mortem when the work starts after an incident, failed review, or drift.'
        ]
      }
    ],
    formTitle: 'Book a review',
    formBody: 'Request a 30-minute review online. Martin will confirm the slot or suggest an adjacent option rather than sending a generic pitch.',
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
    date: 'Preferred date *',
    datePlaceholder: 'Choose a date',
    time: 'Preferred time *',
    timePlaceholder: 'Select a time',
    noSlotsAvailable: 'No open request slots remain for this date.',
    loadingSlots: 'Loading current availability...',
    topic: 'What brings you here?',
    topicPlaceholder: 'Select a topic',
    context: 'Current state (optional)',
    contextPlaceholder: "Briefly describe your current governance setup, the pressure you're facing, or what triggered this outreach.",
    submit: 'Request this time slot',
    submitting: 'Submitting...',
    submitted: 'Booking request submitted. Confirmation or rescheduling will follow within 24 hours.',
    directContact: 'Direct contact',
    directBody: 'If the online request flow is not the right fit, email directly instead.',
    sendEmail: 'Send an email',
    linkedin: 'Connect on LinkedIn',
    internalModules: 'PHAROS products',
    internalBody: 'CompassAI stays under the PHAROS surface, with Aurora as its intake workflow, until hosting, lineage, and review paths are ready for standalone presentation.',
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
        title: 'Aurora',
        description: 'Document intake, extraction, quality gates, and evidence package assembly within CompassAI.'
      },
      {
        title: 'CompassAI',
        description: 'Use-case registry, evidence intake, risk tiering, and governance deliverables.'
      }
    ]
  },
  fr: {
    eyebrow: 'Contact',
    heroTitle: 'Échange de 30 minutes',
    heroBody: 'Assez pour comprendre la pression en cause, choisir entre une gouvernance déterministe, une revue pré-mortem ou une revue post-mortem, puis cadrer les premiers livrables.',
    summaryRegionLabel: 'Résumé de la revue',
    summary: [
      {
        label: 'Pour qui',
        title: 'Cadrage initial',
        description: 'Utilisez cette page quand un examen approche ou quand un questionnaire, un audit ou une revue interne a deja revele un ecart.',
        detailTitle: 'Servez-vous du premier échange quand le bon parcours reste flou.',
        detailPoints: [
          'Un questionnaire, un audit ou une revue interne a deja mis un écart en lumière.',
          'Vous devez cadrer le travail avant que l effort de gouvernance ne se disperse.',
          'Vous cherchez une première étape concrète plutôt qu un langage générique sur la gouvernance de l IA.'
        ]
      },
      {
        label: 'Apportez',
        title: 'Système et preuve',
        description: 'Un premier echange utile commence par ce qui est en portee, ce qui a declenche la revue et quelle preuve existe deja.',
        detailTitle: 'Venez avec les faits opératoires, pas avec un récit lissé.',
        detailPoints: [
          'Nommez le système, le workflow ou le cas d usage en portée.',
          'Précisez ce qui a déclenché la revue : approvisionnement, audit, revue fournisseur, lancement ou réponse à incident.',
          'Indiquez quelle documentation, quelle preuve ou quel examen raté existe déjà.'
        ]
      },
      {
        label: 'Vous repartez avec',
        title: 'Prochaine étape',
        description: 'Le resultat est un parcours plus net vers une gouvernance deterministe, une revue pre-mortem ou une revue post-mortem.',
        detailTitle: 'Vous repartez avec le bon parcours et les premiers livrables en vue.',
        detailPoints: [
          'Un parcours de gouvernance déterministe lorsque la base a besoin de structure.',
          'Une revue pré-mortem lorsqu un lancement ou une intégration doit être éprouvé avant exposition.',
          'Une revue post-mortem lorsque le travail commence après un incident, un examen raté ou une dérive.'
        ]
      }
    ],
    formTitle: 'Réserver un échange',
    formBody: 'Demandez un échange de 30 minutes en ligne. Martin confirmera le créneau ou proposera une option voisine plutôt qu’un discours générique.',
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
    date: 'Date souhaitée *',
    datePlaceholder: 'Choisir une date',
    time: 'Heure souhaitée *',
    timePlaceholder: 'Sélectionner une heure',
    noSlotsAvailable: 'Aucun créneau de demande ouvert ne reste pour cette date.',
    loadingSlots: 'Chargement de la disponibilité actuelle...',
    topic: 'Quel est votre besoin ?',
    topicPlaceholder: 'Choisir un sujet',
    context: 'Contexte actuel (facultatif)',
    contextPlaceholder: 'Décrivez brièvement votre dispositif actuel de gouvernance, la pression à laquelle vous faites face ou ce qui a déclenché la prise de contact.',
    submit: 'Demander ce créneau',
    submitting: 'Envoi en cours...',
    submitted: 'Demande de réservation envoyée. Une confirmation ou une proposition de replanification suivra dans les 24 heures.',
    directContact: 'Contact direct',
    directBody: 'Si le parcours de réservation en ligne ne convient pas, écrivez directement.',
    sendEmail: 'Envoyer un courriel',
    linkedin: 'Écrire sur LinkedIn',
    internalModules: 'Produits PHAROS',
    internalBody: 'CompassAI demeure sous la surface PHAROS, avec Aurora comme workflow d’accueil, tant que l’hébergement, la chaîne de preuve et les parcours de revue ne sont pas prêts pour une présentation autonome.',
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
        title: 'Aurora',
        description: 'Accueil documentaire, extraction, portes qualité et assemblage de dossiers de preuve à l’intérieur de CompassAI.'
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
  const [activeSummaryIndex, setActiveSummaryIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const copy = useMemo(() => CONNECT_COPY[language], [language]);
  const activeSummary = copy.summary[activeSummaryIndex] || copy.summary[0];
  const contactEmail = PUBLIC_ASSURANCE_META.contactEmail;
  const contactHref = `mailto:${contactEmail}`;

  useEffect(() => {
    let cancelled = false;

    const loadBookedSlots = async () => {
      try {
        setSlotsLoading(true);
        const response = await fetch(`${API_URL}/api/bookings/booked-slots`);
        if (!response.ok) {
          throw new Error(`Availability request failed with ${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled) {
          setBookedSlots(Array.isArray(payload) ? payload : []);
        }
      } catch (_error) {
        if (!cancelled) {
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      }
    };

    loadBookedSlots();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const selectedDateBookedSlots = bookedSlots
    .filter((slot) => slot.date === form.date)
    .map((slot) => slot.time);

  const availableSlots = BOOKING_SLOTS.filter((slot) => !selectedDateBookedSlots.includes(slot));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organization: form.organization,
          date: form.date,
          time: form.time,
          topic: form.topic || copy.generalInquiry,
          current_state: form.context || copy.noContext
        })
      });

      if (!response.ok) {
        throw new Error(`Booking request failed with ${response.status}`);
      }

      setSubmitted(true);
      setForm((current) => ({
        ...initialForm,
        name: current.name,
        email: current.email,
        organization: current.organization
      }));

      const refreshed = await fetch(`${API_URL}/api/bookings/booked-slots`);
      if (refreshed.ok) {
        const payload = await refreshed.json();
        setBookedSlots(Array.isArray(payload) ? payload : []);
      }
    } catch (_error) {
      setSubmitError(language === 'fr'
        ? `La demande de réservation n’a pas pu être envoyée. Veuillez réessayer ou écrire à ${contactEmail}.`
        : `Booking request could not be sent. Please try again or email ${contactEmail}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="connect-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.heroTitle}</h1>
            <p className="body-lg page-hero-copy">
              {copy.heroBody}
            </p>
            <div className="connect-summary-shell signal-grid-page">
              <div className="signal-grid connect-summary-grid" role="tablist" aria-label={copy.summaryRegionLabel}>
                {copy.summary.map((item, index) => {
                  const isActive = index === activeSummaryIndex;
                  const tabId = `connect-summary-tab-${index}`;
                  const panelId = `connect-summary-panel-${index}`;

                  return (
                    <button
                      key={`${item.label}-${item.title}`}
                      type="button"
                      id={tabId}
                      role="tab"
                      className={`signal-card connect-summary-card${isActive ? ' active' : ''}`}
                      onClick={() => setActiveSummaryIndex(index)}
                      onFocus={() => setActiveSummaryIndex(index)}
                      aria-selected={isActive}
                      aria-controls={panelId}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <p className="signal-label">{item.label}</p>
                      <p className="signal-title">{item.title}</p>
                    </button>
                  );
                })}
              </div>

              <div
                className="editorial-panel-dark connect-summary-detail"
                id={`connect-summary-panel-${activeSummaryIndex}`}
                role="tabpanel"
                aria-labelledby={`connect-summary-tab-${activeSummaryIndex}`}
              >
                <div className="connect-summary-detail-head">
                  <p className="signal-label">{activeSummary.label}</p>
                  <h3>{activeSummary.detailTitle || activeSummary.title}</h3>
                  <p className="body-sm">{activeSummary.description}</p>
                </div>
                {activeSummary.detailPoints?.length ? (
                  <div className="connect-summary-points">
                    {activeSummary.detailPoints.map((point) => (
                      <div key={point} className="connect-summary-point">
                        {point}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section section-topless">
        <div className="container">
          <div className="connect-grid">
            <div className="reveal">
              <div className="editorial-panel">
                <h2>{copy.formTitle}</h2>
                <p className="body-sm page-inline-note">{copy.formBody}</p>
                <div className="scope-note">
                  <p className="eyebrow">{copy.prepLabel}</p>
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
                    <label htmlFor="date">{copy.date}</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="time">{copy.time}</label>
                    <select id="time" name="time" value={form.time} onChange={handleChange} required disabled={!form.date}>
                      <option value="">{copy.timePlaceholder}</option>
                      {availableSlots.map((item) => (
                        <option key={item} value={item}>{item} ET</option>
                      ))}
                    </select>
                    {slotsLoading ? (
                      <p className="body-sm page-inline-note">{copy.loadingSlots}</p>
                    ) : form.date && availableSlots.length === 0 ? (
                      <p className="body-sm page-inline-note">{copy.noSlotsAvailable}</p>
                    ) : null}
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

                  <button
                    type="submit"
                    className="btn-dark button-block"
                    disabled={submitting || !form.date || !form.time}
                  >
                    {submitting ? copy.submitting : copy.submit}
                    <ArrowRight />
                  </button>
                </form>

                {submitError ? (
                  <p className="form-message-error">
                    {submitError}
                  </p>
                ) : null}

                {submitted ? (
                  <p className="form-message-success">{copy.submitted}</p>
                ) : null}
              </div>
            </div>

            <div>
              <div className="reveal editorial-panel-dark">
                <p className="eyebrow">{copy.directContact}</p>
                <p className="body-sm page-inline-note">
                  {copy.directBody}
                </p>
                <p className="footer-founder">
                  <a href={contactHref}>{contactEmail}</a>
                </p>
                <p className="body-sm">{copy.location}</p>
                <a href={contactHref} className="btn-primary button-block">
                  {copy.sendEmail}
                </a>
              </div>

              <div className="reveal editorial-panel">
                <p className="eyebrow">{copy.internalModules}</p>
                <p className="body-sm page-inline-note">
                  {copy.internalBody}
                </p>
                <div className="plain-stack">
                  {copy.modulesList.map((item) => (
                    <div
                      key={item.title}
                      className="plain-stack-item"
                    >
                      <p className="footer-founder">
                        {item.title}
                      </p>
                      <p className="body-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="eyebrow">{copy.resources}</p>
                <div className="plain-stack">
                  {copy.resourcesList.map((item) => (
                    <div key={item.title} className="plain-stack-item">
                      <p className="footer-founder">{item.title}</p>
                      <p className="body-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/tool" className="reveal link-slab">
                <p className="eyebrow">
                  {copy.startPrompt}
                </p>
                <h3>{copy.startTitle}</h3>
                <p className="body-sm page-inline-note">
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
