import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, RefreshCw, ArrowRight, ChevronRight, BriefcaseBusiness, Scale, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import lighthouseMark from '../assets/logos/governance-lighthouse-simplified.svg';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ServiceMenu = () => {
  const { language } = useLanguage();
  const [remotePackages, setRemotePackages] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services/active`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRemotePackages(data);
      })
      .catch(() => {});
  }, []);

  const copy = language === 'fr'
    ? {
        eyebrow: 'Menu des services',
        title: 'Des services structures pour une gouvernance deterministe sous pression.',
        body: 'Le menu sert a lire les vrais points d entree: poser une gouvernance deterministe, faire une revue pre-mortem avant l exposition, ou conduire une revue post-mortem apres un incident, un echec ou une derive.',
        noteTitle: 'Comment lire le menu',
        noteBody: 'Choisissez d abord selon la source de pression, pas selon le vocabulaire. Le bon service est celui qui rend les chemins de decision deterministes, produit les pieces dont la revue aura besoin, et laisse les zones encore ouvertes clairement visibles.',
        packageLabel: 'Services',
        packageTitle: 'Choisir le service qui correspond a la pression',
        packageBody: 'Chaque service est defini par son meilleur contexte, ses livrables explicites et ce que l organisation obtient a la fin sans glisser vers une promesse implicite de conformite totale.',
        deliverables: 'Livrables',
        produces: 'Ce que cela produit',
        bestFor: 'Ideal pour',
        discuss: 'Discuter de ce service',
        driversLabel: 'Dimensionnement',
        driversTitle: 'Ce qui fait varier la portee',
        driversBody: 'Le travail change selon le nombre de systemes, le niveau de revue attendu et les consequences d un echec, donc le niveau de determinisme et de preuve a tenir augmente aussi.',
        closingLabel: 'Prochain pas',
        closingTitle: 'Besoin d aide pour choisir le bon point d entree?',
        closingBody: 'Une revue courte suffit pour choisir entre la gouvernance deterministe, une revue pre-mortem et une revue post-mortem sans surestimer l etat de preparation actuel.',
        actions: {
          connect: 'Reserver une revue',
          tool: 'Evaluer la preparation'
        },
        drivers: [
          {
            icon: BriefcaseBusiness,
            title: 'Portefeuille de systemes',
            description: 'Combien de systemes, de fournisseurs et de flux de donnees sont en jeu, et a quelle vitesse ils changent.'
          },
          {
            icon: Scale,
            title: 'Charge de revue',
            description: 'Questionnaires, audits, obligations contractuelles ou demandes de direction qui structurent la preuve a tenir.'
          },
          {
            icon: Waypoints,
            title: 'Consequence d echec',
            description: 'Le niveau de dommage possible si la decision, le controle ou la piste de preuve ne tient pas sous examen.'
          }
        ]
      }
    : {
        eyebrow: 'Service menu',
        title: 'Services for deterministic governance without governance theatre',
        body: 'The menu distinguishes the real entry points: establish deterministic governance, run a pre-mortem before exposure, or run a post-mortem after an incident, failed review, or governance drift.',
        noteTitle: 'How to read the menu',
        noteBody: 'Choose first by pressure source, not by vocabulary. The right service is the one that makes decision paths deterministic, produces the materials a real review will ask for, and leaves unresolved areas visible instead of smoothing them over.',
        packageLabel: 'Services',
        packageTitle: 'Choose the service that matches the pressure',
        packageBody: 'Each service is defined by its best fit, explicit deliverables, and what the organization is left with at the end without turning a scoped engagement into an implied compliance promise.',
        deliverables: 'Deliverables',
        produces: 'What it produces',
        bestFor: 'Ideal for',
        discuss: 'Discuss this service',
        driversLabel: 'Scoping',
        driversTitle: 'What changes the scope',
        driversBody: 'The work shifts with the number of systems in scope, the level of review expected, and the consequence of a failure, so the determinism and evidence burden shift with it.',
        closingLabel: 'Next step',
        closingTitle: 'Need help choosing the right entry point?',
        closingBody: 'A short review is enough to choose between deterministic governance, a pre-mortem review, and a post-mortem review without overstating current readiness.',
        actions: {
          connect: 'Book a review',
          tool: 'Assess readiness'
        },
        drivers: [
          {
            icon: BriefcaseBusiness,
            title: 'System portfolio',
            description: 'How many systems, vendors, and data pathways are in scope, and how quickly they change.'
          },
          {
            icon: Scale,
            title: 'Review burden',
            description: 'Questionnaires, audits, contractual obligations, or leadership requests shape how much proof the service needs to produce.'
          },
          {
            icon: Waypoints,
            title: 'Failure consequence',
            description: 'The consequence of a broken decision path, weak control, or missing evidence trail determines how deterministic the work has to be.'
          }
        ]
      };

  const fallbackPackages = [
    {
      id: 'deterministic-governance',
      icon: Shield,
      title: language === 'fr' ? 'Gouvernance deterministe' : 'Deterministic Governance',
      bestFor: language === 'fr'
        ? 'Organisations qui ont besoin de seuils explicites, de droits de decision nets et d une base stable avant que l examen amplifie l ambiguite.'
        : 'Organizations that need explicit thresholds, clear decision rights, and a stable baseline before scrutiny compounds ambiguity.',
      deliverables: language === 'fr'
        ? [
            'Inventaire des systemes et fournisseurs avec frontieres de portee',
            'Logique de priorisation et seuils deterministes',
            'Droits de decision, regles d escalation et flux d approbation',
            'Cadence de gouvernance avec responsables de maintien nommes'
          ]
        : [
            'System and vendor inventory with scope boundaries',
            'Deterministic tiering logic and thresholds',
            'Decision rights, escalation rules, and approval flow',
            'Governance cadence with named upkeep owners'
          ],
      produces: language === 'fr'
        ? [
            'Une base de gouvernance que les equipes peuvent executer de facon coherente',
            'Moins d ambiguite pendant l approvisionnement, l audit et la revue interne',
            'Des affirmations qui restent dans les limites de la preuve disponible'
          ]
        : [
            'A governance baseline teams can execute consistently',
            'Less ambiguity during procurement, audit, and internal review',
            'Claims that stay inside what the evidence can support'
          ]
    },
    {
      id: 'pre-mortem-review',
      icon: FileText,
      title: language === 'fr' ? 'Revue pre-mortem' : 'Pre-mortem Review',
      bestFor: language === 'fr'
        ? 'Organisations qui veulent tester un systeme IA avant le lancement, l approvisionnement, l integration d un fournisseur ou une expansion importante.'
        : 'Organizations pressure-testing an AI system before launch, procurement, onboarding, or major expansion.',
      deliverables: language === 'fr'
        ? [
            'Revue des modes d echec sur le systeme, le processus et les dependances fournisseurs',
            'Conditions d approbation ou de lancement avec exigences de preuve',
            'Questions de revue fournisseur et tiers',
            'Synthese go / no-go avec enjeux ouverts et points d escalation'
          ]
        : [
            'Failure-mode review across system, process, and vendor dependencies',
            'Launch or approval conditions with evidence requirements',
            'Vendor and third-party review questions',
            'Go / no-go summary with open issues and escalation triggers'
          ],
      produces: language === 'fr'
        ? [
            'Des risques identifies avant qu ils ne deviennent des incidents',
            'Des conditions d approbation deterministes pour le lancement ou l expansion',
            'Des ecarts de preuve et des responsables visibles avant l examen'
          ]
        : [
            'Risks surfaced before they become incidents',
            'Deterministic approval conditions for launch or expansion',
            'Clear evidence gaps and ownership before scrutiny arrives'
          ]
    },
    {
      id: 'post-mortem-review',
      icon: RefreshCw,
      title: language === 'fr' ? 'Revue post-mortem' : 'Post-mortem Review',
      bestFor: language === 'fr'
        ? 'Organisations qui repondent a un incident, a une revue ratee, a un constat d audit ou a une derive de gouvernance.'
        : 'Organizations responding to incidents, failed reviews, audit findings, or governance drift.',
      deliverables: language === 'fr'
        ? [
            'Reconstruction de l evenement, du chemin de decision et de la piste de preuve',
            'Revue des ecarts sur controles, documentation et responsabilites',
            'Priorites de remediation avec mise a jour des seuils et controles',
            'Synthese executive et actions de gouvernance de suivi'
          ]
        : [
            'Reconstruction of the event, decision path, and evidence trail',
            'Gap review across controls, documentation, and accountability',
            'Remediation priorities with threshold and control updates',
            'Executive summary and follow-up governance actions'
          ],
      produces: language === 'fr'
        ? [
            'Un dossier defensable sur ce qui s est passe et pourquoi',
            'Des responsabilites de remediation et un ordre de traitement explicites',
            'Une posture de gouvernance deterministe plus forte apres l echec'
          ]
        : [
            'A defensible record of what happened and why',
            'Clear remediation ownership and sequencing',
            'A stronger deterministic governance posture after failure'
          ]
    }
  ];

  const getLocalizedString = (pkg, field, fallbackValue) => {
    const primaryValue = language === 'fr' ? pkg[`${field}_fr`] : pkg[`${field}_en`];
    const secondaryValue = language === 'fr' ? pkg[`${field}_en`] : pkg[`${field}_fr`];

    return primaryValue || secondaryValue || fallbackValue;
  };

  const getLocalizedList = (pkg, field, fallbackValue) => {
    const primaryValue = language === 'fr' ? pkg[`${field}_fr`] : pkg[`${field}_en`];
    const secondaryValue = language === 'fr' ? pkg[`${field}_en`] : pkg[`${field}_fr`];

    if (Array.isArray(primaryValue)) return primaryValue;
    if (Array.isArray(secondaryValue)) return secondaryValue;
    return fallbackValue;
  };

  const packages = remotePackages.length > 0
    ? remotePackages.map((pkg, index) => {
        const template = fallbackPackages[Math.max(0, (pkg.package_number || index + 1) - 1)] || fallbackPackages[index] || fallbackPackages[0];
        return {
          ...template,
          ...pkg,
          id: pkg.id || template.id,
          title: getLocalizedString(pkg, 'title', template.title),
          bestFor: getLocalizedString(pkg, 'best_for', template.bestFor),
          deliverables: getLocalizedList(pkg, 'deliverables', template.deliverables),
          produces: getLocalizedList(pkg, 'produces', template.produces),
          packageNumber: pkg.package_number || index + 1
        };
      })
    : fallbackPackages.map((pkg, index) => ({ ...pkg, packageNumber: index + 1 }));

  return (
    <div className="min-h-screen bg-transparent px-6 py-10 md:px-10" data-testid="service-menu-page">
      <div className="mx-auto max-w-[1240px]">
        <section className="brand-panel-dark brand-top-rule relative mb-8 overflow-hidden rounded-[34px] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="absolute right-[-22px] top-[-18px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(184,155,94,0.18)_0%,rgba(184,155,94,0)_72%)]" />
          <div className="absolute bottom-[-56px] left-[-18px] h-40 w-40 rotate-45 rounded-[20px] border border-[#B89B5E]/12" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.96fr] lg:items-start">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.eyebrow}
              </p>
              <h1 className="max-w-[16ch] text-[29px] leading-[1.04] tracking-[-0.05em] text-[#F6F0E4] sm:text-[32px] md:max-w-[12ch] md:text-[56px]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.title}
              </h1>
              <p className="mt-4 max-w-[56ch] text-[14px] leading-[1.7] text-white/82 md:mt-5 md:max-w-[62ch] md:text-[17px] md:leading-[1.78]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {copy.body}
              </p>
            </div>

            <div className="rounded-[30px] border border-[#B89B5E]/18 bg-[#FBF7EF] p-5 shadow-[0_22px_42px_rgba(8,20,40,0.18)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[18px] border border-[#B89B5E]/20 bg-[#F1E8D8]">
                  <img src={lighthouseMark} alt="PHAROS lighthouse mark" className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                    {copy.noteTitle}
                  </p>
                  <p className="mt-1 text-sm" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: 'rgba(16, 22, 42, 0.78)' }}>
                    {copy.noteBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5 max-w-[840px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.packageLabel}
            </p>
            <h2 className="mt-2 max-w-[15ch] text-[27px] leading-[1.06] text-[#10162A] md:max-w-none md:text-[38px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.packageTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.packageBody}
            </p>
          </div>

          <div className="space-y-6">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <article key={pkg.id} className="overflow-hidden rounded-[28px] border border-[#D6CCBB] bg-[#FFFDF8] shadow-[0_16px_30px_rgba(8,20,40,0.05)]" data-testid={`package-${pkg.id}`}>
                  <div className="grid gap-0 lg:grid-cols-[0.38fr_0.62fr]">
                    <div className="bg-[linear-gradient(145deg,#0F1D37_0%,#13254C_52%,#1E3569_100%)] p-6 text-white">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                        {language === 'fr' ? `Service ${pkg.packageNumber || index + 1}` : `Service ${pkg.packageNumber || index + 1}`}
                      </p>
                      <h3 className="mt-2 text-[28px] leading-[1.02] text-[#F6F0E4]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                        {pkg.title}
                      </h3>
                      <p className="mt-4 text-sm leading-[1.75] text-white/78" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                        <span className="font-semibold text-white">{copy.bestFor}: </span>
                        {pkg.bestFor}
                      </p>
                    </div>

                    <div className="grid gap-0 md:grid-cols-2">
                      <div className="border-b border-[#E6DDCD] p-6 md:border-b-0 md:border-r">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                          {copy.deliverables}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {pkg.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-[1.72] text-[#20314F]/74" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#13254C]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                          {copy.produces}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {pkg.produces.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-[1.72] text-[#20314F]/74" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#13254C]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Link
                            to="/connect"
                            className="inline-flex items-center gap-2 rounded-full border border-[#B89B5E]/24 bg-[#F7F1E6] px-4 py-2.5 text-sm text-[#13254C] transition-colors hover:border-[#B89B5E]/48"
                            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
                          >
                            {copy.discuss}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="brand-panel mb-8 rounded-[32px] px-6 py-7 md:px-8 md:py-8">
          <div className="mb-6 max-w-[860px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.driversLabel}
            </p>
            <h2 className="mt-2 text-[30px] text-[#10162A] md:text-[38px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.driversTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.driversBody}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.drivers.map((driver) => (
              <article key={driver.title} className="rounded-[24px] border border-[#D6CCBB] bg-[#FFFDF8] p-5 shadow-[0_12px_24px_rgba(8,20,40,0.05)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#B89B5E]/16 bg-[#F2E8D8]">
                  <driver.icon className="h-5 w-5 text-[#13254C]" />
                </div>
                <h3 className="text-[24px] text-[#10162A]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                  {driver.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.72] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                  {driver.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-panel-dark rounded-[30px] px-6 py-7 text-white md:px-8 md:py-8">
          <div className="max-w-[760px]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.closingLabel}
            </p>
            <h2 className="mt-2 text-[30px] md:text-[36px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.closingTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.75] text-white/78" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.closingBody}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/connect" className="brand-button-primary">
              {copy.actions.connect}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/tool" className="brand-button-secondary">
              {copy.actions.tool}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceMenu;
