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

### 17. 建档页前端校验与错误提示收口

#### 背景
虽然上一阶段 API 已具备运行时 DTO 校验，但前端建档页如果仍然把明显错误的输入直接发到后端：
- 用户体验会比较生硬；
- 错误暴露点过晚；
- 前后端职责也不够平衡。

#### 本轮实际完成内容
1. 为建档表单增加前端校验逻辑：
   - 姓名不能为空
   - 年龄必须是 1~120 的整数
   - 手机号必须符合大陆 11 位手机号格式
   - 身高必须是 50~260 的整数
   - 体重必须是 20~300 的整数

2. 新增表单级错误状态：
   - `FormErrors`
   - 在字段变更时自动清理对应错误

3. 为输入框增加错误样式：
   - 错误字段展示红色边框
   - 字段下方直接展示错误文案

4. 优化后端错误信息展示：
   - 当前会优先从 API 返回结构中解析 `message`
   - 如果后端返回的是数组错误，也会合并展示
   - 避免前端只显示模糊的“保存失败”

5. 当前建档页交互进一步收敛为：
   - 前端先做基础合法性校验
   - 后端再做运行时 DTO 校验
   - 成功后展示明确成功提示和接口返回

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `/elder/profile` 页面构建成功

#### 当前意义
- 建档页已经从“能提交”提升到“有基本可用体验”；
- 用户在页面上能更早发现并修正输入问题；
- 后续如果继续做老人首页、指标录入页，可以复用这套前端校验思路。

#### 下一步建议
1. 实际启动 API / Web 做端到端访问验证
2. 开始推进 `elder/home` 页面与 `tasks` 模块联调
3. 开始推进 `elder/metrics` 页面与 `metrics` 模块联调
4. 再逐步补 family dashboard 的真实数据展示

---

### 18. 老人首页第一版：今日任务列表页

#### 本轮目标
- 开始推进 MVP 第二条主链路：今日任务。
- 先让 `elder/home` 从占位页升级为可展示“今日任务”的真实页面。

#### 本轮实际完成内容
1. 重写 `apps/web/app/elder/home/page.tsx`，从占位文案升级为任务列表页。

2. 页面当前支持两种数据模式：
   - **真实 API 模式**：当 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID` 已配置时，调用：
     - `GET /api/tasks/elder/:elderUserId`
   - **Mock 回退模式**：当未配置默认 userId，或 API 加载失败时，自动回退到页面内置 mock 数据

3. 页面当前已展示的信息包括：
   - 当前数据源（API / Mock）
   - 待完成任务数
   - 已完成任务数
   - 任务列表
   - 任务类型标签
   - 优先级标签
   - 状态标签
   - 计划时间
   - 任务说明

4. 页面策略说明：
   - 当前优先做“可看见今天要做什么”；
   - 暂未做“标记完成”交互；
   - 暂未做真正的提醒推送；
   - 先把信息展示链路跑通，再做任务交互。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `elder/home` 页面已能正常构建

#### 当前意义
- MVP 第二条主链路已开始落地，不再只有建档页一个真实入口；
- 通过“真实 API + Mock 回退”的模式，页面可以在后端数据尚未完全准备时持续推进前端交互；
- 后续再补任务完成操作、任务创建入口、首页统计摘要时，会更顺畅。

#### 下一步建议
1. 继续推进 `elder/metrics` 页面，打通健康指标录入链路
2. 回头补 `tasks` 模块的 DTO 校验与状态变更接口
3. 再推进 `medication` 页面与提醒配置联调
4. 之后收敛 `family/dashboard` 页面

---

### 19. 健康指标页第一版：最近指标记录列表

#### 本轮目标
- 推进 MVP 第三条主链路：健康指标。
- 先把 `elder/metrics` 从占位页升级为“最近指标记录展示页”，为后续录入能力打基础。

#### 本轮实际完成内容
1. 重写 `apps/web/app/elder/metrics/page.tsx`，从占位文案升级为真实页面。

2. 页面当前支持两种数据模式：
   - **真实 API 模式**：当 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID` 已配置时，调用：
     - `GET /api/metrics/elder/:elderUserId`
   - **Mock 回退模式**：当未配置默认 elder userId，或 API 加载失败时，自动回退到页面内置 mock 指标数据

