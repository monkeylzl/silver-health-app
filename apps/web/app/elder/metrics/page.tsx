import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { ChecklistNotice, DataSourceNotice, DemoStepNotice, EmptyState, PageHeader, StatCard, pageStyles } from '../../ui/page-kit';
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
  family: '家属补录',
};

const glucosePeriodLabelMap: Record<string, string> = {
  before_breakfast: '早餐前',
  after_breakfast: '早餐后',
  before_lunch: '午餐前',
  after_lunch: '午餐后',
  before_dinner: '晚餐前',
  after_dinner: '晚餐后',
};

function formatMetricValue(metric: MetricRecord) {
  if (metric.metricType === 'blood_pressure') {
    return `${metric.systolic ?? '-'} / ${metric.diastolic ?? '-'} mmHg · 脉搏 ${metric.pulse ?? '-'} 次/分`;
  }

  if (metric.metricType === 'blood_glucose') {
    const glucosePeriodLabel = metric.glucosePeriodType
      ? glucosePeriodLabelMap[metric.glucosePeriodType] ?? metric.glucosePeriodType
      : '';

    return `${metric.glucoseValue ?? '-'} mmol/L${glucosePeriodLabel ? ` · ${glucosePeriodLabel}` : ''}`;
  }

  return `${metric.weightKg ?? '-'} kg`;
}

async function getMetricRecords(): Promise<{ metrics: MetricRecord[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      metrics: mockMetrics,
      source: 'mock',
      note: '当前没读到默认老人档案，所以先放演示指标，保证“录入后马上回看”这段还能讲。',
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
      note: error instanceof Error ? `刚才没拿到真实指标，先用演示数据继续录入和讲解：${error.message}` : '刚才没拿到真实指标，先用演示数据继续录入和讲解。',
    };
  }
}

export default async function Page() {
  const { metrics, source, note } = await getMetricRecords();

  return (
    <main className="app-shell" style={pageStyles.main}>
      <PageHeader
        title="健康指标录入"
        description="这一步重点不是展示一堆记录，而是说明：老人刚录入的数据，马上就会进入后续家属查看与周报汇总。"
      />

      <DemoStepNotice
        step="演示第 3 步"
        current="建议现场补一条当天指标，再让观众看到它出现在下方列表里。"
        next="录入完成后切到“用药提醒”，把日常管理信息补全。"
      />

      <DataSourceNotice source={source} fallbackNote={note} mockLabel="当前先用演示指标把“录入后立即回看”的体验讲完整；真实 API 一恢复，这里会自动换成真实记录。" />

      <ChecklistNotice
        title="这一页建议顺手讲清楚"
        items={[
          '先交代顶部接入状态，再补 1 条当天指标，观众更容易理解这不是静态页面。',
          '补录后立刻回看列表，强调这些记录会继续进入家属看板和周报。',
          '下一页切到“用药提醒”，把老人侧日常管理补完整。',
        ]}
      />

      <MetricForm />

      <section className="stat-grid" style={{ ...pageStyles.statGrid, margin: '24px 0' }}>
        <StatCard label="当前接入状态" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="最近记录数" value={`${metrics.length} 条`} />
      </section>

      {metrics.length === 0 ? (
        <EmptyState title="暂时还没有指标记录" description="可以先录入一条血压、血糖或体重数据，让演示链路从“录入”到“列表回显”形成完整闭环。" />
      ) : (
        <section className="list-section" style={pageStyles.listSection}>
          {metrics.map((metric) => (
            <article key={metric.id} className="surface-card" style={pageStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{metricTypeLabelMap[metric.metricType]}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={pageStyles.tag}>{createdByRoleLabelMap[metric.createdByRole]}</span>
                  </div>
                </div>
                <div style={{ color: '#667085' }}>{new Date(metric.measuredAt).toLocaleString('zh-CN')}</div>
              </div>

              <p style={{ color: '#101828', margin: '0 0 8px', fontWeight: 600 }}>{formatMetricValue(metric)}</p>
              <p style={{ color: '#475467', margin: 0 }}>这些记录会继续进入家属看板与周报回顾，不需要重复整理。</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
