import 'server-only';
import { cookies } from 'next/headers';
import { verifyTrialSession } from './trial-session-token';
import { trialSessionSecret } from './server-config';

export const trialSessionCookieName = 'silver_trial_session';

export async function hasTrialSession() {
  if (!trialSessionSecret) return false;
  const token = (await cookies()).get(trialSessionCookieName)?.value;
  return token ? verifyTrialSession(token, trialSessionSecret) : false;
}

export async function unauthorizedAppResponse() {
  return Response.json({ code: 1, message: '体验会话已失效，请重新进入。' }, { status: 401 });
}
