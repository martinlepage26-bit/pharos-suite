import { useEffect, useState } from 'react';
import deskReferenceImage from '../assets/pharos-documents-desk-reference.png';
import './Home.newlook.css';
import { useLanguage } from '../context/LanguageContext';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663476837393/Rxa9sVq4AbrYE3FRZFywvK/pharos-hero-lighthouse-h9QXVQpbrL37sEHw8pxMfR.webp';
const GOVERNANCE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663476837393/Rxa9sVq4AbrYE3FRZFywvK/pharos-governance-abstract-iSC7d8YMMfBcBt4Wc9W8Zd.webp';
const DESK_IMG = deskReferenceImage;
const TIMELINE_PATH = '/pharos-ai-site/index.html#timeline';

const HERO_PROOF_POINTS = [
  {
    label: 'Thresholds stated',
    value: 'No implied gates',
    body: 'Review conditions are named before they become arguments.'
  },
  {
    label: 'Decision rights named',
    value: 'Owner before opinion',
    body: 'Who decides, who escalates, and what must be recorded stay explicit.'
  },
  {
    label: 'Evidence reconstructible',
    value: 'Ready for later scrutiny',
    body: 'The answer survives procurement, audit, and executive review.'
  }
];

const REVIEW_PRESSURE_NOTES = ['Procurement review', 'Audit pressure', 'Executive oversight'];
const REVIEW_PRESSURE_NOTES_FR = ['Revue d\'approvisionnement', 'Pression d\'audit', 'Supervision de direction'];

const GOVERNANCE_PILLARS = [
  {
    number: '01',
    title: 'Deterministic Decision Rights',
    description:
      'Clear approval logic, escalation paths, and named owners that do not shift by reviewer. Every decision has a named owner and a documented rationale.'
  },
  {
    number: '02',
    title: 'Explicit Thresholds',
    description:
      'Thresholds that show when a system escalates, why it escalates, and what evidence is required next. No implied boundaries, only stated ones.'
  },
  {
    number: '03',
    title: 'Review-Ready Evidence',
    description:
      'A document set a buyer, auditor, or committee can follow without rebuilding the logic from scratch. The trail is complete before scrutiny arrives.'
  },
  {
    number: '04',
    title: 'Reconstructible Governance',
    description:
      'A posture that still holds when later scrutiny asks what happened, why, and what changes next. Governance that survives the post-mortem.'
  }
];

const GOVERNANCE_PILLARS_FR = [
  {
    number: '01',
    title: 'Droits decisionnels deterministes',
    description:
      'Une logique d\'approbation claire, des chemins d\'escalade explicites et des responsables nommes qui ne changent pas selon l\'examinateur. Chaque decision a un proprietaire et une justification consignee.'
  },
  {
    number: '02',
    title: 'Seuils explicites',
    description:
      'Des seuils qui montrent quand un systeme doit monter d\'un cran, pourquoi il y monte et quelle preuve devient necessaire ensuite. Aucun seuil implicite, seulement des seuils declares.'
  },
  {
    number: '03',
    title: 'Preuve prete pour la revue',
    description:
      'Un dossier qu\'un acheteur, un auditeur ou un comite peut suivre sans reconstruire la logique a partir de zero. La piste est complete avant que l\'examen arrive.'
  },
  {
    number: '04',
    title: 'Gouvernance reconstructible',
    description:
      'Une posture qui tient encore lorsque l\'on demande plus tard ce qui s\'est passe, pourquoi et ce qui doit changer ensuite. Une gouvernance qui survit au post-mortem.'
  }
];

