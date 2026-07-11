# Silver Health 开发进度日志

## 1. 项目初始化

### 已完成
- 创建 monorepo 基础目录：
  - `apps/web`
  - `apps/api`
  - `packages/ui`
  - `packages/config`
  - `packages/types`
- 根目录新增基础文件：
  - `package.json`
  - `pnpm-workspace.yaml`
  - `tsconfig.base.json`
  - `.gitignore`
  - `README.md`

### 当前状态
- 工程骨架已建立，可继续初始化 Web / API 子应用。

---

## 2. Web 端初始化（Next.js）

### 已完成
- `apps/web` 初始化为 Next.js + TypeScript 项目。
- 创建基础页面与布局：
  - `app/page.tsx`
  - `app/layout.tsx`
- 配置 `tsconfig.json`
- 配置 `package.json`

### 当前状态
- Web 可继续添加页面与 UI 原型。

---

## 3. UI 包初始化

### 已完成
- 创建 `packages/ui`
- 增加基础导出文件：
  - `src/index.ts`
- 为未来公共组件预留位置。

### 当前状态
- 暂未沉淀实际 UI 组件，但结构已具备。

---

## 4. Config / Types 包初始化

### 已完成
- 创建：
  - `packages/config`
  - `packages/types`
- 各自增加基础 `package.json` / `tsconfig.json` / `src/index.ts`

### 当前状态
- 后续可将共享类型与配置逐步沉淀到这里。

---

## 5. API 第一版初始化

#### 已创建的 API 基础文件
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`

#### 当前状态
- API 已从“空目录”推进到“主模块已占位、接口形状可继续收敛”的阶段

---

## 6. monorepo 脚本与基础联通

### 已完成
- 根目录 `package.json` 添加常用脚本：
  - `dev:web`
  - `dev:api`
  - `build`
  - `typecheck`
- 各子项目基础依赖关系理顺。

### 当前状态
- 已具备继续补齐页面与 API 模块的条件。

---

## 7. 业务方向确认

### 当前判断
- `apps/api`：NestJS 后端 API
- `apps/web`：Next.js Web/H5 前端
- 继续沿用 Web/H5 + API 路线，暂不分叉到小程序/原生端。

### 原因
1. 当前工程已经按 `Next.js Web + NestJS API + Prisma` 起好了骨架，继续沿现有方向推进成本最低；
2. MVP 阶段优先把“老人端 + 家属端”的核心闭环做通；
3. 后续如要扩展到小程序或原生端，可以再基于现有 API 和业务模型演进。

---

## 8. 环境变量与基础说明补齐

### 已完成
- 增加 API / Web 环境变量说明
- 保留 `NEXT_PUBLIC_API_BASE_URL`
- 明确本地联调与真实数据库验证是后续重点。

---

## 9. 数据模型与核心业务方向继续收口

### 已完成
- 老人档案、任务、指标、用药提醒、周报、家属绑定等核心对象继续明确。

---

## 10. Web / API 基础构建通过

### 已完成
- Web / API 基础类型检查通过
- 基础 build 能完成

---

## 11. DTO / 校验 / 接口骨架推进

### 已完成
- API 侧开始具备运行时输入校验能力
- 为后续真实联调铺路

---

## 12. 老人建档页与首批主链路页面雏形

### 已完成
- 建档页开始可录入基础信息
- 页面结构逐步围绕老人端 / 家属端主链路搭起

---

## 13. 老人首页：今日任务真实 API + Mock 回退

### 已完成
- `/elder/home` 支持读取真实任务数据
- 若默认 elder userId 未配置或接口失败，则自动回退 mock 数据
- 页面展示当前数据源（API / Mock）

### 当前意义
- 通过“真实 API + Mock 回退”的模式，页面可以在后端数据尚未完全准备时持续推进前端交互。

---

## 14. 健康指标页：真实 API + Mock 回退

### 已完成
- `/elder/metrics` 接入真实指标 API
- 继续保留 mock 回退与数据源展示

---

## 15. 用药提醒页：真实 API + Mock 回退

### 已完成
- `/elder/medication` 接入真实 API
- 未配置默认 elder userId 或接口失败时回退内置 mock 提醒数据

---

## 16. 家属看板：真实 API + Mock 回退

### 已完成
- `/family/dashboard` 接入任务 / 指标 / 用药提醒摘要 API
- 接口失败时回退 mock 摘要数据

---

## 17. 家属周报：真实 API + Mock 回退

### 已完成
- `/family/report` 接入周报 API
- 继续保留 mock 回退与数据源展示

---

## 18. 家属绑定：真实 API + Mock 回退

### 已完成
- `/family/bind` 接入绑定列表 API
- 继续保留 mock 回退与数据源展示

---

## 19. 默认联调数据方案与本地真实联调准备

### 已完成
- 明确需要的最小真实数据集
- 逐步让更多页面从 mock 切到真实 API

---

## 20. 本地 PostgreSQL / migration / seed 跑通

### 已完成
- 本地数据库、migration、seed 基本跑通
- 为真实联调打基础

---

## 21. Web 真正切到真实 API

### 已完成
- `apps/web/.env.local` 读到 seeded elder id
- `/elder/home`、`/family/dashboard`、`/family/report` 等关键页已切到真实 API

### 当前结论
- 关键页面已经开始走真实 API，而不是 mock 回退
- 老人侧与家属侧关键页面均已开始走真实数据

---

## 22. 联调后体验修正

### 已完成
- 继续围绕真实联调暴露出来的问题做前端体验修正

---

### 41. 第一批真实联调体验问题修正：周报百分比 / 血糖时段中文化 / 提交后自动刷新

#### 本轮目标
- 不继续横向铺新页面；
- 先修真实联调时已经暴露出来、用户一眼就能感知的不合理体验。

#### 本轮实际修正
1. 修复家属周报中的完成率显示问题：
   - 文件：`apps/web/app/family/report/page.tsx`
   - 处理内容：`formatPercent` 不再只接受 `number`，同时兼容 Prisma / API 侧可能返回的字符串数值；
   - 结果：即使后端返回的是字符串型百分比，前端也不会再直接显示“暂无”。

2. 修复血糖时段的英文枚举直接暴露问题：
   - 文件：`apps/web/app/elder/metrics/page.tsx`
   - 处理内容：新增 `glucosePeriodLabelMap`，把 `before_breakfast` / `after_breakfast` 等内部值映射为“早餐前 / 早餐后 / 午餐前 / 午餐后 / 晚餐前 / 晚餐后”；
   - 结果：最近指标列表里不再直接出现技术枚举值，展示更接近真实用户语言。

3. 修复三处“提交成功但列表不刷新”的割裂体验：
   - 文件：
     - `apps/web/app/elder/metrics/metric-form.tsx`
     - `apps/web/app/elder/medication/medication-form.tsx`
     - `apps/web/app/family/bind/bind-form.tsx`
   - 处理内容：三处表单都接入 `useRouter` 并在提交成功后执行 `router.refresh()`；
   - 同时把成功提示文案调整为“保存成功，列表已自动刷新”这一类更符合当前行为的反馈。

#### 校验结果
- 已执行：`pnpm --filter @silver-health/web typecheck`

---

## 42. PWA 可安装上线版第一轮重构

### 本轮目标
- 从 `feature/mobile-first` 新建 `feature/pwa-launch-ready`；
- 把默认体验从开发演示入口调整为可真实试用的手机端工作台；
- 第一阶段按 H5/PWA 形态准备上线，不做小程序、原生 App、真实登录和服务端推送。

### 本轮实际修正
1. 重构底部主导航为四个 Tab：
   - `今日`：默认首页，展示今日任务、进度、下一项待办和快捷入口；
   - `健康`：整合最近指标、录入指标、用药提醒入口；
   - `家属`：保留家属看板作为主 Tab；
   - `我的`：展示档案摘要、当前账号、数据源、API 状态和安装提示。

2. 保留演示入口但从首页降级：
   - `/` 变成上线版默认工作台；
   - 原演示检查和讲解入口迁移到 `/demo`；
   - README、预览文档、demo cheatsheet、3 分钟脚本同步调整口径。

3. 增加 PWA 基础能力：
   - 新增 `manifest.webmanifest`、SVG 图标、离线页、service worker；
   - 新增客户端 service worker 注册组件；
   - 新增安装提示组件，放到首页轻提示和 `我的` 页。

4. 补齐上线部署准备：
   - Web 增加 `.env.example`；
   - API CORS 支持 `CORS_ORIGIN` 多域名配置；
   - 保留 `PORT` 读取，适配 Railway；
   - 新增 `docs/pwa-launch-checklist.md`，记录 Vercel / Railway 环境变量、远程库 seed、验收路径。

5. 修正演示脚本在当前 Node / Prisma 组合下的兼容性：
   - `demo:ready` 内部固定走 `corepack pnpm`，避免不同 pnpm 版本漂移；
   - demo seed / check 脚本兼容 `@prisma/client` CommonJS 默认导出。

### 校验结果
- 已执行：`corepack pnpm --filter @silver-health/web typecheck`
- 已执行：`corepack pnpm --filter @silver-health/web build`
- 已执行：`corepack pnpm --filter @silver-health/api build`
- 已执行：`corepack pnpm demo:ready`

### 当前边界
- 第一阶段仍使用固定演示老人 / 家属账号；
- PWA 当前提供安装壳、图标、基础缓存和离线提示，暂不做推送；
- 线上还需要在 Vercel / Railway 配置生产环境变量，并对远程库执行 seed。
- 结果：通过

#### 当前意义
- 这轮改动虽然不大，但都属于 demo 和真实联调时最容易被立刻感知的问题；
- 修完后页面整体“像个真实产品”的程度明显更高；
- 也验证了当前前端是可以围绕真实 API 模式持续做体验收口的。

#### 下一步建议
1. 继续检查是否还有“提交成功但页面信息未同步”的页面
2. 再看家属周报是否需要补更明确的空态说明
3. 评估是否给指标页补最近记录排序 / 分组说明
4. 视联调结果决定是否把本轮体验修正单独提交成一个 fix commit

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

---

### 42. 页面展示层第一次收口：抽 page-kit，统一核心页卡片 / 提示 / 空态骨架

#### 本轮目标
- 不扩新业务功能，先把老人侧与家属侧核心页面的基础展示层统一起来；
- 避免多个页面各自写 header、卡片、提示框和空态，导致演示时风格割裂。

#### 本轮实际修改
1. 新增公共展示层文件：`apps/web/app/ui/page-kit.tsx`
   - 抽出 `PageHeader`、`StatCard`、`InlineNotice`、`EmptyState`、`DemoStepNotice`；
   - 统一页面内边距、卡片圆角、阴影、tag 与 notice 基础样式。
2. 老人侧 / 家属侧关键页面切到统一骨架：
   - `apps/web/app/elder/home/page.tsx`
   - `apps/web/app/elder/metrics/page.tsx`
   - `apps/web/app/elder/medication/page.tsx`
   - `apps/web/app/family/dashboard/page.tsx`
   - `apps/web/app/family/report/page.tsx`
   - `apps/web/app/family/bind/page.tsx`
3. 首页 `/` 也同步改成演示入口页，而不是纯路由列表。

#### 本轮结果判断
- 当前页面的“像同一个产品”程度明显提升；
- 后续若继续做 demo 收口，可以优先在统一组件层继续修，而不用在每页散改。

#### 下一步建议
1. 继续把表单层的字段名称、默认值和辅助说明从“工程字段”包装成更适合 demo 的产品语言；
2. 在不引入复杂设计系统的前提下，继续保持轻量公共组件策略。

---

### 43. 表单层 demo 体验收口：建档 / 指标 / 用药 / 绑定字段去工程味

#### 本轮目标
- 聚焦老人建档、指标录入、用药提醒、家属绑定 4 个关键表单；
- 把 `userId`、`createdBy*`、`repeatRule` 等工程味字段包装成更自然的产品表达，降低现场演示输入负担。

#### 本轮实际修改
1. `apps/web/app/elder/profile/elder-profile-form.tsx`
   - 补演示友好的默认示例值、占位提示与辅助说明；
   - 让“档案编号可自动生成”等规则直接在页面上说清楚。
2. `apps/web/app/elder/metrics/metric-form.tsx`
   - 调整录入身份、指标时段等表达；
   - 补“保存后会影响哪里 / 下一步看哪里”的提示。
3. `apps/web/app/elder/medication/medication-form.tsx`
   - 将提醒频率、用法等字段包装得更像产品表单；
   - 降低现场临时编造输入的成本。
4. `apps/web/app/family/bind/bind-form.tsx`
   - 弱化 `familyUserId` 这种内部字段，改成更像产品页面的“家属关系 / 照护人”表达。

#### 本轮验证
- `pnpm --filter @silver-health/web typecheck`：通过
- `pnpm --filter @silver-health/web build`：通过

#### 本轮结果判断
- 关键表单已经从“开发者看得懂”往“非技术同学也能顺着讲”推进了一步；
- 后续更自然的方向应该转向摘要层与结果层，而不是再继续拆字段。

#### 下一步建议
1. 补家属看板与家属周报的“一句话摘要 / 结论”能力；
2. 再同步补一份更像提词卡的 3 分钟 demo 讲稿。

---

### 44. 摘要层 / 结果层 demo 收口：家属看板一句话近况，家属周报本周结论

#### 本轮目标
- 承接表单层收口，把家属侧两页从“能展示数据”继续推进到“更容易讲清价值”；
- 优先做摘要层和结果层，不再横向开新功能。

#### 本轮实际修改
1. 家属看板补“一句话近况 + 当前最该关注”
   - 文件：`apps/web/app/family/dashboard/page.tsx`
   - 新增 `buildStatusNarrative()`，把任务完成情况、最近指标、启用提醒自动拼成更像产品摘要的话术；
   - 在统计卡下方增加 success notice，展示“一句话近况”和“家属当前最该关注”。
2. 家属周报补“本周结论 / 下周关注”
   - 文件：`apps/web/app/family/report/page.tsx`
   - 新增 `buildWeeklyHeadline()`，根据运动完成率、用药完成率和指标记录次数自动生成结论与关注点；
   - 页面顶部增加“本周一句话总结”，周报卡片内增加“这一周可以怎么讲”。
3. 补 `docs/demo-script-3min.md`
   - 固化开场、老人侧主链路、家属侧价值、可选补充和收尾话术；
   - 把“建档 → 今日任务 → 指标录入 → 用药提醒 → 家属看板 → 家属周报（必要时补绑定）”整理成可直接照着讲的短讲稿。

#### 本轮验证
- `pnpm --filter @silver-health/web typecheck`：通过
- `pnpm --filter @silver-health/web build`：通过

#### 本轮结果判断
- 家属看板更像“今日近况摘要”，家属周报更像“本周回顾结论”；
- 当前 MVP 主链路已经比较适合直接拿去做短时演示。

#### 下一步建议
1. 继续看首页与本地预览文档是否能进一步承担演示前自检作用；
2. 优先收口启动顺序、演示前 checklist 与首页入口提示。

---

### 45. demo 启动 / 预览流程收口：补首页自检提示、启动顺序与演示前 checklist

#### 本轮目标
- 把“临场怎么稳稳打开项目、先检查什么、按什么顺序讲”整理清楚；
- 优先服务非开发者或隔几天后再回来看项目的人，减少翻路由和猜启动顺序的成本。

#### 本轮实际修改
1. `docs/how-to-preview-locally.md`
   - 明确“先确认数据库就绪，再决定是否 seed，再起 API，再起 Web”的顺序；
   - 补“演示前 30 秒检查清单”和“常见坑速记”；
   - 明确建议从首页 `/` 作为演示入口开始。
2. `apps/web/app/page.tsx`
   - 首页新增“演示前 30 秒自检” notice；
   - 把 API health、首页可打开、抽查 1 个老人页和 1 个家属页数据源状态等检查项直接写进首页。

#### 本轮验证
- `pnpm --filter @silver-health/web typecheck`：通过
- `pnpm --filter @silver-health/web build`：通过

#### 本轮结果判断
- 首页 `/` 已进一步固定成“演示入口 + 自检提示板”；
- 文档也从“能启动”收口成“更适合正式演示前快速过一遍”的说明。

#### 下一步建议
1. 下一自然阶段可统一首页与各核心页面里“真实 API / 演示数据 / Mock 回退”的说法；
2. 也可以做一个很轻的 demo 前检查卡片，让老人页和家属页顶部提示风格更统一。

---

### 46. 统一核心页面顶部提示：抽数据源 notice / checklist 组件，老人页与家属页语气一致

#### 本轮目标
- 统一首页与核心页面里“真实 API / 演示数据 / Mock 回退”的提示文案和语气；
- 在必要时抽轻量公共 notice / checklist 组件，让老人页与家属页顶部提示风格一致。

#### 本轮审查发现
1. 虽然大部分页面已经有“当前数据模式”或 fallback 提示，但写法不一致：有的写“真实数据”，有的写“真实 API”，有的直接把 mock 错误信息裸露出来；
2. 首页有自检 notice，但老人页 / 家属页顶部还缺统一的“这一页该怎么讲 / 该先看什么”结构；
3. 当前 `page-kit.tsx` 已承担 header / notice / empty state 等基础职责，继续在这里抽轻量组件最合适。

#### 本轮实际修改
1. `apps/web/app/ui/page-kit.tsx`
   - 新增 `DataSourceNotice`，统一为“当前接入：真实 API / 演示数据”的说法；
   - 新增 `ChecklistNotice`，统一承载“这一页建议顺手讲清楚 / 演示前自检”这类 checklist 提示。
2. 统一首页与核心页面顶部提示
   - 文件：
     - `apps/web/app/page.tsx`
     - `apps/web/app/elder/home/page.tsx`
     - `apps/web/app/elder/metrics/page.tsx`
     - `apps/web/app/elder/medication/page.tsx`
     - `apps/web/app/family/dashboard/page.tsx`
     - `apps/web/app/family/report/page.tsx`
     - `apps/web/app/family/bind/page.tsx`
   - 调整：
     - 所有关键页都改成先给 `DemoStepNotice`，再给 `DataSourceNotice`，再给 `ChecklistNotice`；
     - fallback 文案统一从“接口失败 / mock 回退”改成“先用演示数据保住讲解节奏，真实 API 恢复后自动切回”的产品口吻；
     - 统计卡中的“当前数据模式”统一改成“当前接入状态”，值统一为“真实 API / 演示数据”。
3. `apps/web/app/elder/home/task-list.tsx`
   - 同步把任务列表统计卡的标签改成“当前接入状态”，避免列表层还保留旧说法。

#### 本轮验证
1. 已执行类型检查：
   - 命令：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过
2. 已执行生产构建：
   - 命令：`pnpm --filter @silver-health/web build`
   - 结果：通过
   - 关键输出：Next.js 15.3.2 完成 `Compiled successfully / Linting and checking validity of types / Generating static pages (11/11)`，退出码为 0。

#### 本轮结果判断
- 首页、老人页、家属页顶部提示已形成统一结构，演示时不用再解释“为什么这页和那页说法不一样”；
- “真实 API / 演示数据”的提示现在既能表达联调状态，也保住了 demo 语气，不再显得是开发临时兜底；
- `page-kit.tsx` 的职责边界仍然很轻，没有引入额外设计系统复杂度。

#### 下一步建议
1. 继续把文档里的旧说法也同步成“当前接入：真实 API / 演示数据”，避免页面统一了、文档还在说 Mock 回退；
2. 若后续还要继续推进，更自然的方向是整理 demo 验证 checklist 与讲稿里的状态判断口径，而不是再加新页面。

---

### 47. 文档口径继续收口：把预览说明与讲稿同步到“当前接入：真实 API / 演示数据”

#### 本轮目标
- 承接第 46 节页面级统一，把文档中的旧说法一并收口；
- 避免页面顶部已经统一成“当前接入”，但本地预览文档还在写“当前数据源 / Mock 回退”。

#### 本轮实际修改
1. 更新 `docs/how-to-preview-locally.md`
   - 把“优先观察页面上的当前数据源卡片”改成“优先观察页面顶部的当前接入提示或当前接入状态卡片”；
   - 把理想结果从“显示真实 API，而不是 Mock 回退”改成“显示当前接入：真实 API / 当前接入状态：真实 API，而不是当前接入：演示数据”；
   - 把演示前 30 秒 checklist 和常见问题里的旧说法同步替换成新的统一口径。
2. 更新 `docs/demo-script-3min.md`
   - 在“今日任务”讲法里补一句：如果顶部显示“当前接入：真实 API”，可以顺手强调真实联调；如果显示“当前接入：演示数据”，也能继续把流程讲顺。

#### 本轮验证
- 文档改动未引入代码风险；
- 本轮代码验证仍沿用第 46 节已通过的：
  - `pnpm --filter @silver-health/web typecheck`
  - `pnpm --filter @silver-health/web build`

#### 本轮结果判断
- 现在页面、首页自检、how-to-preview 和 demo 讲稿已经开始使用同一套“当前接入”口径；
- 后续无论是自己回看项目，还是别人临时接手演示，理解成本都会更低。

#### 下一步建议
1. 若继续推进，一个明确自然的下一阶段是做一轮真实联调复查，把所有关键页截图级核对一遍，确认提示文案、空态和实际数据都符合当前讲稿；
2. 再往后才值得考虑图表趋势、异常提醒或绑定确认细节等增强项。

---

### 48. 真实联调复查：修正默认 elder id、重 seed 今日任务、补齐“隔天回来”空态说明

#### 本轮目标
- 按当前 demo 讲稿与页面顶部提示，实际复查关键页：首页、老人建档 / 今日任务 / 指标 / 用药、家属看板 / 周报 / 绑定；
- 核对“当前接入状态是否正确、空态是否合理、摘要 / 周报文案是否与讲稿一致、首页预检与本地预览文档是否匹配”；
- 若发现不是展示问题而是联调基线问题，直接修正并重新验证。

#### 本轮联调复查发现
1. `apps/web/.env.local` 里的 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID` 少了一个字符，和根目录 `.env`、seed 输出的真实 elder id 不一致；
2. 这会导致 Web 默认请求到一位没有数据的老人，进而把多页真实联调结果误判成“像没数据 / 像要回退演示数据”；
3. 使用正确 elder id 直接调 API 后确认：
   - `/api/metrics/elder/:id`、`/api/medications/elder/:id`、`/api/reports/elder/:id`、`/api/family-bindings/elder/:id` 都能返回真实数据；
   - `/api/tasks/elder/:id` 在 seed 过了几天后会返回空数组，因为“今日任务”只查当天，而旧 seed 的任务日期已经停留在过去；
