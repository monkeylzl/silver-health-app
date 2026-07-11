export function shouldRefreshOnReconnect(previousOnline: boolean, currentOnline: boolean) {
  return !previousOnline && currentOnline;
}

export const connectivityChangeEvent = 'silver-health-connectivity-change';
export const connectivityCheckEvent = 'silver-health-connectivity-check';
export const connectivityStorageKey = 'silver-health-connectivity';

export async function probeNetworkConnection(fetcher: typeof fetch = fetch, timeoutMs = 3000) {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<boolean>((resolve) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      resolve(false);
    }, timeoutMs);
  });

  const request = fetcher(`/api/connectivity?probe=${Date.now()}`, {
    cache: 'no-store',
    credentials: 'same-origin',
    signal: controller.signal,
  }).then((response) => response.ok).catch(() => false);

  try {
    return await Promise.race([request, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function getNetworkSettingsInstruction(userAgent: string) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return '打开 iPhone 设置 > 无线局域网或蜂窝网络，连接后返回 Silver Health。';
  }
  return '打开系统设置 > 网络和互联网，连接后返回 Silver Health。';
}
