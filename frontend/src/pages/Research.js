import { useState } from 'react';
import { researchPapers, contexts } from '../data/researchPapers';
import { X, FileText, Calendar, ArrowRight } from 'lucide-react';

const Research = () => {
  const [selectedContext, setSelectedContext] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState(null);

  const filteredPapers = selectedContext === 'all' 
    ? researchPapers 
    : researchPapers.filter(p => p.context === selectedContext);

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="research-page">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">
          Research
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          This research translates AI governance pressure into operational clarity: controls, lifecycle gates, procurement artifacts, and audit-ready evidence. Each briefing focuses on the practical decisions institutions must make when deploying, buying, or overseeing AI systems.
        </p>

        {/* How this research works */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4">
            How this research works
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm mb-6">
            <span className="text-[#6366f1] font-medium">Signal</span>
            <span className="text-gray-400">→</span>
            <span className="text-[#6366f1] font-medium">Pressure</span>
            <span className="text-gray-400">→</span>
            <span className="text-[#6366f1] font-medium">Control</span>
            <span className="text-gray-400">→</span>
            <span className="text-[#6366f1] font-medium">Artifact</span>
            <span className="text-gray-400">→</span>
            <span className="text-[#6366f1] font-medium">Evidence</span>
          </div>
          <p className="text-gray-600 mb-4">
            Governance pressure rarely appears as theory. It appears as audit requests, procurement questionnaires, regulatory expectations, and board oversight.
          </p>
          <p className="text-gray-600 mb-8">
            Each briefing identifies the operational pressure, clarifies the control required, and specifies the documentation necessary to make that control inspectable. The result is governance you can show, not just describe.
          </p>
        </div>

        {/* Featured framework */}
        <div className="mb-12 p-6 bg-gradient-to-r from-[#1a2744] to-[#6366f1] rounded-2xl text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="font-serif text-2xl font-semibold">
              Featured framework
            </h2>
            <p className="text-white/80 text-sm">
              From policy to deployable controls: the AI Governance Engine
            </p>
          </div>
          <p className="text-white/90 mb-4">
            A structured operating model that translates governance commitments into measurable controls, lifecycle gates, decision rights, and verification evidence. This framework informs the analytical approach used throughout this research.
          </p>
          <p className="text-white/70 text-sm italic">
            <span className="font-medium">Professional note:</span> The Engine itself is a proprietary consulting instrument and is not publicly deployed. Research publications reference its conceptual structure without exposing internal scoring models, implementation logic, or client-specific configurations.
          </p>
        </div>

        {/* Operational contexts */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-[#1a2744]">
              Operational contexts
            </h2>
            <p className="text-gray-500 text-sm">
              Filter briefings by context
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedContext('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedContext === 'all'
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6366f1] hover:text-[#6366f1]'
              }`}
            >
              All
            </button>
            {contexts.map((context) => (
              <button
                key={context.id}
                onClick={() => setSelectedContext(context.id)}
                data-testid={`context-${context.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedContext === context.id
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6366f1] hover:text-[#6366f1]'
                }`}
              >
                {context.title}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Stack */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#1a2744] mb-4">
            Briefings ({filteredPapers.length})
          </h3>
          
          {filteredPapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="w-full text-left card paper-card hover:shadow-md transition-all group"
              data-testid={`paper-${paper.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#6366f1]" />
                    <span className="text-xs font-medium text-[#6366f1] uppercase tracking-wide">
                      {paper.type}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(paper.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-[#1a2744] mb-2 group-hover:text-[#6366f1] transition-colors">
                    {paper.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {paper.abstract}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#6366f1] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Paper Reader Drawer */}
      {selectedPaper && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-[4000]" 
            onClick={() => setSelectedPaper(null)}
          />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-white border-l border-gray-200 shadow-2xl z-[4500] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-[#6366f1] uppercase tracking-wide">
                    {selectedPaper.type}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedPaper.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#1a2744]">
                  {selectedPaper.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedPaper(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-700 font-medium mb-6 pb-6 border-b border-gray-100">
                  {selectedPaper.abstract}
                </p>
                {selectedPaper.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Context: {contexts.find(c => c.id === selectedPaper.context)?.title || 'General'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Research;