4. 也就是说，本轮首页“今日任务空态”不是前端渲染 bug，而是 demo 数据基线与当前日期脱节。

#### 本轮实际修正
1. 修正 Web 默认 elder id
   - 文件：`apps/web/.env.local`
   - 调整：把错误的 `cmn5zm37f000ijdo5tp2h0e0` 改为正确的 `cmn5zm37f0000ijdo5tp2h0e0`。
2. 重新生成 demo 数据，恢复当天任务
   - 命令：`pnpm seed:demo`
   - 结果：重新写入 4 条今日任务、3 条指标、2 条用药提醒、2 份周报；随后 `/api/tasks/elder/:id` 已能返回当天任务，不再是空态。
3. 补强首页任务空态说明
   - 文件：`apps/web/app/elder/home/task-list.tsx`
   - 调整：当真实 API 下没有今日任务时，空态直接提示“如果是隔天回来继续演示，优先重跑 `pnpm seed:demo` 或先新建一条今日任务”，把真实排障路径写到页面里。
4. 补强本地预览文档的常见坑说明
   - 文件：`docs/how-to-preview-locally.md`
   - 调整：新增两类高频坑：
     - `apps/web/.env.local` 默认 elder id 写错会导致页面像没数据；
     - 隔天回来继续看项目时，指标 / 用药 / 周报还在，但“今日任务”空了，需要重跑 `pnpm seed:demo`。

#### 本轮实际验证
1. API 可用性复查
   - 已确认：`curl http://localhost:3001/api/health` 返回 `{"code":0,"message":"ok"...}`；
   - 已确认：正确 elder id 下，任务 / 指标 / 用药 / 周报 / 绑定接口都能返回真实数据。
2. Web 工程校验
   - `pnpm --filter @silver-health/web typecheck`：通过；
   - `pnpm --filter @silver-health/web build`：通过。
3. 复查结论
   - 当前关键页对应的接入状态文案与 demo 讲稿已基本一致；
   - 首页预检与 `docs/how-to-preview-locally.md` 的启动 / 检查口径已重新对齐；
   - 本轮最大的真实联调问题不是 UI，而是默认 elder id 和 demo 数据日期漂移，现已修正。

#### 本轮结果判断
- 真实联调链路已恢复到“首页能看到当天任务，老人页 / 家属页都能查到真实数据”的可演示状态；
- 当前最关键的长期注意点已经明确：**演示异常时，优先先查 `apps/web/.env.local` 的 elder id，再查是否需要重跑 `pnpm seed:demo` 更新当天任务。**

#### 下一步建议
1. 如果继续自动推进，最自然的下一阶段是补一轮更接近现场演示的手动链路验证：实际创建 1 条指标 / 1 条用药 / 1 条绑定，确认提交后列表刷新与家属侧摘要联动都仍成立；
2. 这一步做完后，再决定是否有必要补“任务自动生成 / 日期感知”这一类更深层的联调增强，而不是现在就扩功能。

---

### 49. 更接近现场的真实联动复查：验证任务完成 / 指标新增 / 用药新增 / 家属绑定新增，并修复绑定接口 DTO 校验缺失

#### 本轮目标
- 不只停在“列表能读出来”，而是进一步验证几类关键动作在真实 API 下能否成功写入并立即读回；
- 覆盖至少：任务完成、指标新增、用药提醒新增、家属绑定新增；
- 若写入链路存在真实阻塞，直接定位到接口层并修复。

#### 本轮实际复查与发现
1. 已先通过 API 级写入复查确认：
   - 任务完成接口 `PATCH /api/tasks/:taskId/complete` 可用，完成后再次查询任务列表，`done` 数量会增加；
   - 指标新增接口 `POST /api/metrics` 可用，新增后再次查询指标列表，最新一条就是刚创建的数据；
   - 用药提醒新增接口 `POST /api/medications` 可用，新增后提醒列表数量会增加。
2. 但继续验证“创建家属 → 发起绑定”时，发现两个真实 API 都返回 `400 Bad Request`：
   - `/api/users`
   - `/api/family-bindings`
3. 错误内容不是业务失败，而是校验层直接报：`property xxx should not exist`；
4. 结合 `apps/api/src/main.ts` 的全局 `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` 复查后确认，根因是这两个 DTO 没有加 class-validator 装饰器，导致正常字段被当成“不允许出现的未知字段”。

#### 本轮实际修正
1. 修复用户创建 DTO 校验定义
   - 文件：`apps/api/src/modules/user/dto/create-user.dto.ts`
   - 调整：为 `role / nickname / avatar / mobile / openId / unionId / status` 补齐 `@IsEnum`、`@IsString`、`@IsOptional`、`@MaxLength` 等校验装饰器。
2. 修复家属绑定 DTO 校验定义
   - 文件：`apps/api/src/modules/family-binding/dto/create-family-binding.dto.ts`
   - 调整：为 `elderUserId / familyUserId / relationType` 补齐 `@IsString`、`@IsEnum` 等装饰器。
3. 修正后重新走通整条绑定链路
   - 先 `POST /api/users` 创建演示家属；
   - 再 `POST /api/family-bindings` 发起绑定；
   - 最后 `GET /api/family-bindings/elder/:elderUserId` 确认新绑定已出现在列表顶部，状态为 `pending`。

#### 本轮实际验证
1. API 写入级验证结果
   - 任务完成：成功，任务状态从 `todo` 变为 `done`；
   - 指标新增：成功，最新指标列表已出现新建记录；
   - 用药提醒新增：成功，提醒总数已增加且包含新增项；
   - 家属创建 + 绑定新增：修复 DTO 后成功，绑定列表已能读回新创建的家属关系。
2. 工程验证
   - `pnpm --filter @silver-health/api typecheck`：通过；
   - `pnpm --filter @silver-health/web typecheck`：通过；
   - `pnpm --filter @silver-health/web build`：通过。

#### 本轮结果判断
- 这轮复查把“页面看起来像能用”和“真实写入链路真的能成”区分开了；
- 家属绑定此前实际上存在真实 API 阻塞，只是之前没通过现场级写入复查暴露出来；现在这条阻塞已解除；
- 当前 demo 主链路里“老人录入 → 家属查看 / 绑定补充”的关键读写链路已基本具备可演示可信度。

#### 下一步建议
1. 如果还要继续自动推进，最自然的下一阶段是补一轮面向稳定性的收口：检查是否需要把 `seed-demo-data.ts` 的“今日任务日期感知”写得更抗时间漂移，减少隔天回来必须手动重 seed 的概率；
2. 若暂不动后端生成逻辑，也至少可以把“重 seed 是标准恢复动作”继续沉淀到 README 或联调状态文档，降低接手成本。

---

### 50. Demo 数据稳定性收口：把 seed 改成相对当天生成，优先解决隔天任务过期与日期漂移

#### 本轮目标
- 处理第 49 阶段已经明确的稳定性问题：旧 demo seed 写死日期，导致隔天回来后 `/elder/home` 容易直接空掉；
- 不只补“重跑 seed”的说明，而是先把 demo 数据本身改成更接近长期可用的滚动生成；
- 同时把这套稳定口径同步到页面空态与本地预览文档里。

#### 本轮实际修正
1. 为 demo 数据新增统一日期工具
   - 文件：`scripts/demo-date-utils.ts`
   - 内容：抽出 `getLocalDateOnly`、`getLocalDateTime`、`getWeekRange`、`formatLocalDate` 等工具，统一用“相对今天 / 相对最近完整周”的方式生成演示日期，而不是继续散落写死时间常量。
2. 改造 `seed-demo-data.ts` 为滚动 seed
   - 文件：`scripts/seed-demo-data.ts`
   - 调整：
     - 今日任务改为总是写入当天；
     - 指标改为“今天 / 昨天 / 前天”的相对时间；
     - 家属周报改为“最近完整周 + 再往前一周”；
     - seed 输出里直接打印本次对齐到的 taskDate、latest metric 时间与 latestWeek，方便启动时快速确认。
3. 页面空态改成优先引导自检而不是只提示重 seed
   - 文件：`apps/web/app/elder/home/task-list.tsx`
   - 调整：老人首页任务空态文案改为优先提示 `pnpm check:demo`，只有脚本判定数据失稳后再决定是否重跑 `pnpm seed:demo` 或手动补任务。
4. 本地预览文档同步为“先自检、再决定是否 reseed”
   - 文件：`docs/how-to-preview-locally.md`
   - 调整：
     - 启动步骤从“如需重建演示数据，执行 seed”改成“先跑 `pnpm check:demo`，脚本报异常再 seed”；
     - 演示前 30 秒检查清单补入 `pnpm check:demo`；
     - 常见坑说明更新为：现在 seed 会自动滚动对齐当天日期，优先以自检脚本判断是否真的需要 reseed。

#### 本轮验证
1. 已执行：`pnpm seed:demo`
   - 结果：seed 成功，输出显示任务已对齐到 `2026-03-28`，周报已对齐到 `2026-03-16 ~ 2026-03-22`。
2. 工程验证：
   - `pnpm --filter @silver-health/api typecheck`：通过；
   - `pnpm --filter @silver-health/web typecheck`：通过；
   - `pnpm --filter @silver-health/web build`：通过。
3. 本轮阶段性结论
   - demo 数据的主要时间漂移问题已经从“靠人记得隔天 reseed”前移到“seed 自己按当天滚动”，稳定性明显更高；
   - 但为了真正做到现场可复用，还需要一条可机器判断的自检链路，避免只靠肉眼看页面有没有空。

#### 下一步建议
1. 下一自然阶段很明确：补一条 `pnpm check:demo` 自检脚本，把“今日任务 / 最新指标 / 启用提醒 / 家属绑定 / 最近完整周周报”是否齐备自动检查掉；
2. 做完后，再决定是否需要继续沉淀到 README 或启动脚本。

---

### 51. Demo 数据自检脚本：把“今天还能不能直接演示”变成可执行检查

#### 本轮目标
- 承接第 50 阶段，避免仍然依赖人工打开页面才知道 demo 数据有没有漂；
- 补一条轻量自检命令，让演示前 30 秒可以快速确认当天任务、指标、提醒、绑定、周报是否还在。

#### 本轮实际修正
1. 新增自检脚本
   - 文件：`scripts/check-demo-data.ts`
   - 能力：
     - 读取固定演示老人 / 家属账号；
     - 检查当天任务数；
     - 检查最新指标是否存在；
     - 检查启用中的提醒数量；
     - 检查家属绑定是否仍为 active；
     - 检查最新周报是否对齐最近完整周；
     - 任一关键项缺失时直接以非零退出并打印原因。
2. 根脚本新增统一入口
   - 文件：`package.json`
   - 调整：新增 `check:demo`，统一为 `pnpm check:demo`。
3. 修复自检过程中的两个实现细节
   - 自检最初与 `seed:demo` 并行执行时会互相抢时序，导致周报读取到旧数据；后续改为串行验证；
   - `DailyTask.taskDate` 是 `@db.Date`，运行时时区与 Prisma 映射容易让直接日期区间判断失真，因此自检最终改为读取任务后按 `formatLocalDate(task.taskDate)` 比对，避免时区误判。

#### 本轮验证
1. 已执行：`pnpm check:demo`
   - 结果：通过，输出显示当天任务 `4` 条、提醒 `2` 条、active 绑定 `1` 条、最新周报为 `2026-03-16 ~ 2026-03-22`。
2. 已再次串行验证：`pnpm seed:demo && pnpm check:demo`
   - 结果：seed 后立即自检可通过，说明“滚动 seed + 自检”组合已经可用。
3. 工程验证复查：
   - `pnpm --filter @silver-health/api typecheck`：通过；
   - `pnpm --filter @silver-health/web typecheck`：通过；
   - `pnpm --filter @silver-health/web build`：通过。

#### 本轮结果判断
- 现在 demo 稳定性不再只靠文档提醒“必要时 reseed”，而是形成了更实用的两步：先 `pnpm check:demo`，异常再 `pnpm seed:demo`；
- 这让 Silver Health 的启动 / 演示流程更像一个可交接的项目，而不是只能靠开发者本人记住隐性排障知识。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段是把这套“先 check、再 seed”的口径再同步到 README 或更靠近入口的位置，进一步降低接手成本；
2. 另一条可选收口是补一个组合脚本（例如启动前自检提示），但这已经属于体验增强，不是当前阻塞。

---

### 52. 把 check / seed 流程前移到 README 入口，降低接手成本

#### 本轮目标
- 承接第 51 阶段，不让“先 `pnpm check:demo`，异常再 `pnpm seed:demo`”只停留在开发日志和局部文档里；
- 优先把这条接手动作沉淀到所有人第一眼最容易看到的入口，也就是仓库 `README.md`；
- 让后来者不用先翻长文档，也能立刻知道项目现在该怎么启动、怎么判断 demo 数据是否可用。

#### 本轮实际修正
1. 重写仓库 README 的入口结构
   - 文件：`README.md`
   - 调整：把“现在最该先知道的事”前置到最顶部，明确写出：
     - 先执行 `pnpm check:demo`；
     - 失败时执行 `pnpm seed:demo && pnpm check:demo`；
     - 再启动 API / Web，并从首页 `/` 进入演示。
2. README 新增更显眼的接手信息
   - 增加了：
     - 快速启动；
     - 推荐演示入口；
     - 演示前 30 秒最小检查；
     - 常用命令清单；
     - 当前项目状态；
     - 关键文档阅读顺序。
3. 入口文档口径与已有本地预览说明重新对齐
   - README 不再停留在“工程骨架介绍”，而是改成真正面向接手 / 启动 / 演示的入口文档；
   - 这样即使不先看 `docs/development-progress-log.md`，也能先按当前稳定流程把项目跑起来。

#### 本轮验证
1. 文档级复查
   - 已逐段复查 README，确认顶部已经直接暴露 check / seed 规则与推荐启动顺序；
   - 已确认 README 中的默认 elder id、命令名、入口页与现有实现一致。
2. 口径一致性复查
   - README 中的“先 check、异常再 seed”与 `docs/how-to-preview-locally.md`、第 51 阶段结论一致；
   - 首页 `/` 仍作为统一演示入口，与 README 推荐顺序一致。

#### 本轮结果判断
- 第 52 阶段完成后，check / seed 流程已经不再是开发者隐性知识，而是进入仓库第一入口；
- Silver Health 的接手门槛进一步下降：别人打开仓库时，已经能直接看到“先做什么、失败怎么办、从哪里开始讲”。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段是补一个更省心的组合命令，把 `check → seed → re-check` 进一步固化成一条 demo 准备快捷命令；
2. 做完后，再把这条快捷命令同步到首页自检提示和本地预览文档，形成“README / 入口页 / 说明文档”三处一致。

---

### 53. 新增 `pnpm demo:ready`，把演示前准备收口成一条快捷命令

#### 本轮目标
- 承接第 52 阶段，不只告诉接手者应该怎么判断，还要进一步减少手动执行和记忆负担；
- 把“先 check，失败再 seed，最后再 check 一次”沉淀成一条统一命令，适合作为演示前 30 秒的默认动作。

#### 本轮实际修正
1. 新增演示准备脚本
   - 文件：`scripts/demo-ready.ts`
   - 行为：
     - 先执行 `pnpm check:demo`；
     - 若通过，则直接提示当前数据可演示；
     - 若失败，则自动执行 `pnpm seed:demo`；
     - seed 完成后再次执行 `pnpm check:demo`；
     - 若二次检查通过，则明确提示现在可以启动 API / Web 进入演示。
2. 根脚本新增统一入口
   - 文件：`package.json`
   - 调整：新增 `demo:ready`，统一为 `pnpm demo:ready`。
3. 把快捷命令同步到更显眼的位置
   - 文件：
     - `README.md`
     - `docs/how-to-preview-locally.md`
     - `apps/web/app/page.tsx`
   - 调整：
     - README 的常用命令和快速启动里加入 `pnpm demo:ready`；
     - 本地预览文档把它升级为“最省心的准备方式”；
     - 首页“演示前 30 秒自检”提示也改成优先建议先跑 `pnpm demo:ready`。

