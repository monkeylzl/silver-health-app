import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { ChecklistNotice, DataSourceNotice, DemoStepNotice, PageHeader, pageStyles } from '../../ui/page-kit';
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
      note: '当前没读到默认老人档案，所以先放一组演示任务，避免首页一上来就空白。',
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
      note: error instanceof Error ? `刚才没拿到真实任务，先用演示任务把流程讲下去：${error.message}` : '刚才没拿到真实任务，先用演示任务把流程讲下去。',
    };
  }
}

export default async function Page() {
  const { tasks, source, note } = await getTasks();

  return (
    <main style={pageStyles.main}>
      <PageHeader
        title="老人首页"
        description="建档之后，演示自然切到这里：看看今天要做什么，并直接完成一项任务，说明产品会持续陪老人把日常管理做下去。"
      />

      <DemoStepNotice
        step="演示第 2 步"
        current="建议在这里点掉一项今日任务，让观众先感受到“不是只看信息，而是真的能完成日常事项”。"
        next="接着进入“健康指标录入”，补一条当天数据。"
      />

      <DataSourceNotice source={source} fallbackNote={note} mockLabel="当前先用演示任务保住演示节奏；只要默认老人档案和接口恢复正常，这里会自动切回真实 API。" />

      <ChecklistNotice
        title="这一页建议顺手讲清楚"
        items={[
          '先看顶部接入状态，交代现在展示的是实时数据还是演示兜底。',
          '现场标记完成 1 项任务，让“老人真的在执行”这件事先成立。',
          '做完后直接切到“健康指标录入”，形成当天管理闭环。',
        ]}
      />

      <TaskList initialTasks={tasks} source={source} />
    </main>
  );
}
