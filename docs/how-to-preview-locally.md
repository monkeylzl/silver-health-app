# Silver Health 本地查看效果说明

> 适用场景：
> - 想在自己电脑上直接把项目跑起来；
> - 想验证最近这轮页面和体验修正是否生效；
> - 不想来回翻开发记录，只想知道“现在怎么启动、看哪里”。

---

## 一、优先参考的现有文档

当前建议优先结合以下文档一起看：

1. `README.md`
   - 接手入口、启动顺序、check / seed 规则、首页演示入口

2. `docs/demo-day-cheatsheet.md`
   - 临上场前最短提词卡
   - 只保留“按什么顺序点、每页说一句什么”

3. `docs/demo-script-3min.md`
   - 稍完整的 3 分钟推荐讲法

4. `docs/development-progress-log.md`
   - 详细开发归档
   - 如果需要追溯某个修正是何时加入的，以它为事实基线

---

## 二、当前本地查看效果的前提条件

在本地查看页面前，需要满足以下条件：

### 1. Node / pnpm 可用
建议：
- Node.js 24+
- `corepack` 可用
- `pnpm@10.0.0`

### 2. 本机 PostgreSQL 可用
当前本地联调用的是本机 PostgreSQL。

当前数据库：
- `silver_health`

当前建议连接串：

```env
DATABASE_URL="postgresql://liuzhongliang@localhost:5432/silver_health"
```

### 3. 根目录 `.env` 已配置
至少需要保证：
- `DATABASE_URL` 正确

### 4. `apps/web/.env.local` 已配置
当前 Web 端需要单独读取前端变量。

建议内容：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=cmn5zm37f0000ijdo5tp2h0e0
```

---

## 三、推荐的本地启动顺序

### Step 1：进入项目目录
```bash
cd /Users/liuzhongliang/.openclaw/agents/coding/workspace/silver-health-app
```

### Step 2：安装依赖（如尚未安装）
```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install
```

### Step 3：生成 Prisma Client
```bash
pnpm prisma:generate
```

### Step 4：确认 PostgreSQL 与数据库已就绪
建议先确认：
- PostgreSQL 服务已经启动
- `silver_health` 数据库已存在
- 根目录 `.env` 中的 `DATABASE_URL` 指向本机数据库

如果你不确定数据库是否可用，优先先做这一步，再往下启动 API，能减少一大半“服务起了但页面没数据”的排查时间。

### Step 5：先做一次演示数据自检，再决定是否重建 seed
最省心的方式是直接执行：
```bash
pnpm demo:ready
```

它会自动按“先 `check`，失败再 `seed`，最后再 `check` 一次，并补做 `check:demo-copy`”的顺序完成准备。

可以把它的通过结果直接理解成一句现场结论：**现在可以开 API / Web，并优先从今日工作台 / 开始体验；路演讲解再打开 /demo。**

如果你只想手动分步执行，也可以：
```bash
pnpm check:demo
```

如果自检提示缺数据、今日任务为空或周报不在最近完整周，再执行：
```bash
pnpm seed:demo
pnpm check:demo
pnpm check:demo-copy
```

这里的 `pnpm check:demo-copy` 不只是补查 README / 今日工作台 / cheatsheet / 3 分钟讲稿的 demo 口径有没有漂，还会一起校验 cheatsheet 是否已经把 `check:demo-copy` / `demo:ready` 这套接手说明补进去，以及 `demo:ready` 最终那句“现在可以开 API / Web，并优先从今日工作台 / 开始体验；路演讲解再打开 /demo。”是否仍和入口文档一致。

推荐场景：
- 刚切换到新机器
- 想把页面恢复成稳定的演示初始状态
- 前面手动录入过很多临时数据，怕影响演示顺序
- 自检脚本已经明确指出 demo 数据失稳

### Step 6：启动 API
```bash
pnpm dev:api
```

默认地址：
- `http://localhost:3001`

健康检查：
- `http://localhost:3001/api/health`

