type WindowState = { count: number; startedAt: number };

export class FixedWindowRateLimiter {
  private readonly windows = new Map<string, WindowState>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  take(key: string, now = Date.now()) {
    if (this.windows.size >= 1000) {
      for (const [windowKey, state] of this.windows) {
        if (now - state.startedAt >= this.windowMs) this.windows.delete(windowKey);
      }
      if (this.windows.size >= 1000) this.windows.delete(this.windows.keys().next().value as string);
    }
    const current = this.windows.get(key);
    if (!current || now - current.startedAt >= this.windowMs) {
      this.windows.set(key, { count: 1, startedAt: now });
      return true;
    }
    if (current.count >= this.limit) return false;
    current.count += 1;
    return true;
  }

  reset(key: string) {
    this.windows.delete(key);
  }
}

export function isTrialRequestBodyAllowed(contentLength: string | null) {
  if (!contentLength) return true;
  const parsed = Number(contentLength);
  return Number.isFinite(parsed) && parsed <= 1024;
}

export async function readJsonBodyWithinLimit(request: Request, maxBytes = 1024) {
  const reader = request.body?.getReader();
  if (!reader) return { ok: true as const, value: null };
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return { ok: false as const, value: null };
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { ok: true as const, value: JSON.parse(new TextDecoder().decode(body)) as unknown };
  } catch {
    return { ok: true as const, value: null };
  }
}