#### 本轮验证
1. 已执行：`pnpm demo:ready`
   - 结果：通过；在当前 demo 数据已正常的情况下，脚本会先执行 `pnpm check:demo`，随后直接提示“当前数据已可直接演示，无需重建 seed”。
2. 工程验证复查：
   - `pnpm --filter @silver-health/web typecheck`：通过；
   - `pnpm --filter @silver-health/web build`：通过。

#### 本轮结果判断
- 到第 53 阶段，Silver Health 的演示前准备已经从“看文档照着做”进一步收口成“一条命令先跑起来”；
- README、首页和本地预览文档三处入口对外给出的动作已经一致，接手成本继续下降。

#### 下一步建议
1. 如果还要继续自然推进，最值得做的是补一页更短的“demo day cheatsheet”或把首页入口继续压缩成更现场化的话术；
2. 但就当前阻塞看，check / seed / 准备命令的入口沉淀已经完成，已不再是接手门槛。

---

### 54. 新增 demo-day cheatsheet，把现场提词卡压到“每页只讲一句”

#### 本轮目标
- 承接第 53 阶段，继续把 demo 接手成本往下压；
- 不再只给 3 分钟长讲稿，而是补一页临上场前 30 秒能扫完的 cheatsheet；
- 让临时代讲的人不用翻长文档，也知道“按什么顺序点、每页只说一句什么”。

#### 本轮实际修正
1. 新增超短提词卡文档
   - 文件：`docs/demo-day-cheatsheet.md`
   - 内容：
     - 先跑 `pnpm demo:ready`；
     - 固定 6 步演示顺序；
     - 每个页面只保留 1 句讲法；
     - 推荐只做 3 个现场动作（勾 1 个任务、补 1 条指标、切家属侧看结果）；
     - 追加 30 秒收尾话术和 6 句忘词提词卡。
2. 把 cheatsheet 正式接入入口文档
   - 文件：`README.md`
   - 调整：在“关键文档”阅读顺序里把 `docs/demo-day-cheatsheet.md` 前移到 `docs/demo-script-3min.md` 之前，明确它是 demo 当天最短入口。
3. 同步更新本地预览文档的优先阅读顺序
   - 文件：`docs/how-to-preview-locally.md`
   - 调整：不再优先指向旧的局部说明，而是改成 `README.md` → `docs/demo-day-cheatsheet.md` → `docs/demo-script-3min.md` → `docs/development-progress-log.md` 这条更贴近接手/演示的顺序。

#### 本轮验证
1. 文档一致性复查
   - 已复查 cheatsheet 中的命令名、页面顺序、页面地址与当前 README / 首页一致；
   - 已确认文档间对外给出的主链路仍然统一为：建档 → 今日任务 → 指标录入 → 用药提醒 → 家属看板 → 家属周报。

#### 本轮结果判断
- 第 54 阶段完成后，Silver Health 的 demo 资料不再只有“完整讲稿”，还多了一页真正适合现场偷看的短提词卡；
- 接手者现在可以按“README 看启动、cheatsheet 看提词、3 分钟讲稿看完整版”这一层次使用文档，效率更高。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段就是把首页入口页的话术也同步压缩，让页面本身就能兼任 cheatsheet；
2. 这样可以减少“文档很短了，但首页仍然有点偏说明书”的落差。

---

### 55. 首页入口页再压一轮，把临场讲法直接写进页面

#### 本轮目标
- 承接第 54 阶段，不让最短提词卡只存在于 docs；
- 把首页入口页继续从“演示说明页”往“现场提词页”方向压缩，让操作者少看文档、少想下一句怎么说。

#### 本轮实际修正
1. 压缩首页开场描述
   - 文件：`apps/web/app/page.tsx`
   - 调整：页面顶部描述从解释型文案改成更短的固定顺序提示，降低阅读负担。
2. 把首页第一块提示改成一句核心价值
   - 文件：`apps/web/app/page.tsx`
   - 调整：顶部提示从“推荐讲法”收口成一句最核心的话：**老人负责日常执行，家属负责远程查看。**
3. 首页自检项进一步收短
   - 文件：`apps/web/app/page.tsx`
   - 调整：把“演示前 30 秒自检”收成 3 条最小动作：
     - 先跑 `pnpm demo:ready`；
     - 抽查 `/elder/home` 和 `/family/dashboard` 的真实 API 接入；
     - 现场只做“任务 + 指标 + 家属侧查看”三件事即可。
4. 直接把“忘词时就按这 6 句讲”写进首页
   - 文件：`apps/web/app/page.tsx`
   - 调整：新增一块 success 风格的 6 句提词卡，把最短 demo 话术直接固定在入口页，不再要求演示者额外翻文档。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
2. 已启动本地 Web 服务检查移动端页面
   - 首次在沙箱内启动失败，原因是本地监听端口受限；随后经授权启动成功；
   - `3000` 端口已被占用，Next.js 自动改用 `http://localhost:3002`。
3. 已用 390px 手机视口检查首页 `/`
   - 结果：无横向溢出；
   - 首页入口卡片在手机宽度下已单列展示。
4. 已用 390px 手机视口检查老人首页 `/elder/home`
   - 结果：无横向溢出；
   - 统计卡已修正为三列紧凑布局；
   - “标记完成”按钮高度为 48px，手机端宽度撑满任务卡操作区。
5. 已再次执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
6. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 55 阶段，首页已经不只是“从哪进页面”，而是开始承担“临场演示怎么讲”的作用；
- 这让 Silver Health 的 demo 入口进一步从文档驱动变成页面驱动，更适合临时接手或现场快速回忆。

#### 下一步建议
1. 如果还要继续自然推进，下一自然阶段可考虑给首页 6 张步骤卡补一个更轻的“推荐现场动作”标识，进一步提示哪些页面一定要动、哪些只讲不动；
2. 另一条可选方向是继续压缩家属看板 / 周报中的长句摘要，让家属侧收尾更利落。

---

### 56. 首页步骤卡补“现场操作 / 轻讲即可”提示，降低临场误操作概率

#### 本轮目标
- 承接第 55 阶段，把首页从“提词页”再往前推一小步；
- 明确提示哪些页面值得现场真实操作，哪些页面更适合只讲不动，减少 demo 时在次要页面上浪费时间；
- 让临时代讲的人看首页就能知道最小动作集，而不用自己判断。

#### 本轮实际修正
1. 首页 7 张步骤卡补充动作提示
   - 文件：`apps/web/app/page.tsx`
   - 调整：为每张卡片新增 `actionHint`，明确区分：
     - 老人建档 / 今日任务 / 指标录入：建议现场真实操作；
     - 用药提醒 / 家属看板 / 家属周报：优先轻讲即可；
     - 家属绑定：只在被追问时再打开。
2. 首页新增“现场动作最小集”提示块
   - 文件：`apps/web/app/page.tsx`
   - 调整：直接把“建档保存 1 次、任务完成 1 项、指标新增 1 条”固定为最小动作组合，并明确后面家属页优先只讲即可。
3. 文档侧同步收口动作优先级
   - 文件：`docs/demo-day-cheatsheet.md`
   - 调整：把第 3 节改成更清晰的演示动作分层：
     - 真正建议现场操作的 3 个动作；
     - 后续页面优先只讲不动；
     - 家属绑定仅在被问到关系建立时再补。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 56 阶段，首页已经不只是告诉你“先去哪页”，还开始直接限制 demo 动作范围；
- 这对临场稳定性很值钱：演示者更不容易在用药提醒、家属绑定这类次要页面上停太久，主链路更容易讲顺。

#### 下一步建议
1. 下一自然阶段就是继续压家属看板 / 周报的收尾话术，把最后 30 秒讲得更短、更稳；
2. 如果顺手同步到讲稿文档，会比只改页面更耐用。

---

### 57. 家属看板 / 周报再压一轮收尾话术，固定“今天 + 一周”的结束句

#### 本轮目标
- 承接第 56 阶段，把家属侧最后两页收得更利落；
- 避免演示者到了结尾又开始逐块念数据，而是能直接落到固定结束句；
- 同时把“这一页通常只讲不操作”的现场策略写进页面与讲稿文档。

#### 本轮实际修正
1. 家属看板的一句话近况再压短
   - 文件：`apps/web/app/family/dashboard/page.tsx`
   - 调整：
     - 把“当前最该关注”收成更口语的短句；
     - 在成功提示块里补一条固定收尾话术：**家属不用翻原始记录，先看这里就知道今天要不要跟进。**
     - checklist 里明确写出：这一页通常只讲不操作，停 15 秒内讲完即可。
2. 家属周报补固定结束句
   - 文件：`apps/web/app/family/report/page.tsx`
   - 调整：
     - 在“本周一句话总结”提示块里补一条固定收尾话术：**系统不只记录今天，还会把这一周沉淀成家属看得懂的回顾。**
     - checklist 里明确：这一页通常也只讲不操作，讲完再视情况补家属绑定。
3. 讲稿文档同步更新现场策略
   - 文件：`docs/demo-script-3min.md`
   - 调整：
     - 在家属看板与家属周报两节下都补了“现场建议”；
     - 统一口径为：看板讲“今天”，周报讲“一周”，两页都优先只讲不操作。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 57 阶段，家属侧收尾已经从“有摘要可读”进一步变成“有固定结束句可直接说”；
- 首页、页面内提示和 demo 文档现在对“哪些要操作、哪些只讲即可”的口径也已经基本一致，临场稳定性又上了一层。

#### 下一步建议
1. 若继续推进，下一自然阶段可以考虑把 README / 本地预览文档中的“演示前 30 秒最小检查”也补成同样的动作分层，进一步统一入口文案；
2. 但就当前 demo 主链路而言，最值钱的现场提示已经基本齐了。


### 58. 入口文档口径统一：README / 本地预览说明都明确“30 秒检查 + 现场操作分层 + 只讲即可”

#### 本轮目标
- 承接第 56 / 57 阶段已经落到首页、家属页和提词卡里的“现场操作分层”；
- 优先完成用户明确指定的下一自然阶段：统一 `README.md` 与 `docs/how-to-preview-locally.md` 中关于“演示前 30 秒检查 / 现场操作分层 / 只讲即可”的说法；
- 避免入口文档还停留在“能启动就行”，而页面与提词卡已经进入“怎么更稳地讲”的状态。

#### 本轮实际修改
1. 更新 `README.md`
   - 把“演示前 30 秒最小检查”统一收口为“演示前 30 秒检查”；
   - 明确检查顺序优先跑 `pnpm demo:ready`，再抽查首页和老人/家属页的“当前接入：真实 API”；
   - 新增独立的“现场操作分层”小节，固定：
     - 建议现场操作：建档保存 1 次、完成 1 项任务、录入 1 条指标；
     - 优先只讲即可：用药提醒、家属看板、家属周报；
     - 只在被问到时再补：家属绑定。
2. 更新 `docs/how-to-preview-locally.md`
   - 把“演示前 30 秒检查清单”里的最小自检、完整主链路确认和现场操作分层写成同一套说法；
   - 明确把“前 3 步真正动手，后 3 步优先只讲即可，绑定页只在被问到时再补”落进本地预览文档，不再只存在首页与 cheatsheet。

#### 本轮验证
1. 文档口径检查：
   - 已用脚本逐项检查 `README.md` 与 `docs/how-to-preview-locally.md` 中均包含：
     - “演示前 30 秒检查 / 演示前 30 秒检查清单”
     - “现场操作分层”
     - “优先只讲即可”
     - `pnpm demo:ready`
2. 结果：通过。

#### 本轮结果判断
- 到第 58 阶段，仓库入口文档和本地预览文档已经不再只是“怎么跑项目”，而是开始稳定承担“演示前先检查什么、现场真正只动哪几步”的职责；
- 入口口径现在和首页 / 页面 checklist / cheatsheet 的方向已经基本对齐，接手者更不容易在次要页面上多做动作。

#### 下一步建议
1. 下一自然阶段是继续把更上游的入口动作也统一掉：README 顶部和相关提词材料全部明确优先 `pnpm demo:ready`；
2. 顺手修掉 `docs/demo-script-3min.md` 的末尾异常内容，避免讲稿层继续成为脱节点。

---

### 59. 继续把入口动作统一到 `pnpm demo:ready`，并清理 3 分钟讲稿尾部异常内容

#### 本轮目标
- 承接第 58 阶段，继续消除“有的入口先写 `check:demo`、有的入口先写 `demo:ready`”的分裂感；
- 把 README 顶部入口、demo cheatsheet、3 分钟讲稿统一成同一套动作分层与准备口径；
- 顺手修复 `docs/demo-script-3min.md` 的尾部异常乱码，避免演示时翻到讲稿末尾出戏。

#### 本轮实际修改
1. 继续更新 `README.md`
   - 顶部“现在最该先知道的事”改成优先运行 `pnpm demo:ready`；
   - 快速启动里的“准备演示数据”也明确优先 `pnpm demo:ready`，手动分步时才再展示 `check -> seed -> check`。
2. 更新 `docs/demo-day-cheatsheet.md`
   - 把“最推荐的现场动作”正式改名为“现场操作分层”；
   - 将“建议现场操作 / 优先只讲即可 / 只在被问到时再补”三层结构固定下来。
3. 重写 `docs/demo-script-3min.md`
   - 清理掉文件末尾重复 / 异常内容，恢复为正常 UTF-8 文本；
   - 在用药提醒、家属看板、家属周报段落中明确“优先只讲即可 / 通常只讲不操作”；
   - 在结尾补一条总规则：**前 3 步真正动手，后 3 步优先只讲即可，绑定页只在被问到时再补。**

#### 本轮验证
1. 已用脚本检查以下文件的统一口径：
   - `README.md`
   - `docs/how-to-preview-locally.md`
   - `docs/demo-day-cheatsheet.md`
   - `docs/demo-script-3min.md`
2. 检查项包括：
   - `pnpm demo:ready`
   - “现场操作分层”
   - “优先只讲即可”
   - “前 3 步真正动手，后 3 步优先只讲即可”
3. 结果：通过。

#### 本轮结果判断
- 到第 59 阶段，Silver Health 的演示口径已经形成较稳定的四层一致：仓库入口 README、本地预览说明、demo cheatsheet、3 分钟讲稿；
- 演示准备动作也更统一：默认先 `pnpm demo:ready`，真正现场只动前 3 步，后 3 步优先只讲即可；
- 讲稿文件本身也恢复到可直接翻看的干净状态，不再有尾部异常文本。

#### 下一步建议
1. 如果继续自动推进，最自然的下一阶段是把首页 `apps/web/app/page.tsx` 的“演示前 30 秒自检”和 README 的文字完全逐句对齐，进一步减少入口之间的细微差异；
2. 再往后才值得考虑更细的现场异常兜底话术（例如 API 不通时每页各用哪句兜住），而不是继续扩功能。

---

### 60. 首页入口文案逐句对齐 README，收掉最后一点“自检 / 分层”差异

#### 本轮目标
- 承接第 59 阶段用户明确指定的下一自然阶段；
- 把首页 `apps/web/app/page.tsx` 上的“演示前 30 秒检查 / 现场操作分层”直接对齐到 README 与本地预览说明的口径；
- 避免接手者从首页开始讲时，看到的标题和关键句还和文档层有细小差别。

#### 本轮实际修改
1. 更新首页“演示前 30 秒检查”提示
   - 文件：`apps/web/app/page.tsx`
   - 调整：
     - 标题从“演示前 30 秒”改成和 README 一致的“演示前 30 秒检查”；
     - 内容统一成：优先 `pnpm demo:ready`，至少也要 `pnpm check:demo` 通过；
     - 同时补上首页 `/` 可打开、抽查老人页 / 家属页顶部“当前接入：真实 API”，以及完整主链路要额外确认任务 / 一句话近况 / 最近完整周周报三项。
2. 更新首页“现场操作分层”提示
   - 文件：`apps/web/app/page.tsx`
   - 调整：
     - 标题从“现场动作最小集”改成和 README / cheatsheet 一致的“现场操作分层”；
     - 三层内容统一写成：建议现场操作 `/elder/profile` + `/elder/home` + `/elder/metrics`；优先只讲即可 `/elder/medication` + `/family/dashboard` + `/family/report`；只在被问到时再补 `/family/bind`。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 60 阶段，首页这个最上游入口终于和 README / preview / cheatsheet / script 的 demo 口径完全站到同一条线上；
- 之前那种“文档写的是检查 / 分层，首页写的是自检 / 最小集”的轻微漂移已经收掉，别人从首页直接接讲时不容易再被入口措辞打断。

#### 下一步建议
1. 如果继续自动推进，最自然的下一阶段是把这套统一口径变成脚本化检查，而不是继续靠人工 grep；
2. 这样后面再改首页或文档时，能第一时间发现哪一层又漂了。

---

### 61. 把 demo 入口口径一致性脚本化，避免首页与文档再次漂移

#### 本轮目标
- 承接第 60 阶段，进一步把“入口文案统一”从一次性整理提升为可重复校验；
- 避免未来继续改 README / preview / cheatsheet / script / homepage 时，又回到人工肉眼比对的低稳定方式。

#### 本轮实际修改
1. 新增 demo 文案一致性检查脚本
   - 文件：`scripts/check-demo-copy.ts`
   - 处理内容：
     - 统一检查 `README.md`、`docs/how-to-preview-locally.md`、`docs/demo-day-cheatsheet.md`、`docs/demo-script-3min.md`、`apps/web/app/page.tsx`；
     - 校验这些文件都包含当前已固定下来的关键口径，例如：
       - `pnpm demo:ready`
       - “演示前 30 秒检查”
       - “现场操作分层”
       - “优先只讲即可”
       - “前 3 步真正动手，后 3 步优先只讲即可”
2. 根脚本补充新命令
   - 文件：`package.json`
   - 调整：新增 `pnpm check:demo-copy`，后续可直接在演示资料改动后复跑。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
3. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 61 阶段，这套 demo 接手资料已经不仅是“人工整理一致”，而是开始具备最小自动守护；
- 后续只要首页、README、preview、cheatsheet 或 script 再次发生偏移，就能用 `pnpm check:demo-copy` 很快发现，不必再靠人工逐个 grep。

#### 下一步建议
1. 下一自然阶段可以考虑把 `pnpm check:demo-copy` 并进更上游的演示准备流（例如 `demo:ready` 之后的补充检查），进一步降低接手时的漏检概率；
2. 但在当前阶段，入口文案一致性这条收口线已经基本闭合，优先级已经明显低于真正的联调异常兜底话术。

---

### 62. 继续补上“真实 API 不通时怎么讲”的异常兜底话术

#### 本轮目标
- 承接第 61 阶段已经搭好的入口一致性与脚本检查；
- 继续完成下一个更自然的收口点：当现场顶部显示“当前接入：演示数据”时，给接手者一套固定说法，而不是临场现编；
- 保证即使真实 API 当下没接上，也不会把整条 demo 故事讲乱。

#### 本轮实际修改
1. 首页补充异常兜底提示
   - 文件：`apps/web/app/page.tsx`
   - 调整：新增 `ChecklistNotice`，标题为“如果现场没连上真实 API”；
   - 固定说法包括：
     - 先指出顶部“当前接入：演示数据”；
     - 说明当前先用演示数据保住讲解节奏；
     - 仍按建档 → 今日任务 → 指标录入 → 家属看板 / 周报的同一条主链路继续讲；
     - 最后补一句真实 API 恢复后会自动切回。
