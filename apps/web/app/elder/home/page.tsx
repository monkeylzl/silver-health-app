import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

type TaskItem = {
  id: string;
  title: string;
  description?: string | null;
  taskType: 'exercise' | 'diet' | 'medication' | 'measurement';
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'done' | 'skipped' | 'expired';
  dueTime?: string | null;
};

const mockTasks: TaskItem[] = [
  {
    id: 'mock-task-1',
    title: '晨间散步 20 分钟',
    description: '建议饭后半小时进行，保持舒缓节奏。',
    taskType: 'exercise',
    priority: 'high',
    status: 'todo',
    dueTime: '08:30',
  },
  {
    id: 'mock-task-2',
    title: '记录今日血压',
    description: '早餐后静坐 5 分钟再测量。',
    taskType: 'measurement',
    priority: 'high',
    status: 'todo',
    dueTime: '09:00',
  },
  {
    id: 'mock-task-3',
    title: '午间服药提醒',
    description: '按常规剂量服用。',
    taskType: 'medication',
    priority: 'medium',
    status: 'todo',
    dueTime: '12:00',
  },
];

const statusLabelMap: Record<TaskItem['status'], string> = {
  todo: '待完成',
  done: '已完成',
  skipped: '已跳过',
  expired: '已过期',
};

const priorityLabelMap: Record<TaskItem['priority'], string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

const taskTypeLabelMap: Record<TaskItem['taskType'], string> = {
  exercise: '运动',
  diet: '饮食',
  medication: '用药',
  measurement: '测量',
};

function getPriorityColor(priority: TaskItem['priority']) {
  if (priority === 'high') return '#f04438';
  if (priority === 'medium') return '#f79009';
  return '#12b76a';
}

async function getTasks(): Promise<{ tasks: TaskItem[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      tasks: mockTasks,
      source: 'mock',
      note: '当前未设置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID，先展示 mock 今日任务。',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/tasks/elder/${defaultElderUserId}`, {
      cache: 'no-store',
    });
    const payload = await response.json();

    if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || '加载今日任务失败');
    }

    return {
      tasks: payload.data,
      source: 'api',
    };
  } catch (error) {
    return {
      tasks: mockTasks,
      source: 'mock',
      note: error instanceof Error ? `API 加载失败，当前回退到 mock 数据：${error.message}` : 'API 加载失败，当前回退到 mock 数据。',
    };
  }
}

export default async function Page() {
  const { tasks, source, note } = await getTasks();
  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>老人首页</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前先聚焦 MVP 第二条主链路：今日任务展示。页面优先把“今天要做什么”展示清楚，再继续接任务完成、提醒和快捷录入。
        </p>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>当前数据源</div>
          <strong>{source === 'api' ? '真实 API' : 'Mock 回退'}</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>待完成任务</div>
          <strong>{todoCount} 项</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>已完成任务</div>
          <strong>{doneCount} 项</strong>
        </div>
      </section>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <section style={{ display: 'grid', gap: 16 }}>
        {tasks.map((task) => (
          <article key={task.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{task.title}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {taskTypeLabelMap[task.taskType]}
                  </span>
                  <span style={{ background: `${getPriorityColor(task.priority)}15`, color: getPriorityColor(task.priority), borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {priorityLabelMap[task.priority]}
                  </span>
                  <span style={{ background: '#ecfdf3', color: '#027a48', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {statusLabelMap[task.status]}
                  </span>
                </div>
              </div>
              <div style={{ color: '#667085' }}>{task.dueTime ? `计划时间：${task.dueTime}` : '时间待定'}</div>
            </div>

            <p style={{ color: '#475467', margin: 0 }}>{task.description || '暂无补充说明。'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
