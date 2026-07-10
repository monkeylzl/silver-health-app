# Silver Health H5/PWA 上线检查清单

这份清单用于第一阶段 H5/PWA 可安装上线版，目标是跑通：

- 手机浏览器可访问；
- 可添加到主屏幕；
- Web 连接远程 API；
- API 连接远程 PostgreSQL；
- 演示老人 / 家属闭环可真实试用。

## 一、部署目标

- Web：Vercel
- API：Railway
- PostgreSQL：Railway PostgreSQL
- 第一阶段账号：固定演示老人 / 家属账号
- 第一阶段安装形态：H5/PWA，不做原生 App、小程序、服务端推送

## 二、Railway API / 数据库

### 1. 创建 Railway PostgreSQL

在 Railway 创建 PostgreSQL 后，复制连接串作为 API 服务的：

```env
DATABASE_URL="postgresql://..."
```

### 2. 部署 API

Railway 服务建议指向 monorepo 根目录，API 构建命令：

```bash
corepack pnpm --filter @silver-health/api build
```

API 启动命令：

```bash
corepack pnpm --filter @silver-health/api start
```

仓库根目录已经提供 `railway.json` 和 `Dockerfile.api`，Railway 使用 Dockerfile builder。`preDeployCommand` 执行数据库迁移，`startCommand` 只启动 API，健康检查路径为 `/api/health`。

### 3. Railway API 环境变量

```env
DATABASE_URL="postgresql://..."
PORT="3001"
CORS_ORIGIN="https://your-vercel-domain.vercel.app"
JWT_SECRET="replace-with-production-secret"
```

如果 Web 有多个域名，`CORS_ORIGIN` 用英文逗号分隔：

```env
CORS_ORIGIN="https://your-vercel-domain.vercel.app,https://your-custom-domain.com"
```

### 4. 初始化远程数据

远程数据库迁移和 seed 建议在受控终端执行：

```bash
corepack pnpm prisma:generate
corepack pnpm prisma:migrate:deploy
corepack pnpm seed:demo
corepack pnpm check:demo
```

执行成功后，记录 seed 输出里的默认老人 ID，并配置到 Vercel：

```env
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID="..."
```

### 5. 重置演示数据

当线上试用后任务状态、指标或周报被改动，可使用受控重置命令恢复演示账号数据：

```bash
DEMO_RESET_CONFIRM=RESET_DEMO_DATA corepack pnpm demo:reset
```

默认会执行：

1. `corepack pnpm seed:demo`
2. `corepack pnpm check:demo`
3. `corepack pnpm smoke:production`

本地只想恢复数据库、暂时不跑线上 smoke：

```bash
DEMO_RESET_CONFIRM=RESET_DEMO_DATA corepack pnpm demo:reset -- --skip-smoke
```

安全约束：

- 未设置 `DEMO_RESET_CONFIRM=RESET_DEMO_DATA` 时命令会拒绝执行；
- 执行前会打印脱敏后的 `DATABASE_URL`；
- 该命令会删除并重建演示老人关联的任务、指标、用药提醒和周报。

## 三、Vercel Web

### 1. 项目设置

Vercel Root Directory 建议设为：

```text
apps/web
```

仓库的 `apps/web/vercel.json` 已配置安装和构建命令。如果 Vercel UI 没有自动读取，手动填：

```bash
cd ../.. && corepack pnpm --filter @silver-health/web build
```

Install Command：

```bash
cd ../.. && corepack enable && corepack pnpm install --frozen-lockfile
```

Output 由 Next.js 自动处理。

当前 monorepo 已提供脚本化 prebuilt 部署命令：

```bash
corepack pnpm deploy:vercel
```

默认是 dry-run，只打印将要执行的步骤。确认无误后执行生产发布：

```bash
corepack pnpm deploy:vercel -- --execute
```

该命令会：

1. 在 `apps/web` 下执行 `vercel build --prod`；
2. 将 `apps/web/.vercel/project.json` 和 `apps/web/.vercel/output` 同步到仓库根 `.vercel`；
3. 从仓库根执行 `vercel deploy --prod --prebuilt`。

这样可以避免直接 `vercel deploy --cwd apps/web` 时只上传子目录、远端找不到 monorepo 根 `package.json` 的问题。

### 2. Vercel 环境变量

```env
NEXT_PUBLIC_API_BASE_URL="https://your-railway-api-domain"
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID="remote-seed-elder-id"
```

注意：`NEXT_PUBLIC_API_BASE_URL` 不要以 `/` 结尾。

当前 Railway API 已上线：

```env
NEXT_PUBLIC_API_BASE_URL="https://silver-health-api-production.up.railway.app"
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID="cmre5b56p0000ij0niccn6i4n"
```

## 四、PWA 验收

上线后用手机浏览器检查：

1. 打开 Vercel Web 首页；
2. 底部 Tab 显示：`今日 / 健康 / 家属 / 我的`；
3. 浏览器菜单可选择“添加到主屏幕”；
4. 从主屏幕打开后，页面以独立应用窗口打开；
5. 断网后刷新，能看到离线提示页；
6. 恢复网络后，今日、健康、家属页面能继续读取数据。
7. Application / Manifest 中能看到 `icon-192.png` 与 `icon-512.png`。

