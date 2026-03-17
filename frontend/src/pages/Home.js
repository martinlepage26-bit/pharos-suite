import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  FileCheck2,
  FolderSearch,
  Radar,
  Scale,
  ShieldCheck,
  Waypoints
} from 'lucide-react';
import '../components/HomeHeroLogo.css';
import MeridianField from '../components/MeridianField';
import SignalStrip from '../components/SignalStrip';
import { useLanguage } from '../context/LanguageContext';

const HOME_COPY = {
  en: {
    monitorUrl: 'PHAROS-AI.CA',
    wordmarkSubtitle: 'Legible AI governance by Martin Lepage, PhD',
    brandKicker: 'PHAROS AI GOVERNANCE',
    heroTitle: 'Deterministic AI governance under pressure',
    heroSubheadline: 'Turning AI risk into inspectable workflow controls.',
    heroBody:
      'When procurement, audit, or executive review asks how AI is governed, PHAROS helps teams answer with evidence, deterministic decision rights, explicit thresholds, and review-ready documentation.',
    heroFounderLine: 'Built for procurement, audit, vendor review, and executive oversight.',
    primaryCta: 'Book a review',
    secondaryCta: 'View services',
    reviewBodyTitle: 'What Review Bodies Need To See',
    reviewBodyHeading: 'A governance posture that stays legible when scrutiny arrives',
    reviewBodyText:
      'Trust here does not come from tone alone. It comes from explicit thresholds, named decisions, and a body of evidence that can actually be inspected.',
    standardLabel: 'PHAROS Standard',
    standardTitle: 'Evidence before rhetoric',
    pressureLabel: 'Pressure Points',
    pressureHeading: 'Governance work starts where live review pressure exposes ambiguity',
    pressureText:
      'PHAROS does not begin with abstract governance theater. It begins where a buyer, auditor, vendor, or executive request makes the missing logic visible.',
    methodLabel: 'Method In Four Steps',
    methodHeading: 'Read the pressure, set the thresholds, assign the decisions, keep it reconstructible',
    methodText:
      'The method matters because it produces inspectable controls rather than vague ethical positioning or generic compliance prose.',
    artifactsLabel: 'Artifacts',
    artifactsHeading: 'Deliverables that make governance credible',
    artifactsText:
      'The output is not only a posture. It is a usable set of materials that makes thresholds, decisions, and evidence easy to follow later.',
    routesLabel: 'Service Routes',
    routesHeading: 'Choose the route by pressure source, not vocabulary',
    routesText:
      'The right entry point depends on whether the organization needs a baseline, a pre-mortem before exposure, or a post-mortem after failure or drift.',
    routeCta: 'View service',
    ctaHeading: 'Start with a short review, not a vague governance program',
    ctaText:
      'A 30-minute review is enough to identify the pressure source, set the route, and define the first deliverables without overstating current readiness.',
    heroPressureCards: [
      {
        icon: BriefcaseBusiness,
        title: 'Procurement',
        description: 'Customer questionnaires and buyer requests that force governance claims into the open.'
      },
      {
        icon: Radar,
        title: 'Audit',
        description: 'Review conditions that ask who decided, what evidence exists, and what can be reconstructed.'
      },
      {
        icon: ShieldCheck,
        title: 'Vendor Review',
        description: 'Third-party diligence that exposes weak thresholds, unclear ownership, or missing proof.'
      },
      {
        icon: Building2,
        title: 'Oversight',
        description: 'Executive and committee scrutiny that needs governance logic leadership can actually defend.'
      }
    ],
    heroSignals: [
      {
        label: 'Best for',
        title: 'Teams facing live review pressure',
        description: 'Use PHAROS when procurement, audit, vendor diligence, or oversight is already shaping the work.'
      },
      {
        label: 'What PHAROS does',
        title: 'Turns pressure into control logic',
        description: 'The output is explicit thresholds, decision rights, escalation logic, and review-ready documentation.'
      },
      {
        label: 'Start with',
        title: 'A short review',
        description: 'A 30-minute review is enough to scope the route into deterministic governance, pre-mortem, or post-mortem work.'
      }
    ],
    reviewNeeds: [
      {
        title: 'Deterministic decision rights',
        description: 'Clear approval logic, escalation paths, and named owners that do not shift by reviewer.'
      },
      {
        title: 'Explicit thresholds',
        description: 'Thresholds that show when a system escalates, why it escalates, and what evidence is required next.'
      },
      {
        title: 'Review-ready evidence',
        description: 'A document set a buyer, auditor, or committee can follow without rebuilding the logic from scratch.'
      },
      {
        title: 'Reconstructible governance',
        description: 'A posture that still holds when later scrutiny asks what happened, why, and what changes next.'
      }
    ],
    pressurePoints: [
      {
        icon: BriefcaseBusiness,
        title: 'Procurement pressure',
        description: 'The question stops being whether a system is useful and becomes whether governance can survive a customer review.'
      },
      {
        icon: Radar,
        title: 'Audit pressure',
        description: 'Audit exposes where thresholds are implied rather than stated and where evidence trails are too thin to trust.'
      },
      {
        icon: ShieldCheck,
        title: 'Vendor pressure',
        description: 'Partner and model dependencies need structured review, not improvised answers when a diligence request arrives.'
      },
      {
        icon: Building2,
        title: 'Oversight pressure',
        description: 'Leadership and committees need a governance answer that stays legible under scrutiny instead of collapsing into abstractions.'
      }
    ],
    methodSteps: [
      {
        step: '01',
        title: 'Read the pressure source',
        description: 'Start with the actual review condition: procurement, audit, vendor diligence, launch, incident response, or executive oversight.'
      },
      {
        step: '02',
        title: 'Set deterministic thresholds',
        description: 'Make review triggers, risk boundaries, and approval conditions explicit enough that different reviewers reach the same logic.'
      },
      {
        step: '03',
        title: 'Assign decision rights',
        description: 'Name who decides, who escalates, what must be documented, and what cannot proceed without additional proof.'
      },
      {
        step: '04',
        title: 'Build the evidence path',
        description: 'Keep the resulting posture reconstructible through review packets, thresholds, decision logs, and follow-through cadence.'
      }
    ],
    artifactCards: [
      {
        icon: FileCheck2,
        title: 'Decision matrix',
        description: 'Shows who approves, who escalates, and what gets recorded.'
      },
      {
        icon: Scale,
        title: 'Threshold map',
        description: 'Defines which systems require deeper review, when they escalate, and what evidence burden follows.'
      },
      {
        icon: FolderSearch,
        title: 'Review packet',
        description: 'Assembles the materials a buyer, auditor, or committee can actually follow.'
      },
      {
        icon: Waypoints,
        title: 'Post-mortem record',
        description: 'Reconstructs failure, exposes control gaps, and narrows what should change next.'
      }
    ],
    serviceRoutes: [
      {
        title: 'Deterministic Governance',
        description: 'Establish explicit thresholds, decision rights, and a stable governance baseline before scrutiny compounds ambiguity.',
        to: '/governance#deterministic-governance'
      },
      {
        title: 'Pre-mortem Review',
        description: 'Pressure-test an AI system before launch, procurement, onboarding, or major expansion changes the stakes.',
        to: '/governance#pre-mortem-review'
      },
      {
        title: 'Post-mortem Review',
        description: 'Reconstruct incidents, failed reviews, or governance drift and turn the findings into a stronger control posture.',
        to: '/governance#post-mortem-review'
      }
    ]
  },
  fr: {
    monitorUrl: 'PHAROS-AI.CA',
    wordmarkSubtitle: 'Gouvernance IA lisible par Martin Lepage, PhD',
    brandKicker: 'PHAROS GOUVERNANCE IA',
    heroTitle: 'Gouvernance IA deterministe sous pression',
    heroSubheadline: 'Transformer le risque IA en controles de workflow verifiables.',
    heroBody:
      'Lorsque l approvisionnement, l audit ou une revue executive demande comment l IA est gouvernee, PHAROS aide les equipes a repondre avec de la preuve, des droits de decision deterministes, des seuils explicites et une documentation prete pour examen.',
    heroFounderLine: 'Concu pour l approvisionnement, l audit, la revue fournisseur et la supervision executive.',
    primaryCta: 'Reserver une revue',
    secondaryCta: 'Voir les services',
    reviewBodyTitle: 'Ce Que Les Instances De Revue Doivent Voir',
    reviewBodyHeading: 'Une posture de gouvernance qui reste lisible lorsque l examen arrive',
    reviewBodyText:
      'La confiance ici ne vient pas seulement du ton. Elle vient de seuils explicites, de decisions nommees et d un corpus de preuve qui peut vraiment etre inspecte.',
    standardLabel: 'Standard PHAROS',
    standardTitle: 'La preuve avant la rhetorique',
    pressureLabel: 'Points De Pression',
    pressureHeading: 'Le travail de gouvernance commence la ou la pression de revue revele l ambiguite',
    pressureText:
      'PHAROS ne commence pas par du theatre abstrait de gouvernance. Il commence la ou une demande d acheteur, d auditeur, de fournisseur ou de direction rend la logique manquante visible.',
    methodLabel: 'Methode En Quatre Etapes',
    methodHeading: 'Lire la pression, fixer les seuils, attribuer les decisions, garder le tout reconstructible',
    methodText:
      'La methode compte parce qu elle produit des controles inspectables plutot qu un positionnement ethique vague ou une prose generique de conformite.',
    artifactsLabel: 'Livrables',
    artifactsHeading: 'Des livrables qui rendent la gouvernance credible',
    artifactsText:
      'Le resultat n est pas seulement une posture. C est un ensemble de materiaux utiles qui rend les seuils, les decisions et la preuve faciles a suivre par la suite.',
    routesLabel: 'Parcours De Service',
    routesHeading: 'Choisir le parcours selon la source de pression, pas selon le vocabulaire',
    routesText:
      'Le bon point d entree depend de savoir si l organisation a besoin d une base, d une revue pre-mortem avant exposition ou d une revue post-mortem apres un echec ou une derive.',
    routeCta: 'Voir le service',
    ctaHeading: 'Commencez par une courte revue, pas par un programme de gouvernance vague',
    ctaText:
      'Une revue de 30 minutes suffit pour identifier la source de pression, choisir le parcours et definir les premiers livrables sans surevaluer l etat actuel de preparation.',
    heroPressureCards: [
      {
        icon: BriefcaseBusiness,
        title: 'Approvisionnement',
        description: 'Questionnaires clients et demandes d acheteurs qui obligent les affirmations de gouvernance a devenir visibles.'
      },
      {
        icon: Radar,
        title: 'Audit',
        description: 'Conditions de revue qui demandent qui a decide, quelle preuve existe et ce qui peut etre reconstruit.'
      },
      {
        icon: ShieldCheck,
        title: 'Revue fournisseur',
        description: 'Diligence tierce partie qui expose des seuils faibles, une responsabilite floue ou une preuve manquante.'
      },
      {
        icon: Building2,
        title: 'Supervision',
        description: 'Scrutin de direction et de comite qui exige une logique de gouvernance que le leadership peut reellement defendre.'
      }
    ],
    heroSignals: [
      {
        label: 'Ideal pour',
        title: 'Equipes deja sous pression de revue',
        description: 'Utilisez PHAROS lorsque l approvisionnement, l audit, la diligence fournisseur ou la supervision structurent deja le travail.'
      },
      {
        label: 'Ce que fait PHAROS',
        title: 'Transformer la pression en logique de controle',
        description: 'Le resultat est un ensemble explicite de seuils, de droits de decision, de logique d escalation et de documentation prete pour examen.'
      },
      {
        label: 'Commencer par',
        title: 'Une courte revue',
        description: 'Une revue de 30 minutes suffit pour cadrer le parcours vers une gouvernance deterministe, un pre-mortem ou un post-mortem.'
      }
    ],
    reviewNeeds: [
      {
        title: 'Droits de decision deterministes',
        description: 'Une logique d approbation claire, des parcours d escalation et des responsables nommes qui ne changent pas selon le reviseur.'
      },
      {
        title: 'Seuils explicites',
        description: 'Des seuils qui montrent quand un systeme escalade, pourquoi il escalade et quelle preuve est requise ensuite.'
      },
      {
        title: 'Preuve prete pour revue',
        description: 'Un ensemble documentaire qu un acheteur, un auditeur ou un comite peut suivre sans devoir reconstruire la logique.'
      },
      {
        title: 'Gouvernance reconstructible',
        description: 'Une posture qui tient encore lorsque l examen ulterieur demande ce qui s est passe, pourquoi et ce qui change ensuite.'
      }
    ],
    pressurePoints: [
      {
        icon: BriefcaseBusiness,
        title: 'Pression d approvisionnement',
        description: 'La question cesse d etre de savoir si un systeme est utile et devient celle de savoir si la gouvernance survit a une revue client.'
      },
      {
        icon: Radar,
        title: 'Pression d audit',
        description: 'L audit expose les endroits ou les seuils sont implicites plutot qu exprimes et ou les traces de preuve sont trop minces pour inspirer confiance.'
      },
      {
        icon: ShieldCheck,
        title: 'Pression fournisseur',
        description: 'Les dependances partenaires et modeles exigent une revue structuree, pas des reponses improvisees lorsqu une demande de diligence arrive.'
      },
      {
        icon: Building2,
        title: 'Pression de supervision',
        description: 'La direction et les comites ont besoin d une reponse de gouvernance qui reste lisible sous examen au lieu de s effondrer en abstractions.'
      }
    ],
    methodSteps: [
      {
        step: '01',
        title: 'Lire la source de pression',
        description: 'Commencer par la condition de revue reelle : approvisionnement, audit, diligence fournisseur, lancement, reponse a incident ou supervision executive.'
      },
      {
        step: '02',
        title: 'Fixer des seuils deterministes',
        description: 'Rendre les declencheurs de revue, les limites de risque et les conditions d approbation assez explicites pour que differents reviseurs atteignent la meme logique.'
      },
      {
        step: '03',
        title: 'Attribuer les droits de decision',
        description: 'Nommer qui decide, qui escalade, ce qui doit etre documente et ce qui ne peut pas avancer sans preuve supplementaire.'
      },
      {
        step: '04',
        title: 'Construire le parcours de preuve',
        description: 'Garder la posture resultante reconstructible grace aux dossiers de revue, aux seuils, aux journaux de decision et au suivi dans le temps.'
      }
    ],
    artifactCards: [
      {
        icon: FileCheck2,
        title: 'Matrice de decision',
        description: 'Montre qui approuve, qui escalade et ce qui doit etre consigne.'
      },
      {
        icon: Scale,
        title: 'Carte des seuils',
        description: 'Definit quels systemes exigent une revue plus profonde, quand ils escaladent et quelle charge de preuve suit.'
      },
      {
        icon: FolderSearch,
        title: 'Dossier de revue',
        description: 'Assemble les materiaux qu un acheteur, un auditeur ou un comite peut reellement suivre.'
      },
      {
        icon: Waypoints,
        title: 'Dossier post-mortem',
        description: 'Reconstruit l echec, expose les ecarts de controle et resserre ce qui doit changer ensuite.'
      }
    ],
    serviceRoutes: [
      {
        title: 'Gouvernance deterministe',
        description: 'Etablir des seuils explicites, des droits de decision et une base stable de gouvernance avant que l examen n amplifie l ambiguite.',
        to: '/governance#deterministic-governance'
      },
      {
        title: 'Revue pre-mortem',
        description: 'Mettre un systeme IA a l epreuve avant le lancement, l approvisionnement, l integration ou un changement majeur des enjeux.',
        to: '/governance#pre-mortem-review'
      },
      {
        title: 'Revue post-mortem',
        description: 'Reconstruire les incidents, les revues echouees ou la derive de gouvernance et transformer les constats en posture de controle plus solide.',
        to: '/governance#post-mortem-review'
      }
    ]
  }
};

