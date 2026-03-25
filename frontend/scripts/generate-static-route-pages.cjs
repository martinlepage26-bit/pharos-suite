const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const baseIndexPath = path.join(buildDir, 'index.html');

const ROUTE_PAGES = [
  {
    path: '/services',
    title: 'PHAROS Services — Deterministic Governance Under Pressure',
    description:
      'Choose between deterministic governance, pre-mortem review, and post-mortem review. PHAROS structures thresholds, decision rights, and review-ready evidence.',
    eyebrow: 'Services',
    heading: 'Services for deterministic governance under pressure',
    body:
      'Choose by pressure source, not vocabulary. PHAROS scopes the work around the review condition, then builds the thresholds, decision paths, and evidence burden that real scrutiny will ask for.',
    bullets: [
      'Deterministic governance for stable thresholds and decision rights.',
      'Pre-mortem review before launch, onboarding, or expansion.',
      'Post-mortem review after incidents, failed reviews, or governance drift.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Book a review',
    secondaryHref: '/cases',
    secondaryLabel: 'View representative dossiers'
  },
  {
    path: '/governance',
    title: 'PHAROS Governance — Deterministic Thresholds and Decision Rights',
    description:
      'PHAROS helps teams turn procurement, audit, vendor review, and executive scrutiny into deterministic governance thresholds, decision rights, and evidence paths.',
    eyebrow: 'Governance',
    heading: 'Deterministic governance for live review conditions',
    body:
      'This route is the governance entry point for teams already under pressure from procurement, audit, vendor diligence, or executive oversight.',
    bullets: [
      'Make escalation thresholds explicit enough that reviewers do not drift.',
      'Name who decides, who escalates, and what evidence must exist next.',
      'Keep the resulting posture reconstructible for later review.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Start a scoped review',
    secondaryHref: '/methods',
    secondaryLabel: 'See the method'
  },
  {
    path: '/contact',
    title: 'PHAROS Contact — Start With a 30-Minute Review',
    description:
      'Book a 30-minute PHAROS review to scope deterministic governance, pre-mortem review, or post-mortem work. Direct contact available by email.',
    eyebrow: 'Contact',
    heading: 'Start with a 30-minute review',
    body:
      'The first review is meant to identify the pressure source, choose the correct route, and define the first deliverables without overstating readiness.',
    bullets: [
      'Bring the system or workflow in scope.',
      'Name the review trigger: procurement, audit, vendor review, launch, or incident response.',
      'Note what evidence, documentation, or failed review already exists.'
    ],
    primaryHref: 'mailto:{{CONTACT_EMAIL}}',
    primaryLabel: 'Email PHAROS directly',
    secondaryHref: '/tool',
    secondaryLabel: 'Take the readiness signal'
  },
  {
    path: '/connect',
    title: 'PHAROS Contact — Start With a 30-Minute Review',
    description:
      'Book a 30-minute PHAROS review to scope deterministic governance, pre-mortem review, or post-mortem work. Direct contact available by email.',
    eyebrow: 'Connect',
    heading: 'Start with a 30-minute review',
    body:
      'The first review is meant to identify the pressure source, choose the correct route, and define the first deliverables without overstating readiness.',
    bullets: [
      'Bring the system or workflow in scope.',
      'Name the review trigger: procurement, audit, vendor review, launch, or incident response.',
      'Note what evidence, documentation, or failed review already exists.'
    ],
    primaryHref: 'mailto:{{CONTACT_EMAIL}}',
    primaryLabel: 'Email PHAROS directly',
    secondaryHref: '/tool',
    secondaryLabel: 'Take the readiness signal'
  },
  {
    path: '/about',
    title: 'About PHAROS — Legible AI Governance by Martin Lepage, PhD',
    description:
      'PHAROS is an AI governance practice and observatory led by Martin Lepage, PhD, focused on deterministic thresholds, reconstructible controls, and review-ready documentation.',
    eyebrow: 'About',
    heading: 'Legible AI governance by Martin Lepage, PhD',
    body:
      'PHAROS positions governance as mechanism rather than gloss: explicit thresholds, named decision rights, bounded claims, and evidence that can be inspected later.',
    bullets: [
      'Built for procurement, audit, vendor review, and executive oversight.',
      'Grounded in a conceptual method that turns governance concerns into control surfaces.',
      'Bounded to what the evidence can genuinely support.'
    ],
    primaryHref: '/methods',
    primaryLabel: 'Read the method',
    secondaryHref: '/assurance',
    secondaryLabel: 'Review the assurance record'
  },
  {
    path: '/observatory',
    title: 'PHAROS Observatory — Briefings, Standards, and Review Conditions',
    description:
      'The PHAROS observatory tracks standards, frameworks, methods, and review conditions shaping legible AI governance.',
    eyebrow: 'Observatory',
    heading: 'An observatory for the governance conditions around AI',
    body:
      'This route brings together briefings, framework context, and public-facing analysis so readers can inspect the standards and conditions shaping PHAROS work.',
    bullets: [
      'Framework and standards briefings for review-heavy environments.',
      'Mechanism-first explanations rather than abstract governance claims.',
      'A public evidence layer that supports procurement and audit conversations.'
    ],
    primaryHref: '/library',
    primaryLabel: 'Open the reference library',
    secondaryHref: '/cases',
    secondaryLabel: 'See representative work'
  },
  {
    path: '/research',
    title: 'PHAROS Observatory — Briefings, Standards, and Review Conditions',
    description:
      'The PHAROS observatory tracks standards, frameworks, methods, and review conditions shaping legible AI governance.',
    eyebrow: 'Research',
    heading: 'An observatory for the governance conditions around AI',
    body:
      'This route brings together briefings, framework context, and public-facing analysis so readers can inspect the standards and conditions shaping PHAROS work.',
    bullets: [
      'Framework and standards briefings for review-heavy environments.',
      'Mechanism-first explanations rather than abstract governance claims.',
      'A public evidence layer that supports procurement and audit conversations.'
    ],
    primaryHref: '/library',
    primaryLabel: 'Open the reference library',
    secondaryHref: '/cases',
    secondaryLabel: 'See representative work'
  },
  {
    path: '/methods',
    title: 'PHAROS Method — Recursive Deterministic AI Governance',
    description:
      'Read the PHAROS method for turning bounded materials, recursive review, and control extraction into deterministic governance workflows.',
    eyebrow: 'Method',
    heading: 'A method for turning pressure into inspectable controls',
    body:
      'PHAROS uses a bounded, inspectable, reconstructible method to move from governance concerns to workflow controls, decision rules, and review-ready documentation.',
    bullets: [
      'Read the pressure source and identify the governing question.',
      'Set deterministic thresholds and assign decision rights.',
      'Build an evidence path that can be reconstructed later.'
    ],
    primaryHref: '/about/conceptual-method',
    primaryLabel: 'Open the conceptual method',
    secondaryHref: '/normalized-results',
    secondaryLabel: 'See normalized results'
  },
  {
    path: '/about/conceptual-method',
    title: 'PHAROS Method — Recursive Deterministic AI Governance',
    description:
      'Read the PHAROS method for turning bounded materials, recursive review, and control extraction into deterministic governance workflows.',
    eyebrow: 'Conceptual method',
    heading: 'A method for turning pressure into inspectable controls',
    body:
      'PHAROS uses a bounded, inspectable, reconstructible method to move from governance concerns to workflow controls, decision rules, and review-ready documentation.',
    bullets: [
      'Read the pressure source and identify the governing question.',
      'Set deterministic thresholds and assign decision rights.',
      'Build an evidence path that can be reconstructed later.'
    ],
    primaryHref: '/methods',
    primaryLabel: 'Read the method overview',
    secondaryHref: '/contact',
    secondaryLabel: 'Discuss your review condition'
  },
  {
    path: '/assurance',
    title: 'PHAROS Assurance — Transparency, Claim Boundaries, and Review Dates',
    description:
      'Review the PHAROS public assurance surface, including accountable human review, claim boundaries, transparency record, and review dates.',
    eyebrow: 'Assurance',
    heading: 'Public assurance for the PHAROS surface',
    body:
      'This route names the accountable human, the public claim boundary, the machine-readable transparency record, and the review schedule for the current public surface.',
    bullets: [
      'Machine-readable transparency record and route inventory.',
      'Explicit public non-claims and assurance aliases.',
      'Named review triggers for public route and claim changes.'
    ],
    primaryHref: '/pharos-transparency.json',
    primaryLabel: 'Open the transparency record',
    secondaryHref: '/contact',
    secondaryLabel: 'Escalate to a human review'
  },
  {
    path: '/transparency',
    title: 'PHAROS Assurance — Transparency, Claim Boundaries, and Review Dates',
    description:
      'Review the PHAROS public assurance surface, including accountable human review, claim boundaries, transparency record, and review dates.',
    eyebrow: 'Transparency',
    heading: 'Public assurance for the PHAROS surface',
    body:
      'This route names the accountable human, the public claim boundary, the machine-readable transparency record, and the review schedule for the current public surface.',
    bullets: [
      'Machine-readable transparency record and route inventory.',
      'Explicit public non-claims and assurance aliases.',
      'Named review triggers for public route and claim changes.'
    ],
    primaryHref: '/pharos-transparency.json',
    primaryLabel: 'Open the transparency record',
    secondaryHref: '/contact',
    secondaryLabel: 'Escalate to a human review'
  },
  {
    path: '/trust',
    title: 'PHAROS Assurance — Transparency, Claim Boundaries, and Review Dates',
    description:
      'Review the PHAROS public assurance surface, including accountable human review, claim boundaries, transparency record, and review dates.',
    eyebrow: 'Trust',
    heading: 'Public assurance for the PHAROS surface',
    body:
      'This route names the accountable human, the public claim boundary, the machine-readable transparency record, and the review schedule for the current public surface.',
    bullets: [
      'Machine-readable transparency record and route inventory.',
      'Explicit public non-claims and assurance aliases.',
      'Named review triggers for public route and claim changes.'
    ],
    primaryHref: '/pharos-transparency.json',
    primaryLabel: 'Open the transparency record',
    secondaryHref: '/contact',
    secondaryLabel: 'Escalate to a human review'
  },
  {
    path: '/auditability',
    title: 'PHAROS Assurance — Transparency, Claim Boundaries, and Review Dates',
    description:
      'Review the PHAROS public assurance surface, including accountable human review, claim boundaries, transparency record, and review dates.',
    eyebrow: 'Auditability',
    heading: 'Public assurance for the PHAROS surface',
    body:
      'This route names the accountable human, the public claim boundary, the machine-readable transparency record, and the review schedule for the current public surface.',
    bullets: [
      'Machine-readable transparency record and route inventory.',
      'Explicit public non-claims and assurance aliases.',
      'Named review triggers for public route and claim changes.'
    ],
    primaryHref: '/pharos-transparency.json',
    primaryLabel: 'Open the transparency record',
    secondaryHref: '/contact',
    secondaryLabel: 'Escalate to a human review'
  },
  {
    path: '/faq',
    title: 'PHAROS FAQ — Scope, Engagements, and Claim Boundaries',
    description:
      'Read the PHAROS FAQ on engagement scope, legal and audit boundaries, typical timelines, and review-readiness expectations.',
    eyebrow: 'FAQ',
    heading: 'Common questions about PHAROS work',
    body:
      'The FAQ clarifies how a first engagement starts, where PHAROS stops, and how deterministic governance work relates to legal, audit, and operational teams.',
    bullets: [
      'How first reviews are scoped.',
      'Where PHAROS complements rather than replaces counsel or audit.',
      'Typical duration and jurisdiction-aware operating assumptions.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Ask a specific question',
    secondaryHref: '/services',
    secondaryLabel: 'Review the service routes'
  },
  {
    path: '/cases',
    title: 'PHAROS Cases — Representative AI Governance Engagements',
    description:
      'Representative PHAROS dossiers across financial services, healthcare, enterprise technology, and public sector review conditions.',
    eyebrow: 'Cases',
    heading: 'Representative engagements under real review pressure',
    body:
      'The cases surface shows what governance work looks like when the pressure is concrete: procurement, audit, customer questionnaires, incidents, and ongoing oversight.',
    bullets: [
      'Representative dossiers span financial services, healthcare, enterprise technology, and public sector settings.',
      'Deliverables include control registers, decision matrices, evidence playbooks, and review packets.',
      'Each dossier stays bounded to what the evidence can support.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Discuss a similar review',
    secondaryHref: '/services',
    secondaryLabel: 'Review the service routes'
  },
  {
    path: '/tool',
    title: 'PHAROS Tool — Quick Governance Readiness Signal',
    description:
      'Use the PHAROS readiness signal tool for a quick, non-certifying snapshot of where governance needs more structure before review pressure increases.',
    eyebrow: 'Tool',
    heading: 'A quick readiness signal before scrutiny lands',
    body:
      'This tool is a calibration aid, not a certification. It helps teams see where governance structure is thin before a buyer, auditor, or leadership review asks for more.',
    bullets: [
      'Eight questions for a fast readiness signal.',
      'Highlights threshold, evidence, and escalation gaps.',
      'Designed as a starting point for human review rather than a compliance verdict.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Turn the signal into a review',
    secondaryHref: '/assurance',
    secondaryLabel: 'See the public claim boundary'
  },
  {
    path: '/library',
    title: 'PHAROS Library — Standards, Regulation, and Reference Materials',
    description:
      'Browse PHAROS reference materials on NIST AI RMF, ISO/IEC 42001, the EU AI Act, and related governance standards.',
    eyebrow: 'Library',
    heading: 'Reference material for legible AI governance',
    body:
      'The library brings together the standards, regulations, and framing materials that PHAROS uses as public reference points when review conditions require named touchpoints.',
    bullets: [
      'NIST AI RMF and implementation materials.',
      'ISO/IEC 42001 and related management-system guidance.',
      'EU AI Act and other external governance reference points.'
    ],
    primaryHref: '/observatory',
    primaryLabel: 'Return to the observatory',
    secondaryHref: '/contact',
    secondaryLabel: 'Discuss your framework needs'
  },
  {
    path: '/services/menu',
    title: 'PHAROS Service Menu — Packages, Drivers, and Scoping',
    description:
      'Review PHAROS service packages, scoping drivers, and public package descriptions for deterministic governance work.',
    eyebrow: 'Service menu',
    heading: 'A public menu of PHAROS service packages',
    body:
      'The service menu outlines package shapes and the pressure conditions that usually drive them, while final scoping still happens in the first review.',
    bullets: [
      'Package framing for different review conditions.',
      'Scoping drivers that change effort, evidence burden, and cadence.',
      'A public-facing summary rather than a substitute for scoped review.'
    ],
    primaryHref: '/services',
    primaryLabel: 'Read the core services',
    secondaryHref: '/contact',
    secondaryLabel: 'Book a scoping review'
  },
  {
    path: '/portal/compassai/aurora',
    title: 'Aurora — CompassAI Intake Workflow in PHAROS',
    description:
      'Aurora remains under the PHAROS public surface as the CompassAI intake, extraction, and evidence-package workflow until its standalone review surface is ready.',
    eyebrow: 'Aurora',
    heading: 'Aurora remains inside CompassAI within the PHAROS public surface',
    body:
      'Aurora is presented here as the intake workflow within CompassAI, focused on document intake, extraction, quality gates, and evidence package assembly.',
    bullets: [
      'Document intake and extraction workflows.',
      'Quality gates for evidence packaging.',
      'Still bounded within CompassAI under the PHAROS public surface.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Ask about Aurora',
    secondaryHref: '/assurance',
    secondaryLabel: 'See the surface boundary'
  },
  {
    path: '/portal/compassai',
    title: 'CompassAI — PHAROS Portal Overview',
    description:
      'CompassAI remains under the PHAROS public surface as a registry, evidence intake, and risk-tiering workflow until its standalone review surface is ready.',
    eyebrow: 'CompassAI',
    heading: 'CompassAI remains inside the PHAROS public surface',
    body:
      'CompassAI is presented here as an internal PHAROS module focused on use-case registries, evidence intake, risk tiering, and governance deliverables.',
    bullets: [
      'Use-case registry and evidence intake.',
      'Risk tiering and governance deliverables.',
      'Still bounded within the PHAROS public surface.'
    ],
    primaryHref: '/contact',
    primaryLabel: 'Ask about CompassAI',
    secondaryHref: '/assurance',
    secondaryLabel: 'See the surface boundary'
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function getCanonicalUrl(routePath) {
  if (routePath === '/') {
    return 'https://pharos-ai.ca';
  }

  return `https://pharos-ai.ca${routePath}`;
}

function normalizeContactEmail(candidate) {
  if (typeof candidate !== 'string') return null;
  const trimmed = candidate.trim();

  if (!trimmed || trimmed.includes('%') || trimmed.includes('{{') || trimmed.includes('}}')) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function extractContactEmail(html) {
  const candidates = [];
  const envEmail = process.env.REACT_APP_PUBLIC_CONTACT_EMAIL || process.env.PUBLIC_CONTACT_EMAIL;

  if (envEmail) {
    candidates.push(envEmail);
  }

  const mailtoMatches = html.matchAll(/mailto:([^"'<\s]+)/gi);
  for (const match of mailtoMatches) {
    candidates.push(match[1]);
  }

  const jsonEmailMatch = html.match(/"email"\s*:\s*"([^"]+)"/i);
  if (jsonEmailMatch?.[1]) {
    candidates.push(jsonEmailMatch[1]);
  }

  for (const candidate of candidates) {
    const normalized = normalizeContactEmail(candidate);
    if (normalized) return normalized;
  }

  return 'pharos@pharos-ai.ca';
}

function renderNoScript(page, contactEmail) {
  const primaryHref = page.primaryHref.replaceAll('{{CONTACT_EMAIL}}', contactEmail);
  const secondaryHref = page.secondaryHref.replaceAll('{{CONTACT_EMAIL}}', contactEmail);
  const bulletItems = page.bullets
    .map((item) => `<li style="margin: 0 0 0.75rem;">${escapeHtml(item)}</li>`)
    .join('');

  return `<noscript>
      <main style="max-width: 60rem; margin: 0 auto; padding: 3rem 1.5rem 4rem; color: #f0ede6; font-family: 'Space Grotesk', system-ui, sans-serif;">
        <p style="margin: 0 0 1rem; font: 600 0.72rem/1.4 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.16em; text-transform: uppercase; color: #3dd6c8;">${escapeHtml(page.eyebrow)}</p>
        <h1 style="margin: 0 0 1rem; font-size: clamp(2.2rem, 7vw, 4rem); line-height: 1; color: #f5f1ea;">${escapeHtml(page.heading)}</h1>
        <p style="margin: 0 0 1rem; max-width: 44rem; line-height: 1.75; color: rgba(240, 237, 230, 0.88);">${escapeHtml(page.body)}</p>
        <ul style="margin: 0 0 1.5rem; padding-left: 1.2rem; max-width: 44rem; line-height: 1.7; color: rgba(240, 237, 230, 0.84);">
          ${bulletItems}
        </ul>
        <p style="margin: 0 0 1.25rem; max-width: 44rem; line-height: 1.75; color: rgba(240, 237, 230, 0.82);">
          Direct contact:
          <a href="mailto:${escapeHtml(contactEmail)}" style="color: #f5f1ea;">${escapeHtml(contactEmail)}</a>
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.85rem; margin: 0 0 1.5rem;">
          <a href="${escapeHtml(primaryHref)}" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.85rem 1.2rem; border-radius: 999px; background: linear-gradient(180deg, rgba(27, 35, 72, 0.92) 0%, rgba(14, 20, 44, 0.98) 100%); border: 1px solid rgba(61, 214, 200, 0.32); color: #f5f1ea; text-decoration: none; font: 700 0.74rem/1.2 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.12em; text-transform: uppercase;">
            ${escapeHtml(page.primaryLabel)}
          </a>
          <a href="${escapeHtml(secondaryHref)}" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.85rem 1.2rem; border-radius: 999px; border: 1px solid rgba(61, 214, 200, 0.28); color: #f0ede6; text-decoration: none; font: 700 0.74rem/1.2 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.12em; text-transform: uppercase;">
            ${escapeHtml(page.secondaryLabel)}
          </a>
        </div>
        <nav style="display: flex; flex-wrap: wrap; gap: 0.7rem 1rem; padding-top: 1.25rem; border-top: 1px solid rgba(61, 214, 200, 0.18);">
          <a href="/" style="color: rgba(240, 237, 230, 0.82); text-decoration: none;">Home</a>
          <a href="/services" style="color: rgba(240, 237, 230, 0.82); text-decoration: none;">Services</a>
          <a href="/methods" style="color: rgba(240, 237, 230, 0.82); text-decoration: none;">Methods</a>
          <a href="/cases" style="color: rgba(240, 237, 230, 0.82); text-decoration: none;">Cases</a>
          <a href="/assurance" style="color: rgba(240, 237, 230, 0.82); text-decoration: none;">Assurance</a>
          <a href="/contact" style="color: rgba(240, 237, 230, 0.82); text-decoration: none;">Contact</a>
        </nav>
      </main>
    </noscript>`;
}

function renderStructuredData(page, canonicalUrl, contactEmail) {
  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': 'https://pharos-ai.ca/#professional-service',
        name: 'PHAROS AI Governance',
        url: 'https://pharos-ai.ca',
        email: contactEmail,
        description: 'Legible AI governance for procurement, audit, vendor review, and executive oversight.',
        areaServed: 'Canada',
        founder: {
          '@type': 'Person',
          name: 'Martin Lepage, PhD'
        },
        sameAs: ['https://pharos-ai.ca/pharos-transparency.json'],
        knowsAbout: [
          'AI governance',
          'Procurement review',
          'Audit readiness',
          'Vendor diligence',
          'Deterministic decision rights'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://pharos-ai.ca/#website',
        url: 'https://pharos-ai.ca',
        name: 'PHAROS AI Governance',
        publisher: {
          '@id': 'https://pharos-ai.ca/#professional-service'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        isPartOf: {
          '@id': 'https://pharos-ai.ca/#website'
        },
        about: {
          '@id': 'https://pharos-ai.ca/#professional-service'
        }
      }
    ]
  };

  return `<script id="pharos-structured-data" type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function replaceTag(html, pattern, value) {
  return html.replace(pattern, value);
}

function buildRouteHtml(baseHtml, page, contactEmail) {
  const canonicalUrl = getCanonicalUrl(page.path);
  const noScript = renderNoScript(page, contactEmail);
  const structuredData = renderStructuredData(page, canonicalUrl, contactEmail);

  let html = baseHtml;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(page.description)}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );
  html = replaceTag(
    html,
    /<script\s+id="pharos-structured-data"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    structuredData
  );
  html = replaceTag(html, /<noscript>[\s\S]*?<\/noscript>/i, noScript);

  return html;
}

function writeRoutePage(page, html) {
  const segments = page.path.split('/').filter(Boolean);
  const targetDir = path.join(buildDir, ...segments);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html);
}

function main() {
  if (!fs.existsSync(baseIndexPath)) {
    throw new Error(`Base build index not found: ${baseIndexPath}`);
  }

  const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
  const contactEmail = extractContactEmail(baseHtml);

  ROUTE_PAGES.forEach((page) => {
    const routeHtml = buildRouteHtml(baseHtml, page, contactEmail);
    writeRoutePage(page, routeHtml);
  });

  const generatedPaths = ROUTE_PAGES.map((page) => ensureTrailingSlash(page.path)).join(', ');
  console.log(`Generated static route pages for: ${generatedPaths}`);
}

main();
