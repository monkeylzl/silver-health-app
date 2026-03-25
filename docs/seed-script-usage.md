# Seed Demo Data 使用说明

## 当前脚本
- `scripts/seed-demo-data.ts`

## 运行方式
```bash
pnpm seed:demo
```

## 运行前要求
- 本地数据库已可连接
- Prisma Client 已生成
- schema 已与数据库同步（至少基础表存在）

## 当前脚本行为
脚本会准备一套 demo / 联调数据，包括：
- elder user
- family user
- elder profile
- family binding
- daily tasks
- health metrics
- medication reminders
- weekly reports

## 当前策略
- user / profile / binding 使用查找或 upsert 思路
- tasks / metrics / medication reminders / weekly reports 使用“先删后建”的简单重建策略
- 目标是：快速得到一套稳定的 demo 数据

## 输出内容
脚本完成后会输出：
- elder user id
- family user id
- 推荐写入 `.env` 的 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`
- 各类插入数量

## 后续建议
如果后面需要更稳的幂等策略，可以再升级：
- 增加 `--reset`
- 增加固定 demo 标识
- 改为更细粒度的 upsert
