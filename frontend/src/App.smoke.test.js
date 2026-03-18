import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

jest.mock('./lib/modulePortalApi', () => {
  const actual = jest.requireActual('./lib/modulePortalApi');

  return {
    ...actual,
    getModuleConfig: jest.fn((moduleKey) => ({
      baseUrl: `http://127.0.0.1/${moduleKey}`,
      token: ''
    })),
    requestModuleJson: jest.fn(async ({ path }) => {
      if (path === '/api/idp/pipeline') return { pipeline_stages: [] };
      if (path === '/api/stats') return { stats: [] };
      if (path === '/api/categories') return { categories: [] };
      if (path === '/api/stats/dashboard') {
        return {
          total_clients: 0,
          total_systems: 0,
          total_assessments: 0,
          overdue_reviews: 0
        };
      }
      if (path === '/api/clients') return [];
      if (path === '/api/ai-systems') return [];
      if (path === '/api/assessments') return [];
      if (path.startsWith('/api/benchmarks/')) {
        return {
          sector: decodeURIComponent(path.split('/').pop() || 'Unknown'),
          average_score: 0
        };
      }
      if (path.includes('/deliverables')) {
        return {
          assessment_summary: null,
          generated_at: null,
          artifacts: []
        };
      }
      return {};
    })
  };
});

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
  ['/game', 'game-page'],
  ['/services', 'services-page'],
  ['/governance', 'services-page'],
  ['/services/menu', 'service-menu-page'],
  ['/tool', 'tool-page'],
  ['/assurance', 'assurance-page'],
  ['/transparency', 'assurance-page'],
  ['/trust', 'assurance-page'],
  ['/auditability', 'assurance-page'],
  ['/faq', 'faq-page'],
  ['/research', 'research-page'],
  ['/observatory', 'research-page'],
  ['/cases', 'cases-page'],
  ['/about', 'about-page'],
  ['/about/conceptual-method', 'conceptual-method-page'],
  ['/methods', 'conceptual-method-page'],
  ['/connect', 'connect-page'],
  ['/contact', 'connect-page'],
  ['/portal/aurorai', 'portal-aurorai-page'],
  ['/portal/compassai', 'portal-compassai-page'],
  ['/sealed-card', 'sealed-card-page'],
  ['/portfolio', 'surface-boundary-page'],
  ['/library', 'library-page'],
  ['/admin', 'admin-login'],
  ['/publications/trust-advantage-analysis', 'surface-boundary-page']
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

    global.fetch = jest.fn((url) => {
      const requestUrl = String(url);

      if (requestUrl.includes('/api/bookings/booked-slots')) {
        return Promise.resolve(makeJsonResponse([]));
      }

      if (requestUrl.includes('/api/services/active')) {
        return Promise.resolve(makeJsonResponse([]));
      }

      if (requestUrl.includes('/api/publications')) {
        return Promise.resolve(makeJsonResponse([]));
      }

      if (requestUrl.includes('/api/admin/login')) {
        return Promise.resolve(makeJsonResponse({ token: 'test-token' }));
      }

      return Promise.resolve(makeJsonResponse([]));
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
});
