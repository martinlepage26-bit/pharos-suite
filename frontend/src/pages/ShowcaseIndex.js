import { useMemo, useState } from 'react';
import { ArrowRight, Compass, ExternalLink, Layers3, Palette, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LighthouseGlyph from '../components/LighthouseGlyph';
import {
  aoThemePresets,
  currentSiteEntry,
  showcaseCoreUseCases,
  showcaseDeliveryStructure,
  showcaseImplementationPillars,
  showcaseMission,
  showcaseVariants
} from '../data/showcaseVariants';

const ShowcaseIndex = () => {
  const [selectedThemeId, setSelectedThemeId] = useState('practice-led');
  const selectedTheme = useMemo(
    () => aoThemePresets.find((theme) => theme.id === selectedThemeId) || aoThemePresets[0],
    [selectedThemeId]
  );

  return (
    <div className="showcase-index">
      <section className="showcase-index__hero">
        <div className="showcase-index__hero-copy">
          <span className="showcase-chip">Mission-aligned gallery</span>
          <h1>Test alternate Govern AI directions without losing the real practice.</h1>
          <p>
            The gallery compares the current production site with five reference-led redesign directions. Each concept is anchored to the same mission: legible AI governance under pressure, evidence before claims, and clear support for procurement, audit, vendor review, and oversight.
          </p>
          <div className="showcase-index__actions">
            <Link to={currentSiteEntry.route} className="showcase-button showcase-button--primary">
              Open current site
              <ArrowRight size={16} />
            </Link>
            <a className="showcase-button showcase-button--secondary" href="#variant-grid">
              Browse all versions
            </a>
          </div>
        </div>

        <div className="showcase-index__hero-panel">
          <div className="showcase-index__brand">
            <LighthouseGlyph className="showcase-index__glyph" title="Govern AI lighthouse mark" />
            <div>
              <p>Govern AI variant navigator</p>
              <strong>6 linked destinations</strong>
            </div>
          </div>

          <div className="showcase-index__hero-stats">
            <article>
              <Layers3 size={18} />
              <strong>5 redesigns</strong>
              <span>same mission, different structures</span>
            </article>
            <article>
              <Palette size={18} />
              <strong>3 brand modes</strong>
              <span>evidence, practice, and signal emphasis</span>
            </article>
            <article>
              <Compass size={18} />
              <strong>4 use cases</strong>
              <span>procurement, audit, vendor review, oversight</span>
            </article>
          </div>
        </div>
      </section>

      <section className="showcase-index__summary">
        <div style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="showcase-index__summary-card">
            <Sparkles size={18} />
            <div>
              <strong>{showcaseMission.title}</strong>
              <p>{showcaseMission.body}</p>
            </div>
          </div>
          {showcaseImplementationPillars.slice(0, 2).map((item) => (
            <div key={item.title} className="showcase-index__summary-card">
              <Sparkles size={18} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="showcase-index__grid-section">
        <div className="showcase-index__heading">
          <span className="showcase-chip">Actual implementation</span>
          <h2>The three delivery tracks every showcase direction should preserve</h2>
        </div>

        <div className="showcase-index__grid">
          {showcaseDeliveryStructure.map((item) => (
            <article key={item.title} className="showcase-card">
              <div className="showcase-card__meta">
                <span className="showcase-chip">Delivery track</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="showcase-card__meta" style={{ marginTop: '18px' }}>
                <span className="showcase-card__palette">{item.fit}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-theme-selector">
        <div className="showcase-index__heading">
          <span className="showcase-chip">Mission emphasis selector</span>
          <h2>Test which public emphasis best carries the real Govern AI mission.</h2>
        </div>

        <div className="showcase-theme-selector__layout">
          <div className="showcase-theme-selector__list">
            {aoThemePresets.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`showcase-theme-option${theme.id === selectedTheme.id ? ' active' : ''}`}
                onClick={() => setSelectedThemeId(theme.id)}
              >
                <div className="showcase-theme-option__top">
                  <div>
                    <span className="showcase-chip">{theme.label}</span>
                    <h3>{theme.emphasis}</h3>
                  </div>
                  {theme.recommended && <span className="showcase-theme-option__flag">Recommended</span>}
                </div>
                <p>{theme.summary}</p>
                <div className="showcase-theme-option__meta">
                  <span>{theme.coreFeeling}</span>
                  <span>{theme.bestFor}</span>
                </div>
              </button>
            ))}
          </div>

          <div
            className="showcase-theme-preview"
            style={{
              '--ao-preview-bg': selectedTheme.preview.background,
              '--ao-preview-surface': selectedTheme.preview.surface,
              '--ao-preview-surface-strong': selectedTheme.preview.surfaceStrong,
              '--ao-preview-text': selectedTheme.preview.text,
              '--ao-preview-muted': selectedTheme.preview.muted,
              '--ao-preview-accent': selectedTheme.preview.accent,
              '--ao-preview-accent-soft': selectedTheme.preview.accentSoft,
              '--ao-preview-border': selectedTheme.preview.border,
              '--ao-preview-glow': selectedTheme.preview.glow
            }}
          >
            <div className="showcase-theme-preview__header">
              <div>
                <span className="showcase-chip">{selectedTheme.label}</span>
                <h3>{selectedTheme.vibe}</h3>
              </div>
              <div className="showcase-theme-preview__status">
                <span className="passed">Evidence</span>
                <span className="active">Decision rights</span>
                <span className="passed">Cadence</span>
              </div>
            </div>

            <div className="showcase-theme-preview__swatches">
              {selectedTheme.swatches.map((swatch) => (
                <div key={swatch.label} className="showcase-theme-preview__swatch">
                  <span style={{ background: swatch.value }} />
                  <strong>{swatch.label}</strong>
                  <small>{swatch.value}</small>
                </div>
              ))}
            </div>

            <div className="showcase-theme-preview__card">
              <p>Govern AI theme preview</p>
              <strong>{selectedTheme.bestFor}</strong>
              <span>{selectedTheme.whyItWorks}</span>
            </div>

            <div className="showcase-theme-preview__tips">
              <article>
                <strong>Pressure starts the journey</strong>
                <p>Every mode should still let visitors recognize procurement, audit, vendor review, and oversight pressure quickly.</p>
              </article>
              <article>
                <strong>Packets beat promises</strong>
                <p>Use the visual system to foreground packets, controls, and evidence, not broad compliance theatre.</p>
              </article>
              <article>
                <strong>Use cases stay visible</strong>
                <p>The site should still point back to the real delivery model, not drift into abstract inspiration.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase-index__grid-section">
        <div className="showcase-index__heading">
          <span className="showcase-chip">Core use cases</span>
          <h2>The original Govern AI pressures every showcase route should preserve</h2>
        </div>

        <div className="showcase-index__grid">
          {showcaseCoreUseCases.map((item) => (
            <article key={item.title} className="showcase-card">
              <div className="showcase-card__meta">
                <span className="showcase-chip">Use case</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="variant-grid" className="showcase-index__grid-section">
        <div className="showcase-index__heading">
          <span className="showcase-chip">All versions</span>
          <h2>Current production plus five mission-aligned concept routes</h2>
        </div>

        <div className="showcase-index__grid">
          <article className="showcase-card showcase-card--current">
            <div className="showcase-card__meta">
              <span className="showcase-chip">Current</span>
              <span className="showcase-card__palette">{currentSiteEntry.palette.join(' / ')}</span>
            </div>
            <h3>{currentSiteEntry.title}</h3>
            <p>{currentSiteEntry.summary}</p>
            <div className="showcase-card__actions">
              <Link to={currentSiteEntry.route} className="showcase-text-link">
                Open site
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>

          {showcaseVariants.map((variant) => (
            <article key={variant.slug} className="showcase-card">
              <div className="showcase-card__meta">
                <span className="showcase-chip">{variant.referenceLabel}</span>
                <span className="showcase-card__palette">{variant.palette.join(' / ')}</span>
              </div>
              <h3>{variant.title}</h3>
              <p>{variant.summary}</p>
              <div className="showcase-card__footer">
                <Link to={`/showcase/${variant.slug}`} className="showcase-text-link">
                  Open variant
                  <ArrowRight size={14} />
                </Link>
                <a href={variant.referenceUrl} target="_blank" rel="noreferrer" className="showcase-reference-link">
                  Reference
                  <ExternalLink size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShowcaseIndex;