2. 本地预览文档同步异常场景说法
   - 文件：`docs/how-to-preview-locally.md`
   - 调整：在“演示时的启动顺序建议”之后新增“如果现场没连上真实 API”小节，明确不要改讲法、只换说明。
3. 3 分钟讲稿同步一句兜底话术
   - 文件：`docs/demo-script-3min.md`
   - 调整：在结尾补充可直接念的一句话：先指出当前接入演示数据，真实 API 恢复后会自动切回。
4. 文案检查脚本同步覆盖异常场景关键字
   - 文件：`scripts/check-demo-copy.ts`
   - 调整：把“如果现场没连上真实 API”纳入 preview / script / homepage 的一致性校验。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
3. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 62 阶段，Silver Health 的 demo 入口不只统一了“平时怎么讲”，也开始有了“异常时怎么稳住”的固定话术；
- 这让首页、preview 文档和 3 分钟讲稿在正常场景与异常场景下都能给出一致指导，接手稳定性又往前推了一步。

#### 下一步建议
1. 如果还要继续自动推进，下一自然阶段可以考虑把 `pnpm check:demo-copy` 并入 `pnpm demo:ready` 的成功链路，形成“准备 demo 数据 + 检查 demo 口径”的一条更完整入口；
2. 再往后才值得考虑是否把异常兜底扩展到各具体页面，而不是继续堆首页提示。

---

### 63. 把 `check:demo-copy` 并入 `demo:ready` 成功链路，收口“数据 + 讲法口径”同一入口

#### 本轮目标
- 承接第 62 阶段已经明确的下一自然动作；
- 把 `pnpm check:demo-copy` 从“单独可跑的补充检查”提升为 `pnpm demo:ready` 成功链路的一部分；
- 让接手者不只准备好当天 demo 数据，也能顺带确认 README / 首页 / 提词材料的关键讲法没有漂移。

#### 本轮实际修改
1. 更新 `scripts/demo-ready.ts`
   - 新增 `runCopyCheck()`，在 demo 数据链路成功后自动执行 `pnpm check:demo-copy`；
   - 当 `pnpm check:demo` 首次即通过时，也会继续补做文案一致性检查，不再提前返回；
   - 成功提示改为更明确的“check → seed → re-check + demo copy check”，让输出直接说明现在检查了哪几层。
2. 同步 README 与本地预览说明口径
   - 文件：`README.md`、`docs/how-to-preview-locally.md`
   - 调整：把 `pnpm demo:ready` 的描述统一升级成“准备 demo 数据 + 补做 `check:demo-copy`”；
   - 让接手者更清楚它现在不只是数据准备命令，也是演示口径收口入口。
3. 同步 demo cheatsheet 提示
   - 文件：`docs/demo-day-cheatsheet.md`
   - 调整：在最上方直接说明 `pnpm demo:ready` 通过后，demo 数据和 README / 首页 / 提词材料的关键口径会一起过检查。

#### 本轮验证
1. 已执行：`pnpm demo:ready`
   - 结果：通过；日志显示先通过 `pnpm check:demo`，随后自动执行 `pnpm check:demo-copy` 并通过。
2. 已执行：`pnpm check:demo-copy`
   - 结果：通过。
3. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
4. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 63 阶段，`pnpm demo:ready` 已经从“只准备 demo 数据”升级成“数据 + 讲法口径”的一条完整入口；
- 这能明显降低接手时的漏检概率：即使人只记得跑一条命令，也会一起覆盖数据稳定性和演示资料一致性；
- 当前没有出现新的阻塞、等待态或任务边界变化。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段更适合做的是把 `demo:ready` 的成功输出再压成更明确的演示前结论摘要，例如直接提示“现在可开 API / Web，并优先从首页 `/` 开讲”；
2. 再往后才值得考虑把更细的异常兜底扩展到具体页面级别，而不是继续扩首页文案。

---

### 64. 把 `demo:ready` 成功结果压成更明确的接手结论，直接告诉接手者“现在可以开 API / Web，并优先从首页开讲”

#### 本轮目标
- 承接第 63 阶段已经收口的“数据 + 讲法口径”统一入口；
- 继续把 `pnpm demo:ready` 的成功结果从“脚本通过”压缩成更直接的人话结论；
- 让临时接手者不必自己从日志反推下一步，而是直接看到“现在可以开 API / Web，并优先从首页 `/` 开讲”。

#### 本轮实际修改
1. 更新 `scripts/demo-ready.ts`
   - 成功链路末尾新增更明确的总结输出：
     - `Demo ready: 已完成“check → seed → re-check + demo copy check”。`
     - `Demo ready 结论：现在可以启动 API / Web，并优先从首页 / 开讲。`
   - 让脚本在演示前准备完成后，直接给出接手动作，而不是只停在检查通过。
2. 同步入口文档与提词材料
   - 文件：`README.md`、`docs/how-to-preview-locally.md`、`docs/demo-day-cheatsheet.md`、`docs/demo-script-3min.md`
   - 调整：都补入同一条结论口径——`pnpm demo:ready` 通过后，现在可以开 API / Web，并优先从首页 `/` 开讲。
3. 同步首页入口提示
   - 文件：`apps/web/app/page.tsx`
   - 调整：在“演示前 30 秒检查”里直接补入这条结论，避免页面层和文档层仍然需要接手者自己翻译。

#### 本轮验证
1. 已执行：`pnpm demo:ready`
   - 结果：通过；demo 数据检查、demo 文案一致性检查均通过，并能输出最终接手结论。
2. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
3. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 64 阶段，`demo:ready` 的成功输出已经从“脚本型日志”进一步压成“接手动作结论”；
- README、preview、cheatsheet、script 和 homepage 也都能用同一句话告诉接手者：现在可以开 API / Web，并优先从首页 `/` 开讲；
- 这比之前只写“check 通过”更接近真实现场需要的提示强度。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段适合顺手做一次 `demo:ready` 输出链路复查，确认首次 `check:demo` 直接通过的路径也会稳定打印最终结论，而不是只在 seed 分支打印；
2. 在此之前没有新的阻塞、等待态或任务边界变化。

---

### 65. 顺手修正 `demo:ready` 的快速通过分支，确保无需 seed 时也会打印最终结论

#### 本轮目标
- 承接第 64 阶段的输出摘要改造；
- 验证脚本在“首次 `check:demo` 就通过”的真实高频路径里，是否同样会打印最终结论；
- 如果存在只改了某个分支、但主用路径没覆盖的情况，立即补齐。

#### 本轮实际修改
1. 再次运行 `pnpm demo:ready` 时，暴露出脚本尾部残留与快速通过分支结论打印不一致的问题；
2. 直接重写 `scripts/demo-ready.ts` 的结尾结构：
   - 抽出 `printReadySummary()`；
   - 在首次 `check:demo` 直接通过的分支与 seed 后复检通过的分支，统一调用同一份结论输出；
   - 清掉误残留在文件尾部的语法垃圾，恢复脚本为干净可执行状态。

#### 本轮验证
1. 已重新执行：`pnpm demo:ready`
   - 结果：通过；在“无需 seed”这条快速路径下，已稳定打印：
     - `Demo ready: 已完成“check → seed → re-check + demo copy check”。`
     - `Demo ready 结论：现在可以启动 API / Web，并优先从首页 / 开讲。`
2. 已重新执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
3. 已重新执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 65 阶段，这条“演示前准备”脚本不只是文案更清楚，连最常走的成功路径也已经输出一致；
- 这次顺手抓到并修掉的价值在于：如果不实际复跑，很容易以为结论已经落地，实际上却只覆盖到了某个分支；
- 当前仍没有新的阻塞、等待态或任务边界变化。

#### 下一步建议
1. 如果还继续自动推进，下一自然阶段更适合把这句最终结论也纳入 `check:demo-copy` 的关键短语检查，避免脚本文案和文档口径未来再次漂移；
2. 现阶段依然没必要扩新功能，优先级仍是演示接手稳定性。

### 66. 把 `check:demo-copy` 扩展到同时校验 `demo:ready` 最终结论短语，防止脚本输出与入口文档再次漂移

#### 本轮目标
- 承接第 65 阶段已经收口出的 `demo:ready` 最终结论；
- 不再只靠人工记忆检查“脚本输出”和“README / 首页 / 提词材料”是不是还在说同一句话；
- 让 `pnpm check:demo-copy` 同时覆盖入口文档和 `demo:ready` 脚本最终结论，提前拦住口径漂移。

#### 本轮实际修改
1. 扩展 `scripts/check-demo-copy.ts`
   - 新增固定短语常量：`现在可以开 API / Web，并优先从首页 / 开讲。`
   - 让 README、`docs/how-to-preview-locally.md`、`docs/demo-day-cheatsheet.md`、`docs/demo-script-3min.md`、首页 `apps/web/app/page.tsx` 都必须包含这句最终结论；
   - 新增对 `scripts/demo-ready.ts` 的检查，确保脚本文件本身也保留这句固定结论与 `Demo ready 结论：` 前缀。
2. 清理并重写 `scripts/demo-ready.ts`
   - 把最终结论抽成同一个 `READY_CONCLUSION` 常量；
   - 保留统一的 `printReadySummary()` 输出，确保快速通过分支和 seed 后复检分支仍共用同一条结论；
   - 顺手清掉文件里残留的重复尾巴，恢复为单一、干净、可执行版本。
3. 统一入口文档与首页上的最终结论写法
   - 文件：`README.md`、`docs/how-to-preview-locally.md`、`docs/demo-day-cheatsheet.md`、`docs/demo-script-3min.md`、`apps/web/app/page.tsx`
   - 调整：把之前夹带反引号的“首页 `/` 开讲”写法也收成与脚本一致的纯文本短语，避免脚本输出与文档入口只差一个格式细节却再次漂移。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过；现在不只检查 demo 文案层，也会检查 `demo:ready` 最终结论短语。
2. 已执行：`pnpm demo:ready`
   - 结果：通过；在当前“首次 check 就通过”的常见路径下，日志尾部已稳定打印：`Demo ready 结论：现在可以开 API / Web，并优先从首页 / 开讲。`
3. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。

#### 本轮结果判断
- 到第 66 阶段，Silver Health 的 demo 入口校验又往前走了一步：不只是检查“文档之间有没有对齐”，而是连 `demo:ready` 自己最终说给接手者的话也一起纳入机器检查；
- 这次顺手暴露并修掉的实际问题是：`scripts/demo-ready.ts` 里还残留了重复尾巴，如果不重新跑脚本，很容易误以为口径已经完全稳定；
- 当前仍没有新的阻塞、等待态或任务边界变化。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段更值得做的是把 `check:demo-copy` 的覆盖说明同步补进 README / preview 的命令说明区，让接手者更容易理解这条命令现在具体在防什么漂移；
2. 在此之前仍没必要扩新功能，优先级继续放在 demo 接手稳定性。

---

### 67. 把 `check:demo-copy` 的覆盖范围补进 README / preview 命令说明，明确它不只查“文案”

#### 本轮目标
- 承接第 66 阶段已经明确的下一自然动作；
- 把 `pnpm check:demo-copy` 现在到底在检查什么，直接补进 README 与 `docs/how-to-preview-locally.md` 的命令说明区；
- 避免后来接手的人只看命令名，以为它只是查“demo 文案”，却不知道它还在防 `demo:ready` 最终结论漂移。

#### 本轮实际修改
1. 更新 `README.md`
   - 在“手动分步执行”示例里补入 `pnpm check:demo-copy`；
   - 在命令说明里明确写出：它不只检查 README / 首页 / 提词材料口径是否一致，也会校验 `demo:ready` 最终那句“现在可以开 API / Web，并优先从首页 / 开讲。”有没有漂移；
   - 同步把“常用命令”里的注释升级成更直白的解释。
2. 更新 `docs/how-to-preview-locally.md`
   - 在手动执行 `check -> seed -> check` 的说明后追加 `pnpm check:demo-copy`；
   - 明确说明它覆盖 README / 首页 / cheatsheet / 3 分钟讲稿，以及 `demo:ready` 最终结论一致性，而不只是泛泛的“文案检查”。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过。
2. 已执行：`pnpm demo:ready`
   - 结果：通过；日志中已继续串上 `pnpm check:demo-copy`，并稳定输出最终结论。
3. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。

#### 本轮结果判断
- 到第 67 阶段，README 与 preview 文档终于把 `check:demo-copy` 的作用说透了；
- 接手者现在更容易理解：这条命令不只是查文字有没有不同步，而是在一起守住首页 / 文档 / 提词材料 / `demo:ready` 最终结论这整条 demo 入口口径。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段适合把 `check:demo-copy` 自己的成功输出也改得更直白，直接告诉人它已经同时确认 `demo:ready` 最终结论未漂移；
2. 现阶段仍没有新的阻塞、等待态或任务边界变化。

---

### 68. 顺手把 `check:demo-copy` 成功输出改得更直白，命令本身也明确说明“最终结论未漂移”

#### 本轮目标
- 承接第 67 阶段刚补到文档里的覆盖说明；
- 不只让 README / preview 解释清楚，还让 `pnpm check:demo-copy` 自己跑完后也直接告诉接手者：它同时确认了 `demo:ready` 最终结论没有漂移；
- 减少“文档说得很细，但命令输出仍然偏抽象”的落差。

#### 本轮实际修改
1. 更新 `scripts/check-demo-copy.ts`
   - 把成功输出从“README / preview / cheatsheet / script / homepage 已覆盖统一口径”升级为“README / preview / cheatsheet / script / homepage 已覆盖统一口径，且 demo:ready 最终结论未漂移”；
   - 让接手者即使不回看文档，也能从命令输出直接理解这条检查的实际覆盖面。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过；输出已明确包含“demo:ready 最终结论未漂移”。
2. 已执行：`pnpm demo:ready`
   - 结果：通过；日志里的 `pnpm check:demo-copy` 子步骤已展示新的直白成功输出。
3. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。

#### 本轮结果判断
- 到第 68 阶段，README / preview 的命令说明和 `check:demo-copy` 自身输出终于一致地说清楚了同一件事；
- 现在无论是看文档、手动跑命令，还是走 `demo:ready` 成功链路，都能更直观地知道：这条检查在防的不只是文案漂移，也包括最终接手结论漂移。

#### 下一步建议
1. 如果还继续自动推进，下一自然阶段更适合把 `check:demo-copy` 的覆盖说明再轻量同步进 `docs/demo-day-cheatsheet.md`，让临上场前只看 cheatsheet 的人也知道这条命令不只是查文案；
2. 当前仍没有新的阻塞、等待态或任务边界变化。

---

### 69. 把 `check:demo-copy` 的覆盖说明轻量同步进 cheatsheet，让只看提词卡的人也知道它会防 `demo:ready` 结论漂移

#### 本轮目标
- 直接承接第 68 阶段已经明确的下一自然动作；
- 不再让 `docs/demo-day-cheatsheet.md` 只告诉人“先跑 `pnpm demo:ready`”，而是顺手告诉接手者：如果要手动补查，`pnpm check:demo-copy` 不只是在查文案；
- 让只在上场前快速扫一眼 cheatsheet 的人，也知道这条命令会一起校验 `demo:ready` 最终结论有没有漂移。

#### 本轮实际修改
1. 更新 `docs/demo-day-cheatsheet.md`
   - 在“0. 先做 1 件事”下面补入手动补查块：`pnpm check:demo-copy`；
   - 明确写出：它不只是在查文案，还会一起校验 `demo:ready` 最终那句“现在可以开 API / Web，并优先从首页 / 开讲。”有没有漂移；
   - 保持写法足够轻，不把 cheatsheet 又写回成长文档，只补接手时最关键的一句认知。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过；新增的 cheatsheet 说明已经纳入当前文案一致性检查链路。
2. 已执行：`pnpm demo:ready`
   - 结果：通过；当前数据仍可直接演示，且 `check:demo-copy` 子步骤继续通过。

#### 本轮结果判断
- 到第 69 阶段，临上场前只看 cheatsheet 的接手者也能知道：`check:demo-copy` 不是泛泛查文字，而是在一起守住入口文档、提词材料和 `demo:ready` 最终结论；
- 当前仍没有新的阻塞、等待态或任务边界变化。

#### 下一步建议
1. 如果继续自动推进，下一自然阶段适合把这句 cheatsheet 里的覆盖说明也纳入 `scripts/check-demo-copy.ts` 的关键短语检查，避免未来别人精简 cheatsheet 时又把这层认知删掉；
2. 现阶段依然没必要扩新功能，优先级继续放在 demo 接手稳定性。

---

### 70. 顺手把 cheatsheet 的新覆盖说明纳入 `check:demo-copy` 关键短语校验，防止它再被回删

#### 本轮目标
- 承接第 69 阶段刚补进 cheatsheet 的关键认知；
- 不满足于“现在写进去了”，而是把“`check:demo-copy` 不只查文案，还会校验 `demo:ready` 最终结论漂移”这句话本身也纳入脚本检查；
- 避免后续有人继续精简 cheatsheet 时，把这句真正有用的提示不小心删掉。

#### 本轮实际修改
1. 更新 `scripts/check-demo-copy.ts`
   - 为 `docs/demo-day-cheatsheet.md` 新增关键短语检查：`它不只是在查文案，还会一起校验 \`demo:ready\` 最终那句`；
   - 让脚本不仅检查 cheatsheet 还在不在，还会检查这份提词卡是否继续保留“会防 `demo:ready` 结论漂移”的解释。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过；说明新增的 cheatsheet 覆盖说明已被脚本稳住。
2. 已执行：`pnpm demo:ready`
   - 结果：通过；当前“先 check，数据可直接演示，再做 copy check”的常见路径仍完整可用。

#### 本轮结果判断
- 到第 70 阶段，这条新增到 cheatsheet 的说明不再只是一次性人工同步，而是也被机器检查纳入长期守护；
- 当前仍没有新的阻塞、等待态或任务边界变化。

#### 下一步建议
1. 如果还继续自动推进，下一自然阶段更适合检查 `demo:ready` / `check:demo-copy` 的终端输出是否也该轻量提示“只看 cheatsheet 的接手者现在也能理解这条命令覆盖什么”，但这已经属于锦上添花，不是必须动作；
2. 当前更应该保持收口，不再横向扩功能。

---

### 71. 把命令行输出也补成“cheatsheet 已覆盖接手说明”，让接手反馈闭环落到终端层

#### 本轮目标
- 直接承接第 70 阶段留下的唯一轻量收口点；
- 不再只让 README / preview / cheatsheet 里写着“cheatsheet 已覆盖 `check:demo-copy` / `demo:ready` 这套说明”，而是让命令行自己跑完后也明确告诉接手者这件事；
- 把“文档知道、脚本也知道、接手人从终端输出也能立刻知道”的闭环补齐。

#### 本轮实际修改
1. 更新 `scripts/check-demo-copy.ts`
   - 成功输出继续收口为更完整的人话：不只说明 README / preview / cheatsheet / script / homepage 已覆盖统一口径，也直接说明 cheatsheet 已明确补到 `check:demo-copy` / `demo:ready` 这套说明；
   - 同时把 `docs/demo-day-cheatsheet.md` 的关键短语检查升级成新的完整说法，确保这层接手说明不会再被回删。
