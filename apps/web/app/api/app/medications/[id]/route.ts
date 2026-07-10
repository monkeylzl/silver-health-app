import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasTrialSession, unauthorizedAppResponse } from '../../../../../lib/app-session';
import { appApiErrorResponse, serverApiRequest } from '../../../../../lib/server-api';
import { serverDefaultElderUserId } from '../../../../../lib/server-config';

async function medicationRequest(request: NextRequest, context: { params: Promise<{ id: string }> }, method: 'PATCH' | 'DELETE') {
  if (!(await hasTrialSession())) return unauthorizedAppResponse();
  if (!serverDefaultElderUserId) return Response.json({ code: 1, message: '当前档案尚未配置。' }, { status: 503 });
  try {
    const { id } = await context.params;
    const body = method === 'PATCH' ? JSON.stringify(await request.json().catch(() => ({}))) : undefined;
    const data = await serverApiRequest(`/api/medications/${encodeURIComponent(id)}?elderUserId=${encodeURIComponent(serverDefaultElderUserId)}`, { method, body });
    revalidatePath('/health');
    revalidatePath('/health/medications');
    revalidatePath('/family');
    return Response.json({ code: 0, message: 'ok', data });
  } catch (error) {
    return appApiErrorResponse(error);
  }
}

export function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return medicationRequest(request, context, 'PATCH');
}

export function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return medicationRequest(request, context, 'DELETE');
}
