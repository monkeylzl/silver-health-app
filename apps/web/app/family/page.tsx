import Link from 'next/link';
import { CalendarDays, ChevronRight, Link2, ShieldCheck } from 'lucide-react';
import { formatMetricValue, getBindings, getMedications, getMetrics, getReports, getTasks } from '../../lib/app-data';
import { AppPageHeader, ErrorState, ProgressBar, SectionHeader } from '../ui/app-components';
import { ReportGenerateButton } from '../ui/report-generate-button';

export default async function FamilyPage() {
  try {
    const [tasks, metrics, medications, reports, bindings] = await Promise.all([
      getTasks(), getMetrics(), getMedications(), getReports(), getBindings(),
    ]);
    const doneCount = tasks.filter((task) => task.status === 'done').length;
    const todoCount = tasks.filter((task) => task.status === 'todo').length;
    const latestMetric = metrics[0];
    const activeMedications = medications.filter((item) => item.enabled).length;
    const activeBinding = bindings.find((item) => item.status === 'active');
    const latestReport = reports[0];
    const summary = todoCount > 0
      ? `今天还有 ${todoCount} 项待完成，最近健康记录为 ${formatMetricValue(latestMetric)}。`
      : `今天的任务已经完成，最近健康记录为 ${formatMetricValue(latestMetric)}。`;

    return (
      <main className="app-shell">
        <AppPageHeader title="家人" description="先看近况，再决定是否需要提醒或跟进。" />

        <section className="summary-panel family-summary">
          <span className="summary-panel__label">今日近况</span>
          <h2>{todoCount > 0 ? '还有事项需要关注' : '今天整体进展平稳'}</h2>
          <p>{summary}</p>
          <ProgressBar value={doneCount} max={tasks.length} label={`任务完成 ${doneCount}/${tasks.length}`} />
          <div className="family-facts">
            <span><strong>{activeMedications}</strong> 条用药提醒生效</span>
            <span><strong>{metrics.length}</strong> 条健康记录</span>
          </div>
        </section>

        <div className="dashboard-grid">
          <section>
            <SectionHeader title="今天需要关注" />
            <div className="task-list">
              {tasks.filter((task) => task.status === 'todo').slice(0, 3).map((task) => (
                <article className="task-row" key={task.id}>
                  <div><h3>{task.title}</h3><p>{task.dueTime ? `${task.dueTime} 前完成` : task.description || '待完成'}</p></div>
                  <span className="attention-badge">待关注</span>
                </article>
              ))}
            </div>
          </section>

          <section className="settings-list">
            <Link className="settings-row" href="/family/reports" data-touch-target>
              <CalendarDays aria-hidden="true" /><div><strong>本周报告</strong><span>{latestReport?.summaryText || '查看一周健康与任务回顾'}</span></div><ChevronRight aria-hidden="true" />
            </Link>
            <div className="settings-row">
              {activeBinding ? <ShieldCheck aria-hidden="true" /> : <Link2 aria-hidden="true" />}
              <div><strong>家人绑定</strong><span>{activeBinding ? '关系已建立，数据正在同步' : '当前还没有生效的家人关系'}</span></div>
            </div>
            <ReportGenerateButton />
          </section>
        </div>
      </main>
    );
  } catch (error) {
    return <main className="app-shell"><AppPageHeader title="家人" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
