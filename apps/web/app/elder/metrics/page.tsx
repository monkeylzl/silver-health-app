import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { MetricForm } from './metric-form';

type MetricRecord = {
  id: string;
  metricType: 'blood_pressure' | 'blood_glucose' | 'weight';
  systolic?: number | null;
  diastolic?: number | null;
  pulse?: number | null;
  glucoseValue?: number | null;
  glucosePeriodType?: string | null;
  weightKg?: number | null;
  measuredAt: string;
  createdByRole: 'elder' | 'family';
};

const mockMetrics: MetricRecord[] = [
  {
    id: 'metric-1',
    metricType: 'blood_pressure',
    systolic: 128,
    diastolic: 78,
    pulse: 72,
    measuredAt: '2026-03-25T08:30:00.000Z',
    createdByRole: 'elder',
  },
  {
    id: 'metric-2',
    metricType: 'blood_glucose',
    glucoseValue: 6.2,
    glucosePeriodType: 'after_breakfast',
    measuredAt: '2026-03-24T23:30:00.000Z',
    createdByRole: 'family',
  },
  {
    id: 'metric-3',
    metricType: 'weight',
    weightKg: 61.5,
    measuredAt: '2026-03-23T23:30:00.000Z',
    createdByRole: 'elder',
  },
];

const metricTypeLabelMap: Record<MetricRecord['metricType'], string> = {
  blood_pressure: '血压',
  blood_glucose: '血糖',
  weight: '体重',
};

const createdByRoleLabelMap: Record<MetricRecord['createdByRole'], string> = {
  elder: '老人录入',
  family: '家属录入',
};

function formatMetricValue(metric: MetricRecord) {
  if (metric.metricType === 'blood_pressure') {
    return `${metric.systolic ?? '-'} / ${metric.diastolic ?? '-'} mmHg · 脉搏 ${metric.pulse ?? '-'} 次/分`;
  }

  if (metric.metricType === 'blood_glucose') {
    return `${metric.glucoseValue ?? '-'} mmol/L${metric.glucosePeriodType ? ` · ${metric.glucosePeriodType}` : ''}`;
  }

  return `${metric.weightKg ?? '-'} kg`;
}

async function getMetricRecords(): Promise<{ metrics: MetricRecord[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      metrics: mockMetrics,
      source: 'mock',
      note: '当前未设置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID，先展示 mock 指标记录。',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/metrics/elder/${defaultElderUserId}`, {
      cache: 'no-store',
    });
    const payload = await response.json();

    if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || '加载健康指标失败');
    }

    return {
      metrics: payload.data,
      source: 'api',
    };
  } catch (error) {
    return {
      metrics: mockMetrics,
      source: 'mock',
      note: error instanceof Error ? `API 加载失败，当前回退到 mock 数据：${error.message}` : 'API 加载失败，当前回退到 mock 数据。',
    };
  }
}

export default async function Page() {
  const { metrics, source, note } = await getMetricRecords();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>健康指标录入</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前先推进 MVP 第三条主链路：指标查看与录入。现在页面已经同时具备“录入表单”和“最近记录列表”两部分。
        </p>
      </div>

      <MetricForm />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>当前数据源</div>
          <strong>{source === 'api' ? '真实 API' : 'Mock 回退'}</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>最近记录数</div>
          <strong>{metrics.length} 条</strong>
        </div>
      </section>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <section style={{ display: 'grid', gap: 16 }}>
        {metrics.map((metric) => (
          <article key={metric.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{metricTypeLabelMap[metric.metricType]}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {createdByRoleLabelMap[metric.createdByRole]}
                  </span>
                </div>
              </div>
              <div style={{ color: '#667085' }}>{new Date(metric.measuredAt).toLocaleString('zh-CN')}</div>
            </div>

            <p style={{ color: '#101828', margin: '0 0 8px', fontWeight: 600 }}>{formatMetricValue(metric)}</p>
            <p style={{ color: '#475467', margin: 0 }}>后续这里会继续补充趋势图表和异常提示。</p>
          </article>
        ))}
      </section>
    </main>
  );
}
