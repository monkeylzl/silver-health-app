import { expect, test } from '@playwright/test';

type ApiListResponse<T> = {
  code: number;
  data: T[];
};

type TaskItem = {
  id: string;
  title: string;
  status: 'todo' | 'done' | 'skipped' | 'expired';
};

type MetricRecord = {
  id: string;
  metricType: 'blood_pressure' | 'blood_glucose' | 'weight';
  systolic?: number | null;
  diastolic?: number | null;
};

type MedicationReminder = {
  id: string;
  medicineName: string;
  enabled: boolean;
};

type FamilyBinding = {
  id: string;
  familyUserId: string;
  status: 'pending' | 'active' | 'unbound';
};

type ElderProfile = {
  userId: string;
  name: string;
  age: number;
  user?: {
    nickname?: string | null;
    mobile?: string | null;
  } | null;
};

const apiBaseUrl = process.env.E2E_API_BASE_URL;
const elderUserId = process.env.E2E_ELDER_USER_ID;
const familyUserId = process.env.E2E_FAMILY_USER_ID;

test.skip(!apiBaseUrl || !elderUserId || !familyUserId, 'local write E2E requires E2E_API_BASE_URL, E2E_ELDER_USER_ID, and E2E_FAMILY_USER_ID');

async function fetchApiList<T>(path: string): Promise<T[]> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  expect(response.ok).toBe(true);
  const payload = (await response.json()) as ApiListResponse<T>;
  expect(payload.code).toBe(0);
  expect(Array.isArray(payload.data)).toBe(true);
  return payload.data;
}

async function fetchApiData<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  expect(response.ok).toBe(true);
  const payload = (await response.json()) as { code: number; data: T };
  expect(payload.code).toBe(0);
  return payload.data;
}

test('completes a task, records health data, creates medication reminder, updates profile, and reflects all on family dashboard', async ({ page }) => {
  const tasksBefore = await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`);
  const metricsBefore = await fetchApiList<MetricRecord>(`/api/metrics/elder/${elderUserId}`);
  const remindersBefore = await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`);
  const doneBefore = tasksBefore.filter((task) => task.status === 'done').length;
  const todoBefore = tasksBefore.filter((task) => task.status === 'todo').length;
  const enabledRemindersBefore = remindersBefore.filter((reminder) => reminder.enabled).length;

  expect(todoBefore).toBeGreaterThan(0);

  await page.goto('/elder/home');
  await expect(page.getByRole('heading', { name: '老人首页', exact: true })).toBeVisible();
  await expect(page.getByText('真实 API', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '标记完成' }).first().click();
  await expect(page.getByText('任务已标记完成，可以继续进入指标录入。')).toBeVisible();

  await expect
    .poll(async () => {
      const tasks = await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`);
      return tasks.filter((task) => task.status === 'done').length;
    })
    .toBe(doneBefore + 1);

  await page.goto('/elder/metrics');
  await expect(page.getByRole('heading', { name: '健康指标录入', exact: true })).toBeVisible();
  await page.locator('label').filter({ hasText: '收缩压' }).locator('input').fill('132');
  await page.locator('label').filter({ hasText: '舒张压' }).locator('input').fill('82');
  await page.locator('label').filter({ hasText: '脉搏' }).locator('input').fill('76');
  await page.getByRole('button', { name: '保存指标' }).click();
  await expect(page.getByText('指标录入成功，列表已自动刷新。下一步可切到“用药提醒”继续讲解。')).toBeVisible();

  await expect
    .poll(async () => {
      const metrics = await fetchApiList<MetricRecord>(`/api/metrics/elder/${elderUserId}`);
      return metrics.length;
    })
    .toBe(metricsBefore.length + 1);

  await page.goto('/elder/medication');
  await expect(page.getByRole('heading', { name: '用药提醒', exact: true })).toBeVisible();
  await page.locator('label').filter({ hasText: '药品名称' }).locator('input').fill('阿司匹林');
  await page.locator('label').filter({ hasText: '服用说明' }).locator('input').fill('晚饭后 1 片');
  await page.locator('label').filter({ hasText: '提醒时间' }).locator('input').fill('21:15');
  await page.getByRole('button', { name: '保存提醒' }).click();
  await expect(page.getByText('用药提醒保存成功，列表已自动刷新。下一步可切到“家属看板”查看汇总。')).toBeVisible();

  await expect
    .poll(async () => {
      const reminders = await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`);
      return reminders.length;
    })
    .toBe(remindersBefore.length + 1);

  await page.goto('/family/dashboard');
  await expect(page.getByRole('heading', { name: '家属看板', exact: true })).toBeVisible();
  await expect(page.getByText(`今天任务已完成 ${doneBefore + 1}/${tasksBefore.length}`)).toBeVisible();
  await expect(page.getByText('最近血压：132 / 82 mmHg', { exact: true })).toBeVisible();
  await expect(page.getByText(`${enabledRemindersBefore + 1} 条`, { exact: true })).toBeVisible();
  await expect(page.getByText('阿司匹林 · 21:15 · 已启用')).toBeVisible();

  await page.goto('/family/bind');
  await expect(page.getByRole('heading', { name: '家属绑定', exact: true })).toBeVisible();
  await expect(page.locator('label').filter({ hasText: '家属账号编号' }).locator('input')).toHaveValue(familyUserId!);
  await page.getByRole('button', { name: '提交绑定申请' }).click();
  await expect(page.getByText('绑定申请已提交，列表已自动刷新。可回到家属看板继续讲“谁在照护”。')).toBeVisible();

  await expect
    .poll(async () => {
      const bindings = await fetchApiList<FamilyBinding>(`/api/family-bindings/elder/${elderUserId}`);
      return bindings.some((binding) => binding.familyUserId === familyUserId && binding.status === 'pending');
    })
    .toBe(true);

  await page.goto('/elder/profile');
  await expect(page.getByRole('heading', { name: '老人建档', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '载入已有档案' }).click();
  await expect(page.getByText('档案已载入，可以直接补充或调整信息。')).toBeVisible();
  await page.locator('label').filter({ hasText: '页面称呼' }).locator('input').fill('李阿姨 E2E');
  await page.locator('label').filter({ hasText: '联系手机号' }).locator('input').fill('13900001111');
  await page.locator('label').filter({ hasText: '老人姓名' }).locator('input').fill('李秀兰 E2E');
  await page.getByRole('button', { name: '保存档案' }).click();
  await expect(page.getByText('档案已保存，下一步可直接去“今日任务”继续演示。')).toBeVisible();

  await expect
    .poll(async () => {
      const profile = await fetchApiData<ElderProfile>(`/api/profile/elder/${elderUserId}`);
      return {
        name: profile.name,
        nickname: profile.user?.nickname,
        mobile: profile.user?.mobile,
      };
    })
    .toEqual({
      name: '李秀兰 E2E',
      nickname: '李阿姨 E2E',
      mobile: '13900001111',
    });

  await page.goto('/me');
  await expect(page.getByRole('heading', { name: '我的', exact: true })).toBeVisible();
  await expect(page.getByText('李阿姨 E2E')).toBeVisible();
  await expect(page.getByText('68 岁 · 13900001111')).toBeVisible();
});
