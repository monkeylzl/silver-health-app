import { spawnSync } from 'node:child_process';

const READY_CONCLUSION = '现在可以开 API / Web，并优先从今日工作台 / 开始体验；路演讲解再打开 /demo。';
const PNPM = process.env.PNPM_COMMAND ?? 'corepack pnpm';

function runStep(command: string) {
  console.log(`\n> ${command}`);
  const result = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
  });

  return result.status ?? 1;
}

function runCopyCheck() {
  console.log('\nDemo ready: 开始检查 README / homepage / cheatsheet / script 的 demo 口径是否一致。');
  const copyStatus = runStep(`${PNPM} check:demo-copy`);
  if (copyStatus !== 0) {
    process.exitCode = copyStatus;
    return false;
  }

  console.log('\nDemo ready: demo 文案口径检查通过，README / preview / cheatsheet / script / homepage 已覆盖统一口径。');
  console.log('Demo ready: cheatsheet 也已覆盖 check:demo-copy / demo:ready 这套接手提示。');
  return true;
}

function printReadySummary() {
  console.log('\nDemo ready: 已完成“check → seed → re-check + demo copy check”。');
  console.log(`Demo ready 结论：${READY_CONCLUSION}`);
}

function main() {
  console.log('Demo ready: 先检查当天 demo 数据，必要时自动重建，并在成功链路末尾补做 demo 文案口径检查。');

  const firstCheck = runStep(`${PNPM} check:demo`);
  if (firstCheck === 0) {
    console.log('\nDemo ready: 当前数据已可直接演示，无需重建 seed。');
    if (!runCopyCheck()) {
      return;
    }
    printReadySummary();
    return;
  }

  console.log(`\nDemo ready: 首次检查未通过，开始自动执行 ${PNPM} seed:demo。`);
  const seedStatus = runStep(`${PNPM} seed:demo`);
  if (seedStatus !== 0) {
    process.exitCode = seedStatus;
    return;
  }

  console.log(`\nDemo ready: 已完成 seed，开始再次执行 ${PNPM} check:demo。`);
  const secondCheck = runStep(`${PNPM} check:demo`);
  if (secondCheck !== 0) {
    process.exitCode = secondCheck;
    return;
  }

  if (!runCopyCheck()) {
    return;
  }

  printReadySummary();
}

main();
