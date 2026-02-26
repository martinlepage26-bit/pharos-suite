import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HEADSHOT_URL = process.env.REACT_APP_HEADSHOT_URL || "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/x8mls9m1_realistic_male_headshot_with_hair_1.jpg";

const About = () => {
  const { t } = useLanguage();

  const stepKeys = ['classify', 'design', 'maintain'];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="about-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-lg md:text-lg font-semibold text-[#0B0F1A] mb-4">{t.about.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.about.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">{t.about.keywords}</p>

        <div className="card mb-8">
          <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-4">{t.about.practiceTitle}</h2>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold text-[#0B0F1A]">{t.about.practiceP1}</span> {t.about.practiceP1b}
          </p>
          <p className="text-gray-600 mb-8">
            <span className="font-semibold text-[#0B0F1A]">{t.about.practiceP2}</span> {t.about.practiceP2b}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {stepKeys.map((key, i) => (
              <div key={key} className="bg-[#F6F7FB] rounded-lg p-5 border-t-3 border-[#2A206B]" data-testid={`practice-step-${i + 1}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#2A206B] text-white flex items-center justify-center font-semibold text-sm">{i + 1}</span>
                  <h3 className="font-serif font-semibold text-[#0B0F1A] underline decoration-[#2A206B]">{t.about.steps[key].title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.about.steps[key].description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-6">{t.about.aboutMe}</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <img src={HEADSHOT_URL} alt="Martin Lepage" className="w-48 h-48 object-cover rounded-2xl shadow-lg" data-testid="headshot" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 leading-relaxed mb-4">{t.about.bio}</p>
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-[#2A206B] font-medium hover:gap-3 transition-all group" data-testid="portfolio-link">
                {t.about.viewPortfolio} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-[#2A206B]">
          <p className="text-xs tracking-widest text-[#2A206B] uppercase mb-2">{t.about.featuredResearch}</p>
          <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] mb-2">{t.about.sealedCard}</h3>
          <p className="text-gray-600 text-sm mb-4">{t.about.sealedCardDesc}</p>
          <Link to="/sealed-card" className="inline-flex items-center gap-2 text-[#2A206B] font-medium text-sm hover:gap-3 transition-all">
            {t.about.readProtocol} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