自动化手机视口回归：

```bash
corepack pnpm test:e2e:mobile
```

当前脚本默认检查线上 `https://web-nu-blond-89.vercel.app`，覆盖：

- 390x844 和 360x800 两个手机视口；
- `/` 今日工作台线上 demo 数据可见；
- `今日 / 健康 / 家属 / 我的` 四个底部 Tab 可点击切换；
- 当前 Tab `aria-current="page"` 激活态正确；
- 页面无横向滚动；
- 底部 Tab、主操作按钮、操作卡片和按钮高度不低于 44px。

如需检查其他环境：

```bash
E2E_BASE_URL="https://your-web-domain" corepack pnpm test:e2e:mobile
```

## 五、功能验收路径

上线后至少跑一遍：

1. `/` 今日工作台
   - 能看到今日任务；
   - 能完成一项任务；
   - 底部 Tab 不遮挡内容。
2. `/health` 健康中心
   - 能看到最近指标；
   - 能进入指标录入；
   - 能进入用药提醒。
3. `/family/dashboard` 家属看板
   - 能看到一句话近况；
   - 能看到任务 / 指标 / 用药摘要。
4. `/family/report` 家属周报
   - 能看到最近完整周周报。
5. `/me` 我的
   - 能看到演示账号；
   - 能看到 API 状态；
   - 能看到安装提示或已安装状态。

## 六、上线后自动冒烟

生产环境部署完成后执行：

```bash
corepack pnpm smoke:production
```

默认检查当前线上地址：

- Web：`https://web-nu-blond-89.vercel.app`
- API：`https://silver-health-api-production.up.railway.app`
- 默认老人账号：`cmre5b56p0000ij0niccn6i4n`

如需验证其他环境，可覆盖：

```bash
PRODUCTION_WEB_URL="https://your-web-domain" \
PRODUCTION_API_BASE_URL="https://your-api-domain" \
PRODUCTION_ELDER_USER_ID="your-elder-user-id" \
corepack pnpm smoke:production
```

验收标准：

- 输出 `Production smoke passed`；
- Web 首页、健康、家属、我的页面均返回 200；
- manifest、offline、service worker 均返回 200；
- 首页能看到四个底部 Tab、真实 API 状态和 seed 任务；
- API health、任务、指标、用药、周报接口均正常；
- CORS health 与 PATCH preflight 均通过。

## 七、GitHub Actions 手动门禁

仓库已提供手动 workflow：

```text
.github/workflows/release-gates.yml
```

在 GitHub 页面进入 `Actions` -> `Silver Health release gates` -> `Run workflow`。

默认输入：

- Web：`https://web-nu-blond-89.vercel.app`
- API：`https://silver-health-api-production.up.railway.app`
- 默认老人账号：`cmre5b56p0000ij0niccn6i4n`
- `run_production_smoke`：true
- `run_mobile_e2e`：true
- `run_vercel_dry_run`：true

workflow 会执行：

1. 安装依赖并生成 Prisma Client；
2. Web typecheck；
3. Web production build；
4. API production build；
5. `test:demo-reset-utils`；
6. `test:smoke-utils`；
7. `test:vercel-deploy-utils`；
8. `test:github-workflow`；
9. 可选 `smoke:production`；
10. 可选安装 Playwright Chromium 并执行 `test:e2e:mobile`；
11. 可选 `deploy:vercel` dry-run。

注意：

- 这个 workflow 不会执行生产部署，只做 `deploy:vercel` dry-run；
- 真正发版仍需本地或受控环境执行 `corepack pnpm deploy:vercel -- --execute`；
- 线上 smoke 和 E2E 使用 workflow 输入的 Web/API/elder id，可用于正式环境或预发环境。

## 八、上线前本地校验

```bash
corepack pnpm --filter @silver-health/web typecheck
corepack pnpm --filter @silver-health/web build
corepack pnpm --filter @silver-health/api build
corepack pnpm demo:ready
corepack pnpm test:e2e:mobile
corepack pnpm test:e2e:local-write
corepack pnpm test:demo-reset-utils
corepack pnpm test:github-workflow
corepack pnpm test:local-e2e-utils
corepack pnpm test:smoke-utils
corepack pnpm test:vercel-deploy-utils
```

本地写入型 E2E：

```bash
corepack pnpm test:e2e:local-write
```

该命令会重置本地 demo 数据、启动本地 API/Web，并验证：

- 老人首页可完成一项任务；
- 健康指标页可保存一条血压；
- 用药提醒页可保存一条启用中的提醒；
- 家属绑定页可提交默认家属账号绑定申请；
- 家属看板能同步看到任务完成数、最新血压和新增用药提醒。

默认端口：

- API：`http://127.0.0.1:3201`
- Web：`http://127.0.0.1:3200`

如端口被占用：

```bash
E2E_LOCAL_API_PORT=4201 E2E_LOCAL_WEB_PORT=4200 corepack pnpm test:e2e:local-write
```

如果遇到 Next dev 缓存错误，例如 `.next/server/...` 或 `Cannot find module './xxx.js'`：

```bash
# 先停掉正在运行的 next-server，再清缓存
rm -rf apps/web/.next
pnpm dev:web
```