2. 更新 `scripts/demo-ready.ts`
   - 在 copy check 通过后新增一行显式提示：`Demo ready: cheatsheet 也已覆盖 check:demo-copy / demo:ready 这套接手提示。`；
   - 让走 `pnpm demo:ready` 这条最常见准备路径的人，不需要再回翻文档确认 cheatsheet 是否覆盖到位。
3. 同步 README / preview / cheatsheet 命令说明
   - 文件：`README.md`、`docs/how-to-preview-locally.md`、`docs/demo-day-cheatsheet.md`
   - 调整：统一补成“`check:demo-copy` 不只查文案，还会校验 cheatsheet 是否已经补到 `check:demo-copy` / `demo:ready` 这套接手说明，以及 `demo:ready` 最终结论是否漂移”。

#### 本轮验证
1. 已执行：`pnpm check:demo-copy`
   - 结果：通过；成功输出已明确带上“cheatsheet 也已明确补到 check:demo-copy / demo:ready 这套说明”。
2. 已执行：`pnpm demo:ready`
   - 结果：通过；在当前“首次 `check:demo` 直接通过、无需重建 seed”的常见路径下，日志已稳定打印新增提示 `Demo ready: cheatsheet 也已覆盖 check:demo-copy / demo:ready 这套接手提示。`
3. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
4. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。

#### 本轮结果判断
- 到第 71 阶段，Silver Health 的 demo 接手闭环已经补到终端层：不仅入口文档和 cheatsheet 知道这套说明，连 `check:demo-copy` / `demo:ready` 的真实输出也会主动提醒；
- 这轮之后没有新的阻塞、等待态或任务边界变化，且再往下已经明显属于边际收益很低的锦上添花。

#### 下一步建议
1. 如果后续还要继续磨 demo 接手体验，更值得等真实接手反馈后，再决定是否补“命令输出是否需要更短摘要”之类的细节，而不是继续先验微调；
2. 当前更合适的动作是先收住这轮终端提示闭环，不再横向扩功能。

---

### 72. 启动清单归档：新增“三终端启动清单”，便于直接复制启动与后续提交

#### 本轮目标
- 把对话里已经整理好的“三终端启动清单”正式沉淀成项目文档；
- 让后续无论是自己回看、给别人接手，还是准备 push 到 GitHub，都有一份可直接复制执行的独立启动说明；
- 把这次收尾动作补进项目归档与 daily memory，避免“聊天里说过，但仓库里没有”。

#### 本轮实际修改
1. 新增独立启动文档
   - 文件：`docs/startup-3-terminals.md`
   - 内容包括：
     - 启动前环境确认；
     - 三个终端分别执行什么；
     - `pnpm demo:ready` 通过后的含义；
     - API / Web 地址；
     - 启动后建议检查项；
     - 推荐演示顺序；
     - 现场操作分层；
     - `demo:ready` 失败时的手动补救命令。
2. 本轮收尾同步归档
   - 把当前“用户要求新建文档归档，后续准备 push 到 GitHub”的动作同步记入开发日志，作为第 72 阶段收尾记录。

#### 本轮验证
1. 文档复查
   - 已确认 `docs/startup-3-terminals.md` 中的项目路径、命令名、默认 elder id、启动顺序与当前 README / how-to-preview / demo-ready 口径一致。
2. 一致性结论
   - 当前仓库已同时具备：入口型 README、排障型本地预览说明、临场型 cheatsheet、完整讲稿、以及独立启动清单；接手资料分层已比较完整。

#### 本轮结果判断
- 这一步不再是新增功能，而是把“聊天里的实操说明”真正沉淀回仓库；
- 后续 push 到 GitHub 后，别人打开仓库就能直接看到一份适合复制执行的启动清单，不必从长文档里自己提炼。

#### 下一步建议
1. 若用户明确要求继续外部动作，可在本轮基础上统一提交并 push 到 GitHub；
2. push 前可再做一次 `git status` / commit message 收口，避免本轮归档漏掉。

---

### 73. 拉出移动端开发分支，完成第一批手机优先基础改造

#### 本轮目标
- 响应“开始进行移动端开发”的要求，从 `main` 拉出独立分支，避免直接污染稳定演示主线；
- 先不重开客户端项目，优先把现有 Next.js Web 改成手机优先的 H5 / PWA 基础体验；
- 用一轮低风险的共享样式改造，让首页、老人端和家属端页面先具备更适合手机查看与触控的布局基础。

#### 本轮实际修改
1. 新建移动端开发分支
   - 分支：`feature/mobile-first`
2. 新增全局移动端样式
   - 文件：`apps/web/app/globals.css`
   - 内容包括：
     - 全局 `box-sizing`；
     - 移动端正文背景、页面留白、标题字号；
     - 统计卡、列表卡、入口卡、提示块的手机端收敛；
     - 触控按钮最小高度；
     - 表单网格在手机端单列显示；
     - 接口返回预览面板在手机端降噪。
3. 接入全局样式
   - 文件：`apps/web/app/layout.tsx`
   - 调整：引入 `globals.css`，移除 body 上的重复 inline 基础样式。
4. 升级共享 UI 组件
   - 文件：`apps/web/app/ui/page-kit.tsx`
   - 调整：为 PageHeader、StatCard、InlineNotice、EmptyState 增加稳定 className，方便统一响应式控制。
5. 首页与各路由主容器移动端化
   - 文件：
     - `apps/web/app/page.tsx`
     - `apps/web/app/elder/profile/page.tsx`
     - `apps/web/app/elder/home/page.tsx`
     - `apps/web/app/elder/metrics/page.tsx`
     - `apps/web/app/elder/medication/page.tsx`
     - `apps/web/app/family/dashboard/page.tsx`
     - `apps/web/app/family/report/page.tsx`
     - `apps/web/app/family/bind/page.tsx`
   - 调整：主容器统一挂上 `app-shell`；首页入口卡片挂上移动端网格 class。
6. 老人首页任务列表触控优化
   - 文件：`apps/web/app/elder/home/task-list.tsx`
   - 调整：
     - 统计区使用手机端三列紧凑布局；
     - 任务卡片接入统一卡片样式；
     - “标记完成”按钮使用触控尺寸，手机端自动撑满宽度。
7. 表单基础移动端化
   - 文件：
     - `apps/web/app/elder/profile/elder-profile-form.tsx`
     - `apps/web/app/elder/metrics/metric-form.tsx`
     - `apps/web/app/elder/medication/medication-form.tsx`
     - `apps/web/app/family/bind/bind-form.tsx`
   - 调整：
     - 表单容器统一挂上 `form-card`；
     - 表单字段网格统一挂上 `form-grid`，手机端单列；
     - 提交按钮统一挂上触控按钮样式；
     - 接口返回预览统一挂上 `result-panel`。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。

#### 本轮结果判断
- 移动端开发已经正式从 `feature/mobile-first` 分支启动；
- 当前完成的是手机优先的基础骨架，不是最终客户端体验；
- 这批改造先把所有核心页面统一带入同一套手机端页面宽度、卡片、表单、按钮规则，为下一步继续打磨老人端关键流程做准备。

#### 下一步建议
1. 下一阶段优先继续优化老人端三个最高频场景：建档、今日任务、指标录入；
2. 之后再补 PWA manifest、移动端底部导航或角色入口切换；
3. 在视觉确认前，可先启动本地 Web 并用手机宽度截图检查首页和老人首页。

---

### 74. 按 `silver-mobile-design` Skill 重新审视移动端基础改造，并修正第一批规范偏差

#### 本轮目标
- 根据新安装的 `silver-mobile-design` Skill，对第 73 阶段移动端基础改造做一次设计规范复审；
- 重点检查是否真正符合：
  - 手机优先；
  - 老人端大按钮、少噪音、线性任务；
  - 家属端摘要优先；
  - 表单单列、触控高度、清晰反馈；
  - 移动端无横向溢出；
  - 不让开发者信息默认干扰老人端体验。

#### 本轮发现
1. 移动端 class 仍可能被旧 inline style 覆盖
   - 第 73 阶段已经给表单、卡片、提示块、按钮挂了 class；
   - 但项目里大量旧样式仍是 inline style，CSS class 的移动端 padding、radius、shadow 不一定能稳定覆盖；
   - 这会造成“规范写进 CSS 了，但真实手机效果未必按规范执行”的问题。
2. 全站移动端统计卡强制三列过于粗暴
   - `silver-mobile-design` 里明确：三列 compact stat tiles 只适合短标签且数值仍可读的场景；
   - 第 73 阶段把所有 `.stat-grid` 在手机端都压成三列，不适合家属看板、报告、绑定等可能文字更长的页面。
3. 表单底部接口 JSON 预览默认展开，手机端噪音过重
   - 对 demo 和开发有帮助；
   - 但对老人端 / 手机端体验来说，默认展示 JSON 属于开发者信息，和“老人端简单、线性、少噪音”的规范冲突。

#### 本轮实际修改
1. 强化移动端 CSS 覆盖稳定性
   - 文件：`apps/web/app/globals.css`
   - 调整：
     - 移动端 `.inline-notice`、`.surface-card`、`.link-card`、`.form-card`、`.result-panel` 的关键 padding、radius、shadow、border 使用 `!important` 覆盖旧 inline style；
     - 移动端按钮宽度、高度也用 `!important` 稳住触控尺寸；
     - 避免后续页面级 inline style 无意中把手机端规范顶掉。
2. 调整移动端统计卡策略
   - 文件：`apps/web/app/globals.css`
   - 调整：
     - 手机端 `.stat-grid` 默认改成两列；
     - 新增 `.stat-grid--three`，只给适合三列短标签的场景使用。
   - 文件：`apps/web/app/elder/home/task-list.tsx`
   - 调整：
     - 老人首页任务统计继续使用 `stat-grid stat-grid--three`，保留三列紧凑体验。
3. 降低表单接口返回预览的默认噪音
   - 文件：
     - `apps/web/app/elder/profile/elder-profile-form.tsx`
     - `apps/web/app/elder/metrics/metric-form.tsx`
     - `apps/web/app/elder/medication/medication-form.tsx`
     - `apps/web/app/family/bind/bind-form.tsx`
   - 调整：
     - 把默认展开的深色 `section` 改成 `details.result-panel`；
     - 默认只显示“查看接口返回预览”，需要时再展开；
     - 兼顾 demo / 开发确认需求和老人端手机体验的低噪音要求。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。
3. 尝试使用 Codex Browser 做手机视口复查
   - 结果：本轮浏览器工具返回 “No active Codex browser pane available”；
   - 因此本轮没有新增浏览器截图；
   - 已保留代码层与构建层验证，后续浏览器面板恢复后应继续按 390px 手机视口复查。
4. 本地 Web 服务收尾
   - 本轮曾启动 `pnpm dev:web` 做复查准备；
   - `3000` 端口仍被占用，Next.js 自动使用 `http://localhost:3002`；
   - 已确认并停止本轮启动的 `next-server` 进程。

#### 本轮结果判断
- 第 73 阶段是“把移动端骨架接上”，第 74 阶段则是第一次按正式设计 Skill 做规范回看；
- 当前移动端基础样式更接近 Skill 要求：
  - 默认统计卡更克制；
  - 老人首页保留短标签三列；
  - 表单 JSON 预览不再默认打断手机端任务流；
  - 旧 inline style 对移动端规范的干扰降低。

#### 下一步建议
1. 浏览器面板恢复后，补做 390px / 360px 手机视口截图复查；
2. 继续按 Skill 打磨老人端建档、今日任务、指标录入三个高频流程；
3. 下一轮可以考虑新增移动端角色入口 / 底部导航，但应先保持首页作为 demo router，不急着重做信息架构。

---

### 75. 引入移动端多 Tab 导航壳，让体验从“页面集合”开始变成“可切换应用”

#### 本轮目标
- 响应“想要一个能够交互的完整体验”和“设计成多 tab 的形式怎么样”的要求；
- 先不重构业务页面，把交互入口层补起来；
- 按 `silver-mobile-design` 的原则选择手机 App 式底部 Tab，而不是桌面式多顶栏标签。

#### 本轮设计判断
- 多 Tab 方向是对的，但不适合一次性把所有功能都塞进一个顶栏；
- 当前更适合：
  - 底部主 Tab：`首页 / 老人 / 家属`；
  - 角色内二级 Tab：
    - 老人：`建档 / 今日 / 指标 / 用药`；
    - 家属：`看板 / 周报 / 绑定`。
- 这样既保留首页作为 demo router，也让手机上能像 App 一样快速切换主要区域。

#### 本轮实际修改
1. 新增移动端导航组件
   - 文件：`apps/web/app/ui/app-navigation.tsx`
   - 内容：
     - 底部主导航：`首页`、`老人`、`家属`；
     - 老人端二级导航：`建档`、`今日`、`指标`、`用药`；
     - 家属端二级导航：`看板`、`周报`、`绑定`；
     - 使用 `usePathname()` 判断当前激活态；
     - 使用 `aria-current="page"` 保留可访问性语义。
2. 接入全局布局
   - 文件：`apps/web/app/layout.tsx`
   - 调整：在 `body` 内引入 `<AppNavigation />`，让所有路由共享同一套移动端导航壳。
3. 增加移动端 Tab 样式
   - 文件：`apps/web/app/globals.css`
   - 内容：
     - `.mobile-bottom-tabs` 固定在底部；
     - `.mobile-context-tabs` 在老人 / 家属路由顶部 sticky；
     - Tab 最小触控高度满足 44px+；
     - 激活态有颜色和背景反馈；
     - body 增加底部安全区 padding，避免内容被底部 Tab 遮挡。

#### 本轮验证
1. 已执行：`pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
2. 已执行：`pnpm --filter @silver-health/web build`
   - 结果：通过。
3. 本地页面可访问性检查
   - 当前已有 `next-server` 监听 `3000`；
   - 已通过 `curl -I http://127.0.0.1:3000` 确认页面返回 `200 OK`；
   - 已读取首页 HTML，确认底部主 Tab 已渲染：`首页 / 老人 / 家属`。
4. Codex Browser 复查
   - 用户确认 in-app browser 打开且当前 URL 为 `about:blank`；
   - 本轮多次尝试重新获取 in-app Browser、设置可见、设置 390px 视口、新建 tab；
   - 工具仍返回 `No active Codex browser pane available`；
   - 因此本轮仍未能通过 Codex Browser 生成截图。

#### 本轮结果判断
- 当前移动端体验已经从“靠首页卡片跳路由”推进到“底部主 Tab + 角色内二级 Tab”的 App 壳形态；
- 这还不是完整客户端体验，但已经是后续继续补 PWA、角色首页、任务流闭环的基础；
- 用户现在可以在 in-app browser 手动打开 `http://127.0.0.1:3000` 直接试底部 Tab 交互。

#### 下一步建议
1. 手动在 in-app browser 打开 `http://127.0.0.1:3000`，先试底部 `首页 / 老人 / 家属`；
2. 如果这个方向认可，下一步应把老人端做成更完整的“今日工作台”，而不是只靠各页面分散展示；
3. 继续补家属端“看板 / 周报 / 绑定”的移动端摘要层，让家属 Tab 也像一个完整应用区域。

---

### 76. 修复 Next dev 缓存缺失 chunk 导致的页面报错

#### 本轮问题
- 用户在本地验证多 Tab 页面时遇到：
  - `Error: Cannot find module './156.js'`
  - 后续还出现 `.next/server/app/page.js` 缺失；
- 这类错误来自 Next.js dev 生成目录 `.next` 的运行时缓存不一致，不是业务源码路由丢失。

#### 本轮处理
1. 确认当前 3000 端口进程
   - 已确认监听 3000 的进程是 `next-server (v15.3.2)`。
2. 停止异常 Next dev server
   - 先停止旧的 `next-server`，避免服务仍持有旧 `.next` 文件引用。
3. 清理 Next 生成缓存
   - 删除自动生成目录：`apps/web/.next`。
4. 重新启动 Web dev server
   - 执行：`pnpm dev:web`；
   - 服务恢复到：`http://localhost:3000`。

#### 本轮验证
1. 已确认首页恢复
   - `curl -I http://127.0.0.1:3000`
   - 结果：`HTTP/1.1 200 OK`
2. 已确认老人首页恢复
   - `curl -I http://127.0.0.1:3000/elder/home`
   - 结果：`HTTP/1.1 200 OK`
3. 已确认家属看板恢复
   - `curl -I http://127.0.0.1:3000/family/dashboard`
   - 结果：`HTTP/1.1 200 OK`

#### 复用处理方式
如果后续再遇到类似 `.next/server/...`、`Cannot find module './xxx.js'`、hot-update 残留错误，优先按这个顺序处理：

```bash
# 1. 停掉正在运行的 pnpm dev:web / next-server
# 2. 清理 Web 构建缓存
rm -rf apps/web/.next

# 3. 重新启动
pnpm dev:web
```

#### 本轮结果判断
- 多 Tab 改动本身没有导致路由缺失；
- 问题来自开发缓存和旧 dev server 状态；
- 当前首页、老人首页、家属看板均已恢复可访问。

---

### 77. Railway API / PostgreSQL 上线与 PWA 发布准备

#### 本轮处理
1. 通过 Chrome 完成 Railway Terms of Service / Fair Use Policy 确认。
2. 创建 Railway 项目 `heartfelt-transformation`，并添加 PostgreSQL。
3. 使用 Railway CLI 将 `silver-health-api` 部署到 Railway。
4. 新增 `Dockerfile.api`，将 API 构建稳定到 Dockerfile builder。
5. 调整 `railway.json`：
   - 使用 Dockerfile builder；
   - 将 `prisma:migrate:deploy` 放到 `preDeployCommand`；
   - `startCommand` 只启动 API；
   - 保留 `/api/health` 健康检查。
6. 将 API 监听地址调整为 `0.0.0.0`，适配 Railway 容器外部访问。
7. 将 Web 的 Next.js 从 `15.3.2` 升级到 `15.3.8`，通过 Railway 安全扫描。
8. 修复今日任务默认查询的业务时区问题，避免 Railway UTC 环境下首页任务为空。
9. 使用远程 PostgreSQL 执行演示数据 seed，记录默认老人账号 ID。

#### 当前线上信息
- Railway API：`https://silver-health-api-production.up.railway.app`
- 默认老人账号：`cmre5b56p0000ij0niccn6i4n`
- 当前 API Deployment ID：`5ee96701-2f27-4cf6-8b13-f91e6e7a4119`

#### 本轮验证
1. 已执行：`corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
2. 已执行：`corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
3. 已执行：`corepack pnpm --filter @silver-health/web build`
   - 结果：通过。
4. 已执行：`corepack pnpm demo:ready`
   - 结果：本地首次检查发现当天任务为空，自动 seed 后复查通过。
5. 已验证 Railway `/api/health`
   - 结果：`code=0`，`status=running`。
6. 已验证远程演示数据接口：
   - 老人档案返回 `李阿姨`；
   - 今日任务返回 4 条；
   - 健康指标返回 3 条；
   - 用药提醒返回 2 条；
   - 家属周报返回 2 条。

#### 下一步
1. 完成 Vercel CLI 设备登录授权；
2. 发布 Vercel Web 生产部署；
3. 将 Vercel 域名回填 Railway `CORS_ORIGIN`；
4. 用线上 Web 做移动端四 Tab 验收；
5. commit 并 push `feature/pwa-launch-ready`。

