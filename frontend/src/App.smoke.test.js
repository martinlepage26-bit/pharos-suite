import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

let mockFetchHandler;
const MODULE_STORAGE_PREFIX = 'pharos-ai-module-connection';

const makeJsonResponse = (payload, ok = true, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: async () => payload,
  text: async () => JSON.stringify(payload),
  headers: {
    get: () => 'application/json'
  }
});

const routeCases = [
  ['/', 'home-page'],
  ['/fr', 'home-page'],
  ['/game', 'game-page'],
  ['/services', 'home-page'],
  ['/fr/services', 'home-page'],
  ['/governance', 'home-page'],
  ['/services/menu', 'home-page'],
  ['/tool', 'tool-page'],
  ['/fr/tool', 'tool-page'],
  ['/assurance', 'home-page'],
  ['/transparency', 'home-page'],
  ['/trust', 'home-page'],
  ['/auditability', 'home-page'],
  ['/faq', 'home-page'],
  ['/privacy', 'privacy-page'],
  ['/fr/privacy', 'privacy-page'],
  ['/terms', 'terms-page'],
  ['/fr/terms', 'terms-page'],
  ['/research', 'home-page'],
  ['/observatory', 'home-page'],
  ['/cases', 'home-page'],
  ['/about', 'home-page'],
  ['/fr/about', 'home-page'],
  ['/about/conceptual-method', 'home-page'],
  ['/methods', 'home-page'],
  ['/connect', 'home-page'],
  ['/contact', 'home-page'],
  ['/portal/compassai/aurora', 'portal-aurorai-page'],
  ['/fr/portal/compassai/aurora', 'portal-aurorai-page'],
  ['/portal/compassai', 'portal-compassai-page'],
  ['/fr/portal/compassai', 'portal-compassai-page'],
  ['/sealed-card', 'sealed-card-page'],
  ['/portfolio', 'surface-boundary-page'],
  ['/library', 'home-page'],
  ['/admin', 'admin-login'],
  ['/publications/trust-advantage-analysis', 'surface-boundary-page']
];

const publicShellRoutes = [
  '/',
  '/fr',
  '/about',
  '/fr/about',
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
  '/cases',
  '/library',
  '/connect',
  '/contact'
];

const flushEffects = async (cycles = 4) => {
  for (let index = 0; index < cycles; index += 1) {
    await act(async () => {
      await Promise.resolve();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }
};

const waitForTestId = async (container, testId) => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await flushEffects();
    const element = container.querySelector(`[data-testid="${testId}"]`);
    if (element) return element;
  }

  throw new Error(`Could not find data-testid="${testId}" after rendering.`);
};

const waitForButtonByText = async (container, text) => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await flushEffects();
    const button = Array.from(container.querySelectorAll('button')).find((element) => element.textContent.includes(text));
    if (button) return button;
  }

  throw new Error(`Could not find button containing "${text}" after rendering.`);
};

const waitForText = async (container, text) => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await flushEffects();
    if (container.textContent.includes(text)) return;
  }

  throw new Error(`Could not find text "${text}" after rendering.`);
};

const setStoredModuleConfig = (moduleKey, config) => {
  window.localStorage.setItem(`${MODULE_STORAGE_PREFIX}:${moduleKey}`, JSON.stringify(config));
};

const getInputByLabel = (container, labelText) => {
  const label = Array.from(container.querySelectorAll('label')).find((element) => element.textContent.includes(labelText));
  if (!label) {
    throw new Error(`Could not find label containing "${labelText}".`);
  }

  const input = label.querySelector('input');
  if (!input) {
    throw new Error(`Could not find input for label containing "${labelText}".`);
  }

  return input;
};

