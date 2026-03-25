import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { TaskList } from './task-list';

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

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>老人首页</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前继续推进 MVP 第二条主链路：今日任务。页面现在已从“只能展示”升级到“可以直接标记完成任务”。
        </p>
      </div>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <TaskList initialTasks={tasks} source={source} />
    </main>
  );
}
