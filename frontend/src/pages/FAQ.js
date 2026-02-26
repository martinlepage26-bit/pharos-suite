import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="faq-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#0B0F1A] mb-4">{t.faq.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.faq.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">{t.faq.keywords}</p>

        <div className="space-y-6">
          {t.faq.questions.map((faq, index) => (
            <div key={index} className="card" data-testid={`faq-${index}`}>
              <h2 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-4">{faq.question}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{faq.answer}</p>
              
              {faq.cta === 'requestAuditChecklist' && (
                <Link to="/connect" className="text-[#180E66] font-medium hover:underline text-sm">
                  {t.faq.requestAuditChecklist} &rarr;
                </Link>
              )}
              
              {faq.cta === 'engagementButtons' && (
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link to="/tool" className="btn-primary text-sm">{t.faq.assessReadiness}</Link>
                  <Link to="/services" className="btn-ghost text-sm">{t.faq.viewServices}</Link>
                  <Link to="/connect" className="btn-ghost text-sm">{t.faq.bookDebrief}</Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-[#180E66] to-[#180E66] rounded-2xl text-white">
          <h3 className="font-serif text-xl font-semibold mb-2">{t.faq.stillHaveQuestions}</h3>
          <p className="text-white/80 mb-4">{t.faq.stillHaveQuestionsDesc}</p>
          <Link to="/connect" className="inline-block bg-white text-[#0B0F1A] px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">{t.faq.bookDebrief}</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
