# PWA Launch Deployment Record

记录第一阶段 H5/PWA 可安装上线版的实际部署状态、验证命令和非敏感配置。数据库连接串、Railway 内部变量值等敏感信息不写入文档。

## 1. 当前部署状态

| 模块 | 平台 | 状态 | 说明 |
| --- | --- | --- | --- |
| API | Railway | 已上线 | `silver-health-api` 服务已通过 `/api/health` 健康检查 |
| PostgreSQL | Railway | 已上线 | 远程库已执行迁移和演示数据 seed |
| Web | Vercel | 待发布 | 等待 Vercel CLI 设备登录授权后发布生产部署 |

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
- 当前 API Deployment ID：`5ee96701-2f27-4cf6-8b13-f91e6e7a4119`

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

Web 生产环境应配置：

```env
NEXT_PUBLIC_API_BASE_URL="https://silver-health-api-production.up.railway.app"
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID="cmre5b56p0000ij0niccn6i4n"
```

## 4. 已执行线上验证

```bash
curl -sS https://silver-health-api-production.up.railway.app/api/health
curl -sS https://silver-health-api-production.up.railway.app/api/profile/elder/cmre5b56p0000ij0niccn6i4n
curl -sS https://silver-health-api-production.up.railway.app/api/tasks/elder/cmre5b56p0000ij0niccn6i4n
curl -sS https://silver-health-api-production.up.railway.app/api/metrics/elder/cmre5b56p0000ij0niccn6i4n
curl -sS https://silver-health-api-production.up.railway.app/api/medications/elder/cmre5b56p0000ij0niccn6i4n
curl -sS https://silver-health-api-production.up.railway.app/api/reports/elder/cmre5b56p0000ij0niccn6i4n
```

验证结果：

- `/api/health` 返回 `code=0`，`status=running`。
- 老人档案返回 `李阿姨`。
- 今日任务默认查询返回 4 条任务。
- 健康指标返回血压、血糖、体重 3 条记录。
- 用药提醒返回氨氯地平、二甲双胍 2 条启用提醒。
- 周报返回最近两周演示周报。

## 5. 本地验证记录

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

## 6. 本轮关键修复

### Next.js 安全升级

Railway 构建安全扫描阻止了 `next@15.3.2`，本轮升级到 `next@15.3.8` 并更新 `pnpm-lock.yaml`。

### Railway 容器启动

API 必须监听 `0.0.0.0`，否则 Railway 容器健康检查无法从外部访问：

```ts
await app.listen(port, '0.0.0.0');
```

### 今日任务时区

Railway 部署区域使用 UTC 时间时，默认 `new Date()` 会让中国日期的“今日任务”在早晨前后查空。`TaskService` 现在将默认任务日期固定到 `Asia/Shanghai` 业务日期，再按 date-only 边界查询，保证首屏今日工作台能拿到当天任务。

## 7. 待完成

1. 完成 Vercel CLI 设备登录授权。
2. 发布 Vercel Web 生产部署。
3. 将 Vercel 域名回填到 Railway `CORS_ORIGIN`。
4. 用线上 Web 验证四个底部 Tab 和主要数据页。
