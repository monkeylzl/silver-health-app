# Silver Health 本地开发说明

## 1. 环境要求
- Node.js 24+
- `corepack` 可用
- PostgreSQL 本地可访问

## 2. 安装依赖
```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install
```

## 3. 环境变量
根目录 `.env.example`：
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`

API 目录 `apps/api/.env.example`：
- `DATABASE_URL`
- `PORT`
- `JWT_SECRET`

建议：
- 根目录复制一份 `.env`
- `apps/api` 目录复制一份 `.env`

## 4. Prisma Client
```bash
pnpm prisma:generate
```

## 5. 启动 API
```bash
pnpm dev:api
```
默认端口：`3001`

健康检查：
- `GET http://localhost:3001/api/health`

## 6. 启动 Web
```bash
pnpm dev:web
```
默认地址通常为：
- `http://localhost:3000`

当前建档页：
- `http://localhost:3000/elder/profile`

## 7. 当前已接通的联调入口
- `GET /api/profile/elder/:userId`
- `POST /api/profile/elder`
- 前端页面 `/elder/profile`

## 8. 当前限制
- 还未完成 migration
- 还未补 DTO 校验
- `elder profile` 当前依赖已有 `userId`，后续还需收敛“建档时如何创建/绑定 user”的策略
