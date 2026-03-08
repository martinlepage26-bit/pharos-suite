import { useState } from 'react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';
import { Building2, CheckCircle, ChevronRight, Clock, DollarSign, FileText, HardHat, Landmark, Quote, Server, Settings, Shield, ShoppingCart, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const sectorIcons = {
  regulated: Shield,
  enterpriseSaas: Server,
  procurement: ShoppingCart,
  publicSector: Landmark,
  financial: DollarSign,
  construction: HardHat,
  governance: Settings
};

const sectorKeys = ['regulated', 'enterpriseSaas', 'procurement', 'publicSector', 'financial', 'construction', 'governance'];
const sectorIds = ['regulated', 'enterprise-saas', 'procurement', 'public-sector', 'financial', 'construction', 'governance'];

const Cases = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const { t, language } = useLanguage();

  const heroTitle = language === 'fr'
    ? 'Etudes de cas pour des environnements IA soumis a un examen reel.'
    : 'Case studies for AI under real review';

  const heroBody = language === 'fr'
    ? 'Des exemples de travail de gouvernance la ou la pression est concrete: questionnaires, audit, achats, risque et supervision continue. Chaque dossier montre ce que la preuve permet vraiment de soutenir.'
    : 'Examples of governance work where the pressure is concrete, from questionnaires and audit to procurement, risk, and ongoing oversight. Each dossier shows what the evidence can genuinely support.';

  return (
    <div data-testid="cases-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{language === 'fr' ? 'Etudes de cas' : 'Case studies'}</p>
            <h1>{heroTitle}</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>{heroBody}</p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{language === 'fr' ? 'Secteurs' : 'Sectors'}</p>
            <h2>{t.cases.sectorsWeServe}</h2>
            <p className="body-sm">{language === 'fr' ? 'Chaque contexte change la forme de la preuve, la logique de revue et la vitesse d escalation.' : 'Each operating context changes the evidence burden, the review logic, and the speed of escalation.'}</p>
          </div>

          <div className="grid-3 stagger">
            {sectorKeys.map((key, index) => {
              const Icon = sectorIcons[key];
              const sector = t.cases.sectorCards[key];
              return (
                <div key={key} className="card reveal" data-testid={`sector-card-${sectorIds[index]}`}>
                  <div className="card-icon">
                    <Icon />
                  </div>
                  <h3>{sector.title}</h3>
                  <p style={{ marginBottom: '12px', color: 'var(--color-text)', fontWeight: 500 }}>{sector.subtitle}</p>
                  <p>{sector.body}</p>
                  <div className="scope-note" style={{ marginTop: '18px' }}>
                    <strong>{t.cases.outputs}</strong> {sector.deliverable}
                  </div>
                  <Link to="/tool" style={{ marginTop: '18px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {t.cases.assessReadiness}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{language === 'fr' ? 'Dossiers' : 'Selected dossiers'}</p>
            <h2>{language === 'fr' ? 'Mandats representatifs' : 'Representative engagements'}</h2>
            <p className="body-sm">{language === 'fr' ? 'Chaque etude montre comment la gouvernance se traduit en decisions, artefacts et controles lisibles.' : 'Each case shows how governance turns into clearer decisions, usable artifacts, and review-ready controls.'}</p>
          </div>

          <div className="stagger" style={{ display: 'grid', gap: '24px' }}>
            {caseStudies.map((study) => (
              <button key={study.id} type="button" onClick={() => setSelectedCase(study)} className="card reveal" style={{ textAlign: 'left' }} data-testid={`case-${study.id}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span className="eyebrow" style={{ marginBottom: 0 }}>{study.sector}</span>
                  <span className="research-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Clock size={14} />{study.duration}</span>
                </div>
                <h3 style={{ marginBottom: '10px' }}>{study.title}</h3>
                <p style={{ marginBottom: '10px', color: 'var(--color-text)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} /> {study.client}
                </p>
                <p>{study.challenge}</p>
                <div style={{ marginTop: '18px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {language === 'fr' ? 'Ouvrir le dossier' : 'Open dossier'}
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>{t.cases.facingChallenge}</h2>
            <p className="body-sm">{t.cases.facingChallengeDesc}</p>
            <div className="btn-row">
              <Link to="/connect" className="btn-primary">{t.cases.bookDebrief}</Link>
            </div>
          </div>
        </div>
      </section>

      {selectedCase ? (
        <>
          <div className="fixed inset-0 z-[4000] bg-black/40" onClick={() => setSelectedCase(null)} />
          <div className="fixed inset-y-0 right-0 z-[4500] w-full max-w-[720px] overflow-hidden border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
            <div style={{ height: '100%', overflowY: 'auto' }}>
              <div style={{ position: 'sticky', top: 0, zIndex: 2, borderBottom: '1px solid var(--color-border)', background: 'rgba(18,14,24,0.92)', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span className="eyebrow" style={{ marginBottom: 0 }}>{selectedCase.sector}</span>
                      <span className="research-date">{selectedCase.duration}</span>
                    </div>
                    <h2 style={{ marginBottom: '8px' }}>{selectedCase.title}</h2>
                    <p className="body-sm" style={{ marginBottom: 0 }}>{selectedCase.client}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedCase(null)} style={{ padding: '10px', borderRadius: '999px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div className="card" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{t.cases.challenge}</h3>
                  <p>{selectedCase.challenge}</p>
                </div>

                <div className="card" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{t.cases.approach}</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedCase.approach.map((item, index) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div className="card-icon" style={{ width: '32px', height: '32px', marginBottom: 0 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{index + 1}</span>
                        </div>
                        <p style={{ marginBottom: 0 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{t.cases.outcomes}</h3>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {selectedCase.outcomes.map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle size={18} color="var(--color-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ marginBottom: 0 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCase.quote ? (
                  <div className="card" style={{ marginBottom: '20px' }}>
                    <Quote size={18} color="var(--color-accent)" style={{ marginBottom: '10px' }} />
                    <p style={{ marginBottom: 0, fontStyle: 'italic' }}>&quot;{selectedCase.quote}&quot;</p>
                  </div>
                ) : null}

                <div className="card">
                  <h3 style={{ marginBottom: '12px' }}>{t.cases.deliverables}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedCase.deliverables.map((item) => (
                      <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                        <FileText size={14} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
                <Link to="/connect" className="btn-primary" onClick={() => setSelectedCase(null)}>{t.cases.discussChallenge}</Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Cases;
