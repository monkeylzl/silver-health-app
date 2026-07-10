const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importSessionKey(secret: string) {
  if (secret.length < 32) throw new Error('trial session secret must be at least 32 characters');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function createTrialSession(secret: string, nowMs = Date.now()): Promise<string> {
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ exp: nowMs + SESSION_LIFETIME_MS })));
  const signature = await crypto.subtle.sign('HMAC', await importSessionKey(secret), new TextEncoder().encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyTrialSession(token: string, secret: string, nowMs = Date.now()): Promise<boolean> {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { exp?: unknown };
    if (typeof parsed.exp !== 'number' || parsed.exp <= nowMs) return false;

    return crypto.subtle.verify(
      'HMAC',
      await importSessionKey(secret),
      fromBase64Url(signature),
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}

export const trialSessionMaxAgeSeconds = SESSION_LIFETIME_MS / 1000;
