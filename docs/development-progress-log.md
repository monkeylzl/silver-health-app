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
3. `docs: add development progress log`
4. `feat: add task metric medication and report modules`

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

### 11. 新增提交：任务 / 指标 / 用药 / 周报模块

#### 本轮实际提交内容
- 将此前已落地但尚未单独提交的以下模块整理并提交：
  - `task`
  - `metric`
  - `medication`
  - `report`
- 同步包含：
  - `apps/api/src/app.module.ts` 的模块接入更新

#### 对应提交
- `1c13c02 feat: add task metric medication and report modules`

#### 当前意义
- API 主链路模块已基本齐全
- 后续可以直接围绕老人建档、今日任务、指标录入、用药提醒、家属周报继续联调

---

### 12. 当前应用形态判断（对齐用户问题）

#### 当前正在开发的不是原生 Android / iOS，也不是微信小程序
目前工程结构清晰表明：
- `apps/web`：Next.js Web 应用
- `apps/api`：NestJS 后端 API
- `apps/admin`：后台预留目录（尚未开始）

#### 当前最准确的表述
这是一个：
- **基于 Web 的老年健康管理应用**
- 老人端与家属端当前先统一放在一个 `Next.js` Web/H5 应用里开发
- 后端由 `NestJS + Prisma + PostgreSQL` 提供服务

#### 这意味着什么
当前阶段更接近：
- H5 / Web 应用
- 或未来可继续演进成 PWA / 容器壳应用

但**不是**：
- 原生 Android App
- 原生 iOS App
- 微信小程序

#### 为什么当前先这样做
- 与现有文档约束一致
- MVP 实现速度更快
- 更适合先把“建档 -> 任务 -> 指标 -> 家属查看 -> 周报”闭环跑通
- 后续如要扩展到小程序或原生端，可以再基于现有 API 和业务模型演进

#### 当前关键判断（已确认归档）
当前阶段的推荐路线是：
- **继续走 Web/H5 + API 路线**
- **不建议现在切到微信小程序或原生 Android/iOS**

原因归纳：
1. 当前工程已经按 `Next.js Web + NestJS API + Prisma` 起好了骨架，继续沿现有方向推进成本最低；
2. 这个阶段的核心目标是尽快验证 MVP 主链路，而不是提前做多端分化；
3. Web/H5 最适合当前快速试错、联调、演示与部署；
4. 现在切小程序或原生端，会显著增加前端适配成本和交付周期；
5. 更合理的策略是：先用 Web/H5 跑通业务闭环，后续再根据实际使用场景决定是否扩展到小程序或原生端。

---

### 13. 建档页面第一版落地（Web 前端）

#### 本轮目标
- 开始把 MVP 第一条主链路真正从“接口骨架”推进到“前端可联调入口”。
- 优先落 `elder profile` 的页面表单，而不是继续只堆后端模块。

#### 本轮实际完成内容
1. 新增 Web 侧基础配置：
   - `apps/web/lib/config.ts`
   - 统一读取 `NEXT_PUBLIC_API_BASE_URL`
   - 支持默认 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`

2. 将 `apps/web/app/elder/profile/page.tsx` 从占位页升级为实际建档入口页。

3. 新增前端表单组件：
   - `apps/web/app/elder/profile/elder-profile-form.tsx`

4. 表单已直接对接以下接口形状：
   - `POST /api/profile/elder`
   - `GET /api/profile/elder/:userId`

5. 表单已支持的字段：
   - `userId`
   - `name`
   - `gender`
   - `age`
   - `heightCm`
   - `weightKg`
   - `chronicConditions`
   - `commonMedicines`
   - `mobilityLevel`
   - `helperMode`

6. 页面当前已具备的交互：
   - 根据 `userId` 加载已有档案
   - 提交建档 / 更新请求
   - 实时展示接口返回 JSON
   - 对慢病 / 常用药字段做简单列表切分

7. 更新了根级 `.env.example`：
   - 新增 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`
   - 保留 `NEXT_PUBLIC_API_BASE_URL`

#### 当前意义
- `elder profile` 已经不是单纯文档概念，而是有了一个真实可联调的 Web 页面入口；
- 下一步可以继续补：
  - 创建用户与建档的关系处理；
  - API 侧 DTO/校验；
  - 页面级字段校验、提交态与错误态优化；
  - 本地联调与真实数据库验证。

#### 本轮校验结果
- 已执行：`pnpm --filter @silver-health/web typecheck`
- 结果：通过

#### 下一步建议
1. 启动 API / Web 本地运行链路
2. 补 `user -> elderProfile` 的实际创建/关联策略
3. 增加 DTO 校验和更明确的错误返回
4. 再推进今日任务页与指标录入页

---

### 14. 本地开发说明与构建校验

#### 本轮目标
- 让项目从“代码骨架 + 局部联调页”进一步进入“至少可构建、可说明如何本地运行”的状态。

#### 本轮实际完成内容
1. 新增 API 侧环境变量示例：
   - `apps/api/.env.example`

2. 更新根级脚本：
   - 增加 `dev:api`
   - 增加 `dev:web`
   - 增加 `prisma:generate`

3. 新增本地开发说明文档：
   - `docs/local-development.md`

