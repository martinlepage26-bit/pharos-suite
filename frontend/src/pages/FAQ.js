import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, FileCheck2, ShieldCheck, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SignalStrip from '../components/SignalStrip';

const FAQ = () => {
  const { language } = useLanguage();
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (section, index) => {
    const key = `${section}-${index}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copy = language === 'fr'
    ? {
        eyebrow: 'FAQ',
        title: 'Reponses directes',
        body: 'Ces questions reviennent quand une equipe prepare une revue, un questionnaire, une discussion de direction ou un premier mandat. Les reponses restent proches de ce qui peut etre demontre, de ce qui manque encore, et de ce qu il ne faut pas exagerer.',
        noteLabel: 'Usage',
        noteTitle: 'Commencer par les questions qui reviennent sous pression.',
        noteBody: 'Quand l examen arrive, les memes demandes reviennent: qui decide, quel dossier existe, quelles preuves tiennent, et ou la preuve reste trop mince pour soutenir une affirmation plus forte.',
        notePills: ['Decision', 'Preuve', 'Mandat'],
        sectionIntroLabel: 'Themes',
        sectionIntroTitle: 'Les questions se regroupent autour de trois besoins',
        sectionIntroBody: 'Comprendre ce que la gouvernance est, ce qu il faut avoir en main pour la revue, et comment le travail reste proportionne a la preuve disponible.',
        summaryCards: [
          {
            label: 'Cette page couvre',
            title: 'Gouvernance, preuve et mandat',
            description: 'Les questions qui reviennent quand une equipe doit expliquer comment l IA est gouvernee sous examen.'
          },
          {
            label: 'Les revues demandent d abord',
            title: 'Qui decide et quelle preuve existe',
            description: 'Les premiers points de pression portent sur les droits decisionnels, les controles nommes et le dossier de revue.'
          },
          {
            label: 'Le meilleur prochain pas',
            title: 'S orienter ici, puis cadrer le cas reel',
            description: 'Utilisez la FAQ pour vous situer, puis passez a un debrief ou a un instantane de preparation quand les faits deviennent specifiques.'
          }
        ],
        closingLabel: 'Suite',
        closingTitle: 'Besoin d une reponse liee a votre cas concret?',
        closingBody: 'Le meilleur prochain pas est un debrief court avec le contexte, la source de pression et le niveau de preuve que la situation exigera.',
        actions: {
          connect: 'Reserver un debrief',
          tool: 'Evaluer la preparation',
          services: 'Voir les services'
        },
        sections: [
          {
            key: 'starting',
            title: 'Point de depart',
            description: 'Pour clarifier ce que la gouvernance couvre, quand elle devient necessaire et comment la distinguer du simple langage de principes.',
            icon: ShieldCheck,
            items: [
              {
                q: 'Qu est-ce que la gouvernance IA, concretement?',
                a: 'C est le systeme operatoire qui rend l usage de l IA lisible, controle et defensable en revue. Cela inclut les droits de decision, la logique de priorisation, les controles, les preuves et la cadence de revue.'
              },
              {
                q: 'Quelle difference entre ethique de l IA et gouvernance IA?',
                a: 'L ethique formule des principes. La gouvernance traduit ces principes en roles, seuils, revues et documentation. L une dit ce qui compte. L autre dit qui verifie quoi, quand, et avec quelle preuve.'
              },
              {
                q: 'Comment savoir si le travail de gouvernance est deja en retard?',
                a: 'Si vous ne pouvez pas montrer un inventaire des cas d usage, expliquer qui approuve, ou produire un dossier de preuve simple pour un systeme important, la gouvernance a deja pris du retard sur le deploiement.'
              }
            ]
          },
          {
            key: 'evidence',
            title: 'Preuve et revue',
            description: 'Pour les equipes qui se preparent a l approvisionnement, a l audit, a la revue fournisseur ou a une demande plus formelle de justification.',
            icon: FileCheck2,
            items: [
              {
                q: 'Que veulent vraiment les auditeurs et les equipes d approvisionnement?',
                a: 'Ils veulent pouvoir dire oui sans prendre un risque aveugle. Cela veut dire des niveaux de risque, des droits de decision, des controles nommes, des tests, et un dossier qui se laisse suivre sans explications improvisees ni promesses gonflees.'
              },
              {
                q: 'Quels documents faut-il avoir en premier?',
                a: <>Commencez par un inventaire des usages et fournisseurs, une logique de priorisation, un registre de controles et un dossier de revue qui montre ce qui est demontre et ce qui reste ouvert. La <Link to="/library" className="text-[#13254C] underline-offset-4 hover:underline">Library</Link> donne les references, et les <Link to="/services/menu" className="text-[#13254C] underline-offset-4 hover:underline">mandats</Link> montrent ce que cela produit.</>
              },
              {
                q: 'La gouvernance ralentit-elle les equipes?',
                a: 'Une mauvaise gouvernance ralentit. Une bonne gouvernance retire des negociations repetitives, fixe les attentes de revue plus tot et evite de reconstruire la preuve a la derniere minute.'
              }
            ]
          },
          {
            key: 'engagements',
            title: 'Mandats et travail ensemble',
            description: 'Pour comprendre ce qu un mandat produit, comment le travail commence et comment traiter les dependances sur des fournisseurs.',
            icon: Waypoints,
            items: [
              {
                q: 'A quoi ressemble un mandat typique?',
                a: 'Le travail commence generalement par un cadrage: quels systemes sont en jeu, quelle pression s exerce et quelles decisions doivent etre rendues plus nettes. Ensuite viennent la priorisation, les controles, la documentation, et une vue claire de ce qui tient deja, de ce qui demande plus de preuve et, si besoin, une cadence de maintien.'
              },
              {
                q: 'Faut-il gouverner aussi l IA de fournisseurs?',
                a: 'Oui. Le fait qu un modele ou un agent soit externe ne transfere pas la responsabilite. Il faut une revue fournisseur, des exigences contractuelles, une logique d usage acceptable et une facon de reevaluer la dependance.'
              },
              {
                q: 'Comment commencer sans lancer un projet trop lourd?',
                a: <>Le plus simple est de passer par l <Link to="/tool" className="text-[#13254C] underline-offset-4 hover:underline">instantane de preparation</Link>, puis par un <Link to="/connect" className="text-[#13254C] underline-offset-4 hover:underline">debrief</Link> court. Cela permet de choisir le bon point d entree avant d ouvrir un mandat plus large.</>
              }
            ]
          }
        ]
      }
    : {
        eyebrow: 'FAQ',
        title: 'Straight answers for teams that need legible governance',
        body: 'These are the questions that surface during review, questionnaires, leadership discussions, and early scoping. The answers stay close to what can be evidenced now, what still needs work, and what should not be overstated.',
        noteLabel: 'Use',
        noteTitle: 'Start with the questions that recur under pressure.',
        noteBody: 'When scrutiny shows up, the same requests follow. Who decides, what packet exists, what proof can hold up, and where the evidence is still thin enough that the claim should stay narrow.',
        notePills: ['Decision', 'Evidence', 'Engagement'],
        sectionIntroLabel: 'Themes',
        sectionIntroTitle: 'The questions cluster around three practical needs',
        sectionIntroBody: 'Understanding what governance is, what has to exist for review, and how the work stays proportionate to the evidence behind it.',
        summaryCards: [
          {
            label: 'This page covers',
            title: 'Governance, evidence, and engagement shape',
            description: 'The recurring questions teams face when they need to explain how AI is being governed under scrutiny.'
          },
          {
            label: 'Reviewers ask first',
            title: 'Who decides and what proof exists',
            description: 'The first pressure points are decision rights, named controls, and the packet a reviewer can actually follow.'
          },
          {
            label: 'Best next move',
            title: 'Orient here, then scope the real case',
            description: 'Use the FAQ to get oriented, then move to a debrief or readiness snapshot when the facts become specific.'
          }
        ],
        closingLabel: 'Next step',
        closingTitle: 'Need an answer tied to your actual situation?',
        closingBody: 'The best next move is a short debrief with the context, the pressure source, and the evidence burden you are likely to face.',
        actions: {
          connect: 'Book a debrief',
          tool: 'Assess readiness',
          services: 'View services'
        },
        sections: [
          {
            key: 'starting',
            title: 'Starting point',
            description: 'For clarifying what governance covers, when it becomes necessary, and how it differs from values language on its own.',
            icon: ShieldCheck,
            items: [
              {
                q: 'What is AI governance in practical terms?',
                a: 'It is the operating system that makes AI use legible, controlled, and defensible in review. That includes decision rights, tiering logic, controls, evidence, and an ongoing review cadence.'
              },
              {
                q: 'What is the difference between AI ethics and AI governance?',
                a: 'Ethics states principles. Governance turns those principles into roles, thresholds, reviews, and documentation. One tells you what matters. The other tells you who checks what, when, and with what proof.'
              },
              {
                q: 'How do I know the governance work is already behind?',
                a: 'If you cannot show an inventory of use cases, explain who approves what, or produce a simple review packet for an important system, governance is already trailing deployment.'
              }
            ]
          },
          {
            key: 'evidence',
            title: 'Evidence and review',
            description: 'For teams preparing for procurement, audit, vendor review, or a more formal request to justify how AI is being governed.',
            icon: FileCheck2,
            items: [
              {
                q: 'What do auditors and procurement teams actually want?',
                a: 'They want to be able to say yes without taking blind risk. That means risk tiers, named decision rights, clear controls, testing expectations, and a packet they can follow without improvisation or inflated claims.'
              },
              {
                q: 'What documents should exist first?',
                a: <>Start with a use-case and vendor inventory, tiering logic, a control register, and a review packet that shows what is evidenced now and what remains open. The <Link to="/library" className="text-[#13254C] underline-offset-4 hover:underline">Library</Link> points to the reference materials, and the <Link to="/services/menu" className="text-[#13254C] underline-offset-4 hover:underline">service menu</Link> shows what the resulting work product can look like.</>
              },
              {
                q: 'Will governance slow teams down?',
                a: 'Bad governance slows teams down. Good governance removes repeated negotiation, sets review expectations earlier, and keeps the evidence layer from becoming a last-minute reconstruction project.'
              }
            ]
          },
          {
            key: 'engagements',
            title: 'Engagements and working together',
            description: 'For understanding what an engagement produces, how the work typically begins, and how to think about vendor dependencies.',
            icon: Waypoints,
            items: [
              {
                q: 'What does a typical engagement produce?',
                a: 'Most engagements begin with calibration: which systems matter, what pressure is present, and which decisions need to become clearer. From there the work usually moves into tiering, controls, documentation, and a clear view of what can be supported now, what needs more evidence, and if needed an upkeep cadence.'
              },
              {
                q: 'Do we still need governance if we rely on vendor AI?',
                a: 'Yes. External models and agents do not transfer accountability away from the deploying organization. You still need vendor review, contract language, acceptable-use boundaries, and a way to reassess the dependency.'
              },
              {
                q: 'How do we start without opening a heavyweight project?',
                a: <>The lightest entry point is the <Link to="/tool" className="text-[#13254C] underline-offset-4 hover:underline">readiness snapshot</Link>, followed by a short <Link to="/connect" className="text-[#13254C] underline-offset-4 hover:underline">debrief</Link>. That gives you the right entry point before you commit to a larger engagement.</>
              }
            ]
          }
        ]
      };

  return (
    <div className="faq-page min-h-screen bg-transparent px-6 py-10 md:px-10" data-testid="faq-page">
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
              <p className="mt-4 max-w-[58ch] text-[14px] leading-[1.7] text-white/82 md:mt-5 md:max-w-[62ch] md:text-[17px] md:leading-[1.78]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {copy.body}
              </p>
            </div>

            <div className="rounded-[30px] border border-[#B89B5E]/18 bg-[#FBF7EF] p-5 shadow-[0_22px_42px_rgba(8,20,40,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.noteLabel}
              </p>
              <div className="mt-4 rounded-[24px] border border-[#13254C]/12 bg-white/84 p-5">
                <h2 className="text-[25px] leading-[1.06] text-[#081428] md:text-[28px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                  {copy.noteTitle}
                </h2>
                <p className="mt-3 text-sm leading-[1.78]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: 'rgba(32, 49, 79, 0.76)' }}>
                  {copy.noteBody}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {copy.notePills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center rounded-full border border-[#D6CCBB] bg-[#FBF7EF] px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#13254C]"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-panel mb-8 rounded-[32px] px-6 py-7 md:px-8 md:py-8">
          <div className="mb-6 max-w-[860px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.sectionIntroLabel}
            </p>
            <h2 className="mt-2 max-w-[15ch] text-[27px] leading-[1.06] text-[#10162A] md:max-w-none md:text-[38px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.sectionIntroTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.sectionIntroBody}
            </p>
          </div>

          <SignalStrip items={copy.summaryCards} className="signal-grid-light reveal visible" />

          <div className="space-y-6">
            {copy.sections.map((section) => (
              <div key={section.key} className="rounded-[28px] border border-[#D6CCBB] bg-[#FFFDF8] p-5 shadow-[0_16px_30px_rgba(8,20,40,0.05)]">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#B89B5E]/18 bg-[#F2E8D8]">
                    <section.icon className="h-5 w-5 text-[#13254C]" />
                  </div>
                  <div>
                    <h2 className="text-[24px] leading-[1.08] text-[#10162A] md:text-[26px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-[1.72] text-[#20314F]/68" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, index) => {
                    const isOpen = openItems[`${section.key}-${index}`];
                    return (
                      <div key={index} className="overflow-hidden rounded-[22px] border border-[#D6CCBB] bg-[#FBF7EF] shadow-[0_10px_24px_rgba(8,20,40,0.04)]">
                        <button
                          onClick={() => toggleItem(section.key, index)}
                          className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-[#F7F1E6]"
                          data-testid={`faq-${section.key}-${index}`}
                        >
                          <span className="text-sm text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                            {item.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 flex-shrink-0 text-[#13254C]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#20314F]/44" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="border-t border-[#E6DDCD] px-4 pb-4 pt-4 text-sm leading-[1.8] text-[#20314F]/76" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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
            <Link to="/services" className="brand-button-secondary">
              {copy.actions.services}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
