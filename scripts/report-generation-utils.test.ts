import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildWeeklyReportSummary,
  getCurrentWeekRange,
} from '../apps/api/src/modules/report/report-generation.ts';

describe('weekly report generation utils', () => {
  it('uses the Asia/Shanghai current week from Monday to Sunday', () => {
    const range = getCurrentWeekRange(new Date('2026-07-10T13:00:00.000Z'));

    assert.equal(range.start.toISOString(), '2026-07-06T00:00:00.000Z');
    assert.equal(range.end.toISOString(), '2026-07-12T00:00:00.000Z');
    assert.equal(range.metricStart.toISOString(), '2026-07-06T00:00:00.000Z');
    assert.equal(range.metricEnd.toISOString(), '2026-07-12T23:59:59.999Z');
  });

  it('summarizes active tasks, metrics, and reminders for family-readable reports', () => {
    const summary = buildWeeklyReportSummary(
      [{ status: 'done' }, { status: 'todo' }, { status: 'done' }, { status: 'todo' }],
      4,
      [{ medicineName: '阿司匹林' }, { medicineName: '氨氯地平' }, { medicineName: '二甲双胍' }],
    );

    assert.equal(summary.exerciseCompletionRate, 50);
    assert.equal(summary.medicationCompletionRate, 100);
    assert.equal(summary.summaryText, '本周任务已完成 2/4 项，新增指标 4 次，启用提醒 3 条（阿司匹林、氨氯地平、二甲双胍）。');
    assert.deepEqual(summary.suggestionList, [
      '优先提醒未完成任务，避免当天事项遗漏。',
      '指标记录比较完整，下周继续保持固定时间记录。',
      '继续关注阿司匹林、氨氯地平等用药提醒。',
    ]);
  });

  it('keeps empty data understandable instead of inventing percentages', () => {
    const summary = buildWeeklyReportSummary([], 0, []);

    assert.equal(summary.exerciseCompletionRate, null);
    assert.equal(summary.medicationCompletionRate, null);
    assert.equal(summary.summaryText, '本周任务已完成 0/0 项，新增指标 0 次，启用提醒 0 条。');
    assert.deepEqual(summary.suggestionList, [
      '本周任务完成节奏不错，可以继续保持。',
      '指标记录偏少，下周建议固定一个时间补齐。',
      '建议先补充常用药提醒，方便家属持续跟进。',
    ]);
  });
});
