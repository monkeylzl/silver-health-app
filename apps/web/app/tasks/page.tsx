import { getTasks } from '../../lib/app-data';
import { BackHeader, EmptyState, ErrorState } from '../ui/app-components';
import { TaskActionList } from '../ui/task-action-list';

export default async function TasksPage() {
  try {
    const tasks = await getTasks();
    return (
      <main className="app-shell app-shell--narrow">
        <BackHeader href="/" title="今日任务" />
        {tasks.length > 0 ? <TaskActionList initialTasks={tasks} /> : <EmptyState title="今天没有任务" description="新的任务会显示在这里。" />}
      </main>
    );
  } catch (error) {
    return <main className="app-shell app-shell--narrow"><BackHeader href="/" title="今日任务" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
