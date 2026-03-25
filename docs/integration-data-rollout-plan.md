# Silver Health 联调数据落地方案

> 目的：
> - 回答“联调数据接下来到底怎么落”；
> - 把前面 `default-integration-data-plan.md` 和 `integration-data-spec.md` 中的规划，转成可执行步骤；
> - 作为真正开始准备默认联调数据前的实施说明。

---

## 一、目标

目标不是一次性做很复杂的数据平台，而是：

> **用最小成本准备一套可重复使用的真实联调数据，让主要页面尽量走真实 API。**

当前优先覆盖页面：

### 老人侧
- `/elder/profile`
- `/elder/home`
- `/elder/metrics`
- `/elder/medication`

### 家属侧
- `/family/dashboard`
- `/family/report`
- `/family/bind`

---

## 二、推荐落地策略

建议采用“两阶段”策略。

### 阶段 A：先落一套手工可控的默认联调数据
目标：
- 尽快拿到第一套真实可用数据；
- 验证当前模型和页面假设是否合理；
- 暂时不急着引入脚本复杂度。

特点：
- 最快
- 最容易边做边修
- 适合当前这个阶段

### 阶段 B：等第一套数据验证稳定后，再沉淀为 seed 脚本
目标：
- 避免每次重建环境都手工造数据；
- 让 demo / 联调环境可以重复初始化。

特点：
- 复用性更高
- 更适合频繁演示、多人协作或重置数据库

---

## 三、阶段 A 的推荐执行顺序

### Step 1：先通过 `elder/profile` 造出主 elder 用户和档案
原因：
- 这是当前最完整、最稳的一条入口；
- 提交成功后可以直接获得 `elder userId`；
- 后面所有数据都围绕它展开。

产出：
- `elderUserId`
- 一条真实 `elderProfile`

### Step 2：把 `elderUserId` 写入本地 `.env`
建议写入：

```env
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=<elder-user-id>
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

效果：
- 大多数页面会优先走真实 API，而不再回退 mock。

### Step 3：准备 1 个 family 用户
当前可通过已有 `users` 接口或后续手工方式造：
- `role = family`
- 保留 `familyUserId`

### Step 4：补 family binding
用途：
- 让 `/family/bind` 有真实数据；
- 建立 elder / family 的联调关系。

### Step 5：补 today tasks
用途：
- 让 `/elder/home` 与 `/family/dashboard` 都能真实显示任务数据；
- 测试“标记完成任务”。

### Step 6：补 health metrics
用途：
- 让 `/elder/metrics` 与 `/family/dashboard` 走真实数据；
- 测试指标录入与摘要显示。

### Step 7：补 medication reminders
用途：
- 让 `/elder/medication` 与 `/family/dashboard` 走真实数据。

### Step 8：补 weekly reports
用途：
- 让 `/family/report` 能走真实数据。

---

## 四、建议的真实联调最小交付结果

如果这轮落地顺利，至少应达到：

- [ ] `/elder/profile` 真实档案可加载
- [ ] `/elder/home` 真实任务可显示与完成
- [ ] `/elder/metrics` 真实指标可录入与显示
- [ ] `/elder/medication` 真实提醒可新增与显示
- [ ] `/family/dashboard` 真实摘要可显示
- [ ] `/family/report` 真实周报可显示
- [ ] `/family/bind` 真实绑定可显示

---

## 五、当前建议的实施方式

### 方案 1：先手工落一轮数据
最适合当前阶段。

推荐做法：
1. 先通过页面创建 elder/profile
2. 再通过接口逐类补数据
3. 一边补一边打开对应页面验证
4. 记录发现的问题

优点：
- 快
- 可控
- 适合当前需求频繁变化阶段

缺点：
- 可重复性一般
- 重建环境仍需重复操作

### 方案 2：直接写 seed 脚本
更适合：
- 数据结构已经稳定；
- 需要频繁重建环境；
- 需要经常演示。

当前不建议一开始就依赖它作为唯一方案，原因是：
- 现在仍在快速迭代页面和接口；
- 边界细节还在收口；
- 太早写死脚本，后面维护成本会偏高。

---

## 六、建议的联调执行顺序（页面视角）

后续真实联调建议按这个顺序跑：

1. `/elder/profile`
2. `/elder/home`
3. `/elder/metrics`
4. `/elder/medication`
5. `/family/bind`
6. `/family/dashboard`
7. `/family/report`

原因：
- 从数据源头往外扩；
- 先老人侧，再家属侧；
- 依赖关系最清楚。

---

## 七、这份方案的结论

当前最合理的落地方式不是立刻把所有东西自动化，而是：

> **先做一轮手工可控的真实联调数据，把页面和接口真实跑通；等结构稳定后，再沉淀成 seed 脚本。**
