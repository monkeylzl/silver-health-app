import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { buildResetPlan, confirmationHelp, parseDotEnv } from './demo-reset-utils.ts';

const dotEnv = existsSync('.env') ? parseDotEnv(readFileSync('.env', 'utf8')) : {};
const resetEnv = { ...dotEnv, ...process.env };
const plan = buildResetPlan(resetEnv);

function run(command: string) {
  console.log(`\n> ${command}`);
  execSync(command, {
    env: resetEnv,
    stdio: 'inherit',
  });
}

function main() {
  console.log('Demo reset');
  console.log(`- database: ${plan.redactedDatabaseUrl}`);
  console.log(`- smoke after reset: ${plan.runSmoke ? 'yes' : 'no'}`);

  if (!plan.confirmed) {
    console.error(`\nRefusing to reset demo data. ${confirmationHelp()}`);
    console.error('This command deletes and recreates demo tasks, metrics, medication reminders, and reports for the demo elder.');
    process.exitCode = 1;
    return;
  }

  for (const command of plan.commands) {
    run(command);
  }

  console.log('\nDemo reset passed.');
}

main();
