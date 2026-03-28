'use client';

import { useMemo, useState } from 'react';
import { EmptyState, InlineNotice, StatCard, pageStyles } from '../../ui/page-kit';
import { apiBaseUrl } from '../../../lib/config';

type TaskItem = {
  id: string;
  title: string;
  description?: string | null;
  taskType: 'exercise' | 'diet' | 'medication' | 'measurement';
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'done' | 'skipped' | 'expired';
  dueTime?: string | null;
};

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

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const maybePayload = payload as { message?: string | string[]; error?: string };
  if (Array.isArray(maybePayload.message)) {
    return maybePayload.message.join('；');
  }
  if (typeof maybePayload.message === 'string' && maybePayload.message.trim()) {
    return maybePayload.message;
  }
  if (typeof maybePayload.error === 'string' && maybePayload.error.trim()) {
    return maybePayload.error;
  }
  return fallback;
}

export function TaskList({ initialTasks, source }: { initialTasks: TaskItem[]; source: 'api' | 'mock' }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [message, setMessage] = useState('');
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const todoCount = useMemo(() => tasks.filter((task) => task.status === 'todo').length, [tasks]);
  const doneCount = useMemo(() => tasks.filter((task) => task.status === 'done').length, [tasks]);

  const completeTask = async (taskId: string) => {
    if (source !== 'api') {
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: 'done' } : task)));
      setMessage('已在演示模式里模拟完成这项任务，后续切到真实数据时交互保持一致。');
      return;
    }

    setPendingTaskId(taskId);
    setMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
      });
      const payload = await response.json();

      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '完成任务失败'));
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'done',
              }
            : task,
        ),
      );
      setMessage('任务已标记完成，可以继续进入指标录入。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '完成任务失败');
    } finally {
      setPendingTaskId(null);
    }
  };

  return (
    <>
      <section style={pageStyles.statGrid}>
        <StatCard label="当前接入状态" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="待完成任务" value={`${todoCount} 项`} />
        <StatCard label="已完成任务" value={`${doneCount} 项`} />
      </section>

      {message ? <InlineNotice tone="success">{message}</InlineNotice> : null}

      {tasks.length === 0 ? (
        <EmptyState title="今天还没有待办任务" description="正常情况下新的 demo seed 会自动把任务对齐到当天；如果这里仍然空白，优先跑 pnpm check:demo 确认演示数据是否失稳，再按提示决定是否重跑 pnpm seed:demo 或先补一条今日任务。" />
      ) : (
        <section style={pageStyles.listSection}>
          {tasks.map((task) => (
            <article key={task.id} style={pageStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{task.title}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={pageStyles.tag}>{taskTypeLabelMap[task.taskType]}</span>
                    <span style={{ background: `${getPriorityColor(task.priority)}15`, color: getPriorityColor(task.priority), borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                      {priorityLabelMap[task.priority]}
                    </span>
                    <span style={{ background: task.status === 'done' ? '#ecfdf3' : '#eff8ff', color: task.status === 'done' ? '#027a48' : '#175cd3', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                      {statusLabelMap[task.status]}
                    </span>
                  </div>
                </div>
                <div style={{ color: '#667085' }}>{task.dueTime ? `计划时间：${task.dueTime}` : '时间待补充'}</div>
              </div>

              <p style={{ color: '#475467', margin: '0 0 14px' }}>{task.description || '这项任务暂时还没有补充说明。'}</p>

              <button
                type="button"
                disabled={task.status === 'done' || pendingTaskId === task.id}
                onClick={() => completeTask(task.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: 0,
                  background: task.status === 'done' ? '#d0d5dd' : '#2563eb',
                  color: '#fff',
                  cursor: task.status === 'done' ? 'not-allowed' : 'pointer',
                }}
              >
                {pendingTaskId === task.id ? '处理中...' : task.status === 'done' ? '已完成' : '标记完成'}
              </button>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