const PRESSURE_POINTS = [
  {
    title: 'Procurement',
    description:
      'The question stops being whether a system is useful and becomes whether governance can survive a customer review.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="13" rx="1" stroke="#D4A853" strokeWidth="1.5" />
        <path d="M3 10h18" stroke="#D4A853" strokeWidth="1.5" />
        <path d="M7 14h4M7 17h6" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Audit',
    description:
      'Audit exposes where thresholds are implied rather than stated and where evidence trails are too thin to trust.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 12l2 2 4-4" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#D4A853" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    title: 'Vendor Review',
    description:
      'Partner and model dependencies need structured review, not improvised answers when a diligence request arrives.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#D4A853" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'Executive Oversight',
    description:
      'Leadership and committees need a governance answer that stays legible under scrutiny instead of collapsing into abstractions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="#D4A853" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
];

const PRESSURE_POINTS_FR = [
  {
    title: 'Approvisionnement',
    description:
      'La question cesse d\'etre de savoir si un systeme est utile et devient de savoir si sa gouvernance peut tenir devant une revue client.',
    icon: PRESSURE_POINTS[0].icon
  },
  {
    title: 'Audit',
    description:
      'L\'audit revele ou les seuils restent implicites et ou les pistes de preuve sont trop minces pour inspirer confiance.',
    icon: PRESSURE_POINTS[1].icon
  },
  {
    title: 'Revue fournisseur',
    description:
      'Les dependances envers les partenaires et les modeles ont besoin d\'une revue structuree, pas de reponses improvisees quand la diligence commence.',
    icon: PRESSURE_POINTS[2].icon
  },
  {
    title: 'Supervision de direction',
    description:
      'La direction et les comites ont besoin d\'une reponse de gouvernance qui reste lisible sous examen, plutot que de s\'effondrer dans l\'abstraction.',
    icon: PRESSURE_POINTS[3].icon
  }
];

const METHOD_STEPS = [
  {
    number: '01',
    title: 'Read the Pressure Source',
    description:
      'Start with the actual review condition: procurement, audit, vendor diligence, launch, incident response, or executive oversight. The entry point shapes everything that follows.'
  },
  {
    number: '02',
    title: 'Set Deterministic Thresholds',
    description:
      'Make review triggers, risk boundaries, and approval conditions explicit enough that different reviewers reach the same logic. Ambiguity is the enemy of governance.'
  },
  {
    number: '03',
    title: 'Assign Decision Rights',
    description:
      'Name who decides, who escalates, what must be documented, and what cannot proceed without additional proof. Every decision has an owner.'
  },
  {
    number: '04',
    title: 'Build the Evidence Path',
    description:
      'Keep the resulting posture reconstructible through review packets, thresholds, decision logs, and follow-through cadence. The trail must survive later scrutiny.'
  }
];

const METHOD_STEPS_FR = [
  {
    number: '01',
    title: 'Lire la source de pression',
    description:
      'Commencer par la condition d\'examen reelle : approvisionnement, audit, diligence fournisseur, lancement, incident ou supervision de direction. Le point d\'entree faconne tout le reste.'
  },
  {
    number: '02',
    title: 'Fixer des seuils deterministes',
    description:
      'Rendre les declencheurs de revue, les frontieres de risque et les conditions d\'approbation assez explicites pour que plusieurs examinateurs arrivent a la meme logique. L\'ambiguite est l\'ennemi de la gouvernance.'
  },
  {
    number: '03',
    title: 'Attribuer les decisions',
    description:
      'Nommer qui decide, qui escalade, ce qui doit etre documente et ce qui ne peut pas avancer sans preuve supplementaire. Chaque decision a un responsable.'
  },
  {
    number: '04',
    title: 'Construire la piste de preuve',
    description:
      'Garder la posture obtenue reconstructible au moyen de dossiers de revue, de seuils, de journaux de decision et d\'une cadence de suivi. La piste doit survivre a l\'examen ulterieur.'
  }
];

const ARTIFACTS = [
  {
    title: 'Decision Matrix',
    description: 'Shows who approves, who escalates, and what gets recorded. The governance logic made visible.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="20" height="20" rx="1" stroke="#D4A853" strokeWidth="1.5" />
        <path d="M4 10h20M10 10v14M4 16h20" stroke="#D4A853" strokeWidth="1.2" opacity="0.6" />
      </svg>
    )
  },
  {
    title: 'Threshold Map',
    description: 'Defines which systems require deeper review, when they escalate, and what evidence burden follows.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4v20M4 14h20" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="4" stroke="#D4A853" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="9" stroke="#D4A853" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  },
  {
    title: 'Review Packet',
    description: 'Assembles the materials a buyer, auditor, or committee can actually follow without rebuilding the logic.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M8 4h12l4 4v16H4V4h4" stroke="#D4A853" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 4v4h4" stroke="#D4A853" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 13h12M8 17h8" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Post-mortem Record',
    description: 'Reconstructs failure, exposes control gaps, and narrows what should change next.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4L4 10v8l10 6 10-6v-8L14 4z" stroke="#D4A853" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 10l10 6 10-6" stroke="#D4A853" strokeWidth="1.2" opacity="0.5" />
        <path d="M14 16v8" stroke="#D4A853" strokeWidth="1.2" opacity="0.5" />
      </svg>
    )
  }
];

const ARTIFACTS_FR = [
  {
    title: 'Matrice decisionnelle',
    description: 'Montre qui approuve, qui escalade et ce qui est consigne. La logique de gouvernance rendue visible.',
    icon: ARTIFACTS[0].icon
  },
  {
    title: 'Carte des seuils',
    description: 'Definit quels systemes demandent une revue plus poussee, quand ils escaladent et quelle charge de preuve suit.',
    icon: ARTIFACTS[1].icon
  },
  {
    title: 'Dossier de revue',
    description: 'Assemble les pieces qu\'un acheteur, un auditeur ou un comite peut vraiment suivre sans refaire toute la logique.',
    icon: ARTIFACTS[2].icon
  },
  {
    title: 'Dossier post-mortem',
    description: 'Reconstitue l\'echec, expose les lacunes de controle et resserre ce qui doit changer ensuite.',
    icon: ARTIFACTS[3].icon
  }
];

const SERVICES = [
  {
    tag: 'Baseline',
    title: 'Deterministic Governance',
    subtitle: 'Establish the foundation',
    description:
      'Establish explicit thresholds, decision rights, and a stable governance baseline before scrutiny compounds ambiguity. The right starting point for organizations building governance from the ground up.',
    features: ['Decision rights mapping', 'Threshold documentation', 'Escalation logic design', 'Governance baseline packet']
  },
  {
    tag: 'Pre-launch',
    title: 'Pre-mortem Review',
    subtitle: 'Pressure-test before exposure',
    description:
      'Pressure-test an AI system before launch, procurement, onboarding, or major expansion changes the stakes. Identify governance gaps before a reviewer does.',
    features: ['Pre-launch risk mapping', 'Threshold stress-testing', 'Evidence gap analysis', 'Review-ready documentation'],
    featured: true
  },
  {
    tag: 'Post-incident',
    title: 'Post-mortem Review',
    subtitle: 'Reconstruct and strengthen',
    description:
      'Reconstruct incidents, failed reviews, or governance drift and turn the findings into a stronger control posture. Learn from what broke and build a posture that holds.',
    features: ['Incident reconstruction', 'Control gap identification', 'Governance drift analysis', 'Remediation roadmap']
  }
];

