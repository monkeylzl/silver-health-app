import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasTrialSession, unauthorizedAppResponse } from '../../../../lib/app-session';
import { serverDefaultElderUserId } from '../../../../lib/server-config';
import { appApiErrorResponse, serverApiRequest } from '../../../../lib/server-api';

export async function POST(request: NextRequest) {
  if (!(await hasTrialSession())) return unauthorizedAppResponse();
  if (!serverDefaultElderUserId) return Response.json({ code: 1, message: '当前档案尚未配置。' }, { status: 503 });
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;

  try {
    const data = await serverApiRequest('/api/metrics', {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        elderUserId: serverDefaultElderUserId,
        createdByUserId: serverDefaultElderUserId,
        createdByRole: 'elder',
      }),
    });
    revalidatePath('/health');
    revalidatePath('/family');
    return Response.json({ code: 0, message: 'ok', data });
  } catch (error) {
    return appApiErrorResponse(error);
  }
}
