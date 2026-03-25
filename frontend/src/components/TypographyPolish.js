import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const POLISH_TARGETS = [
  'main h1',
  'main h2',
  'main h3',
  'main h4',
  'main .hero .body-lg',
  'main .hero .body-sm',
  'main .page-hero .body-lg',
  'main .page-hero .body-sm',
  'main .section-header > .body-lg',
  'main .section-header > .body-sm',
  'main .cta-banner > p',
  'main [data-text-role="subtitle"]'
].join(', ');

const normalizeHeadingText = (text) => {
  const compact = text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  if (!compact) return compact;

  const withAmpersands = compact.replace(/\b(?:and|And|AND)\b/g, '&');
  const words = withAmpersands.split(' ');

  if (words.length < 3) return withAmpersands;

  const lastIndex = words.length - 1;
  words[lastIndex - 1] = `${words[lastIndex - 1]}\u00A0${words[lastIndex]}`;
  words.pop();

  return words.join(' ');
};

const polishElement = (element) => {
  if (!(element instanceof HTMLElement) || element.children.length > 0) return;

  const nextText = normalizeHeadingText(element.textContent || '');
  if (nextText && nextText !== element.textContent) {
    element.textContent = nextText;
  }
};

const TypographyPolish = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.querySelector('main');
    if (!root) return undefined;

    const polishAll = () => {
      root.querySelectorAll(POLISH_TARGETS).forEach(polishElement);
    };

    const raf = window.requestAnimationFrame(polishAll);
    const observer = new MutationObserver(polishAll);

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [location.pathname, location.hash]);

  return null;
};

export default TypographyPolish;
