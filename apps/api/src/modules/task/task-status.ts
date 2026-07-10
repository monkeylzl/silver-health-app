import { TaskStatus } from '@prisma/client';

export function buildTaskStatusUpdate(status: 'done' | 'todo', completedAt = new Date()) {
  if (status === TaskStatus.done) {
    return { status: TaskStatus.done, completedAt };
  }
  if (status === TaskStatus.todo) {
    return { status: TaskStatus.todo, completedAt: null };
  }
  throw new Error(`unsupported task status: ${status}`);
}

export function isTaskStatusUnchanged(
  currentStatus: string,
  completedAt: Date | null,
  nextStatus: 'done' | 'todo',
) {
  return currentStatus === nextStatus && (nextStatus === TaskStatus.done || completedAt === null);
}
