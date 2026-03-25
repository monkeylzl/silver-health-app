import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

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
  if (!metric) return '暂无指标记录';
  if (metric.metricType === 'blood_pressure') {
    return `最近血压：${metric.systolic ?? '-'} / ${metric.diastolic ?? '-'} mmHg`;
  }
  if (metric.metricType === 'blood_glucose') {
    return `最近血糖：${metric.glucoseValue ?? '-'} mmol/L`;
  }
  return `最近体重：${metric.weightKg ?? '-'} kg`;
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
      note: '当前未设置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID，先展示 mock 家属摘要数据。',
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
      note: error instanceof Error ? `API 加载失败，当前回退到 mock 数据：${error.message}` : 'API 加载失败，当前回退到 mock 数据。',
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

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>家属看板</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前先做家属侧摘要页第一版，把任务、指标、用药提醒三块核心信息聚到一个页面里，方便快速查看老人近况。
        </p>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>当前数据源</div>
          <strong>{source === 'api' ? '真实 API' : 'Mock 回退'}</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>今日任务完成情况</div>
          <strong>{doneCount} / {tasks.length} 已完成</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>待完成任务</div>
          <strong>{todoCount} 项</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>启用中的提醒</div>
          <strong>{enabledReminderCount} 条</strong>
        </div>
      </section>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <section style={{ display: 'grid', gap: 16 }}>
        <article style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>任务摘要</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#475467' }}>
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id} style={{ marginBottom: 8 }}>
                {task.title}（{task.status === 'done' ? '已完成' : task.status === 'todo' ? '待完成' : task.status}）
              </li>
            ))}
          </ul>
        </article>

        <article style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>指标摘要</h2>
          <p style={{ margin: 0, color: '#475467' }}>{formatMetricSummary(latestMetric)}</p>
          {latestMetric ? (
            <p style={{ color: '#667085', margin: '8px 0 0' }}>最近测量时间：{new Date(latestMetric.measuredAt).toLocaleString('zh-CN')}</p>
          ) : null}
        </article>

        <article style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>用药提醒摘要</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#475467' }}>
            {reminders.slice(0, 5).map((item) => (
              <li key={item.id} style={{ marginBottom: 8 }}>
                {item.medicineName} · {item.remindTime} · {item.enabled ? '已启用' : '已停用'}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
