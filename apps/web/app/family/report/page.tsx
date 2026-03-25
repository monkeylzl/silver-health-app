import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

type WeeklyReport = {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  exerciseCompletionRate?: number | null;
  medicationCompletionRate?: number | null;
  metricRecordCount: number;
  summaryText?: string | null;
  suggestionList?: string[] | null;
};

const mockReports: WeeklyReport[] = [
  {
    id: 'report-1',
    weekStartDate: '2026-03-18T00:00:00.000Z',
    weekEndDate: '2026-03-24T00:00:00.000Z',
    exerciseCompletionRate: 82,
    medicationCompletionRate: 95,
    metricRecordCount: 6,
    summaryText: '本周任务总体完成较好，血压记录稳定，用药依从性较高。',
    suggestionList: ['继续保持晨间散步', '关注晚餐后血糖记录'],
  },
  {
    id: 'report-2',
    weekStartDate: '2026-03-11T00:00:00.000Z',
    weekEndDate: '2026-03-17T00:00:00.000Z',
    exerciseCompletionRate: 70,
    medicationCompletionRate: 88,
    metricRecordCount: 5,
    summaryText: '运动执行略有波动，但整体健康记录习惯在改善。',
    suggestionList: ['增加午后轻活动', '补齐周末体重记录'],
  },
];

async function getReports(): Promise<{ reports: WeeklyReport[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      reports: mockReports,
      source: 'mock',
      note: '当前未设置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID，先展示 mock 家属周报。',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/reports/elder/${defaultElderUserId}`, {
      cache: 'no-store',
    });
    const payload = await response.json();

    if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || '加载家属周报失败');
    }

    return {
      reports: payload.data,
      source: 'api',
    };
  } catch (error) {
    return {
      reports: mockReports,
      source: 'mock',
      note: error instanceof Error ? `API 加载失败，当前回退到 mock 数据：${error.message}` : 'API 加载失败，当前回退到 mock 数据。',
    };
  }
}

function formatPercent(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return '暂无';

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return '暂无';

  return `${numericValue}%`;
}

export default async function Page() {
  const { reports, source, note } = await getReports();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>家属周报</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前先做家属周报第一页版，把近期周报摘要、建议和核心完成率集中展示，方便家属快速回顾一周情况。
        </p>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>当前数据源</div>
          <strong>{source === 'api' ? '真实 API' : 'Mock 回退'}</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>周报数量</div>
          <strong>{reports.length} 份</strong>
        </div>
      </section>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <section style={{ display: 'grid', gap: 16 }}>
        {reports.map((report) => (
          <article key={report.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>
                  {new Date(report.weekStartDate).toLocaleDateString('zh-CN')} - {new Date(report.weekEndDate).toLocaleDateString('zh-CN')}
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    运动完成率：{formatPercent(report.exerciseCompletionRate)}
                  </span>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    用药完成率：{formatPercent(report.medicationCompletionRate)}
                  </span>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    指标记录：{report.metricRecordCount} 次
                  </span>
                </div>
              </div>
            </div>

            <p style={{ color: '#475467', margin: '0 0 12px' }}>{report.summaryText || '暂无周报摘要。'}</p>

            <div>
              <strong style={{ display: 'block', marginBottom: 8 }}>建议</strong>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#475467' }}>
                {(report.suggestionList ?? []).length > 0 ? (
                  report.suggestionList!.map((suggestion, index) => (
                    <li key={`${report.id}-${index}`} style={{ marginBottom: 6 }}>
                      {suggestion}
                    </li>
                  ))
                ) : (
                  <li>暂无建议</li>
                )}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
