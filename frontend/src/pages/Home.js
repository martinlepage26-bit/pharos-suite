import { Link } from 'react-router-dom';
import { ArrowRight, Compass, FileCheck2, Radar, ShieldCheck, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    heroLabel: 'Legible AI Governance',
    heroTitle: 'Deterministic AI governance under pressure',
    heroBody:
      'When procurement, audit, vendor diligence, or executive scrutiny asks for proof, PHAROS helps teams answer with explicit thresholds, named decisions, and review-ready evidence.',
    heroPrimary: 'Book a review',
    heroSecondary: 'See methods',
    heroStandards: ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act'],
    aboutLabel: 'About PHAROS',
    aboutTitle: 'Evidence before rhetoric',
    aboutBodyOne:
      'PHAROS is an AI governance practice led by Martin Lepage, PhD. It is built for organizations facing live review pressure where vague governance language no longer works.',
    aboutBodyTwo:
      'The operating goal is simple: make governance inspectable. The result is a decision and evidence structure that reviewers can follow without rebuilding your logic from scratch.',
    aboutQuote:
      '"Trust does not come from tone alone. It comes from explicit thresholds, named decisions, and evidence that can be inspected."',
    aboutStats: [
      { label: 'Sectors', value: 'Financial services, healthcare, enterprise technology, public sector' },
      { label: 'Focus', value: 'Procurement, audit, vendor review, executive oversight' }
    ],
    governanceLabel: 'PHAROS Standard',
    governanceTitle: 'A governance posture that stays legible when scrutiny arrives',
    governanceBody:
      'PHAROS turns ambiguous governance pressure into deterministic operational structure with clear accountability.',
    governancePillars: [
      {
        id: '01',
        title: 'Deterministic decision rights',
        body: 'Document who decides, who escalates, and what cannot proceed without more proof.'
      },
      {
        id: '02',
        title: 'Explicit thresholds',
        body: 'Define trigger points for review and escalation before pressure forces improvised rules.'
      },
      {
        id: '03',
        title: 'Review-ready evidence',
        body: 'Build packet structures a buyer, auditor, or committee can inspect quickly.'
      },
      {
        id: '04',
        title: 'Reconstructible governance',
        body: 'Keep a record that explains what happened, why, and what changes next.'
      }
    ],
    pressureLabel: 'Pressure Points',
    pressureTitle: 'Governance work starts where review pressure exposes ambiguity',
    pressureItems: [
      {
        icon: Compass,
        title: 'Procurement',
        body: 'Governance must survive customer and buyer diligence without ad hoc explanations.'
      },
      {
        icon: FileCheck2,
        title: 'Audit',
        body: 'Thresholds, roles, and evidence trails must be explicit enough to review quickly.'
      },
      {
        icon: ShieldCheck,
        title: 'Vendor review',
        body: 'Model and supplier dependencies need structured governance, not last-minute prose.'
      },
      {
        icon: Radar,
        title: 'Executive oversight',
        body: 'Leadership needs bounded claims and clear mechanism-level accountability.'
      }
    ],
    methodLabel: 'Method in Four Steps',
    methodTitle: 'Read pressure. Set thresholds. Assign decisions. Preserve the evidence path.',
    methodBody:
      'The method is designed to produce controls that hold under real review, not only internal policy language.',
    methodSteps: [
      {
        id: '01',
        title: 'Read the pressure source',
        body: 'Start with the real trigger: procurement, audit, vendor diligence, launch, incident response, or oversight.'
      },
      {
        id: '02',
        title: 'Set deterministic thresholds',
        body: 'Make review triggers and approval conditions explicit enough to avoid reviewer drift.'
      },
      {
        id: '03',
        title: 'Assign decision rights',
        body: 'Name who decides, who escalates, and what evidence must exist at each decision point.'
      },
      {
        id: '04',
        title: 'Build the evidence path',
        body: 'Maintain reconstructible artifacts and cadence so governance survives later scrutiny.'
      }
    ],
    artifactsLabel: 'Artifacts',
    artifactsTitle: 'Deliverables that make governance credible',
    artifacts: [
      'Decision matrix',
      'Threshold map',
      'Review packet',
      'Post-mortem record'
    ],
    servicesLabel: 'Service Routes',
    servicesTitle: 'Choose the route by pressure source, not vocabulary',
    servicesBody:
      'The right route depends on whether you need a baseline, a pre-mortem, or a post-mortem correction cycle.',
    services: [
      {
        tag: 'Baseline',
        title: 'Deterministic Governance',
        body: 'Establish explicit thresholds and decision rights before scrutiny compounds ambiguity.',
        href: '/services#deterministic-governance'
      },
      {
        tag: 'Pre-launch',
        title: 'Pre-mortem Review',
        body: 'Pressure-test governance before launch, onboarding, or major expansion raises stakes.',
        href: '/services#pre-mortem-review',
        featured: true
      },
      {
        tag: 'Post-incident',
        title: 'Post-mortem Review',
        body: 'Reconstruct incidents and governance drift, then convert findings into stronger controls.',
        href: '/services#post-mortem-review'
      }
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Common questions before engagement',
    faq: [
      {
        q: 'When should we engage PHAROS?',
        a: 'Use PHAROS when procurement, audit, vendor, or executive review is active, or when you know that pressure is imminent.'
      },
      {
        q: 'What does a 30-minute review produce?',
        a: 'A scoped route, a pressure-source read, and the first bounded deliverables required for credible follow-through.'
      },
      {
        q: 'How is this different from a checklist?',
        a: 'A checklist reports status. PHAROS defines thresholds, decision rights, and evidence pathways reviewers can inspect.'
      },
      {
        q: 'Does PHAROS replace legal counsel or audit?',
        a: 'No. PHAROS structures governance mechanisms and documentation; legal and audit functions remain independent authorities.'
      }
    ],
    contactLabel: 'Contact',
    contactTitle: 'Book a 30-minute review',
    contactBody:
      'Start with one bounded conversation. We identify the pressure source, choose the right route, and define the first governance deliverables.',
    contactPrimary: 'Open contact intake',
    contactSecondary: 'Read assurance',
    emailLabel: 'Direct email',
    emailValue: 'pharos@pharos-ai.ca',
    ctaBanner: 'Start with a scoped review, not a vague governance program.'
  },
  fr: {
    heroLabel: 'Gouvernance IA lisible',
    heroTitle: 'Gouvernance IA deterministe sous pression',
    heroBody:
      'Quand l approvisionnement, l audit, la diligence fournisseur ou la supervision demande des preuves, PHAROS aide les equipes a repondre avec des seuils explicites, des decisions nommees et des artefacts prets pour revue.',
    heroPrimary: 'Reserver une revue',
    heroSecondary: 'Voir la methode',
    heroStandards: ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act'],
    aboutLabel: 'A propos de PHAROS',
    aboutTitle: 'La preuve avant la rhetorique',
    aboutBodyOne:
      'PHAROS est une pratique de gouvernance IA dirigee par Martin Lepage, PhD, pour les organisations sous pression de revue concrete.',
    aboutBodyTwo:
      'L objectif est simple: rendre la gouvernance inspectable. Le resultat est une structure de decision et de preuve que les reviseurs peuvent suivre rapidement.',
    aboutQuote:
      '"La confiance ne vient pas du ton seul. Elle vient de seuils explicites, de decisions nommees et d une preuve inspectable."',
    aboutStats: [
      { label: 'Secteurs', value: 'Services financiers, sante, technologie enterprise, secteur public' },
      { label: 'Focus', value: 'Approvisionnement, audit, revue fournisseur, supervision executive' }
    ],
    governanceLabel: 'Standard PHAROS',
    governanceTitle: 'Une posture qui reste lisible quand la revue arrive',
    governanceBody:
      'PHAROS transforme une pression ambiguë en structure operationnelle deterministe avec responsabilites claires.',
    governancePillars: [
      {
        id: '01',
        title: 'Droits de decision deterministes',
        body: 'Documenter qui decide, qui escalade, et ce qui ne peut pas avancer sans preuve.'
      },
      {
        id: '02',
        title: 'Seuils explicites',
        body: 'Definir les declencheurs de revue et d escalation avant l improvisation.'
      },
      {
        id: '03',
        title: 'Preuve prete pour revue',
        body: 'Construire des paquets que l acheteur, l auditeur ou le comite peut inspecter rapidement.'
      },
      {
        id: '04',
        title: 'Gouvernance reconstructible',
        body: 'Garder un dossier qui explique ce qui s est passe, pourquoi, et ce qui change.'
      }
    ],
    pressureLabel: 'Points de pression',
    pressureTitle: 'Le travail de gouvernance commence quand la pression expose l ambiguite',
    pressureItems: [
      {
        icon: Compass,
        title: 'Approvisionnement',
        body: 'La gouvernance doit tenir en diligence client sans reponses improvisées.'
      },
      {
        icon: FileCheck2,
        title: 'Audit',
        body: 'Seuils, roles et traces de preuve doivent etre explicites et rapides a revoir.'
      },
      {
        icon: ShieldCheck,
        title: 'Revue fournisseur',
        body: 'Les dependances modeles et fournisseurs exigent une structure de gouvernance claire.'
      },
      {
        icon: Radar,
        title: 'Supervision executive',
        body: 'La direction exige des revendications bornees et une responsabilite mecanique explicite.'
      }
    ],
    methodLabel: 'Methode en quatre etapes',
    methodTitle: 'Lire la pression. Fixer les seuils. Nommer les decisions. Preserver la preuve.',
    methodBody:
      'La methode est concue pour produire des controles solides en revue reelle, pas seulement du langage de politique.',
    methodSteps: [
      {
        id: '01',
        title: 'Lire la source de pression',
        body: 'Commencer par le declencheur reel: approvisionnement, audit, diligence, lancement, incident ou supervision.'
      },
      {
        id: '02',
        title: 'Fixer des seuils deterministes',
        body: 'Rendre les declencheurs et conditions d approbation explicites pour eviter la derive de revue.'
      },
      {
        id: '03',
        title: 'Attribuer les droits de decision',
        body: 'Nommer qui decide, qui escalade, et quelle preuve doit exister a chaque point.'
      },
      {
        id: '04',
        title: 'Construire le parcours de preuve',
        body: 'Maintenir des artefacts reconstructibles et une cadence de suivi defendable.'
      }
    ],
    artifactsLabel: 'Artefacts',
    artifactsTitle: 'Des livrables qui rendent la gouvernance credible',
    artifacts: [
      'Matrice de decision',
      'Carte des seuils',
      'Paquet de revue',
      'Registre post-mortem'
    ],
    servicesLabel: 'Parcours de service',
    servicesTitle: 'Choisir le parcours selon la pression, pas le vocabulaire',
    servicesBody:
      'Le bon parcours depend de votre besoin: base solide, pre-mortem avant exposition, ou post-mortem correctif.',
    services: [
      {
        tag: 'Base',
        title: 'Gouvernance deterministe',
        body: 'Etablir des seuils explicites et des droits de decision avant que la pression augmente.',
        href: '/services#deterministic-governance'
      },
      {
        tag: 'Pre-lancement',
        title: 'Revue pre-mortem',
        body: 'Tester la gouvernance avant lancement, integration ou expansion critique.',
        href: '/services#pre-mortem-review',
        featured: true
      },
      {
        tag: 'Post-incident',
        title: 'Revue post-mortem',
        body: 'Reconstruire les incidents et la derive pour renforcer les controles.',
        href: '/services#post-mortem-review'
      }
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Questions frequentes avant engagement',
    faq: [
      {
        q: 'Quand engager PHAROS?',
        a: 'Quand la pression d approvisionnement, d audit, de revue fournisseur ou de supervision est active ou imminente.'
      },
      {
        q: 'Que produit une revue de 30 minutes?',
        a: 'Un parcours cadre, une lecture de la source de pression, et les premiers livrables bornes.'
      },
      {
        q: 'Difference avec une checklist?',
        a: 'Une checklist montre un statut. PHAROS definit seuils, droits de decision et parcours de preuve inspectables.'
      },
      {
        q: 'PHAROS remplace-t-il les juristes ou auditeurs?',
        a: 'Non. PHAROS structure les mecanismes de gouvernance; les fonctions juridiques et audit restent autorites independantes.'
      }
    ],
    contactLabel: 'Contact',
    contactTitle: 'Reserver une revue de 30 minutes',
    contactBody:
      'Commencez par une conversation bornee. Nous identifions la pression, choisissons le bon parcours et fixons les premiers livrables.',
    contactPrimary: 'Ouvrir intake contact',
    contactSecondary: 'Lire assurance',
    emailLabel: 'Courriel direct',
    emailValue: 'pharos@pharos-ai.ca',
    ctaBanner: 'Commencer par une revue cadree, pas un programme vague.'
  }
};

const Home = () => {
  const { language } = useLanguage();
  const copy = COPY[language] || COPY.en;

  return (
    <div data-testid="home-page" className="phn-home">
      <section className="phn-hero">
        <div className="container phn-hero-grid">
          <div className="phn-hero-content reveal-up">
            <p className="phn-label">{copy.heroLabel}</p>
            <h1 className="phn-display" style={{ marginTop: '0.95rem' }}>{copy.heroTitle}</h1>
            <p className="phn-lead" style={{ marginTop: '1rem' }}>{copy.heroBody}</p>
            <div className="btn-row" style={{ marginTop: '1.25rem' }}>
              <Link className="phn-btn-gold" to="/contact">
                {copy.heroPrimary}
                <ArrowRight size={14} />
              </Link>
              <Link className="phn-btn-outline" to="/methods">
                {copy.heroSecondary}
              </Link>
            </div>
            <div className="phn-chip-row" style={{ marginTop: '1.4rem' }}>
              {copy.heroStandards.map((item) => (
                <span key={item} className="phn-chip">{item}</span>
              ))}
            </div>
          </div>

          <aside className="phn-hero-panel reveal-up delay-1" aria-label={copy.pressureTitle}>
            <p className="phn-label">{copy.pressureLabel}</p>
            <h2 className="phn-title-sm" style={{ marginTop: '0.72rem' }}>{copy.pressureTitle}</h2>
            <div className="phn-card-list" style={{ marginTop: '1rem' }}>
              {copy.pressureItems.map((item) => (
                <article className="phn-mini-card" key={item.title}>
                  <item.icon size={16} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="phn-section phn-section-light">
        <div className="container phn-two-col">
          <article className="reveal-up">
            <p className="phn-label">{copy.aboutLabel}</p>
            <span className="phn-gold-line" />
            <h2 className="phn-title">{copy.aboutTitle}</h2>
            <p className="phn-body" style={{ marginTop: '0.9rem' }}>{copy.aboutBodyOne}</p>
            <p className="phn-body" style={{ marginTop: '0.85rem' }}>{copy.aboutBodyTwo}</p>
            <blockquote className="phn-quote">{copy.aboutQuote}</blockquote>
            <div className="phn-stat-grid">
              {copy.aboutStats.map((item) => (
                <article key={item.label} className="phn-stat-card">
                  <p className="phn-meta">{item.label}</p>
                  <p>{item.value}</p>
                </article>
              ))}
            </div>
          </article>

          <aside className="phn-surface reveal-up delay-1">
            <p className="phn-meta">PHAROS</p>
            <h3 style={{ marginTop: '0.55rem' }}>Governance that survives scrutiny</h3>
            <ul className="phn-check-list" style={{ marginTop: '0.9rem' }}>
              <li>Mechanism-first governance design</li>
              <li>Bounded claims and explicit thresholds</li>
              <li>Evidence paths fit for review conditions</li>
              <li>Human-accountable publication and review posture</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="phn-section phn-section-dark">
        <div className="container">
          <div className="phn-head reveal-up">
            <p className="phn-label">{copy.governanceLabel}</p>
            <span className="phn-gold-line" />
            <h2 className="phn-title">{copy.governanceTitle}</h2>
            <p className="phn-body" style={{ color: 'rgba(250, 250, 248, 0.72)', marginTop: '0.85rem' }}>{copy.governanceBody}</p>
          </div>
          <div className="phn-pillar-grid">
            {copy.governancePillars.map((pillar, index) => (
              <article className={`phn-pillar-card reveal-up delay-${Math.min(index, 3)}`} key={pillar.id}>
                <span className="phn-pillar-id">{pillar.id}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="phn-section phn-section-light">
        <div className="container phn-two-col">
          <div>
            <div className="phn-head reveal-up">
              <p className="phn-label">{copy.methodLabel}</p>
              <span className="phn-gold-line" />
              <h2 className="phn-title">{copy.methodTitle}</h2>
              <p className="phn-body" style={{ marginTop: '0.85rem' }}>{copy.methodBody}</p>
            </div>
            <div className="phn-step-list">
              {copy.methodSteps.map((step, index) => (
                <article className={`phn-step-item reveal-up delay-${Math.min(index, 3)}`} key={step.id}>
                  <span className="phn-step-id">{step.id}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="phn-surface phn-surface-dark reveal-up delay-1">
            <p className="phn-label">{copy.artifactsLabel}</p>
            <h3 style={{ marginTop: '0.7rem', color: '#f7f4ed' }}>{copy.artifactsTitle}</h3>
            <ul className="phn-check-list phn-check-list-dark" style={{ marginTop: '0.95rem' }}>
              {copy.artifacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link className="phn-btn-outline" style={{ marginTop: '1.15rem' }} to="/methods">
              Open methods
            </Link>
          </aside>
        </div>
      </section>

      <section className="phn-section phn-section-light">
        <div className="container">
          <div className="phn-head reveal-up">
            <p className="phn-label">{copy.servicesLabel}</p>
            <span className="phn-gold-line" />
            <h2 className="phn-title">{copy.servicesTitle}</h2>
            <p className="phn-body" style={{ marginTop: '0.85rem' }}>{copy.servicesBody}</p>
          </div>
          <div className="phn-service-grid">
            {copy.services.map((service, index) => (
              <article
                className={`phn-service-card${service.featured ? ' is-featured' : ''} reveal-up delay-${Math.min(index, 3)}`}
                key={service.title}
              >
                <p className="phn-service-tag">{service.tag}</p>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <Link className="phn-service-link" to={service.href}>
                  Open service
                  <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>
          <div className="phn-banner reveal-up">
            <p>{copy.ctaBanner}</p>
            <Link className="phn-btn-gold" to="/contact">
              {copy.heroPrimary}
            </Link>
          </div>
        </div>
      </section>

      <section className="phn-section phn-section-light" id="faq">
        <div className="container phn-two-col">
          <div className="reveal-up">
            <p className="phn-label">{copy.faqLabel}</p>
            <span className="phn-gold-line" />
            <h2 className="phn-title">{copy.faqTitle}</h2>
          </div>
          <div className="phn-faq-list reveal-up delay-1">
            {copy.faq.map((item, index) => (
              <details className="phn-faq-item" key={item.q} open={index === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="phn-section phn-section-dark">
        <div className="container phn-contact-shell reveal-up">
          <div>
            <p className="phn-label">{copy.contactLabel}</p>
            <span className="phn-gold-line" />
            <h2 className="phn-title">{copy.contactTitle}</h2>
            <p className="phn-body" style={{ color: 'rgba(250, 250, 248, 0.72)', marginTop: '0.9rem' }}>
              {copy.contactBody}
            </p>
            <p className="phn-meta" style={{ marginTop: '1rem' }}>{copy.emailLabel}</p>
            <a className="phn-email" href={`mailto:${copy.emailValue}`}>{copy.emailValue}</a>
          </div>
          <div className="btn-row" style={{ justifyContent: 'flex-start' }}>
            <Link className="phn-btn-gold" to="/contact">
              {copy.contactPrimary}
              <ArrowRight size={14} />
            </Link>
            <Link className="phn-btn-outline" to="/assurance">
              {copy.contactSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
