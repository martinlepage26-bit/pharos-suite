import { useMemo, useState } from 'react';
import { ArrowRight, Compass, ExternalLink, Layers3, Palette, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LighthouseGlyph from '../components/LighthouseGlyph';
import { aoThemePresets, currentSiteEntry, showcaseVariants } from '../data/showcaseVariants';

const ShowcaseIndex = () => {
  const [selectedThemeId, setSelectedThemeId] = useState('organic');
  const selectedTheme = useMemo(
    () => aoThemePresets.find((theme) => theme.id === selectedThemeId) || aoThemePresets[0],
    [selectedThemeId]
  );

  return (
    <div className="showcase-index">
    <section className="showcase-index__hero">
      <div className="showcase-index__hero-copy">
        <span className="showcase-chip">Design gallery</span>
        <h1>Navigate every Govern AI direction from one index.</h1>
        <p>
          This gallery links the current production site plus five inspired redesign directions based on PubMed,
          Club Med, Coursera, Universite de Montreal, and a new Perplexity-style answer-engine concept.
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
            <span>distinct structures and palettes</span>
          </article>
          <article>
            <Palette size={18} />
            <strong>1 new scheme</strong>
            <span>Perplexity-inspired dark signal mode</span>
          </article>
          <article>
            <Compass size={18} />
            <strong>1 index</strong>
            <span>jump between every version quickly</span>
          </article>
        </div>
      </div>
    </section>

    <section className="showcase-index__summary">
      <div className="showcase-index__summary-card">
        <Sparkles size={18} />
        <div>
          <strong>How to use this gallery</strong>
          <p>Open a concept, compare the navigation rhythm, then jump to the next one from the in-page variant rail.</p>
        </div>
      </div>
    </section>

    <section className="showcase-theme-selector">
      <div className="showcase-index__heading">
        <span className="showcase-chip">AO theme selector</span>
        <h2>Test governance palettes before deciding which system should lead the brand.</h2>
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
              <span className="passed">Passed</span>
              <span className="active">Active</span>
              <span className="defeated">Defeated</span>
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
            <p>AO governance preview</p>
            <strong>{selectedTheme.bestFor}</strong>
            <span>{selectedTheme.whyItWorks}</span>
          </div>

          <div className="showcase-theme-preview__tips">
            <article>
              <strong>Contrast is king</strong>
              <p>Keep proposals, votes, and long-form governance reading easy on the eyes.</p>
            </article>
            <article>
              <strong>Status language stays simple</strong>
              <p>Use green for passed, amber for active, and red for defeated without improvising.</p>
            </article>
            <article>
              <strong>Permaweb vibe check</strong>
              <p>Pair slightly muted tones with crisp UI so the interface feels organic and future-facing.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="variant-grid" className="showcase-index__grid-section">
      <div className="showcase-index__heading">
        <span className="showcase-chip">All versions</span>
        <h2>Current production plus five inspired concept routes</h2>
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
