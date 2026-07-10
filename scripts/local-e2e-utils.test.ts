import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLocalWriteE2EConfig, parseSeededDemoIds } from './local-e2e-utils.ts';

test('parses demo ids from seed output', () => {
  const ids = parseSeededDemoIds(`
Demo data ready.
Elder user id: elder_123
Family user id: family_456
Recommended NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=elder_123
`);

  assert.deepEqual(ids, {
    elderUserId: 'elder_123',
    familyUserId: 'family_456',
  });
});

test('builds isolated local write e2e endpoints and environment', () => {
  const config = buildLocalWriteE2EConfig(
    {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/silver_health',
      E2E_LOCAL_API_PORT: '4101',
      E2E_LOCAL_WEB_PORT: '4100',
    },
    { elderUserId: 'elder_123', familyUserId: 'family_456' },
  );

  assert.equal(config.apiUrl, 'http://127.0.0.1:4101');
  assert.equal(config.webUrl, 'http://127.0.0.1:4100');
  assert.equal(config.env.NEXT_PUBLIC_API_BASE_URL, 'http://127.0.0.1:4101');
  assert.equal(config.env.NEXT_PUBLIC_DEFAULT_ELDER_USER_ID, 'elder_123');
  assert.equal(config.env.E2E_ELDER_USER_ID, 'elder_123');
  assert.equal(config.env.E2E_API_BASE_URL, 'http://127.0.0.1:4101');
  assert.equal(config.env.E2E_BASE_URL, 'http://127.0.0.1:4100');
});

test('requires an elder id in seed output', () => {
  assert.throws(() => parseSeededDemoIds('Demo data ready.'), /elder user id/i);
});
