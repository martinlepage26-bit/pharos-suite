import { useEffect, useMemo, useState } from 'react';
import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, CalendarClock, Mail, ShieldCheck } from 'lucide-react';
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

const COPY = {
  en: {
    eyebrow: 'Connect',
    title: 'Start with a focused 30-minute governance review',
    body:
      'Use the first call to map pressure source, route selection, and evidence burden. The goal is a clear next step, not a generic pitch.',
    summaryTitle: 'What the first review should decide',
    summaryItems: [
      'Which route fits now: deterministic governance, pre-mortem, or post-mortem.',
      'Which systems and vendors belong in first-pass scope.',
      'What evidence must exist before external review pressure escalates.'
    ],
    trustTitle: 'How this intake stays bounded',
    trustBody:
      'This intake schedules a review call. It does not create legal advice, certification claims, or deployment approvals.',
    formTitle: 'Book a review slot',
    formBody: 'Submit preferred date and time. You will receive confirmation or an adjacent option if the slot is unavailable.',
    prepTitle: 'Bring these three inputs',
    prepItems: [
      'System or workflow in scope',
      'Current pressure source (procurement, audit, vendor, launch, incident)',
      'Current evidence state (what exists and what is missing)'
    ],
    name: 'Name *',
    namePlaceholder: 'Your full name',
    email: 'Email *',
    emailPlaceholder: 'you@company.com',
    organization: 'Organization',
    organizationPlaceholder: 'Company or institution',
    date: 'Preferred date *',
    time: 'Preferred time *',
    timePlaceholder: 'Select a time',
    noSlotsAvailable: 'No request slots remain for this date.',
    loadingSlots: 'Loading current availability...',
    topic: 'Primary topic',
    topicPlaceholder: 'Select a topic',
    context: 'Current state (optional)',
    contextPlaceholder: 'Describe the current setup, review trigger, and any known evidence gaps.',
    topics: [
      { value: 'procurement', label: 'Procurement or questionnaire pressure' },
      { value: 'audit', label: 'Audit or evidence readiness' },
      { value: 'deterministic-governance', label: 'Deterministic governance setup' },
      { value: 'pre-mortem', label: 'Pre-mortem review planning' },
      { value: 'post-mortem', label: 'Post-mortem response and correction' },
      { value: 'vendor', label: 'Vendor governance and diligence' },
      { value: 'other', label: 'Other' }
    ],
    submit: 'Request slot',
    submitting: 'Submitting...',
    submitted: 'Request sent. Confirmation or rescheduling follows within 24 hours.',
    errorPrefix: 'Booking request could not be sent. Please try again or email',
    directTitle: 'Direct contact',
    directBody: 'If this intake form is not the right path, email directly.',
    emailAction: 'Send email',
    toolTitle: 'Need a fast signal first?',
    toolBody: 'Run the readiness snapshot before booking if you need quick orientation.',
    toolAction: 'Run readiness snapshot',
    serviceAction: 'View service routes',
    location: 'Montreal, Quebec, Canada',
    generalInquiry: 'General inquiry',
    noContext: 'No additional context provided.'
  },
  fr: {
    eyebrow: 'Contact',
    title: 'Commencer par une revue de gouvernance ciblée de 30 minutes',
    body:
      'Le premier appel sert à cadrer la source de pression, le parcours de mandat et la charge de preuve. L’objectif est d’identifier la prochaine étape utile, pas de faire un pitch générique.',
    summaryTitle: 'Ce que la première revue doit trancher',
    summaryItems: [
      'Quel parcours choisir maintenant : gouvernance déterministe, pré-mortem ou post-mortem.',
      'Quels systèmes et fournisseurs entrent dans la première portée.',
      'Quelle preuve doit exister avant qu’une revue externe ne s’intensifie.'
    ],
    trustTitle: 'Comment cette prise de contact reste bornée',
    trustBody:
      'Ce formulaire sert uniquement à planifier un appel de revue. Il ne crée ni avis juridique, ni certification, ni approbation de déploiement.',
    formTitle: 'Réserver un créneau',
    formBody: 'Indiquez la date et l’heure souhaitées. Une confirmation ou une option voisine vous sera proposée si le créneau choisi n’est plus disponible.',
    prepTitle: 'Préparez ces trois éléments',
    prepItems: [
      'Système ou flux de travail dans la portée',
      'Source de pression actuelle (approvisionnement, audit, fournisseur, lancement, incident)',
      'État actuel de la preuve (ce qui existe et ce qui manque)'
    ],
    name: 'Nom *',
    namePlaceholder: 'Votre nom complet',
    email: 'Courriel *',
    emailPlaceholder: 'vous@organisation.ca',
    organization: 'Organisation',
    organizationPlaceholder: 'Entreprise ou institution',
    date: 'Date souhaitée *',
    time: 'Heure souhaitée *',
    timePlaceholder: 'Choisir une heure',
    noSlotsAvailable: 'Aucun créneau n’est disponible pour cette date.',
    loadingSlots: 'Chargement des disponibilités…',
    topic: 'Sujet principal',
    topicPlaceholder: 'Choisir un sujet',
    context: 'État actuel (optionnel)',
    contextPlaceholder: 'Décrivez le dispositif actuel, le déclencheur de revue et les écarts de preuve déjà connus.',
    topics: [
      { value: 'procurement', label: 'Approvisionnement ou questionnaire' },
      { value: 'audit', label: 'Audit ou préparation des preuves' },
      { value: 'deterministic-governance', label: 'Mise en place d’une gouvernance déterministe' },
      { value: 'pre-mortem', label: 'Préparation pré-mortem' },
      { value: 'post-mortem', label: 'Réponse post-mortem' },
      { value: 'vendor', label: 'Revue fournisseur' },
      { value: 'other', label: 'Autre' }
    ],
    submit: 'Demander ce créneau',
    submitting: 'Envoi en cours...',
    submitted: 'Demande envoyée. Confirmation ou replanification sous 24 heures.',
    errorPrefix: 'La demande n’a pas pu être envoyée. Veuillez réessayer ou écrire à',
    directTitle: 'Contact direct',
    directBody: 'Si ce formulaire n’est pas le bon point d’entrée, écrivez directement.',
    emailAction: 'Envoyer un courriel',
    toolTitle: 'Besoin d’un premier signal rapide?',
    toolBody: 'Faites d’abord l’instantané de préparation si vous avez besoin d’un point de repère rapide.',
    toolAction: 'Faire l’instantané',
    serviceAction: 'Voir les parcours de service',
    location: 'Montréal, Québec, Canada',
    generalInquiry: 'Demande générale',
    noContext: 'Aucun contexte additionnel fourni.'
  }
};