const floatingCardClasses = ['card-left-1', 'card-left-2', 'card-right-1', 'card-right-2'];

const Home = () => {
  const { language } = useLanguage();
  const copy = HOME_COPY[language] || HOME_COPY.en;
  const subtitleBreakToken = language === 'fr' ? ' par ' : ' by ';
  const subtitleParts = copy.wordmarkSubtitle.split(subtitleBreakToken);
  const subtitleLead = subtitleParts[0] || copy.wordmarkSubtitle;
  const subtitleTail = subtitleParts.slice(1).join(subtitleBreakToken).trim();

  return (
    <div data-testid="home-page">
      <div className="home-page-meridians" aria-hidden="true" />
      <section className="hero hero-pharos">
        <div className="container">
          <div className="hero-shell">
            <div className="hero-stage glass-panel">
              <div className="hero-monitor-chrome" aria-hidden="true">
                <div className="hero-monitor-controls">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-monitor-url">
                  <span className="hero-monitor-lock" />
                  <span>{copy.monitorUrl}</span>
                </div>
                <div className="hero-monitor-profile" />
              </div>
              <MeridianField className="hero-meridian-constellation" variant="hero" />
              <div className="floating-cards-container">
                {copy.heroPressureCards.map((item, index) => (
                  <article key={item.title} className={`floating-card ${floatingCardClasses[index]}`}>
                    <div className="floating-card-icon">
                      <item.icon />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
              <div className="hero-mark-lockup">
                <div className="hero-mark-shell">
                  <div className="hero-beam-origin" aria-hidden="true">
                    <span className="hero-word-halo" />
                    <span className="hero-word-core" />
                    <span className="hero-quantum-beam hero-quantum-beam-right" />
                    <span className="hero-quantum-beam hero-quantum-beam-left" />
                    <span className="hero-quantum-beam hero-quantum-beam-down-right" />
                    <span className="hero-quantum-beam hero-quantum-beam-down-left" />
                    <span className="hero-quantum-beam hero-quantum-beam-up" />
                  </div>
                  <span className="hero-wordmark hero-wordmark-core">PHAROS</span>
                </div>
                <div className="hero-wordmark-wrap">
                  <span className="hero-wordmark-subtitle">
                    <span>{subtitleLead}</span>
                    {subtitleTail ? <><br /><span>{language === 'fr' ? `par ${subtitleTail}` : `by ${subtitleTail}`}</span></> : null}
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-content hero-copy-panel glass-panel">
              <div className="brand-kicker">
                <span>{copy.brandKicker}</span>
              </div>
              <div className="hero-copy-header">
                <h1>{copy.heroTitle}</h1>
                <p className="hero-subheadline">{copy.heroSubheadline}</p>
              </div>
              <div className="grid-4 hero-field-grid hero-field-grid-mobile">
                {copy.heroPressureCards.map((item) => (
                  <div key={item.title} className="card hero-field-card">
                    <div className="card-icon">
                      <item.icon />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
              <p className="body-lg page-hero-copy">{copy.heroBody}</p>
              <p className="hero-founder-line">{copy.heroFounderLine}</p>
              <div className="hero-cta-row">
                <Link to="/contact" className="btn-primary">
                  {copy.primaryCta}
                  <ArrowRight />
                </Link>
                <Link to="/governance" className="btn-secondary">{copy.secondaryCta}</Link>
              </div>
              <SignalStrip items={copy.heroSignals} className="signal-grid-hero" />
            </div>
          </div>
        </div>
      </section>

      <section className="section anchor-offset" id="review-needs">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.reviewBodyTitle}</p>
            <h2>{copy.reviewBodyHeading}</h2>
            <p className="body-sm">{copy.reviewBodyText}</p>
          </div>

          <div className="editorial-panel reveal">
            <div className="feature-lockup">
              <div>
                <p className="eyebrow">{copy.standardLabel}</p>
                <h3>{copy.standardTitle}</h3>
              </div>
            </div>
            <div className="grid-2">
              {copy.reviewNeeds.map((item) => (
                <div key={item.title} className="scope-note">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted anchor-offset" id="pressure-points">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.pressureLabel}</p>
            <h2>{copy.pressureHeading}</h2>
            <p className="body-sm">{copy.pressureText}</p>
          </div>

          <div className="grid-4 stagger">
            {copy.pressurePoints.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section anchor-offset" id="method">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.methodLabel}</p>
            <h2>{copy.methodHeading}</h2>
            <p className="body-sm">{copy.methodText}</p>
          </div>

          <div className="steps stagger">
            {copy.methodSteps.map((item) => (
              <div key={item.step} className="step reveal">
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted anchor-offset" id="artifacts">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.artifactsLabel}</p>
            <h2>{copy.artifactsHeading}</h2>
            <p className="body-sm">{copy.artifactsText}</p>
          </div>

          <div className="grid-4 stagger">
            {copy.artifactCards.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section anchor-offset" id="service-routes">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.routesLabel}</p>
            <h2>{copy.routesHeading}</h2>
            <p className="body-sm">{copy.routesText}</p>
          </div>

          <div className="grid-3 stagger">
            {copy.serviceRoutes.map((item) => (
              <Link key={item.to} to={item.to} className="card reveal link-slab">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="card-link-row">
                  {copy.routeCta}
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>{copy.ctaHeading}</h2>
            <p className="body-sm">{copy.ctaText}</p>
            <div className="btn-row">
              <Link to="/contact" className="btn-primary">
                {copy.primaryCta}
                <ArrowRight />
              </Link>
              <Link to="/governance" className="btn-secondary">{copy.secondaryCta}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
