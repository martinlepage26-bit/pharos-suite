import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Tool = () => {
  const { t } = useLanguage();
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

  const READINESS_QUESTIONS = questionKeys.map((key, i) => ({
    id: key,
    question: t.tool.questions[key],
    options: questionOptions[i]
  }));

  const handleSectorSelect = (sectorId) => setSelectedSector(sectorId);
  const handleAnswer = (questionId, value, score) => setAnswers(prev => ({ ...prev, [questionId]: { value, score } }));

  const handleNext = () => {
    if (step === 1 && selectedSector) { setStep(2); setCurrentQuestion(0); }
    else if (step === 2) {
      if (currentQuestion < READINESS_QUESTIONS.length - 1) setCurrentQuestion(prev => prev + 1);
      else setDrawerOpen(true);
    }
  };

  const handleBack = () => {
    if (step === 2 && currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
    else if (step === 2 && currentQuestion === 0) setStep(1);
  };

  const handleReset = () => { setStep(1); setSelectedSector(null); setAnswers({}); setCurrentQuestion(0); setDrawerOpen(false); };

  const calculateScore = () => {
    const totalPossible = READINESS_QUESTIONS.length * 2;
    const actualScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
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

  const currentQ = READINESS_QUESTIONS[currentQuestion];
  const canProceed = step === 1 ? selectedSector : answers[currentQ?.id];
  const isLastQuestion = currentQuestion === READINESS_QUESTIONS.length - 1;

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-8 px-6" data-testid="tool-page">
      <div className="max-w-[980px] mx-auto mb-4">
        <h1 className="page-title text-2xl md:text-3xl mb-1">{t.tool.title}</h1>
        <p className="text-gray-600 text-sm max-w-2xl">{t.tool.description}</p>
        <div className="flex gap-3 mt-3 text-xs tracking-wider uppercase">
          <span className={step >= 1 ? 'text-[#0D0A2E] font-semibold' : 'text-gray-400'}>{t.tool.steps.sector}</span>
          <span className="text-gray-300">·</span>
          <span className={step >= 2 ? 'text-[#0D0A2E] font-semibold' : 'text-gray-400'}>{t.tool.steps.readiness}</span>
          <span className="text-gray-300">·</span>
          <span className={drawerOpen ? 'text-[#0D0A2E] font-semibold' : 'text-gray-400'}>{t.tool.steps.results}</span>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <div className="w-[min(420px,94vw)] relative">
          <div className="relative bg-white/95 border border-gray-200/60 rounded-2xl shadow-[0_4px_20px_rgba(11,15,26,0.06)] p-4 overflow-visible">
            <div className="absolute inset-0 rounded-2xl border border-gray-200/50 bg-white/70 -z-10 translate-x-2 translate-y-2.5 shadow-[0_3px_12px_rgba(11,15,26,0.04)]" />
            <div className="absolute inset-0 rounded-2xl border border-gray-200/40 bg-white/55 -z-20 translate-x-4 translate-y-5 shadow-[0_2px_8px_rgba(11,15,26,0.03)]" />

            {step === 1 && (
              <div data-testid="step-1-sector">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#0D0A2E] text-white flex items-center justify-center font-bold text-xs">1</span>
                  <h2 className="font-serif text-lg font-semibold text-[#0B0F1A]">{t.tool.step1.title}</h2>
                </div>
                <p className="text-gray-600 text-xs mb-3">{t.tool.step1.description}</p>
                <div className="space-y-1.5">
                  {sectorKeys.map((key, i) => (
                    <button key={key} onClick={() => handleSectorSelect(sectorIds[i])} data-testid={`sector-${sectorIds[i]}`}
                      className={`w-full text-left px-3 py-2 rounded-xl border transition-all duration-150 shadow-[0_1px_4px_rgba(11,15,26,0.04)] hover:translate-y-[-1px] hover:shadow-[0_2px_6px_rgba(11,15,26,0.06)] ${
                        selectedSector === sectorIds[i] ? 'border-[#0D0A2E]/55 shadow-[0_2px_8px_rgba(75,42,191,0.12)] bg-[#0D0A2E]/5' : 'border-gray-200/60 bg-white/90 hover:border-[#0D0A2E]/25'
                      }`}
                    >
                      <h3 className="font-bold text-[#0B0F1A]/90 text-xs">{t.tool.sectors[key].title}</h3>
                      <p className="text-[#0B0F1A]/70 text-xs leading-snug">{t.tool.sectors[key].description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div data-testid="step-2-readiness">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#0D0A2E] text-white flex items-center justify-center font-bold text-xs">2</span>
                  <h2 className="font-serif text-lg font-semibold text-[#0B0F1A]">
                    {t.tool.step2.title} {currentQuestion + 1} {t.tool.step2.of} {READINESS_QUESTIONS.length}
                  </h2>
                </div>
                <p className="text-[#0B0F1A]/90 font-medium text-sm mb-3" data-testid={`question-${currentQ.id}`}>{currentQ.question}</p>
                <div className="grid grid-cols-3 gap-2">
                  {currentQ.options.map((option) => (
                    <button key={option.value} onClick={() => handleAnswer(currentQ.id, option.value, option.score)}
                      className={`rounded-full border py-2 px-2 font-bold text-xs transition-all duration-150 hover:translate-y-[-1px] hover:shadow-[0_2px_6px_rgba(11,15,26,0.05)] ${
                        answers[currentQ.id]?.value === option.value ? 'border-[#0D0A2E]/55 shadow-[0_2px_8px_rgba(75,42,191,0.10)] bg-[#0D0A2E] text-white' : 'border-gray-200/60 bg-white/90 hover:border-[#0D0A2E]/25'
                      }`}
                    >{option.label}</button>
                  ))}
                </div>
                <div className="flex justify-center gap-1 mt-3">
                  {READINESS_QUESTIONS.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentQuestion ? 'bg-[#0D0A2E]' : answers[READINESS_QUESTIONS[i].id] ? 'bg-[#0D0A2E]/40' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              {(step > 1 || (step === 2 && currentQuestion > 0)) && (
                <button onClick={handleBack} className="text-gray-600 hover:text-[#0D0A2E] font-medium text-xs" data-testid="back-btn">{t.tool.buttons.back}</button>
              )}
              <button onClick={handleReset} className="text-gray-500 hover:text-gray-700 text-xs" data-testid="reset-btn">{t.tool.buttons.reset}</button>
              <button onClick={handleNext} disabled={!canProceed} data-testid="next-btn"
                className={`ml-auto px-4 py-1.5 rounded-full font-semibold text-xs transition-all ${canProceed ? 'bg-[#0D0A2E] text-white hover:bg-[#3A1FA0]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {isLastQuestion && step === 2 ? t.tool.buttons.seeResults : t.tool.buttons.next}
              </button>
            </div>

            {step === 1 && !selectedSector && (
              <p className="text-[#0D0A2E]/80 font-semibold text-xs mt-2">{t.tool.buttons.selectSector}</p>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-[#0B0F1A]/35 z-[4000]" onClick={() => setDrawerOpen(false)} data-testid="drawer-backdrop" />
          <div className="fixed top-0 right-0 h-screen w-[min(440px,92vw)] bg-white/95 border-l border-gray-200/60 shadow-[0_4px_24px_rgba(11,15,26,0.10)] z-[4500] flex flex-col" data-testid="results-drawer">
            <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#0D0A2E]">{t.tool.steps.results}</p>
                <h3 className="font-serif text-xl font-semibold text-[#0B0F1A]/95 mt-1">{t.tool.results.title}</h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 hover:bg-gray-100 rounded-full" data-testid="close-drawer-btn">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              {(() => {
                const { score, total, percentage } = calculateScore();
                const { risk, recommendation } = getReadinessLevel(percentage);
                const sectorIdx = sectorIds.indexOf(selectedSector);
                const sectorTitle = sectorIdx >= 0 ? t.tool.sectors[sectorKeys[sectorIdx]].title : '';
                const nextSteps = getNextSteps(percentage);
                return (
                  <>
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center p-3 border border-gray-200/60 rounded-2xl bg-[#f6f7fb]/70">
                      <div className="w-[110px] h-[110px] rounded-full grid place-items-center shadow-[0_3px_10px_rgba(75,42,191,0.10)]"
                        style={{ background: `conic-gradient(#0D0A2E ${percentage * 3.6}deg, rgba(11,15,26,0.06) ${percentage * 3.6}deg 360deg)` }}>
                        <div className="w-[82px] h-[82px] rounded-full bg-white/95 border border-gray-200/60 grid place-items-center font-extrabold text-2xl text-[#0B0F1A]/90">{percentage}%</div>
                      </div>
                      <div>
                        <p className="text-xs tracking-wider uppercase text-gray-500 font-bold mb-1">{sectorTitle}</p>
                        <p className="font-serif font-bold text-xl text-[#0D0A2E] mb-1">{risk}</p>
                        <p className="text-[#0B0F1A]/75 text-sm leading-snug">{recommendation}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 border border-gray-200/60 rounded-2xl bg-white/90">
                      <h4 className="font-bold text-[#0B0F1A]/90 mb-2">{t.tool.results.scoreBreakdown}</h4>
                      <div className="space-y-2">
                        {READINESS_QUESTIONS.map((q) => {
                          const answer = answers[q.id];
                          return (
                            <div key={q.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 truncate mr-2" title={q.question}>{q.question.slice(0, 35)}...</span>
                              <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${answer?.score === 2 ? 'bg-green-100 text-green-700' : answer?.score === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {answer?.score || 0}/2
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 font-bold">
                        <span>{t.tool.results.total}</span>
                        <span className="text-[#0D0A2E]">{score}/{total}</span>
                      </div>
                    </div>
                    <div className="mt-3 p-3 border border-gray-200/60 rounded-2xl bg-white/90">
                      <h4 className="font-bold text-[#0B0F1A]/90 mb-2">{t.tool.results.recommendedSteps}</h4>
                      <ul className="text-[#0B0F1A]/75 text-sm space-y-1.5 pl-4 list-disc">
                        {nextSteps.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link to="/connect" className="btn-primary text-sm" data-testid="book-debrief-btn">{t.tool.results.bookDebrief}</Link>
                      <Link to="/services" className="btn-ghost text-sm">{t.tool.results.viewServices}</Link>
                      <button onClick={handleReset} className="text-gray-500 hover:text-[#0D0A2E] text-sm ml-auto">{t.tool.results.retake}</button>
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
