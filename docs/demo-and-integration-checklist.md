# Silver Health Demo & 联调检查清单

> 用途：
> - 作为当前 MVP 的**演示路径**说明；
> - 作为下一阶段联调/收口的**检查清单**；
> - 避免已经做出的页面和接口缺少统一验证路径。

---

## 一、当前项目状态概览

当前项目已经具备以下页面入口：

### 老人侧
- `/elder/profile` — 建档页
- `/elder/home` — 今日任务页
- `/elder/metrics` — 健康指标页
- `/elder/medication` — 用药提醒页

### 家属侧
- `/family/dashboard` — 家属摘要页
- `/family/report` — 家属周报页
- `/family/bind` — 家属绑定页

### 后端已对接的主要接口
- `GET /api/health`
- `POST /api/profile/elder`
- `GET /api/profile/elder/:userId`
- `PATCH /api/profile/elder/:userId`
- `POST /api/tasks`
- `GET /api/tasks/elder/:elderUserId`
- `PATCH /api/tasks/:taskId/complete`
- `POST /api/metrics`
- `GET /api/metrics/elder/:elderUserId`
- `POST /api/medications`
- `GET /api/medications/elder/:elderUserId`
- `POST /api/family-bindings`
- `GET /api/family-bindings/elder/:elderUserId`
- `GET /api/reports/elder/:elderUserId`

---

## 二、推荐 Demo 演示路径（当前版本）

建议后续演示按这个顺序走：

### Step 1：老人建档
页面：
- `/elder/profile`

演示重点：
- 支持填写档案信息
- `userId` 可留空
- 留空时系统自动创建 elder 用户并完成建档
- 成功后页面会回填生成的 `userId`

建议记录：
- 演示时保留生成出来的 `elder userId`
- 后续任务、指标、用药、家属绑定都可复用这个 ID

---

### Step 2：老人首页查看今日任务
页面：
- `/elder/home`

演示重点：
- 可查看今日任务列表
- 可直接标记任务完成
- 若未配置默认 elder userId，则可用 mock 数据演示
- 若已配置默认 elder userId，则可走真实 API 数据

---

### Step 3：健康指标录入
页面：
- `/elder/metrics`

演示重点：
- 支持录入血压 / 血糖 / 体重
- 同页查看最近指标记录
- 表单与列表已在一个页面中串起来

---

### Step 4：用药提醒配置
页面：
- `/elder/medication`

演示重点：
- 新增提醒
- 查看提醒列表
- 能展示提醒时间、重复规则、启用状态

---

### Step 5：家属绑定
页面：
- `/family/bind`

演示重点：
- 支持提交绑定申请
- 支持查看当前绑定列表
- 当前是第一页版，偏“申请 + 查看”

---

### Step 6：家属摘要页
页面：
- `/family/dashboard`

演示重点：
- 聚合任务摘要
- 聚合指标摘要
- 聚合用药提醒摘要
- 体现家属侧“快速了解老人近况”的价值

---

### Step 7：家属周报
页面：
- `/family/report`

演示重点：
- 查看近期周报
- 查看完成率
- 查看建议摘要

---

## 三、建议默认联调数据

### 1. 推荐环境变量
根目录 `.env` 至少建议有：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=<某个已存在的 elder userId>
```

### 2. 推荐做法
- 先在 `/elder/profile` 页面成功建一个老人档案；
- 拿到返回的 `userId`；
- 把它写入：
  - `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`
- 然后再访问：
  - `/elder/home`
  - `/elder/metrics`
  - `/elder/medication`
  - `/family/dashboard`
  - `/family/report`
  - `/family/bind`

这样大多数页面都能走真实 API，而不是 mock 回退。

---

## 四、联调检查清单

### A. 基础环境检查
- [ ] `pnpm install` 已完成
- [ ] `pnpm prisma:generate` 已完成
- [ ] PostgreSQL 本地可访问
- [ ] `.env` 已配置
- [ ] `apps/api/.env` 已配置
- [ ] `pnpm dev:api` 可启动
- [ ] `pnpm dev:web` 可启动
- [ ] `GET /api/health` 返回正常

### B. 建档链路检查
- [ ] `/elder/profile` 页面可访问
- [ ] 留空 `userId` 时可自动创建 elder 用户
- [ ] 已有 `userId` 时可加载档案
- [ ] 提交非法年龄/手机号时前端可提示
- [ ] 后端可拦截非法参数

### C. 任务链路检查
- [ ] `/elder/home` 页面可访问
- [ ] 有默认 elder userId 时能拉真实任务
- [ ] 无默认 elder userId 时可回退 mock
- [ ] 点击“标记完成”后状态变化正确
- [ ] API 模式下 `PATCH /api/tasks/:taskId/complete` 正常

### D. 指标链路检查
- [ ] `/elder/metrics` 页面可访问
- [ ] 可录入血压
- [ ] 可录入血糖
- [ ] 可录入体重
- [ ] 录入后接口返回正常
- [ ] 最近记录可查看

### E. 用药提醒链路检查
- [ ] `/elder/medication` 页面可访问
- [ ] 可新增提醒
- [ ] 提醒列表可查看
- [ ] 时间格式非法时前端/后端可拦截

### F. 家属侧检查
- [ ] `/family/dashboard` 页面可访问
- [ ] 任务/指标/用药摘要能显示
- [ ] `/family/report` 页面可访问
- [ ] 周报列表可显示
- [ ] `/family/bind` 页面可访问
- [ ] 可提交绑定申请
- [ ] 绑定列表可显示

---

## 五、当前已知限制

### 1. 数据库联调还没有完全打实
虽然页面和接口已经大量具备，但当前仍需补：
- migration 实际执行
- 更系统的本地数据库初始化
- 默认测试数据准备

### 2. 很多页面仍是“第一版”
例如：
- `family/bind` 还没有确认流转
- `family/report` 还没有趋势图
- `elder/medication` 还没有编辑/停用
- `elder/home` 还没有跳过/过期等状态细化

### 3. Demo 路径目前更适合“受控演示”
最适合的演示方式是：
- 先准备一个 elder userId
- 再按页面顺序展示
- 必要时允许 mock 回退兜底

---

## 六、下一阶段建议（联调收口）

建议下一阶段不要再优先铺新页面，而是做这些：

1. **准备一套默认联调数据**
   - elder user
   - 若干 task
   - 若干 metric
   - 若干 medication reminder
   - 若干 family binding / weekly report

2. **做一次端到端联调验证**
   - 从建档开始
   - 到任务/指标/用药
   - 到家属摘要/周报/绑定

3. **收口体验明显不合理的点**
   - 默认 userId 依赖方式
   - mock / real 模式提示文案
   - 提交后页面刷新策略
   - 列表状态同步

4. **整理演示脚本**
   - 哪个页面先演示
   - 哪个页面用真实数据
   - 哪个页面允许 mock 兜底

---

## 七、一句话结论

当前项目已经不是“只有骨架”，而是：

> **一个老人端 + 家属端主路径基本成型、可继续联调收口的 Web/H5 MVP。**
