import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const tabs = [
  { label: '今日', path: '/', heading: '今日' },
  { label: '健康', path: '/health', heading: '健康' },
  { label: '家人', path: '/family', heading: '家人' },
  { label: '我的', path: '/me', heading: '我的' },
];

async function enterApp(page: import('@playwright/test').Page) {
  await page.goto('/');
  if (new URL(page.url()).pathname === '/access') {
    await page.getByLabel('体验口令').fill(process.env.E2E_TRIAL_ACCESS_CODE ?? 'silver-health-local');
    await page.getByRole('button', { name: '进入应用' }).click();
    await expect(page).toHaveURL(/\/$/);
  }
  await expect(page).toHaveTitle('Silver Health');
}

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);
}

async function expectTouchTargets(page: import('@playwright/test').Page) {
  const undersizedTargets = await page.locator('[data-touch-target], main button, main input, main select').evaluateAll((elements) =>
    elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.textContent?.trim() || element.getAttribute('aria-label') || element.tagName, height: Math.round(rect.height) };
      })
      .filter((target) => target.height > 0 && target.height < 44),
  );
  expect(undersizedTargets).toEqual([]);
}

test.describe('productized responsive app shell', () => {
  test('uses bottom tabs on phones and a sidebar on tablets', async ({ page }, testInfo) => {
    await enterApp(page);
    const width = testInfo.project.use.viewport?.width ?? 390;
    const bottomNavigation = page.getByRole('navigation', { name: '底部主导航' });
    const sidebarNavigation = page.getByRole('navigation', { name: '侧边主导航' });

    if (width < 768) {
      await expect(bottomNavigation).toBeVisible();
      await expect(sidebarNavigation).toBeHidden();
    } else {
      await expect(sidebarNavigation).toBeVisible();
      await expect(bottomNavigation).toBeHidden();
    }

    for (const tab of tabs) {
      const navigation = width < 768 ? bottomNavigation : sidebarNavigation;
      await expect(navigation.getByRole('link', { name: tab.label })).toBeVisible();
    }
    await expectNoHorizontalOverflow(page);
    await expectTouchTargets(page);
  });

  test('switches all primary tabs and keeps a single active item', async ({ page }, testInfo) => {
    await enterApp(page);
    const width = testInfo.project.use.viewport?.width ?? 390;
    const navigation = width < 768
      ? page.getByRole('navigation', { name: '底部主导航' })
      : page.getByRole('navigation', { name: '侧边主导航' });

    for (const tab of tabs) {
      await navigation.getByRole('link', { name: tab.label }).click();
      await expect(page).toHaveURL(new RegExp(tab.path === '/' ? '/$' : `${tab.path}$`));
      await expect(page.getByRole('heading', { name: tab.heading, exact: true })).toBeVisible();
      await expect(navigation.getByRole('link', { name: tab.label })).toHaveAttribute('aria-current', 'page');
      await expectNoHorizontalOverflow(page);
    }
  });

  test('keeps the today page compact and free of development copy', async ({ page }) => {
    await enterApp(page);
    await expect(page.getByText('当前接入：真实 API')).toHaveCount(0);
    await expect(page.getByText('上线版默认体验')).toHaveCount(0);
    await expect(page.getByText('Silver Health PWA')).toHaveCount(0);
    await expect(page.locator('[data-testid="task-preview-item"]')).toHaveCount(3);
    await expect(page.getByRole('link', { name: '查看全部任务' })).toBeVisible();
  });

  test('has no serious or critical accessibility violations on the app home', async ({ page }) => {
    await enterApp(page);
    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
    expect(blockingViolations).toEqual([]);
  });
});