const SERVICES_FR = [
  {
    tag: 'Base',
    title: 'Gouvernance deterministe',
    subtitle: 'Etablir la fondation',
    description:
      'Etablir des seuils explicites, des droits decisionnels clairs et une base de gouvernance stable avant que l\'examen n\'amplifie l\'ambiguite. Le bon point de depart pour les organisations qui construisent leur gouvernance.',
    features: ['Cartographie des droits decisionnels', 'Documentation des seuils', 'Conception de la logique d\'escalade', 'Dossier de base de gouvernance']
  },
  {
    tag: 'Pre-lancement',
    title: 'Revue pre-mortem',
    subtitle: 'Tester avant l\'exposition',
    description:
      'Mettre un systeme d\'IA sous pression avant le lancement, l\'approvisionnement, l\'integration ou une expansion majeure. Reperer les ecarts de gouvernance avant qu\'un examinateur le fasse.',
    features: ['Cartographie des risques pre-lancement', 'Stress test des seuils', 'Analyse des ecarts de preuve', 'Documentation prete pour la revue'],
    featured: true
  },
  {
    tag: 'Post-incident',
    title: 'Revue post-mortem',
    subtitle: 'Reconstituer et renforcer',
    description:
      'Reconstituer les incidents, les revues ratees ou la derive de gouvernance, puis transformer les constats en posture de controle plus solide. Apprendre de ce qui a cede et rebuilder une posture qui tient.',
    features: ['Reconstitution d\'incident', 'Identification des lacunes de controle', 'Analyse de derive de gouvernance', 'Feuille de route de remediation']
  }
];

const FAQS = [
  {
    question: 'When should we engage PHAROS?',
    answer:
      'Use PHAROS when procurement, audit, vendor diligence, or oversight is already shaping the work, or when you know it will. The best time to build governance documentation is before a reviewer asks for it. The second best time is now.'
  },
  {
    question: 'What does a 30-minute review actually produce?',
    answer:
      'A 30-minute review identifies the pressure source (procurement, audit, vendor, oversight), scopes the appropriate route (deterministic governance, pre-mortem, or post-mortem), and defines the first deliverables without overstating current readiness.'
  },
  {
    question: 'How does PHAROS differ from a compliance checklist?',
    answer:
      'Compliance checklists produce a static snapshot. PHAROS produces inspectable controls with explicit thresholds, named decision rights, and a reconstructible evidence path.'
  },
  {
    question: 'Which regulatory frameworks does PHAROS address?',
    answer:
      'PHAROS governance packets can be cross-walked to NIST AI RMF, ISO/IEC 42001, and EU AI Act review duties when the review requires it.'
  },
  {
    question: 'What sectors does PHAROS serve?',
    answer:
      'Representative dossiers span financial services, healthcare, enterprise technology, and public sector review conditions.'
  },
  {
    question: 'What is the typical engagement timeline?',
    answer:
      'Timeline depends on the pressure source and scope. The initial 30-minute review call establishes realistic timelines for your specific condition.'
  },
  {
    question: 'How was PHAROS created?',
    answer: (
      <>
        Start with the{' '}
        <a
          href={TIMELINE_PATH}
          className="font-medium text-[#173D74] underline decoration-[#D4A853]/70 underline-offset-4 hover:text-[#0F1923] transition-colors duration-200"
        >
          research timeline
        </a>
        . From there, you can open the governance tree and the linked SKILL ecosystem paper that document the build sequence and governance architecture.
      </>
    )
  }
];

const FAQS_FR = [
  {
    question: 'Quand faut-il faire appel a PHAROS ?',
    answer:
      'Faites appel a PHAROS lorsque l\'approvisionnement, l\'audit, la diligence fournisseur ou la supervision faconnent deja le travail, ou lorsque vous savez qu\'ils le feront bientot. Le meilleur moment pour structurer la gouvernance est avant qu\'un examinateur ne la demande. Le deuxieme meilleur moment, c\'est maintenant.'
  },
  {
    question: 'Que produit concretement une revue de 30 minutes ?',
    answer:
      'Une revue de 30 minutes identifie la source de pression (approvisionnement, audit, fournisseur, supervision), choisit le bon parcours (gouvernance deterministe, pre-mortem ou post-mortem) et definit les premiers livrables sans exagerer le niveau de preparation actuel.'
  },
  {
    question: 'En quoi PHAROS differe-t-il d\'une liste de verification de conformite ?',
    answer:
      'Une liste de verification produit un instantane statique. PHAROS produit des controles inspectables avec des seuils explicites, des droits decisionnels nommes et une piste de preuve reconstructible.'
  },
  {
    question: 'Quels cadres reglementaires PHAROS peut-il couvrir ?',
    answer:
      'Les dossiers de gouvernance PHAROS peuvent etre croises avec le NIST AI RMF, l\'ISO/IEC 42001 et les obligations de revue du AI Act europeen lorsque la situation l\'exige.'
  },
  {
    question: 'Quels secteurs PHAROS dessert-il ?',
    answer:
      'Les dossiers representatifs couvrent les services financiers, la sante, les technologies d\'entreprise et les contextes d\'examen du secteur public.'
  },
  {
    question: 'Quel est le delai typique d\'un mandat ?',
    answer:
      'Le delai depend de la source de pression et de la portee. L\'appel initial de 30 minutes sert justement a etablir un calendrier realiste pour votre situation.'
  },
  {
    question: 'Comment PHAROS a-t-il ete construit ?',
    answer: (
      <>
        Commencez par la{' '}
        <a
          href={TIMELINE_PATH}
          className="font-medium text-[#173D74] underline decoration-[#D4A853]/70 underline-offset-4 hover:text-[#0F1923] transition-colors duration-200"
        >
          chronologie de recherche
        </a>
        . Vous pourrez ensuite ouvrir l\'arbre de gouvernance et le document du systeme de skills lies qui montrent la sequence de construction et l\'architecture de gouvernance.
      </>
    )
  }
];

