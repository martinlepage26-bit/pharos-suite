import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, RefreshCw, ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatAdminTextForDisplay } from '../lib/textFormat';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ServiceMenu = () => {
  const { language } = useLanguage();
  const [remotePackages, setRemotePackages] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services/active`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRemotePackages(data);
      })
      .catch(() => {});
  }, []);

  const fallbackPackages = [
    {
      id: 'foundation',
      icon: Shield,
      title: 'Governance Foundation',
      bestFor: 'Organizations establishing governance for the first time or consolidating governance across teams.',
      deliverables: [
        'AI use case and vendor inventory starter',
        'Risk tiering criteria with examples',
        'Decision rights and approval flow',
        'Governance cadence: meeting model, owners, and upkeep tasks'
      ],
      produces: [
        'A working governance model teams can use immediately',
        'Role clarity for procurement and audit conversations',
        'A defensible baseline for review and escalation'
      ]
    },
    {
      id: 'controls',
      icon: FileText,
      title: 'Controls and Evidence Pack',
      bestFor: 'Organizations preparing for procurement scrutiny, customer questionnaires, internal audit review, or regulator engagement.',
      deliverables: [
        'Control register mapped to your risk tiers',
        'Evaluation expectations: testing, monitoring, and thresholds',
        'Vendor review questions and evidence checklist',
        'Decision log template and documentation packet outline'
      ],
      produces: [
        'Procurement ready documentation structure',
        'Audit ready evidence expectations',
        'Clear control ownership and upkeep responsibilities'
      ]
    },
    {
      id: 'oversight',
      icon: RefreshCw,
      title: 'Oversight Retainer',
      bestFor: 'Organizations with active AI delivery who want stable oversight, clear decisions, and current documentation.',
      deliverables: [
        'Recurring governance and risk review support',
        'Decision log stewardship and evidence upkeep cadence',
        'Control roadmap updates aligned to delivery realities',
        'Procurement and audit support for specific reviews'
      ],
      produces: [
        'Stable oversight without slowing delivery',
        'Clear documentation as systems change',
        'Executive ready summaries and next steps'
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
      packageNumber: pkg.package_number,
    }))
    : fallbackPackages;

  const drivers = [
    {
      title: 'Use case portfolio',
      description: 'How many systems, vendors, and data pathways are in scope, and how quickly they change.'
    },
    {
      title: 'Review expectations',
      description: 'Procurement questionnaires, audit protocols, and customer requirements that shape evidence structure.'
    },
    {
      title: 'Decision authority',
      description: 'The level of autonomy, sensitivity, and impact assigned to AI supported decisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="service-menu-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title mb-4">Service Offers</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">
          Packages designed for review readiness: clear scope, concrete outputs, and documentation that remains maintainable.
        </p>
        <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-12">
          PACKAGES · DELIVERABLES · ADD ONS
        </p>

        <div className="space-y-8 mb-12">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <div key={pkg.id} className="bg-white rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] border border-gray-100 overflow-hidden card-hover-lift" data-testid={`package-${pkg.id}`}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D0A2E]/15 to-[#2D2380]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#0D0A2E]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#7b2cbf] font-semibold uppercase tracking-wide mb-1">Package {pkg.packageNumber || index + 1}</p>
                      <h2 className="text-xl font-semibold text-[#0B0F1A]" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif"}}>{pkg.title}</h2>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 whitespace-pre-line">
                    <span className="font-semibold text-[#0B0F1A]">Best for</span> {formatAdminTextForDisplay(pkg.bestFor)}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-[#0B0F1A] mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#7b2cbf] rounded-full"></span>
                        Deliverables
                      </h3>
                      <ul className="space-y-2">
                        {pkg.deliverables.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-[#0D0A2E]/40 flex-shrink-0 mt-0.5" />
                            {formatAdminTextForDisplay(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B0F1A] mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#0D0A2E] rounded-full"></span>
                        What it produces
                      </h3>
                      <ul className="space-y-2">
                        {pkg.produces.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-[#0D0A2E]/40 flex-shrink-0 mt-0.5" />
                            {formatAdminTextForDisplay(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F6F7FB] px-6 py-4 flex items-center justify-between">
                  <Link to="/connect" className="text-sm text-[#0D0A2E] hover:underline font-medium">
                    Discuss this package →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0B0F1A] mb-4" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif"}}>Engagement drivers</h2>
          <p className="text-gray-600 mb-6">Engagement design adapts to your environment. These drivers shape scope and effort.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {drivers.map((driver, i) => (
              <div key={i} className="p-4 bg-[#F6F7FB] rounded-lg">
                <h3 className="font-semibold text-[#0B0F1A] mb-2">{driver.title}</h3>
                <p className="text-sm text-gray-600">{driver.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/tool" className="btn-primary inline-flex items-center gap-2">
            Assess readiness <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/connect" className="btn-ghost">Book a 30 minute debrief</Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceMenu;
