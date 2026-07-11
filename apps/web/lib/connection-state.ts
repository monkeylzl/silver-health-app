export function shouldRefreshOnReconnect(previousOnline: boolean, currentOnline: boolean) {
  return !previousOnline && currentOnline;
}

export function getNetworkSettingsInstruction(userAgent: string) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return '打开 iPhone 设置 > 无线局域网或蜂窝网络，连接后返回 Silver Health。';
  }
  return '打开系统设置 > 网络和互联网，连接后返回 Silver Health。';
}