const HOME_COPY = {
  en: {
    hero: {
      context: 'Procurement · Audit · Oversight',
      titleLineOne: 'AI governance',
      titleLineTwo: 'that survives',
      emphasis: 'review',
      body:
        'When procurement, audit, or executive review asks how AI is governed, PHAROS helps teams answer with explicit thresholds, named decision rights, and evidence a reviewer can actually follow.',
      primaryCta: 'Book a Review',
      secondaryCta: 'Read the Method',
      scroll: 'Scroll',
      proofPoints: HERO_PROOF_POINTS
    },
    about: {
      eyebrow: 'About PHAROS',
      titleLineOne: 'Built for the moment',
      emphasis: 'scrutiny turns real',
      bodyOne: 'PHAROS is a governance practice for organizations facing live review pressure, not abstract governance theater.',
      bodyTwo:
        'When a buyer, auditor, vendor, or executive committee asks how AI is governed, the useful answer must be inspectable. PHAROS turns ambiguity into explicit thresholds, named decision rights, and documentation that survives the next round of scrutiny.',
      quote:
        'The useful answer is not “we take governance seriously.” It is “here is the threshold, here is the owner, here is the evidence.”',
      stats: [
        { label: 'Sectors', value: 'Financial Services, Healthcare, Enterprise Tech, Public Sector' },
        { label: 'Frameworks', value: 'NIST AI RMF · ISO/IEC 42001 · EU AI Act' }
      ],
      imageAlt: 'AI governance framework visualization',
      noteKicker: 'Most useful when',
      noteTitle: 'Review pressure is already shaping the work.',
      noteItems: REVIEW_PRESSURE_NOTES
    },
    governance: {
      eyebrow: 'PHAROS Standard',
      titleLead: 'A governance posture that stays',
      emphasis: 'legible',
      titleTrail: 'when scrutiny arrives',
      body:
        'Trust here does not come from tone alone. It comes from explicit thresholds, named decisions, and a body of evidence that can actually be inspected.',
      pillars: GOVERNANCE_PILLARS,
      pressureEyebrow: 'Pressure Points',
      pressureTitleLead: 'Governance work starts where live review',
      pressureEmphasis: 'pressure',
      pressureTitleTrail: 'exposes ambiguity',
      pressureBody:
        'PHAROS does not begin with abstract governance theater. It begins where a buyer, auditor, vendor, or executive request makes the missing logic visible.',
      pressurePoints: PRESSURE_POINTS
    },
    methods: {
      eyebrow: 'Method in Four Steps',
      titleLead: 'Read the pressure, set the thresholds, assign the decisions,',
      emphasis: 'keep it reconstructible',
      body:
        'The method matters because it produces inspectable controls rather than vague ethical positioning or generic compliance prose.',
      steps: METHOD_STEPS,
      imageAlt: 'Governance review documents on desk',
      artifactsEyebrow: 'Artifacts',
      artifactsTitleLead: 'Deliverables that make governance',
      artifactsEmphasis: 'credible',
      artifactsBody:
        'The output is not only a posture. It is a usable set of materials that makes thresholds, decisions, and evidence easy to follow later.',
      artifacts: ARTIFACTS
    },
    services: {
      eyebrow: 'Service Routes',
      titleLead: 'Choose the route by',
      emphasis: 'pressure source',
      titleTrail: ', not vocabulary',
      body:
        'The right entry point depends on whether the organization needs a baseline, a pre-mortem before exposure, or a post-mortem after failure or drift.',
      cards: SERVICES,
      featuredLabel: 'Most Common',
      startRoute: 'Start This Route',
      finalTitle: 'Start with a short review, not a vague governance program',
      finalBody:
        'A 30-minute review is enough to identify the pressure source, set the route, and define the first deliverables without overstating readiness.',
      finalCta: 'Book a Review'
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common',
      emphasis: 'questions',
      body:
        'If your question is not here, a 30-minute review call is the fastest way to get a direct answer for your specific review condition.',
      cta: 'Book a Review',
      items: FAQS
    },
    contact: {
      eyebrow: 'Contact',
      titleLead: 'Book a',
      emphasis: '30-minute',
      titleTrail: 'review',
      body:
        'A 30-minute review is enough to identify the pressure source, set the route, and define the first deliverables without overstating current readiness.',
      emailLabel: 'Email',
      responseTimeLabel: 'Response Time',
      responseTimeValue: 'Within 24 business hours',
      submittedTitle: 'Message Received',
      submittedBody: 'We will be in touch within 24 business hours to schedule your review.',
      nameLabel: 'Name *',
      namePlaceholder: 'Your name',
      organizationLabel: 'Organization *',
      organizationPlaceholder: 'Your organization',
      emailFieldLabel: 'Email *',
      emailPlaceholder: 'your@email.com',
      pressureLabel: 'Pressure Source',
      pressurePlaceholder: 'Select the review condition',
      pressureOptions: ['Procurement review', 'Audit preparation', 'Vendor diligence', 'Executive oversight', 'Post-incident review', 'Other'],
      contextLabel: 'Context',
      contextPlaceholder: 'Brief description of your review condition or governance challenge...',
      submit: 'Request a Review'
    }
  },
  fr: {
    hero: {
      context: 'Approvisionnement · Audit · Supervision',
      titleLineOne: 'Une gouvernance',
      titleLineTwo: 'de l\'IA qui tient',
      emphasis: 'a l\'examen',
      body:
        'Quand l\'approvisionnement, l\'audit ou la revue de direction demande comment l\'IA est gouvernee, PHAROS aide les equipes a repondre avec des seuils explicites, des droits decisionnels nommes et une preuve qu\'un examinateur peut vraiment suivre.',
      primaryCta: 'Reserver une revue',
      secondaryCta: 'Lire la methode',
      scroll: 'Defiler',
      proofPoints: [
        {
          label: 'Seuils declares',
          value: 'Aucun seuil implicite',
          body: 'Les conditions de revue sont nommees avant de devenir des arguments.'
        },
        {
          label: 'Decisions attribuees',
          value: 'Le responsable avant l\'opinion',
          body: 'Qui decide, qui escalade et ce qui doit etre consigne reste explicite.'
        },
        {
          label: 'Preuve reconstructible',
          value: 'Prete pour l\'examen ulterieur',
          body: 'La reponse tient devant l\'approvisionnement, l\'audit et la revue de direction.'
        }
      ]
    },
    about: {
      eyebrow: 'A propos de PHAROS',
      titleLineOne: 'Concu pour le moment',
      emphasis: 'ou l\'examen devient concret',
      bodyOne: 'PHAROS est une pratique de gouvernance pour les organisations qui font face a une vraie pression d\'examen, pas a un theatre de gouvernance abstrait.',
      bodyTwo:
        'Quand un acheteur, un auditeur, un fournisseur ou un comite de direction demande comment l\'IA est gouvernee, la reponse utile doit pouvoir etre inspectee. PHAROS transforme l\'ambiguite en seuils explicites, en droits decisionnels nommes et en documentation qui tient au prochain tour d\'examen.',
      quote:
        'La reponse utile n\'est pas « nous prenons la gouvernance au serieux ». C\'est « voici le seuil, voici le responsable, voici la preuve ».',
      stats: [
        { label: 'Secteurs', value: 'Services financiers, sante, techno d\'entreprise, secteur public' },
        { label: 'Cadres', value: 'NIST AI RMF · ISO/IEC 42001 · EU AI Act' }
      ],
      imageAlt: 'Visualisation d\'un cadre de gouvernance de l\'IA',
      noteKicker: 'Le plus utile quand',
      noteTitle: 'La pression d\'examen faconne deja le travail.',
      noteItems: REVIEW_PRESSURE_NOTES_FR
    },
    governance: {
      eyebrow: 'Standard PHAROS',
      titleLead: 'Une posture de gouvernance qui reste',
      emphasis: 'lisible',
      titleTrail: 'quand l\'examen arrive',
      body:
        'La confiance ici ne vient pas du ton seulement. Elle vient de seuils explicites, de decisions nommees et d\'un ensemble de preuves qu\'on peut vraiment inspecter.',
      pillars: GOVERNANCE_PILLARS_FR,
      pressureEyebrow: 'Points de pression',
      pressureTitleLead: 'Le travail de gouvernance commence la ou la vraie',
      pressureEmphasis: 'pression',
      pressureTitleTrail: 'revele l\'ambiguite',
      pressureBody:
        'PHAROS ne commence pas par un theatre de gouvernance abstrait. Il commence la ou une demande d\'acheteur, d\'auditeur, de fournisseur ou de direction rend la logique manquante visible.',
      pressurePoints: PRESSURE_POINTS_FR
    },
    methods: {
      eyebrow: 'Methode en quatre etapes',
      titleLead: 'Lire la pression, fixer les seuils, attribuer les decisions,',
      emphasis: 'garder la piste reconstructible',
      body:
        'La methode compte parce qu\'elle produit des controles inspectables plutot qu\'une posture ethique vague ou une prose generique de conformite.',
      steps: METHOD_STEPS_FR,
      imageAlt: 'Documents de revue de gouvernance sur un bureau',
      artifactsEyebrow: 'Artefacts',
      artifactsTitleLead: 'Des livrables qui rendent la gouvernance',
      artifactsEmphasis: 'credible',
      artifactsBody:
        'Le resultat n\'est pas seulement une posture. C\'est un ensemble de materiaux utilisables qui rend les seuils, les decisions et la preuve faciles a suivre plus tard.',
      artifacts: ARTIFACTS_FR
    },
    services: {
      eyebrow: 'Parcours de service',
      titleLead: 'Choisir le parcours selon la',
      emphasis: 'source de pression',
      titleTrail: ', pas selon le vocabulaire',
      body:
        'Le bon point d\'entree depend de ce dont l\'organisation a besoin : une base, un pre-mortem avant l\'exposition ou un post-mortem apres un echec ou une derive.',
      cards: SERVICES_FR,
      featuredLabel: 'Le plus frequent',
      startRoute: 'Commencer ce parcours',
      finalTitle: 'Commencer par une courte revue, pas par un programme vague',
      finalBody:
        'Une revue de 30 minutes suffit pour reperer la source de pression, choisir le parcours et cadrer les premiers livrables sans survendre l\'etat de preparation.',
      finalCta: 'Reserver une revue'
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions',
      emphasis: 'courantes',
      body:
        'Si votre question n\'est pas ici, un appel de revue de 30 minutes reste le moyen le plus rapide d\'obtenir une reponse directe pour votre condition d\'examen.',
      cta: 'Reserver une revue',
      items: FAQS_FR
    },
    contact: {
      eyebrow: 'Contact',
      titleLead: 'Reserver une revue de',
      emphasis: '30 minutes',
      titleTrail: '',
      body:
        'Une revue de 30 minutes suffit pour identifier la source de pression, choisir le parcours et definir les premiers livrables sans exagerer l\'etat de preparation actuel.',
      emailLabel: 'Courriel',
      responseTimeLabel: 'Delai de reponse',
      responseTimeValue: 'Dans les 24 heures ouvrables',
      submittedTitle: 'Message recu',
      submittedBody: 'Nous communiquerons avec vous dans les 24 heures ouvrables pour fixer votre revue.',
      nameLabel: 'Nom *',
      namePlaceholder: 'Votre nom',
      organizationLabel: 'Organisation *',
      organizationPlaceholder: 'Votre organisation',
      emailFieldLabel: 'Courriel *',
      emailPlaceholder: 'votre@courriel.ca',
      pressureLabel: 'Source de pression',
      pressurePlaceholder: 'Choisissez la condition d\'examen',
      pressureOptions: ['Revue d\'approvisionnement', 'Preparation a l\'audit', 'Diligence fournisseur', 'Supervision de direction', 'Revue post-incident', 'Autre'],
      contextLabel: 'Contexte',
      contextPlaceholder: 'Breve description de votre condition d\'examen ou de votre defi de gouvernance...',
      submit: 'Demander une revue'
    }
  }
};

