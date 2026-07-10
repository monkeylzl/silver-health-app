import { NextRequest, NextResponse } from 'next/server';
import { verifyTrialSession } from './lib/trial-session-token';

const cookieName = 'silver_trial_session';
const publicPrefixes = [
  '/access',
  '/api/session',
  '/_next',
  '/icons',
  '/manifest.webmanifest',
  '/sw.js',
  '/offline.html',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  const secret = process.env.TRIAL_SESSION_SECRET
    ?? (process.env.NODE_ENV === 'production' ? '' : 'silver-health-local-session-secret-2026');
  const token = request.cookies.get(cookieName)?.value;
  const isValid = Boolean(secret && token && await verifyTrialSession(token, secret));
  if (isValid) return NextResponse.next();

  if (pathname.startsWith('/api/app')) {
    return NextResponse.json({ code: 1, message: '体验会话已失效，请重新进入。' }, { status: 401 });
  }

  const accessUrl = new URL('/access', request.url);
  accessUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: ['/((?!.*\\.).*)'],
};
