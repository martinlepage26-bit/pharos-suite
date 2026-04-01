import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, FileCheck2, Scale, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'About',
    title: 'PHAROS is a governance practice for high-scrutiny AI decisions.',
    body:
      'Led by Martin Lepage, PhD, PHAROS focuses on deterministic governance structures that stay legible when procurement, audit, vendor diligence, and executive oversight converge.',
    principlesTitle: 'Operating principles',
    principles: [
      {
        icon: Scale,
        title: 'Mechanism before rhetoric',
        body: 'Work begins with decision logic, thresholds, and evidence burden, not abstract governance language.'
      },
      {
        icon: ShieldCheck,
        title: 'Bounded claims',
        body: 'Public and internal claims stay proportional to available evidence and explicit review conditions.'
      },
      {
        icon: FileCheck2,
        title: 'Reconstructible records',
        body: 'Decisions and follow-through are documented so later reviewers can verify what happened and why.'
      }
    ],
    founderTitle: 'Accountability and scope',
    founderBody:
      'PHAROS delivers governance architecture, review pathways, and evidence structure. It does not replace legal counsel, regulators, or independent auditors.',
    founderList: [
      'Accountable human: Martin Lepage, PhD',
      'Primary operating location: Montreal, Quebec, Canada',
      'Core use case: governance under live review pressure'
    ],
    ctaTitle: 'Need conceptual depth before implementation?',
    ctaBody: 'Read the method overview, then scope your first bounded engagement.',
    ctaPrimary: 'Read method',
    ctaSecondary: 'Book review'
  },
  fr: {
    eyebrow: 'A propos',
    title: 'PHAROS est une pratique de gouvernance pour decisions IA sous forte revue.',
    body:
      'Dirige par Martin Lepage, PhD, PHAROS construit des structures deterministes qui restent lisibles quand approvisionnement, audit, diligence fournisseur et supervision convergent.',
    principlesTitle: 'Principes de travail',
    principles: [
      {
        icon: Scale,
        title: 'Mecanisme avant rhetorique',
        body: 'Le travail commence par la logique de decision, les seuils et la charge de preuve.'
      },
      {
        icon: ShieldCheck,
        title: 'Revendications bornees',
        body: 'Les revendications restent proportionnees a la preuve et aux conditions explicites de revue.'
      },
      {
        icon: FileCheck2,
        title: 'Traces reconstructibles',
        body: 'Les decisions sont documentees pour permettre une verification ulterieure.'
      }
    ],
    founderTitle: 'Responsabilite et portee',
    founderBody:
      'PHAROS livre une architecture de gouvernance et des parcours de revue. Il ne remplace ni les juristes, ni les regulateurs, ni les auditeurs independants.',
    founderList: [
      'Responsable humain: Martin Lepage, PhD',
      'Lieu principal: Montreal, Quebec, Canada',
      'Usage central: gouvernance sous pression de revue'
    ],
    ctaTitle: 'Besoin de profondeur conceptuelle avant execution?',
    ctaBody: 'Lisez la methode, puis cadrez un premier engagement borne.',
    ctaPrimary: 'Lire la methode',
    ctaSecondary: 'Reserver'
  }
};

const About = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="about-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-header reveal-up">
            <h2>{copy.principlesTitle}</h2>
          </div>
          <div className="grid-3">
            {copy.principles.map((item, index) => (
              <article key={item.title} className={`surface reveal-up delay-${Math.min(index, 3)}`}>
                <span className="icon-pill" aria-hidden="true">
                  <item.icon size={16} />
                </span>
                <h3 className="surface-title" style={{ marginTop: '0.65rem' }}>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <h2>{copy.founderTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.7rem' }}>{copy.founderBody}</p>
            <ul className="check-list" style={{ marginTop: '0.85rem' }}>
              {copy.founderList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="final-cta reveal-up delay-1">
            <h2>{copy.ctaTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.7rem' }}>{copy.ctaBody}</p>
            <div className="btn-row" style={{ marginTop: '0.95rem' }}>
              <LocalizedLink to="/methods" className="btn-primary">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </LocalizedLink>
              <LocalizedLink to="/contact" className="btn-secondary">
                {copy.ctaSecondary}
              </LocalizedLink>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default About;
