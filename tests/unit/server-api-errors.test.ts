import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { friendlyApiMessage } from '../../apps/web/lib/api-error-message.ts';

describe('server api error messages', () => {
  it('does not expose upstream technical messages for common failures', () => {
    assert.equal(friendlyApiMessage(404, 'elder profile not found for userId=secret'), '相关记录不存在或已经更新。');
    assert.equal(friendlyApiMessage(401, 'app access denied'), '健康服务认证失败，请联系管理员。');
    assert.equal(friendlyApiMessage(500, 'database connection refused'), '健康服务暂时不可用，请稍后重试。');
  });

  it('uses a clear validation message for invalid input', () => {
    assert.equal(friendlyApiMessage(400, 'remindTime must match'), '填写内容有误，请检查后重试。');
  });
});
