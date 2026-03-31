import { useEffect, useState } from 'react';
import deskReferenceImage from '../assets/pharos-documents-desk-reference.png';
import './Home.newlook.css';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663476837393/Rxa9sVq4AbrYE3FRZFywvK/pharos-hero-lighthouse-h9QXVQpbrL37sEHw8pxMfR.webp';
const GOVERNANCE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663476837393/Rxa9sVq4AbrYE3FRZFywvK/pharos-governance-abstract-iSC7d8YMMfBcBt4Wc9W8Zd.webp';
const DESK_IMG = deskReferenceImage;

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
          href="/pharos-ai-site/index.html#timeline"
          className="font-medium text-[#173D74] underline decoration-[#D4A853]/70 underline-offset-4 hover:text-[#0F1923] transition-colors duration-200"
        >
          research timeline
        </a>
        . From there, you can open the governance tree and the linked SKILL ecosystem paper that document the build sequence and governance architecture.
      </>
    )
  }
];

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

function HeroSection() {
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
              Procurement · Audit · Oversight
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
            AI governance
            <br />
            that survives
            <br />
            <em style={{ color: '#D4A853', fontStyle: 'italic' }}>review</em>
          </h1>

          <p
            className={`text-white/70 text-lg leading-relaxed mb-10 max-w-xl transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
          >
            When procurement, audit, or executive review asks how AI is governed, PHAROS helps teams answer with explicit thresholds,
            named decision rights, and evidence a reviewer can actually follow.
          </p>

          <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0F1923] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#E8C87A] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Book a Review
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#methods"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-sm font-bold tracking-[0.15em] uppercase hover:border-[#D4A853] hover:text-[#D4A853] transition-all duration-200"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Read the Method
            </a>
          </div>

          <div className={`pharos-hero-proof-grid transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {HERO_PROOF_POINTS.map((point) => (
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
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-28 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              About PHAROS
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
              Built for the moment
              <br />
              <em style={{ color: '#D4A853', fontStyle: 'italic' }}>scrutiny turns real</em>
            </h2>

            <p className="text-[#4A5568] text-base leading-relaxed mb-6" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              PHAROS is a governance practice for organizations facing live review pressure, not abstract governance theater.
            </p>

            <p className="text-[#4A5568] text-base leading-relaxed mb-8" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              When a buyer, auditor, vendor, or executive committee asks how AI is governed, the useful answer must be inspectable.
              PHAROS turns ambiguity into explicit thresholds, named decision rights, and documentation that survives the next round of scrutiny.
            </p>

            <blockquote className="border-l-2 border-[#D4A853] pl-6 py-2 mb-8">
              <p className="text-[#1C1C1E] text-xl italic leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                The useful answer is not “we take governance seriously.” It is “here is the threshold, here is the owner, here is the evidence.”
              </p>
            </blockquote>

            <div className="flex flex-wrap gap-6">
              {[
                { label: 'Sectors', value: 'Financial Services, Healthcare, Enterprise Tech, Public Sector' },
                { label: 'Frameworks', value: 'NIST AI RMF · ISO/IEC 42001 · EU AI Act' }
              ].map((item) => (
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
              <img src={GOVERNANCE_IMG} alt="AI governance framework visualization" className="w-full h-[480px] object-cover" style={{ filter: 'brightness(0.9)' }} />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#D4A853]/30 pointer-events-none" style={{ zIndex: -1 }} />
              <span className="about-photo-corner about-photo-corner-tl" aria-hidden="true" />
              <span className="about-photo-corner about-photo-corner-tr" aria-hidden="true" />
              <span className="about-photo-corner about-photo-corner-bl" aria-hidden="true" />
              <span className="about-photo-corner about-photo-corner-br" aria-hidden="true" />
            </div>

            <div className="absolute -bottom-6 -left-6 pharos-editorial-note p-6" style={{ maxWidth: '240px' }}>
              <p className="pharos-editorial-note-kicker">Most useful when</p>
              <p className="text-white text-lg leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                Review pressure is already shaping the work.
              </p>
              <div className="pharos-editorial-note-list">
                {REVIEW_PRESSURE_NOTES.map((item) => (
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

function GovernanceSection() {
  return (
    <>
      <section id="governance" className="py-28 bg-[#0F1923]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16 reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              PHAROS Standard
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
              A governance posture that stays <em style={{ color: '#D4A853', fontStyle: 'italic' }}>legible</em> when scrutiny arrives
            </h2>
            <p className="text-white/60 text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              Trust here does not come from tone alone. It comes from explicit thresholds, named decisions, and a body of evidence that can actually be inspected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {GOVERNANCE_PILLARS.map((pillar, i) => (
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
              Pressure Points
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
              Governance work starts where live review <em style={{ color: '#D4A853', fontStyle: 'italic' }}>pressure</em> exposes ambiguity
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              PHAROS does not begin with abstract governance theater. It begins where a buyer, auditor, vendor, or executive request makes the missing logic visible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESSURE_POINTS.map((point, i) => (
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

function MethodsSection() {
  return (
    <>
      <section id="methods" className="py-28 bg-[#0F1923]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-16 lg:gap-24 items-start">
            <div>
              <div className="reveal mb-12">
                <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  Method in Four Steps
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
                  Read the pressure, set the thresholds, assign the decisions, <em style={{ color: '#D4A853', fontStyle: 'italic' }}>keep it reconstructible</em>
                </h2>
                <p className="text-white/70 text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                  The method matters because it produces inspectable controls rather than vague ethical positioning or generic compliance prose.
                </p>
              </div>

              <div className="space-y-0">
                {METHOD_STEPS.map((step, i) => (
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
                <img src={DESK_IMG} alt="Governance review documents on desk" className="w-full h-[500px] object-cover" />
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
              Artifacts
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
              Deliverables that make governance <em style={{ color: '#D4A853', fontStyle: 'italic' }}>credible</em>
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              The output is not only a posture. It is a usable set of materials that makes thresholds, decisions, and evidence easy to follow later.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8E4DC]">
            {ARTIFACTS.map((artifact, i) => (
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

function ServicesSection() {
  return (
    <section id="services" className="py-28 bg-[#0F1923]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16 reveal">
          <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Service Routes
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
            Choose the route by <em style={{ color: '#D4A853', fontStyle: 'italic' }}>pressure source</em>, not vocabulary
          </h2>
          <p className="text-white/70 text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
            The right entry point depends on whether the organization needs a baseline, a pre-mortem before exposure, or a post-mortem after failure or drift.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service, i) => (
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
                    Most Common
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
                Start This Route
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
              Start with a short review, not a vague governance program
            </h3>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              A 30-minute review is enough to identify the pressure source, set the route, and define the first deliverables without overstating readiness.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0F1923] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#E8C87A] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)] whitespace-nowrap"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Book a Review
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-28 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr,1.8fr] gap-16 lg:gap-24">
          <div className="reveal">
            <span className="block text-[#D4A853] text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              FAQ
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
              Common <em style={{ color: '#D4A853', fontStyle: 'italic' }}>questions</em>
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed mb-8" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              If your question is not here, a 30-minute review call is the fastest way to get a direct answer for your specific review condition.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 text-[#1C1C1E] text-sm font-bold tracking-[0.1em] uppercase hover:text-[#D4A853] transition-colors duration-200"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Book a Review
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="reveal reveal-delay-2 space-y-0">
            {FAQS.map((faq, i) => (
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

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    pressure: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const pressureOptions = ['Procurement review', 'Audit preparation', 'Vendor diligence', 'Executive oversight', 'Post-incident review', 'Other'];

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
              Contact
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
              Book a <em style={{ color: '#D4A853', fontStyle: 'italic' }}>30-minute</em> review
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              A 30-minute review is enough to identify the pressure source, set the route, and define the first deliverables without overstating current readiness.
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
                    Email
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
                    Response Time
                  </p>
                  <p className="text-white text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Within 24 business hours
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
                  Message Received
                </h3>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                  We will be in touch within 24 business hours to schedule your review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20"
                      placeholder="Your name"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(event) => setFormData({ ...formData, organization: event.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20"
                      placeholder="Your organization"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20"
                    placeholder="your@email.com"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Pressure Source
                  </label>
                  <select
                    value={formData.pressure}
                    onChange={(event) => setFormData({ ...formData, pressure: event.target.value })}
                    className="w-full bg-[#0F1923] border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <option value="" className="bg-[#0F1923]">
                      Select the review condition
                    </option>
                    {pressureOptions.map((option) => (
                      <option key={option} value={option} className="bg-[#0F1923]">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Context
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors duration-200 placeholder-white/20 resize-none"
                    placeholder="Brief description of your review condition or governance challenge..."
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0F1923] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#E8C87A] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)]"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Request a Review
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
      <HeroSection />
      <AboutSection />
      <GovernanceSection />
      <MethodsSection />
      <ServicesSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
