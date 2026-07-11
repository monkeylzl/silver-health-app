import assert from 'node:assert/strict';
import test from 'node:test';

test('refreshes data only when the device reconnects', async () => {
  let connectionState: typeof import('../../apps/web/lib/connection-state.ts') | undefined;
  try {
    connectionState = await import('../../apps/web/lib/connection-state.ts');
  } catch {
    connectionState = undefined;
  }

  assert.ok(connectionState, 'connection state helper should exist');
  assert.equal(connectionState.shouldRefreshOnReconnect(false, true), true);
  assert.equal(connectionState.shouldRefreshOnReconnect(true, true), false);
  assert.equal(connectionState.shouldRefreshOnReconnect(true, false), false);
  assert.equal(
    connectionState.getNetworkSettingsInstruction('Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X)'),
    '打开 iPhone 设置 > 无线局域网或蜂窝网络，连接后返回 Silver Health。',
  );
  assert.equal(
    connectionState.getNetworkSettingsInstruction('Mozilla/5.0 (Linux; Android 16)'),
    '打开系统设置 > 网络和互联网，连接后返回 Silver Health。',
  );
  assert.equal(
    await connectionState.probeNetworkConnection(async () => new Response(null, { status: 204 })),
    true,
  );
  assert.equal(
    await connectionState.probeNetworkConnection(async () => new Response(null, { status: 503 })),
    false,
  );
  assert.equal(
    await connectionState.probeNetworkConnection(async () => { throw new TypeError('offline'); }),
    false,
  );
  assert.equal(
    await connectionState.probeNetworkConnection(() => new Promise<Response>(() => undefined), 1),
    false,
  );
});
