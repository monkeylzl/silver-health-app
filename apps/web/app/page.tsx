import Link from 'next/link';
import { Activity, ClipboardList, HeartPulse } from 'lucide-react';
import { getProfile, getTasks } from '../lib/app-data';
import { AppPageHeader, EmptyState, ErrorState, ProgressBar, SectionHeader } from './ui/app-components';
import { TaskActionList } from './ui/task-action-list';

function greeting() {
  const hour = Number(new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', hour12: false }).format(new Date()));
  if (hour < 11) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export default async function TodayPage() {
  try {
    const [tasks, profile] = await Promise.all([getTasks(), getProfile()]);
    const doneCount = tasks.filter((task) => task.status === 'done').length;
    const todoTasks = tasks.filter((task) => task.status === 'todo');
    const nextTask = todoTasks[0];
    const displayName = profile.user?.nickname || profile.name || '您好';

    return (
      <main className="app-shell">
        <AppPageHeader title="今日" description={`${greeting()}，${displayName}。先完成今天最重要的一件事。`} />

        <section className="summary-panel summary-panel--primary">
          <div className="summary-panel__top">
            <div>
              <span className="summary-panel__label">下一项</span>
              <h2>{nextTask?.title || '今天的任务已完成'}</h2>
              <p>{nextTask?.dueTime ? `${nextTask.dueTime} 前完成` : nextTask?.description || '可以看看最近的健康记录。'}</p>
            </div>
            <Link href={nextTask ? '/tasks' : '/health'} className="button button--primary" data-touch-target>
              {nextTask ? <ClipboardList aria-hidden="true" /> : <HeartPulse aria-hidden="true" />}
              {nextTask ? '处理任务' : '查看健康'}
            </Link>
          </div>
          <ProgressBar value={doneCount} max={tasks.length} label={`今日已完成 ${doneCount}/${tasks.length}`} />
        </section>

        <section className="quick-actions" aria-label="快捷操作">
          <Link className="quick-action" href="/health/metrics/new" data-touch-target>
            <Activity aria-hidden="true" /><strong>记录健康指标</strong><span>补一条血压、血糖或体重</span>
          </Link>
          <Link className="quick-action" href="/health/medications" data-touch-target>
            <HeartPulse aria-hidden="true" /><strong>查看今日用药</strong><span>确认提醒时间和服用说明</span>
          </Link>
        </section>

        <SectionHeader title="今日任务" href="/tasks" actionLabel="查看全部任务" />
        {tasks.length > 0 ? (
          <TaskActionList initialTasks={tasks} preview />
        ) : (
          <EmptyState title="今天没有待办" description="新的健康任务会显示在这里。" />
        )}
      </main>
    );
  } catch (error) {
    return <main className="app-shell"><AppPageHeader title="今日" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
