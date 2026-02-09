import { test, expect } from '@playwright/test';
import { 
  waitForPageLoad,
  loginAsRegularUser,
  ensureLoggedOut,
} from '../utils/test-helpers';

const regularUserRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/productsowned',
];

// These tests assume TEST_USER_EMAIL / TEST_USER_PASSWORD are set in env.

if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
  test.skip(true, 'Regular user dashboard tests skipped: TEST_USER_EMAIL/TEST_USER_PASSWORD not set');
}

test.describe('Regular User dashboard flows', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
    await loginAsRegularUser(page);
    await waitForPageLoad(page);
  });

  regularUserRoutes.forEach((route) => {
    test(`should allow regular user to access ${route}`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);

      expect(page.url()).toContain('/dashboard');

      const hasHeading = await page.locator('h1, h2').first().isVisible().catch(() => false);
      expect(hasHeading).toBeTruthy();
    });
  });
});