3. 页面当前已展示的信息包括：
   - 当前数据源（API / Mock）
   - 最近记录数
   - 指标类型（血压 / 血糖 / 体重）
   - 录入来源（老人 / 家属）
   - 测量时间
   - 指标值展示

4. 页面当前策略说明：
   - 第一版先解决“最近记录可查看”；
   - 暂未补录入表单；
   - 暂未补趋势图表；
   - 暂未补异常提示；
   - 先把指标查看链路跑通，再继续做录入与分析。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `elder/metrics` 页面已能正常构建

#### 当前意义
- 项目当前已至少有三条真实主链路入口：
  1. 建档
  2. 今日任务
  3. 指标查看
- 前端页面层面已经从“初始化”进入“主功能入口逐步成形”的阶段。

#### 下一步建议
1. 补 `elder/metrics` 的录入表单第一版
2. 回头补 `metric` 模块 DTO 校验
3. 再推进 `medication` 页面与提醒配置
4. 然后开始收敛 `family/dashboard`

---

### 20. 健康指标页第二版：录入表单 + 最近记录同页展示

#### 本轮目标
- 把 `elder/metrics` 从“只能看最近记录”推进到“能录 + 能看”的状态。

#### 本轮实际完成内容
1. 新增指标录入表单组件：
   - `apps/web/app/elder/metrics/metric-form.tsx`

2. 录入表单当前支持三类指标：
   - 血压
   - 血糖
   - 体重

3. 表单当前支持的字段包括：
   - `elderUserId`
   - `createdByUserId`
   - `createdByRole`
   - `metricType`
   - `measuredAt`
   - 以及随指标类型变化的数值字段

4. 不同指标类型的录入逻辑：
   - **血压**：收缩压 / 舒张压 / 脉搏
   - **血糖**：血糖值 / 测量时段
   - **体重**：体重值

5. 当前表单已具备的前端校验：
   - `elderUserId` 必填
   - `createdByUserId` 必填
   - `measuredAt` 必填
   - 血压数值范围校验
   - 血糖数值范围校验
   - 体重数值范围校验

6. 当前表单已直接对接：
   - `POST /api/metrics`

7. 页面结构已升级为：
   - 上方：指标录入表单
   - 下方：最近指标记录列表

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `elder/metrics` 页面构建成功

#### 当前意义
- MVP 第三条主链路已从“仅查看入口”推进到“具备录入能力”；
- 前端页面已开始具备更完整的业务闭环结构；
- 后续只要继续补 API 校验与真实数据验证，这条链路就能进一步稳定下来。

#### 下一步建议
1. 回头补 `metric` 模块 DTO 校验与后端运行时校验
2. 补 `elder/home` 的任务完成操作
3. 推进 `medication` 页面与提醒配置
4. 然后开始收敛 `family/dashboard`

---

### 21. 指标接口校验收口：CreateHealthMetricDto 运行时校验

#### 背景
在 `elder/metrics` 页面已经具备录入表单之后，`POST /api/metrics` 如果仍然缺少后端 DTO 运行时校验，会导致：
- 前端虽然有基础校验，但依然可能绕过页面直接提交非法数据；
- 指标链路相比建档链路，后端约束还不够扎实。

#### 本轮实际完成内容
1. 为 `CreateHealthMetricDto` 增加运行时校验规则：
   - `elderUserId`：必填字符串
   - `metricType`：枚举校验
   - `systolic`：可选数值，60~260
   - `diastolic`：可选数值，40~180
   - `pulse`：可选数值，30~220
   - `glucoseValue`：可选数值，1~40
   - `glucosePeriodType`：可选字符串
   - `weightKg`：可选数值，20~300
   - `createdByRole`：枚举校验
   - `createdByUserId`：必填字符串
   - `measuredAt`：合法日期字符串