---

### 78. Vercel Web 生产部署与线上验收完成

#### 本轮处理
1. 通过 Vercel 设备授权页允许 `Vercel CLI 55.0.0` 登录。
2. 创建 Vercel 项目 `monkeylzls-projects/web`。
3. 首次远端构建失败，原因是 CLI 只上传 `apps/web` 子目录，导致远端执行 `cd ../..` 后找不到 monorepo 根目录 `package.json`。
4. 改用本地 prebuilt 流程：
   - 在本机执行 `vercel build --cwd apps/web --prod`；
   - 将 `.vercel/output` 放到仓库根目录上传；
   - 执行 `vercel deploy --prod --prebuilt`。
5. Vercel production 环境变量已持久化：
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`
6. Railway `CORS_ORIGIN` 已回填 Vercel 生产域名。

#### 当前线上信息
- Web Production Alias：`https://web-nu-blond-89.vercel.app`
- Web Deployment URL：`https://web-m4057w5k7-monkeylzls-projects.vercel.app`
- Web Deployment ID：`dpl_GiFkdXjPQEUXyvPjxN5ZTSQQrjSX`
- Railway API Deployment ID：`e78cd36c-000b-4b74-9c21-326f11304a20`

#### 本轮验证
1. Web 首页 `https://web-nu-blond-89.vercel.app` 返回 `200 text/html`。
2. `/health`、`/family/dashboard`、`/family/report`、`/me` 均返回 `200 text/html`。
3. `manifest.webmanifest`、`offline.html`、`sw.js` 均返回 `200`。
4. 首页 HTML 已渲染四个底部 Tab：`今日 / 健康 / 家属 / 我的`。
5. 首页 HTML 已显示 `当前接入：真实 API`。
6. 首页 HTML 已显示远程任务：`晨间散步 20 分钟`、`记录今日血压`。
7. API CORS 验证通过：
   - `access-control-allow-origin` 等于 Vercel 生产域名；
   - PATCH 预检返回 `204`；
   - `access-control-allow-methods` 包含 `GET,HEAD,PUT,PATCH,POST,DELETE`。
8. 手机视口验证：
   - 390x844：无横向滚动，底部 Tab 固定，最小主按钮高度 48px；
   - 360x800：无横向滚动，底部 Tab 固定，最小主按钮高度 48px。

#### 后续建议
1. 将 Vercel 项目名从 `web` 改为 `silver-health-app-web`；
2. 增加端到端测试，覆盖真实点击完成任务和录入指标；
3. 把 prebuilt 部署流程固化成脚本或 CI；
4. 增加演示数据重置命令，方便上线试用前恢复初始状态。

---

### 79. 生产环境自动冒烟门禁

#### 本轮处理
1. 从 `feature/pwa-launch-ready` 新建优化分支 `feature/production-smoke-gates`。
2. 新增生产 smoke 工具测试：`scripts/production-smoke-utils.test.ts`。
3. 新增 smoke 工具函数：`scripts/production-smoke-utils.ts`。
4. 新增生产环境冒烟脚本：`scripts/production-smoke.ts`。
5. 根 `package.json` 新增：
   - `test:smoke-utils`
   - `smoke:production`
6. 更新上线检查清单和测试验证方案，将线上手工验收沉淀成固定命令。

#### 覆盖范围
- Web 首页、健康、家属看板、家属周报、我的页面 HTTP 状态与 content-type；
- PWA `manifest.webmanifest`、`offline.html`、`sw.js`；
- 首页四个底部 Tab；
- 首页真实 API 状态；
- seed 任务文本；
- API health；
- 任务、指标、用药、周报集合数量；
- API health CORS；
- PATCH preflight CORS。

#### 本轮验证
1. 已按 TDD 先运行失败测试：
   - `node --test scripts/production-smoke-utils.test.ts`
   - 失败原因：`production-smoke-utils.ts` 不存在。
2. 已执行：`corepack pnpm test:smoke-utils`
   - 结果：4 个测试通过。
3. 已执行：`corepack pnpm smoke:production`
   - 结果：17 项线上冒烟检查通过。

#### 下一轮建议
1. 增加 Playwright 端到端测试，覆盖“完成任务 / 录入指标 / 家属看板同步”；
2. 增加线上演示数据重置脚本，避免试用多人点击后数据漂移；
3. 将 prebuilt Vercel 部署流程固化成脚本或 GitHub Actions。

---

### 80. 受控演示数据重置命令

#### 本轮处理
1. 从 `feature/production-smoke-gates` 新建分支 `feature/demo-reset-command`。
2. 新增重置工具测试：`scripts/demo-reset-utils.test.ts`。
3. 新增重置工具函数：`scripts/demo-reset-utils.ts`。
4. 新增受控重置脚本：`scripts/demo-reset.ts`。
5. 根 `package.json` 新增：
   - `demo:reset`
   - `test:demo-reset-utils`
6. 更新上线检查清单和测试验证方案。

#### 安全策略
- 必须显式设置 `DEMO_RESET_CONFIRM=RESET_DEMO_DATA`；
- 未确认时命令拒绝执行；
- 执行前打印脱敏后的 `DATABASE_URL`；
- 默认重置后继续执行 `smoke:production`；
- 本地恢复可使用 `--skip-smoke`。

#### 本轮验证
1. 已按 TDD 先运行失败测试：
   - `node --test scripts/demo-reset-utils.test.ts`
   - 失败原因：`demo-reset-utils.ts` 不存在。
2. 已新增 `.env` 解析测试并先确认失败：
   - 失败原因：`parseDotEnv` 未导出。
3. 已执行：`corepack pnpm test:demo-reset-utils`
   - 结果：5 个测试通过。
4. 已执行未确认路径：
   - `corepack pnpm demo:reset -- --skip-smoke`
   - 结果：拒绝执行，并显示脱敏数据库目标。
5. 已执行确认路径：
   - `DEMO_RESET_CONFIRM=RESET_DEMO_DATA corepack pnpm demo:reset -- --skip-smoke`
   - 结果：`seed:demo`、`check:demo` 通过。

#### 下一轮建议
1. 增加 Playwright E2E，覆盖真实点击完成任务；
2. 把 Vercel prebuilt 部署流程脚本化；
3. 将生产 smoke 与 demo reset 接入 GitHub Actions 手动工作流。

---

### 81. Vercel prebuilt 部署流程脚本化

#### 本轮处理
1. 从 `feature/demo-reset-command` 新建分支 `feature/vercel-prebuilt-deploy-script`。
2. 新增部署工具测试：`scripts/vercel-deploy-utils.test.ts`。
3. 新增部署工具函数：`scripts/vercel-deploy-utils.ts`。
4. 新增部署脚本：`scripts/vercel-prebuilt-deploy.ts`。
5. 根 `package.json` 新增：
   - `deploy:vercel`
   - `test:vercel-deploy-utils`
6. 更新上线检查清单、测试验证方案、部署记录。

#### 部署策略
- `corepack pnpm deploy:vercel` 默认 dry-run；
- `corepack pnpm deploy:vercel -- --execute` 才执行生产部署；
- 先在 `apps/web` 执行 `vercel build --prod`；
- 再将 `apps/web/.vercel/project.json` 和 `apps/web/.vercel/output` 同步到仓库根 `.vercel`；
- 最后从仓库根执行 `vercel deploy --prod --prebuilt`。

#### 本轮验证
1. 已按 TDD 先运行失败测试：
   - `node --test scripts/vercel-deploy-utils.test.ts`
   - 失败原因：`vercel-deploy-utils.ts` 不存在。
2. 已执行：`corepack pnpm test:vercel-deploy-utils`
   - 结果：3 个测试通过。
3. 已执行：`corepack pnpm deploy:vercel`
   - 结果：dry-run 只打印命令，不发版。
4. 已执行：`corepack pnpm deploy:vercel -- --execute`
   - 结果：Vercel 生产部署成功。
   - 新 deployment：`dpl_8AkzX95njUQTcCHh9qUzrDjx6D4V`。
   - Production alias：`https://web-nu-blond-89.vercel.app`。
5. 已执行：`corepack pnpm smoke:production`
   - 结果：17 项线上冒烟检查通过。

#### 下一轮建议
1. 增加 Playwright E2E，覆盖“完成任务 / 录入指标 / 家属看板同步”；
2. 将 smoke、demo reset、Vercel deploy 串成 GitHub Actions 手动工作流；
3. 整理 Node ESM warning，统一 scripts 的运行方式。

---

### 82. Playwright 手机视口 E2E 回归

#### 本轮处理
1. 从 `feature/vercel-prebuilt-deploy-script` 新建分支 `feature/mobile-e2e-interactions`。
2. 根 `package.json` 新增：
   - `test:e2e:mobile`
3. 新增 Playwright 配置：
   - `playwright.config.ts`
4. 新增移动端 E2E：
   - `tests/e2e/mobile-navigation.spec.ts`
5. 新增忽略规则：
   - `test-results`
   - `playwright-report`
6. 更新上线检查清单、测试验证方案和优化路线图。

#### 覆盖范围
- 默认线上 PWA：`https://web-nu-blond-89.vercel.app`；
- 390x844 和 360x800 两个手机视口；
- `/` 今日工作台线上 demo 数据可见；
- `今日 / 健康 / 家属 / 我的` 四个底部 Tab 可点击切换；
- 当前 Tab `aria-current="page"` 激活态正确；
- 页面无横向滚动；
- 底部 Tab、主操作按钮、操作卡片和按钮高度不低于 44px；
- 失败时保留 Playwright screenshot 和 trace。

#### 本轮验证
1. 已按 TDD 先运行失败测试：
   - `corepack pnpm test:e2e:mobile`
   - 失败原因：`playwright` 命令不存在。
2. 补充 `@playwright/test` 后再次运行：
   - 失败原因：设备预设与 Chrome channel 不兼容，且失败视频需要 ffmpeg。
3. 调整为 Chromium 手机视口并关闭失败视频后再次运行：
   - 失败原因：heading 与文本断言过宽，引发 Playwright strict mode。
4. 收紧断言后已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个 E2E 测试通过。
5. 已执行：
   - `corepack pnpm test:smoke-utils`
   - 结果：4 个测试通过。
6. 已执行：
   - `corepack pnpm test:demo-reset-utils`
   - 结果：5 个测试通过。
7. 已执行：
   - `corepack pnpm test:vercel-deploy-utils`
   - 结果：3 个测试通过。
8. 已执行：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
9. 已执行：
   - `corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
10. 已执行：
    - `corepack pnpm --filter @silver-health/web build`
    - 结果：通过。
11. 已执行：
    - `corepack pnpm smoke:production`
    - 结果：17 项线上冒烟检查通过。
12. 文档更新后已再次执行：
    - `corepack pnpm test:e2e:mobile`
    - 结果：4 个 E2E 测试通过。

#### 下一轮建议
1. 增加本地可重置数据环境下的写入型 E2E，覆盖“完成任务 / 录入指标 / 家属看板同步”；
2. 将 `smoke:production`、`demo:reset`、`deploy:vercel`、`test:e2e:mobile` 串成 GitHub Actions 手动工作流；
3. 整理 Node ESM warning，统一 scripts 的模块运行方式。

---

### 83. GitHub Actions 手动上线门禁

#### 本轮处理
1. 从 `feature/mobile-e2e-interactions` 新建分支 `feature/manual-release-workflow`。
2. 新增 workflow：
   - `.github/workflows/release-gates.yml`
3. 新增 workflow 内容测试：
   - `scripts/github-workflow.test.ts`
4. 根 `package.json` 新增：
   - `test:github-workflow`
5. 调整 Playwright 配置：
   - 本地默认使用 Chrome channel；
   - CI 环境不指定 channel，配合 workflow 安装 Playwright Chromium。
6. 更新上线检查清单、测试验证方案和优化路线图。

#### Workflow 覆盖范围
- `workflow_dispatch` 手动触发；
- 可输入 Web URL、API URL、默认老人账号；
- 可开关生产 smoke、移动 E2E、Vercel dry-run；
- 生成 Prisma Client；
- Web typecheck；
- Web production build；
- API production build；
- `test:demo-reset-utils`；
- `test:smoke-utils`；
- `test:vercel-deploy-utils`；
- `test:github-workflow`；
- 可选 `smoke:production`；
- 可选安装 Playwright Chromium 并执行 `test:e2e:mobile`；
- 可选 `deploy:vercel` dry-run。

#### 安全策略
- workflow 不执行生产部署；
- `deploy:vercel` 在 workflow 中只做 dry-run；
- 真正生产发布仍需受控执行 `corepack pnpm deploy:vercel -- --execute`；
- 远程 seed/reset 不放进本轮 workflow，避免误改线上演示数据。

#### 本轮验证
1. 已按 TDD 先运行失败测试：
   - `corepack pnpm test:github-workflow`
   - 失败原因：`.github/workflows/release-gates.yml` 不存在。
2. 新增 workflow 后已执行：
   - `corepack pnpm test:github-workflow`
   - 结果：1 个测试通过。
3. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个 E2E 测试通过。
4. 已执行：
   - `corepack pnpm test:vercel-deploy-utils`
   - 结果：3 个测试通过。
5. 尝试执行：
   - `corepack pnpm dlx actionlint .github/workflows/release-gates.yml`
   - 结果：失败，npm 包没有可执行 bin，未纳入必跑门禁。
6. 已执行：
   - `ruby -e "require 'yaml'; YAML.load_file('.github/workflows/release-gates.yml'); puts :ok"`
   - 结果：YAML 可解析，输出 `ok`。
7. 已执行：
   - `corepack pnpm test:smoke-utils`
   - 结果：4 个测试通过。
8. 已执行：
   - `corepack pnpm test:demo-reset-utils`
   - 结果：5 个测试通过。
9. 已执行：
   - `corepack pnpm smoke:production`
   - 结果：17 项线上冒烟检查通过。
10. 已执行：
    - `corepack pnpm deploy:vercel`
    - 结果：dry-run 成功，不创建生产发布。
11. 已执行：
    - `corepack pnpm --filter @silver-health/web typecheck`
    - 结果：通过。
12. 已执行：
    - `corepack pnpm --filter @silver-health/api build`
    - 结果：通过。
13. 已执行：
    - `corepack pnpm --filter @silver-health/web build`
    - 结果：通过。

#### 下一轮建议
1. 在 GitHub Actions 页面实际触发一次 `Silver Health release gates`，确认 GitHub Runner 侧通过；
2. 增加本地可重置数据环境下的写入型 E2E；
3. 整理 Node ESM warning，统一 scripts 的模块运行方式。

---

### 84. 本地写入型 E2E 与指标时间修复

#### 本轮处理
1. 从 `feature/manual-release-workflow` 新建分支 `feature/local-write-e2e`。
2. 根 `package.json` 新增：
   - `test:e2e:local-write`
   - `test:local-e2e-utils`
3. 新增本地写入型 E2E 编排：
   - `scripts/local-write-e2e.ts`
   - `scripts/local-e2e-utils.ts`
   - `scripts/local-e2e-utils.test.ts`
4. 新增 Playwright 写入型测试：
   - `tests/e2e/local-write-flow.spec.ts`
5. 调整 Playwright 配置：
   - 默认 `test:e2e:mobile` 忽略本地写入测试；
   - `E2E_INCLUDE_LOCAL_WRITE=1` 时启用本地写入测试。
6. 修复健康指标表单默认测量时间：
   - 原先使用服务端 UTC 字符串作为 `datetime-local` 默认值；
   - 浏览器按本地时间解释后，刚录入指标可能早于 seed 指标；
   - 改为客户端 hydrate 后设置本地 `datetime-local` 默认值。
7. 更新上线检查清单、测试验证方案和优化路线图。

#### 写入型 E2E 覆盖范围
- 自动执行本地 `demo:reset -- --skip-smoke`；
- 从 seed 输出解析默认 elder id；
- 启动本地 API：默认 `http://127.0.0.1:3201`；
- 启动本地 Web：默认 `http://127.0.0.1:3200`；
- 老人首页点击“标记完成”；
- API 确认任务 `done` 数量增加；
- 指标录入页保存一条血压 `132 / 82`；
- API 确认指标数量增加；
- 家属看板显示更新后的任务完成数；
- 家属看板显示最新血压 `132 / 82 mmHg`。

#### 本轮验证
1. 已按 TDD 先运行失败测试：
   - `corepack pnpm test:local-e2e-utils`
   - 失败原因：`local-e2e-utils.ts` 不存在。
2. 已执行：
   - `corepack pnpm test:local-e2e-utils`
   - 结果：3 个测试通过。
3. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个线上只读手机 E2E 通过，确认本地写入测试未混入默认套件。
4. 首次执行：
   - `corepack pnpm test:e2e:local-write`
   - 失败原因：Web dev server 启动参数被 pnpm 传错，Next 将 `--hostname` 当作项目目录。
5. 修复 Web 启动方式后再次执行：
   - 失败原因：测试里把 Node `fetch` 的 `response.ok` 当函数调用。
6. 修正测试后再次执行：
   - 失败原因：页面真实标题为“老人首页”，测试写成“今日任务”。
7. 修正标题后再次执行：
   - 失败原因：`真实 API` 文案出现多处，触发 Playwright strict mode。
8. 收紧断言后再次执行：
   - 失败原因：家属看板仍显示 seed 指标 `128 / 78`，没有显示刚录入的 `132 / 82`。
9. 排查数据库后确认根因：
   - 新增指标写入成功；
   - 但 `measuredAt` 被保存为 `2026-07-09T21:44:00.000Z`；
   - 早于 seed 指标 `2026-07-10T00:30:00.000Z`；
   - 根因是 `datetime-local` 默认值来自服务端 UTC。
10. 修复客户端本地时间初始化后再次执行：
    - 失败原因：`最近血压：132 / 82 mmHg` 同时出现在一句话近况和指标摘要中，触发 strict mode。
11. 收紧为 exact text 后已执行：
    - `corepack pnpm test:e2e:local-write`
    - 结果：1 个本地写入型 E2E 通过。
12. 已执行：
    - `corepack pnpm test:local-e2e-utils`
    - 结果：3 个测试通过。
13. 已执行：
    - `corepack pnpm test:e2e:mobile`
    - 结果：4 个线上只读手机 E2E 通过。
14. 已执行：
    - `corepack pnpm --filter @silver-health/web typecheck`
    - 结果：通过。
15. 已执行：
    - `corepack pnpm --filter @silver-health/api build`
    - 结果：通过。
16. 已执行：
    - `corepack pnpm --filter @silver-health/web build`
    - 结果：通过。
17. 已执行：
    - `corepack pnpm smoke:production`
    - 结果：17 项线上冒烟检查通过。
18. 已执行：
    - `corepack pnpm test:github-workflow`
    - 结果：1 个测试通过。

#### 下一轮建议
1. 将 `test:e2e:local-write` 评估接入 GitHub Actions 手动门禁；
2. 继续补家属绑定等写入型 E2E；
3. 整理 Node ESM warning，减少脚本运行噪音。

---

### 85. 本地写入型 E2E 扩展到用药提醒

