# Silver Health 移动端应用产品化重点技术详解

## 1. 为什么采用 BFF

旧版本浏览器直接访问 Railway，默认老人 ID 暴露在 `NEXT_PUBLIC_*` 环境变量和表单中。任何知道 API 地址和 ID 的访问者都可以调用写接口。

新版本把写入集中到 Next Route Handler：

- 浏览器只持有签名体验会话；
- 老人 ID 与内部 API 密钥只在 Vercel 服务端；
- Railway 业务接口只信任携带内部密钥的服务端请求；
- 未来切换真实账号时，可把固定 ID 注入替换为当前会话用户，不需要重写所有表单。

## 2. scrypt 口令哈希

体验口令哈希采用：

- cost：16384；
- block size：8；
- parallelization：1；
- key length：64；
- 每次生成随机 16 字节 salt。

生产环境只保存编码结果。验证时重新派生并使用 `timingSafeEqual` 比较，错误口令和无效格式统一返回 401。

公开会话接口还执行三层约束：流式读取请求体并在超过 1KB 时立即取消、口令不超过 128 字符、来源 IP 每分钟最多尝试 8 次。限流判断在 scrypt 前同步完成，成功登录后清理当前窗口。生产环境再由 Vercel Firewall 对 `/api/session` 执行跨实例全局限流，应用内 Map 只承担纵深防护。

## 3. Edge 可用的 HMAC 会话

Next Middleware 可能运行在 Edge 环境，不能依赖所有 Node `crypto` API。因此会话签名使用标准 Web Crypto：

1. 序列化 `{ exp }`；
2. base64url 编码 payload；
3. HMAC-SHA256 签名；
4. 形成 `payload.signature`；
5. 验证签名后再检查 `exp`。

口令哈希与会话签名拆成两个模块：前者只在 Node Route Handler 使用，后者可以被 Middleware 使用。

## 4. API Guard

API 启动时：

- 配置 `INTERNAL_API_KEY`：注册全局 Guard；
- 生产环境未配置：启动失败；
- 本地未配置：允许旧开发方式，但正式本地 E2E 始终配置密钥。

Guard 仅放行 `GET /api/health`。请求头缺失、长度不同或内容错误均返回 401。

## 5. 任务状态幂等

`buildTaskStatusUpdate` 集中定义状态写入：

```text
done -> status=done, completedAt=当前时间
todo -> status=todo, completedAt=null
其他状态 -> 拒绝
```

服务先读取当前任务；若目标状态已经是 `done`，直接返回原记录。状态转换使用带 `elderUserId` 和旧状态条件的 `updateMany`，并发请求中只有第一个能从 `todo` 改为 `done`，其余请求读取并返回同一条结果，因此 `completedAt` 不会被并发改写。撤销时清空 `completedAt`，家人页完成数跟随真实状态更新。

## 6. 用药提醒管理

新增 `UpdateMedicationReminderDto`，所有字段可选但继续执行格式验证：

- 药品名最长 128；
- 说明最长 64；
- 时间为 `HH:mm`；
- 频率最长 32；
- enabled 为布尔值。

更新和删除前先查询记录，并校验其 `elderUserId` 与 BFF 服务端注入的固定老人 ID 相同；不存在或不属于当前老人都返回 404。前端删除前调用系统确认框，成功后立即从本地列表移除并刷新服务端页面。

## 7. Next Router 数据失效

仅使用 `cache: no-store` 不能完全避免客户端预取结果。一次指标保存后，跳转目标可能已经在 Router Cache 中。

因此写入 BFF 在成功后执行 `revalidatePath`，失效所有受影响页面。该逻辑属于写入边界，不依赖每个组件自行记住刷新哪些页面。

## 8. 错误信息分层

```mermaid
flowchart LR
  DB["数据库/Nest 错误"] --> API["HTTP status"]
  API --> Map["friendlyApiMessage"]
  Map --> UI["中文可操作提示"]
```

映射示例：

- 400：填写内容有误，请检查后重试；
- 401/403：健康服务认证失败，请联系管理员；
- 404：相关记录不存在或已经更新；
- 409：内容已变化，请刷新；
- 5xx：健康服务暂时不可用。

上游 message 仅用于内部判断，不直接显示。

## 9. 响应式导航实现

应用同时渲染底部导航和侧栏，通过媒体查询决定可见性：

- `<768px`：底部导航固定，侧栏隐藏；
- `768-1023px`：底栏隐藏，88px 侧栏；
- `>=1024px`：232px 侧栏，显示品牌和文字。

主内容只在存在 `.app-navigation-root` 时增加左边距，因此 `/access` 不会留下侧栏空白。

## 10. 适老化交互

- 首页只保留一个下一步和两个快捷入口。
- 完整任务列表放到二级页，首页最多三条。
- 表单移动端单列，输入字号 16px，避免 iOS 自动缩放。
- 保存按钮全宽且至少 48px。
- 任务完成可撤销，错误后恢复乐观更新前状态。
- 家人页先给摘要，不先展示原始数据列表。

## 11. 指标时间与时区

业务展示统一使用 `Asia/Shanghai`。E2E 不假设“当前提交一定晚于 seed 晨间记录”，而是读取现有最新 `measuredAt`，再填写一个更晚时间，避免午夜运行时出现错误排序断言。

## 12. Service Worker 防止越权缓存

旧策略在 install 阶段缓存 `/`，未登录请求可能把口令页重定向结果缓存成首页。

新策略：

- install 只预缓存公开静态资源；
- 受保护页面访问成功后才动态缓存；
- 响应最终路径必须与请求路径一致，重定向到 `/access` 不缓存；
- 退出时删除动态页面缓存；
- `/api/*` 从不缓存。
- `_rsc` 响应只进入 `PAGE_CACHE`，不会进入不可随退出清理的 `STATIC_CACHE`。

生产模式 E2E 使用 `next build + next start`，确保 `PwaRegister` 和真实 Service Worker 均参与验证。注册组件会在页面已经完成 `load` 时立即注册，否则只监听一次未来的 `load`，避免 hydration 晚于 load 导致永不注册。

## 13. 自动化中的 localhost 统一

Next 客户端导航可能把本地地址规范化到 `localhost`。若 E2E 首次访问使用 `127.0.0.1`，Cookie 会绑定到不同主机并在导航后丢失。

最终约定：

- Web E2E：`http://localhost:<port>`；
- API E2E：`http://127.0.0.1:<port>`；
- CORS origin 与 Web 地址一致。

该规则由 `local-e2e-utils.test.ts` 固定，防止回归。