2. 由于 API 全局 `ValidationPipe` 已在此前开启，本轮 DTO 校验已直接接入实际运行链路，无需额外再改 `main.ts`。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/api typecheck`
- `pnpm --filter @silver-health/api build`

结果：
- 两者均通过

#### 当前意义
- 指标录入链路现在也具备了后端运行时校验；
- 到目前为止，至少“建档”和“指标录入”两条主链路都已经具备前后端双重基础校验；
- 后续再进入真实联调时，异常输入会更早暴露。

#### 下一步建议
1. 回头补 `tasks` 模块 DTO 校验与任务完成接口
2. 推进 `medication` 页面与提醒配置
3. 再推进 `family/dashboard` 的摘要页
4. 最后再补更完整的本地联调验证

---

### 22. 今日任务链路收口：DTO 校验 + 完成任务接口

#### 背景
`elder/home` 页面此前已经能展示今日任务列表，但 `tasks` 模块后端仍有两个缺口：
- 创建任务接口缺少运行时 DTO 校验；
- 缺少“完成任务”操作接口，导致任务链路只能看、不能改状态。

#### 本轮实际完成内容
1. 为 `CreateDailyTaskDto` 增加运行时校验规则：
   - `elderUserId`：必填字符串
   - `taskDate`：合法日期字符串
   - `taskType`：枚举校验
   - `title`：必填字符串，最大长度 128
   - `description`：可选字符串
   - `priority`：枚举校验
   - `status`：可选枚举
   - `sourceType`：枚举校验
   - `relatedContentId`：可选字符串
   - `dueTime`：可选，`HH:mm` 格式校验

2. 在 `TaskService` 中新增：
   - `complete(taskId: string)`
   - 若任务不存在则抛 `NotFoundException`
   - 若存在则更新：
     - `status = done`
     - `completedAt = now()`

3. 在 `TaskController` 中新增接口：
   - `PATCH /api/tasks/:taskId/complete`

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/api typecheck`
- `pnpm --filter @silver-health/api build`

结果：
- 两者均通过

#### 当前意义
- 今日任务链路已从“只能展示”推进到“后端已支持完成动作”；
- `tasks` 模块现在也具备运行时 DTO 校验；
- 后续可以回到 `elder/home` 页面，把“标记完成”交互真正接起来。

#### 下一步建议
1. 回到 `elder/home` 页面，补“完成任务”按钮与状态刷新
2. 推进 `medication` 页面与提醒配置
3. 再推进 `family/dashboard` 的摘要页
4. 最后补更完整的本地联调验证

---

### 23. 老人首页第二版：完成任务交互接入

#### 背景
上一阶段虽然 `tasks` 模块已经具备后端完成接口，但 `elder/home` 页面仍然只能“看任务”，还不能直接触发完成动作。

#### 本轮实际完成内容
1. 新增客户端任务列表组件：
   - `apps/web/app/elder/home/task-list.tsx`

2. 页面结构调整：
   - `page.tsx` 负责服务端获取初始任务数据
   - `task-list.tsx` 负责客户端交互与本地状态更新

3. 当前已接入的交互：
   - 点击“标记完成”按钮
   - 调用：
     - `PATCH /api/tasks/:taskId/complete`
   - 成功后本地把任务状态切换为 `done`
   - 同时刷新页面内待完成 / 已完成数量统计

4. Mock 模式兼容策略：
   - 如果当前页面处于 mock 模式，则不会调用真实 API
   - 而是在前端本地模拟把任务置为完成
   - 这样即便未配置默认 elder userId，页面交互也能继续验证

5. 当前交互反馈：
   - 按钮有处理中状态
   - 完成后会显示成功提示
   - 已完成任务按钮会进入禁用态

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `elder/home` 页面构建成功，且页面体积已反映客户端交互接入

