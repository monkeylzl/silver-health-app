# Silver Health PWA Branch Integration

本文档记录第一阶段 PWA 可上线版的分支整理状态。

## Current Integration Branch

- 集成分支：`feature/pwa-launch-release-candidate`
- 基准分支：`main`
- 当前集成头：`5e2362b`
- GitHub compare：`main...feature/local-write-binding-e2e`
- 状态：相对 `main` ahead 13、behind 0。

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
- GitHub Actions manual release gate.
- Playwright mobile read-only E2E.
- Local write E2E covering:
  - completing a task;
  - recording blood pressure;
  - creating a medication reminder;
  - submitting a family binding request;
  - verifying family dashboard sync.
- Fixes discovered by E2E:
  - metric form default measured time now uses client local datetime;
  - repeated family binding submit uses upsert instead of unique-constraint failure.

## Recommended Merge Path

Use `feature/pwa-launch-release-candidate` as the single PR source branch into `main`.

Keep the older feature branches for traceability until the release-candidate PR is merged. After merge, they can be deleted from GitHub if no active review references them.

## Pre-PR Verification

Run:

```bash
corepack pnpm test:e2e:local-write
corepack pnpm test:e2e:mobile
corepack pnpm test:local-e2e-utils
corepack pnpm test:github-workflow
corepack pnpm --filter @silver-health/web typecheck
corepack pnpm --filter @silver-health/web build
corepack pnpm --filter @silver-health/api build
corepack pnpm smoke:production
```

Known note: Node currently prints `MODULE_TYPELESS_PACKAGE_JSON` warnings for TS scripts. They are noisy but non-blocking; a later cleanup should standardize script module execution.
