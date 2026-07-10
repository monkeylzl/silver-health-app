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
