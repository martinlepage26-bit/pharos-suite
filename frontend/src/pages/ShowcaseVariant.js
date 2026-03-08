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
import {
  getShowcaseVariant,
  showcaseCoreUseCases,
  showcaseDeliveryStructure,
  showcaseMission,
  showcaseVariants
} from '../data/showcaseVariants';

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
          <span>Search packets, controls, vendor reviews, or oversight notes</span>
        </div>
        <div className="showcase-surface__pills">
          <span>Questionnaire packet</span>
          <span>Control register</span>
          <span>Vendor diligence</span>
        </div>
        <div className="showcase-result-list">
          <article>
            <strong>Controls and Evidence Pack</strong>
            <p>11 controls mapped to risk tiers, evidence owners, and review cadence.</p>
          </article>
          <article>
            <strong>Questionnaire response packet</strong>
            <p>Procurement-ready answers tied to decision rights, monitoring notes, and open gaps.</p>
          </article>
          <article>
            <strong>Vendor review dossier</strong>
            <p>Diligence criteria, contract language, and reassessment triggers for third-party AI.</p>
          </article>
        </div>
      </div>
    );
  }

  if (variant.slug === 'clubmed-atlas') {
    return (
      <div className="showcase-surface showcase-surface--clubmed">
        <div className="showcase-atlas-banner">
          <span>Guided advisory routes</span>
          <strong>Choose the real Govern AI track from the pressure in front of you.</strong>
        </div>
        <div className="showcase-atlas-grid">
          <article>
            <span className="showcase-chip">Foundation</span>
            <strong>Establish the baseline</strong>
            <p>Inventory systems, define tiers, and make approval logic explicit.</p>
          </article>
          <article>
            <span className="showcase-chip">Evidence</span>
            <strong>Package the review response</strong>
            <p>Turn governance into a packet procurement, audit, or customers can follow.</p>
          </article>
          <article>
            <span className="showcase-chip">Oversight</span>
            <strong>Keep leadership current</strong>
            <p>Support committees, executives, and live delivery with ongoing upkeep.</p>
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
          <span>Search sectors, packets, and governance pathways</span>
        </div>
        <div className="showcase-logo-row">
          <span>Regulated systems</span>
          <span>Enterprise SaaS</span>
          <span>Public sector</span>
          <span>Procurement and vendor risk</span>
        </div>
        <div className="showcase-course-grid">
          <article>
            <strong>Governance Foundation</strong>
            <p>Start with inventory, tiers, decision rights, and cadence when the baseline is thin.</p>
          </article>
          <article>
            <strong>Controls and Evidence Pack</strong>
            <p>Best when questionnaires, audit, or regulator-facing review demand reusable artifacts.</p>
          </article>
          <article>
            <strong>Oversight Retainer</strong>
            <p>Keep live systems governable as committees, vendors, and delivery teams keep moving.</p>
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
          <strong>Govern AI organizes research, dossiers, and advisory work around governable AI under scrutiny.</strong>
        </div>
        <div className="showcase-editorial-grid">
          <article>
            <span>Research</span>
            <strong>Research library for audit, procurement, and oversight questions</strong>
          </article>
          <article>
            <span>Cases</span>
            <strong>Dossiers that show how governance work holds up in real review contexts</strong>
          </article>
          <article>
            <span>Services</span>
            <strong>The three delivery tracks framed as a public-facing governance practice</strong>
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
          We received a procurement questionnaire asking who approves AI use and how evidence is maintained.
        </div>
        <div className="showcase-chat-answer">
          <strong>Start from the pressure source, then route to the right packet.</strong>
          <p>If the baseline is still being set, begin with Governance Foundation. If the structure exists but the packet is weak, move into Controls and Evidence Pack. If the system is live, use the Oversight Retainer to keep the answer current.</p>
        </div>
        <div className="showcase-surface__pills showcase-surface__pills--signal">
          <span>Foundation</span>
          <span>Evidence pack</span>
          <span>Oversight</span>
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

      <section className="showcase-variant__section showcase-variant__section--anchors">
        <div className="showcase-variant__section-heading">
          <span className="showcase-chip">Govern AI anchors</span>
          <h2>Mission, implementation, and use cases this direction must preserve</h2>
        </div>

        <div className="showcase-anchor-grid">
          <article className="showcase-anchor-card showcase-anchor-card--mission">
            <span className="showcase-chip">Mission</span>
            <h3>{showcaseMission.title}</h3>
            <p>{showcaseMission.body}</p>
          </article>

          {showcaseDeliveryStructure.map((item) => (
            <article key={item.title} className="showcase-anchor-card">
              <span className="showcase-chip">Delivery track</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="showcase-anchor-card__note">{item.fit}</span>
            </article>
          ))}
        </div>

        <div className="showcase-variant__subheading">
          <span className="showcase-chip">Original use cases</span>
          <p>The visual treatment can change, but these pressure routes should remain obvious.</p>
        </div>

        <div className="showcase-usecase-grid">
          {showcaseCoreUseCases.map((item) => (
            <article key={item.title} className="showcase-anchor-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-variant__section">
        <div className="showcase-variant__section-heading">
          <span className="showcase-chip">Implementation structure</span>
          <h2>How this direction expresses the real Govern AI delivery model</h2>
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
          <span className="showcase-chip">Use-case flow</span>
          <h2>How a visitor moves from pressure to packet in this version</h2>
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
          <h2>Compare the other directions without losing the core mission.</h2>
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
