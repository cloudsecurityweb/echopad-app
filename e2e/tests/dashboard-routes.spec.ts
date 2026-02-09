import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../utils/test-helpers';

// All dashboard routes from App.jsx
const dashboardRoutes = [
  '/dashboard',
  '/dashboard/client-admin',
  '/dashboard/profile',
  '/dashboard/productsowned',
  '/dashboard/products',
  '/dashboard/clients',
  '/dashboard/subscriptions',
  '/dashboard/licenses',
  '/dashboard/billing',
  '/dashboard/help',
  '/dashboard/help/getting-started',
  '/dashboard/users',
  '/dashboard/activity',
  '/dashboard/analytics',
  '/dashboard/settings',
  '/dashboard/client-feedback',
  '/dashboard/clients/123',
  '/dashboard/clients/client/demoTenant/123',
  '/dashboard/license-requests',
];

// Without authentication, all protected routes should send user to sign-in
// or show a clear auth-related message.

dashboardRoutes.forEach((route) => {
  test.describe(`Protected dashboard route: ${route}`, () => {
    test(`should redirect unauthenticated user from ${route} to sign-in`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);

      const url = page.url();
      const isOnSignIn = url.includes('/sign-in') || /sign in/i.test(await page.title());

      // Either redirected to sign-in or still on route but shows sign-in content
      if (!isOnSignIn) {
        const loginButtonVisible = await page.getByRole('button', { name: /login/i }).isVisible().catch(() => false);
        const msButtonVisible = await page.getByRole('button', { name: /Microsoft/i }).isVisible().catch(() => false);
        expect(loginButtonVisible || msButtonVisible).toBeTruthy();
      } else {
        expect(isOnSignIn).toBeTruthy();
      }
    });
  });
});

