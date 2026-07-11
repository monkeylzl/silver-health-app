import { expect, test } from '@playwright/test';

const accessCode = process.env.E2E_TRIAL_ACCESS_CODE ?? 'silver-health-local';

async function enterControlledApp(page: import('@playwright/test').Page) {
  await page.goto('/');
  if (new URL(page.url()).pathname === '/access') {
    await page.getByLabel('体验口令').fill(accessCode);
    await page.getByRole('button', { name: '进入应用' }).click();
  }
  await expect(page.getByRole('heading', { name: '今日', exact: true })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
}

test('keeps protected pages read-only offline and clears dynamic caches on logout', async ({ page, context }) => {
  await enterControlledApp(page);
  await page.goto('/health');
  await expect(page.getByRole('heading', { name: '健康', exact: true })).toBeVisible();
  await page.goto('/tasks');
  await expect(page.getByRole('heading', { name: '今日任务' })).toBeVisible();

  const cacheState = await page.evaluate(async () => {
    const keys = await caches.keys();
    const staticCache = await caches.open(keys.find((key) => key.includes('static'))!);
    const staticUrls = (await staticCache.keys()).map((request) => request.url);
    return { keys, staticUrls };
  });
  expect(cacheState.keys.some((key) => key.includes('pages'))).toBe(true);
  expect(cacheState.staticUrls.some((url) => url.includes('_rsc='))).toBe(false);

  await context.setOffline(true);
  await page.goto('/tasks');
  await expect(page.getByRole('heading', { name: '今日任务' })).toBeVisible();
  await page.getByRole('button', { name: /标记完成|撤销完成/ }).first().click();
  await expect(page.getByText('当前处于离线状态，恢复网络后再更新任务。')).toBeVisible();

  await context.setOffline(false);
  await page.goto('/me');
  await page.getByRole('button', { name: '退出体验账号' }).click();
  await expect(page).toHaveURL(/\/access/);
  await expect.poll(() => page.evaluate(async () => !(await caches.keys()).some((key) => key.includes('pages')))).toBe(true);
});

test('offers connection help while offline and recovers when the network returns', async ({ page, context }) => {
  await enterControlledApp(page);
  await page.goto('/me');
  await expect(page.getByRole('heading', { name: '我的', exact: true })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: /离线浏览/ }).click();

  const dialog = page.getByRole('dialog', { name: '连接网络' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/设置 > (无线局域网或蜂窝网络|网络和互联网)/)).toBeVisible();
  await dialog.getByRole('button', { name: '重新检测' }).click();
  await expect(dialog.getByText('仍未连接，请检查系统网络设置。')).toBeVisible();

  await context.setOffline(false);
  await expect(page.getByText('已连接', { exact: true })).toBeVisible();
  await expect(dialog).toBeHidden();
});
