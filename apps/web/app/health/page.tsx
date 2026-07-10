import Link from 'next/link';
import { Activity, BellRing, Plus } from 'lucide-react';
import { formatDateTime, formatMetricValue, getMedications, getMetrics } from '../../lib/app-data';
import { AppPageHeader, EmptyState, ErrorState, SectionHeader } from '../ui/app-components';
import { MetricTrend } from '../ui/metric-trend';

const metricLabels = { blood_pressure: '血压', blood_glucose: '血糖', weight: '体重' } as const;

export default async function HealthPage() {
  try {
    const [metrics, medications] = await Promise.all([getMetrics(), getMedications()]);
    const latestByType = (['blood_pressure', 'blood_glucose', 'weight'] as const).map((type) => metrics.find((metric) => metric.metricType === type));
    const activeMedications = medications.filter((item) => item.enabled).sort((a, b) => a.remindTime.localeCompare(b.remindTime));

    return (
      <main className="app-shell">
        <AppPageHeader
          title="健康"
          description="查看最近指标和今天的用药安排。"
          action={<Link href="/health/metrics/new" className="button button--primary"><Plus aria-hidden="true" />记录指标</Link>}
        />

        <section className="metric-grid" aria-label="最近健康指标">
          {latestByType.map((metric, index) => {
            const type = (['blood_pressure', 'blood_glucose', 'weight'] as const)[index];
            return (
              <article className="metric-tile" key={type}>
                <span className="metric-tile__label">{metricLabels[type]}</span>
                <strong>{formatMetricValue(metric)}</strong>
                <small>{metric ? formatDateTime(metric.measuredAt) : '等待首次记录'}</small>
              </article>
            );
          })}
        </section>

        <div className="dashboard-grid">
          <section className="app-card trend-panel">
            <SectionHeader title="最近血压趋势" />
            <MetricTrend metrics={metrics} />
            <Link className="button button--secondary button--block" href="/health/metrics/new" data-touch-target>
              <Activity aria-hidden="true" />记录新指标
            </Link>
          </section>

          <section>
            <SectionHeader title="今日用药" href="/health/medications" actionLabel="管理提醒" />
            {activeMedications.length > 0 ? (
              <div className="medication-list">
                {activeMedications.slice(0, 3).map((item) => (
                  <article className="medication-row" key={item.id}>
                    <div><h3>{item.medicineName}</h3><p>{item.dosageText}</p></div>
                    <span className="time-badge"><BellRing aria-hidden="true" />{item.remindTime}</span>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="还没有用药提醒" description="新增提醒后会按时间显示在这里。" />
            )}
          </section>
        </div>
      </main>
    );
  } catch (error) {
    return <main className="app-shell"><AppPageHeader title="健康" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
