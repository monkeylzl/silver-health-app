import { hasTrialSession, unauthorizedAppResponse } from '../../../../../lib/app-session';
import { revalidatePath } from 'next/cache';
import { serverDefaultElderUserId } from '../../../../../lib/server-config';
import { appApiErrorResponse, serverApiRequest } from '../../../../../lib/server-api';

export async function POST() {
  if (!(await hasTrialSession())) return unauthorizedAppResponse();
  if (!serverDefaultElderUserId) return Response.json({ code: 1, message: '当前档案尚未配置。' }, { status: 503 });
  try {
    const data = await serverApiRequest(`/api/reports/elder/${encodeURIComponent(serverDefaultElderUserId)}/generate`, { method: 'POST' });
    revalidatePath('/family');
    revalidatePath('/family/reports');
    return Response.json({ code: 0, message: 'ok', data });
  } catch (error) {
    return appApiErrorResponse(error);
  }
}
