import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const workflowPath = '.github/workflows/release-gates.yml';

test('release gates workflow exposes manual checks for launch readiness', () => {
  const workflow = readFileSync(workflowPath, 'utf8');

  for (const expected of [
    'workflow_dispatch:',
    'corepack pnpm --filter @silver-health/web typecheck',
    'corepack pnpm --filter @silver-health/web build',
    'corepack pnpm --filter @silver-health/api build',
    'corepack pnpm test:demo-reset-utils',
    'corepack pnpm test:smoke-utils',
    'corepack pnpm test:vercel-deploy-utils',
    'corepack pnpm smoke:production',
    'corepack pnpm test:e2e:mobile',
    'corepack pnpm deploy:vercel',
  ]) {
    assert.match(workflow, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
