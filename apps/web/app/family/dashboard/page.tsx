import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { ChecklistNotice, DataSourceNotice, DemoStepNotice, EmptyState, InlineNotice, PageHeader, StatCard, pageStyles } from '../../ui/page-kit';

type TaskItem = {
  id: string;
  status: 'todo' | 'done' | 'skipped' | 'expired';
  title: string;
};

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

const mockTasks: TaskItem[] = [
  { id: 'task-1', title: '晨间散步 20 分钟', status: 'done' },
  { id: 'task-2', title: '记录今日血压', status: 'todo' },
  { id: 'task-3', title: '午间服药提醒', status: 'done' },
];

const mockMetrics: MetricRecord[] = [
  { id: 'metric-1', metricType: 'blood_pressure', systolic: 128, diastolic: 78, measuredAt: '2026-03-25T08:30:00.000Z' },
  { id: 'metric-2', metricType: 'blood_glucose', glucoseValue: 6.2, measuredAt: '2026-03-24T23:30:00.000Z' },
  { id: 'metric-3', metricType: 'weight', weightKg: 61.5, measuredAt: '2026-03-23T23:30:00.000Z' },
];

const mockReminders: MedicationReminder[] = [
  { id: 'med-1', medicineName: '氨氯地平', dosageText: '每日早晨 1 片', remindTime: '08:00', enabled: true },
  { id: 'med-2', medicineName: '二甲双胍', dosageText: '每日晚餐后 1 片', remindTime: '18:30', enabled: true },
];

function formatMetricSummary(metric: MetricRecord | undefined) {
  if (!metric) return '最近还没有新增指标记录';
  if (metric.metricType === 'blood_pressure') {
    return `最近血压：${metric.systolic ?? '-'} / ${metric.diastolic ?? '-'} mmHg`;
  }
  if (metric.metricType === 'blood_glucose') {
    return `最近血糖：${metric.glucoseValue ?? '-'} mmol/L`;
  }
  return `最近体重：${metric.weightKg ?? '-'} kg`;
}

function buildStatusNarrative(tasks: TaskItem[], latestMetric: MetricRecord | undefined, reminders: MedicationReminder[]) {
  const totalTasks = tasks.length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const enabledReminderCount = reminders.filter((item) => item.enabled).length;

  const progressPart = totalTasks > 0
    ? `今天任务已完成 ${doneCount}/${totalTasks}`
    : '今天还没有生成任务安排';
  const metricPart = latestMetric ? formatMetricSummary(latestMetric) : '最近还没有新的健康指标';
  const reminderPart = enabledReminderCount > 0
    ? `当前有 ${enabledReminderCount} 条提醒在生效`
    : '当前还没有启用中的用药提醒';
  const attentionPart = todoCount > 0
    ? `还剩 ${todoCount} 项待完成，家属可以优先提醒今天还没做完的事项。`
    : '今天关键事项基本都已完成，适合用来强调“家属省心”的效果。';

  return {
    summary: `${progressPart}；${metricPart}；${reminderPart}。`,
    attention: attentionPart,
  };
}

async function safeFetchArray<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
    throw new Error(payload?.message || 'fetch failed');
  }
  return payload.data as T[];
}

async function getDashboardData() {
  if (!defaultElderUserId) {
    return {
      source: 'mock' as const,
      note: '当前没读到默认老人档案，所以先展示演示摘要，避免家属页一打开就断链。',
      tasks: mockTasks,
      metrics: mockMetrics,
      reminders: mockReminders,
    };
  }

  try {
    const [tasks, metrics, reminders] = await Promise.all([
      safeFetchArray<TaskItem>(`${apiBaseUrl}/api/tasks/elder/${defaultElderUserId}`),
      safeFetchArray<MetricRecord>(`${apiBaseUrl}/api/metrics/elder/${defaultElderUserId}`),
      safeFetchArray<MedicationReminder>(`${apiBaseUrl}/api/medications/elder/${defaultElderUserId}`),
    ]);

    return {
      source: 'api' as const,
      tasks,
      metrics,
      reminders,
    };
  } catch (error) {
    return {
      source: 'mock' as const,
      note: error instanceof Error ? `刚才没拿到完整摘要，先用演示数据继续讲解：${error.message}` : '刚才没拿到完整摘要，先用演示数据继续讲解。',
      tasks: mockTasks,
      metrics: mockMetrics,
      reminders: mockReminders,
    };
  }
}

