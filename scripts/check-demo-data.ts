import prismaPkg from '@prisma/client';
import { formatLocalDate, getLocalDateOnly, getWeekRange } from './demo-date-utils.ts';

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

async function main() {
  const elder = await prisma.user.findUnique({
    where: { mobile: '13800138001' },
    select: { id: true, nickname: true },
  });

  const family = await prisma.user.findUnique({
    where: { mobile: '13800138002' },
    select: { id: true, nickname: true },
  });

  if (!elder || !family) {
    throw new Error('缺少演示账号，请先运行 pnpm seed:demo');
  }

  const today = getLocalDateOnly();
  const todayDateKey = formatLocalDate(today);
  const lastWeek = getWeekRange(1);

  const [allTasks, latestMetric, reminderCount, activeBindingCount, latestReport] = await Promise.all([
    prisma.dailyTask.findMany({
      where: { elderUserId: elder.id },
      select: { taskDate: true },
    }),
    prisma.healthMetric.findFirst({
      where: { elderUserId: elder.id },
      orderBy: { measuredAt: 'desc' },
      select: { measuredAt: true, metricType: true },
    }),
    prisma.medicationReminder.count({
      where: { elderUserId: elder.id, enabled: true },
    }),
    prisma.familyBinding.count({
      where: { elderUserId: elder.id, familyUserId: family.id, status: 'active' },
    }),
    prisma.weeklyReport.findFirst({
      where: { elderUserId: elder.id },
      orderBy: { weekEndDate: 'desc' },
      select: { weekStartDate: true, weekEndDate: true },
    }),
  ]);

  const todayTaskCount = allTasks.filter((task) => formatLocalDate(task.taskDate) === todayDateKey).length;
  const problems: string[] = [];

  if (todayTaskCount === 0) {
    problems.push('今日任务为空，演示首页会直接失去“完成任务”步骤。');
  }

  if (!latestMetric) {
    problems.push('缺少健康指标，老人指标页和家属摘要都会偏空。');
  }

  if (reminderCount === 0) {
    problems.push('缺少启用中的用药提醒。');
  }

  if (activeBindingCount === 0) {
    problems.push('缺少有效家属绑定。');
  }

  if (!latestReport) {
    problems.push('缺少家属周报。');
  } else if (formatLocalDate(latestReport.weekEndDate) !== formatLocalDate(lastWeek.end)) {
    problems.push(`最新周报没有对齐最近完整周，当前 weekEndDate=${formatLocalDate(latestReport.weekEndDate)}，预期=${formatLocalDate(lastWeek.end)}。`);
  }

  console.log('Demo data check');
  console.log(`- elder: ${elder.nickname} (${elder.id})`);
  console.log(`- family: ${family.nickname} (${family.id})`);
  console.log(`- tasks for today (${formatLocalDate(today)}): ${todayTaskCount}`);
  console.log(`- latest metric: ${latestMetric ? `${latestMetric.metricType} @ ${latestMetric.measuredAt.toISOString()}` : 'missing'}`);
  console.log(`- enabled reminders: ${reminderCount}`);
  console.log(`- active bindings: ${activeBindingCount}`);
  console.log(`- latest weekly report: ${latestReport ? `${formatLocalDate(latestReport.weekStartDate)} ~ ${formatLocalDate(latestReport.weekEndDate)}` : 'missing'}`);

  if (problems.length > 0) {
    console.error('\nCheck failed:');
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('\nCheck passed: demo 数据仍然可直接用于当天演示。');
}

main()
  .catch((error) => {
    console.error('check-demo-data failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
