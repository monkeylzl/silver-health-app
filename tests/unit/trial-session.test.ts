import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createAccessCodeHash,
  isTrialAccessConfigured,
  verifyAccessCode,
} from '../../apps/web/lib/trial-access-code.ts';
import {
  createTrialSession,
  verifyTrialSession,
} from '../../apps/web/lib/trial-session-token.ts';
import { FixedWindowRateLimiter, isTrialRequestBodyAllowed, readJsonBodyWithinLimit } from '../../apps/web/lib/trial-rate-limit.ts';

describe('trial access session', () => {
  it('accepts only the access code used to create the scrypt hash', async () => {
    const encodedHash = await createAccessCodeHash('silver-health-2026', Buffer.alloc(16, 7));

    assert.equal(await verifyAccessCode('silver-health-2026', encodedHash), true);
    assert.equal(await verifyAccessCode('wrong-code', encodedHash), false);
  });

  it('requires an explicit access-code hash in production', () => {
    assert.equal(isTrialAccessConfigured(undefined, 'production'), false);
    assert.equal(isTrialAccessConfigured('scrypt$configured', 'production'), true);
    assert.equal(isTrialAccessConfigured(undefined, 'development'), true);
  });

  it('accepts a signed session before expiry and rejects it after expiry', async () => {
    const now = Date.UTC(2026, 6, 10, 8, 0, 0);
    const token = await createTrialSession('session-secret-at-least-32-characters', now);

    assert.equal(await verifyTrialSession(token, 'session-secret-at-least-32-characters', now + 60_000), true);
    assert.equal(await verifyTrialSession(token, 'session-secret-at-least-32-characters', now + 8 * 24 * 60 * 60 * 1000), false);
  });

  it('rejects a tampered session and a session signed by another secret', async () => {
    const now = Date.UTC(2026, 6, 10, 8, 0, 0);
    const token = await createTrialSession('session-secret-at-least-32-characters', now);
    const tampered = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;

    assert.equal(await verifyTrialSession(tampered, 'session-secret-at-least-32-characters', now), false);
    assert.equal(await verifyTrialSession(token, 'different-session-secret-32-characters', now), false);
  });

  it('limits anonymous access attempts within a fixed window', () => {
    const limiter = new FixedWindowRateLimiter(2, 60_000);
    assert.equal(limiter.take('127.0.0.1', 1_000), true);
    assert.equal(limiter.take('127.0.0.1', 2_000), true);
    assert.equal(limiter.take('127.0.0.1', 3_000), false);
    assert.equal(limiter.take('127.0.0.1', 61_001), true);
  });

  it('rejects oversized access request bodies', () => {
    assert.equal(isTrialRequestBodyAllowed('128'), true);
    assert.equal(isTrialRequestBodyAllowed('2048'), false);
  });

  it('stops reading chunked request bodies after the byte limit', async () => {
    const oversized = new Request('http://localhost/api/session', {
      method: 'POST',
      body: JSON.stringify({ accessCode: 'x'.repeat(2048) }),
    });
    const normal = new Request('http://localhost/api/session', {
      method: 'POST',
      body: JSON.stringify({ accessCode: 'ok' }),
    });

    assert.equal((await readJsonBodyWithinLimit(oversized)).ok, false);
    assert.deepEqual((await readJsonBodyWithinLimit(normal)).value, { accessCode: 'ok' });
  });
});
