# Silver Health 联调数据明细规范

> 这份文档比 `default-integration-data-plan.md` 更细。
>
> 如果前一份文档回答的是“要准备哪些类型的数据”，这份文档回答的是：
>
> **这些数据具体应该长什么样、建议填什么、分别给哪些页面用。**

---

## 一、联调目标

希望准备一套**可直接支撑演示和页面联调**的最小真实数据，使以下页面尽量走真实 API：

### 老人侧页面
- `/elder/profile`
- `/elder/home`
- `/elder/metrics`
- `/elder/medication`

### 家属侧页面
- `/family/dashboard`
- `/family/report`
- `/family/bind`

---

## 二、推荐主角数据（建议统一一套）

建议整套联调围绕这两个“主角”展开：

### 1. 老人用户（主数据主体）
建议示例：

- `role`: `elder`
- `nickname`: `李阿姨`
- `mobile`: `13800138001`
- `status`: `active`

说明：
- 这个用户是整套联调的核心 ID；
- 后续档案、任务、指标、用药提醒、周报都围绕这个 elder 用户展开；
- 这个用户的 `id` 最终建议写进：
  - `NEXT_PUBLIC_DEFAULT_ELDER_USER_ID`

---

### 2. 家属用户（绑定与家属侧演示主体）
建议示例：

- `role`: `family`
- `nickname`: `小李`
- `mobile`: `13800138002`
- `status`: `active`

说明：
- 用于家属绑定；
- 也可以作为部分指标的 `createdByUserId`，演示“家属代录”。

---

## 三、各模块联调数据明细

---

### A. Elder Profile（老人档案）

#### 目的
支撑页面：
- `/elder/profile`

#### 推荐示例数据
```json
{
  "name": "李阿姨",
  "gender": "female",
  "age": 68,
  "heightCm": 158,
  "weightKg": 61,
  "chronicConditions": ["高血压", "糖耐量异常"],
  "commonMedicines": ["氨氯地平", "二甲双胍"],
  "mobilityLevel": "medium",
  "helperMode": "family_assisted"
}
```

#### 页面用途
- 展示真实档案回填；
- 作为整个 demo 的起点；
- 后续很多数据都默认可以围绕这位老人展开。

---

### B. Daily Tasks（今日任务）

#### 目的
支撑页面：
- `/elder/home`
- `/family/dashboard`

#### 建议最少准备 4 条

##### 任务 1：晨间散步
```json
{
  "taskType": "exercise",
  "title": "晨间散步 20 分钟",
  "description": "建议饭后半小时进行，保持舒缓节奏。",
  "priority": "high",
  "status": "todo",
  "sourceType": "system_generated",
  "dueTime": "08:30"
}
```

##### 任务 2：记录今日血压
```json
{
  "taskType": "measurement",
  "title": "记录今日血压",
  "description": "早餐后静坐 5 分钟再测量。",
  "priority": "high",
  "status": "todo",
  "sourceType": "system_generated",
  "dueTime": "09:00"
}
```

##### 任务 3：午间服药
```json
{
  "taskType": "medication",
  "title": "午间服药提醒",
  "description": "按常规剂量服用。",
  "priority": "medium",
  "status": "done",
  "sourceType": "manual_config",
  "dueTime": "12:00"
}
```

##### 任务 4：清淡饮食
```json
{
  "taskType": "diet",
  "title": "晚餐控制盐分摄入",
  "description": "避免重油重盐，适量多蔬菜。",
  "priority": "medium",
  "status": "todo",
  "sourceType": "manual_config",
  "dueTime": "18:30"
}
```

#### 页面用途
- `elder/home`：展示任务列表、统计待完成/已完成数量、测试完成任务接口；
- `family/dashboard`：展示家属侧任务摘要。

---

### C. Health Metrics（健康指标）

#### 目的
支撑页面：
- `/elder/metrics`
- `/family/dashboard`

#### 建议最少准备 3 条

##### 指标 1：血压
```json
{
  "metricType": "blood_pressure",
  "systolic": 128,
  "diastolic": 78,
  "pulse": 72,
  "createdByRole": "elder",
  "measuredAt": "2026-03-25T08:30:00.000Z"
}
```

##### 指标 2：血糖
```json
{
  "metricType": "blood_glucose",
  "glucoseValue": 6.2,
  "glucosePeriodType": "after_breakfast",
  "createdByRole": "family",
  "measuredAt": "2026-03-24T23:30:00.000Z"
}
```

##### 指标 3：体重
```json
{
  "metricType": "weight",
  "weightKg": 61.5,
  "createdByRole": "elder",
  "measuredAt": "2026-03-23T23:30:00.000Z"
}
```

