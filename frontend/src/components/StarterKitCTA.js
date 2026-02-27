import { useState } from 'react';
import { Download, CheckCircle, Mail, FileText, Shield, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StarterKitCTA = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(t.starterKit.emailSubject);
    const body = encodeURIComponent(
      `${t.starterKit.emailBody}\n\nEmail: ${email}\n\n${t.starterKit.included}\n- ${t.starterKit.riskTemplate}\n- ${t.starterKit.checklist}\n- ${t.starterKit.controlGuide}`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const kitContents = [
    { icon: Shield, text: t.starterKit.riskTemplate },
    { icon: List, text: t.starterKit.checklist },
    { icon: FileText, text: t.starterKit.controlGuide }
  ];

  return (
    <div className="bg-[linear-gradient(135deg,#0D0A2E_0%,#0D0A2E_40%,#1A1555_70%,#2D2380_100%)] rounded-xl p-5 text-white shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden" data-testid="starter-kit-cta">
      {/* Shine effect */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-semibold mb-1 text-white">
            {t.starterKit.title}
          </h3>
          <p className="text-white/70 text-sm">
            {t.starterKit.description}
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-3 mb-4">
        <p className="text-xs uppercase tracking-wider text-white/50 mb-2">{t.starterKit.included}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {kitContents.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon className="w-3 h-3 text-[#7C5CD6]" />
              <span className="text-white/80 text-xs">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.starterKit.emailPlaceholder}
            required
            className="w-full pl-9 pr-3 py-2 rounded-md bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D0A2E]"
            data-testid="starter-kit-email"
          />
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-1.5 ${
            submitted 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-[#0B0F1A] hover:bg-gray-100'
          }`}
          data-testid="starter-kit-submit"
        >
          {submitted ? (
            <>
              <CheckCircle className="w-3 h-3" />
              {t.starterKit.sent}
            </>
          ) : (
            t.starterKit.getKit
          )}
        </button>
      </form>
    </div>
  );
};

export default StarterKitCTA;
