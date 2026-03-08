import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ExternalLink,
  GraduationCap,
  Landmark,
  MessageSquareText,
  Search,
  Sparkles,
  SunMedium
} from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import LighthouseGlyph from '../components/LighthouseGlyph';
import { getShowcaseVariant, showcaseVariants } from '../data/showcaseVariants';

const variantIcons = {
  'pubmed-command': Search,
  'clubmed-atlas': SunMedium,
  'coursera-campus': GraduationCap,
  'udem-bulletin': Landmark,
  'perplexity-signal': MessageSquareText
};

function VariantSurface({ variant }) {
  if (variant.slug === 'pubmed-command') {
    return (
      <div className="showcase-surface showcase-surface--pubmed">
        <div className="showcase-searchbar">
          <Search size={16} />
          <span>Search governance packets, board notes, or evidence artifacts</span>
        </div>
        <div className="showcase-surface__pills">
          <span>Procurement packet</span>
          <span>Model approval</span>
          <span>Risk tiering</span>
        </div>
        <div className="showcase-result-list">
          <article>
            <strong>Governance review packet</strong>
            <p>Owner: Martin Lepage, PhD - Updated March 2026 - Evidence complete</p>
          </article>
          <article>
            <strong>Escalation and decision matrix</strong>
            <p>3 review paths - Audit, board, procurement - Ready to export</p>
          </article>
          <article>
            <strong>Control register summary</strong>
            <p>12 controls linked to monitoring, review cadence, and artifacts</p>
          </article>
        </div>
      </div>
    );
  }

  if (variant.slug === 'clubmed-atlas') {
    return (
      <div className="showcase-surface showcase-surface--clubmed">
        <div className="showcase-atlas-banner">
          <span>Governance itineraries</span>
          <strong>Choose the pressure route that best matches the moment.</strong>
        </div>
        <div className="showcase-atlas-grid">
          <article>
            <span className="showcase-chip">Audit</span>
            <strong>Calm the audit request</strong>
          </article>
          <article>
            <span className="showcase-chip">Procurement</span>
            <strong>Package the customer response</strong>
          </article>
          <article>
            <span className="showcase-chip">Leadership</span>
            <strong>Frame the executive review</strong>
          </article>
        </div>
      </div>
    );
  }

  if (variant.slug === 'coursera-campus') {
    return (
      <div className="showcase-surface showcase-surface--coursera">
        <div className="showcase-searchbar">
          <Search size={16} />
          <span>Search governance pathways, packets, and starter kits</span>
        </div>
        <div className="showcase-logo-row">
          <span>Boards</span>
          <span>Risk teams</span>
          <span>Public sector</span>
          <span>Procurement</span>
        </div>
        <div className="showcase-course-grid">
          <article>
            <strong>Questionnaire Response Kit</strong>
            <p>Fast pathway for procurement and diligence teams.</p>
          </article>
          <article>
            <strong>Governance Baseline Sprint</strong>
            <p>Map decision rights, risk tiers, and approval logic.</p>
          </article>
          <article>
            <strong>Review-Ready Evidence System</strong>
            <p>Build reusable artifacts for external scrutiny.</p>
          </article>
        </div>
      </div>
    );
  }

  if (variant.slug === 'udem-bulletin') {
    return (
      <div className="showcase-surface showcase-surface--udem">
        <div className="showcase-editorial-lead">
          <span className="showcase-chip">Lead bulletin</span>
          <strong>Govern AI expands the public-facing structure of its research and advisory practice.</strong>
        </div>
        <div className="showcase-editorial-grid">
          <article>
            <span>Research</span>
            <strong>New governance library for Canadian organizations</strong>
          </article>
          <article>
            <span>Practice</span>
            <strong>Service dossiers organized by review context</strong>
          </article>
          <article>
            <span>Field notes</span>
            <strong>Editorial updates on audit, procurement, and oversight</strong>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="showcase-surface showcase-surface--perplexity">
      <div className="showcase-chat-shell">
        <div className="showcase-chat-label">
          <Sparkles size={16} />
          <span>Ask Govern AI</span>
        </div>
        <div className="showcase-chat-input">
          How should we answer a customer questionnaire about model governance?
        </div>
        <div className="showcase-chat-answer">
          <strong>Start with a compact answer and anchor it in evidence.</strong>
          <p>Route the reader to decision rights, risk tiering, monitoring, and the review packet. Keep the tone calm, specific, and source-backed.</p>
        </div>
        <div className="showcase-surface__pills showcase-surface__pills--signal">
          <span>Decision matrix</span>
          <span>Control register</span>
          <span>Packet sources</span>
        </div>
      </div>
    </div>
  );
}

const VariantPage = () => {
  const { slug } = useParams();
  const variant = getShowcaseVariant(slug);

  if (!variant) {
    return <Navigate to="/showcase" replace />;
  }

  const Icon = variantIcons[variant.slug] || BookOpenText;
  const currentIndex = showcaseVariants.findIndex((item) => item.slug === variant.slug);
  const prevVariant = showcaseVariants[(currentIndex + showcaseVariants.length - 1) % showcaseVariants.length];
  const nextVariant = showcaseVariants[(currentIndex + 1) % showcaseVariants.length];

  return (
    <div className="showcase-variant" data-variant={variant.slug}>
      <section className="showcase-variant__topbar">
        <Link to="/showcase" className="showcase-text-link">
          <ArrowLeft size={14} />
          Back to index
        </Link>
        <div className="showcase-variant__rail">
          <Link to="/">Current site</Link>
          {showcaseVariants.map((item) => (
            <Link
              key={item.slug}
              to={`/showcase/${item.slug}`}
              className={item.slug === variant.slug ? 'active' : ''}
            >
              {item.referenceLabel}
            </Link>
          ))}
        </div>
      </section>

      <section className="showcase-variant__hero">
        <div className="showcase-variant__copy">
          <div className="showcase-variant__eyebrow">
            <span className="showcase-chip">{variant.referenceLabel}</span>
            <a href={variant.referenceUrl} target="_blank" rel="noreferrer" className="showcase-reference-link">
              Open reference
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="showcase-variant__identity">
            <div className="showcase-variant__icon">
              <Icon size={22} />
            </div>
            <div>
              <p>{variant.label}</p>
              <strong>{variant.tone}</strong>
            </div>
          </div>

          <h1>{variant.hero.title}</h1>
          <p className="showcase-variant__lede">{variant.hero.body}</p>

          <div className="showcase-variant__actions">
            <Link to="/connect" className="showcase-button showcase-button--primary">
              {variant.hero.primary}
              <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="showcase-button showcase-button--secondary">
              {variant.hero.secondary}
            </Link>
          </div>

          <div className="showcase-variant__metrics">
            {variant.metrics.map((metric) => (
              <article key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="showcase-variant__panel">
          <div className="showcase-variant__panel-brand">
            <LighthouseGlyph className="showcase-variant__glyph" title="Govern AI lighthouse mark" />
            <div>
              <p>Govern AI</p>
              <strong>{variant.title}</strong>
            </div>
          </div>
          <VariantSurface variant={variant} />
        </div>
      </section>

      <section className="showcase-variant__section">
        <div className="showcase-variant__section-heading">
          <span className="showcase-chip">Structural translation</span>
          <h2>How this pattern changes the public site</h2>
        </div>
        <div className="showcase-variant__module-grid">
          {variant.modules.map((module) => (
            <article key={module.title} className="showcase-module-card">
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-variant__section showcase-variant__section--alt">
        <div className="showcase-variant__section-heading">
          <span className="showcase-chip">User journey</span>
          <h2>The intended flow through this version</h2>
        </div>
        <div className="showcase-variant__journey">
          {variant.journey.map((step, index) => (
            <article key={step} className="showcase-journey-step">
              <span>0{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-variant__cta">
        <div>
          <span className="showcase-chip">Compare quickly</span>
          <h2>Jump across the other directions without leaving the gallery.</h2>
        </div>
        <div className="showcase-variant__cta-actions">
          <Link to={`/showcase/${prevVariant.slug}`} className="showcase-button showcase-button--secondary">
            Previous: {prevVariant.referenceLabel}
          </Link>
          <Link to={`/showcase/${nextVariant.slug}`} className="showcase-button showcase-button--primary">
            Next: {nextVariant.referenceLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VariantPage;
