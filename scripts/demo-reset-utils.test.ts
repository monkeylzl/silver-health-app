import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildResetPlan,
  isResetConfirmed,
  parseDotEnv,
  redactDatabaseUrl,
} from './demo-reset-utils.ts';

describe('demo reset utils', () => {
  it('requires an explicit confirmation token', () => {
    assert.equal(isResetConfirmed(undefined), false);
    assert.equal(isResetConfirmed('yes'), false);
    assert.equal(isResetConfirmed('RESET_DEMO_DATA'), true);
  });

  it('redacts database passwords while preserving target context', () => {
    assert.equal(
      redactDatabaseUrl('postgresql://demo_user:secret-password@example.com:5432/silver_health?schema=public'),
      'postgresql://demo_user:***@example.com:5432/silver_health?schema=public',
    );
  });

  it('parses simple dotenv values used by local demo resets', () => {
    assert.deepEqual(parseDotEnv('DATABASE_URL="postgresql://demo:secret@example.com/db"\nPORT=3001\n'), {
      DATABASE_URL: 'postgresql://demo:secret@example.com/db',
      PORT: '3001',
    });
  });

  it('builds a safe reset plan with smoke enabled by default', () => {
    const plan = buildResetPlan({
      DATABASE_URL: 'postgresql://demo_user:secret@example.com:5432/silver_health',
      DEMO_RESET_CONFIRM: 'RESET_DEMO_DATA',
    });

    assert.equal(plan.confirmed, true);
    assert.equal(plan.runSmoke, true);
    assert.equal(plan.redactedDatabaseUrl, 'postgresql://demo_user:***@example.com:5432/silver_health');
    assert.deepEqual(plan.commands, ['corepack pnpm seed:demo', 'corepack pnpm check:demo', 'corepack pnpm smoke:production']);
  });

  it('can skip production smoke for local-only recovery', () => {
    const plan = buildResetPlan(
      {
        DATABASE_URL: 'postgresql://demo_user:secret@example.com:5432/silver_health',
        DEMO_RESET_CONFIRM: 'RESET_DEMO_DATA',
      },
      ['--skip-smoke'],
    );

    assert.equal(plan.runSmoke, false);
    assert.deepEqual(plan.commands, ['corepack pnpm seed:demo', 'corepack pnpm check:demo']);
  });
});
