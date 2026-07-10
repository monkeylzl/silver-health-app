import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasTrialSession, unauthorizedAppResponse } from '../../../../lib/app-session';
import { serverDefaultElderUserId } from '../../../../lib/server-config';
import { appApiErrorResponse, serverApiRequest } from '../../../../lib/server-api';

export async function PATCH(request: NextRequest) {
  if (!(await hasTrialSession())) return unauthorizedAppResponse();
  if (!serverDefaultElderUserId) return Response.json({ code: 1, message: '当前档案尚未配置。' }, { status: 503 });
  try {
    const body = await request.json().catch(() => ({}));
    const data = await serverApiRequest(`/api/profile/elder/${encodeURIComponent(serverDefaultElderUserId)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    revalidatePath('/');
    revalidatePath('/me');
    revalidatePath('/me/profile');
    return Response.json({ code: 0, message: 'ok', data });
  } catch (error) {
    return appApiErrorResponse(error);
  }
}
