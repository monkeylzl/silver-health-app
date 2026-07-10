import { execSync } from 'node:child_process';
import { buildVercelDeployPlan, normalizeDeployConfig } from './vercel-deploy-utils.ts';

const execute = process.argv.includes('--execute');
const config = normalizeDeployConfig();
const plan = buildVercelDeployPlan(config);

function run(command: string) {
  console.log(`\n> ${command}`);
  execSync(command, {
    env: { ...process.env, ...plan.env },
    stdio: 'inherit',
  });
}

console.log('Vercel prebuilt deploy');
console.log(`- web app dir: ${config.webAppDir}`);
console.log(`- production web url: ${config.webUrl}`);
console.log(`- api base url: ${config.apiBaseUrl}`);
console.log(`- elder user id: ${config.elderUserId}`);
console.log(`- mode: ${execute ? 'execute' : 'dry-run'}`);

for (const command of plan.commands) {
  if (execute) {
    run(command);
  } else {
    console.log(`DRY-RUN ${command}`);
  }
}

if (!execute) {
  console.log('\nDry run only. Re-run with --execute to deploy to Vercel production.');
}
