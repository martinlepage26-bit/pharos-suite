import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { localizeTo } from '../lib/i18nRouting';

const LocalizedLink = ({ to, ...props }) => {
  const { language } = useLanguage();

  return <RouterLink to={localizeTo(to, language)} {...props} />;
};

export default LocalizedLink;
