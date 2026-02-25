import { Link } from 'react-router-dom';
import { FileText, ExternalLink, BookOpen, Sparkles, Eye, Layers } from 'lucide-react';

const SealedCard = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="sealed-card-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-3">
            RESEARCH PROTOCOL
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">
            The Sealed Card Protocol
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Mediated Legitimacy, Charging, and Governance at the Seam
          </p>
          <p className="text-xs tracking-widest text-gray-400 uppercase">
            AI GOVERNANCE · LEGITIMACY · ACCOUNTABILITY · TRACEABILITY
          </p>
        </div>

        {/* PDF Link Card */}
        <a 
          href="https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/3mzbuwbb_Sealed_Card_Protocol_FINAL.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-8 p-6 bg-gradient-to-r from-[#1a2744] to-[#6366f1] rounded-2xl text-white hover:shadow-xl transition-all group"
          data-testid="pdf-download"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-lg">Full Protocol Document (PDF)</p>
                <p className="text-white/70 text-sm">Read the complete research methodology and findings</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* Introduction */}
        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#6366f1]" />
            Introduction
          </h2>
          <p className="text-gray-600 mb-4">
            The Sealed Card Protocol is a framework for analyzing how legitimacy is established and maintained, particularly in the context of generative AI and other forms of mediation. It posits that the <span className="font-semibold text-[#1a2744]">"glitch"</span>—the moment a reader or viewer senses mediation—is a crucial threshold event that can either lead to legitimacy or suspicion.
          </p>
          <p className="text-gray-600 mb-4">
            The core problem identified is not technical capability but rather institutional and cultural struggles around <span className="font-semibold text-[#1a2744]">accountability</span> and the conversion of recognition into credit. When mediation becomes detectable, evaluation shifts from the artifact itself to its production pathway.
          </p>
          <p className="text-gray-600">
            The protocol rejects a "purity model of authenticity," defining authenticity instead as a <span className="italic">"socially stabilized reading of mediation as coherent and accountable."</span> Legitimacy is the institutional version of this stabilization.
          </p>
        </div>

        {/* Key Concepts */}
        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#6366f1]" />
            Key Concepts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { term: 'Glitch', definition: 'A perceptual threshold, not an error, marking the moment a reader senses mediation and reorients evaluation.' },
              { term: 'Seam', definition: 'The interface where evaluative attention flips from artifact to pathway.' },
              { term: 'Charging', definition: 'The social allocation of credibility that allows meaning to adhere under circulation, observed through "anchors."' },
              { term: 'Anchors', definition: 'Cues that permit inference about duration, intention, and responsibility (material traces, revision chains, community endorsement).' },
              { term: 'Legibility', definition: 'The degree to which an artifact fits the reading habits of a particular regime; a normative fit.' },
              { term: 'Pathway Policing', definition: 'Institutions focusing on the authorization and procedure of creation rather than solely on the artifact itself.' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border-l-3 border-[#6366f1]">
                <p className="font-semibold text-[#1a2744] mb-1">{item.term}</p>
                <p className="text-gray-600 text-sm">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Three Arms */}
        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6 flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#6366f1]" />
            Methodology: Three Arms
          </h2>
          <p className="text-gray-600 mb-6">
            The protocol uses a triangulated, practice-based design to make legitimacy conversion observable across different domains:
          </p>
          
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-r from-[#6366f1]/5 to-transparent rounded-xl border border-[#6366f1]/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-[#6366f1] text-white flex items-center justify-center font-bold">1</span>
                <h3 className="font-serif text-lg font-semibold text-[#1a2744]">Artistic Arm</h3>
              </div>
              <p className="text-gray-600 text-sm ml-11">
                Visual analysis and comparative reading of aesthetic cues, particularly in photographic sequences. Examines how "charging" is performed through anchors rather than direct claims. Uses controlled variations to observe how legibility engineering and platform optimization influence pathway inference.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-[#8b5cf6]/5 to-transparent rounded-xl border border-[#8b5cf6]/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold">2</span>
                <h3 className="font-serif text-lg font-semibold text-[#1a2744]">Academic Arm</h3>
              </div>
              <p className="text-gray-600 text-sm ml-11">
                Procedural autoethnography constrained by traceability. Examines the production process of academic work itself as a "chain-of-production object." Understands how visibility of mediation affects trust and how traceability can be used for accountability.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-[#a78bfa]/5 to-transparent rounded-xl border border-[#a78bfa]/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-[#a78bfa] text-white flex items-center justify-center font-bold">3</span>
                <h3 className="font-serif text-lg font-semibold text-[#1a2744]">Ritual Arm</h3>
              </div>
              <p className="text-gray-600 text-sm ml-11">
                Evidentiary critique comparing proof regimes and understanding how credibility is translated across domains. Uses artifacts to highlight how mismatched proof demands can lead to suspicion. Explores symbolic charge, healing, and ritual practices.
              </p>
            </div>
          </div>
        </div>

        {/* AI Governance Principles */}
        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#6366f1]" />
            AI Governance Principles Derived
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#f8f9fc] rounded-xl">
              <p className="font-semibold text-[#1a2744] mb-2">1. Legitimacy is pathway authorization under consequence pressure</p>
              <p className="text-gray-600 text-sm">Generative AI intensifies this by making mediation more inferable and seams easier to detect. Governance must anticipate the glitch.</p>
            </div>
            <div className="p-4 bg-[#f8f9fc] rounded-xl">
              <p className="font-semibold text-[#1a2744] mb-2">2. Traceability as accountability instrument</p>
              <p className="text-gray-600 text-sm">In AI governance, traceability creates the reconstruction layer that regulators, auditors, and stakeholders demand. Evidence integrity anticipates scrutiny.</p>
            </div>
            <div className="p-4 bg-[#f8f9fc] rounded-xl">
              <p className="font-semibold text-[#1a2744] mb-2">3. Beyond purity policing to control design</p>
              <p className="text-gray-600 text-sm">Focus on responsible practices, clear standards for documentation, and incentive structures that reward accountable procedure rather than punish visible mediation.</p>
            </div>
            <div className="p-4 bg-[#f8f9fc] rounded-xl">
              <p className="font-semibold text-[#1a2744] mb-2">4. Proof regime alignment</p>
              <p className="text-gray-600 text-sm">Proof regime mismatch is a significant driver of suspicion. AI systems must be governed with evidence expectations that match the deployment context.</p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="card mb-8 border-l-4 border-[#6366f1]">
          <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4">Conclusion</h2>
          <p className="text-gray-600 mb-4">
            Legitimacy is an outcome of pathway authorization under consequence pressure. The Sealed Card Protocol argues for a shift from "purity tests" and moralized pathway policing to developing accountability regimes that:
          </p>
          <ul className="text-gray-600 space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-[#6366f1] mt-1">•</span>
              Evaluate procedure, not just artifacts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6366f1] mt-1">•</span>
              Distribute responsibility proportionally
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6366f1] mt-1">•</span>
              Separate epistemic risk management from nostalgia for solitary origin
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4">
          <Link to="/research" className="btn-primary">
            Back to Research
          </Link>
          <Link to="/about" className="btn-ghost">
            About the Author
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SealedCard;
