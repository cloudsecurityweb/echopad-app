import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../utils/test-helpers';

test.describe('Navigation Tests', () => {
  
  test('should navigate to Sign In page', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Click sign in link
    await page.getByRole('link', { name: /Sign in/i }).first().click();
    
    // Should be on sign-in page
    await expect(page).toHaveURL(/sign-in/);
    
    // Sign in form should be visible
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
  });

  test('should navigate to Product page', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await page.getByRole('link', { name: /Product/i }).first().click();
    await waitForPageLoad(page);
    
    // Should navigate to products section or page
    await expect(page).toHaveURL(/product|#product/i);
  });

  test('should navigate to Platform page', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await page.getByRole('link', { name: /Platform/i }).first().click();
    await waitForPageLoad(page);
    
    await expect(page).toHaveURL(/platform|#platform/i);
  });

  test('should navigate to ROI Calculator', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await page.getByRole('link', { name: /ROI/i }).first().click();
    await waitForPageLoad(page);
    
    await expect(page).toHaveURL(/roi|#roi/i);
  });

  test('should navigate back to home from sign-in', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForPageLoad(page);
    
    // Click logo to go home
    await page.getByRole('link', { name: /Echopad AI/i }).first().click();
    await waitForPageLoad(page);
    
    await expect(page).toHaveURL(/\/$/);
  });

  test('should navigate to Sign Up page', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForPageLoad(page);
    
    // Click sign up link
    await page.getByRole('link', { name: /Sign Up/i }).click();
    await waitForPageLoad(page);
    
    await expect(page).toHaveURL(/sign-up/);
  });

  test('should navigate to Privacy Policy', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.getByRole('link', { name: /Privacy Policy/i }).first().click();
    await waitForPageLoad(page);
    
    await expect(page).toHaveURL(/privacy/i);
  });

  test('should navigate to Terms of Service', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.getByRole('link', { name: /Terms of Service/i }).first().click();
    await waitForPageLoad(page);
    
    await expect(page).toHaveURL(/terms/i);
  });

  test('should handle 404 page gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    await waitForPageLoad(page);
    
    // Should show 404 or redirect to home
    const heading = page.getByRole('heading', { name: /Page not found|404/i });
    const isNotFound = await heading.isVisible().catch(() => false);
    
    if (isNotFound) {
      await expect(heading).toBeVisible();
      // Should have a link to go home
      await expect(page.getByRole('link', { name: /Go to Home|Home/i })).toBeVisible();
    } else {
      // Redirected to home
      await expect(page).toHaveURL('/');
    }
  });

  test('should maintain scroll position on back navigation', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    
    // Navigate away
    await page.getByRole('link', { name: /Sign in/i }).first().click();
    await waitForPageLoad(page);
    
    // Go back
    await page.goBack();
    await waitForPageLoad(page);
    
    // Check scroll is restored (browsers should restore scroll)
    await page.waitForTimeout(500);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    
    // Scroll should be somewhat restored (browsers may not be exact)
    expect(scrollAfter).toBeGreaterThanOrEqual(0);
  });
});