export default async function Page() {
  const { tasks, metrics, reminders, source, note } = await getDashboardData();
  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const latestMetric = metrics[0];
  const enabledReminderCount = reminders.filter((item) => item.enabled).length;
  const dashboardNarrative = buildStatusNarrative(tasks, latestMetric, reminders);

  return (
    <main className="app-shell" style={pageStyles.main}>
      <PageHeader
        title="家属看板"
        description="这里是演示从老人端切到家属端的关键一页：不用重复录入，家属就能直接看到老人今天的任务、指标和用药近况。"
      />

      <DemoStepNotice
        step="演示第 5 步"
        current="切到这一页时，重点强调前面老人端刚完成的动作，会自动沉淀成家属可看的摘要。"
        next="再进入“家属周报”，说明系统不仅能看当天，也能回顾一周。"
      />

      <DataSourceNotice source={source} fallbackNote={note} mockLabel="当前先用演示摘要把家属视角讲完整；真实 API 一恢复，这里会自动换回真实联动结果。" />

      <ChecklistNotice
        title="这一页建议顺手讲清楚"
        items={[
          '先看顶部接入状态，再强调家属端不需要重复录入，前面老人动作会自动汇总过来。',
          '优先讲“一句话近况”和“当前最该关注”，别一上来就逐块念数据。',
          '讲完当天摘要后，再切去“家属周报”说明系统还能持续回顾。',
        ]}
      />

      <section className="stat-grid" style={pageStyles.statGrid}>
        <StatCard label="当前接入状态" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="今日任务完成情况" value={`${doneCount} / ${tasks.length} 已完成`} />
        <StatCard label="待完成任务" value={`${todoCount} 项`} />
        <StatCard label="启用中的提醒" value={`${enabledReminderCount} 条`} />
      </section>

      <InlineNotice tone="success">
        <strong>一句话近况</strong>
        <div style={{ marginTop: 6 }}>{dashboardNarrative.summary}</div>
        <div style={{ marginTop: 6, opacity: 0.92 }}>家属当前最该关注：{dashboardNarrative.attention}</div>
        <div style={{ marginTop: 6, opacity: 0.92 }}>收尾就讲这一句：家属不用翻原始记录，先看这里就知道今天要不要跟进。</div>
      </InlineNotice>

      <section className="list-section" style={pageStyles.listSection}>
        <article className="surface-card" style={pageStyles.card}>
          <h2 style={{ marginTop: 0 }}>任务摘要</h2>
          {tasks.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#475467' }}>
              {tasks.slice(0, 5).map((task) => (
                <li key={task.id} style={{ marginBottom: 8 }}>
                  {task.title}（{task.status === 'done' ? '已完成' : task.status === 'todo' ? '待完成' : task.status}）
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="暂无任务摘要" description="当前还没有可展示的任务数据，建议先补一条任务后再演示家属看板。" />
          )}
        </article>

        <article className="surface-card" style={pageStyles.card}>
          <h2 style={{ marginTop: 0 }}>指标摘要</h2>
          <p style={{ margin: 0, color: '#475467' }}>{formatMetricSummary(latestMetric)}</p>
          {latestMetric ? (
            <p style={{ color: '#667085', margin: '8px 0 0' }}>最近测量时间：{new Date(latestMetric.measuredAt).toLocaleString('zh-CN')}</p>
          ) : null}
          <p style={{ color: '#667085', margin: '8px 0 0' }}>这里适合补一句“家属不用翻原始记录，只看最近一次状态就能先判断要不要跟进”。</p>
        </article>

        <article className="surface-card" style={pageStyles.card}>
          <h2 style={{ marginTop: 0 }}>用药提醒摘要</h2>
          {reminders.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#475467' }}>
              {reminders.slice(0, 5).map((item) => (
                <li key={item.id} style={{ marginBottom: 8 }}>
                  {item.medicineName} · {item.remindTime} · {item.enabled ? '已启用' : '已停用'}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="暂无用药提醒" description="当前没有可展示的提醒数据，建议先补一条提醒，方便家属端联动演示。" />
          )}
        </article>
      </section>
    </main>
  );
}
