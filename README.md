# silver-health-app

老年健康管理项目的代码实现仓骨架（MVP 导向）。

## 当前状态

- 已完成：项目目录初始化
- 未开始：具体前后端脚手架安装、Prisma schema 编写、业务模块开发
- 目标：严格依据现有产品/研发文档，按 MVP 闭环快速落地

## 文档来源

主文档目录：

- `/Users/liuzhongliang/.openclaw/agents/main/workspace/lzl_ideas/silver_health/`

本仓启动时重点依据以下文档：

- `2026-03-25-开发可交付版PRD-V2-老年健康管理项目.md`
- `2026-03-25-接口定义文档-V1-老年健康管理项目.md`
- `2026-03-25-数据库设计文档-V1-老年健康管理项目.md`
- `2026-03-25-技术栈建议-V1-老年健康管理项目.md`
- `2026-03-25-前后端项目初始化方案-V1-老年健康管理项目.md`
- `2026-03-25-开发启动说明-README.md`

## 当前建议技术方案

遵循文档建议，不额外做偏离 MVP 的架构选择：

- 前端：Next.js（老人端 + 家属端共用一个 web 应用）
- 后端：NestJS
- 数据库：PostgreSQL
- ORM：Prisma
- 包管理：pnpm
- 工程组织：monorepo

## 目录结构

```text
silver-health-app/
├── apps/
│   ├── web/      # 老人端 + 家属端
│   ├── admin/    # 管理后台（后置，可先保留目录）
│   └── api/      # NestJS 后端
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── utils/
├── prisma/
└── docs/
```

## 建议开发顺序

1. 初始化 monorepo 基础文件（package.json / pnpm-workspace / turbo）
2. 初始化 `apps/api`（NestJS）
3. 初始化 `prisma/schema.prisma` 与数据库连接
4. 初始化 `apps/web`（Next.js）
5. 先打通建档链路：
   - `POST /api/profile/elder`
   - `GET /api/profile/elder/:userId`
   - 前端 `/elder/profile`
6. 再推进今日任务首页、指标录入、家属绑定与摘要

## 当前原则

- 以 MVP 闭环优先，不做过度工程化
- 不引入微服务、GraphQL、复杂事件总线等超前设计
- 先保证“建档 -> 今日任务 -> 指标录入 -> 家属查看 -> 周报”主链路可落地

## 下一步待执行

如果继续由 coding 接手，建议直接开始：

- 初始化 monorepo 基础配置
- 初始化 NestJS + Prisma
- 落第一版 Prisma schema
- 搭建 elder-profile 模块与建档接口