#### 本轮处理
1. 从 `feature/local-write-e2e` 新建分支 `feature/local-write-medication-e2e`。
2. 扩展 `tests/e2e/local-write-flow.spec.ts`：
   - 在原有“完成任务 / 录入血压 / 家属看板同步”基础上，新增用药提醒写入验证；
   - 新增“阿司匹林 / 晚饭后 1 片 / 21:15”提醒；
   - 验证 API 用药提醒数量增加；
   - 验证家属看板显示新增提醒和启用提醒数量。
3. 更新上线检查清单、测试验证方案和优化路线图。

#### 覆盖范围
- 本地重置 demo 数据；
- 老人首页完成一项任务；
- 指标页保存血压 `132 / 82`；
- 用药页保存启用提醒 `阿司匹林 · 21:15`；
- 家属看板同步展示：
  - 任务完成数；
  - 最新血压；
  - 启用提醒数量；
  - 新增用药提醒。

#### 本轮验证
1. 已执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：1 个本地写入型 E2E 通过。
2. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个线上只读手机 E2E 通过。
3. 已执行：
   - `corepack pnpm test:local-e2e-utils`
   - 结果：3 个测试通过。
4. 已执行：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
5. 已执行：
   - `corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
6. 已执行：
   - `corepack pnpm --filter @silver-health/web build`
   - 结果：通过。
7. 已执行：
   - `corepack pnpm smoke:production`
   - 结果：17 项线上冒烟检查通过。

#### 下一轮建议
1. 继续补家属绑定写入型 E2E；
2. 将本地写入型 E2E 接入 GitHub Actions 手动门禁前，先确认 GitHub Runner 是否能访问测试数据库；
3. 整理 Node ESM warning，减少脚本运行噪音。

---

### 86. 本地写入型 E2E 扩展到家属绑定

#### 本轮处理
1. 从 `feature/local-write-medication-e2e` 新建分支 `feature/local-write-binding-e2e`。
2. 扩展本地 E2E 环境变量：
   - `NEXT_PUBLIC_DEFAULT_FAMILY_USER_ID`
   - `E2E_FAMILY_USER_ID`
3. Web 配置新增：
   - `defaultFamilyUserId`
4. 家属绑定表单默认使用 seed 输出的真实 family user id。
5. 扩展 `tests/e2e/local-write-flow.spec.ts`：
   - 原有任务、指标、用药、家属看板同步继续覆盖；
   - 新增家属绑定页提交绑定申请；
   - 验证 API 中老人 / 家属绑定关系存在且状态为 `pending`。
6. 修复后端重复绑定提交：
   - `FamilyBindingService.create()` 从 `create` 改为 `upsert`；
   - 重复提交同一老人 / 家属绑定时不再触发 Prisma 唯一约束 500；
   - 统一恢复为 `pending` 状态，适合演示和真实试用中的重复提交。
7. 更新上线检查清单、测试验证方案和优化路线图。

#### 本轮验证
1. 已先扩展 `test:local-e2e-utils` 断言 family id 注入，并确认失败：
   - 失败原因：`NEXT_PUBLIC_DEFAULT_FAMILY_USER_ID` 尚未写入本地 E2E env。
2. 补齐 family id 注入后已执行：
   - `corepack pnpm test:local-e2e-utils`
   - 结果：3 个测试通过。
3. 已执行：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
4. 首次执行扩展后的：
   - `corepack pnpm test:e2e:local-write`
   - 失败原因：重复提交同一老人 / 家属绑定触发 Prisma `P2002` 唯一约束错误。
5. 将绑定创建改为 upsert，并调整 E2E 断言为“关系存在且状态为 pending”后，已执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：1 个本地写入型 E2E 通过。
6. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个线上只读手机 E2E 通过。
7. 已执行：
   - `corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
8. 已执行：
   - `corepack pnpm --filter @silver-health/web build`
   - 结果：通过。
9. 已执行：
   - `corepack pnpm smoke:production`
   - 结果：17 项线上冒烟检查通过。

#### 下一轮建议
1. 将 `test:e2e:local-write` 接入 GitHub Actions 前，准备可访问的测试数据库或服务容器；
2. 继续补档案编辑、周报生成等写入型链路；
3. 整理 Node ESM warning，减少脚本运行噪音。

---

### 87. 分支整理与发布候选分支

#### 本轮处理
1. 检查当前分支拓扑，确认 `feature/local-write-binding-e2e` 是线性集成头。
2. 使用 GitHub compare 确认：
   - base：`main`
   - head：`feature/local-write-binding-e2e`
   - ahead：13
   - behind：0
3. 新建集成分支：
   - `feature/pwa-launch-release-candidate`
4. 新增分支整理文档：
   - `docs/pwa-launch-branch-integration.md`
