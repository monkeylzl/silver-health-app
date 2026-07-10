import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isInternalAppKeyValid } from '../../apps/api/src/security/internal-key.ts';
import { buildTaskStatusUpdate, isTaskStatusUnchanged } from '../../apps/api/src/modules/task/task-status.ts';
import { validateMetricPayload } from '../../apps/api/src/modules/metric/metric-validation.ts';
import { recordBelongsToElder } from '../../apps/api/src/security/record-ownership.ts';

describe('internal api key validation', () => {
  it('accepts the configured key and rejects missing or incorrect keys', () => {
    const expected = 'internal-key-at-least-32-characters';

    assert.equal(isInternalAppKeyValid(expected, expected), true);
    assert.equal(isInternalAppKeyValid(undefined, expected), false);
    assert.equal(isInternalAppKeyValid('wrong-key', expected), false);
    assert.equal(isInternalAppKeyValid(expected, undefined), false);
  });
});

describe('task status updates', () => {
  it('sets completedAt when a task is completed', () => {
    const completedAt = new Date('2026-07-10T08:00:00.000Z');

    assert.deepEqual(buildTaskStatusUpdate('done', completedAt), {
      status: 'done',
      completedAt,
    });
  });

  it('clears completedAt when completion is undone', () => {
    assert.deepEqual(buildTaskStatusUpdate('todo', new Date()), {
      status: 'todo',
      completedAt: null,
    });
  });

  it('rejects unsupported status transitions', () => {
    assert.throws(() => buildTaskStatusUpdate('skipped' as 'done', new Date()), /unsupported task status/);
  });

  it('does not rewrite completedAt when done is repeated', () => {
    assert.equal(isTaskStatusUnchanged('done', new Date('2026-07-10T08:00:00Z'), 'done'), true);
    assert.equal(isTaskStatusUnchanged('todo', null, 'done'), false);
  });
});

describe('fixed elder record ownership', () => {
  it('allows only records belonging to the server-selected elder', () => {
    assert.equal(recordBelongsToElder('elder-a', 'elder-a'), true);
    assert.equal(recordBelongsToElder('elder-b', 'elder-a'), false);
    assert.equal(recordBelongsToElder('elder-a', undefined), false);
  });
});

describe('health metric semantics', () => {
  it('accepts only the values required by the selected metric type', () => {
    assert.equal(validateMetricPayload({ metricType: 'blood_pressure', systolic: 128, diastolic: 78 }), null);
    assert.match(validateMetricPayload({ metricType: 'blood_pressure' }) ?? '', /收缩压和舒张压/);
    assert.match(validateMetricPayload({ metricType: 'weight', weightKg: 68, systolic: 120 }) ?? '', /不匹配/);
    assert.equal(validateMetricPayload({ metricType: 'blood_glucose', glucoseValue: 6.1 }), null);
  });
});