#### 页面用途
- `elder/metrics`：展示最近记录，验证录入后列表逻辑；
- `family/dashboard`：展示家属侧最近指标摘要。

---

### D. Medication Reminders（用药提醒）

#### 目的
支撑页面：
- `/elder/medication`
- `/family/dashboard`

#### 建议最少准备 2 条

##### 提醒 1
```json
{
  "medicineName": "氨氯地平",
  "dosageText": "每日早晨 1 片",
  "remindTime": "08:00",
  "repeatRule": "daily",
  "enabled": true
}
```

##### 提醒 2
```json
{
  "medicineName": "二甲双胍",
  "dosageText": "每日晚餐后 1 片",
  "remindTime": "18:30",
  "repeatRule": "daily",
  "enabled": true
}
```

#### 页面用途
- `elder/medication`：提醒列表展示、新增提醒验证；
- `family/dashboard`：启用中的提醒数量与摘要展示。

---

### E. Family Binding（家属绑定）

#### 目的
支撑页面：
- `/family/bind`

#### 建议最少准备 1~2 条

##### 绑定 1：已绑定
```json
{
  "relationType": "daughter",
  "status": "active"
}
```

##### 绑定 2：待确认（可选）
```json
{
  "relationType": "son",
  "status": "pending"
}
```

#### 页面用途
- 演示当前已绑定的家属；
- 演示 pending / active 状态差异；
- 为后续确认流转提供起点。

---

### F. Weekly Reports（周报）

#### 目的
支撑页面：
- `/family/report`

#### 建议最少准备 2 条

##### 周报 1
```json
{
  "weekStartDate": "2026-03-18T00:00:00.000Z",
  "weekEndDate": "2026-03-24T00:00:00.000Z",
  "exerciseCompletionRate": 82,
  "medicationCompletionRate": 95,
  "metricRecordCount": 6,
  "summaryText": "本周任务总体完成较好，血压记录稳定，用药依从性较高。",
  "suggestionList": ["继续保持晨间散步", "关注晚餐后血糖记录"]
}
```

##### 周报 2
```json
{
  "weekStartDate": "2026-03-11T00:00:00.000Z",
  "weekEndDate": "2026-03-17T00:00:00.000Z",
  "exerciseCompletionRate": 70,
  "medicationCompletionRate": 88,
  "metricRecordCount": 5,
  "summaryText": "运动执行略有波动，但整体健康记录习惯在改善。",
  "suggestionList": ["增加午后轻活动", "补齐周末体重记录"]
}
```

#### 页面用途
- `family/report`：展示时间范围、完成率、摘要、建议。

---

## 四、页面与数据对象映射表

| 页面 | 依赖的真实数据 |
|---|---|
| `/elder/profile` | elder user + elder profile |
| `/elder/home` | today tasks |
| `/elder/metrics` | metrics |
| `/elder/medication` | medication reminders |
| `/family/dashboard` | tasks + metrics + medication reminders |
| `/family/report` | weekly reports |
| `/family/bind` | family bindings + family user |

---

## 五、推荐的实际准备步骤

建议后续真实联调按这个顺序落数据：

1. 先创建 elder 用户
2. 再创建 family 用户
3. 建立 elder profile
4. 建立 family binding
5. 补 today tasks
6. 补 health metrics
7. 补 medication reminders
8. 补 weekly reports

这样原因最简单：
- 依赖关系清楚；
- 可以边造数据边验证页面；
- 每造完一类数据，都能马上打开对应页面验收。

---

## 六、当前最建议的落地方式

### 方案 A：先手工准备一轮真实数据
适合当前阶段，最直接。

推荐方式：
- 用现有页面先创建 elder profile；
- 再按接口补 tasks / metrics / medications / family-bindings / reports；
- 把 elder userId 固定到 `.env`。

### 方案 B：后续补 seed 脚本
适合进入反复 demo 或重建环境阶段。

建议后续新增：
- `scripts/seed-demo-data.ts`

目标：
- 一次执行生成一整套 demo 数据；
- 自动打印 elder/family userId；
- 自动提示如何写入环境变量。

---

## 七、当前结论

如果要让当前大多数页面真正走真实 API，而不是 mock，最少需要准备：

> **一套“1 个 elder + 1 个 family + 1 个 profile + 若干 task + 若干 metric + 若干 medication reminder + 至少 1 条 binding + 至少 1~2 条 report”的联调数据。**

这套数据一旦准备好，当前项目就可以进入更真实的端到端演示状态。
