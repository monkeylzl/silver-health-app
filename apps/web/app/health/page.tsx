import Link from 'next/link';
import { apiBaseUrl, defaultElderUserId } from '../../lib/config';
import { DataSourceNotice, EmptyState, PageHeader, StatCard, pageStyles } from '../ui/page-kit';

type MetricRecord = {
  id: string;
  metricType: 'blood_pressure' | 'blood_glucose' | 'weight';
  systolic?: number | null;
  diastolic?: number | null;
  glucoseValue?: number | null;
  weightKg?: number | null;
  measuredAt: string;
};

type MedicationReminder = {
  id: string;
  medicineName: string;
  dosageText: string;
  remindTime: string;
  enabled: boolean;
};

const mockMetrics: MetricRecord[] = [
  { id: 'metric-1', metricType: 'blood_pressure', systolic: 128, diastolic: 78, measuredAt: '2026-03-25T08:30:00.000Z' },
  { id: 'metric-2', metricType: 'blood_glucose', glucoseValue: 6.2, measuredAt: '2026-03-24T23:30:00.000Z' },
];

const mockReminders: MedicationReminder[] = [
  { id: 'med-1', medicineName: '氨氯地平', dosageText: '早餐后 1 片', remindTime: '08:00', enabled: true },
  { id: 'med-2', medicineName: '二甲双胍', dosageText: '晚餐后 1 片', remindTime: '18:30', enabled: true },
];

function formatMetric(metric: MetricRecord | undefined) {
  if (!metric) return '暂无指标';
  if (metric.metricType === 'blood_pressure') return `${metric.systolic ?? '-'} / ${metric.diastolic ?? '-'} mmHg`;
  if (metric.metricType === 'blood_glucose') return `${metric.glucoseValue ?? '-'} mmol/L`;
  return `${metric.weightKg ?? '-'} kg`;
}

async function safeFetchArray<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
    throw new Error(payload?.message || 'fetch failed');
  }
  return payload.data as T[];
}

async function getHealthData() {
  if (!defaultElderUserId) {
    return {
      source: 'mock' as const,
      note: '当前没有配置默认老人档案，先展示演示健康数据。',
      metrics: mockMetrics,
      reminders: mockReminders,
    };
  }

  try {
    const [metrics, reminders] = await Promise.all([
      safeFetchArray<MetricRecord>(`${apiBaseUrl}/api/metrics/elder/${defaultElderUserId}`),
      safeFetchArray<MedicationReminder>(`${apiBaseUrl}/api/medications/elder/${defaultElderUserId}`),
    ]);

    return { source: 'api' as const, metrics, reminders };
  } catch (error) {
    return {
      source: 'mock' as const,
      note: error instanceof Error ? `暂时没拿到完整健康数据，先用演示数据保持可用：${error.message}` : '暂时没拿到完整健康数据。',
      metrics: mockMetrics,
      reminders: mockReminders,
    };
  }
}

export default async function HealthPage() {
  const { source, note, metrics, reminders } = await getHealthData();
  const latestMetric = metrics[0];
  const enabledReminderCount = reminders.filter((item) => item.enabled).length;

  return (
    <main className="app-shell app-shell--tabbed" style={pageStyles.main}>
      <PageHeader
        title="健康"
        description="这里集中放健康指标和用药提醒。录入后，家属端看板和周报会继续使用这些数据。"
      />

      <DataSourceNotice
        source={source}
        fallbackNote={note}
        apiLabel="健康中心已接入真实 API，可用于线上试用。"
        mockLabel="当前使用演示健康数据；远程 API 配置完成后会自动切回真实数据。"
      />

      <section className="stat-grid" style={pageStyles.statGrid}>
        <StatCard label="最近指标" value={formatMetric(latestMetric)} />
        <StatCard label="指标记录" value={`${metrics.length} 条`} />
        <StatCard label="启用提醒" value={`${enabledReminderCount} 条`} />
        <StatCard label="演示账号" value={defaultElderUserId ? '已配置' : '待配置'} />
      </section>

      <section className="quick-action-grid">
        <Link className="action-card action-card--primary" href="/elder/metrics">
          <strong>录入健康指标</strong>
          <span>血压、血糖、体重都从这里补。</span>
        </Link>
        <Link className="action-card" href="/elder/medication">
          <strong>管理用药提醒</strong>
          <span>补充常用药和提醒时间。</span>
        </Link>
      </section>

      <section className="list-section" style={pageStyles.listSection}>
        <article className="surface-card" style={pageStyles.card}>
          <h2 style={{ marginTop: 0 }}>最近指标</h2>
          {metrics.length > 0 ? (
            metrics.slice(0, 3).map((metric) => (
              <p key={metric.id} style={{ color: '#475467', margin: '0 0 10px' }}>
                {formatMetric(metric)} · {new Date(metric.measuredAt).toLocaleString('zh-CN')}
              </p>
            ))
          ) : (
            <EmptyState title="暂无指标记录" description="先录入一条指标，家属端就能看到联动摘要。" />
          )}
        </article>

        <article className="surface-card" style={pageStyles.card}>
          <h2 style={{ marginTop: 0 }}>用药提醒</h2>
          {reminders.length > 0 ? (
            reminders.slice(0, 3).map((item) => (
              <p key={item.id} style={{ color: '#475467', margin: '0 0 10px' }}>
                {item.medicineName} · {item.dosageText} · {item.remindTime}
              </p>
            ))
          ) : (
            <EmptyState title="暂无用药提醒" description="补一条常用药提醒，让健康中心更完整。" />
          )}
        </article>
      </section>
    </main>
  );
}
