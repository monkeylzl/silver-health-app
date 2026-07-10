import {
  assertJsonOk,
  buildSmokeConfig,
  containsAllText,
  joinUrl,
  summarizeCollectionPayload,
} from './production-smoke-utils.ts';

type SmokeCheck = {
  name: string;
  run: () => Promise<string>;
};

const config = buildSmokeConfig();
let webSessionCookie = '';

async function fetchText(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const text = await response.text();
  return { response, text };
}

async function fetchJson(url: string, init?: RequestInit) {
  const { response, text } = await fetchText(url, init);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}: ${text.slice(0, 200)}`);
  }
  return JSON.parse(text) as unknown;
}

async function authenticatedWebFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: { Cookie: webSessionCookie, ...init.headers },
  });
}

async function protectedApiFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: { 'X-Silver-App-Key': config.internalApiKey, ...init.headers },
  });
}

async function establishWebSession() {
  if (!config.trialAccessCode || !config.internalApiKey) {
    throw new Error('PRODUCTION_TRIAL_ACCESS_CODE and PRODUCTION_INTERNAL_API_KEY are required');
  }
  const response = await fetch(joinUrl(config.webUrl, '/api/session'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode: config.trialAccessCode }),
  });
  if (response.status !== 204) {
    throw new Error(`web session returned ${response.status}`);
  }
  webSessionCookie = (response.headers.get('set-cookie') ?? '').split(';')[0];
  if (!webSessionCookie) throw new Error('web session did not return a cookie');
}

function contentTypeIncludes(response: Response, expectedType: string) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes(expectedType)) {
    throw new Error(`expected content-type to include ${expectedType}, got ${contentType || 'empty'}`);
  }
}

function httpCheck(path: string, expectedType: string): SmokeCheck {
  return {
    name: `web ${path}`,
    async run() {
      const url = joinUrl(config.webUrl, path);
      const response = await authenticatedWebFetch(url);
      if (!response.ok) {
        throw new Error(`${url} returned ${response.status}`);
      }
      contentTypeIncludes(response, expectedType);
      return `${response.status} ${response.headers.get('content-type')}`;
    },
  };
}

function apiCollectionCheck(path: string, label: string, minimumCount: number): SmokeCheck {
  return {
    name: `api ${label}`,
    async run() {
      const response = await protectedApiFetch(joinUrl(config.apiBaseUrl, path));
      if (!response.ok) throw new Error(`${path} returned ${response.status}`);
      const payload = await response.json() as unknown;
      assertJsonOk(payload, label);
      const count = summarizeCollectionPayload(payload, label);
      if (count < minimumCount) {
        throw new Error(`${label} expected at least ${minimumCount} item(s), got ${count}`);
      }
      return `${count} item(s)`;
    },
  };
}

const checks: SmokeCheck[] = [
  {
    name: 'config',
    async run() {
      await establishWebSession();
      return `web=${config.webUrl}, api=${config.apiBaseUrl}, elder=${config.elderUserId}, protected=yes`;
    },
  },
  httpCheck('/', 'text/html'),
  httpCheck('/health', 'text/html'),
  httpCheck('/family', 'text/html'),
  httpCheck('/family/reports', 'text/html'),
  httpCheck('/me', 'text/html'),
  httpCheck('/manifest.webmanifest', 'application/manifest+json'),
  httpCheck('/offline.html', 'text/html'),
  httpCheck('/sw.js', 'application/javascript'),
  {
    name: 'home real api content',
    async run() {
      const response = await authenticatedWebFetch(config.webUrl);
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${config.webUrl} returned ${response.status}`);
      }
      const missingText = containsAllText(text, [
        '今日',
        '健康',
        '家人',
        '我的',
        '晨间散步 20 分钟',
        '记录今日血压',
      ]);
      if (missingText.length > 0) {
        throw new Error(`homepage missing text: ${missingText.join(', ')}`);
      }
      return 'tabs and seeded tasks found';
    },
  },
  {
    name: 'api health',
    async run() {
      const payload = await fetchJson(joinUrl(config.apiBaseUrl, '/api/health'));
      assertJsonOk(payload, 'api health');
      return 'ok';
    },
  },
  apiCollectionCheck(`/api/tasks/elder/${config.elderUserId}`, 'tasks', 1),
  apiCollectionCheck(`/api/metrics/elder/${config.elderUserId}`, 'metrics', 1),
  apiCollectionCheck(`/api/medications/elder/${config.elderUserId}`, 'medications', 1),
  apiCollectionCheck(`/api/reports/elder/${config.elderUserId}`, 'reports', 1),
  {
    name: 'api cors health',
    async run() {
      const response = await fetch(joinUrl(config.apiBaseUrl, '/api/health'), {
        headers: { Origin: config.webUrl },
      });
      const allowOrigin = response.headers.get('access-control-allow-origin');
      if (allowOrigin !== config.webUrl) {
        throw new Error(`expected access-control-allow-origin ${config.webUrl}, got ${allowOrigin ?? 'empty'}`);
      }
      return allowOrigin;
    },
  },
  {
    name: 'api cors patch preflight',
    async run() {
      const response = await fetch(joinUrl(config.apiBaseUrl, '/api/tasks/smoke-task/status'), {
        method: 'OPTIONS',
        headers: {
          Origin: config.webUrl,
          'Access-Control-Request-Method': 'PATCH',
          'Access-Control-Request-Headers': 'content-type,x-silver-app-key',
        },
      });
      if (response.status !== 204) {
        throw new Error(`expected preflight 204, got ${response.status}`);
      }
      const methods = response.headers.get('access-control-allow-methods') ?? '';
      if (!methods.includes('PATCH')) {
        throw new Error(`expected PATCH in access-control-allow-methods, got ${methods}`);
      }
      return `204 ${methods}`;
    },
  },
];

async function main() {
  console.log('Production smoke check');
  for (const check of checks) {
    try {
      const detail = await check.run();
      console.log(`PASS ${check.name}: ${detail}`);
    } catch (error) {
      console.error(`FAIL ${check.name}: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
      return;
    }
  }
  console.log(`Production smoke passed: ${checks.length} checks`);
}

void main();
