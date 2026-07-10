# Silver Health PWA Branch Integration

本文档记录第一阶段 PWA 可上线版的分支整理状态。

## Current Integration State

- 主分支：`main`
- 合并提交：`408fe68`
- 原集成分支：`feature/pwa-launch-release-candidate`
- 基准分支：`main`
- 当前集成头：已合入 `main`
- 整理起点：`5e2362b`（`feature/local-write-binding-e2e`）
- GitHub compare：`main...feature/local-write-binding-e2e`
- 状态：相对 `main` ahead 13、behind 0。
- PR：[#1 Prepare Silver Health PWA launch candidate](https://github.com/monkeylzl/silver-health-app/pull/1)（merged）
- GitHub Actions：`Silver Health release gates` run `29096789384` 已通过。
- 合并后线上 smoke：`corepack pnpm smoke:production` 17 项通过。

## Included Branch Stack

这些分支是线性叠加关系，越靠下越新，最新集成分支已包含全部内容：

1. `feature/mobile-first`
2. `feature/pwa-launch-ready`
3. `feature/production-smoke-gates`
4. `feature/demo-reset-command`
5. `feature/vercel-prebuilt-deploy-script`
6. `feature/mobile-e2e-interactions`
7. `feature/manual-release-workflow`
8. `feature/local-write-e2e`
9. `feature/local-write-medication-e2e`
10. `feature/local-write-binding-e2e`
11. `feature/pwa-launch-release-candidate`

## What The Integration Branch Contains

- Mobile-first PWA shell with bottom tabs.
- PWA manifest, icons, service worker, offline page, install prompt.
- Railway API deployment config and Vercel prebuilt deployment script.
- Production smoke check for Web/API/PWA/CORS.
- Controlled demo reset command.
- GitHub Actions release gate with automatic PR runs and manual dispatch support.
- Playwright mobile read-only E2E.
- Local write E2E covering:
  - completing a task;
  - recording blood pressure;
  - creating a medication reminder;
  - submitting a family binding request;
  - updating the elder profile and confirming the My page reflects nickname and mobile changes;
  - generating the current weekly report from the latest tasks, metrics, and medication reminders;
  - verifying family dashboard sync.
- Fixes discovered by E2E:
  - metric form default measured time now uses client local datetime;
  - repeated family binding submit uses upsert instead of unique-constraint failure.
  - elder profile save now also updates the linked user nickname and mobile number.
  - local write E2E now uses a unique mobile number per run so repeated demo resets do not collide with old user records.

## Recommended Merge Path

Use `feature/pwa-launch-release-candidate` as the single PR source branch into `main`.

The older feature branches were kept for traceability until the release-candidate PR merged. After merge and smoke verification, they can be deleted from GitHub if no active review references them.

## Pre-PR Verification

已在 `feature/pwa-launch-release-candidate` 上完成本地与线上冒烟验证：

```bash
corepack pnpm test:e2e:local-write
corepack pnpm test:e2e:mobile
corepack pnpm test:local-e2e-utils
corepack pnpm test:github-workflow
corepack pnpm test:demo-reset-utils
corepack pnpm test:report-generation-utils
corepack pnpm test:smoke-utils
corepack pnpm test:vercel-deploy-utils
corepack pnpm --filter @silver-health/web build
corepack pnpm --filter @silver-health/web typecheck
corepack pnpm --filter @silver-health/api build
corepack pnpm smoke:production
```

Verification result:

- `test:e2e:local-write`：1 个移动端写入型 E2E 通过，覆盖任务完成、指标录入、用药提醒、家属绑定、档案编辑、我的页同步、家属看板同步和本周周报生成。
- `test:e2e:mobile`：4 个移动端只读 E2E 通过，覆盖 390x844 与 360x800 视口、四个底部 Tab 和移动布局。
- `test:local-e2e-utils`：3 个测试通过。
- `test:github-workflow`：1 个测试通过。
- `test:demo-reset-utils`：5 个测试通过。
- `test:report-generation-utils`：3 个测试通过。
- `test:smoke-utils`：4 个测试通过。
- `test:vercel-deploy-utils`：3 个测试通过。
- Web typecheck：通过。
- Web production build：通过。
- API build：通过。
- `smoke:production`：17 项线上检查通过，覆盖 Vercel Web、Railway API、PWA 资源、真实 API 内容、健康检查、任务/指标/用药/周报数据和 CORS。

Current note: Node TS script `MODULE_TYPELESS_PACKAGE_JSON` warnings have been cleaned up for root scripts and report-generation unit tests. Keep Web build and Web typecheck sequential because Next.js `.next/types` is generated during build.
