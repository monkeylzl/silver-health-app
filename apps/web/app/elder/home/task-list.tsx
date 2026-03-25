'use client';

import { useMemo, useState } from 'react';
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
      setMessage('当前为 mock 模式，已本地模拟完成该任务。');
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
      setMessage('任务已标记为完成。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '完成任务失败');
    } finally {
      setPendingTaskId(null);
    }
  };

  return (
    <>
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

      {message ? (
        <div style={{ marginBottom: 20, background: '#eff8ff', border: '1px solid #b2ddff', borderRadius: 12, padding: '12px 14px', color: '#175cd3' }}>
          {message}
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
                  <span style={{ background: task.status === 'done' ? '#ecfdf3' : '#eff8ff', color: task.status === 'done' ? '#027a48' : '#175cd3', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {statusLabelMap[task.status]}
                  </span>
                </div>
              </div>
              <div style={{ color: '#667085' }}>{task.dueTime ? `计划时间：${task.dueTime}` : '时间待定'}</div>
            </div>

            <p style={{ color: '#475467', margin: '0 0 14px' }}>{task.description || '暂无补充说明。'}</p>

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
    </>
  );
}
