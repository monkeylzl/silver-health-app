# PWA Launch Deployment Record

记录第一阶段 H5/PWA 可安装上线版的实际部署状态、验证命令和非敏感配置。数据库连接串、Railway 内部变量值等敏感信息不写入文档。

## 1. 当前部署状态

| 模块 | 平台 | 状态 | 说明 |
| --- | --- | --- | --- |
| API | Railway | 已上线 | `silver-health-api` 服务已通过 `/api/health` 健康检查 |
| PostgreSQL | Railway | 已上线 | 远程库已执行迁移和演示数据 seed |
| Web | Vercel | 已上线 | 生产别名已发布，首页能读取远程 API 演示数据 |

## 2. Railway 实际配置

- Workspace：`zhongliang liu (monkeylzl)'s Projects`
- Project：`heartfelt-transformation`
- Project ID：`28f1f161-3ea7-441e-9417-34a1a3b713dc`
- Environment：`production`
- Environment ID：`df21c7f8-b3f8-44db-bcf0-17e6650e04b2`
- API Service：`silver-health-api`
- API Service ID：`47736af2-df6e-4799-a9b3-180fd9838413`
- PostgreSQL Service：`Postgres`
- PostgreSQL Service ID：`f2d5b80c-2cad-4b0d-971d-0bbaf0e520c9`
- API URL：`https://silver-health-api-production.up.railway.app`
- 当前 API Deployment ID：`bb4ad807-475c-4d51-aefe-2e66b9f00773`
- CORS Origin：`https://web-nu-blond-89.vercel.app`

Railway API 采用仓库根目录的 `Dockerfile.api` 构建，`railway.json` 使用 Dockerfile builder。迁移放在 `preDeployCommand` 中执行，应用启动命令只负责启动 Nest API，避免迁移命令常驻导致健康检查卡住。

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.api"
  },
  "deploy": {
    "preDeployCommand": "corepack pnpm prisma:migrate:deploy",
    "startCommand": "corepack pnpm --filter @silver-health/api start",
    "healthcheckPath": "/api/health"
  }
}
```

## 3. 远程演示数据

远程 Railway PostgreSQL 已使用现有 seed 脚本生成第一阶段演示账号。

- 默认老人账号 ID：`cmre5b56p0000ij0niccn6i4n`
- 默认家属账号 ID：`cmre5b5i60001ij0nnirssomm`
- 今日任务：4 条
- 最近指标：3 条
- 用药提醒：2 条
- 家属周报：2 条

Web 生产环境应配置以下服务端变量；敏感值不得使用 `NEXT_PUBLIC_*`：

```env
API_BASE_URL="https://silver-health-api-production.up.railway.app"
DEFAULT_ELDER_USER_ID="cmre5b56p0000ij0niccn6i4n"
TRIAL_ACCESS_CODE_HASH="<scrypt-hash>"
TRIAL_SESSION_SECRET="<secret>"
INTERNAL_API_KEY="<same-as-railway>"
```

Vercel 项目已持久化以上 production 环境变量。口令哈希、会话密钥和内部密钥均按敏感变量管理。

## 4. Vercel 实际配置

- Team / Scope：`monkeylzls-projects`
- Project：`web`
- Production Alias：`https://web-nu-blond-89.vercel.app`
- Deployment URL：`https://web-n4kc2w0q3-monkeylzls-projects.vercel.app`
- Deployment ID：`dpl_5qZGfBzJFcq9HvnxmdVS3V9uwoFK`
- Inspect URL：`https://vercel.com/monkeylzls-projects/web/5qZGfBzJFcq9HvnxmdVS3V9uwoFK`

CLI 部署使用本地 prebuilt 流程，已固化为：

```bash
corepack pnpm deploy:vercel -- --execute
```

等价核心流程：

```bash
NEXT_PUBLIC_API_BASE_URL="https://silver-health-api-production.up.railway.app" \
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID="cmre5b56p0000ij0niccn6i4n" \
corepack pnpm dlx vercel build --cwd apps/web --prod --yes

corepack pnpm dlx vercel deploy --prod --prebuilt --yes
```

说明：直接 `vercel deploy --cwd apps/web` 会只上传 `apps/web` 子目录，导致远端执行 `cd ../..` 后找不到 monorepo 根目录 `package.json`。因此本次使用本地 `vercel build` 生成 `.vercel/output` 后，从仓库根目录上传 prebuilt 产物。

## 5. 已执行线上验证

