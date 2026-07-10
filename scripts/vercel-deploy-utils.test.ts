import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildVercelDeployPlan,
  getVercelEnv,
  normalizeDeployConfig,
} from './vercel-deploy-utils.ts';

describe('vercel deploy utils', () => {
  it('normalizes deployment config with production defaults', () => {
    const config = normalizeDeployConfig({
      PRODUCTION_WEB_URL: 'https://web.example.com/',
      PRODUCTION_API_BASE_URL: 'https://api.example.com/',
      PRODUCTION_ELDER_USER_ID: 'elder-1',
    });

    assert.equal(config.webUrl, 'https://web.example.com');
    assert.equal(config.apiBaseUrl, 'https://api.example.com');
    assert.equal(config.elderUserId, 'elder-1');
    assert.equal(config.webAppDir, 'apps/web');
  });

  it('builds env used by local vercel build', () => {
    assert.deepEqual(
      getVercelEnv({
        webUrl: 'https://web.example.com',
        apiBaseUrl: 'https://api.example.com',
        elderUserId: 'elder-1',
        webAppDir: 'apps/web',
      }),
      {
        NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
        NEXT_PUBLIC_DEFAULT_ELDER_USER_ID: 'elder-1',
      },
    );
  });

  it('documents the exact prebuilt deployment command sequence', () => {
    const plan = buildVercelDeployPlan({
      webUrl: 'https://web.example.com',
      apiBaseUrl: 'https://api.example.com',
      elderUserId: 'elder-1',
      webAppDir: 'apps/web',
    });

    assert.deepEqual(plan.commands, [
      'corepack pnpm dlx vercel build --cwd apps/web --prod --yes',
      'mkdir -p .vercel',
      'cp apps/web/.vercel/project.json .vercel/project.json',
      'rm -rf .vercel/output',
      'cp -R apps/web/.vercel/output .vercel/output',
      'corepack pnpm dlx vercel deploy --prod --prebuilt --yes',
    ]);
  });
});
