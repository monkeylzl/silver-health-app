# silver-health-app

老年健康管理 MVP，当前已经具备一条可本地启动、可真实联调、可按固定顺序演示的主链路。

## 现在最该先知道的事

如果你是第一次接手这个仓库，**先不要急着翻开发日志**，先记住下面这条最短路径：

```bash
pnpm demo:ready
```

- 通过：说明当天 demo 数据已经可直接演示，且 README / 首页 / 提词材料的关键 demo 口径也已过一致性检查；
- 它会自动按“先 `check`，失败再 `seed`，最后再 `check` 一次，并补做 `check:demo-copy`”的顺序准备好数据与讲法口径；
- **最该读的结论：`pnpm demo:ready` 通过后，现在可以开 API / Web，并优先从今日工作台 / 开始体验；路演讲解再打开 /demo。**

如果你只想把项目尽快跑起来，推荐顺序就是：

1. 启动 PostgreSQL，并确认根目录 `.env` 的 `DATABASE_URL` 正确；
2. 执行 `pnpm demo:ready`；
3. 启动 API：`pnpm dev:api`；
4. 启动 Web：`pnpm dev:web`；
5. 从今日工作台 `http://localhost:3000/` 开始体验；如果是路演讲解，再打开 `/demo`。

> 当前稳定口径：**优先 `demo:ready`；手动分步时才是先 check，再 seed。** 不要把 `seed:demo` 当成每次启动都必须跑的默认动作。

---

## 快速启动

### 1. 环境要求

- Node.js 24+
- `corepack`
- `pnpm@10.0.0`
- 本机 PostgreSQL

### 2. 安装依赖

```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install
pnpm prisma:generate
```

### 3. 配置环境变量

根目录 `.env`：

```env
DATABASE_URL="postgresql://liuzhongliang@localhost:5432/silver_health"
```

`apps/web/.env.local`：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=cmn5zm37f0000ijdo5tp2h0e0
```

### 4. 准备演示数据

```bash
pnpm demo:ready
```

如果你想手动分步执行，再按下面这套：

```bash
pnpm check:demo
pnpm seed:demo
pnpm check:demo
pnpm check:demo-copy
```

其中 `pnpm check:demo-copy` 不只是在查 README / 今日工作台 / 提词材料有没有“文案不一致”，还会一起校验 `demo:ready` 最终那句“现在可以开 API / Web，并优先从今日工作台 / 开始体验；路演讲解再打开 /demo。”有没有和入口文档漂移。

### 5. 启动服务

```bash
pnpm dev:api
pnpm dev:web
```

默认地址：

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Health: `http://localhost:3001/api/health`

---

## 推荐体验入口

推荐正式体验从今日工作台开始：

- `http://localhost:3000/`

路演或交接讲解再打开：

- `http://localhost:3000/demo`

`/demo` 已经固定好当前最顺手的讲解顺序：

1. 老人建档 `/elder/profile`
2. 今日任务 `/elder/home`
3. 健康指标录入 `/elder/metrics`
4. 用药提醒 `/elder/medication`
5. 家属看板 `/family/dashboard`
6. 家属周报 `/family/report`
7. 补充：家属绑定 `/family/bind`

这条顺序对应当前 MVP 最容易讲清楚的产品故事：**老人执行日常管理动作，家属查看摘要与周报。**

---

## 演示前 30 秒检查

正式开始前，至少确认：

- `http://localhost:3001/api/health` 可访问；
- 优先跑 `pnpm demo:ready`（至少也要 `pnpm check:demo` 通过）；
- 首页 `/` 能正常打开；
- 随机打开 1 个老人页和 1 个家属页，顶部显示“当前接入：真实 API”。

如果要讲完整主链路，再额外确认：

- `/elder/home` 有今日任务；
- `/family/dashboard` 有一句话近况；
- `/family/report` 能看到最近完整周周报。

## 现场操作分层

正式 demo 时，优先按这套分层控制节奏：

- **建议现场操作：** `/elder/profile` 保存 1 次、`/elder/home` 完成 1 项任务、`/elder/metrics` 新增 1 条指标；
- **优先只讲即可：** `/elder/medication`、`/family/dashboard`、`/family/report`；
- **只在被问到时再补：** `/family/bind`。

一句话记住就是：**真正动手只做 3 个动作，后面页面优先只讲即可。**

---

## 常用命令

```bash
pnpm dev:api        # 启动 NestJS API
pnpm dev:web        # 启动 Next.js Web
pnpm typecheck      # Monorepo 类型检查
pnpm build          # Monorepo 构建
pnpm prisma:generate
pnpm seed:demo      # 重建滚动 demo 数据
pnpm check:demo     # 检查当天 demo 是否仍可直接演示
pnpm check:demo-copy # 检查 README / 首页 / 提词材料口径是否一致，也会校验 cheatsheet 是否补到 check:demo-copy / demo:ready 说明，以及 demo:ready 最终结论是否漂移
pnpm demo:ready     # 先 check，失败则自动 seed 并再次 check，最后补做 check:demo-copy，并在输出里提示 cheatsheet 已覆盖这套接手说明
```

---

## 当前项目状态

已具备：

- 老人建档
- 今日任务
- 健康指标录入
- 用药提醒
- 家属看板
- 家属周报
- 家属绑定
- 真实 API 联调
- 滚动 demo seed
- demo 自检脚本与 `/demo` 演示入口页
- H5/PWA 安装壳、今日工作台、底部多 Tab 导航

当前目标不是继续铺大功能，而是优先保证：

- 别人接手也知道如何启动；
- demo 数据不过一天就失效；
- 演示前能快速确认今天是否还能直接讲。

---

## 关键文档

优先阅读顺序：

1. `README.md`
   - 启动入口、check/seed 规则、演示入口
2. `docs/how-to-preview-locally.md`
   - 更完整的本地预览、排障和演示前检查说明
3. `docs/demo-day-cheatsheet.md`
   - demo 当天最短提词卡，适合临上场前快速看一眼
4. `docs/demo-script-3min.md`
   - 3 分钟推荐讲法
5. `docs/development-progress-log.md`
   - 全量开发过程、阶段记录与排查归档

---

## 技术方案

- 前端：Next.js（老人端 + 家属端共用一个 web 应用）
- 后端：NestJS
- 数据库：PostgreSQL
- ORM：Prisma
- 包管理：pnpm
- 工程组织：monorepo

原则：

- 以 MVP 闭环优先，不做过度工程化；
- 不引入微服务、GraphQL、复杂事件总线等超前设计；
- 先保证“建档 -> 今日任务 -> 指标录入 -> 家属查看 -> 周报”主链路可落地。
> 今日任务 -> 指标录入 -> 家属查看 -> 周报”主链路可落地。
