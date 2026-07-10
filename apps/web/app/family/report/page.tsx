import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { ChecklistNotice, DataSourceNotice, DemoStepNotice, EmptyState, InlineNotice, PageHeader, StatCard, pageStyles } from '../../ui/page-kit';
import { GenerateReportButton } from './generate-report-button';

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
      note: '当前没读到默认老人档案，所以先展示演示周报，方便把“一周回顾”这层价值讲完。',
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
      note: error instanceof Error ? `刚才没拿到真实周报，先用演示周报继续讲解：${error.message}` : '刚才没拿到真实周报，先用演示周报继续讲解。',
    };
  }
}

function formatPercent(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return null;

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return null;

  return numericValue;
}

function toPercentText(value?: number | string | null) {
  const numericValue = formatPercent(value);
  return numericValue === null ? '暂无' : `${numericValue}%`;
}

function buildWeeklyHeadline(report: WeeklyReport) {
  const exerciseRate = formatPercent(report.exerciseCompletionRate);
  const medicationRate = formatPercent(report.medicationCompletionRate);

  const stableParts: string[] = [];
  const attentionParts: string[] = [];

  if (medicationRate !== null) {
    if (medicationRate >= 90) {
      stableParts.push('用药执行比较稳定');
    } else if (medicationRate < 80) {
      attentionParts.push('用药执行还有提升空间');
    }
  }

  if (exerciseRate !== null) {
    if (exerciseRate >= 80) {
      stableParts.push('运动习惯在持续保持');
    } else if (exerciseRate < 75) {
      attentionParts.push('运动节奏有点波动');
    }
  }

  if (report.metricRecordCount >= 5) {
    stableParts.push('本周记录比较完整');
  } else if (report.metricRecordCount <= 2) {
    attentionParts.push('本周记录偏少，建议补齐');
  }

  return {
    recap: stableParts.length > 0 ? stableParts.join('，') : '本周整体节奏基本平稳',
    focus: attentionParts.length > 0 ? attentionParts.join('，') : '下周继续保持当前节奏',
  };
}

export default async function Page() {
  const { reports, source, note } = await getReports();
  const latestReport = reports[0];
  const latestHeadline = latestReport ? buildWeeklyHeadline(latestReport) : null;

  return (
    <main className="app-shell" style={pageStyles.main}>
      <PageHeader
        title="家属周报"
        description="演示最后落在这里：把老人一周的执行情况、指标记录和建议集中给家属看，说明这不是一次性记录，而是持续陪伴。"
      />

      <DemoStepNotice
        step="演示第 6 步"
        current="这一页适合用来做收尾：总结老人这一周做了什么、哪些地方稳定、接下来还需要关注什么。"
        next="如果对方追问家属如何加入，再补讲“家属绑定”。"
      />

      <DataSourceNotice source={source} fallbackNote={note} mockLabel="当前先用演示周报把回顾价值讲完整；真实 API 一恢复，这里会自动换回真实周报。" />

      <ChecklistNotice
        title="这一页建议顺手讲清楚"
        items={[
          '先看顶部接入状态，再用“本周一句话总结”做演示收尾，不要只停留在列表展示。',
          '强调系统不只是记录当天，还会把老人这一周的执行情况沉淀成家属能读懂的回顾。',
          '如果对方继续追问关系建立流程，再补讲“家属绑定”即可。',
        ]}
      />

      {source === 'api' && defaultElderUserId ? (
        <GenerateReportButton apiBaseUrl={apiBaseUrl} elderUserId={defaultElderUserId} />
      ) : null}

      <section className="stat-grid" style={pageStyles.statGrid}>
        <StatCard label="当前接入状态" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="周报数量" value={`${reports.length} 份`} />
      </section>

      {latestHeadline ? (
        <InlineNotice tone="success">
          <strong>本周一句话总结</strong>
          <div style={{ marginTop: 6 }}>{latestHeadline.recap}。</div>
          <div style={{ marginTop: 6, opacity: 0.92 }}>下周重点关注：{latestHeadline.focus}。</div>
          <div style={{ marginTop: 6, opacity: 0.92 }}>收尾就讲这一句：系统不只记录今天，还会把这一周沉淀成家属看得懂的回顾。</div>
        </InlineNotice>
      ) : null}

      {reports.length === 0 ? (
        <EmptyState title="暂时还没有周报" description="建议先补一份周报数据，确保家属端能展示完整的回顾与建议信息。" />
      ) : (
        <section className="list-section" style={pageStyles.listSection}>
          {reports.map((report) => {
            const headline = buildWeeklyHeadline(report);

            return (
              <article key={report.id} className="surface-card" style={pageStyles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div>
                    <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>
                      {new Date(report.weekStartDate).toLocaleDateString('zh-CN')} - {new Date(report.weekEndDate).toLocaleDateString('zh-CN')}
                    </h2>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={pageStyles.tag}>运动完成率：{toPercentText(report.exerciseCompletionRate)}</span>
                      <span style={pageStyles.tag}>用药完成率：{toPercentText(report.medicationCompletionRate)}</span>
                      <span style={pageStyles.tag}>指标记录：{report.metricRecordCount} 次</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 12, padding: '12px 14px', borderRadius: 12, background: '#f8f9fc', color: '#344054' }}>
                  <strong style={{ display: 'block', marginBottom: 6 }}>这一周可以怎么讲</strong>
                  <div>本周结论：{headline.recap}。</div>
                  <div style={{ marginTop: 4 }}>下周关注：{headline.focus}。</div>
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
            );
          })}
        </section>
      )}
    </main>
  );
}
