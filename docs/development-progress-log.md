# Silver Health 开发过程归档

> 用途：持续记录 `silver-health-app` 的实际开发推进过程。
>
> 规则：
> - 每完成一步，就把**做了什么、遇到什么问题、如何修正、当前状态、下一步**写入这里；
> - 这份文档保留详细过程；
> - 当日 `memory/YYYY-MM-DD.md` 只保留精简归纳；
> - 对外回复和 commit 信息以这份文档为事实基线，避免口头描述与实际落盘不一致。

---

## 2026-03-25

### 0. 本次工作目标
- 将 `silver_health` 从“文档准备阶段”推进到“代码仓骨架已建立、已推送、可继续联调开发”的状态。
- 明确项目目录归属：后续在 `coding` agent 的 workspace 下独立维护，并作为单独 GitHub 仓库推进。

---

### 1. 初始文档阅读与落地方向确认

#### 已阅读的研发输入文档
- 开发可交付版 PRD V2
- 接口定义文档 V1
- 数据库设计文档 V1
- 技术栈建议 V1
- 前后端项目初始化方案 V1
- 开发启动说明 README

#### 得出的工程方向
- 采用 monorepo
- Web：Next.js
- API：NestJS
- DB：PostgreSQL
- ORM：Prisma
- 包管理：pnpm
- 实施策略：MVP 优先，先打主链路，不做复杂扩展

#### MVP 主链路判断
优先顺序：
1. 老人建档
2. 今日任务
3. 健康指标录入
4. 家属绑定 / 家属查看
5. 周报

---

### 2. 项目目录初始化与路径调整

#### 最早创建的项目目录
最初项目曾先落到：
- `/Users/liuzhongliang/.openclaw/workspace/silver-health-app`

#### 后续根据主会话要求做的路径迁移
之后曾迁移到：
- `/Users/liuzhongliang/.openclaw/agents/main/workspace/lzl_ideas/silver_health/silver-health-app`

#### 当前最终确认的正式目录
根据用户后续明确要求：
- 项目应放在 `coding` agent 的 workspace 下
- 作为独立 GitHub 工程维护

因此当前最终目录为：
- `/Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app`

#### 目录迁移时保留的内容
迁移过程中保留了：
- `README.md`
- `docs/dev-kickoff-summary.md`
- `prisma/schema.prisma`
- monorepo 基础文件
- `apps/api` 第一版骨架

---

### 3. Monorepo 第一版初始化

#### 已创建的根级文件
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `.gitignore`
- `.env.example`

#### 根级配置目标
- 用 `pnpm workspace` 管理 `apps/*` 和 `packages/*`
- 用 Turbo 统一管理 `dev / build / lint / typecheck`
- 为后续 `web / api / packages` 扩展留足空间

#### 当前目录骨架
```text
silver-health-app/
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── utils/
├── prisma/
└── docs/
```

---

### 4. Prisma Schema 第一版

#### 已创建文件
- `prisma/schema.prisma`

#### 已落模型
- `User`
- `ElderProfile`
- `FamilyBinding`
- `DailyTask`
- `HealthMetric`
- `MedicationReminder`
- `WeeklyReport`

#### 已落主要枚举
- `UserRole`
- `UserStatus`
- `Gender`
- `MobilityLevel`
- `HelperMode`
- `BindingRelationType`
- `BindingStatus`
- `TaskType`
- `TaskPriority`
- `TaskStatus`
- `TaskSourceType`
- `MetricType`
- `MetricCreatedByRole`

#### 设计策略
- 先覆盖 MVP 主链路核心数据结构
- 不超前引入通知中心、复杂日志、事件流等第二阶段对象
- 字段命名尽量贴近现有产品/数据库文档

---

### 5. API 第一版初始化

#### 已创建的 API 基础文件
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/nest-cli.json`
- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/app.controller.ts`
- `apps/api/src/app.service.ts`
- `apps/api/src/prisma/prisma.module.ts`
- `apps/api/src/prisma/prisma.service.ts`

#### 基础能力
- Nest 启动入口已建立
- 全局前缀已设置为 `/api`
- 健康检查接口已存在：`GET /api/health`
- PrismaService 已接入项目结构

---

### 6. 第一批业务模块骨架

#### 已完成模块
1. `user`
2. `elder-profile`
3. `family-binding`
4. `task`
5. `metric`
6. `medication`
7. `report`

#### 每个模块当前状态
- 已建立 `module / controller / service`
- 关键模块已补 DTO
- 已在 `app.module.ts` 中接入
- 已与 PrismaService 对接
- 当前以“可继续扩展的第一版骨架”为主，不追求一次到位

#### 当前已具备的接口骨架
- `GET /api/health`
- `POST /api/users`
- `GET /api/users/:id`
- `POST /api/profile/elder`
- `GET /api/profile/elder/:userId`
- `PATCH /api/profile/elder/:userId`
- `POST /api/family-bindings`
- `GET /api/family-bindings/elder/:elderUserId`
- `POST /api/tasks`
- `GET /api/tasks/elder/:elderUserId`
- `POST /api/metrics`
- `GET /api/metrics/elder/:elderUserId`
- `POST /api/medications`
- `GET /api/medications/elder/:elderUserId`
- `GET /api/reports/elder/:elderUserId`

