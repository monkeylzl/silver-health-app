'use client';

import { Check, Clock3, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TaskItem } from '../../lib/app-data';

const taskTypeLabel: Record<TaskItem['taskType'], string> = {
  exercise: '运动',
  diet: '饮食',
  medication: '用药',
  measurement: '测量',
};

export function TaskActionList({ initialTasks, preview = false }: { initialTasks: TaskItem[]; preview?: boolean }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');
  const visibleTasks = preview ? tasks.slice(0, 3) : tasks;

  async function updateStatus(task: TaskItem) {
    if (!navigator.onLine) {
      setMessage('当前处于离线状态，恢复网络后再更新任务。');
      return;
    }
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    const previousTasks = tasks;
    setBusyId(task.id);
    setMessage('');
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status: nextStatus } : item));

    try {
      const response = await fetch(`/api/app/tasks/${encodeURIComponent(task.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message || '任务没有更新成功。');
      setMessage(nextStatus === 'done' ? '已完成，家人页会同步更新。' : '已撤销完成状态。');
      router.refresh();
    } catch (error) {
      setTasks(previousTasks);
      setMessage(error instanceof Error ? error.message : '任务没有更新成功。');
    } finally {
      setBusyId('');
    }
  }

  return (
    <>
      <div className="task-list">
        {visibleTasks.map((task) => {
          const done = task.status === 'done';
          return (
            <article className="task-row" key={task.id} data-testid={preview ? 'task-preview-item' : undefined}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description || `${taskTypeLabel[task.taskType]}任务`}</p>
                <span className={done ? 'status-label status-label--success' : 'status-label'}>
                  {done ? <Check aria-hidden="true" /> : <Clock3 aria-hidden="true" />}
                  {done ? '已完成' : task.dueTime ? `${task.dueTime} 前完成` : '待完成'}
                </span>
              </div>
              <button
                type="button"
                className={done ? 'button button--secondary' : 'button button--primary'}
                onClick={() => updateStatus(task)}
                disabled={busyId === task.id}
                data-touch-target
              >
                {done ? <RotateCcw aria-hidden="true" /> : <Check aria-hidden="true" />}
                {busyId === task.id ? '正在更新…' : done ? '撤销完成' : '标记完成'}
              </button>
            </article>
          );
        })}
      </div>
      <p className={message.includes('没有') || message.includes('离线') ? 'form-message form-message--error' : 'form-message'} aria-live="polite">{message}</p>
    </>
  );
}
