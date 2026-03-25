# Silver Health Seed 脚本设计说明

> 目的：
> - 不直接贸然写脚本，而是先把脚本应该做什么、怎么做、输出什么说明清楚；
> - 方便后续真正落 `seed-demo-data.ts` 时减少返工。

---

## 一、脚本目标

后续建议新增脚本（暂定）：

- `scripts/seed-demo-data.ts`

目标：
- 一次执行，生成一套最小但完整的 demo / 联调数据；
- 输出关键 ID（尤其是 `elderUserId` / `familyUserId`）；
- 提示如何写入 `.env`；
- 尽量可重复执行（至少做到幂等或近似幂等）。

---

## 二、脚本建议生成的数据对象

建议脚本至少覆盖：

1. elder user
2. family user
3. elder profile
4. family binding
5. daily tasks
6. health metrics
7. medication reminders
8. weekly reports

这套对象已经足以覆盖当前大多数页面。

---

## 三、脚本推荐执行顺序

脚本内部建议按以下顺序处理：

1. 创建或查找 elder user
2. 创建或查找 family user
3. upsert elder profile
4. upsert family binding
5. 批量插入/重建 today tasks
6. 批量插入指标记录
7. 批量插入用药提醒
8. 批量插入周报

原因：
- 依赖关系清晰；
- 出错时更容易定位；
- 脚本日志更易读。

---

## 四、脚本建议输入

### 最简输入
脚本最开始可以不接太多参数，只支持：
- 默认数据库连接（从 `.env` 读取）

### 可选输入（后续增强）
未来可以考虑支持：
- `--reset`：重建 demo 数据
- `--elder-mobile=...`
- `--family-mobile=...`
- `--json`：输出 JSON 格式结果

当前第一版不建议一开始就做太复杂。

---

## 五、脚本建议输出

脚本执行完成后，至少建议输出：

```text
Demo data ready.
Elder user id: xxx
Family user id: yyy
Recommended NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=xxx
```

如果可以，顺手再输出：
- 任务数
- 指标数
- 提醒数
- 绑定数
- 周报数

这样后续调试更直观。

---

## 六、脚本实现建议

### 推荐技术
- Node.js + TypeScript
- 直接复用 Prisma Client

### 推荐位置
- `scripts/seed-demo-data.ts`

### 推荐执行方式
根级 package.json 后续可考虑增加：

```json
{
  "scripts": {
    "seed:demo": "ts-node scripts/seed-demo-data.ts"
  }
}
```

或更稳一些：

```json
{
  "scripts": {
    "seed:demo": "tsx scripts/seed-demo-data.ts"
  }
}
```

如果后续选择 `tsx`，则需补对应依赖。

---

## 七、幂等性建议

第一版脚本建议至少满足“近似幂等”：

### 可接受做法
- 用户：按 mobile 或固定标识查找，没有再创建
- profile：用 `upsert`
- binding：按 `(elderUserId, familyUserId)` 查找/复用
- tasks / metrics / reminders / reports：
  - 可以先删掉某个 demo 标识范围内的数据，再重建
  - 或者通过固定标题/时间范围约束后 upsert/跳过

### 不建议
- 每次执行无限制插入重复 demo 数据

否则数据库会很快变脏，影响联调判断。

---

## 八、脚本里建议固定的 demo 风格

为了让演示统一，建议脚本用固定人设：

### Elder
- 昵称：`李阿姨`
- 年龄：68
- 慢病：高血压、糖耐量异常

### Family
- 昵称：`小李`
- 关系：`daughter`

### Tasks
- 散步
- 测血压
- 服药
- 饮食控制

### Metrics
- 血压 1 条
- 血糖 1 条
- 体重 1 条

### Medication
- 氨氯地平
- 二甲双胍

### Reports
- 近两周 2 份

这样后续页面和文档可以保持一致。

---

## 九、当前建议

当前阶段最合理的是：

1. 先按 `integration-data-rollout-plan.md` 手工跑一轮真实数据
2. 验证这些字段和页面联动是否合理
3. 再正式写 `scripts/seed-demo-data.ts`

原因：
- 现在功能还在快速收口；
- 先手工验证一轮，能避免把错误模型固化到脚本里。

---

## 十、一句话结论

当前最好的做法不是马上盲写脚本，而是：

> **先用文档把脚本目标、数据范围、执行顺序、输出和幂等策略设计清楚；等真实联调数据验证一轮后，再正式落地 `seed-demo-data.ts`。**
