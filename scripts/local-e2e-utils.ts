export type DemoIds = {
  elderUserId: string;
  familyUserId?: string;
};

export type LocalWriteE2EConfig = {
  apiPort: number;
  webPort: number;
  apiUrl: string;
  webUrl: string;
  env: Record<string, string>;
};

function readPort(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readRequiredMatch(content: string, pattern: RegExp, label: string) {
  const match = content.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Could not parse ${label} from demo seed output.`);
  }
  return match[1].trim();
}

export function parseSeededDemoIds(output: string): DemoIds {
  return {
    elderUserId: readRequiredMatch(output, /Recommended NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=([^\s]+)/i, 'elder user id'),
    familyUserId: output.match(/Family user id:\s*([^\s]+)/i)?.[1]?.trim(),
  };
}

export function buildLocalWriteE2EConfig(env: NodeJS.ProcessEnv, ids: DemoIds): LocalWriteE2EConfig {
  const apiPort = readPort(env.E2E_LOCAL_API_PORT, 3201);
  const webPort = readPort(env.E2E_LOCAL_WEB_PORT, 3200);
  const apiUrl = `http://127.0.0.1:${apiPort}`;
  const webUrl = `http://localhost:${webPort}`;
  const internalAppKey = 'silver-health-local-internal-key-2026';
  const trialSessionSecret = 'silver-health-local-session-secret-2026';

  return {
    apiPort,
    webPort,
    apiUrl,
    webUrl,
    env: {
      ...Object.fromEntries(Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
      PORT: String(apiPort),
      CORS_ORIGIN: webUrl,
      API_BASE_URL: apiUrl,
      DEFAULT_ELDER_USER_ID: ids.elderUserId,
      INTERNAL_API_KEY: internalAppKey,
      TRIAL_ACCESS_CODE_HASH: 'scrypt$16384$8$1$2uOmv8P_CH0-VR3atvkaaA$2GXqxlb2xxaX5RC7JAbPOwyXOhL11mLgFT3PJHq4brTWEsaySy0WqoFh-HtriWNdOM_T2FYMzZjqULAOlH7UUg',
      TRIAL_SESSION_SECRET: trialSessionSecret,
      E2E_TRIAL_ACCESS_CODE: 'silver-health-local',
      E2E_INTERNAL_API_KEY: internalAppKey,
      ...(ids.familyUserId
        ? {
            DEFAULT_FAMILY_USER_ID: ids.familyUserId,
            E2E_FAMILY_USER_ID: ids.familyUserId,
          }
        : {}),
      E2E_API_BASE_URL: apiUrl,
      E2E_BASE_URL: webUrl,
      E2E_ELDER_USER_ID: ids.elderUserId,
      E2E_INCLUDE_LOCAL_WRITE: '1',
    },
  };
}
