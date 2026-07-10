export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

export const defaultElderUserId = process.env.NEXT_PUBLIC_DEFAULT_ELDER_USER_ID ?? '';

export const defaultFamilyUserId = process.env.NEXT_PUBLIC_DEFAULT_FAMILY_USER_ID ?? '';
