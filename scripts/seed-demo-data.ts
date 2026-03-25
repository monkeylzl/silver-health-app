import { PrismaClient, BindingStatus, BindingRelationType, Gender, HelperMode, MetricCreatedByRole, MetricType, MobilityLevel, TaskPriority, TaskSourceType, TaskStatus, TaskType, UserRole, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertUsers() {
  const elder = await prisma.user.upsert({
    where: { mobile: '13800138001' },
    update: {
      role: UserRole.elder,
      nickname: '李阿姨',
      status: UserStatus.active,
    },
    create: {
      role: UserRole.elder,
      nickname: '李阿姨',
      mobile: '13800138001',
      status: UserStatus.active,
    },
  });

  const family = await prisma.user.upsert({
    where: { mobile: '13800138002' },
    update: {
      role: UserRole.family,
      nickname: '小李',
      status: UserStatus.active,
    },
    create: {
      role: UserRole.family,
      nickname: '小李',
      mobile: '13800138002',
      status: UserStatus.active,
    },
  });

  return { elder, family };
}

async function upsertProfile(elderUserId: string) {
  return prisma.elderProfile.upsert({
    where: { userId: elderUserId },
    update: {
      name: '李阿姨',
      gender: Gender.female,
      age: 68,
      heightCm: 158,
      weightKg: 61,
      chronicConditions: ['高血压', '糖耐量异常'],
      commonMedicines: ['氨氯地平', '二甲双胍'],
      mobilityLevel: MobilityLevel.medium,
      helperMode: HelperMode.family_assisted,
    },
    create: {
      userId: elderUserId,
      name: '李阿姨',
      gender: Gender.female,
      age: 68,
      heightCm: 158,
      weightKg: 61,
      chronicConditions: ['高血压', '糖耐量异常'],
      commonMedicines: ['氨氯地平', '二甲双胍'],
      mobilityLevel: MobilityLevel.medium,
      helperMode: HelperMode.family_assisted,
    },
  });
}

async function upsertBinding(elderUserId: string, familyUserId: string) {
  return prisma.familyBinding.upsert({
    where: {
      elderUserId_familyUserId: {
        elderUserId,
        familyUserId,
      },
    },
    update: {
      relationType: BindingRelationType.daughter,
      status: BindingStatus.active,
    },
    create: {
      elderUserId,
      familyUserId,
      relationType: BindingRelationType.daughter,
      status: BindingStatus.active,
    },
  });
}

async function resetTasks(elderUserId: string) {
  await prisma.dailyTask.deleteMany({ where: { elderUserId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.dailyTask.createMany({
    data: [
      {
        elderUserId,
        taskDate: today,
        taskType: TaskType.exercise,
        title: '晨间散步 20 分钟',
        description: '建议饭后半小时进行，保持舒缓节奏。',
        priority: TaskPriority.high,
        status: TaskStatus.todo,
        sourceType: TaskSourceType.system_generated,
        dueTime: '08:30',
      },
      {
        elderUserId,
        taskDate: today,
        taskType: TaskType.measurement,
        title: '记录今日血压',
        description: '早餐后静坐 5 分钟再测量。',
        priority: TaskPriority.high,
        status: TaskStatus.todo,
        sourceType: TaskSourceType.system_generated,
        dueTime: '09:00',
      },
      {
        elderUserId,
        taskDate: today,
        taskType: TaskType.medication,
        title: '午间服药提醒',
        description: '按常规剂量服用。',
        priority: TaskPriority.medium,
        status: TaskStatus.done,
        sourceType: TaskSourceType.manual_config,
        dueTime: '12:00',
        completedAt: new Date(),
      },
      {
        elderUserId,
        taskDate: today,
        taskType: TaskType.diet,
        title: '晚餐控制盐分摄入',
        description: '避免重油重盐，适量多蔬菜。',
        priority: TaskPriority.medium,
        status: TaskStatus.todo,
        sourceType: TaskSourceType.manual_config,
        dueTime: '18:30',
      },
    ],
  });
}

async function resetMetrics(elderUserId: string, familyUserId: string) {
  await prisma.healthMetric.deleteMany({ where: { elderUserId } });
  return prisma.healthMetric.createMany({
    data: [
      {
        elderUserId,
        metricType: MetricType.blood_pressure,
        systolic: 128,
        diastolic: 78,
        pulse: 72,
        createdByRole: MetricCreatedByRole.elder,
        createdByUserId: elderUserId,
        measuredAt: new Date('2026-03-25T08:30:00.000Z'),
      },
      {
        elderUserId,
        metricType: MetricType.blood_glucose,
        glucoseValue: 6.2,
        glucosePeriodType: 'after_breakfast',
        createdByRole: MetricCreatedByRole.family,
        createdByUserId: familyUserId,
        measuredAt: new Date('2026-03-24T23:30:00.000Z'),
      },
      {
        elderUserId,
        metricType: MetricType.weight,
        weightKg: 61.5,
        createdByRole: MetricCreatedByRole.elder,
        createdByUserId: elderUserId,
        measuredAt: new Date('2026-03-23T23:30:00.000Z'),
      },
    ],
  });
}

async function resetMedicationReminders(elderUserId: string) {
  await prisma.medicationReminder.deleteMany({ where: { elderUserId } });
  return prisma.medicationReminder.createMany({
    data: [
      {
        elderUserId,
        medicineName: '氨氯地平',
        dosageText: '每日早晨 1 片',
        remindTime: '08:00',
        repeatRule: 'daily',
        enabled: true,
      },
      {
        elderUserId,
        medicineName: '二甲双胍',
        dosageText: '每日晚餐后 1 片',
        remindTime: '18:30',
        repeatRule: 'daily',
        enabled: true,
      },
    ],
  });
}

async function resetReports(elderUserId: string) {
  await prisma.weeklyReport.deleteMany({ where: { elderUserId } });
  return prisma.weeklyReport.createMany({
    data: [
      {
        elderUserId,
        weekStartDate: new Date('2026-03-18T00:00:00.000Z'),
        weekEndDate: new Date('2026-03-24T00:00:00.000Z'),
        exerciseCompletionRate: 82,
        medicationCompletionRate: 95,
        metricRecordCount: 6,
        summaryText: '本周任务总体完成较好，血压记录稳定，用药依从性较高。',
        suggestionList: ['继续保持晨间散步', '关注晚餐后血糖记录'],
      },
      {
        elderUserId,
        weekStartDate: new Date('2026-03-11T00:00:00.000Z'),
        weekEndDate: new Date('2026-03-17T00:00:00.000Z'),
        exerciseCompletionRate: 70,
        medicationCompletionRate: 88,
        metricRecordCount: 5,
        summaryText: '运动执行略有波动，但整体健康记录习惯在改善。',
        suggestionList: ['增加午后轻活动', '补齐周末体重记录'],
      },
    ],
  });
}

async function main() {
  const { elder, family } = await upsertUsers();
  await upsertProfile(elder.id);
  await upsertBinding(elder.id, family.id);
  const tasks = await resetTasks(elder.id);
  const metrics = await resetMetrics(elder.id, family.id);
  const medications = await resetMedicationReminders(elder.id);
  const reports = await resetReports(elder.id);

  console.log('Demo data ready.');
  console.log(`Elder user id: ${elder.id}`);
  console.log(`Family user id: ${family.id}`);
  console.log(`Recommended NEXT_PUBLIC_DEFAULT_ELDER_USER_ID=${elder.id}`);
  console.log(`Tasks inserted: ${tasks.count}`);
  console.log(`Metrics inserted: ${metrics.count}`);
  console.log(`Medication reminders inserted: ${medications.count}`);
  console.log(`Reports inserted: ${reports.count}`);
}

main()
  .catch((error) => {
    console.error('seed-demo-data failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
