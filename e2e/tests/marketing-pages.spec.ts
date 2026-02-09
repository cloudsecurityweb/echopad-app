import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../utils/test-helpers';

const marketingPages: { path: string; headingPattern: RegExp }[] = [
  { path: '/', headingPattern: /AI Agent/i },
  { path: '/ai-scribe', headingPattern: /AI Scribe/i },
  { path: '/ai-docman', headingPattern: /AI Document Manager|Docman/i },
  { path: '/ai-medical-assistant', headingPattern: /Medical/i },
  { path: '/ai-receptionist', headingPattern: /AI Receptionist/i },
  { path: '/ai-admin-assistant', headingPattern: /AI Admin Assistant/i },
  { path: '/ai-reminders', headingPattern: /AI Patient Reminder|Reminders/i },
  { path: '/echopad-insights', headingPattern: /Insight|Benchmark/i },
  { path: '/aperio', headingPattern: /Aperio/i },
  { path: '/privacy-policy', headingPattern: /Privacy Policy/i },
  { path: '/terms-of-service', headingPattern: /Terms of Service|Terms/i },
];

marketingPages.forEach(({ path, headingPattern }) => {
  test.describe(`Marketing page: ${path}`, () => {
    test(`should load ${path} and display a key heading`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      const heading = page.getByRole('heading', { name: headingPattern }).first();
      await expect(heading).toBeVisible();
    });

    test(`should have basic SEO content on ${path}`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // Title should include Echopad
      await expect(page).toHaveTitle(/Echopad/i);

      // Meta description should exist if present
      const description = await page.locator('meta[name="description"]').getAttribute('content').catch(() => null);
      if (description) {
        expect(description.length).toBeGreaterThan(20);
      }
    });
  });
});