#### 当前意义
- API 已从“空目录”推进到“主模块已占位、接口形状可继续收敛”的阶段
- 下一步可以直接围绕建档、任务、指标录入和家属摘要继续打通

---

### 7. Web 第一版路由骨架

#### 已创建 Web 基础文件
- `apps/web/package.json`
- `apps/web/tsconfig.json`
- `apps/web/next-env.d.ts`
- `apps/web/next.config.ts`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`

#### 已创建路由页面
- `apps/web/app/elder/profile/page.tsx`
- `apps/web/app/elder/home/page.tsx`
- `apps/web/app/elder/metrics/page.tsx`
- `apps/web/app/elder/medication/page.tsx`
- `apps/web/app/family/bind/page.tsx`
- `apps/web/app/family/dashboard/page.tsx`
- `apps/web/app/family/report/page.tsx`

#### 当前意义
- 老人端 / 家属端主页面路径已落位
- 后续可直接在这些页面上接真实表单、列表和接口联调

---

### 8. Git 独立仓库初始化与远端关联

#### 用户指定远端仓库
- `git@github.com:monkeylzl/silver-health-app.git`

#### 实际执行结果
- 已在 `silver-health-app` 目录内初始化为独立 Git 仓库
- 已切到 `main` 分支
- 已关联 `origin`
- 已成功推送到 GitHub

#### 已推送提交
1. `chore: initialize silver health app skeleton`
2. `feat: scaffold web routes and api modules`

#### 说明
这一步确保：
- 该项目后续可以独立于外层 workspace 仓库维护
- 后续所有 commit / push 都只针对本项目仓库进行

---

### 9. 依赖安装、Prisma 生成与类型校验

#### 实际执行的动作
1. 尝试执行 `pnpm install`
2. 发现 shell 环境中 `pnpm` 不可直接用
3. 使用 `corepack` 激活 `pnpm@10.0.0`
4. 重新执行 `pnpm install`
5. 执行 Prisma Client 生成
6. 执行 `apps/api` 与 `apps/web` 的 typecheck

#### 中途遇到的问题与修正

##### 问题 A：环境里没有直接可用的 `pnpm`
现象：
- `zsh: command not found: pnpm`

修正：
- 使用 `corepack enable`
- 使用 `corepack prepare pnpm@10.0.0 --activate`

##### 问题 B：Prisma generate 自动尝试补装依赖失败
现象：
- Prisma 在执行 generate 时尝试执行 `pnpm add prisma@6.19.2 -D --silent`
- 导致生成失败

根因判断：
- `schema.prisma` 位于仓库根目录
- Prisma 生成时把上下文判到 root package
- root `package.json` 当时缺少 `prisma` / `@prisma/client`

修正：
- 在根 `package.json` 中补充：
  - `prisma`
  - `@prisma/client`
- 重新 `pnpm install`
- 重新执行 `pnpm exec prisma generate --schema prisma/schema.prisma`

##### 问题 C：PrismaService 类型错误
现象：
- `beforeExit` 相关类型报错

修正：
- 将原先依赖 Prisma 事件钩子的写法调整为基于 `process.on('beforeExit', ...)` 的处理
- 使 `apps/api` typecheck 通过

##### 问题 D：MetricService 中误写了无效字段
现象：
- `orderBy: undefined` 触发类型报错

修正：
- 删除该无效字段
- 重新执行 typecheck

#### 当前结果
已完成：
- `pnpm install`
- `prisma generate`
- `pnpm --filter @silver-health/api typecheck`
- `pnpm --filter @silver-health/web typecheck`

当前状态：
- Web / API 基础类型检查通过
- Prisma Client 已可生成
- 项目已从“纯骨架”推进到“可继续联调的工程初版”

---

### 10. 当前阶段总结

#### 当前已完成
- 项目目录归位到 `coding/workspace`
- 建立独立 GitHub 仓库并推送
- monorepo 初始化
- Prisma schema 初版
- Nest API 初版
- Web 路由骨架初版
- 第一批核心业务模块骨架
- 依赖安装
- Prisma Client 生成
- API / Web typecheck 通过

#### 当前未完成
- `.env` 本地开发值补齐
- PostgreSQL 连接与 migration
- 本地实际启动 Nest / Next
- Elder Profile 页面表单与接口联调
- 今日任务 / 指标录入 / 用药提醒 / 家属首页的真实页面实现

#### 建议下一步
1. 补本地开发环境说明与 `.env.example`
2. 打通 `/elder/profile` 页面与 `POST/GET /api/profile/elder`
3. 再推进今日任务与指标录入链路
4. 最后再收敛家属看板与周报展示

---

## 后续维护规则（新增）

从本次开始，后续每完成一步开发工作，都应同步更新：

1. **本文件**：写详细过程归档
   - 做了什么
   - 改了哪些文件/模块
   - 遇到什么问题
   - 怎么修正
   - 当前状态
   - 下一步计划

2. **当日 memory**：写精简总结
   - 用户新要求
   - 今天推进到哪一步
   - 关键坑点 / 决策

3. **commit 概要**：提交时明确本轮范围
   - 避免“大而空”的 commit message
   - 尽量与本文件中的阶段名称对应
