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

## 六、上线前本地校验

```bash
corepack pnpm --filter @silver-health/web typecheck
corepack pnpm --filter @silver-health/web build
corepack pnpm --filter @silver-health/api build
corepack pnpm demo:ready
```

如果遇到 Next dev 缓存错误，例如 `.next/server/...` 或 `Cannot find module './xxx.js'`：

```bash
# 先停掉正在运行的 next-server，再清缓存
rm -rf apps/web/.next
pnpm dev:web
```
