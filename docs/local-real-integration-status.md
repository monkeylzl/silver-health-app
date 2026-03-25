# Silver Health 本地真实联调状态说明

> 这份文档用于明确：
> - 当前本地真实联调已经跑到哪一步；
> - 短期与长期数据库方案分别是什么；
> - 如果后续继续联调，应该怎么接着跑。

---

## 一、当前结论

当前项目已经完成：

- 本机 PostgreSQL 安装与启动
- `silver_health` 数据库创建
- Prisma migration 成功
- `pnpm seed:demo` 成功
- 多个关键页面已切换到真实 API 模式

也就是说：

> **本地真实联调环境已经基本跑通。**

---

## 二、数据库策略（已确认）

### 短期方案
当前用于本地测试/联调的方案是：

- **方案 1：本机 PostgreSQL**

这是为了尽快把项目测试跑通。

### 长期方案
当前已确认的正式方向是：

- **方案 3：远程数据库**

也就是说：
- 本机数据库用于当前开发联调；
- 后续项目正式环境/长期方案仍切到远程数据库。

---

## 三、当前本地数据库关键事实

### 1. 当前数据库名
- `silver_health`

### 2. 当前本机 PostgreSQL 连接方式
当前这台机器本地 PostgreSQL 应使用系统用户：
- `liuzhongliang`

而不是 `.env.example` 里最初那种：
- `postgres:postgres@localhost`

### 3. 当前本地可用连接串
本地联调时，当前可用写法是：

```env
DATABASE_URL="postgresql://liuzhongliang@localhost:5432/silver_health"
```

---

## 四、当前关键前端环境配置

在当前 monorepo 结构下，`apps/web` 需要单独环境文件。

当前已确认可用的文件：
- `apps/web/.env.local`

建议内容：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=cmn5zm37f0000ijdo5tp2h0e0
```

说明：
- 这个 `elder id` 来自已成功执行的 seed 数据；
- 如果不在 `apps/web/.env.local` 里显式提供，Next.js 当前不会稳定读取到根目录 `.env` 中的这两个前端变量。

---

## 五、当前已验证通过的关键命令

### 1. 启动 API
```bash
pnpm dev:api
```

### 2. 启动 Web
```bash
pnpm dev:web
```

### 3. 生成 Prisma Client
```bash
pnpm prisma:generate
```

### 4. 执行 demo seed
```bash
pnpm seed:demo
```

---

## 六、当前已验证能走真实 API 的页面

### 老人侧
- `/elder/home`
- `/elder/metrics`
- `/elder/medication`

### 家属侧
- `/family/dashboard`
- `/family/report`
- `/family/bind`

### 其他已验证真实接口
- `/api/profile/elder/:elderUserId`
- `/api/tasks/elder/:elderUserId`
- `/api/metrics/elder/:elderUserId`
- `/api/medications/elder/:elderUserId`
- `/api/reports/elder/:elderUserId`
- `/api/family-bindings/elder/:elderUserId`

---

## 七、当前 demo 数据结果

当前一次成功 seed 后生成的关键 ID：

- Elder user id:
  - `cmn5zm37f0000ijdo5tp2h0e0`

- Family user id:
  - `cmn5zm37o0001ijdotbuh35vn`

同时已生成：
- 4 条 task
- 3 条 metric
- 2 条 medication reminder
- 2 条 weekly report
- 1 条 active family binding

---

## 八、如果后续要继续本地联调

建议按这个顺序：

1. 确认 PostgreSQL 服务正常
2. 确认根 `.env` 中 `DATABASE_URL` 正确
3. 确认 `apps/web/.env.local` 中前端变量正确
4. 启动 API
5. 启动 Web
6. 如需重置演示数据，执行：
   - `pnpm seed:demo`

---

## 九、当前阶段最适合做什么

当前不建议继续优先补大量新页面。

更适合做的是：

1. 第一轮体验收口
2. 页面真实模式下的交互优化
3. demo 路径整理
4. 本地联调文档补全
5. 为后续远程数据库迁移保留清晰边界

---

## 十、一句话结论

当前项目已经达到：

> **短期本机 PostgreSQL 联调可用，长期远程数据库方向明确，本地真实 API 页面联调已基本跑通。**