const setInputValue = async (input, value) => {
  await act(async () => {
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    valueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

const clickElement = async (element) => {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
};

const defaultFetchPayload = (requestUrl) => {
  if (requestUrl.includes('/api/bookings/booked-slots')) return [];
  if (requestUrl.includes('/api/services/active')) return [];
  if (requestUrl.includes('/api/admin/login')) return { token: 'test-token' };
  if (requestUrl.includes('/api/idp/pipeline')) return { pipeline: [] };
  if (requestUrl.endsWith('/api/stats')) return { stats: [] };
  if (requestUrl.includes('/api/categories')) return { categories: [] };
  if (requestUrl.endsWith('/api/documents')) return [];
  if (requestUrl.includes('/api/documents/')) {
    return {
      id: requestUrl.split('/').pop(),
      original_filename: 'Document.pdf'
    };
  }
  if (requestUrl.includes('/api/stats/dashboard')) {
    return {
      assessments_count: 0,
      average_score: 0,
      clients_count: 0,
      systems_count: 0
    };
  }
  if (requestUrl.endsWith('/api/clients')) return [];
  if (requestUrl.endsWith('/api/ai-systems')) return [];
  if (requestUrl.endsWith('/api/assessments')) return [];
  if (requestUrl.includes('/api/scheduled-assessments')) return [];
  if (requestUrl.includes('/api/benchmarks/')) {
    return {
      sector: decodeURIComponent(requestUrl.split('/').pop() || 'Unknown'),
      average_score: 0
    };
  }
  if (requestUrl.includes('/deliverables')) {
    return {
      assessment_summary: null,
      generated_at: null,
      artifacts: []
    };
  }
  return {};
};

describe('PHAROS route smoke coverage', () => {
  let container;
  let root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: jest.fn()
    });

    Object.defineProperty(window, 'requestAnimationFrame', {
      writable: true,
      value: (callback) => window.setTimeout(callback, 0)
    });

    Object.defineProperty(window, 'cancelAnimationFrame', {
      writable: true,
      value: (handle) => window.clearTimeout(handle)
    });

    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      writable: true,
      value: jest.fn()
    });

    global.IntersectionObserver = class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    global.MutationObserver = class MutationObserver {
      observe() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };

    window.confirm = jest.fn(() => true);
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    localStorage.clear();
    sessionStorage.clear();
    mockFetchHandler = defaultFetchPayload;

    global.fetch = jest.fn((url) => {
      const requestUrl = String(url);
      return Promise.resolve(makeJsonResponse(mockFetchHandler(requestUrl)));
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    document.body.style.overflow = '';
    jest.clearAllMocks();
  });

  test.each(routeCases)('renders %s without crashing', async (route, testId) => {
    window.history.pushState({}, '', route);

    await act(async () => {
      root.render(<App />);
    });

    const element = await waitForTestId(container, testId);
    expect(element).toBeTruthy();
  });

  test.each(publicShellRoutes)('keeps %s on the PHAROS-NEWLOOK public shell', async (route) => {
    window.history.pushState({}, '', route);

    await act(async () => {
      root.render(<App />);
    });

    const element = await waitForTestId(container, 'home-page');
    expect(element).toBeTruthy();
    expect(element.className).toContain('home-newlook');
  });

  test('redirects the Aurora compatibility route to the canonical CompassAI path', async () => {
    window.history.pushState({}, '', '/portal/aurorai');

    await act(async () => {
      root.render(<App />);
    });

    const element = await waitForTestId(container, 'portal-aurorai-page');
    expect(element).toBeTruthy();
    expect(window.location.pathname).toBe('/portal/compassai/aurora');
  });

  test('navigates from English to the matching French route through the language toggle', async () => {
    window.history.pushState({}, '', '/about');

    await act(async () => {
      root.render(<App />);
    });

    const toggle = await waitForButtonByText(container, 'FR');
    await clickElement(toggle);

    expect(window.location.pathname).toBe('/fr/about');
    await waitForText(container, 'A propos de PHAROS');
    expect(document.documentElement.lang).toBe('fr-CA');
  });

  test('navigates from French back to the matching English route through the language toggle', async () => {
    window.history.pushState({}, '', '/fr/about');

    await act(async () => {
      root.render(<App />);
    });

    const toggle = await waitForButtonByText(container, 'EN');
    await clickElement(toggle);

    expect(window.location.pathname).toBe('/about');
    await waitForText(container, 'About PHAROS');
    expect(document.documentElement.lang).toBe('en');
  });

  test('renders the shared architecture reference on the Aurora route without module API requests', async () => {
    setStoredModuleConfig('aurorai', {
      baseUrl: 'http://preview-aurora',
      token: 'secret'
    });
    global.fetch.mockClear();
    window.history.pushState({}, '', '/portal/compassai/aurora');

    await act(async () => {
      root.render(<App />);
    });

    const element = await waitForTestId(container, 'portal-aurorai-page');
    expect(element).toBeTruthy();
    expect(element.getAttribute('data-portal-state')).toBe('under-construction');
    expect(container.textContent).toContain('Status: /portal under construction');
    expect(container.textContent).toContain('COMPASSai and AurorA');
    expect(container.textContent).toContain('pharos-ai.ca');
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/idp/pipeline'))).toBe(false);
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/stats'))).toBe(false);
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/categories'))).toBe(false);
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/documents'))).toBe(false);
  });

  test('renders the shared architecture reference on the CompassAI route without module API requests', async () => {
    setStoredModuleConfig('compassai', {
      baseUrl: 'http://preview-compassai',
      token: 'secret'
    });
    global.fetch.mockClear();
    window.history.pushState({}, '', '/portal/compassai');

    await act(async () => {
      root.render(<App />);
    });

    const element = await waitForTestId(container, 'portal-compassai-page');
    expect(element).toBeTruthy();
    expect(element.getAttribute('data-portal-state')).toBe('under-construction');
    expect(container.textContent).toContain('Status: /portal under construction');
    expect(container.textContent).toContain('COMPASSai · Governance Engine');
    expect(container.textContent).toContain('AurorA · Document Intake');
    expect(container.textContent).toContain('pharos@pharos-ai.ca');
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/stats/dashboard'))).toBe(false);
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/clients'))).toBe(false);
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/ai-systems'))).toBe(false);
    expect(global.fetch.mock.calls.some(([url]) => String(url).includes('/api/assessments'))).toBe(false);
  });
});
