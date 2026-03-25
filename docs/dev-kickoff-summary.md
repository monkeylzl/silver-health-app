# Silver Health 开发启动摘要

## 我已读取的开发相关文档

- 开发可交付版 PRD V2
- 接口定义文档 V1
- 数据库设计文档 V1
- 技术栈建议 V1
- 前后端项目初始化方案 V1
- 开发启动说明 README

## 与代码落地直接相关的关键约束

### MVP 范围
必须优先覆盖：
- 老人建档
- 今日任务首页
- 运动任务完成
- 指标录入（血压/血糖/体重）
- 用药提醒基础版
- 家属绑定
- 家属首页摘要
- 周报基础版

### 明确不做
- 在线问诊
- AI 教练
- 硬件深度接入
- 支付会员
- 社区社交
- 复杂多角色协作

### 架构约束
- 使用 monorepo
- Web 先做老人端 + 家属端
- 后端使用 NestJS
- 数据库使用 PostgreSQL
- ORM 使用 Prisma
- 以稳定、简单、可联调为优先

## 第一阶段建议目标

### 工程目标
- 前端能启动
- 后端能启动
- PostgreSQL 能连接
- Prisma migration 能执行
- 建档接口可联调

### 实现优先级
1. monorepo 基础配置
2. NestJS API 初始化
3. Prisma schema 初版
4. Next.js Web 初始化
5. Elder Profile 建档接口
6. Elder Profile 建档页

## Prisma 首批模型建议
- User
- ElderProfile
- FamilyBinding
- DailyTask
- HealthMetric
- MedicationReminder
- WeeklyReport

## API P0
- `POST /api/profile/elder`
- `GET /api/profile/elder/:userId`
- `POST /api/binding`
- `GET /api/tasks/today`
- `POST /api/tasks/:taskId/complete`
- `POST /api/metrics`
- `GET /api/family/dashboard`
- `GET /api/reports/weekly/latest`
