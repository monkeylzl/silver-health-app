import { NextRequest, NextResponse } from 'next/server';
import { isTrialAccessConfigured, verifyAccessCode } from '../../../lib/trial-access-code';
import { createTrialSession, trialSessionMaxAgeSeconds } from '../../../lib/trial-session-token';
import { FixedWindowRateLimiter, isTrialRequestBodyAllowed, readJsonBodyWithinLimit } from '../../../lib/trial-rate-limit';

const cookieName = 'silver_trial_session';
const accessLimiter = new FixedWindowRateLimiter(8, 60_000);

function requestClientKey(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  if (!isTrialRequestBodyAllowed(request.headers.get('content-length'))) {
    return NextResponse.json({ code: 1, message: '请求内容过大。' }, { status: 413 });
  }
  const clientKey = requestClientKey(request);
  if (!accessLimiter.take(clientKey)) {
    return NextResponse.json({ code: 1, message: '尝试次数过多，请稍后再试。' }, { status: 429 });
  }
  const parsedBody = await readJsonBodyWithinLimit(request);
  if (!parsedBody.ok) {
    return NextResponse.json({ code: 1, message: '请求内容过大。' }, { status: 413 });
  }
  const body = parsedBody.value as { accessCode?: unknown } | null;
  const accessCode = typeof body?.accessCode === 'string' ? body.accessCode : '';
  if (accessCode.length > 128) {
    return NextResponse.json({ code: 1, message: '体验口令格式不正确。' }, { status: 400 });
  }
  const configuredHash = process.env.TRIAL_ACCESS_CODE_HASH;
  if (!isTrialAccessConfigured(configuredHash, process.env.NODE_ENV)) {
    return NextResponse.json({ code: 1, message: '体验访问尚未配置。' }, { status: 503 });
  }

  const valid = configuredHash
    ? await verifyAccessCode(accessCode, configuredHash)
    : process.env.NODE_ENV !== 'production' && accessCode === 'silver-health-local';

  if (!valid) {
    return NextResponse.json({ code: 1, message: '体验口令不正确，请重新输入。' }, { status: 401 });
  }

  const secret = process.env.TRIAL_SESSION_SECRET
    ?? (process.env.NODE_ENV === 'production' ? '' : 'silver-health-local-session-secret-2026');
  if (!secret) {
    return NextResponse.json({ code: 1, message: '体验访问尚未配置。' }, { status: 503 });
  }

  accessLimiter.reset(clientKey);
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(cookieName, await createTrialSession(secret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: trialSessionMaxAgeSeconds,
  });
  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(cookieName, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
