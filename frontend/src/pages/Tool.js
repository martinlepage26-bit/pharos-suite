import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, ClipboardList, Radar, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Tool = () => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedSector, setSelectedSector] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sectorKeys = ['regulated', 'enterpriseSaas', 'procurement', 'publicSector', 'financial', 'construction', 'governance'];
  const sectorIds = ['regulated', 'enterprise-saas', 'procurement', 'public-sector', 'financial', 'construction', 'governance-model'];

  const questionKeys = ['inventory', 'riskTiering', 'decisionRights', 'controls', 'evidence', 'vendorReview', 'cadence', 'documentation'];
  const questionOptions = [
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.partial, score: 1 }, { value: 'complete', label: t.tool.answers.yes, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'informal', label: t.tool.answers.informal, score: 1 }, { value: 'formal', label: t.tool.answers.formal, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.partial, score: 1 }, { value: 'complete', label: t.tool.answers.yes, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.some, score: 1 }, { value: 'complete', label: t.tool.answers.yes, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.adhoc, score: 1 }, { value: 'complete', label: t.tool.answers.systematic, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.basic, score: 1 }, { value: 'complete', label: t.tool.answers.structured, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.occasional, score: 1 }, { value: 'complete', label: t.tool.answers.established, score: 2 }],
    [{ value: 'none', label: t.tool.answers.no, score: 0 }, { value: 'partial', label: t.tool.answers.outdated, score: 1 }, { value: 'complete', label: t.tool.answers.current, score: 2 }]
  ];

  const readinessQuestions = questionKeys.map((key, i) => ({
    id: key,
    question: t.tool.questions[key],
    options: questionOptions[i]
  }));
  const preMortemHref = '/services#pre-mortem-review';

  const copy = language === 'fr'
      ? {
        eyebrow: 'Outil',
        title: 'Instantane de gouvernance',
        body: 'Choisissez l environnement le plus proche de votre travail, repondez a huit questions, et obtenez une lecture rapide des zones ou les controles, la preuve et les droits de decision restent trop minces pour soutenir une revue sereinement.',
        noteLabel: 'Ce que fait l outil',
        noteTitle: 'Reperer la couche manquante.',
        noteBody: 'Cet outil ne remplace pas un audit ni une certification. Il sert a calibrer si l inventaire, la priorisation, les controles, la preuve et la cadence sont deja en place, et a garder les affirmations dans les limites de ce qui est vraiment demonstrable.',
        noteCards: [
          {
            icon: ClipboardList,
            title: 'Inventaire',
            description: 'Voir si les usages et dependances sont clairement nommes et assez traces pour etre revus.'
          },
          {
            icon: Radar,
            title: 'Controle',
            description: 'Voir si la logique de revue, d escalation et de traitement des ecarts est definie.'
          },
          {
            icon: ShieldCheck,
            title: 'Preuve',
            description: 'Voir si la documentation existe deja dans une forme lisible et defendable.'
          }
        ],
        runLabel: 'Evaluation',
        runTitle: 'Faire l instantane',
        runBody: 'Le resultat n est pas un verdict final. C est un signal sur l endroit ou le travail doit commencer, et sur les zones ou le statut devrait rester provisoire.',
        sectorPrompt: 'Choisissez l environnement le plus proche de votre travail',
        questionPrompt: 'Repondez selon l etat actuel, pas selon le modele ideal',
        reset: 'Recommencer',
        discuss: 'Discuter du resultat',
        services: 'Voir la revue pre-mortem'
      }
    : {
        eyebrow: 'Tool',
        title: 'A quick snapshot of governance strength and thin spots',
        body: 'Choose the closest environment, answer eight questions, and get a fast signal on where governance still needs structure before review pressure turns those gaps into blockers.',
        noteLabel: 'What the tool does',
        noteTitle: 'Locate the missing layer before review forces it.',
        noteBody: 'This is not a certification or an audit. It is a short calibration to see whether inventory, tiering, controls, evidence, and cadence are already in place, and to keep the resulting claims inside what can actually be demonstrated.',
        noteCards: [
          {
            icon: ClipboardList,
            title: 'Inventory',
            description: 'Check whether systems, uses, and dependencies are clearly named and traceable enough for review.'
          },
          {
            icon: Radar,
            title: 'Control',
            description: 'Check whether review logic, escalation paths, and gap handling are defined.'
          },
          {
            icon: ShieldCheck,
            title: 'Evidence',
            description: 'Check whether documentation already exists in a legible and defensible form.'
          }
        ],
        runLabel: 'Assessment',
        runTitle: 'Run the readiness snapshot',
        runBody: 'The result is not a final judgment. It is a signal about where the work likely needs to begin and where the status should remain provisional.',
        sectorPrompt: 'Choose the environment closest to your work',
        questionPrompt: 'Answer for the current state, not the ideal one',
        reset: 'Start over',
        discuss: 'Discuss the result',
        services: 'View Pre-mortem Review'
      };

  const handleSectorSelect = (sectorId) => setSelectedSector(sectorId);
  const handleAnswer = (questionId, value, score) => setAnswers((prev) => ({ ...prev, [questionId]: { value, score } }));

  const handleNext = () => {
    if (step === 1 && selectedSector) {
      setStep(2);
      setCurrentQuestion(0);
    } else if (step === 2) {
      if (currentQuestion < readinessQuestions.length - 1) setCurrentQuestion((prev) => prev + 1);
      else setDrawerOpen(true);
    }
  };

  const handleBack = () => {
    if (step === 2 && currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
    else if (step === 2 && currentQuestion === 0) setStep(1);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSector(null);
    setAnswers({});
    setCurrentQuestion(0);
    setDrawerOpen(false);
  };

  const calculateScore = () => {
    const totalPossible = readinessQuestions.length * 2;
    const actualScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
    return { score: actualScore, total: totalPossible, percentage: Math.round((actualScore / totalPossible) * 100) };
  };

  const getReadinessLevel = (percentage) => {
    if (percentage >= 75) return { risk: t.tool.results.risks.low, recommendation: t.tool.results.recommendations.high };
    if (percentage >= 50) return { risk: t.tool.results.risks.moderate, recommendation: t.tool.results.recommendations.moderate };
    if (percentage >= 25) return { risk: t.tool.results.risks.elevated, recommendation: t.tool.results.recommendations.elevated };
    return { risk: t.tool.results.risks.high, recommendation: t.tool.results.recommendations.low };
  };

  const getNextSteps = (percentage) => {
    if (percentage >= 75) return t.tool.results.nextSteps.high;
    if (percentage >= 50) return t.tool.results.nextSteps.moderate;
    return t.tool.results.nextSteps.low;
  };

  const currentQuestionData = readinessQuestions[currentQuestion];
  const canProceed = step === 1 ? selectedSector : answers[currentQuestionData?.id];
  const isLastQuestion = currentQuestion === readinessQuestions.length - 1;

  return (
    <div className="tool-page min-h-screen bg-transparent px-5 pb-8 pt-[92px] md:px-8 md:pb-10 md:pt-[108px]" data-testid="tool-page">
      <div className="mx-auto max-w-[1160px]">
        <section className="tool-hero-panel brand-panel-dark brand-top-rule relative mb-6 overflow-hidden rounded-[30px] px-5 py-6 text-white md:px-7 md:py-7">
          <div className="absolute right-[-22px] top-[-18px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(184,155,94,0.18)_0%,rgba(184,155,94,0)_72%)]" />
          <div className="absolute bottom-[-56px] left-[-18px] h-40 w-40 rotate-45 rounded-[20px] border border-[#B89B5E]/12" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.eyebrow}
              </p>
              <h1 className="max-w-[16ch] text-[26px] leading-[1.03] tracking-[-0.05em] text-[#F6F0E4] sm:text-[30px] md:max-w-[12ch] md:text-[48px]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.title}
              </h1>
              <p className="mt-3 max-w-[54ch] text-[13px] leading-[1.65] text-white/82 md:mt-4 md:max-w-[60ch] md:text-[15px] md:leading-[1.72]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {copy.body}
              </p>
            </div>

            <div className="tool-note-card rounded-[26px] border border-[#B89B5E]/18 bg-[#FBF7EF] p-4 shadow-[0_18px_34px_rgba(8,20,40,0.16)]">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.noteLabel}
              </p>
              <p className="mt-1 text-[13px] leading-[1.4]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: 'rgba(16, 22, 42, 0.78)' }}>
                {copy.noteTitle}
              </p>
              <p className="mt-3 text-[13px] leading-[1.65] text-[#20314F]/76" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {copy.noteBody}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="mb-4 max-w-[780px]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.runLabel}
            </p>
            <h2 className="mt-1.5 max-w-[15ch] text-[24px] leading-[1.04] text-[#10162A] md:max-w-none md:text-[34px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.runTitle}
            </h2>
            <p className="mt-2 text-[13px] leading-[1.68] text-[#20314F]/72 md:text-[14px]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.runBody}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {copy.noteCards.map((card) => (
              <article key={card.title} className="tool-metric-card rounded-[20px] border border-[#D6CCBB] bg-[#FBF7EF]/92 p-4 shadow-[0_10px_18px_rgba(8,20,40,0.04)]">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#B89B5E]/16 bg-[#F2E8D8]">
                  <card.icon className="h-4.5 w-4.5 text-[#13254C]" />
                </div>
                <h3 className="text-[20px] leading-[1.05] text-[#10162A] md:text-[22px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                  {card.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.62] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="tool-run-panel brand-panel rounded-[28px] px-5 py-5 md:px-6 md:py-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {step === 1 ? copy.sectorPrompt : copy.questionPrompt}
              </p>
              <div className="mt-2.5 flex gap-2.5 text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                <span className={step >= 1 ? 'text-[#13254C]' : 'text-[#20314F]/38'}>{t.tool.steps.sector}</span>
                <span className="text-[#6F5626]">/</span>
                <span className={step >= 2 ? 'text-[#13254C]' : 'text-[#20314F]/38'}>{t.tool.steps.readiness}</span>
                <span className="text-[#6F5626]">/</span>
                <span className={drawerOpen ? 'text-[#13254C]' : 'text-[#20314F]/38'}>{t.tool.steps.results}</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="tool-reset-btn rounded-full border border-[#D6CCBB] bg-white px-3.5 py-1.5 text-[13px] text-[#13254C] transition-colors hover:border-[#B89B5E]/34"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
              data-testid="reset-btn"
            >
              {copy.reset}
            </button>
          </div>

          {step === 1 && (
            <div data-testid="step-1-sector">
              <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                {sectorKeys.map((key, i) => (
                  <button
                    key={key}
                    onClick={() => handleSectorSelect(sectorIds[i])}
                    data-testid={`sector-${sectorIds[i]}`}
                    className={`tool-sector-card rounded-[18px] border p-3.5 text-left transition-colors ${
                      selectedSector === sectorIds[i]
                        ? 'border-[#13254C] bg-[#F2E8D8] shadow-[0_12px_24px_rgba(8,20,40,0.08)]'
                        : 'border-[#D6CCBB] bg-[#FFFDF8] hover:border-[#B89B5E]/34'
                    }`}
                  >
                    <h3 className="text-[13px] leading-[1.35] text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                      {t.tool.sectors[key].title}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-[1.55] text-[#20314F]/68" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                      {t.tool.sectors[key].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div data-testid="step-2-readiness">
              <div className="tool-question-card rounded-[20px] border border-[#D6CCBB] bg-[#FFFDF8] p-4 shadow-[0_10px_24px_rgba(8,20,40,0.04)]">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-[22px] text-[#10162A]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                    {t.tool.step2.title} {currentQuestion + 1} {t.tool.step2.of} {readinessQuestions.length}
                  </h3>
                  <div className="flex gap-1.5">
                    {readinessQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className={`h-2 w-2 rounded-full ${
                          index === currentQuestion ? 'bg-[#13254C]' : answers[question.id] ? 'bg-[#B89B5E]' : 'bg-[#D6CCBB]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[16px] leading-[1.55] text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }} data-testid={`question-${currentQuestionData.id}`}>
                  {currentQuestionData.question}
                </p>

                <div className="mt-4 grid gap-2.5 md:grid-cols-3">
                  {currentQuestionData.options.map((option) => {
                    const isSelected = answers[currentQuestionData.id]?.value === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(currentQuestionData.id, option.value, option.score)}
                        className={`tool-answer-card rounded-[16px] border px-3 py-3 text-[13px] transition-colors ${
                          isSelected
                            ? 'border-[#13254C] bg-[#F2E8D8] text-[#13254C]'
                            : 'border-[#D6CCBB] bg-[#FBF7EF] text-[#20314F] hover:border-[#B89B5E]/34'
                        }`}
                        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 border-t border-[#E6DDCD] pt-4">
            {(step > 1 || (step === 2 && currentQuestion > 0)) && (
              <button
                onClick={handleBack}
                className="text-[13px] text-[#20314F] transition-colors hover:text-[#13254C]"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
                data-testid="back-btn"
              >
                {t.tool.buttons.back}
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed}
              data-testid="next-btn"
              className={`ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition-colors ${
                canProceed
                  ? 'bg-[#13254C] text-[#F6F0E4] hover:bg-[#0F1D37]'
                  : 'bg-[#E8E1D3] text-[#8E8A80] cursor-not-allowed'
              }`}
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
            >
              {isLastQuestion && step === 2 ? t.tool.buttons.seeResults : t.tool.buttons.next}
              {canProceed && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </section>
      </div>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-[4000] bg-[#081428]/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} data-testid="drawer-backdrop" />
          <div className="fixed right-0 top-0 z-[4500] flex h-screen w-full flex-col overflow-hidden border-l border-[#D6CCBB] bg-[#FFFDF8] shadow-2xl md:w-[520px]" data-testid="results-drawer">
            <div className="border-b border-[#E7DECE] bg-[#0F1D37] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                    {t.tool.steps.results}
                  </p>
                  <h3 className="mt-1.5 text-[28px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                    {t.tool.results.title}
                  </h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="rounded-full border border-white/14 bg-white/8 p-2 transition-colors hover:bg-white/12" data-testid="close-drawer-btn">
                  <X className="h-5 w-5 text-white/84" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {(() => {
                const { score, total, percentage } = calculateScore();
                const { risk, recommendation } = getReadinessLevel(percentage);
                const sectorIdx = sectorIds.indexOf(selectedSector);
                const sectorTitle = sectorIdx >= 0 ? t.tool.sectors[sectorKeys[sectorIdx]].title : '';
                const nextSteps = getNextSteps(percentage);
                const tone = percentage >= 70 ? '#7BAE7F' : percentage >= 40 ? '#C7A75B' : '#C77767';

                return (
                  <>
                    <div className="tool-results-card rounded-[22px] border border-[#D6CCBB] bg-[#FBF7EF] p-4 shadow-[0_10px_24px_rgba(8,20,40,0.04)]">
                      <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                        <div
                          className="grid h-[100px] w-[100px] place-items-center rounded-full"
                          style={{ background: `conic-gradient(${tone} ${percentage * 3.6}deg, rgba(8,20,40,0.08) ${percentage * 3.6}deg 360deg)` }}
                        >
                          <div className="grid h-[74px] w-[74px] place-items-center rounded-full border border-[#D6CCBB] bg-white text-[22px] text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700 }}>
                            {percentage}%
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                            {sectorTitle}
                          </p>
                          <p className="mt-1.5 text-[26px]" style={{ color: tone, fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                            {risk}
                          </p>
                          <p className="mt-1.5 text-[13px] leading-[1.65] text-[#20314F]/76" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                            {recommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="tool-results-card mt-4 rounded-[22px] border border-[#D6CCBB] bg-[#FFFDF8] p-4 shadow-[0_10px_24px_rgba(8,20,40,0.04)]">
                      <h4 className="text-[22px] text-[#10162A]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                        {t.tool.results.scoreBreakdown}
                      </h4>
                      <div className="mt-3 space-y-2.5">
                        {readinessQuestions.map((question) => {
                          const answer = answers[question.id];
                          return (
                            <div key={question.id} className="flex items-center justify-between gap-3 text-[13px]">
                              <span className="min-w-0 flex-1 text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }} title={question.question}>
                                {question.question}
                              </span>
                              <span
                                className="rounded-full px-2.5 py-1 text-xs"
                                style={{
                                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                                  fontWeight: 700,
                                  backgroundColor: answer?.score === 2 ? '#E7F2E8' : answer?.score === 1 ? '#F4ECD8' : '#F3E0DA',
                                  color: answer?.score === 2 ? '#335D3B' : answer?.score === 1 ? '#7D6230' : '#8A413A'
                                }}
                              >
                                {answer?.score || 0}/2
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-[#E6DDCD] pt-3 text-[13px] text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                        <span>{t.tool.results.total}</span>
                        <span>{score}/{total}</span>
                      </div>
                    </div>

                    <div className="tool-results-card mt-4 rounded-[22px] border border-[#D6CCBB] bg-[#FFFDF8] p-4 shadow-[0_10px_24px_rgba(8,20,40,0.04)]">
                      <h4 className="text-[22px] text-[#10162A]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                        {t.tool.results.recommendedSteps}
                      </h4>
                      <p className="mt-2.5 text-[13px] leading-[1.65] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                        {language === 'fr'
                          ? 'Ces suites recommandent un point de depart. Elles ne transforment pas automatiquement un etat partiel en gouvernance complete.'
                          : 'These next steps recommend a starting point. They do not automatically turn a partial state into complete governance.'}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {nextSteps.map((stepItem, index) => (
                          <li key={index} className="flex items-start gap-2 text-[13px] leading-[1.62] text-[#20314F]/74" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#13254C]" />
                            <span>{stepItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link to="/connect" className="brand-button-primary" data-testid="book-debrief-btn">
                        {copy.discuss}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to={preMortemHref} className="brand-button-secondary">
                        {copy.services}
                      </Link>
                      <button
                        onClick={handleReset}
                        className="ml-auto text-[13px] text-[#20314F] transition-colors hover:text-[#13254C]"
                        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
                      >
                        {t.tool.results.retake}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tool;