建议看到健康检查可访问后，再启动 Web，这样前端首次加载更容易直接命中真实 API。

### Step 7：启动 Web
另开一个终端窗口：

```bash
pnpm dev:web
```

默认地址通常为：
- `http://localhost:3000`

### Step 8：先打开今日工作台，再按需打开演示入口
正式体验推荐先打开：
- `http://localhost:3000/`

这一页是上线版默认今日工作台。路演或交接讲解再打开：

- `http://localhost:3000/demo`

`/demo` 已经把当前最顺手的 demo 顺序固定成入口卡片；如果不是你本人开发的，也能先从这里进入，减少临场记路由的负担。

---

## 四、当前可直接查看的页面

### 老人侧
- `http://localhost:3000/elder/profile`
- `http://localhost:3000/elder/home`
- `http://localhost:3000/elder/metrics`
- `http://localhost:3000/elder/medication`

### 家属侧
- `http://localhost:3000/family/dashboard`
- `http://localhost:3000/family/report`
- `http://localhost:3000/family/bind`

---

## 五、建议你本地如何验证效果

### 验证 1：确认页面是否走真实 API
进入以下页面后，优先观察页面顶部的“当前接入”提示或“当前接入状态”卡片：

- `/elder/home`
- `/elder/metrics`
- `/elder/medication`
- `/family/dashboard`
- `/family/report`
- `/family/bind`

理想结果：
- 显示“当前接入：真实 API”或“当前接入状态：真实 API”
- 而不是“当前接入：演示数据”

---

### 验证 2：确认 seeded 数据是否存在
你应能看到：
- task 数据
- metric 数据
- medication reminder 数据
- weekly report 数据
- family binding 数据

如果页面空白或变成 mock，多半优先检查：
1. API 是否启动
2. PostgreSQL 是否启动
3. 根 `.env` 的 `DATABASE_URL` 是否正确
4. `apps/web/.env.local` 是否正确

---

### 验证 3：确认最近这轮体验修正是否生效

#### 1. 家属周报页
页面：
- `/family/report`

重点看：
- “运动完成率”
- “用药完成率”

预期：
- 不应因为后端返回字符串数值就显示“暂无”

#### 2. 指标页
页面：
- `/elder/metrics`

重点看：
- 血糖记录中的时段显示

预期：
- 应显示“早餐前 / 早餐后 / 午餐前 / 午餐后 / 晚餐前 / 晚餐后”
- 不应再直接显示 `after_breakfast` 这类内部枚举值

#### 3. 表单提交后的自动刷新
页面：
- `/elder/metrics`
- `/elder/medication`
- `/family/bind`

预期：
- 提交成功后，列表应自动刷新
- 不再出现“提示成功了，但页面列表还是旧的”这种割裂感

---

## 六、演示前 30 秒检查清单

如果你准备现场给别人看，建议正式开始前快速过一遍：

### 最小自检
- `http://localhost:3001/api/health` 能正常返回
- 优先跑 `pnpm demo:ready`，至少也要确认 `pnpm check:demo` 通过
- `http://localhost:3000/` 能打开首页演示入口
- 首页能看到 6 个主步骤卡片（建档、今日任务、指标录入、用药提醒、家属看板、家属周报）
- 至少随机打开 1 个老人页和 1 个家属页，确认顶部显示的是“当前接入：真实 API”而不是“当前接入：演示数据”

### 如果要讲完整 3 分钟主链路
建议再额外确认：
- `/elder/profile` 能正常打开，表单默认示例值仍在
- `/elder/home` 能看到今日任务
- `/family/dashboard` 能看到摘要卡与一句话近况
- `/family/report` 能看到周报列表与“本周一句话总结”

### 现场操作分层
正式 demo 时，优先按这套分层控制节奏：

- **建议现场操作：** `/elder/profile` 保存 1 次、`/elder/home` 完成 1 项任务、`/elder/metrics` 新增 1 条指标
- **优先只讲即可：** `/elder/medication`、`/family/dashboard`、`/family/report`
- **只在被问到时再补：** `/family/bind`