5. 在发布候选分支上完成完整 Pre-PR 验证，并把验证矩阵补入分支整理文档。
6. 通过 GitHub 连接器创建 Draft PR：
   - [#1 Prepare Silver Health PWA launch candidate](https://github.com/monkeylzl/silver-health-app/pull/1)

#### 分支策略
- 后续 PR 建议只从 `feature/pwa-launch-release-candidate` 合入 `main`；
- 旧的细分 feature 分支暂时保留，便于追踪每轮迭代；
- release candidate 合并后，再删除旧远端分支。

#### 本轮验证
1. 已执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：1 个移动端写入型 E2E 通过，覆盖任务完成、指标录入、用药提醒、家属绑定和家属看板同步。
2. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个移动端只读 E2E 通过，覆盖 390x844 与 360x800 视口、四个底部 Tab 和移动布局。
3. 已执行：
   - `corepack pnpm test:local-e2e-utils`
   - 结果：3 个测试通过。
4. 已执行：
   - `corepack pnpm test:github-workflow`
   - 结果：1 个测试通过。
5. 已执行：
   - `corepack pnpm test:demo-reset-utils`
   - 结果：5 个测试通过。
6. 已执行：
   - `corepack pnpm test:smoke-utils`
   - 结果：4 个测试通过。
7. 已执行：
   - `corepack pnpm test:vercel-deploy-utils`
   - 结果：3 个测试通过。
8. 已执行：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
9. 已执行：
   - `corepack pnpm --filter @silver-health/web build`
   - 结果：通过，缺失 chunk 类问题未复现。
10. 已执行：
    - `corepack pnpm --filter @silver-health/api build`
    - 结果：通过。
11. 已执行：
    - `corepack pnpm smoke:production`
    - 结果：17 项线上冒烟检查通过，覆盖 Vercel Web、Railway API、PWA 资源、真实 API 内容、健康检查、任务/指标/用药/周报数据和 CORS。

#### 下一轮建议
1. 在 PR #1 中确认 GitHub mergeability 和 Actions 状态；
2. 将手动 release gate 在 GitHub Actions 中跑一遍，确认远端 CI 环境变量和数据库访问；
3. 若继续开发，优先补档案编辑或周报生成的写入型 E2E。

---

### 88. 档案编辑写入闭环与 PR 状态复查

#### 本轮处理
1. 复查 PR #1：
   - PR 状态：open draft；
   - mergeable：true；
   - 当前 head：`8b6df17`；
   - commit status：暂无；
   - pull-request workflow runs：暂无。
2. 当前 GitHub 连接器可查询 Actions run、job、日志和重跑失败任务，但没有手动触发 `workflow_dispatch` 的工具入口；手动 release gate 仍需要在 GitHub UI 中触发。
3. 扩展 `tests/e2e/local-write-flow.spec.ts`，在现有写入闭环后继续覆盖：
   - 进入老人档案页；
   - 载入已有档案；
   - 更新页面称呼、联系手机号和老人姓名；
   - 保存档案；
   - 通过 API 验证 profile name、user nickname、user mobile 均已更新；
   - 进入“我的”页验证新称呼和手机号已经反映到移动端账号摘要。
4. 使用 TDD 验证缺口：
   - 首次运行扩展后的本地写入 E2E 失败；
   - 失败原因：`POST /api/profile/elder` 的 upsert 更新了 `elderProfile.name`，但没有同步更新关联 `user.nickname` 和 `user.mobile`。
5. 修复 `ElderProfileService.create()`：
   - 对已有 `userId` 的保存请求，先规范化 `nickname` 和 `mobile`；
   - 在 profile upsert 前同步更新关联 user；
   - 新建档案路径继续保持原有自动创建 user 行为。
6. 更新分支整理文档，补充档案编辑覆盖范围和 E2E 发现的修复项。

#### 本轮验证
1. 已先执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：按预期失败，失败点为 `nickname` 和 `mobile` 未同步到关联 user。
2. 修复服务层后再次执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：1 个移动端写入型 E2E 通过，覆盖任务、指标、用药、家属绑定、档案编辑和“我的”页同步。
3. 已执行：
   - `corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
4. 已执行：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
5. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个移动端只读 E2E 通过。

#### 下一轮建议
1. 在 GitHub UI 中手动触发 release gate，确认远端 CI 与环境变量；
2. 继续补周报生成或周报可视化的写入/展示闭环；
3. 进入 Node TS 脚本 ESM warning 清理，降低演示和 CI 输出噪音。

---

### 89. 周报生成写入闭环

#### 本轮处理
1. 扩展 `tests/e2e/local-write-flow.spec.ts`，在已有任务、指标、用药、家属绑定、档案编辑之后继续覆盖：
   - 进入家属周报页；
   - 点击“生成本周周报”；
   - 验证 API 周报数量增加；
   - 验证页面出现由当前任务、指标、用药提醒汇总出的摘要。
2. 首次执行扩展后的 E2E 时先暴露一个测试数据问题：
   - 固定手机号 `13900001111` 在多次 demo reset 后可能和历史 user 记录冲突；
   - 将 E2E 改为每次生成唯一手机号，避免本地反复验证时被旧用户数据影响。
3. 再次执行 E2E 后按预期失败在周报页：
   - 页面没有“生成本周周报”按钮；
   - API 没有生成本周周报的写入入口。
4. 新增后端接口：
   - `POST /api/reports/elder/:elderUserId/generate`
5. 新增 `ReportService.generateCurrentWeek()`：
   - 按当前周统计老人任务完成数；
   - 统计本周健康指标记录数；
   - 读取启用中的用药提醒；
   - 生成家属可读的 `summaryText` 和 `suggestionList`；
   - 使用 `weeklyReport.upsert()`，重复点击同一周只刷新，不重复创建。
6. 新增周报页客户端组件：
   - `apps/web/app/family/report/generate-report-button.tsx`
   - 成功后显示“本周周报已生成，页面已刷新。”并调用 `router.refresh()`。
7. 更新分支整理文档，将本周周报生成纳入发布候选分支覆盖范围。

#### 本轮验证
1. 已先执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：失败，先暴露固定手机号重复运行冲突。
2. 修复 E2E 手机号数据后再次执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：按预期失败在缺少“生成本周周报”按钮。
3. 实现周报生成接口和页面按钮后执行：
   - `corepack pnpm test:e2e:local-write`
   - 结果：1 个移动端写入型 E2E 通过，覆盖任务、指标、用药、家属绑定、档案编辑、我的页同步、家属看板和周报生成。
4. 已执行：
   - `corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
5. 已执行：
   - `corepack pnpm --filter @silver-health/web build`
   - 结果：通过。
6. 首次并行执行 Web build 与 Web typecheck 时：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：失败，原因为 build 正在重建 `.next/types`，typecheck 读取到缺失的生成文件。
7. Web build 完成后单独重跑：
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：通过。
8. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个移动端只读 E2E 通过。

#### 下一轮建议
1. 将 Web build 与 Web typecheck 在本地和 CI 中保持串行，避免 `.next/types` 竞态；
2. 清理 Node TS 脚本 ESM warning；
3. 继续补周报生成逻辑的单元测试，特别是日期范围、重复生成 upsert、空数据建议文案。

---

### 90. Release Gate 自动化、ESM Warning 清理与周报单测

#### 本轮处理
1. 按建议顺序先处理 release gate：
   - 确认 GitHub 连接器仍只能查询 workflow runs/jobs/logs 和重跑失败任务，不能直接触发 `workflow_dispatch`；
   - 当前 workflow 文件仍在 PR 分支，尚未进入 `main`，手动 dispatch 入口不稳定；
   - 将 `.github/workflows/release-gates.yml` 扩展为同时支持 `pull_request` 和 `workflow_dispatch`；
   - 后续 PR 分支 push 后，release gate 可自动跑；合入 `main` 后仍可手动 dispatch。
2. 调整 release gate 执行顺序：
   - Web production build 先跑；
   - Web typecheck 在 build 后跑，避免 `.next/types` 生成文件竞态；
   - PR 触发时使用默认线上 Web/API/elder 参数；
   - 手动触发时继续支持自定义 Web/API/elder 参数和开关项。
3. 清理 Node TS script ESM warning：
   - 根 `package.json` 增加 `"type": "module"`；
   - root scripts、demo ready、smoke、工具测试不再打印 `MODULE_TYPELESS_PACKAGE_JSON` warning；
   - API 包保持 CommonJS，不改 `apps/api/package.json`，避免影响 Nest `dist/main.js` 运行；
   - 为 `apps/api/src/modules/report` 增加局部 `package.json`，只让 Node 测试识别 report 纯函数模块为 ESM。
4. 给周报生成逻辑补单元测试：
   - 新增 `apps/api/src/modules/report/report-generation.ts`，抽出当前周范围和摘要生成逻辑；
   - `ReportService.generateCurrentWeek()` 只负责数据库查询和 upsert；
   - 新增 `scripts/report-generation-utils.test.ts`；
   - 根脚本新增 `test:report-generation-utils`；
   - GitHub release gate utility tests 中加入该脚本。
5. 更新 workflow 自测：
   - 检查 `pull_request` 触发；
   - 检查新增周报单测；
   - 检查 Web build 在 Web typecheck 之前执行。
6. 执行 `corepack pnpm demo:ready`：
   - 首次本地 `check:demo` 因本地库缺演示账号失败；
   - `demo:ready` 自动 seed；
   - 二次 `check:demo` 通过；
   - `check:demo-copy` 通过；
   - 输出不再包含 Node TS module warning。

#### 本轮验证
1. 已执行：
   - `corepack pnpm test:report-generation-utils`
   - 结果：3 个测试通过，覆盖 Asia/Shanghai 当前周、正常摘要、空数据摘要。
2. 已执行：
   - `corepack pnpm test:github-workflow`
   - 结果：1 个测试通过，覆盖 PR 自动 gate、手动 gate、构建顺序和 utility tests。
3. 已执行：
   - `corepack pnpm test:local-e2e-utils`
   - 结果：3 个测试通过。
4. 已执行：
   - `corepack pnpm test:demo-reset-utils`
   - 结果：5 个测试通过。
5. 已执行：
   - `corepack pnpm test:smoke-utils`
   - 结果：4 个测试通过。
6. 已执行：
   - `corepack pnpm test:vercel-deploy-utils`
   - 结果：3 个测试通过。
7. 已执行：
   - `corepack pnpm --filter @silver-health/api build`
   - 结果：通过。
8. 已按顺序执行：
   - `corepack pnpm --filter @silver-health/web build`
   - `corepack pnpm --filter @silver-health/web typecheck`
   - 结果：均通过。
9. 已执行：
   - `corepack pnpm test:e2e:mobile`
   - 结果：4 个移动端 E2E 通过。
10. 已执行：
    - `corepack pnpm smoke:production`
    - 结果：17 项线上 smoke 通过，且无 Node TS module warning。
11. 已执行：
    - `corepack pnpm test:e2e:local-write`
    - 结果：1 个本地写入型 E2E 通过，覆盖任务、指标、用药、家属绑定、档案编辑、我的页同步、家属看板和周报生成。
12. 已执行：
    - `corepack pnpm demo:ready`
    - 结果：自动 seed 后通过 demo 数据检查和文案一致性检查，且无 Node TS module warning。

#### 下一轮建议
1. 推送后观察 PR #1 的 GitHub Actions run；
2. 若 release gate 通过，将 PR #1 从 draft 转为 ready for review；
3. 如 Actions 失败，优先根据 GitHub logs 修 CI 环境差异。

---

### 91. Release Gate 远端通过与 PR Ready

#### 本轮处理
1. 推送 `2dabd98` 后，PR #1 自动触发 GitHub Actions：
   - workflow：`Silver Health release gates`
   - run id：`29096789384`
2. 远端 release gate 完整通过：
   - Checkout / Node / pnpm / install；
   - Prisma client generate；
   - Web production build；
   - Web typecheck；
   - API production build；
   - utility tests；
   - production smoke；
   - Playwright Chromium install；
   - mobile PWA E2E；
   - Vercel prebuilt deploy dry-run。
3. 使用 GitHub 连接器将 PR #1 从 draft 转为 ready for review。
4. 更新分支整理文档，记录 PR ready 和远端 Actions 通过。

#### 本轮验证
1. 已通过 GitHub Actions jobs 查询确认：
   - job：`Build, smoke, and mobile E2E`
   - status：`completed`
   - conclusion：`success`
2. 已确认 PR #1：
   - state：open；
   - draft：false；
   - mergeable：true；
   - head：`2dabd98`。

#### 下一轮建议
1. 合并 PR #1 到 `main`；
2. 合并后确认 `main` 上的生产部署状态；
3. PR 合并且线上确认后，删除旧的细分 feature 分支。

---

### 92. PR 合并、Main 同步与线上 Smoke

#### 本轮处理
1. 复查 PR #1：
   - state：open；
   - draft：false；
   - mergeable：true；
   - head：`b8d43a7`；
   - release gate run `29096957950`：success。
2. 使用 GitHub 连接器合并 PR #1 到 `main`：
   - merge commit：`408fe68`
   - merge method：merge commit
3. 本地切换并同步 `main`：
   - `git fetch origin`
   - `git switch main`
   - `git pull --ff-only`
4. 确认本地 `main`：
   - `HEAD -> main, origin/main`
   - 工作区 clean。
5. 合并后执行线上 smoke：
   - `corepack pnpm smoke:production`
   - 17 项通过，覆盖 Web 页面、PWA 资源、Railway API、数据集合和 CORS。
6. 查询 merge commit：
   - merge commit 本身没有新的 workflow run；
   - release gate 已在 PR final head `b8d43a7` 上通过。
7. 更新分支整理文档为“已合入 main”状态。

#### 本轮验证
1. 已确认 PR #1：
   - merged：true；
   - merge commit：`408fe68`。
2. 已执行：
   - `corepack pnpm smoke:production`
   - 结果：17 项通过。
3. 已确认旧 feature 分支均已 merged into `main`，可清理：
   - `feature/mobile-first`
   - `feature/pwa-launch-ready`
   - `feature/production-smoke-gates`
   - `feature/demo-reset-command`
   - `feature/vercel-prebuilt-deploy-script`
   - `feature/mobile-e2e-interactions`
   - `feature/manual-release-workflow`
   - `feature/local-write-e2e`
   - `feature/local-write-medication-e2e`
   - `feature/local-write-binding-e2e`
   - `feature/pwa-launch-release-candidate`

#### 下一轮建议
1. 清理本地和远端旧 feature 分支；
2. 如 Vercel / Railway 有自动部署日志，再对照生产 smoke 做最终上线记录；
3. 进入真实账号体系或通知提醒的下一阶段规划。

---

### 93. 合并后分支清理

#### 本轮处理
1. 确认所有旧 feature 分支均已 merged into `main`。
2. 删除远端旧分支：
   - `feature/mobile-first`
   - `feature/pwa-launch-ready`
   - `feature/production-smoke-gates`
   - `feature/demo-reset-command`
   - `feature/vercel-prebuilt-deploy-script`
   - `feature/mobile-e2e-interactions`
   - `feature/manual-release-workflow`
   - `feature/local-write-e2e`
   - `feature/local-write-medication-e2e`
   - `feature/local-write-binding-e2e`
   - `feature/pwa-launch-release-candidate`
3. 删除对应本地旧分支。
4. 执行 `git fetch --prune` 清理远端跟踪引用。

#### 本轮验证
1. 已执行：
   - `git branch --all`
   - 结果：仅剩 `main` 和 `origin/main`。
2. 已执行：
   - `git status --short --branch`
   - 结果：`main...origin/main`，工作区 clean。

#### 下一轮建议
1. 对接 Vercel / Railway 部署日志，确认 `main` 后续自动部署是否已完成；
2. 若线上部署确认无误，进入下一阶段：真实账号体系、通知提醒或小程序/原生端路线。

---

### 94. 平台部署状态复核

#### 本轮处理
1. 确认本地分支状态：
   - 当前分支：`main`；
   - 远端跟踪：`origin/main`；
   - 工作区：clean。
2. 复核 Vercel CLI 登录状态：
   - 登录账号：`monkeylzl`。
3. 复核当前 Vercel 生产部署：
   - 生产别名：`https://web-nu-blond-89.vercel.app`；
   - deployment id：`dpl_8AkzX95njUQTcCHh9qUzrDjx6D4V`；
   - target：`production`；
   - status：`Ready`。
4. 复核 Railway CLI 登录和服务状态：
   - 登录账号：`zhongliang liu (monkeylzl)`；
   - project：`heartfelt-transformation`；
   - environment：`production`；
   - service：`silver-health-api`；
   - deployment id：`e78cd36c-000b-4b74-9c21-326f11304a20`；
   - status：`Online`。
5. 复核 Railway 日志：
   - `prisma migrate deploy` 已执行；
   - 当前无 pending migrations；
   - Nest API 已成功启动。
6. 更新部署记录：
   - `docs/pwa-launch-deployment-record.md` 增加 2026-07-10 平台侧复核；
   - 只记录非敏感配置，不写入 `DATABASE_URL` 具体值。

#### 本轮验证
1. 已执行：
   - `corepack pnpm dlx vercel whoami`
   - 结果：登录账号为 `monkeylzl`。
2. 已执行：
   - `corepack pnpm dlx vercel inspect https://web-nu-blond-89.vercel.app`
   - 结果：生产部署 `Ready`。
3. 已执行：
   - `railway whoami`
   - `railway status`
   - 结果：Railway production API 服务 `Online`。
4. 已执行：
   - `railway logs --deployment e78cd36c-000b-4b74-9c21-326f11304a20 --lines 80`
   - 结果：迁移无待执行项，API 启动成功。
5. 已执行：
   - `corepack pnpm smoke:production`
   - 结果：17 项线上 smoke 全部通过。

#### 下一轮建议
1. 提交并推送平台复核文档；
2. 进入下一阶段产品化优先项：
   - 真实账号体系；
   - 通知提醒；
   - 演示数据线上重置入口；
   - 小程序或原生端路线验证。

---

### 95. 移动端应用产品化重构

#### 本轮处理

1. 从 `main` 创建 `feature/mobile-app-productization`。
2. 将主导航统一为 `今日 / 健康 / 家人 / 我的`：
   - 手机固定底部 Tab；
   - 768px 起使用紧凑侧栏；
   - 1024px 起使用展开侧栏和双栏内容。
3. 重构四个主页面和二级流程：
   - 今日任务预览与完整任务；
   - 指标摘要、趋势和录入；
   - 用药新增、编辑、启停、删除；
   - 家人近况、绑定状态和周报；
   - 档案、在线状态、安装和退出。
4. 新增体验口令与签名会话：
   - scrypt 口令哈希；
   - HMAC-SHA256 HttpOnly Cookie；
   - Middleware 和 BFF 双层校验。
5. 新增 Railway 全局内部 API 密钥 Guard，health 保持公开。
6. 新增任务状态更新、撤销完成、用药编辑与删除 API。
7. 浏览器写操作全部切换到同源 `/api/app/*`，服务端注入档案 ID。
8. 升级 service worker 为网络优先、已登录页面动态缓存、退出清缓存和离线只读。
9. PR workflow 增加 PostgreSQL 16 服务，改为测试当前分支，不再用旧生产站点代替分支 E2E。
10. 新增技术方案、测试方案、优化路线和重点技术详解文档。

#### 关键问题与修复

1. Next dev portal 拦截底部导航点击：
   - 根因：开发指示器覆盖左下角；
   - 修复：`next.config.ts` 设置 `devIndicators: false`。
2. 本地登录后任务页重新进入口令页：
   - 根因：Cookie 写在 `127.0.0.1`，客户端导航切到 `localhost`；
   - 修复：E2E Web 地址统一使用 `localhost`。
3. 新录入 132/82 后健康页仍显示 128/78：
   - 根因：午夜运行时新记录时间早于 seed 的晨间记录；
   - 修复：E2E 显式设置晚于最新记录的测量时间，并由 BFF `revalidatePath` 失效关联页。
4. 后端英文 404 暴露到页面：
   - 修复：按 HTTP 状态统一映射为中文用户提示。

#### 本轮验证

1. `corepack pnpm test:unit`：9 项通过。
2. `corepack pnpm --filter @silver-health/web typecheck`：通过。
3. `corepack pnpm --filter @silver-health/web build`：通过，26 个 App Router 路由生成成功。
4. `corepack pnpm --filter @silver-health/api typecheck`：通过。
5. `corepack pnpm --filter @silver-health/api build`：通过。
6. 手机 390x844 Browser 复查：
   - 无横向滚动；
   - 首页任务预览 3 条；
   - 业务触控目标均不小于 44px。
7. iPad 1024x1366 Browser 复查：
   - 232px 侧栏可见；
   - 底部导航隐藏；
   - 内容无横向溢出；
   - 健康与家人页使用双栏。
8. `corepack pnpm test:e2e:app`：
   - 5 个设备项目；
   - 20 条导航/布局/无障碍用例通过；
   - 1 条完整写入闭环通过。

#### 下一步

1. 执行完整 `test:release`；
2. 配置 Vercel/Railway 新增安全环境变量；
3. 提交并推送分支；
4. 部署预览并执行受保护 production smoke；
5. Android、iPhone 和 iPad 真机安装验收。

---

### 96. 上线前安全复审与生产 PWA 门禁

#### 本轮处理

1. 修复 Service Worker 缓存边界：公开静态资源进入 `STATIC_CACHE`，受保护页面和 RSC 只进入退出时可清除的 `PAGE_CACHE`。
2. 修复生产环境 Service Worker 注册竞态：页面已完成 load 时立即注册，否则监听一次 load。
3. 任务重复设置 `done` 直接返回原记录，保留原 `completedAt`，满足幂等要求。
4. BFF 为任务和用药更新注入固定老人 ID，API 校验记录归属，错误归属返回 404。
5. 新增指标领域校验，拒绝缺少必填值或跨指标类型混填。
6. `/api/session` 增加 1KB 请求体、128 字符口令和每 IP 每分钟 8 次限制。
7. 修复 `access-code:hash` 对 pnpm `--` 分隔符的解析。
8. 本地 E2E 改为 `next build + next start`，新增 Service Worker 离线、RSC 缓存和退出清缓存验证。
9. GitHub Actions utility gate 增加 `test:unit`。

#### 验证结果

1. `corepack pnpm test:unit`：16 项通过，包含无 Content-Length 的超大流式请求。
2. Web/API typecheck：通过。
3. 生产模式响应式 E2E：5 个设备项目、20 项通过。
4. 生产模式完整写入 E2E：1 项通过，新增非法指标、错误老人归属和任务重复完成校验。
5. 生产模式 PWA E2E：1 项通过，覆盖离线读取、离线写入阻止、静态缓存无 RSC 和退出清缓存。
6. 任务状态改为条件更新，E2E 使用 4 个并发 `done` 请求验证只生成一个 `completedAt`。
7. GitHub Actions 首次运行在 5 个设备项目的首页任务预览失败：Runner 为 UTC，seed 生成 `2026-07-10`，API 按上海时区查询 `2026-07-11`。已将 demo 日期、时间和周范围统一为 `Asia/Shanghai`，并新增 UTC 跨日测试。

#### 下一步

1. 执行最终 `corepack pnpm test:release`；
2. 提交并推送 `feature/mobile-app-productization`；
3. 配置 Vercel/Railway/GitHub Secrets，合并后部署；
4. 执行生产 smoke 和手机真机安装验收。

---

### 97. 产品化版本合并与生产部署

#### 本轮处理

1. `feature/mobile-app-productization` 已通过 PR #2 合并到 `main`，合并提交为 `b9ec3b0db162c85485ef69ad8723e84228e4abcf`。
2. GitHub Actions 最终门禁运行 `29126601774` 全部通过，包含单元测试、Web/API 构建、5 组响应式 E2E、完整写入 E2E、PWA 离线 E2E 和 Vercel dry-run。
3. Railway API 已部署：
   - 服务：`silver-health-api`；
   - deployment id：`91b8ea9f-e1ee-4727-843f-7e83b59aec52`；
   - 健康检查正常，未携带内部密钥的业务请求返回 `401`。
4. Vercel Web 已部署到生产别名 `https://web-nu-blond-89.vercel.app`。
5. Vercel WAF 已发布 `/api/session` 体验口令限流规则：每个 IP 每 60 秒最多 8 次，超限拒绝。
6. 使用 Railway Postgres 公网连接执行生产 `demo:ready`，完成 2026-07-11 固定体验数据初始化。
7. 将 `check:demo-copy` 从旧演示页文案检查调整为四个正式产品工作台及 `/demo` 重定向契约检查。

#### 本轮验证

1. `corepack pnpm test:release`：全部通过。
2. GitHub Actions `29126601774`：全部通过。
3. `corepack pnpm smoke:production`：17 项全部通过：
   - 四个主页面和家人周报可访问；
   - Manifest、Service Worker、离线页可访问；
   - 首页读取 4 项真实任务；
   - API 指标、用药和周报读取正常；
   - CORS 与 PATCH 预检正常。
4. 生产体验数据：今日任务 4 项、指标 3 项、启用用药提醒 2 项、有效家人绑定 1 项、周报 2 份。

#### 后续运维项

1. 在 GitHub 仓库补充 `PRODUCTION_TRIAL_ACCESS_CODE` 与 `PRODUCTION_INTERNAL_API_KEY` Secrets，启用手动生产 smoke workflow；当前生产应用和部署不受影响。
2. 使用 iPhone Safari、Android Chrome 和 iPad Safari 完成最终真机安装与桌面图标验收。

---

### 98. Android 真机功能与安装验证

#### 测试设备

- 设备：Xiaomi 2211133C；
- 系统：Android 15；
- 浏览器：小米浏览器 Chromium 135；
- 物理分辨率：1080x2400；
- 页面 CSS 视口：392x718；
- 调试方式：USB ADB + 浏览器 CDP。

#### 验证结果

1. 体验口令登录成功，今日、健康、家人、我的四个 Tab 均可切换，激活态正确。
2. 主页面和任务、指标录入、用药管理、周报、档案二级页面均无横向溢出。
3. 底部 Tab 高度 58px，表单控件 48px，未发现低于 44px 的可见触控目标。
4. 真机触控完成任务时，BFF `PATCH /api/app/tasks/:id` 返回 200；测试结束后已按任务名称撤销，首页恢复 `今日已完成 1/4`。
5. Manifest 可读取且无错误，Service Worker 已激活，当前生产路由无 4xx/5xx、无控制台错误。
6. 小米浏览器可通过“添加到桌面”创建 `Silver Health` 图标，桌面启动成功。

#### 发现与结论

1. 初次访问时当前网络 DNS 曾将 Vercel 域名错误解析至 `31.13.73.9`；删除临时 Private DNS 并恢复自动 DNS 后页面正常打开。
2. 第一次自动任务点击发生在 React 完成接管前，没有产生请求；改用真机触控后接口和 UI 均正常，不属于产品缺陷。
3. 小米浏览器的“添加到桌面”只创建普通网页快捷方式：
   - 启动后仍显示浏览器地址栏；
   - `display-mode` 不是 standalone；
   - 从“我的”页添加时入口固定为 `/me`。
4. Android 独立 PWA 安装仍需使用 Chrome 进行最终确认；小米浏览器结果不能替代 Chrome WebAPK 验收。

#### 下一步

1. 使用 Android Chrome 从生产首页执行“安装应用”，验证 standalone、Manifest start_url 和桌面图标；
2. 完成 iPhone Safari 与 iPad Safari 添加主屏幕验证；
3. 根据浏览器能力调整“我的”页安装提示，明确区分独立安装与桌面快捷方式。

---

### 99. Android Chrome 独立 PWA 安装验收

#### 本轮处理

1. 在 Xiaomi 2211133C 安装并启用 Chrome 150.0.7871.64。
2. 使用 Chrome 打开生产首页、输入体验口令并完成 PWA 可安装性预检。
3. 通过 Chrome“安装并创建快捷方式 -> 安装应用”安装 Silver Health。
4. MIUI 首次启动时选择“始终允许银发健康打开 Chrome”。
5. 清理测试期间创建的普通网页快捷方式与旧小米浏览器 PWA，最终桌面只保留一个 Chrome WebAPK 图标。

#### 验证结果

1. Chrome installability errors 为空，Manifest 无错误，Service Worker 已激活。
2. 安装生成包 `org.chromium.webapk.a3fbc4f1350dfafad_v2`，安装时间为 2026-07-11 15:55:52。
3. 桌面图标名称采用 Manifest short_name：`银发健康`。
4. 从桌面启动进入 Chrome `SameTaskWebApkActivity`：
   - 无浏览器地址栏；
   - `display-mode: standalone` 为 true；
   - start_url 正确打开 `/`；
   - 可视高度从浏览器模式 763px 增加至独立模式 819px。
5. 独立应用内今日、健康、家人、我的四个 Tab 均正常：
   - 激活态正确；
   - 无横向溢出；
   - 未发现低于 44px 的可见触控目标。
6. CDP 网络离线时，不缓存网络探针返回 TypeError，证明网络已被阻断；缓存的今日页和任务仍正常显示。
7. 恢复网络后页面继续打开，任务进度保持测试前的 `1/4`。

#### 结论

Android Chrome 独立 PWA 安装验收通过。当前真机桌面可直接以应用方式打开 Silver Health，Android 侧 P0 真机安装项完成；后续仍需补充 iPhone Safari 与 iPad Safari 验收。

---

### 100. iPhone 独立 PWA 离线冷启动修复与网络恢复体验

#### 真机环境

- 设备：iPhone16,1；
- 系统：iOS 26.3.1；
- Safari：26.3；
- 独立 PWA CSS 视口：393x793；
- 调试：Safari Web Inspector + `ios-webkit-debug-proxy`。

#### 问题定位

1. Safari 浏览器与独立 PWA 的四个主 Tab、任务写入、触控尺寸和 standalone 均正常。
2. 飞行模式下冷启动最初持续白屏，较长时间后出现无样式 HTML，并伴随重复导航。
3. 真机缓存审计确认：页面 HTML 和 RSC 已进入页面缓存，但 `/_next/static/` 下的 CSS/JS 没有进入 Service Worker 缓存。
4. 因此 WebKit 离线时先等待样式和脚本请求超时，最终只能显示未完成 React 接管的服务端 HTML。

#### 修复内容

1. Service Worker 对 Next.js 带哈希构建资源增加缓存优先运行时缓存，缓存升级为 `static-v4/pages-v4`。
2. iOS 文档请求按 `mode=navigate` 或 `destination=document` 处理，缓存页面立即返回。
3. 已缓存主 Tab 的 RSC 数据改为缓存优先、后台更新，避免离线切 Tab 等待网络超时。
4. 网络状态从离线恢复到在线时自动调用 `router.refresh()`，首次在线加载不重复刷新。
5. 离线状态卡改为可操作入口，打开网络帮助层，提供 iPhone/Android 设置路径和“重新检测”。
6. PWA 不使用 iOS 私有设置 URL；直接跳系统网络设置留给原生 App 或 Capacitor 壳。

#### 真机与自动化结果

1. `static-v4` 已缓存首页 CSS、8 个核心 JS chunk 和页面专属 chunk；`pages-v4` 已缓存首页及四个主 Tab 数据。
2. 飞行模式、完全关闭、桌面冷启动后页面立即显示完整样式，白屏问题修复。
3. 独立模式、393x793、四 Tab、无横向溢出和任务进度 `1/4` 均正常。
4. `corepack pnpm test:unit`：20 项通过，覆盖 iOS 文档、Next 静态资源、离线 RSC 和联网恢复判断。
5. `E2E_PWA_ONLY=1 corepack pnpm test:e2e:app`：2 项通过，覆盖离线读取/写入阻止、网络帮助、重新检测、联网恢复和退出清缓存。
6. `corepack pnpm --filter @silver-health/web typecheck` 与 build 通过，26 个路由生成成功。

#### 后续验收

1. 发布网络恢复与离线 Tab 优化；
2. iPhone 真机验证离线状态入口、重新检测、恢复联网自动刷新和 Tab 切换速度；
3. 完成 iPad Safari 竖屏、横屏和安装验收。

---

### 101. iOS 真实连通性检测与主 Tab 切换提速

#### 真机反馈

1. 飞行模式下页面可正常离线显示，但“我的”仍显示“已连接”，看不到“离线浏览”。
2. 有网和离线情况下切换底部 Tab 均存在可感知等待。

#### 根因

1. iOS 独立 PWA 在飞行模式下仍可能返回 `navigator.onLine=true`，仅监听 `online/offline` 事件会误判。
2. Next.js 客户端导航的 `_rsc` 查询参数可能变化，Service Worker 按完整 URL 匹配会漏掉同一路径的已有 RSC 缓存。

#### 修复

1. 新增公开且不缓存的 `GET /api/connectivity`，只返回 204，用于验证 Web 到同源服务的真实连通性。
2. 新增全局 `ConnectivityMonitor`，在启动、前后台切换、网络事件、主动检查和每 15 秒定时检查时执行真实探测。
3. 实际状态从离线恢复到在线时全局调用 `router.refresh()`；“我的”页订阅统一状态并正确显示离线入口。
4. “重新检测”改为实际请求连通性端点，包含 3 秒超时，不再直接读取 `navigator.onLine` 后判定成功。
5. RSC 缓存改为按 pathname 查找最新缓存，忽略变化的 `_rsc` 值；更新成功后清理同路径旧版本，避免缓存无限增长。

#### 验证

1. `corepack pnpm test:unit`：20 项通过，包含连通成功、503、断网、超时及跨 `_rsc` 参数缓存命中。
2. `corepack pnpm --filter @silver-health/web typecheck`：通过。
3. `E2E_PWA_ONLY=1 corepack pnpm test:e2e:app`：2 项通过。
4. 本地生产构建新增 `/api/connectivity`，共生成 27 个路由。
5. 待生产发布后使用 iPhone 验证“离线浏览”、网络帮助、恢复联网和四 Tab 切换速度。