```bash
curl -sS https://silver-health-api-production.up.railway.app/api/health
curl -sS -H "X-Silver-App-Key: $INTERNAL_API_KEY" https://silver-health-api-production.up.railway.app/api/profile/elder/cmre5b56p0000ij0niccn6i4n
curl -sS -H "X-Silver-App-Key: $INTERNAL_API_KEY" https://silver-health-api-production.up.railway.app/api/tasks/elder/cmre5b56p0000ij0niccn6i4n
curl -sS -H "X-Silver-App-Key: $INTERNAL_API_KEY" https://silver-health-api-production.up.railway.app/api/metrics/elder/cmre5b56p0000ij0niccn6i4n
curl -sS -H "X-Silver-App-Key: $INTERNAL_API_KEY" https://silver-health-api-production.up.railway.app/api/medications/elder/cmre5b56p0000ij0niccn6i4n
curl -sS -H "X-Silver-App-Key: $INTERNAL_API_KEY" https://silver-health-api-production.up.railway.app/api/reports/elder/cmre5b56p0000ij0niccn6i4n
```

验证结果：

- `/api/health` 返回 `code=0`，`status=running`。
- 老人档案返回 `李阿姨`。
- 今日任务默认查询返回 4 条任务。
- 健康指标返回血压、血糖、体重 3 条记录。
- 用药提醒返回氨氯地平、二甲双胍 2 条启用提醒。
- 周报返回最近两周演示周报。

Web 验证：

```bash
curl -sS -I https://web-nu-blond-89.vercel.app
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/health
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/family/dashboard
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/family/report
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/me
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/manifest.webmanifest
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/offline.html
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://web-nu-blond-89.vercel.app/sw.js
```

验证结果：

- 首页返回 `200 text/html`。
- `/health`、`/family/dashboard`、`/family/report`、`/me` 均返回 `200 text/html`。
- `manifest.webmanifest` 返回 `200 application/manifest+json`。
- `offline.html` 返回 `200 text/html`。
- `sw.js` 返回 `200 application/javascript`。
- 首页 HTML 能看到 `今日 / 健康 / 家属 / 我的` 四个底部 Tab。
- 首页 HTML 能看到 `当前接入：真实 API`。
- 首页 HTML 能看到远程任务 `晨间散步 20 分钟` 和 `记录今日血压`。

CORS 验证：

```bash
curl -i \
  -H "Origin: https://web-nu-blond-89.vercel.app" \
  https://silver-health-api-production.up.railway.app/api/health

curl -i -X OPTIONS \
  -H "Origin: https://web-nu-blond-89.vercel.app" \
  -H "Access-Control-Request-Method: PATCH" \
  -H "Access-Control-Request-Headers: content-type" \
  https://silver-health-api-production.up.railway.app/api/tasks/cmre5b6la0006ij0nf02a6kzm/complete
```

验证结果：

- API 返回 `access-control-allow-origin: https://web-nu-blond-89.vercel.app`。
- PATCH 预检返回 `204`。
- `access-control-allow-methods` 包含 `GET,HEAD,PUT,PATCH,POST,DELETE`。

移动端视口验证：

- 390x844：无横向滚动，底部 Tab 固定在底部，底部 Tab 高度 56px，主操作按钮高度 48px。
- 360x800：无横向滚动，底部 Tab 固定在底部，底部 Tab 高度 56px，主操作按钮高度 48px。

## 6. 本地验证记录

```bash
corepack pnpm --filter @silver-health/web typecheck
corepack pnpm --filter @silver-health/web build
corepack pnpm --filter @silver-health/api build
corepack pnpm demo:ready
```

当前验证结果：

- Web typecheck：通过。
- Web production build：通过。
- API build：通过。
- `demo:ready`：本地首次检查发现当天任务为空，自动执行 `seed:demo` 后复查通过。

## 7. 本轮关键修复

### Next.js 安全升级

Railway 构建安全扫描阻止了 `next@15.3.2`，本轮升级到 `next@15.3.8` 并更新 `pnpm-lock.yaml`。

### Railway 容器启动

API 必须监听 `0.0.0.0`，否则 Railway 容器健康检查无法从外部访问：

```ts
await app.listen(port, '0.0.0.0');
```

### 今日任务时区

Railway 部署区域使用 UTC 时间时，默认 `new Date()` 会让中国日期的“今日任务”在早晨前后查空。`TaskService` 现在将默认任务日期固定到 `Asia/Shanghai` 业务日期，再按 date-only 边界查询，保证首屏今日工作台能拿到当天任务。

## 8. 待优化项

1. 将 Vercel 项目名从默认 `web` 调整为更清晰的 `silver-health-app-web`。
2. 将 Vercel CLI prebuilt 部署流程整理成脚本，避免 monorepo 子目录上传路径再次踩坑。
3. 增加端到端测试，覆盖“完成任务”“录入指标”“查看家属看板”的真实交互。
4. 增加线上 seed/重置演示数据的受控脚本，方便演示前恢复默认状态。

## 9. 2026-07-10 平台侧复核

