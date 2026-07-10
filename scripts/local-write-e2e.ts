import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { buildLocalWriteE2EConfig, parseSeededDemoIds } from './local-e2e-utils.ts';
import { parseDotEnv } from './demo-reset-utils.ts';

const dotEnv = existsSync('.env') ? parseDotEnv(readFileSync('.env', 'utf8')) : {};
const baseEnv = { ...dotEnv, ...process.env };

function runAndCapture(command: string, args: string[], env: NodeJS.ProcessEnv, cwd = process.cwd()) {
  console.log(`\n> ${[command, ...args].join(' ')}`);
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  process.stdout.write(output);

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }

  return output;
}

function startServer(label: string, command: string, args: string[], env: NodeJS.ProcessEnv, cwd = process.cwd()) {
  console.log(`\n> ${[command, ...args].join(' ')}`);
  const child = spawn(command, args, {
    cwd,
    detached: true,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[${label}] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[${label}] ${chunk}`));
  return child;
}

async function waitForUrl(url: string, label: string, timeoutMs = 60_000) {
  const startedAt = Date.now();
  let lastError = '';

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`${label} is ready: ${url}`);
        return;
      }
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`${label} did not become ready at ${url}: ${lastError}`);
}

async function stopServers(children: ChildProcessWithoutNullStreams[]) {
  await Promise.all(
    children.map(
      (child) =>
        new Promise<void>((resolve) => {
          if (child.exitCode !== null || child.killed) {
            resolve();
            return;
          }
          child.once('exit', () => resolve());
          if (child.pid) {
            try {
              process.kill(-child.pid, 'SIGTERM');
            } catch {
              child.kill('SIGTERM');
            }
          }
          setTimeout(() => {
            if (child.exitCode === null && !child.killed) {
              if (child.pid) {
                try {
                  process.kill(-child.pid, 'SIGKILL');
                } catch {
                  child.kill('SIGKILL');
                }
              }
            }
            resolve();
          }, 3000).unref();
        }),
    ),
  );
}

async function main() {
  const resetOutput = runAndCapture(
    'corepack',
    ['pnpm', 'demo:reset', '--', '--skip-smoke'],
    {
      ...baseEnv,
      DEMO_RESET_CONFIRM: 'RESET_DEMO_DATA',
    },
  );
  const ids = parseSeededDemoIds(resetOutput);
  const config = buildLocalWriteE2EConfig(baseEnv, ids);
  const children: ChildProcessWithoutNullStreams[] = [];

  console.log('\nLocal write E2E');
  console.log(`- elder user id: ${ids.elderUserId}`);
  console.log(`- api: ${config.apiUrl}`);
  console.log(`- web: ${config.webUrl}`);

  try {
    children.push(startServer('api', 'corepack', ['pnpm', '--filter', '@silver-health/api', 'dev'], config.env));
    await waitForUrl(`${config.apiUrl}/api/health`, 'API');

    runAndCapture('corepack', ['pnpm', 'build'], config.env, 'apps/web');
    children.push(startServer('web', 'corepack', ['pnpm', 'start', '--hostname', '127.0.0.1', '--port', String(config.webPort)], config.env, 'apps/web'));
    await waitForUrl(config.webUrl, 'Web');

    if (baseEnv.E2E_PWA_ONLY !== '1') {
      runAndCapture(
        'corepack',
        ['pnpm', 'exec', 'playwright', 'test', '--config', 'playwright.config.ts', 'tests/e2e/mobile-navigation.spec.ts'],
        config.env,
      );

      runAndCapture(
        'corepack',
        ['pnpm', 'exec', 'playwright', 'test', '--config', 'playwright.config.ts', 'tests/e2e/local-write-flow.spec.ts', '--project', 'mobile-390'],
        config.env,
      );
    }

    runAndCapture(
      'corepack',
      ['pnpm', 'exec', 'playwright', 'test', '--config', 'playwright.config.ts', 'tests/e2e/pwa-offline.spec.ts', '--project', 'mobile-390'],
      config.env,
    );

    console.log('\nLocal responsive and write E2E passed.');
  } finally {
    await stopServers(children);
  }
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
