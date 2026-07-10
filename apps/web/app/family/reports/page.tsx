import { getReports } from '../../../lib/app-data';
import { BackHeader, EmptyState, ErrorState } from '../../ui/app-components';
import { ReportGenerateButton } from '../../ui/report-generate-button';

function percent(value?: number | null) {
  return value === null || value === undefined ? '暂无' : `${Number(value)}%`;
}

export default async function ReportsPage() {
  try {
    const reports = await getReports();
    return (
      <main className="app-shell app-shell--narrow">
        <BackHeader href="/family" title="健康周报" />
        <ReportGenerateButton />
        {reports.length === 0 ? <EmptyState title="还没有周报" description="生成报告后，可以在这里查看一周回顾。" /> : (
          <div className="report-list">
            {reports.map((report) => (
              <article className="app-card report-card" key={report.id}>
                <span className="eyebrow-label">{new Date(report.weekStartDate).toLocaleDateString('zh-CN')} - {new Date(report.weekEndDate).toLocaleDateString('zh-CN')}</span>
                <h2>{report.summaryText || '本周健康回顾'}</h2>
                <div className="report-stats"><span>运动完成 <strong>{percent(report.exerciseCompletionRate)}</strong></span><span>用药完成 <strong>{percent(report.medicationCompletionRate)}</strong></span><span>指标记录 <strong>{report.metricRecordCount} 次</strong></span></div>
                {(report.suggestionList ?? []).length > 0 ? <ul>{report.suggestionList!.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul> : null}
              </article>
            ))}
          </div>
        )}
      </main>
    );
  } catch (error) {
    return <main className="app-shell app-shell--narrow"><BackHeader href="/family" title="健康周报" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
