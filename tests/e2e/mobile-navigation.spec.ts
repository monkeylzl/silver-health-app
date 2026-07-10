import { expect, test } from '@playwright/test';

const tabExpectations = [
  { label: '今日', path: '/', heading: '今日' },
  { label: '健康', path: '/health', heading: '健康' },
  { label: '家属', path: '/family/dashboard', heading: '家属看板' },
  { label: '我的', path: '/me', heading: '我的' },
];

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);
}

async function expectMainTouchTargets(page: import('@playwright/test').Page) {
  const undersizedTargets = await page.locator('.bottom-tab, .hero-action, button, .action-card').evaluateAll((elements) =>
    elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const label = element.textContent?.trim().replace(/\s+/g, ' ') || element.getAttribute('aria-label') || element.tagName;
        return { label, height: Math.round(rect.height) };
      })
      .filter((target) => target.height > 0 && target.height < 44),
  );

  expect(undersizedTargets).toEqual([]);
}

test.describe('mobile launch PWA shell', () => {
  test('loads the today workspace with production demo data and mobile-safe controls', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: '今日', exact: true })).toBeVisible();
    await expect(page.getByText('Silver Health PWA')).toBeVisible();
    await expect(page.getByText(/今日工作台已接入真实 API|当前使用演示任务保持体验完整/)).toBeVisible();
    await expect(page.getByRole('heading', { name: '晨间散步 20 分钟' }).or(page.getByRole('heading', { name: '记录今日血压' })).or(page.getByRole('heading', { name: '午间服药提醒' })).first()).toBeVisible();

    for (const tab of tabExpectations) {
      await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: tab.label })).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);
    await expectMainTouchTargets(page);
  });

  test('switches all four bottom tabs without losing active state or mobile layout', async ({ page }) => {
    await page.goto('/');

    for (const tab of tabExpectations) {
      await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: tab.label }).click();
      await expect(page).toHaveURL(new RegExp(`${tab.path === '/' ? '/$' : `${tab.path}$`}`));
      await expect(page.getByRole('heading', { name: tab.heading, exact: true })).toBeVisible();
      await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: tab.label })).toHaveAttribute('aria-current', 'page');
      await expectNoHorizontalOverflow(page);
    }
  });
});
