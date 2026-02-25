import { useState } from 'react';
import { Download, CheckCircle, Mail, FileText, Shield, List } from 'lucide-react';

const StarterKitCTA = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Send via mailto with the kit request
    const subject = encodeURIComponent('Governance Starter Kit Request');
    const body = encodeURIComponent(
      `Please send me the AI Governance Starter Kit.\n\nEmail: ${email}\n\nI understand this includes:\n- Risk Tiering Template\n- Governance Checklist\n- Control Mapping Guide`
    );
    window.location.href = `mailto:martin@martinlepage.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const kitContents = [
    { icon: Shield, text: 'Risk Tiering Template (Excel)' },
    { icon: List, text: 'AI Governance Checklist (PDF)' },
    { icon: FileText, text: 'Control Mapping Guide' }
  ];

  return (
    <div className="bg-gradient-to-br from-[#1a2744] via-[#2a3a5c] to-[#6366f1] rounded-2xl p-8 text-white" data-testid="starter-kit-cta">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Download className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-semibold mb-2">
            AI Governance Starter Kit
          </h3>
          <p className="text-white/80">
            Free templates to begin classifying risk and building controls today.
          </p>
        </div>
      </div>

      {/* Kit Contents */}
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <p className="text-xs uppercase tracking-wider text-white/60 mb-3">What's included:</p>
        <div className="space-y-2">
          {kitContents.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-[#a78bfa]" />
              <span className="text-white/90 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
            data-testid="starter-kit-email"
          />
        </div>
        <button
          type="submit"
          className={`px-5 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            submitted 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-[#1a2744] hover:bg-gray-100'
          }`}
          data-testid="starter-kit-submit"
        >
          {submitted ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Sent!
            </>
          ) : (
            'Get the Kit'
          )}
        </button>
      </form>
      
      <p className="text-white/50 text-xs mt-3">
        Opens your email client. No spam, just governance resources.
      </p>
    </div>
  );
};

export default StarterKitCTA;