const HOME_SURFACE_POLISH = `
  .home-newlook .pharos-hero-topline {
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .home-newlook .pharos-hero-wordmark {
    color: #f6f1e6;
    font-family: 'Space Mono', monospace;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.38em;
    text-transform: uppercase;
  }

  .home-newlook .pharos-hero-context {
    color: rgba(255, 255, 255, 0.56);
    font-family: 'Lato', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .home-newlook .pharos-hero-proof-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 3.2rem;
    max-width: 58rem;
  }

  .home-newlook .pharos-hero-proof {
    padding: 1rem 1.05rem;
    border: 1px solid rgba(212, 168, 83, 0.22);
    background: rgba(7, 17, 30, 0.5);
    backdrop-filter: blur(14px);
  }

  .home-newlook .pharos-hero-proof-label {
    display: block;
    margin-bottom: 0.38rem;
    color: rgba(212, 168, 83, 0.82);
    font-family: 'Space Mono', monospace;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .home-newlook .pharos-hero-proof-value {
    display: block;
    margin-bottom: 0.42rem;
    color: #f7f4ec;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.1;
  }

  .home-newlook .pharos-hero-proof-body {
    color: rgba(255, 255, 255, 0.6);
    font-family: 'Lato', sans-serif;
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .home-newlook .pharos-editorial-note {
    border: 1px solid rgba(212, 168, 83, 0.3);
    background: linear-gradient(180deg, rgba(15, 25, 35, 0.96) 0%, rgba(19, 31, 46, 0.92) 100%);
    box-shadow: 0 22px 44px rgba(4, 10, 18, 0.28);
  }

  .home-newlook .pharos-editorial-note-kicker {
    color: rgba(212, 168, 83, 0.82);
    font-family: 'Space Mono', monospace;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .home-newlook .pharos-editorial-note-list {
    display: grid;
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .home-newlook .pharos-editorial-note-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    color: rgba(255, 255, 255, 0.72);
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    line-height: 1.5;
  }

  .home-newlook .pharos-editorial-note-dot {
    width: 0.45rem;
    height: 0.45rem;
    margin-top: 0.38rem;
    border-radius: 999px;
    background: #d4a853;
    flex-shrink: 0;
  }

  .home-newlook .pharos-route-card {
    transition:
      transform 220ms ease,
      box-shadow 220ms ease,
      border-color 220ms ease,
      background-color 220ms ease;
  }

  .home-newlook .pharos-route-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  }

  .home-newlook .pharos-route-card-featured {
    background: linear-gradient(180deg, rgba(15, 25, 35, 0.98) 0%, rgba(17, 32, 49, 0.96) 100%);
    box-shadow: 0 28px 60px rgba(3, 9, 16, 0.32);
  }

  @media (max-width: 1024px) {
    .home-newlook .pharos-hero-proof-grid {
      grid-template-columns: 1fr;
      max-width: 30rem;
    }
  }

  @media (max-width: 768px) {
    .home-newlook .pharos-hero-topline {
      gap: 0.7rem;
      margin-bottom: 1.4rem;
    }

    .home-newlook .pharos-hero-wordmark {
      letter-spacing: 0.26em;
    }

    .home-newlook .pharos-hero-context {
      width: 100%;
    }
  }
`;