这样最容易把“老人执行 → 家属查看”讲顺，也能避免在次要页面上临场多做动作。

### 演示时的启动顺序建议
最稳妥的讲法顺序仍然是：

> 首页 `/` → 老人建档 → 今日任务 → 指标录入 → 用药提醒 → 家属看板 → 家属周报 → 必要时再补家属绑定

这条顺序建议配合上面的动作分层一起用：前 3 步真正动手，后 3 步优先只讲即可，绑定页只在被问到时再补。

### 如果现场没连上真实 API
也不要临时改讲法，直接按下面这套兜住：

- 先指出顶部“当前接入：演示数据”，明确现在先用演示数据保住讲解节奏；
- 仍按同一条主链路讲：建档 → 今日任务 → 指标录入 → 家属看板 / 周报；
- 最后补一句：真实 API 恢复后，顶部提示会自动切回“当前接入：真实 API”。

---

## 七、推荐演示顺序

如果你不只是看技术效果，而是想顺着产品逻辑看一遍，建议按这个顺序：

1. `/`
2. `/elder/profile`
3. `/elder/home`
4. `/elder/metrics`
5. `/elder/medication`
6. `/family/dashboard`
7. `/family/report`
8. `/family/bind`

这条路径与首页演示入口和 `docs/demo-walkthrough.md` / `docs/demo-script-3min.md` 保持一致。

---

## 八、常见问题排查

### 1. 页面显示“当前接入：演示数据”
优先检查：
- `pnpm dev:api` 是否正常运行
- `apps/web/.env.local` 是否存在且内容正确
- API 地址是否是 `http://localhost:3001`
- `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID` 是否存在

### 2. seed 失败
优先检查：
- PostgreSQL 是否启动
- 数据库 `silver_health` 是否存在
- 根目录 `.env` 中 `DATABASE_URL` 是否正确

### 3. API 能开，页面仍没数据
优先检查：
- API 和 Web 是否都在最新终端里重启过
- 是否已经执行过 `pnpm seed:demo`
- 当前 elder user id 是否与 seed 结果一致

---

## 九、常见坑速记

如果你是隔了一段时间再回来继续看这个项目，最容易踩的通常就这几类：

1. **只开了 Web，没开 API**
   - 页面能打开，但数据会退回 mock 或直接不完整。

2. **API 先前开过，但改完 `.env.local` 后没重启 Web**
   - 前端仍可能拿着旧的 API 地址或旧的默认 elder id。

3. **seed 跑过，但当前默认 elder id 不是 seed 那位老人**
   - 页面不是报错，而是会表现成“服务都正常，但内容像没数据”。
   - 当前推荐的默认值应为 `cmn5zm37f0000ijdo5tp2h0e0`；如果你本地 `apps/web/.env.local` 里不是这个值，优先先改正再继续排查。

4. **隔天回来继续看项目，但担心 demo 数据已经漂移**
   - 现在 `pnpm seed:demo` 会自动把任务、指标、周报对齐到相对当天的时间，不再像之前那样写死日期后隔天就失效。
   - 更省心的做法是直接跑 `pnpm demo:ready`；如果你想手动判断，再先跑 `pnpm check:demo`，只有脚本明确报“今日任务为空 / 周报不对齐最近完整周 / 缺少绑定或提醒”时，再重跑 `pnpm seed:demo`。

5. **先点进具体页面再讲，忘了首页入口已经整理好顺序**
   - 结果现场一直切地址、解释路由，不如直接从 `/` 开始更稳。

---

## 十、一句话说明

当前本地查看效果的最短路径就是：

> 配好 `.env` 和 `apps/web/.env.local` → 启动 PostgreSQL → seed 演示数据（如需）→ 启动 API → 启动 Web → 先打开首页 `/` → 再按主链路验证真实 API 与最近修正效果。
