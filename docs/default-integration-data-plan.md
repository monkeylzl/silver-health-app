# Silver Health 默认联调数据方案

> 目的：
> - 为第一轮真实联调准备一套**最小可演示数据集**；
> - 明确哪些数据对象必须先有，哪些页面才能走真实 API；
> - 避免每次联调都靠临时手工造数据。

---

## 一、总体目标

希望准备一套最小但完整的数据，让以下页面都能尽量走真实 API：

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

## 二、建议的最小数据集

### 1. 用户
至少准备 2 个用户：

#### A. 老人用户（elder）
用途：
- 档案主体
- 任务归属主体
- 指标归属主体
- 用药提醒归属主体
- 周报归属主体

建议字段：
- `id` → 后续作为 `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`
- `role = elder`
- `nickname`
- `mobile`（可选）
- `status = active`

#### B. 家属用户（family）
用途：
- 家属绑定演示
- 家属录入指标演示（可选）

建议字段：
- `id`
- `role = family`
- `nickname`
- `mobile`（可选）
- `status = active`

---

### 2. 老人档案（elder profile）
至少准备 1 条：
- 关联到 elder 用户

建议字段：
- `name`
- `gender`
- `age`
- `heightCm`
- `weightKg`
- `chronicConditions`
- `commonMedicines`
- `mobilityLevel`
- `helperMode`

用途：
- `/elder/profile` 真实加载
- 作为 demo 起点

---

### 3. 今日任务（daily tasks）
至少准备 3~5 条，且状态要有区分：

建议组合：
- 1 条 `exercise`
- 1 条 `measurement`
- 1 条 `medication`
- 至少 1 条 `todo`
- 至少 1 条 `done`

建议字段：
- `elderUserId`
- `taskDate = 今天`
- `taskType`
- `title`
- `description`
- `priority`
- `status`
- `sourceType`
- `dueTime`

用途：
- `/elder/home`
- `/family/dashboard`

---

### 4. 健康指标（health metrics）
至少准备 3 条：
- 1 条血压
- 1 条血糖
- 1 条体重

建议字段：
- `elderUserId`
- `metricType`
- `createdByRole`
- `createdByUserId`
- `measuredAt`
- 对应数值字段

用途：
- `/elder/metrics`
- `/family/dashboard`

---

### 5. 用药提醒（medication reminders）
至少准备 2 条：
- 1 条早晨
- 1 条晚间

建议字段：
- `elderUserId`
- `medicineName`
- `dosageText`
- `remindTime`
- `repeatRule`
- `enabled`

用途：
- `/elder/medication`
- `/family/dashboard`

---

### 6. 家属绑定（family bindings）
至少准备 1 条：
- elder 用户和 family 用户之间的绑定

建议字段：
- `elderUserId`
- `familyUserId`
- `relationType`
- `status`

建议状态：
- 最少 1 条 `active`
- 如果要演示待确认流程，可额外加 1 条 `pending`

用途：
- `/family/bind`

---

### 7. 周报（weekly reports）
至少准备 1~2 条：

建议字段：
- `elderUserId`
- `weekStartDate`
- `weekEndDate`
- `exerciseCompletionRate`
- `medicationCompletionRate`
- `metricRecordCount`
- `summaryText`
- `suggestionList`

用途：
- `/family/report`

---

## 三、推荐生成顺序

建议后续真实造数据时，按这个顺序来：

1. 创建 elder 用户
2. 创建 family 用户
3. 创建 elder profile
4. 创建 family binding
5. 创建 today tasks
6. 创建 health metrics
7. 创建 medication reminders
8. 创建 weekly reports

原因：
- 这样依赖关系最清晰；
- 各页面也能逐步从空状态进入可演示状态。

---

## 四、推荐联调配置

在获得 elder 用户 ID 后，建议写入根 `.env`：

```env
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=<elder-user-id>
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

这样这些页面默认就会直接走真实 API：
- `/elder/home`
- `/elder/metrics`
- `/elder/medication`
- `/family/dashboard`
- `/family/report`
- `/family/bind`

---

## 五、当前建议的数据落地方式

当前最稳的方式有两个：

### 方案 A：先手工通过已有页面/接口造一轮
适合马上继续推进，不必先写完整 seed 脚本。

可行路径：
- 先在 `/elder/profile` 创建 elder 用户和档案
- 再通过 API 或后续页面造 task / metric / medication / binding / report

### 方案 B：后续补一个 seed 脚本
适合准备 demo 或频繁重建本地环境时使用。

建议后续新增：
- `scripts/seed-demo-data.ts`

目标：
- 一次执行，自动造出完整 demo 数据
- 输出 elder userId / family userId
- 自动提示如何写入 `.env`

---

## 六、当前阶段建议

建议下一步优先做：

1. 先按本方案整理出一套真实默认数据
2. 让页面尽量走真实 API
3. 再开始做端到端联调验证
4. 如果联调频率高，再补 seed 脚本自动化

---

## 七、一句话结论

默认联调数据最少应包含：

> **1 个 elder、1 个 family、1 个 profile、若干 task、若干 metric、若干 medication reminder、至少 1 条 family binding、至少 1~2 条 weekly report。**

有了这套最小数据集，当前项目的大多数核心页面都可以进入真实联调状态。
