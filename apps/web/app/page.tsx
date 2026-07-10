import Link from 'next/link';
import { apiBaseUrl, defaultElderUserId } from '../lib/config';
import { DataSourceNotice, EmptyState, InlineNotice, PageHeader, StatCard, pageStyles } from './ui/page-kit';
import { TaskList } from './elder/home/task-list';
import { InstallPrompt } from './ui/install-prompt';

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
    description: '保持舒缓节奏，完成后家属端会看到今日进展。',
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
    status: 'done',
    dueTime: '12:00',
  },
];

async function getTodayTasks(): Promise<{ tasks: TaskItem[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      tasks: mockTasks,
      source: 'mock',
      note: '当前没读到默认老人档案，先展示演示任务。上线前请在 Vercel 配置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID。',
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
      note: error instanceof Error ? `暂时没拿到真实任务，先用演示任务保持可用：${error.message}` : '暂时没拿到真实任务，先用演示任务保持可用。',
    };
  }
}

export default async function TodayPage() {
  const { tasks, source, note } = await getTodayTasks();
  const totalCount = tasks.length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const nextTask = tasks.find((task) => task.status === 'todo') ?? tasks[0];

  return (
    <main className="app-shell app-shell--tabbed" style={pageStyles.main}>
      <PageHeader
        title="今日"
        description="先看今天最该做什么。完成任务、补一条指标，家属端就能同步看到近况。"
      />

      <section className="launch-hero">
        <div>
          <span className="eyebrow">Silver Health PWA</span>
          <h2>今天还有 {todoCount} 项待完成</h2>
          <p>{nextTask ? `下一步：${nextTask.title}` : '今天暂时没有待办，可以先查看健康记录。'}</p>
        </div>
        <Link className="hero-action" href="/health">去录指标</Link>
      </section>

      <DataSourceNotice
        source={source}
        fallbackNote={note}
        apiLabel="今日工作台已接入真实 API，可作为上线后的默认首页。"
        mockLabel="当前使用演示任务保持体验完整；配置远程 API 和默认老人档案后会自动切回真实数据。"
      />

      <section className="stat-grid stat-grid--three" style={pageStyles.statGrid}>
        <StatCard label="今日任务" value={`${totalCount} 项`} />
        <StatCard label="已完成" value={`${doneCount} 项`} />
        <StatCard label="待完成" value={`${todoCount} 项`} />
      </section>

      <InlineNotice tone="success">
        <strong>上线版默认体验</strong>
        <div style={{ marginTop: 6 }}>这里不再是开发演示清单，而是老人每天打开后真正看到的任务工作台。</div>
      </InlineNotice>

      {tasks.length > 0 ? (
        <TaskList initialTasks={tasks} source={source} />
      ) : (
        <EmptyState title="今天还没有任务" description="可以先重建演示数据，或在后台补充今日任务。" />
      )}

      <InstallPrompt compact />
    </main>
  );
}
