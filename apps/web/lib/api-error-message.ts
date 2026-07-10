export function friendlyApiMessage(status: number, _upstreamMessage: string) {
  if (status === 400) return '填写内容有误，请检查后重试。';
  if (status === 401 || status === 403) return '健康服务认证失败，请联系管理员。';
  if (status === 404) return '相关记录不存在或已经更新。';
  if (status === 409) return '当前内容已经发生变化，请刷新后重试。';
  if (status >= 500) return '健康服务暂时不可用，请稍后重试。';
  return '操作没有完成，请稍后重试。';
}
