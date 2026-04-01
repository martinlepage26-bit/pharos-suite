import LocalizedLink from '../components/LocalizedLink';
import { BookOpen, Eye, FileText, Layers, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SealedCard = () => {
  const { t } = useLanguage();

  return (
    <div data-testid="sealed-card-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{t.sealedCard.researchProtocol}</p>
            <h1>{t.sealedCard.title}</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>{t.sealedCard.subtitle}</p>
            <p className="eyebrow" style={{ marginTop: '18px' }}>{t.sealedCard.keywords}</p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container">
          <div className="card reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="card-icon" style={{ width: '56px', height: '56px', marginBottom: 0 }}>
                <FileText />
              </div>
              <div>
                <h3 style={{ marginBottom: '6px' }}>{t.sealedCard.fullDocument}</h3>
                <p style={{ marginBottom: 0 }}>{t.sealedCard.fullDocumentDesc}</p>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', fontSize: '0.875rem', color: 'var(--color-text)' }}>
              <Lock size={16} />
              Coming soon
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card reveal">
            <div className="card-icon"><BookOpen /></div>
            <h2 style={{ marginBottom: '16px' }}>{t.sealedCard.introduction}</h2>
            <p style={{ marginBottom: '16px' }}>{t.sealedCard.introP1} <strong>{t.sealedCard.glitch}</strong>{t.sealedCard.introP1b}</p>
            <p style={{ marginBottom: '16px' }}>{t.sealedCard.introP2} <strong>{t.sealedCard.accountability}</strong> {t.sealedCard.introP2b}</p>
            <p style={{ marginBottom: 0 }}>{t.sealedCard.introP3} <em>{t.sealedCard.introP3quote}</em> {t.sealedCard.introP3b}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Framework</p>
            <h2>{t.sealedCard.keyConcepts}</h2>
          </div>
          <div className="grid-2 stagger">
            {t.sealedCard.concepts.map((item) => (
              <div key={item.term} className="card reveal">
                <div className="card-icon"><Sparkles /></div>
                <h3>{item.term}</h3>
                <p>{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Method</p>
            <h2>{t.sealedCard.methodology}</h2>
            <p className="body-sm">{t.sealedCard.methodologyDesc}</p>
          </div>
          <div className="grid-3 stagger">
            {['artistic', 'academic', 'ritual'].map((key) => (
              <div key={key} className="card reveal">
                <div className="card-icon"><Layers /></div>
                <h3>{t.sealedCard.arms[key].title}</h3>
                <p>{t.sealedCard.arms[key].description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Governance</p>
            <h2>{t.sealedCard.governancePrinciples}</h2>
          </div>
          <div className="stagger" style={{ display: 'grid', gap: '18px' }}>
            {t.sealedCard.principles.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon"><Eye /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card reveal">
            <h2 style={{ marginBottom: '14px' }}>{t.sealedCard.conclusion}</h2>
            <p style={{ marginBottom: '16px' }}>{t.sealedCard.conclusionP1}</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {t.sealedCard.conclusionItems.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '999px', marginTop: '8px', background: 'var(--color-accent)', flexShrink: 0 }} />
                  <p style={{ marginBottom: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Continue through the research base</h2>
            <p className="body-sm">The protocol sits inside the broader research track on review, legitimacy, and governance design.</p>
            <div className="btn-row">
              <LocalizedLink to="/research" className="btn-primary">{t.sealedCard.backToResearch}</LocalizedLink>
              <LocalizedLink to="/about" className="btn-secondary">{t.sealedCard.aboutAuthor}</LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SealedCard;
