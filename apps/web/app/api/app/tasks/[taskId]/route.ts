import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasTrialSession, unauthorizedAppResponse } from '../../../../../lib/app-session';
import { appApiErrorResponse, serverApiRequest } from '../../../../../lib/server-api';
import { serverDefaultElderUserId } from '../../../../../lib/server-config';

export async function PATCH(request: NextRequest, context: { params: Promise<{ taskId: string }> }) {
  if (!(await hasTrialSession())) return unauthorizedAppResponse();
  if (!serverDefaultElderUserId) return Response.json({ code: 1, message: '当前档案尚未配置。' }, { status: 503 });
  const body = await request.json().catch(() => null) as { status?: unknown } | null;
  if (body?.status !== 'done' && body?.status !== 'todo') {
    return Response.json({ code: 1, message: '任务状态无效。' }, { status: 400 });
  }

  try {
    const { taskId } = await context.params;
    const data = await serverApiRequest(`/api/tasks/${encodeURIComponent(taskId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: body.status, elderUserId: serverDefaultElderUserId }),
    });
    revalidatePath('/');
    revalidatePath('/tasks');
    revalidatePath('/family');
    return Response.json({ code: 0, message: 'ok', data });
  } catch (error) {
    return appApiErrorResponse(error);
  }
}
