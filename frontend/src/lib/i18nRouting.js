const FRENCH_PREFIX = '/fr';
const ENGLISH_PREFIX = '/en';

export const LOCALIZABLE_PATHS = new Set([
  '/',
  '/about',
  '/governance',
  '/services',
  '/services/menu',
  '/observatory',
  '/research',
  '/methods',
  '/about/conceptual-method',
  '/assurance',
  '/transparency',
  '/trust',
  '/auditability',
  '/faq',
  '/privacy',
  '/terms',
  '/cases',
  '/library',
  '/connect',
  '/contact',
  '/tool',
  '/portfolio',
  '/publications/trust-advantage-analysis',
  '/portal/compassai',
  '/portal/compassai/aurora',
  '/portal/aurorai'
]);

const EXTERNAL_PATH_PATTERN = /^(?:[a-z]+:|\/\/)/i;

function normalizePathname(pathname) {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  const trimmed = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return trimmed || '/';
}

function splitSuffix(value) {
  const match = String(value).match(/^([^?#]*)(.*)$/);
  return {
    pathname: match?.[1] || '/',
    suffix: match?.[2] || ''
  };
}

export function getPathLanguage(pathname) {
  const normalized = normalizePathname(pathname);

  if (normalized === FRENCH_PREFIX || normalized.startsWith(`${FRENCH_PREFIX}/`)) {
    return 'fr';
  }

  if (normalized === ENGLISH_PREFIX || normalized.startsWith(`${ENGLISH_PREFIX}/`)) {
    return 'en';
  }

  return null;
}

export function stripLocaleFromPath(pathname) {
  const normalized = normalizePathname(pathname);

  if (normalized === FRENCH_PREFIX || normalized === ENGLISH_PREFIX) {
    return '/';
  }

  if (normalized.startsWith(`${FRENCH_PREFIX}/`)) {
    return normalizePathname(normalized.slice(FRENCH_PREFIX.length));
  }

  if (normalized.startsWith(`${ENGLISH_PREFIX}/`)) {
    return normalizePathname(normalized.slice(ENGLISH_PREFIX.length));
  }

  return normalized;
}

export function isLocalizablePath(pathname) {
  return LOCALIZABLE_PATHS.has(stripLocaleFromPath(pathname));
}

export function localizePath(value, language, options = {}) {
  if (typeof value !== 'string') return value;
  if (!value || value.startsWith('#') || EXTERNAL_PATH_PATTERN.test(value)) return value;

  const { pathname, suffix } = splitSuffix(value);
  const basePath = stripLocaleFromPath(pathname);

  if (!options.force && !isLocalizablePath(basePath)) {
    return `${pathname}${suffix}`;
  }

  if (language === 'fr') {
    return `${basePath === '/' ? FRENCH_PREFIX : `${FRENCH_PREFIX}${basePath}`}${suffix}`;
  }

  return `${basePath}${suffix}`;
}

export function localizeTo(to, language, options = {}) {
  if (typeof to === 'string') {
    return localizePath(to, language, options);
  }

  if (to && typeof to === 'object' && typeof to.pathname === 'string') {
    return {
      ...to,
      pathname: localizePath(to.pathname, language, options)
    };
  }

  return to;
}