const Connect = () => {
  const { language } = useLanguage();
  const copy = useMemo(() => COPY[language], [language]);

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const contactEmail = PUBLIC_ASSURANCE_META.contactEmail;
  const contactHref = `mailto:${contactEmail}`;
  const today = new Date().toISOString().split('T')[0];

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
    setSubmitted(false);

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
      setSubmitError(`${copy.errorPrefix} ${contactEmail}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="connect-page">
      <section className="section">
        <div className="container hero-grid">
          <article className="hero-panel reveal-up">
            <p className="hero-badge">{copy.eyebrow}</p>
            <h1 style={{ marginTop: '0.85rem' }}>{copy.title}</h1>
            <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
            <p className="kicker" style={{ marginTop: '1rem' }}>{copy.summaryTitle}</p>
            <ul className="check-list" style={{ marginTop: '0.65rem' }}>
              {copy.summaryItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <aside className="section-shell reveal-up delay-1" aria-label={copy.trustTitle}>
            <span className="icon-pill" aria-hidden="true">
              <ShieldCheck size={16} />
            </span>
            <h2 style={{ marginTop: '0.72rem' }}>{copy.trustTitle}</h2>
            <p className="body-sm" style={{ marginTop: '0.6rem' }}>{copy.trustBody}</p>
            <div className="badge-row" style={{ marginTop: '0.8rem' }}>
              <span className="badge-chip">30 min</span>
              <span className="badge-chip">Bounded claims</span>
              <span className="badge-chip">Human review</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <h2>{copy.formTitle}</h2>
            <p className="body-sm" style={{ marginTop: '0.6rem' }}>{copy.formBody}</p>

            <div className="surface surface-muted" style={{ marginTop: '0.9rem' }}>
              <p className="kicker">{copy.prepTitle}</p>
              <ul className="check-list" style={{ marginTop: '0.55rem' }}>
                {copy.prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <form className="form-shell" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <div className="input-grid">
                <div className="input-field">
                  <label htmlFor="name">{copy.name}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={copy.namePlaceholder}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="email">{copy.email}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="organization">{copy.organization}</label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    placeholder={copy.organizationPlaceholder}
                    value={form.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="topic">{copy.topic}</label>
                  <select id="topic" name="topic" value={form.topic} onChange={handleChange}>
                    <option value="">{copy.topicPlaceholder}</option>
                    {copy.topics.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <label htmlFor="date">{copy.date}</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="time">{copy.time}</label>
                  <select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    disabled={!form.date}
                  >
                    <option value="">{copy.timePlaceholder}</option>
                    {availableSlots.map((item) => (
                      <option key={item} value={item}>{item} ET</option>
                    ))}
                  </select>

                  {slotsLoading ? <p className="body-sm">{copy.loadingSlots}</p> : null}
                  {!slotsLoading && form.date && availableSlots.length === 0 ? <p className="body-sm">{copy.noSlotsAvailable}</p> : null}
                </div>
              </div>

              <div className="input-field">
                <label htmlFor="context">{copy.context}</label>
                <textarea
                  id="context"
                  name="context"
                  placeholder={copy.contextPlaceholder}
                  value={form.context}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting || !form.date || !form.time}>
                {submitting ? copy.submitting : copy.submit}
                <ArrowRight size={14} />
              </button>
            </form>

            {submitError ? <p className="form-status error" style={{ marginTop: '0.85rem' }}>{submitError}</p> : null}
            {submitted ? <p className="form-status success" style={{ marginTop: '0.85rem' }}>{copy.submitted}</p> : null}
          </article>

          <div className="reveal-up delay-1" style={{ display: 'grid', gap: '0.95rem' }}>
            <article className="surface">
              <span className="icon-pill" aria-hidden="true">
                <Mail size={16} />
              </span>
              <h2 style={{ marginTop: '0.7rem' }}>{copy.directTitle}</h2>
              <p className="body-sm" style={{ marginTop: '0.55rem' }}>{copy.directBody}</p>
              <p className="body-sm" style={{ marginTop: '0.7rem' }}>
                <a href={contactHref}>{contactEmail}</a>
              </p>
              <p className="body-sm">{copy.location}</p>
              <a href={contactHref} className="btn-secondary" style={{ marginTop: '0.85rem', display: 'inline-flex' }}>
                {copy.emailAction}
              </a>
            </article>

            <article className="surface">
              <span className="icon-pill" aria-hidden="true">
                <CalendarClock size={16} />
              </span>
              <h2 style={{ marginTop: '0.7rem' }}>{copy.toolTitle}</h2>
              <p className="body-sm" style={{ marginTop: '0.55rem' }}>{copy.toolBody}</p>
              <div className="btn-row" style={{ marginTop: '0.85rem' }}>
                <LocalizedLink className="btn-secondary" to="/tool">{copy.toolAction}</LocalizedLink>
                <LocalizedLink className="btn-ghost" to="/services">{copy.serviceAction}</LocalizedLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Connect;
