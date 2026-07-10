import 'server-only';

export const serverApiBaseUrl = (
  process.env.API_BASE_URL
  ?? process.env.NEXT_PUBLIC_API_BASE_URL
  ?? 'http://localhost:3001'
).replace(/\/$/, '');

export const serverDefaultElderUserId =
  process.env.DEFAULT_ELDER_USER_ID
  ?? process.env.NEXT_PUBLIC_DEFAULT_ELDER_USER_ID
  ?? '';

export const serverDefaultFamilyUserId =
  process.env.DEFAULT_FAMILY_USER_ID
  ?? process.env.NEXT_PUBLIC_DEFAULT_FAMILY_USER_ID
  ?? '';

export const serverInternalAppKey = process.env.INTERNAL_API_KEY?.trim() ?? '';

export const trialSessionSecret =
  process.env.TRIAL_SESSION_SECRET
  ?? (process.env.NODE_ENV === 'production' ? '' : 'silver-health-local-session-secret-2026');
