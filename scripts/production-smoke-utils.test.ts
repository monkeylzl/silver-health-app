import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildSmokeConfig,
  containsAllText,
  joinUrl,
  summarizeCollectionPayload,
} from './production-smoke-utils.ts';

describe('production smoke utils', () => {
  it('normalizes configured URLs and defaults', () => {
    const config = buildSmokeConfig({
      PRODUCTION_WEB_URL: 'https://example.com/',
      PRODUCTION_API_BASE_URL: 'https://api.example.com/',
      PRODUCTION_ELDER_USER_ID: 'elder-1',
      PRODUCTION_TRIAL_ACCESS_CODE: 'trial-code',
      PRODUCTION_INTERNAL_API_KEY: 'internal-key',
    });

    assert.equal(config.webUrl, 'https://example.com');
    assert.equal(config.apiBaseUrl, 'https://api.example.com');
    assert.equal(config.elderUserId, 'elder-1');
    assert.equal(config.trialAccessCode, 'trial-code');
    assert.equal(config.internalApiKey, 'internal-key');
  });

  it('joins URL path segments without duplicate slashes', () => {
    assert.equal(joinUrl('https://example.com/', '/health'), 'https://example.com/health');
    assert.equal(joinUrl('https://example.com', 'family/dashboard'), 'https://example.com/family/dashboard');
  });

  it('checks required page text as a single missing-list operation', () => {
    assert.deepEqual(containsAllText('今日 健康 家属 我的 当前接入：真实 API', ['今日', '我的']), []);
    assert.deepEqual(containsAllText('今日 健康', ['今日', '我的']), ['我的']);
  });

  it('summarizes api list payloads and rejects non-list data', () => {
    assert.equal(summarizeCollectionPayload({ code: 0, message: 'ok', data: [{ id: 'a' }] }, 'tasks'), 1);
    assert.throws(
      () => summarizeCollectionPayload({ code: 0, message: 'ok', data: { id: 'a' } }, 'tasks'),
      /tasks expected data to be an array/,
    );
  });
});
