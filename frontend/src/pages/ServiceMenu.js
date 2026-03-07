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
        title: 'Des mandats structures pour repondre a l examen sans creer de theatre de gouvernance.',
        body: 'Le menu sert a lire la difference entre les points d entree: poser la fondation, resserrer les controles et la preuve, ou maintenir une supervision stable pendant que les systemes evoluent sans promettre plus que ce qui peut etre soutenu.',
        noteTitle: 'Comment lire le menu',
        noteBody: 'Choisissez d abord selon la source de pression, pas selon le vocabulaire. Le bon mandat est celui qui produit les pieces dont la revue aura besoin et qui laisse les zones encore ouvertes clairement visibles.',
        packageLabel: 'Mandats',
        packageTitle: 'Choisir le mandat qui correspond a la pression',
        packageBody: 'Chaque mandat est defini par son meilleur contexte, ses livrables explicites et ce que l organisation obtient a la fin sans glisser vers une promesse implicite de conformite totale.',
        deliverables: 'Livrables',
        produces: 'Ce que cela produit',
        bestFor: 'Ideal pour',
        discuss: 'Discuter de ce mandat',
        driversLabel: 'Dimensionnement',
        driversTitle: 'Ce qui fait varier la portee',
        driversBody: 'Le travail change selon le nombre de systemes, le niveau de revue attendu et la sensibilite des decisions soutenues par l IA, donc le niveau de preuve a tenir augmente aussi.',
        closingLabel: 'Prochain pas',
        closingTitle: 'Besoin d aide pour choisir le bon point d entree?',
        closingBody: 'Un debrief court suffit pour choisir le mandat, la portee et les premiers livrables les plus utiles sans surestimer l etat de preparation actuel.',
        actions: {
          connect: 'Reserver un debrief',
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
            title: 'Attentes de revue',
            description: 'Questionnaires, audits, obligations contractuelles ou demandes de direction qui structurent la preuve.'
          },
          {
            icon: Waypoints,
            title: 'Autorite de decision',
            description: 'Le niveau d autonomie, de sensibilite et d impact porte par les decisions assistees par l IA.'
          }
        ]
      }
    : {
        eyebrow: 'Service menu',
        title: 'Packages that answer scrutiny without governance theatre',
        body: 'The menu distinguishes the entry points: lay the foundation, tighten controls and evidence, or keep oversight stable as systems change without implying a stronger governance state than the evidence can support.',
        noteTitle: 'How to read the menu',
        noteBody: 'Choose first by pressure source, not by vocabulary. The right package is the one that produces the materials the review will actually ask for and leaves unresolved areas visible instead of smoothing them over.',
        packageLabel: 'Packages',
        packageTitle: 'Choose the package that matches the pressure',
        packageBody: 'Each package is defined by its best fit, explicit deliverables, and what the organization is left with at the end without turning a scoped engagement into an implied compliance promise.',
        deliverables: 'Deliverables',
        produces: 'What it produces',
        bestFor: 'Ideal for',
        discuss: 'Discuss this package',
        driversLabel: 'Scoping',
        driversTitle: 'What changes the scope',
        driversBody: 'The work shifts with the number of systems in scope, the level of review expected, and the sensitivity of the decisions the AI supports, so the evidence burden shifts with it.',
        closingLabel: 'Next step',
        closingTitle: 'Need help choosing the right entry point?',
        closingBody: 'A short debrief is enough to choose the package, the scope, and the first outputs that are most likely to matter without overstating current readiness.',
        actions: {
          connect: 'Book a debrief',
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
            title: 'Review expectations',
            description: 'Questionnaires, audits, contractual obligations, or leadership requests that shape the evidence burden.'
          },
          {
            icon: Waypoints,
            title: 'Decision authority',
            description: 'The level of autonomy, sensitivity, and impact carried by AI-supported decisions.'
          }
        ]
      };

  const fallbackPackages = [
    {
      id: 'foundation',
      icon: Shield,
      title: language === 'fr' ? 'Fondation de gouvernance' : 'Governance Foundation',
      bestFor: language === 'fr'
        ? 'Organisations qui mettent la gouvernance en place pour la premiere fois ou qui la consolident entre plusieurs equipes.'
        : 'Organizations establishing governance for the first time or consolidating governance across teams.',
      deliverables: language === 'fr'
        ? [
            'Demarrage d un inventaire des usages IA et fournisseurs',
            'Logique de priorisation avec exemples',
            'Droits de decision et flux d approbation',
            'Cadence de gouvernance: reunions, responsables et taches de maintien'
          ]
        : [
            'AI use-case and vendor inventory starter',
            'Tiering logic with examples',
            'Decision rights and approval flow',
            'Governance cadence: meeting model, owners, and upkeep tasks'
          ],
      produces: language === 'fr'
        ? [
            'Un modele de gouvernance que les equipes peuvent utiliser tout de suite',
            'Des roles plus nets pour l approvisionnement, l audit et la revue interne',
            'Une base defensable pour l escalation et la supervision'
          ]
        : [
            'A working governance model teams can use immediately',
            'Clearer roles for procurement, audit, and internal review',
            'A defensible baseline for escalation and oversight, with open gaps still visible'
          ]
    },
    {
      id: 'controls',
      icon: FileText,
      title: language === 'fr' ? 'Pack controles et preuves' : 'Controls and Evidence Pack',
      bestFor: language === 'fr'
        ? 'Organisations qui se preparent a l approvisionnement, a l audit interne, a des questionnaires clients ou a une revue plus formelle.'
        : 'Organizations preparing for procurement scrutiny, internal audit, customer questionnaires, or a more formal review.',
      deliverables: language === 'fr'
        ? [
            'Registre de controles mappe a vos niveaux de risque',
            'Attentes de test, de surveillance et de seuils',
            'Questions de revue fournisseur et checklist de preuves',
            'Modele de journal de decision et trame de dossier de revue'
          ]
        : [
            'Control register mapped to your risk tiers',
            'Testing, monitoring, and threshold expectations',
            'Vendor review questions and evidence checklist',
            'Decision log template and review packet outline'
          ],
      produces: language === 'fr'
        ? [
            'Une structure documentaire prete pour l approvisionnement',
            'Des attentes de preuve lisibles pour l audit',
            'Des proprietaires de controles et de maintien clairement nommes'
          ]
        : [
            'A documentation structure that is ready for procurement',
            'Legible evidence expectations for audit',
            'Named owners for controls, upkeep, and unresolved follow-up'
          ]
    },
    {
      id: 'oversight',
      icon: RefreshCw,
      title: language === 'fr' ? 'Mandat de supervision continue' : 'Oversight Retainer',
      bestFor: language === 'fr'
        ? 'Organisations avec une livraison IA active qui veulent une supervision stable, des decisions plus nettes et une documentation tenue a jour.'
        : 'Organizations with active AI delivery that want stable oversight, clearer decisions, and documentation that stays current.',
      deliverables: language === 'fr'
        ? [
            'Soutien recurrent aux revues de gouvernance et de risque',
            'Tenue du journal de decision et cadence de maintien de la preuve',
            'Mises a jour de la feuille de route controles selon la realite de livraison',
            'Soutien cible pendant des revues d approvisionnement ou d audit'
          ]
        : [
            'Recurring governance and risk review support',
            'Decision log stewardship and evidence upkeep cadence',
            'Control roadmap updates aligned to delivery realities',
            'Targeted support during procurement or audit reviews'
          ],
      produces: language === 'fr'
        ? [
            'Une supervision stable sans freiner la livraison',
            'Une documentation qui reste lisible pendant les changements',
            'Des syntheses exploitables pour la direction et les comites'
          ]
        : [
            'Stable oversight without slowing delivery',
            'Documentation that stays legible as systems change',
            'Usable summaries for leadership and committees that distinguish current proof from remaining uncertainty'
          ]
    }
  ];

  const packages = remotePackages.length > 0
    ? remotePackages.map((pkg) => ({
        id: pkg.id,
        icon: [Shield, FileText, RefreshCw][Math.max(0, (pkg.package_number || 1) - 1)] || Shield,
        title: language === 'fr' ? (pkg.title_fr || pkg.title_en) : (pkg.title_en || pkg.title_fr),
        bestFor: language === 'fr' ? (pkg.best_for_fr || pkg.best_for_en) : (pkg.best_for_en || pkg.best_for_fr),
        deliverables: language === 'fr' ? (pkg.deliverables_fr || pkg.deliverables_en || []) : (pkg.deliverables_en || pkg.deliverables_fr || []),
        produces: language === 'fr' ? (pkg.produces_fr || pkg.produces_en || []) : (pkg.produces_en || pkg.produces_fr || []),
        packageNumber: pkg.package_number
      }))
    : fallbackPackages;

  return (
    <div className="min-h-screen bg-transparent px-6 py-10 md:px-10" data-testid="service-menu-page">
      <div className="mx-auto max-w-[1240px]">
        <section className="brand-panel-dark brand-top-rule relative mb-8 overflow-hidden rounded-[34px] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="absolute right-[-22px] top-[-18px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(184,155,94,0.18)_0%,rgba(184,155,94,0)_72%)]" />
          <div className="absolute bottom-[-56px] left-[-18px] h-40 w-40 rotate-45 rounded-[20px] border border-[#B89B5E]/12" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.96fr] lg:items-start">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#D8C08A]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                {copy.eyebrow}
              </p>
              <h1 className="max-w-[16ch] text-[29px] leading-[1.04] tracking-[-0.05em] text-[#F6F0E4] sm:text-[32px] md:max-w-[12ch] md:text-[56px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                {copy.title}
              </h1>
              <p className="mt-4 max-w-[56ch] text-[14px] leading-[1.7] text-white/82 md:mt-5 md:max-w-[62ch] md:text-[17px] md:leading-[1.78]" style={{ fontFamily: "'Lato', sans-serif" }}>
                {copy.body}
              </p>
            </div>

            <div className="rounded-[30px] border border-[#B89B5E]/18 bg-[#FBF7EF] p-5 shadow-[0_22px_42px_rgba(8,20,40,0.18)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[18px] border border-[#B89B5E]/20 bg-[#F1E8D8]">
                  <img src={lighthouseMark} alt="Govern AI lighthouse mark" className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                    {copy.noteTitle}
                  </p>
                  <p className="mt-1 text-sm" style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(16, 22, 42, 0.78)' }}>
                    {copy.noteBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5 max-w-[840px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
              {copy.packageLabel}
            </p>
            <h2 className="mt-2 max-w-[15ch] text-[27px] leading-[1.06] text-[#10162A] md:max-w-none md:text-[38px]" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
              {copy.packageTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Lato', sans-serif" }}>
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
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8C08A]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                        {language === 'fr' ? `Mandat ${pkg.packageNumber || index + 1}` : `Package ${pkg.packageNumber || index + 1}`}
                      </p>
                      <h3 className="mt-2 text-[28px] leading-[1.02] text-[#F6F0E4]" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
                        {pkg.title}
                      </h3>
                      <p className="mt-4 text-sm leading-[1.75] text-white/78" style={{ fontFamily: "'Lato', sans-serif" }}>
                        <span className="font-semibold text-white">{copy.bestFor}: </span>
                        {pkg.bestFor}
                      </p>
                    </div>

                    <div className="grid gap-0 md:grid-cols-2">
                      <div className="border-b border-[#E6DDCD] p-6 md:border-b-0 md:border-r">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                          {copy.deliverables}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {pkg.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-[1.72] text-[#20314F]/74" style={{ fontFamily: "'Lato', sans-serif" }}>
                              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#13254C]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                          {copy.produces}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {pkg.produces.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-[1.72] text-[#20314F]/74" style={{ fontFamily: "'Lato', sans-serif" }}>
                              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#13254C]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Link
                            to="/connect"
                            className="inline-flex items-center gap-2 rounded-full border border-[#B89B5E]/24 bg-[#F7F1E6] px-4 py-2.5 text-sm text-[#13254C] transition-colors hover:border-[#B89B5E]/48"
                            style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}
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
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
              {copy.driversLabel}
            </p>
            <h2 className="mt-2 text-[30px] text-[#10162A] md:text-[38px]" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
              {copy.driversTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Lato', sans-serif" }}>
              {copy.driversBody}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.drivers.map((driver) => (
              <article key={driver.title} className="rounded-[24px] border border-[#D6CCBB] bg-[#FFFDF8] p-5 shadow-[0_12px_24px_rgba(8,20,40,0.05)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#B89B5E]/16 bg-[#F2E8D8]">
                  <driver.icon className="h-5 w-5 text-[#13254C]" />
                </div>
                <h3 className="text-[24px] text-[#10162A]" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
                  {driver.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.72] text-[#20314F]/72" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {driver.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-panel-dark rounded-[30px] px-6 py-7 text-white md:px-8 md:py-8">
          <div className="max-w-[760px]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8C08A]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
              {copy.closingLabel}
            </p>
            <h2 className="mt-2 text-[30px] md:text-[36px]" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
              {copy.closingTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.75] text-white/78" style={{ fontFamily: "'Lato', sans-serif" }}>
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
