export type SmokeConfig = {
  webUrl: string;
  apiBaseUrl: string;
  elderUserId: string;
};

type SmokeEnv = Partial<Record<'PRODUCTION_WEB_URL' | 'PRODUCTION_API_BASE_URL' | 'PRODUCTION_ELDER_USER_ID', string>>;

const DEFAULT_WEB_URL = 'https://web-nu-blond-89.vercel.app';
const DEFAULT_API_BASE_URL = 'https://silver-health-api-production.up.railway.app';
const DEFAULT_ELDER_USER_ID = 'cmre5b56p0000ij0niccn6i4n';

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function requireUrl(name: string, value: string) {
  try {
    return stripTrailingSlash(new URL(value).toString());
  } catch {
    throw new Error(`${name} must be a valid absolute URL: ${value}`);
  }
}

export function buildSmokeConfig(env: SmokeEnv = process.env): SmokeConfig {
  return {
    webUrl: requireUrl('PRODUCTION_WEB_URL', env.PRODUCTION_WEB_URL ?? DEFAULT_WEB_URL),
    apiBaseUrl: requireUrl('PRODUCTION_API_BASE_URL', env.PRODUCTION_API_BASE_URL ?? DEFAULT_API_BASE_URL),
    elderUserId: env.PRODUCTION_ELDER_USER_ID ?? DEFAULT_ELDER_USER_ID,
  };
}

export function joinUrl(baseUrl: string, path: string) {
  return `${stripTrailingSlash(baseUrl)}/${path.replace(/^\/+/, '')}`;
}

export function containsAllText(source: string, expectedText: string[]) {
  return expectedText.filter((text) => !source.includes(text));
}

export function summarizeCollectionPayload(payload: unknown, label: string) {
  if (!payload || typeof payload !== 'object') {
    throw new Error(`${label} expected a JSON object payload`);
  }

  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) {
    throw new Error(`${label} expected data to be an array`);
  }

  return data.length;
}

export function assertJsonOk(payload: unknown, label: string) {
  if (!payload || typeof payload !== 'object') {
    throw new Error(`${label} expected a JSON object payload`);
  }

  const result = payload as { code?: unknown; message?: unknown };
  if (result.code !== 0 || result.message !== 'ok') {
    throw new Error(`${label} expected { code: 0, message: "ok" }`);
  }
}
