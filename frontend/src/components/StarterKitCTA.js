import { useState } from 'react';
import { Download, CheckCircle, Mail, FileText, Shield, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import lighthouseMark from '../assets/logos/governance-lighthouse-simplified.svg';

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
    <div className="brand-panel-dark relative overflow-hidden rounded-[30px] p-6 text-[#F6F0E4]" data-testid="starter-kit-cta">
      <div className="absolute -right-10 top-4 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(184,155,94,0.18)_0%,rgba(184,155,94,0)_72%)] pointer-events-none" />
      <div className="absolute bottom-[-46px] left-[-18px] h-28 w-28 rotate-45 rounded-[18px] border border-[#B89B5E]/14 pointer-events-none" />
      <div className="relative mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] border border-[#B89B5E]/20 bg-white/8">
          <img src={lighthouseMark} alt="" className="h-7 w-7" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
            Governance starter kit
          </p>
          <h3 className="font-serif text-[28px] font-semibold text-white">
            {t.starterKit.title}
          </h3>
          <p className="mt-1 text-sm text-white/72">
            {t.starterKit.description}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-[24px] border border-white/10 bg-white/7 p-4">
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
          {t.starterKit.included}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {kitContents.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon className="h-3 w-3 text-[#D8C08A]" />
              <span className="text-xs text-white/82">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6F88]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.starterKit.emailPlaceholder}
            required
            className="w-full rounded-full border border-[#D9D0BE] bg-[#FBF7EF] py-3 pl-10 pr-4 text-sm text-[#162132] placeholder-[#6A7689] focus:border-[#B89B5E] focus:outline-none"
            data-testid="starter-kit-email"
          />
        </div>
        <button
          type="submit"
          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium transition-all ${
            submitted 
              ? 'bg-[#D8C08A] text-[#081428]' 
              : 'bg-[linear-gradient(135deg,#f7f2e8_0%,#eadbc0_100%)] text-[#081428] hover:translate-y-[-1px]'
          }`}
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
          data-testid="starter-kit-submit"
        >
          {submitted ? (
            <>
              <CheckCircle className="h-3 w-3" />
              {t.starterKit.sent}
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              {t.starterKit.getKit}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StarterKitCTA;