#### 当前意义
- 今日任务链路现在已从“只看列表”推进到“可直接完成任务”；
- 这使老人首页第一次具备了真正的业务操作能力；
- 到目前为止，至少建档、指标录入、任务完成三类核心动作都已有前端入口。

#### 下一步建议
1. 推进 `medication` 页面与提醒配置
2. 再推进 `family/dashboard` 摘要页
3. 回头补 `task` 页面中更细的状态流转（跳过、过期、刷新）
4. 最后补更完整的本地联调验证

---

### 24. 用药提醒第一版：新增提醒 + 提醒列表

#### 本轮目标
- 推进 MVP 第四条主链路：用药提醒。
- 先把 `elder/medication` 从占位页升级为“可新增提醒 + 可查看提醒列表”的第一页版本。

#### 本轮实际完成内容
1. 新增前端表单组件：
   - `apps/web/app/elder/medication/medication-form.tsx`

2. 表单当前支持的字段：
   - `elderUserId`
   - `medicineName`
   - `dosageText`
   - `remindTime`
   - `repeatRule`
   - `enabled`

3. 当前表单已具备的前端校验：
   - `elderUserId` 必填
   - 药品名称必填
   - 剂量说明必填
   - 提醒时间需符合 `HH:mm`
   - 重复规则必填

4. 当前表单已直接对接：
   - `POST /api/medications`

5. 重写 `apps/web/app/elder/medication/page.tsx`，当前支持两种数据模式：
   - **真实 API 模式**：
     - `GET /api/medications/elder/:elderUserId`
   - **Mock 回退模式**：
     - 当未配置默认 elder userId，或 API 加载失败时，自动回退到页面内置 mock 用药提醒数据

6. 页面当前展示的信息包括：
   - 当前数据源（API / Mock）
   - 提醒数量
   - 提醒列表
   - 药品名称
   - 剂量说明
   - 提醒时间
   - 重复规则
   - 启用状态

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `elder/medication` 页面已能正常构建

#### 当前意义
- 到目前为止，MVP 中至少四条主链路都已具备前端入口：
  1. 建档
  2. 今日任务
  3. 健康指标
  4. 用药提醒
- 用药提醒页已不再是占位页，而是具备“新增 + 查看”的基础能力。

#### 下一步建议
1. 推进 `family/dashboard` 摘要页
2. 回头补 `medication` 模块的 DTO 运行时校验
3. 再补 `task` 页面中更细的状态流转
4. 最后做一轮更完整的本地联调验证

---

### 25. 家属看板第一版：任务/指标/用药摘要聚合页

#### 本轮目标
- 开始把家属侧主入口做起来。
- 先让 `family/dashboard` 从占位页升级为一个能快速查看老人近况的摘要页。

#### 本轮实际完成内容
1. 重写 `apps/web/app/family/dashboard/page.tsx`，从占位文案升级为真实摘要页。

2. 页面当前聚合的三块核心信息：
   - 今日任务摘要
   - 最近指标摘要
   - 用药提醒摘要

3. 页面当前支持两种数据模式：
   - **真实 API 模式**：
     - `GET /api/tasks/elder/:elderUserId`
     - `GET /api/metrics/elder/:elderUserId`
     - `GET /api/medications/elder/:elderUserId`
   - **Mock 回退模式**：
     - 当未配置默认 elder userId，或接口加载失败时，自动回退到页面内置 mock 摘要数据

4. 页面当前展示的信息包括：
   - 当前数据源（API / Mock）
   - 今日任务完成情况
   - 待完成任务数
   - 启用中的提醒数
   - 任务摘要列表
   - 最近指标摘要
   - 用药提醒摘要列表

5. 当前策略说明：
   - 第一版优先做“摘要聚合”；
   - 暂不做家属侧复杂筛选；
   - 暂不做多老人切换；
   - 暂不做更深的报告/趋势下钻；
   - 先确保家属侧能快速看到“任务 / 指标 / 用药”三块核心信息。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `family/dashboard` 页面已能正常构建