4. 文档中补充了：
   - 依赖安装方式
   - `corepack + pnpm` 使用方式
   - 根级 / API 环境变量说明
   - Prisma Client 生成方式
   - API / Web 启动方式
   - 当前建档页入口
   - 当前已接通的联调接口
   - 当前项目限制项

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/api build`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- Web 构建已成功生成 `/elder/profile` 等页面产物

#### 当前意义
- 现在项目不仅能 typecheck，还已经能完成 Web / API 的基础 build；
- 后续进入本地运行、联调、数据库接入阶段时，已有明确说明文档和脚本入口；
- 这标志着工程从“纯初始化期”正式进入“可持续开发期”。

#### 下一步建议
1. 实际启动 API 与 Web 开发服务做本地访问验证
2. 补 DTO 校验（class-validator / class-transformer）
3. 明确 `userId` 创建/绑定策略，避免建档页依赖人工先填 ID
4. 推进今日任务页与指标录入页

---

### 15. 建档链路收口：支持自动创建 elder 用户

#### 背景
在上一阶段的建档页中，虽然 `/elder/profile` 已能直接调用建档接口，但仍存在一个明显问题：
- 页面依赖用户手工输入一个已存在的 `userId`；
- 这不适合作为 MVP 的第一条真实业务入口；
- 如果没有前置“创建用户”步骤，建档链路体验是不完整的。

#### 本轮关键决策
本轮先采用更适合 MVP 的策略：
- **当 `userId` 为空时，由后端自动创建一个 `role=elder` 的用户，再完成建档。**
- **当 `userId` 已存在时，继续按已有用户更新/补齐档案。**

这意味着：
- 建档页现在既可用于“新建老人档案”；
- 也可用于“维护已有老人档案”。

#### API 侧改动
1. 更新 `CreateElderProfileDto`：
   - `userId` 改为可选
   - 新增可选字段：
     - `nickname`
     - `mobile`

2. 更新 `ElderProfileService.create(...)`：
   - 若请求里没有 `userId`：
     - 自动创建一个 `UserRole.elder` 用户；
     - 使用 `nickname/name/mobile` 初始化用户基础信息；
     - 取新用户 `id` 作为 `elderProfile.userId`
   - 若请求里已有 `userId`：
     - 继续按原逻辑执行 `upsert`

3. 接口返回中增加：
   - `createdUser: boolean`
   - 用于前端明确区分“新建用户后建档”还是“对已有用户建档/更新”

#### Web 侧改动
1. 扩展建档表单字段：
   - 新增 `nickname`
   - 新增 `mobile`

2. `userId` 字段交互调整：
   - 允许留空
   - 留空时页面进入“自动创建 elder 用户并建档”模式
   - 填写时仍支持“按已有 userId 加载 / 更新”模式

3. 提交成功后的行为：
   - 如果后端返回了新创建的 `userId`，前端会自动回填到表单里；
   - 如果是系统自动创建用户，页面会提示：
     - 已自动创建 elder 用户，并展示该 `userId`

4. 加载已有档案时：
   - 额外回填 `user.nickname`
   - 额外回填 `user.mobile`

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/api typecheck`
- `pnpm --filter @silver-health/web typecheck`

结果：
- 两者均通过

#### 当前意义
- MVP 第一条链路从“半联调状态”推进到“可直接新建老人档案”的状态；
- 建档页不再强依赖人工准备 `userId`；
- 这比先单独做一整套“用户创建页”更适合当前快速闭环策略。

#### 下一步建议
1. 实际启动 API / Web，验证创建档案后的端到端访问
2. 为 DTO 增加字段校验和更明确的错误提示
3. 开始推进今日任务首页与指标录入页
4. 视情况补一个更正式的“老人用户创建/选择”流程

---

### 16. 建档接口校验收口：ValidationPipe + DTO 校验

#### 背景
虽然建档链路已支持“自动创建 elder 用户”，但接口层此前仍存在一个明显问题：
- DTO 只有 TypeScript 类型，没有真正的运行时校验；
- 非法字段、类型错误字段、越界数值在请求进入 API 时无法被稳妥拦截；
- 这会让前后端联调时的问题暴露得太晚。

#### 本轮实际完成内容
1. 为 API 增加运行时参数校验依赖：
   - `class-validator`
   - `class-transformer`

2. 在 `apps/api/src/main.ts` 中启用全局 `ValidationPipe`：
   - `whitelist: true`
   - `transform: true`
   - `forbidNonWhitelisted: true`

3. 为 `CreateElderProfileDto` 增加校验规则：
   - `userId` / `nickname`：可选字符串
   - `mobile`：中国大陆手机号格式校验
   - `name`：必填字符串
   - `gender`：枚举校验
   - `age`：整数，1~120
   - `heightCm`：可选整数，50~260
   - `weightKg`：可选整数，20~300
   - `chronicConditions` / `commonMedicines`：可选数组，长度限制 + 元素字符串校验
   - `mobilityLevel` / `helperMode`：枚举校验

4. 为 `UpdateElderProfileDto` 增加对应的可选字段校验。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/api typecheck`
- `pnpm --filter @silver-health/api build`

结果：
- 两者均通过

#### 当前意义
- API 已从“只有类型提示”升级到“具备运行时输入校验”；
- 建档接口在联调时会更早暴露问题；
- 后续前端表单校验、错误提示文案、接口收口会更容易做扎实。

#### 下一步建议
1. 实际启动 API / Web 做端到端访问验证
2. 优化建档页的前端字段校验和错误提示
3. 推进今日任务页（elder home）与指标录入页（elder metrics）
4. 之后再补 family dashboard 的真实数据联调

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
