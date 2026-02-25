import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const SECTORS = [
  {
    id: 'regulated',
    title: 'Regulated systems',
    description: 'Higher evidence burden, tighter approvals, audit-grade remediation.'
  },
  {
    id: 'enterprise-saas',
    title: 'Enterprise SaaS',
    description: 'Governance that ships: release cadence, drift, and vendorized AI features.'
  },
  {
    id: 'procurement',
    title: 'Procurement & vendor risk',
    description: 'Questionnaires become controls: diligence artifacts, contract-backed proof.'
  },
  {
    id: 'public-sector',
    title: 'Public sector & due process',
    description: 'Contestability, appeal pathways, reconstruction under scrutiny.'
  },
  {
    id: 'financial',
    title: 'Financial & capital systems',
    description: 'Models move money: exposure controls, stress testing, adverse action logic.'
  },
  {
    id: 'governance-model',
    title: 'Governance operating model',
    description: 'Decision rights, lifecycle gates, evidence trails that scale.'
  }
];

const READINESS_QUESTIONS = [
  {
    id: 'inventory',
    question: 'Do you have a documented inventory of AI use cases and vendors?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Partial', score: 1 },
      { value: 'complete', label: 'Yes', score: 2 }
    ]
  },
  {
    id: 'risk-tiering',
    question: 'Is there a risk classification system for AI use cases?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'informal', label: 'Informal', score: 1 },
      { value: 'formal', label: 'Formal', score: 2 }
    ]
  },
  {
    id: 'decision-rights',
    question: 'Are decision rights and approvals clearly defined?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Partial', score: 1 },
      { value: 'complete', label: 'Yes', score: 2 }
    ]
  },
  {
    id: 'controls',
    question: 'Do you have controls mapped to risk tiers?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Some', score: 1 },
      { value: 'complete', label: 'Yes', score: 2 }
    ]
  },
  {
    id: 'evidence',
    question: 'Is evidence being collected for audit readiness?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Ad-hoc', score: 1 },
      { value: 'complete', label: 'Systematic', score: 2 }
    ]
  },
  {
    id: 'vendor-review',
    question: 'Do you have a vendor AI review process?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Basic', score: 1 },
      { value: 'complete', label: 'Structured', score: 2 }
    ]
  },
  {
    id: 'governance-cadence',
    question: 'Is there a recurring governance review cadence?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Occasional', score: 1 },
      { value: 'complete', label: 'Established', score: 2 }
    ]
  },
  {
    id: 'documentation',
    question: 'Is governance documentation current and accessible?',
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Outdated', score: 1 },
      { value: 'complete', label: 'Current', score: 2 }
    ]
  }
];

