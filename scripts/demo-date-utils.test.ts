import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatLocalDate, getLocalDateOnly, getLocalDateTime, getWeekRange } from './demo-date-utils.ts';

describe('demo date utils', () => {
  const utcBeforeShanghaiMorning = new Date('2026-07-10T21:57:00.000Z');

  it('uses the Asia/Shanghai business date on UTC runners', () => {
    assert.equal(formatLocalDate(getLocalDateOnly(0, utcBeforeShanghaiMorning)), '2026-07-11');
    assert.equal(getLocalDateTime(0, 8, 30, utcBeforeShanghaiMorning).toISOString(), '2026-07-11T00:30:00.000Z');
  });

  it('builds complete weeks from the Shanghai business date', () => {
    const range = getWeekRange(1, utcBeforeShanghaiMorning);
    assert.equal(formatLocalDate(range.start), '2026-06-29');
    assert.equal(formatLocalDate(range.end), '2026-07-05');
  });
});
