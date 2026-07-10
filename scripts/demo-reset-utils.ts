export type DemoResetPlan = {
  confirmed: boolean;
  commands: string[];
  redactedDatabaseUrl: string;
  runSmoke: boolean;
};

type DemoResetEnv = Partial<Record<'DATABASE_URL' | 'DEMO_RESET_CONFIRM', string>>;

const CONFIRMATION_TOKEN = 'RESET_DEMO_DATA';

export function isResetConfirmed(value: string | undefined) {
  return value === CONFIRMATION_TOKEN;
}

export function redactDatabaseUrl(value: string | undefined) {
  if (!value) {
    return 'DATABASE_URL is not set';
  }

  try {
    const url = new URL(value);
    if (url.password) {
      url.password = '***';
    }
    return url.toString();
  } catch {
    return 'DATABASE_URL is set but is not a valid URL';
  }
}

export function parseDotEnv(content: string) {
  const values: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^["']|["']$/g, '');
  }

  return values;
}

export function buildResetPlan(env: DemoResetEnv = process.env, args = process.argv.slice(2)): DemoResetPlan {
  const runSmoke = !args.includes('--skip-smoke');
  const commands = ['corepack pnpm seed:demo', 'corepack pnpm check:demo'];

  if (runSmoke) {
    commands.push('corepack pnpm smoke:production');
  }

  return {
    confirmed: isResetConfirmed(env.DEMO_RESET_CONFIRM),
    commands,
    redactedDatabaseUrl: redactDatabaseUrl(env.DATABASE_URL),
    runSmoke,
  };
}

export function confirmationHelp() {
  return `Set DEMO_RESET_CONFIRM=${CONFIRMATION_TOKEN} to reset demo data.`;
}
