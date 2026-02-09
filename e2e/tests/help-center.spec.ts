import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../utils/test-helpers';

// These tests exercise the public parts of the Help Center without requiring auth.

const helpRoutes = [
  '/dashboard/help',
  '/dashboard/help/getting-started',
];

helpRoutes.forEach((route) => {
  test.describe(`Help Center route: ${route}`, () => {
    test(`should require authentication for ${route}`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);

      const url = page.url();
      const redirectedToSignIn = url.includes('/sign-in');

      // If not redirected, we should at least see sign-in controls
      if (!redirectedToSignIn) {
        const hasLogin = await page.getByRole('button', { name: /login/i }).isVisible().catch(() => false);
        const hasMs = await page.getByRole('button', { name: /Microsoft/i }).isVisible().catch(() => false);
        expect(hasLogin || hasMs).toBeTruthy();
      } else {
        expect(redirectedToSignIn).toBeTruthy();
      }
    });
  });
});

