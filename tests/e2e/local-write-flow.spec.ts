import { expect, test } from '@playwright/test';

type ApiListResponse<T> = { code: number; data: T[] };
type TaskItem = { id: string; title: string; status: 'todo' | 'done' | 'skipped' | 'expired'; completedAt?: string | null };
type MetricRecord = { id: string; metricType: string; systolic?: number | null; diastolic?: number | null; measuredAt: string };
type MedicationReminder = { id: string; medicineName: string; dosageText: string; enabled: boolean };
type ElderProfile = { userId: string; name: string; age: number };
type WeeklyReport = { id: string; metricRecordCount: number };

const apiBaseUrl = process.env.E2E_API_BASE_URL;
const elderUserId = process.env.E2E_ELDER_USER_ID;
const internalAppKey = process.env.E2E_INTERNAL_API_KEY;
const accessCode = process.env.E2E_TRIAL_ACCESS_CODE ?? 'silver-health-local';

test.skip(!apiBaseUrl || !elderUserId || !internalAppKey, 'local app E2E requires API URL, elder id, and internal key');

async function fetchApiList<T>(path: string): Promise<T[]> {
  const response = await fetch(`${apiBaseUrl}${path}`, { headers: { 'X-Silver-App-Key': internalAppKey! } });
  expect(response.ok).toBe(true);
  const payload = await response.json() as ApiListResponse<T>;
  expect(payload.code).toBe(0);
  return payload.data;
}

async function fetchApiData<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-Silver-App-Key': internalAppKey!, ...init.headers },
  });
  expect(response.ok).toBe(true);
  const payload = await response.json() as { code: number; data: T };
  expect(payload.code).toBe(0);
  return payload.data;
}

async function enterApp(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page).toHaveURL(/\/access/);
  await page.getByLabel('体验口令').fill(accessCode);
  await page.getByRole('button', { name: '进入应用' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: '今日', exact: true })).toBeVisible();
}

