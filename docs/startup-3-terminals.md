# 三终端启动清单

适用场景：
- 本地第一次启动 `silver-health-app`
- 演示前快速拉起 API + Web
- 想按最短路径验证当前项目是否能正常运行

> 当前推荐入口：先跑 `pnpm demo:ready`，通过后再启动 API / Web，并优先从首页 `/` 开始。

---

## 启动前确认

### 1. 项目目录

```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
```

### 2. 根目录 `.env`

确认至少包含：

```env
DATABASE_URL="postgresql://liuzhongliang@localhost:5432/silver_health"
```

### 3. `apps/web/.env.local`

确认至少包含：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=cmn5zm37f0000ijdo5tp2h0e0
```

### 4. PostgreSQL 已运行

如果本机 PostgreSQL 没启动，先启动它，再继续下面的步骤。

---

## 终端 1：安装依赖并准备 demo

第一次启动建议完整跑一次：

```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app

pnpm install
pnpm prisma:generate
pnpm demo:ready
```

如果 `pnpm demo:ready` 通过，说明：
- 当前 demo 数据可直接演示；
- `README / 首页 / cheatsheet / 讲稿` 的关键 demo 口径也通过了一致性检查；
- 现在可以继续启动 API / Web，并优先从首页 `/` 开讲。

如果不是第一次启动，也可以只跑：

```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
pnpm demo:ready
```

---

## 终端 2：启动 API

```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
pnpm dev:api
```

启动后可检查：

```text
http://localhost:3001/api/health
```

如果正常，应返回 health 数据。

---

## 终端 3：启动 Web

```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
pnpm dev:web
```

启动后打开：

```text
http://localhost:3000/
```

---

## 启动后建议检查

至少确认这几项：

1. `http://localhost:3001/api/health` 可访问；
2. 首页 `http://localhost:3000/` 可打开；
3. `/elder/home` 能看到今日任务；
4. `/family/dashboard` 能看到一句话近况；
5. `/family/report` 能看到最近完整周周报。

---

## 推荐演示顺序

推荐始终从首页开始，再按下面顺序走：

1. `/elder/profile`
2. `/elder/home`
3. `/elder/metrics`
4. `/elder/medication`
5. `/family/dashboard`
6. `/family/report`
7. `/family/bind`（只在被问到时再补）

### 现场操作分层

- **建议现场操作：**
  - 建档保存 1 次
  - 完成 1 项任务
  - 录入 1 条指标
- **优先只讲即可：**
  - 用药提醒
  - 家属看板
  - 家属周报
- **只在被问到时再补：**
  - 家属绑定

一句话记：**真正动手只做前 3 步，后面的页面优先只讲即可。**

---

## 如果 `pnpm demo:ready` 失败

手动补这套：

```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app

pnpm check:demo
pnpm seed:demo
pnpm check:demo
pnpm check:demo-copy
```

其中：
- `pnpm check:demo`：检查当天 demo 数据是否还可直接演示；
- `pnpm seed:demo`：重建滚动 demo 数据；
- `pnpm check:demo-copy`：检查 README / 首页 / cheatsheet / 讲稿 / `demo:ready` 最终结论是否仍保持统一口径。

---

## 一句话版本

如果你只想最快把项目跑起来，直接照这三步：

```bash
# 终端 1
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
pnpm demo:ready

# 终端 2
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
pnpm dev:api

# 终端 3
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
pnpm dev:web
```

然后打开：

```text
http://localhost:3000/
```
