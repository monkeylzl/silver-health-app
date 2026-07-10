export type VercelDeployConfig = {
  webUrl: string;
  apiBaseUrl: string;
  elderUserId: string;
  webAppDir: string;
};

export type VercelDeployPlan = {
  commands: string[];
  env: Record<string, string>;
};

type DeployEnv = Partial<
  Record<'PRODUCTION_WEB_URL' | 'PRODUCTION_API_BASE_URL' | 'PRODUCTION_ELDER_USER_ID' | 'VERCEL_WEB_APP_DIR', string>
>;

const DEFAULT_WEB_URL = 'https://web-nu-blond-89.vercel.app';
const DEFAULT_API_BASE_URL = 'https://silver-health-api-production.up.railway.app';
const DEFAULT_ELDER_USER_ID = 'cmre5b56p0000ij0niccn6i4n';
const DEFAULT_WEB_APP_DIR = 'apps/web';

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function normalizeUrl(name: string, value: string) {
  try {
    return stripTrailingSlash(new URL(value).toString());
  } catch {
    throw new Error(`${name} must be a valid absolute URL: ${value}`);
  }
}

export function normalizeDeployConfig(env: DeployEnv = process.env): VercelDeployConfig {
  return {
    webUrl: normalizeUrl('PRODUCTION_WEB_URL', env.PRODUCTION_WEB_URL ?? DEFAULT_WEB_URL),
    apiBaseUrl: normalizeUrl('PRODUCTION_API_BASE_URL', env.PRODUCTION_API_BASE_URL ?? DEFAULT_API_BASE_URL),
    elderUserId: env.PRODUCTION_ELDER_USER_ID ?? DEFAULT_ELDER_USER_ID,
    webAppDir: env.VERCEL_WEB_APP_DIR ?? DEFAULT_WEB_APP_DIR,
  };
}

export function getVercelEnv(config: VercelDeployConfig) {
  return {
    NEXT_PUBLIC_API_BASE_URL: config.apiBaseUrl,
    NEXT_PUBLIC_DEFAULT_ELDER_USER_ID: config.elderUserId,
  };
}

export function buildVercelDeployPlan(config = normalizeDeployConfig()): VercelDeployPlan {
  return {
    env: getVercelEnv(config),
    commands: [
      `corepack pnpm dlx vercel build --cwd ${config.webAppDir} --prod --yes`,
      'mkdir -p .vercel',
      `cp ${config.webAppDir}/.vercel/project.json .vercel/project.json`,
      'rm -rf .vercel/output',
      `cp -R ${config.webAppDir}/.vercel/output .vercel/output`,
      'corepack pnpm dlx vercel deploy --prod --prebuilt --yes',
    ],
  };
}