const Tool = () => {
  const [step, setStep] = useState(1);
  const [selectedSector, setSelectedSector] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSectorSelect = (sectorId) => {
    setSelectedSector(sectorId);
  };

  const handleAnswer = (questionId, value, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, score }
    }));
  };

  const handleNext = () => {
    if (step === 1 && selectedSector) {
      setStep(2);
      setCurrentQuestion(0);
    } else if (step === 2) {
      if (currentQuestion < READINESS_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setDrawerOpen(true);
      }
    }
  };

  const handleBack = () => {
    if (step === 2 && currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (step === 2 && currentQuestion === 0) {
      setStep(1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSector(null);
    setAnswers({});
    setCurrentQuestion(0);
    setDrawerOpen(false);
  };

  const calculateScore = () => {
    const totalPossible = READINESS_QUESTIONS.length * 2;
    const actualScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
    return {
      score: actualScore,
      total: totalPossible,
      percentage: Math.round((actualScore / totalPossible) * 100)
    };
  };

  const getReadinessLevel = (percentage) => {
    if (percentage >= 75) return { level: 'Strong', risk: 'Low Risk', recommendation: 'Your governance foundation is solid. Consider the Oversight Retainer to maintain momentum and optimize evidence collection.' };
    if (percentage >= 50) return { level: 'Developing', risk: 'Moderate Risk', recommendation: 'Good progress. The Controls and Evidence Pack can fill critical gaps and prepare you for audit.' };
    if (percentage >= 25) return { level: 'Early', risk: 'Elevated Risk', recommendation: 'Start with the Governance Foundation package to establish basics and define risk tiering.' };
    return { level: 'Beginning', risk: 'High Risk', recommendation: 'Begin with basic inventory. The Governance Foundation package provides a complete starting point.' };
  };

  const currentQ = READINESS_QUESTIONS[currentQuestion];
  const canProceed = step === 1 ? selectedSector : answers[currentQ?.id];
  const isLastQuestion = currentQuestion === READINESS_QUESTIONS.length - 1;

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6" data-testid="tool-page">
      {/* Hero */}
      <div className="max-w-[980px] mx-auto mb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1a2744] mb-2">
          AI Governance Readiness Snapshot
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Choose your sector of operation to assess your readiness to audits, regulators, and risk assessment.
        </p>
        <div className="flex gap-4 mt-4 text-xs tracking-wider uppercase">
          <span className={step >= 1 ? 'text-[#6366f1] font-semibold' : 'text-gray-400'}>SECTOR</span>
          <span className="text-gray-300">·</span>
          <span className={step >= 2 ? 'text-[#6366f1] font-semibold' : 'text-gray-400'}>READINESS</span>
          <span className="text-gray-300">·</span>
          <span className={drawerOpen ? 'text-[#6366f1] font-semibold' : 'text-gray-400'}>RESULTS</span>
        </div>
      </div>

      {/* Card Deck */}
      <div className="flex justify-center py-4">
        <div className="w-[min(460px,94vw)] relative">
          {/* Deck card with stacked effect */}
          <div className="relative bg-white/95 border border-gray-200/60 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] p-5 overflow-visible">
            {/* Stacked cards behind */}
            <div className="absolute inset-0 rounded-3xl border border-gray-200/50 bg-white/70 -z-10 translate-x-2.5 translate-y-3 shadow-[0_16px_44px_rgba(15,23,42,0.10)]" />
            <div className="absolute inset-0 rounded-3xl border border-gray-200/40 bg-white/55 -z-20 translate-x-5 translate-y-6 shadow-[0_16px_44px_rgba(15,23,42,0.08)]" />

            {/* Step 1: Sector Selection */}
            {step === 1 && (
              <div data-testid="step-1-sector">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-[#6366f1] text-white flex items-center justify-center font-bold text-sm">1</span>
                  <h2 className="font-serif text-xl font-semibold text-[#1a2744]">Choose your sector</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  This tailors language and the expected evidence burden.
                </p>

                <div className="space-y-2.5">
                  {SECTORS.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => handleSectorSelect(sector.id)}
                      data-testid={`sector-${sector.id}`}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 shadow-[0_10px_20px_rgba(15,23,42,0.06)] hover:translate-y-[-1px] hover:shadow-[0_14px_26px_rgba(15,23,42,0.08)] ${
                        selectedSector === sector.id
                          ? 'border-[#6366f1]/55 shadow-[0_16px_30px_rgba(99,102,241,0.15)] bg-[#6366f1]/5'
                          : 'border-gray-200/60 bg-white/90 hover:border-[#6366f1]/25'
                      }`}
                    >
                      <h3 className="font-bold text-[#0b1220]/90 mb-1 text-sm">
                        {sector.title}
                      </h3>
                      <p className="text-[#0b1220]/70 text-sm leading-snug">
                        {sector.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Readiness Questions */}
            {step === 2 && (
              <div data-testid="step-2-readiness">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-[#6366f1] text-white flex items-center justify-center font-bold text-sm">2</span>
                  <h2 className="font-serif text-xl font-semibold text-[#1a2744]">
                    Question {currentQuestion + 1} of {READINESS_QUESTIONS.length}
                  </h2>
                </div>
                
                <p className="text-[#0b1220]/90 font-medium mb-4" data-testid={`question-${currentQ.id}`}>
                  {currentQ.question}
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {currentQ.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQ.id, option.value, option.score)}
                      className={`rounded-full border py-2.5 px-3 font-bold text-sm transition-all duration-150 hover:translate-y-[-1px] hover:shadow-[0_12px_22px_rgba(15,23,42,0.08)] ${
                        answers[currentQ.id]?.value === option.value
                          ? 'border-[#6366f1]/55 shadow-[0_14px_26px_rgba(99,102,241,0.15)] bg-[#6366f1] text-white'
                          : 'border-gray-200/60 bg-white/90 hover:border-[#6366f1]/25'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {READINESS_QUESTIONS.map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentQuestion ? 'bg-[#6366f1]' : 
                        answers[READINESS_QUESTIONS[i].id] ? 'bg-[#6366f1]/40' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-100">
              {(step > 1 || (step === 2 && currentQuestion > 0)) && (
                <button onClick={handleBack} className="text-gray-600 hover:text-[#6366f1] font-medium text-sm" data-testid="back-btn">
                  Back
                </button>
              )}
              <button onClick={handleReset} className="text-gray-500 hover:text-gray-700 text-sm" data-testid="reset-btn">
                Reset
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`ml-auto px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  canProceed
                    ? 'bg-[#6366f1] text-white hover:bg-[#5558e3]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="next-btn"
              >
                {isLastQuestion && step === 2 ? 'See Results' : 'Next'}
              </button>
            </div>

            {/* Hint */}
            {step === 1 && !selectedSector && (
              <p className="text-[#6366f1]/80 font-semibold text-sm mt-2.5">
                Select a sector to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results Drawer */}
      {drawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#0b1220]/35 z-[4000]" 
            onClick={() => setDrawerOpen(false)}
            data-testid="drawer-backdrop"
          />
          <div className="fixed top-0 right-0 h-screen w-[min(440px,92vw)] bg-white/95 border-l border-gray-200/60 shadow-[-18px_0_60px_rgba(15,23,42,0.18)] z-[4500] flex flex-col" data-testid="results-drawer">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#6366f1]">Results</p>
                <h3 className="font-serif text-xl font-semibold text-[#0b1220]/95 mt-1">
                  Readiness Snapshot
                </h3>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)} 
                className="p-1 hover:bg-gray-100 rounded-full"
                data-testid="close-drawer-btn"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 overflow-auto flex-1">
              {(() => {
                const { score, total, percentage } = calculateScore();
                const { level, risk, recommendation } = getReadinessLevel(percentage);
                const sectorInfo = SECTORS.find(s => s.id === selectedSector);

                return (
                  <>
                    {/* Score Ring */}
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center p-3 border border-gray-200/60 rounded-2xl bg-[#f6f7fb]/70">
                      <div 
                        className="w-[110px] h-[110px] rounded-full grid place-items-center shadow-[0_14px_26px_rgba(99,102,241,0.15)]"
                        style={{
                          background: `conic-gradient(#6366f1 ${percentage * 3.6}deg, rgba(15,23,42,0.08) ${percentage * 3.6}deg 360deg)`
                        }}
                      >
                        <div className="w-[82px] h-[82px] rounded-full bg-white/95 border border-gray-200/60 grid place-items-center font-extrabold text-2xl text-[#0b1220]/90">
                          {percentage}%
                        </div>
                      </div>
                      <div>
                        <p className="text-xs tracking-wider uppercase text-gray-500 font-bold mb-1">
                          {sectorInfo?.title}
                        </p>
                        <p className="font-serif font-bold text-xl text-[#6366f1] mb-1">
                          {risk}
                        </p>
                        <p className="text-[#0b1220]/75 text-sm leading-snug">
                          {recommendation}
                        </p>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="mt-3 p-3 border border-gray-200/60 rounded-2xl bg-white/90">
                      <h4 className="font-bold text-[#0b1220]/90 mb-2">Score Breakdown</h4>
                      <div className="space-y-2">
                        {READINESS_QUESTIONS.map((q) => {
                          const answer = answers[q.id];
                          return (
                            <div key={q.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 truncate mr-2" title={q.question}>
                                {q.question.slice(0, 35)}...
                              </span>
                              <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                                answer?.score === 2 ? 'bg-green-100 text-green-700' :
                                answer?.score === 1 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {answer?.score || 0}/2
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 font-bold">
                        <span>Total</span>
                        <span className="text-[#6366f1]">{score}/{total}</span>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-3 p-3 border border-gray-200/60 rounded-2xl bg-white/90">
                      <h4 className="font-bold text-[#0b1220]/90 mb-2">Recommended Next Steps</h4>
                      <ul className="text-[#0b1220]/75 text-sm space-y-1.5 pl-4 list-disc">
                        {percentage < 50 && (
                          <>
                            <li>Start with the Governance Foundation package</li>
                            <li>Create a use case inventory</li>
                            <li>Define risk tiering criteria</li>
                          </>
                        )}
                        {percentage >= 50 && percentage < 75 && (
                          <>
                            <li>Consider the Controls and Evidence Pack</li>
                            <li>Document decision rights and approvals</li>
                            <li>Establish recurring governance cadence</li>
                          </>
                        )}
                        {percentage >= 75 && (
                          <>
                            <li>Explore the Oversight Retainer</li>
                            <li>Optimize evidence collection</li>
                            <li>Prepare for advanced audit scenarios</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link to="/connect" className="btn-primary text-sm" data-testid="book-debrief-btn">
                        Book a 30 min debrief
                      </Link>
                      <Link to="/services" className="btn-ghost text-sm">
                        View services
                      </Link>
                      <button onClick={handleReset} className="text-gray-500 hover:text-[#6366f1] text-sm ml-auto">
                        Retake
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
