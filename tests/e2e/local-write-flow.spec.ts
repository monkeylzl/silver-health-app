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

const apiBaseUrl = process.env.E2E_API_BASE_URL;
const elderUserId = process.env.E2E_ELDER_USER_ID;

test.skip(!apiBaseUrl || !elderUserId, 'local write E2E requires E2E_API_BASE_URL and E2E_ELDER_USER_ID');

async function fetchApiList<T>(path: string): Promise<T[]> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  expect(response.ok).toBe(true);
  const payload = (await response.json()) as ApiListResponse<T>;
  expect(payload.code).toBe(0);
  expect(Array.isArray(payload.data)).toBe(true);
  return payload.data;
}

test('completes a task, records a metric, and reflects both on family dashboard', async ({ page }) => {
  const tasksBefore = await fetchApiList<TaskItem>(`/api/tasks/elder/${elderUserId}`);
  const metricsBefore = await fetchApiList<MetricRecord>(`/api/metrics/elder/${elderUserId}`);
  const doneBefore = tasksBefore.filter((task) => task.status === 'done').length;
  const todoBefore = tasksBefore.filter((task) => task.status === 'todo').length;

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

  await page.goto('/family/dashboard');
  await expect(page.getByRole('heading', { name: '家属看板', exact: true })).toBeVisible();
  await expect(page.getByText(`今天任务已完成 ${doneBefore + 1}/${tasksBefore.length}`)).toBeVisible();
  await expect(page.getByText('最近血压：132 / 82 mmHg', { exact: true })).toBeVisible();
});
