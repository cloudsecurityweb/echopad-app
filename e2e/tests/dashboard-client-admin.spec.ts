import { test, expect } from '@playwright/test';
import { 
  waitForPageLoad,
  loginAsClientAdmin,
  ensureLoggedOut,
} from '../utils/test-helpers';

const clientAdminDashboardRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/productsowned',
  '/dashboard/products',
  '/dashboard/licenses',
  '/dashboard/subscriptions',
  '/dashboard/billing',
  '/dashboard/client-feedback',
];

const clientAdminUserRoutes = [
  '/dashboard/users',
  '/dashboard/activity',
  '/dashboard/analytics',
];

// These tests assume TEST_CLIENT_ADMIN_EMAIL / TEST_CLIENT_ADMIN_PASSWORD are set in env.

if (!process.env.TEST_CLIENT_ADMIN_EMAIL || !process.env.TEST_CLIENT_ADMIN_PASSWORD) {
  test.skip(true, 'Client admin dashboard tests skipped: TEST_CLIENT_ADMIN_EMAIL/TEST_CLIENT_ADMIN_PASSWORD not set');
}

test.describe('Client Admin dashboard flows', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
    await loginAsClientAdmin(page);
    await waitForPageLoad(page);
  });

  clientAdminDashboardRoutes.forEach((route) => {
    test(`should allow client admin to access ${route}`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);

      // Should stay on a dashboard route, not be redirected to sign-in
      expect(page.url()).toContain('/dashboard');

      // Page should render some heading/content
      const hasHeading = await page.locator('h1, h2').first().isVisible().catch(() => false);
      expect(hasHeading).toBeTruthy();
    });
  });

  clientAdminUserRoutes.forEach((route) => {
    test(`should load user/analytics view for client admin: ${route}`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);

      expect(page.url()).toContain('/dashboard');
      const hasHeading = await page.locator('h1, h2').first().isVisible().catch(() => false);
      expect(hasHeading).toBeTruthy();
    });
  });
});