PR #1 合并到 `main` 并清理旧 feature 分支后，对当前生产平台做了一次非破坏性复核。

### Vercel

```bash
corepack pnpm dlx vercel whoami
corepack pnpm dlx vercel inspect https://web-nu-blond-89.vercel.app
```

复核结果：

- Vercel CLI 登录账号：`monkeylzl`。
- 生产别名：`https://web-nu-blond-89.vercel.app`。
- 当前生产部署：`dpl_8AkzX95njUQTcCHh9qUzrDjx6D4V`。
- 部署状态：`Ready`。
- 部署目标：`production`。
- 创建时间：`2026-07-10 12:33:34 +0800`。

### Railway

```bash
railway whoami
railway status
railway logs --deployment e78cd36c-000b-4b74-9c21-326f11304a20 --lines 80
```

复核结果：

- Railway CLI 登录账号：`zhongliang liu (monkeylzl)`。
- Workspace：`zhongliang liu (monkeylzl)'s Projects`。
- Project：`heartfelt-transformation`。
- Environment：`production`。
- API Service：`silver-health-api`。
- API URL：`https://silver-health-api-production.up.railway.app`。
- 当前 API Deployment ID：`e78cd36c-000b-4b74-9c21-326f11304a20`。
- 服务状态：`Online`。
- 日志显示 `prisma migrate deploy` 已执行，结果为 `No pending migrations to apply`。

- 日志显示 Nest API 已完成路由映射并输出 `Nest application successfully started`。

Railway 环境变量已通过 CLI 复核，但文档只记录非敏感结论：

- `NODE_ENV=production`。
- `PORT=3001`。
- `CORS_ORIGIN=https://web-nu-blond-89.vercel.app`。
- `DATABASE_URL` 已配置为 Railway 内部 PostgreSQL 地址，具体值不写入仓库。

### 线上 Smoke

```bash
corepack pnpm smoke:production
```

复核结果：

- 17 项检查通过。
- Web 覆盖 `/`、`/health`、`/family/dashboard`、`/family/report`、`/me`。
- PWA 覆盖 `manifest.webmanifest`、`offline.html`、`sw.js`。
- API 覆盖健康检查、任务、指标、用药、周报。
- CORS 覆盖健康检查 origin 和 PATCH preflight。
- 首页能读取真实 API，并能看到 seeded 任务。

## 10. 2026-07-11 发布门禁与回滚演练

### GitHub 生产门禁

- Workflow：`Silver Health release gates`；
- 成功运行：`29155708921`；
- 提交：`a6479f1`；
- 结果：Web/API 构建、类型检查、工具测试、17 项生产 smoke、20 项手机/Pad/无障碍测试、完整写入闭环、2 项离线测试和 Vercel prebuilt dry-run 全部通过；
- GitHub Secrets：仅配置 `PRODUCTION_TRIAL_ACCESS_CODE` 与 `PRODUCTION_INTERNAL_API_KEY`，日志不输出值。

门禁期间发现写入成功后 Service Worker 仍可能返回旧页面缓存。修复后所有 `/api/app/*` 写请求成功时清除动态页面缓存，缓存版本升级为 `silver-health-pages-v6`；完整写入 E2E 从等待超时恢复为 3.2 秒通过。

### Vercel 回滚与恢复

1. 发布并验证最新部署 `dpl_5qZGfBzJFcq9HvnxmdVS3V9uwoFK`；
2. 回滚到上一稳定部署 `dpl_AWSzr16MqsaMt8DpDXYxTVP93cbV`；
3. 回滚后执行 17 项 production smoke，全部通过；
4. 使用 `vercel promote` 恢复 `dpl_5qZGfBzJFcq9HvnxmdVS3V9uwoFK`；
5. 确认线上 `/sw.js` 为 `silver-health-pages-v6`，恢复后 17 项 smoke 再次通过。

### Railway 回滚与恢复

1. 原稳定部署：`91b8ea9f-e1ee-4727-843f-7e83b59aec52`；
2. 从 Railway 历史部署执行回滚，生成部署 `209a0942-1e07-444e-9bf9-5a96ecc55d69`；
3. 回滚部署状态为 `SUCCESS`，17 项 production smoke 全部通过；
4. 回滚到产品化版本 `91b8ea9f-e1ee-4727-843f-7e83b59aec52` 的构建与变量快照，生成恢复部署 `bb4ad807-475c-4d51-aefe-2e66b9f00773`；
5. 恢复部署状态为 `SUCCESS`，最终 17 项 production smoke 全部通过。

Railway 的历史回滚会同时恢复构建和变量快照，因此恢复后必须重新验证 Web BFF、内部密钥、数据读取与 CORS，不可只检查 `/api/health`。
