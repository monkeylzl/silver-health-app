import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const READY_CONCLUSION = '现在可以开 API / Web，并优先从今日工作台 / 开始体验；路演讲解再打开 /demo。';

const checks = [
  {
    path: 'README.md',
    includes: ['今日工作台', 'PWA', 'pnpm demo:ready', READY_CONCLUSION],
  },
  {
    path: 'docs/how-to-preview-locally.md',
    includes: ['演示前 30 秒检查清单', '现场操作分层', '优先只讲即可', '前 3 步真正动手，后 3 步优先只讲即可', '如果现场没连上真实 API', READY_CONCLUSION],
  },
  {
    path: 'docs/demo-day-cheatsheet.md',
    includes: ['现场操作分层', '优先只讲即可', '真正动手只做 3 个动作', '它不只是在查文案，还会一起校验 cheatsheet 自己是否已经补到 `check:demo-copy` / `demo:ready` 这套接手说明', READY_CONCLUSION],
  },
  {
    path: 'docs/demo-script-3min.md',
    includes: ['前 3 步真正动手，后 3 步优先只讲即可', '家属周报', '如果现场没连上真实 API', READY_CONCLUSION],
  },
  {
    path: 'apps/web/app/page.tsx',
    includes: ['今日', 'ProgressBar', '今日任务', '查看全部任务'],
  },
  {
    path: 'apps/web/app/health/page.tsx',
    includes: ['健康', '最近健康指标', '今日用药'],
  },
  {
    path: 'apps/web/app/family/page.tsx',
    includes: ['家人', '今日近况', '本周报告'],
  },
  {
    path: 'apps/web/app/me/page.tsx',
    includes: ['我的', 'InstallPrompt', '健康档案'],
  },
  {
    path: 'apps/web/app/demo/page.tsx',
    includes: ["redirect('/')"],
  },
  {
    path: 'scripts/demo-ready.ts',
    includes: [READY_CONCLUSION, 'Demo ready 结论：', 'cheatsheet 也已覆盖 check:demo-copy / demo:ready 这套接手提示'],
  },
];

const errors: string[] = [];

for (const check of checks) {
  const content = readFileSync(join(root, check.path), 'utf8');

  for (const snippet of check.includes) {
    if (!content.includes(snippet)) {
      errors.push(`${check.path} 缺少：${snippet}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Demo 文案一致性检查失败：');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Demo 文案一致性检查通过：README / preview / cheatsheet / script 已覆盖统一口径；四个产品工作台和旧 demo 重定向契约完整，且 demo:ready 最终结论未漂移。');