function HeroSection({ copy }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: '#0F1923' }}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundPosition: 'center 20%'
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(15,25,35,0.97) 0%, rgba(15,25,35,0.88) 45%, rgba(15,25,35,0.55) 70%, rgba(15,25,35,0.3) 100%)'
        }}
      />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-20 w-full">
        <div className="max-w-4xl">
          <div className={`flex flex-wrap pharos-hero-topline transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="pharos-hero-wordmark">
              PHAROS
            </span>
            <span className="block w-12 h-px bg-[#D4A853]" />
            <span className="pharos-hero-context">
              {copy.context}
            </span>
          </div>

          <h1
            className={`text-white leading-[1.05] mb-8 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              fontWeight: 600
            }}
          >
            {copy.titleLineOne}
            <br />
            {copy.titleLineTwo}
            <br />
            <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em>
          </h1>

          <p
            className={`text-white/70 text-lg leading-relaxed mb-10 max-w-xl transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
          >
            {copy.body}
          </p>

          <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0F1923] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#E8C87A] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {copy.primaryCta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#methods"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-sm font-bold tracking-[0.15em] uppercase hover:border-[#D4A853] hover:text-[#D4A853] transition-all duration-200"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {copy.secondaryCta}
            </a>
          </div>

          <div className={`pharos-hero-proof-grid transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {copy.proofPoints.map((point) => (
              <div key={point.label} className="pharos-hero-proof">
                <span className="pharos-hero-proof-label">{point.label}</span>
                <span className="pharos-hero-proof-value">{point.value}</span>
                <p className="pharos-hero-proof-body">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-white/50 text-xs tracking-widest uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
          {copy.scroll}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function AboutSection({ copy }) {
  return (
    <section id="about" className="py-28 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {copy.eyebrow}
            </span>
            <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />

            <h2
              className="text-[#1C1C1E] leading-tight mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                fontWeight: 600
              }}
            >
              {copy.titleLineOne}
              <br />
              <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em>
            </h2>

            <p className="text-[#4A5568] text-base leading-relaxed mb-6" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.bodyOne}
            </p>

            <p className="text-[#4A5568] text-base leading-relaxed mb-8" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.bodyTwo}
            </p>

            <blockquote className="border-l-2 border-[#D4A853] pl-6 py-2 mb-8">
              <p className="text-[#1C1C1E] text-xl italic leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                {copy.quote}
              </p>
            </blockquote>

            <div className="flex flex-wrap gap-6">
              {copy.stats.map((item) => (
                <div key={item.label} className="flex-1 min-w-[200px]">
                  <span className="block text-[#D4A853] text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {item.label}
                  </span>
                  <span className="text-[#4A5568] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-2 relative">
            <div className="relative overflow-hidden about-photo-frame">
              <img src={GOVERNANCE_IMG} alt={copy.imageAlt} className="w-full h-[480px] object-cover" style={{ filter: 'brightness(0.9)' }} />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#D4A853]/30 pointer-events-none" style={{ zIndex: -1 }} />
              <span className="about-photo-corner about-photo-corner-tl" aria-hidden="true" />
              <span className="about-photo-corner about-photo-corner-tr" aria-hidden="true" />
              <span className="about-photo-corner about-photo-corner-bl" aria-hidden="true" />
              <span className="about-photo-corner about-photo-corner-br" aria-hidden="true" />
            </div>

            <div className="absolute -bottom-6 -left-6 pharos-editorial-note p-6" style={{ maxWidth: '240px' }}>
              <p className="pharos-editorial-note-kicker">{copy.noteKicker}</p>
              <p className="text-white text-lg leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {copy.noteTitle}
              </p>
              <div className="pharos-editorial-note-list">
                {copy.noteItems.map((item) => (
                  <div key={item} className="pharos-editorial-note-item">
                    <span className="pharos-editorial-note-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GovernanceSection({ copy }) {
  return (
    <>
      <section id="governance" className="py-28 bg-[#0F1923]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16 reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {copy.eyebrow}
            </span>
            <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
            <h2
              className="text-white leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 600
              }}
            >
              {copy.titleLead} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em> {copy.titleTrail}
            </h2>
            <p className="text-white/60 text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.body}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {copy.pillars.map((pillar, i) => (
              <div key={pillar.number} className={`reveal reveal-delay-${i + 1} bg-[#0F1923] p-10 group hover:bg-[#162030] transition-colors duration-300`}>
                <div className="flex items-start gap-6">
                  <span className="text-[#D4A853]/50 text-5xl leading-none flex-shrink-0 group-hover:text-[#D4A853] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                    {pillar.number}
                  </span>
                  <div>
                    <h3 className="text-white text-xl mb-3 group-hover:text-[#D4A853] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                      {pillar.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16 reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {copy.pressureEyebrow}
            </span>
            <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
            <h2
              className="text-[#1C1C1E] leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 600
              }}
            >
              {copy.pressureTitleLead} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.pressureEmphasis}</em> {copy.pressureTitleTrail}
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.pressureBody}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.pressurePoints.map((point, i) => (
              <div key={point.title} className={`reveal reveal-delay-${i + 1} pharos-card bg-white border border-[#E8E4DC] p-8 group`}>
                <div className="mb-5 w-12 h-12 flex items-center justify-center border border-[#D4A853]/30 group-hover:border-[#D4A853] transition-colors duration-300">
                  {point.icon}
                </div>
                <h3 className="text-[#1C1C1E] text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                  {point.title}
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MethodsSection({ copy }) {
  return (
    <>
      <section id="methods" className="py-28 bg-[#0F1923]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-16 lg:gap-24 items-start">
            <div>
              <div className="reveal mb-12">
                <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {copy.eyebrow}
                </span>
                <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
                <h2
                  className="text-white leading-tight mb-6"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                    fontWeight: 600
                  }}
                >
                  {copy.titleLead} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em>
                </h2>
                <p className="text-white/70 text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                  {copy.body}
                </p>
              </div>

              <div className="space-y-0">
                {copy.steps.map((step, i) => (
                  <div key={step.number} className={`reveal reveal-delay-${i + 1} flex gap-6 py-8 border-b border-white/15 last:border-0 group`}>
                    <span className="text-[#D4A853]/30 text-5xl leading-none flex-shrink-0 font-bold group-hover:text-[#D4A853]/60 transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                        {step.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal reveal-delay-2 lg:sticky lg:top-24">
              <div className="relative">
                <img src={DESK_IMG} alt={copy.imageAlt} className="w-full h-[500px] object-cover" />
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#D4A853] pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#D4A853] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16 reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {copy.artifactsEyebrow}
            </span>
            <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
            <h2
              className="text-[#1C1C1E] leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 600
              }}
            >
              {copy.artifactsTitleLead} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.artifactsEmphasis}</em>
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.artifactsBody}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8E4DC]">
            {copy.artifacts.map((artifact, i) => (
              <div key={artifact.title} className={`reveal reveal-delay-${i + 1} bg-white border border-[#E8E4DC] p-10 group hover:bg-[#F5F0E8] transition-colors duration-300`}>
                <div className="mb-6">{artifact.icon}</div>
                <h3 className="text-[#1C1C1E] text-xl mb-3 group-hover:text-[#D4A853] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                  {artifact.title}
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                  {artifact.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServicesSection({ copy }) {
  return (
    <section id="services" className="py-28 bg-[#0F1923]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16 reveal">
          <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {copy.eyebrow}
          </span>
          <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
          <h2
            className="text-white leading-tight mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 600
            }}
          >
            {copy.titleLead} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em>{copy.titleTrail}
          </h2>
          <p className="text-white/70 text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
            {copy.body}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {copy.cards.map((service, i) => (
            <div
              key={service.title}
              className={`reveal reveal-delay-${i + 1} pharos-route-card relative flex flex-col ${
                service.featured ? 'bg-[#0F1923] text-white border border-[#D4A853]/35' : 'bg-white border border-[#E8E4DC] text-[#1C1C1E]'
              } ${service.featured ? 'pharos-route-card-featured' : ''} p-10 group`}
            >
              <div className="flex items-center justify-between mb-8">
                <span
                  className={`text-xs tracking-[0.25em] uppercase px-3 py-1 ${
                    service.featured ? 'bg-[#D4A853]/20 text-[#D4A853]' : 'bg-[#F5F0E8] text-[#D4A853]'
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {service.tag}
                </span>
                {service.featured && (
                  <span className="text-xs text-[#D4A853] tracking-widest uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.featuredLabel}
                  </span>
                )}
              </div>

              <h3 className={`text-2xl mb-2 ${service.featured ? 'text-white' : 'text-[#1C1C1E]'}`} style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {service.title}
              </h3>
              <p className="text-sm mb-6 text-[#D4A853]" style={{ fontFamily: "'Lato', sans-serif" }}>
                {service.subtitle}
              </p>

              <p className={`text-sm leading-relaxed mb-8 flex-1 ${service.featured ? 'text-white/60' : 'text-[#4A5568]'}`} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                {service.description}
              </p>

              <ul className="space-y-3 mb-10">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] flex-shrink-0" />
                    <span className={`text-sm ${service.featured ? 'text-white/70' : 'text-[#4A5568]'}`} style={{ fontFamily: "'Lato', sans-serif" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex items-center gap-3 text-sm font-bold tracking-[0.1em] uppercase transition-all duration-200 ${
                  service.featured ? 'text-[#D4A853] hover:text-[#E8C87A]' : 'text-[#1C1C1E] hover:text-[#D4A853]'
                }`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {copy.startRoute}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {service.featured && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4A853]" />}
            </div>
          ))}
        </div>

        <div className="reveal bg-[#0F1923] border border-[#D4A853]/30 p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-white text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              {copy.finalTitle}
            </h3>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.finalBody}
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0F1923] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#E8C87A] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)] whitespace-nowrap"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {copy.finalCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ copy }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-28 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr,1.8fr] gap-16 lg:gap-24">
          <div className="reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {copy.eyebrow}
            </span>
            <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
            <h2
              className="text-[#1C1C1E] leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 600
              }}
            >
              {copy.title} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em>
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed mb-8" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.body}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 text-[#1C1C1E] text-sm font-bold tracking-[0.1em] uppercase hover:text-[#D4A853] transition-colors duration-200"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {copy.cta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="reveal reveal-delay-2 space-y-0">
            {copy.items.map((faq, i) => (
              <div key={faq.question} className="border-b border-[#E8E4DC] last:border-b">
                <button className="w-full flex items-center justify-between py-6 text-left group" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  <span className="text-[#1C1C1E] text-lg pr-8 group-hover:text-[#D4A853] transition-colors duration-200" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center border border-[#D4A853]/40 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-45' : ''
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6 1v10M1 6h10" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="text-[#4A5568] text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ copy }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    pressure: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-28 bg-[#0F1923]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-16 lg:gap-24">
          <div className="reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {copy.eyebrow}
            </span>
            <span className="block w-12 h-0.5 bg-[#D4A853] mb-8" />
            <h2
              className="text-white leading-tight mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 600
              }}
            >
              {copy.titleLead} <em style={{ color: '#D4A853', fontStyle: 'italic' }}>{copy.emphasis}</em> {copy.titleTrail}
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              {copy.body}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-[#D4A853]/30">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 4h12l1 1v8l-1 1H3l-1-1V5l1-1z" stroke="#D4A853" strokeWidth="1.2" />
                    <path d="M2 5l7 5 7-5" stroke="#D4A853" strokeWidth="1.2" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.emailLabel}
                  </p>
                  <a href="mailto:pharos@pharos-ai.ca" className="text-white text-sm hover:text-[#D4A853] transition-colors duration-200" style={{ fontFamily: "'Lato', sans-serif" }}>
                    pharos@pharos-ai.ca
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-[#D4A853]/30">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="#D4A853" strokeWidth="1.2" />
                    <path d="M9 5v4l3 2" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.responseTimeLabel}
                  </p>
                  <p className="text-white text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.responseTimeValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 flex items-center justify-center border border-[#D4A853] mb-6">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M6 14l6 6 10-10" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-white text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                  {copy.submittedTitle}
                </h3>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {copy.submittedBody}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      {copy.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20"
                      placeholder={copy.namePlaceholder}
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      {copy.organizationLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(event) => setFormData({ ...formData, organization: event.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20"
                      placeholder={copy.organizationPlaceholder}
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.emailFieldLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20"
                    placeholder={copy.emailPlaceholder}
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.pressureLabel}
                  </label>
                  <select
                    value={formData.pressure}
                    onChange={(event) => setFormData({ ...formData, pressure: event.target.value })}
                    className="w-full bg-[#0F1923] border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <option value="" className="bg-[#0F1923]">
                      {copy.pressurePlaceholder}
                    </option>
                    {copy.pressureOptions.map((option) => (
                      <option key={option} value={option} className="bg-[#0F1923]">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {copy.contextLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20 resize-none"
                    placeholder={copy.contextPlaceholder}
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0F1923] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#E8C87A] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)]"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {copy.submit}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language] || HOME_COPY.en;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.home-newlook .reveal');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-newlook min-h-screen" data-testid="home-page">
      <style>{HOME_SURFACE_POLISH}</style>
      <HeroSection copy={copy.hero} />
      <AboutSection copy={copy.about} />
      <GovernanceSection copy={copy.governance} />
      <MethodsSection copy={copy.methods} />
      <ServicesSection copy={copy.services} />
      <FAQSection copy={copy.faq} />
      <ContactSection copy={copy.contact} />
    </div>
  );
}