#### 当前意义
- 家属侧不再只有占位路由，开始有实际信息入口；
- 到目前为止，老人侧与家属侧都已经出现了真实页面能力；
- 项目整体上已经从“单点功能开发”推进到“跨角色 MVP 页面体系逐步成形”。

#### 下一步建议
1. 回头补 `medication` 模块 DTO 运行时校验
2. 再补 `family/report` 页面第一版
3. 之后收敛家属绑定页
4. 最后做一轮更完整的本地联调验证

---

### 26. 用药提醒接口校验收口：CreateMedicationReminderDto 运行时校验

#### 背景
`elder/medication` 页面已经具备“新增提醒 + 提醒列表”能力，但 `POST /api/medications` 此前还没有后端 DTO 运行时校验，这会导致：
- 页面以外的非法调用无法被及时拦截；
- 用药提醒链路相比建档/指标/任务链路，后端约束还不够一致。

#### 本轮实际完成内容
1. 为 `CreateMedicationReminderDto` 增加运行时校验规则：
   - `elderUserId`：必填字符串
   - `medicineName`：必填字符串，最大长度 128
   - `dosageText`：必填字符串，最大长度 64
   - `remindTime`：必填，且需符合 `HH:mm`
   - `repeatRule`：必填字符串，最大长度 32
   - `enabled`：可选布尔值

