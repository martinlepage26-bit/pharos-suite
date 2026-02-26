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
    <div className="bg-[linear-gradient(135deg,#2A206B_0%,#2A206B_40%,#4A3D8F_70%,#7B6DB5_100%)] rounded-2xl p-8 text-white shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden" data-testid="starter-kit-cta">
      {/* Shine effect */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Download className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-semibold mb-2 text-white">
            {t.starterKit.title}
          </h3>
          <p className="text-white/80">
            {t.starterKit.description}
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <p className="text-xs uppercase tracking-wider text-white/60 mb-3">{t.starterKit.included}</p>
        <div className="space-y-2">
          {kitContents.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-[#7C5CD6]" />
              <span className="text-white/90 text-sm">{item.text}</span>
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
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A206B]"
            data-testid="starter-kit-email"
          />
        </div>
        <button
          type="submit"
          className={`px-5 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            submitted 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-[#0B0F1A] hover:bg-gray-100'
          }`}
          data-testid="starter-kit-submit"
        >
          {submitted ? (
            <>
              <CheckCircle className="w-4 h-4" />
              {t.starterKit.sent}
            </>
          ) : (
            t.starterKit.getKit
          )}
        </button>
      </form>
      
      <p className="text-white/50 text-xs mt-3">
        {t.starterKit.noSpam}
      </p>
    </div>
  );
};

export default StarterKitCTA;