test('protects the app and completes the daily health-management write loop', async ({ page }) => {
  test.setTimeout(60_000);

  const tasksBefore = await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`);
  const metricsBefore = await fetchApiList<MetricRecord>(`/api/metrics/elder/${elderUserId}`);
  const remindersBefore = await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`);
  const reportsBefore = await fetchApiList<WeeklyReport>(`/api/reports/elder/${elderUserId}`);
  const profileBefore = await fetchApiData<ElderProfile>(`/api/profile/elder/${elderUserId}`);
  const todoTask = tasksBefore.find((task) => task.status === 'todo');
  expect(todoTask).toBeTruthy();

  const unauthorized = await fetch(`${apiBaseUrl}/api/tasks/elder/${elderUserId}`);
  expect(unauthorized.status).toBe(401);
  expect((await fetch(`${apiBaseUrl}/api/health`)).status).toBe(200);
  const invalidMetric = await fetch(`${apiBaseUrl}/api/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Silver-App-Key': internalAppKey! },
    body: JSON.stringify({
      elderUserId,
      metricType: 'blood_pressure',
      createdByRole: 'elder',
      createdByUserId: elderUserId,
      measuredAt: new Date().toISOString(),
    }),
  });
  expect(invalidMetric.status).toBe(400);

  const concurrentDone = await Promise.all(Array.from({ length: 4 }, () => fetchApiData<TaskItem>(`/api/tasks/${todoTask!.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'done', elderUserId }),
  })));
  expect(new Set(concurrentDone.map((task) => task.completedAt)).size).toBe(1);
  await fetchApiData<TaskItem>(`/api/tasks/${todoTask!.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'todo', elderUserId }),
  });

  await enterApp(page);

  await page.goto('/tasks');
  const taskRow = page.locator('.task-row').filter({ hasText: todoTask!.title });
  await taskRow.getByRole('button', { name: '标记完成' }).click();
  await expect(taskRow.getByText('已完成', { exact: true })).toBeVisible();
  await expect.poll(async () => (await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`)).find((task) => task.id === todoTask!.id)?.status).toBe('done');
  const completedTask = (await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`)).find((task) => task.id === todoTask!.id)!;
  const repeatedResults = await Promise.all(Array.from({ length: 4 }, () => fetchApiData<TaskItem>(`/api/tasks/${todoTask!.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'done', elderUserId }),
  })));
  expect(new Set(repeatedResults.map((task) => task.completedAt))).toEqual(new Set([completedTask.completedAt]));
  const wrongOwnerTask = await fetch(`${apiBaseUrl}/api/tasks/${todoTask!.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-Silver-App-Key': internalAppKey! },
    body: JSON.stringify({ status: 'todo', elderUserId: 'another-elder' }),
  });
  expect(wrongOwnerTask.status).toBe(404);

  await page.goto('/health/metrics/new');
  await page.getByLabel('收缩压 *').fill('132');
  await page.getByLabel('舒张压 *').fill('82');
  await page.getByLabel('脉搏').fill('76');
  const latestMeasuredAt = Math.max(...metricsBefore.map((metric) => new Date(metric.measuredAt).getTime()));
  const chinaLocalInput = new Date(latestMeasuredAt + 9 * 60 * 60 * 1000).toISOString().slice(0, 16);
  await page.getByLabel('测量时间 *').fill(chinaLocalInput);
  await page.getByRole('button', { name: '保存指标' }).click();
  await expect(page).toHaveURL(/\/health$/);
  await expect(page.getByText('132 / 82 mmHg')).toBeVisible();
  await expect.poll(async () => (await fetchApiList<MetricRecord>(`/api/metrics/elder/${elderUserId}`)).length).toBe(metricsBefore.length + 1);

  await page.goto('/health/medications');
  await page.getByRole('button', { name: '新增用药提醒' }).click();
  await page.getByLabel('药品名称 *').fill('阿司匹林 E2E');
  await page.getByLabel('服用说明 *').fill('晚饭后 1 片');
  await page.getByLabel('提醒时间 *').fill('21:15');
  await page.getByRole('button', { name: '保存提醒' }).click();
  await expect(page.getByRole('heading', { name: '阿司匹林 E2E' })).toBeVisible();
  await expect.poll(async () => (await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`)).length).toBe(remindersBefore.length + 1);
  const createdForOwnershipCheck = (await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`)).find((item) => item.medicineName === '阿司匹林 E2E')!;
  const wrongOwnerMedication = await fetch(`${apiBaseUrl}/api/medications/${createdForOwnershipCheck.id}?elderUserId=another-elder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-Silver-App-Key': internalAppKey! },
    body: JSON.stringify({ enabled: false }),
  });
  expect(wrongOwnerMedication.status).toBe(404);

  await page.getByRole('button', { name: '编辑 阿司匹林 E2E' }).click();
  await page.getByLabel('服用说明 *').fill('晚饭后半小时 1 片');
  await page.getByRole('button', { name: '保存提醒' }).click();
  await expect(page.getByText('晚饭后半小时 1 片 · 21:15')).toBeVisible();

  await page.getByRole('button', { name: '暂停 阿司匹林 E2E' }).click();
  await expect(page.getByText('提醒已暂停')).toBeVisible();
  await page.getByRole('button', { name: '启用 阿司匹林 E2E' }).click();
  await expect(page.getByText('提醒已启用').filter({ visible: true })).toHaveCount(3);

  await page.goto('/family');
  await expect(page.getByRole('heading', { name: '家人', exact: true })).toBeVisible();
  await expect(page.getByText('132 / 82 mmHg')).toBeVisible();

  await page.goto('/me/profile');
  await page.getByLabel('姓名 *').fill(`${profileBefore.name} E2E`);
  await page.getByRole('button', { name: '保存档案' }).click();
  await expect(page.getByText('档案已保存。')).toBeVisible();
  await expect.poll(async () => (await fetchApiData<ElderProfile>(`/api/profile/elder/${elderUserId}`)).name).toBe(`${profileBefore.name} E2E`);

  await page.goto('/family/reports');
  await page.getByRole('button', { name: '生成本周报告' }).click();
  await expect(page.getByText('本周报告已更新。')).toBeVisible();
  await expect.poll(async () => (await fetchApiList<WeeklyReport>(`/api/reports/elder/${elderUserId}`)).length).toBeGreaterThanOrEqual(reportsBefore.length);

  await page.goto('/tasks');
  await page.locator('.task-row').filter({ hasText: todoTask!.title }).getByRole('button', { name: '撤销完成' }).click();
  await expect.poll(async () => (await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`)).find((task) => task.id === todoTask!.id)?.status).toBe('todo');

  await fetchApiData(`/api/profile/elder/${elderUserId}`, { method: 'PATCH', body: JSON.stringify({ name: profileBefore.name, age: profileBefore.age }) });
  const createdReminder = (await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`)).find((item) => item.medicineName === '阿司匹林 E2E');
  expect(createdReminder).toBeTruthy();

  await page.goto('/health/medications');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '删除 阿司匹林 E2E' }).click();
  await expect(page.getByRole('heading', { name: '阿司匹林 E2E' })).toHaveCount(0);
  await expect.poll(async () => (await fetchApiList<MedicationReminder>(`/api/medications/elder/${elderUserId}`)).some((item) => item.id === createdReminder!.id)).toBe(false);
});
