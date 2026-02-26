import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, Presentation, BookOpen, Award, Shield, Scale, Cpu } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Portfolio = () => {
  const [publications, setPublications] = useState([]);
  const [workingPapers, setWorkingPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/publications`)
      .then(res => res.json())
      .then(data => {
        setPublications(data.filter(p => p.status === 'published'));
        setWorkingPapers(data.filter(p => p.status === 'in_development'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const engagements = [
    { type: 'Governance Foundation', icon: Shield, clients: 'Enterprise organizations', scope: 'AI Governance Framework Design', description: 'Establishing minimum viable governance: use case inventory, risk tiering, decision rights, approval flows, and operating cadence.', outcomes: ['Use case maps', 'Risk tier criteria', 'RACI matrices', 'Governance cadence'] },
    { type: 'Controls & Evidence', icon: FileText, clients: 'Financial services, healthcare', scope: 'Audit & Procurement Readiness', description: 'Building control registers, evidence expectations, and documentation structures that satisfy internal audit, regulators, and procurement.', outcomes: ['Control registers', 'Evidence checklists', 'Vendor questionnaires', 'Decision logs'] },
    { type: 'Vendor Assessment', icon: Scale, clients: 'Public sector, enterprise', scope: 'Third-Party AI Due Diligence', description: 'Developing evaluation frameworks, questionnaires, and contractual requirements for AI procurement and vendor management.', outcomes: ['Evaluation criteria', 'Diligence protocols', 'Contract language', 'Reassessment triggers'] },
    { type: 'Oversight Retainer', icon: Cpu, clients: 'Organizations with active AI delivery', scope: 'Ongoing Governance Support', description: 'Recurring advisory to keep governance current as models, vendors, data flows, and use cases evolve.', outcomes: ['Monthly oversight', 'Decision log stewardship', 'Control updates', 'Audit support'] }
  ];

  const expertise = [
    { category: 'Governance', skills: ['AI Risk Classification', 'Decision Rights Design', 'Governance Operating Models', 'Lifecycle Gates'] },
    { category: 'Evidence', skills: ['Audit Documentation', 'Evidence Architecture', 'Traceability Systems', 'Reconstruction Capability'] },
    { category: 'Controls', skills: ['Control Register Design', 'Testing Expectations', 'Monitoring Frameworks', 'Threshold Management'] },
    { category: 'Procurement', skills: ['Vendor Due Diligence', 'Questionnaire Design', 'Contract Requirements', 'Reassessment Protocols'] }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="portfolio-page">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link to="/about" className="text-[#2A206B] text-sm font-medium hover:underline mb-4 inline-block">&larr; Back to About</Link>
          <h1 className="font-serif text-lg md:text-lg font-semibold text-[#0B0F1A] mb-4">Portfolio</h1>
          <p className="text-gray-600 max-w-2xl">Publications, frameworks, and engagement areas in AI governance. This work focuses on making governance operational: controls people can execute, evidence auditors can verify, and documentation that survives scrutiny.</p>
          <p className="text-xs tracking-widest text-gray-400 uppercase mt-4">PUBLICATIONS · FRAMEWORKS · ENGAGEMENTS</p>
        </div>

        <section className="mb-12">
          <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2A206B]" /> Publications & Frameworks
          </h2>
          {loading ? (
            <div className="text-gray-500 text-sm">Loading...</div>
          ) : (
            <div className="space-y-4">
              {publications.map((pub, i) => (
                pub.internal ? (
                  <Link key={pub.id} to={pub.link} className="block card paper-card hover:shadow-md transition-all group" data-testid={`publication-${i}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">{pub.type}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">{pub.year}</span>
                          {pub.venue && <><span className="text-gray-300">·</span><span className="text-xs text-gray-500">{pub.venue}</span></>}
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#2A206B] transition-colors">{pub.title}</h3>
                        <p className="text-gray-600 text-sm">{pub.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#2A206B] flex-shrink-0" />
                    </div>
                  </Link>
                ) : (
                  <a key={pub.id} href={pub.link} target="_blank" rel="noopener noreferrer" className="block card paper-card hover:shadow-md transition-all group" data-testid={`publication-${i}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">{pub.type}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">{pub.year}</span>
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#2A206B] transition-colors">{pub.title}</h3>
                        {pub.venue && <p className="text-gray-500 text-sm mb-1">{pub.venue}</p>}
                        <p className="text-gray-600 text-sm">{pub.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#2A206B] flex-shrink-0" />
                    </div>
                  </a>
                )
              ))}
            </div>
          )}
        </section>

        {workingPapers.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#2A206B]" /> Working Papers
            </h2>
            <div className="space-y-4">
              {workingPapers.map((paper, i) => (
                <div key={paper.id} className="card bg-[#F6F7FB]" data-testid={`working-paper-${i}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">In development</span>
                  </div>
                  <h3 className="font-semibold text-[#0B0F1A] mb-2">{paper.title}</h3>
                  <p className="text-gray-600 text-sm">{paper.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <Presentation className="w-6 h-6 text-[#2A206B]" /> Engagement Areas
          </h2>
          <div className="space-y-4">
            {engagements.map((eng, i) => (
              <div key={i} className="card" data-testid={`engagement-${i}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2A206B]/10 flex items-center justify-center flex-shrink-0"><eng.icon className="w-6 h-6 text-[#2A206B]" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">{eng.type}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{eng.clients}</span>
                    </div>
                    <h3 className="font-semibold text-[#0B0F1A] mb-1">{eng.scope}</h3>
                    <p className="text-gray-600 text-sm mb-3">{eng.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {eng.outcomes.map((outcome, j) => (
                        <span key={j} className="text-xs px-2 py-1 bg-[#F6F7FB] rounded-full text-gray-600">{outcome}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {expertise.map((area, i) => (
              <div key={i} className="card">
                <h3 className="font-medium text-[#2A206B] text-sm uppercase tracking-wide mb-3">{area.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {area.skills.map((skill, j) => (
                    <span key={j} className="px-3 py-1.5 bg-[#F6F7FB] border border-gray-200 rounded-full text-sm text-gray-700">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="card bg-[linear-gradient(135deg,#2A206B_0%,#2A206B_40%,#4A3D8F_70%,#7B6DB5_100%)] text-white shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
          <h3 className="font-serif text-lg font-semibold mb-2">Discuss your governance needs</h3>
          <p className="text-white/80 mb-4">Whether you're establishing governance foundations, preparing for audit, or managing vendor AI risk.</p>
          <Link to="/connect" className="inline-block bg-white text-[#0B0F1A] px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">Book a Debrief</Link>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
