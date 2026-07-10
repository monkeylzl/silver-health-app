import 'server-only';
import { serverApiBaseUrl, serverInternalAppKey } from './server-config';
import { friendlyApiMessage } from './api-error-message';

type ApiEnvelope<T> = {
  code?: number;
  message?: string | string[];
  data?: T;
};

export class AppApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function messageFromPayload(payload: ApiEnvelope<unknown> | null, fallback: string) {
  if (Array.isArray(payload?.message)) return payload.message.join('；');
  if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message;
  return fallback;
}

export async function serverApiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (serverInternalAppKey) headers.set('X-Silver-App-Key', serverInternalAppKey);

  let response: Response;
  try {
    response = await fetch(`${serverApiBaseUrl}${path}`, {
      ...init,
      headers,
      cache: init.method && init.method !== 'GET' ? undefined : 'no-store',
    });
  } catch {
    throw new AppApiError('暂时无法连接健康服务，请稍后重试。', 503);
  }

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || payload?.code !== 0 || payload.data === undefined) {
    const status = response.status || 500;
    throw new AppApiError(friendlyApiMessage(status, messageFromPayload(payload, '操作没有完成，请稍后重试。')), status);
  }
  return payload.data;
}

export function appApiErrorResponse(error: unknown) {
  const appError = error instanceof AppApiError
    ? error
    : new AppApiError('操作没有完成，请稍后重试。', 500);
  return Response.json({ code: 1, message: appError.message }, { status: appError.status });
}