2. 由于 API 全局 `ValidationPipe` 已在此前开启，本轮 DTO 校验已直接接入实际运行链路。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/api typecheck`
- `pnpm --filter @silver-health/api build`

结果：
- 两者均通过

#### 当前意义
- 用药提醒链路现在也具备了后端运行时校验；
- 至此，建档、指标、任务、用药四条主要链路都已经具备不同程度的前后端约束；
- 工程整体一致性明显提高。

#### 下一步建议
1. 推进 `family/report` 页面第一版
2. 之后收敛家属绑定页
3. 回头补更完整的本地联调验证
4. 再逐步完善各模块更细的交互和状态流转

---

### 27. 家属周报第一版：周报摘要与建议列表页

#### 本轮目标
- 继续推进家属侧第二个核心页面。
- 让 `family/report` 从占位页升级为“可查看近期周报摘要”的页面。

#### 本轮实际完成内容
1. 重写 `apps/web/app/family/report/page.tsx`，从占位文案升级为真实周报页。

2. 页面当前支持两种数据模式：
   - **真实 API 模式**：
     - `GET /api/reports/elder/:elderUserId`
   - **Mock 回退模式**：
     - 当未配置默认 elder userId，或 API 加载失败时，自动回退到页面内置 mock 周报数据

3. 页面当前展示的信息包括：
   - 当前数据源（API / Mock）
   - 周报数量
   - 周报时间范围
   - 运动完成率
   - 用药完成率
   - 指标记录次数
   - 周报摘要
   - 建议列表

4. 当前策略说明：
   - 第一版优先做“周报查看”；
   - 暂不做复杂趋势图；
   - 暂不做导出；
   - 暂不做更深的周报详情页；
   - 先让家属侧有一个可读的周报入口。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `family/report` 页面已能正常构建

#### 当前意义
- 家属侧现在已经有两个真实页面入口：
  1. `family/dashboard`
  2. `family/report`
- 老人侧与家属侧的 MVP 页面骨架都在逐步补齐；
- 产品结构已经开始具备“跨角色完整路径”的雏形。

#### 下一步建议
1. 继续收敛 `family/bind` 页面
2. 回头补更完整的本地联调验证
3. 再逐步补各模块的编辑、停用、刷新等细节交互
4. 之后再看是否开始整理 demo 演示路径

---

### 28. 家属绑定第一版：绑定申请表单 + 绑定列表

#### 本轮目标
- 把家属侧第三个主路径也补起来。
- 让 `family/bind` 从占位页升级为“可发起绑定申请 + 可查看当前绑定状态”的页面。

#### 本轮实际完成内容
1. 新增前端表单组件：
   - `apps/web/app/family/bind/bind-form.tsx`

2. 表单当前支持的字段：
   - `elderUserId`
   - `familyUserId`
   - `relationType`

3. 当前表单已具备的前端校验：
   - `elderUserId` 必填
   - `familyUserId` 必填

4. 当前表单已直接对接：
   - `POST /api/family-bindings`

5. 重写 `apps/web/app/family/bind/page.tsx`，当前支持两种数据模式：
   - **真实 API 模式**：
     - `GET /api/family-bindings/elder/:elderUserId`
   - **Mock 回退模式**：
     - 当未配置默认 elder userId，或 API 加载失败时，自动回退到页面内置 mock 绑定数据

6. 页面当前展示的信息包括：
   - 当前数据源（API / Mock）
   - 绑定数量
   - 绑定列表
   - 关系类型
   - 绑定状态
   - 家属 userId
   - 家属昵称 / 手机号（若有）

7. 当前策略说明：
   - 第一版优先做“申请 + 列表”；
   - 暂不做确认流转；
   - 暂不做扫码/邀请码；
   - 暂不做解绑操作；
   - 先让家属绑定链路有可视化入口。

#### 本轮校验结果
已实际执行：
- `pnpm --filter @silver-health/web typecheck`
- `pnpm --filter @silver-health/web build`

结果：
- 两者均通过
- `family/bind` 页面已能正常构建

#### 当前意义
- 家属侧三条核心页面现在都已有真实入口：
  1. `family/dashboard`
  2. `family/report`
  3. `family/bind`
- 老人侧与家属侧的 MVP 页面骨架已经基本成型；
- 项目下一阶段可以更偏向联调、收口、完善体验，而不再只是补空白页。

#### 下一步建议
1. 回头补更完整的本地联调验证
2. 再逐步补各模块编辑、停用、解绑、刷新等细节交互
3. 之后整理一条完整 demo 演示路径
4. 再评估是否进入第一轮可演示版本收口

---

### 29. 第一轮联调收口：Demo 路径与检查清单文档

#### 本轮目标
- 不再只继续铺页面，而是开始把当前已做出的能力整理成一条可执行的联调/演示路径。
- 为下一阶段“真实联调、演示、收口”提供统一清单。

#### 本轮实际完成内容
1. 新增文档：
   - `docs/demo-and-integration-checklist.md`

2. 文档中已整理的内容包括：
   - 当前老人侧 / 家属侧页面入口清单
   - 当前主要 API 入口清单
   - 推荐 Demo 演示顺序
   - 推荐默认联调数据用法
   - 联调检查清单
   - 当前已知限制
   - 下一阶段联调收口建议

3. 文档目的：
   - 避免后续继续推进时只关注“又做了什么页面”；
   - 转而开始关注“这些页面如何串成一个真实可演示的 MVP”；
   - 作为之后端到端联调与演示的统一参考。

#### 当前意义
- 项目已从“持续补页面”开始转向“开始收口和组织已完成能力”；
- 后续如果要做真实演示、联调验证或阶段验收，这份文档可以直接作为基线。

#### 下一步建议
1. 基于该文档准备一套默认联调数据
2. 做一次真实端到端联调验证
3. 记录联调中暴露出的不合理交互
4. 再进行第一轮体验收口

---

### 30. 默认联调数据方案：最小真实数据集设计

#### 本轮目标
- 在联调清单基础上，进一步明确“到底要准备哪些真实数据”，避免后续联调时临时拼凑。

#### 本轮实际完成内容
1. 新增文档：
   - `docs/default-integration-data-plan.md`

2. 文档中已整理的内容包括：
   - 推荐的最小联调数据集
   - 每类数据对象的用途
   - 推荐生成顺序
   - 推荐联调配置方式
   - 当前建议的数据落地方式
   - 后续是否需要 seed 脚本的建议

3. 当前明确的最小联调对象包括：
   - elder 用户
   - family 用户
   - elder profile
   - daily tasks
   - health metrics
   - medication reminders
   - family bindings
   - weekly reports

4. 当前文档价值：
   - 后续如果开始准备真实联调数据，可以按文档直接落地；
   - 后续如果决定写 seed 脚本，也有了清晰的数据目标和依赖顺序。

#### 当前意义
- 项目已不只是“页面和接口逐渐成形”，也开始有了“联调数据如何组织”的明确方案；
- 这为下一阶段真正进入端到端真实联调，提供了很重要的准备。

#### 下一步建议
1. 先基于该方案准备一套真实默认数据
2. 让更多页面尽量走真实 API，而不是 mock 回退
3. 做一次真实端到端联调验证
4. 再视情况决定是否补 `seed-demo-data.ts`

---

### 31. 联调数据进一步细化：Integration Data Spec 文档

#### 本轮目标
- 在“默认联调数据方案”的基础上，把联调数据继续从“类型级”推进到“字段级/样例级”，方便后续直接照着准备。

#### 本轮实际完成内容
1. 新增文档：
   - `docs/integration-data-spec.md`

2. 文档中已细化的内容包括：
   - elder / family 两个主角用户的推荐样例
   - elder profile 的建议字段值
   - daily tasks 的建议样例
   - health metrics 的建议样例
   - medication reminders 的建议样例
   - family binding 的建议样例
   - weekly reports 的建议样例
   - 页面与数据对象映射关系
   - 推荐的实际准备顺序
   - 当前最建议的数据落地方式

3. 当前文档作用：
   - 如果后续人工准备联调数据，可以直接照着字段示例做；
   - 如果后续写 seed 脚本，也可以直接把这些样例转为脚本输入目标。

#### 当前意义
- 联调数据准备已经从“概念方案”推进到“可直接落地的细化规范”；
- 这会显著降低后续真实联调时的来回试错成本。

#### 下一步建议
1. 基于这份 spec 真正准备第一套真实默认数据
2. 把 elder userId 写入环境变量，让页面尽量走真实 API
3. 做一次真实端到端联调验证
4. 再决定是否把这套数据沉淀成 seed 脚本

---

### 32. 联调数据继续收口：落地方案文档 + Seed 脚本设计文档

#### 背景
用户明确要求：
- 联调数据不仅要有“明细规范”；
- 还要把“怎么落地”与“脚本怎么设计”单独输出成新文档。

#### 本轮实际完成内容
1. 新增联调数据落地方案文档：
   - `docs/integration-data-rollout-plan.md`

2. 文档中已说明：
   - 当前更建议先手工准备一轮真实联调数据；
   - 再考虑沉淀为 seed 脚本；
   - 推荐执行顺序；
   - 推荐页面联调顺序；
   - 当前阶段为什么不建议一上来就过度自动化。

3. 新增 Seed 脚本设计文档：
   - `docs/seed-script-design.md`

4. 文档中已说明：
   - 脚本目标
   - 建议生成的数据对象
   - 推荐执行顺序
   - 推荐输出内容
   - 推荐实现方式
   - 幂等性建议
   - 当前推荐先验证再落地脚本的原因

#### 当前意义
- 联调数据相关文档已经形成四层结构：
  1. `demo-and-integration-checklist.md`
  2. `default-integration-data-plan.md`
  3. `integration-data-spec.md`
  4. `integration-data-rollout-plan.md`
  5. `seed-script-design.md`
- 后续无论是手工联调、准备 demo，还是正式写 seed 脚本，都已经有相对完整的文档基础。

#### 下一步建议
1. 基于这些文档开始真正准备第一套真实默认数据
2. 先做一轮手工真实联调
3. 验证通过后，再决定是否正式落 `scripts/seed-demo-data.ts`
4. 再进行第一轮 demo 收口

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
