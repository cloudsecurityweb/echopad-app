import { test, expect } from '@playwright/test';
import { waitForPageLoad, setupConsoleErrorCapture, validateNoConsoleErrors } from '../utils/test-helpers';

test.describe('Homepage Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = setupConsoleErrorCapture(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Verify page title
    await expect(page).toHaveTitle(/Echopad AI/i);
    
    // Verify main heading is visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/AI Agent/i);
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Check navigation links
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Verify key navigation items
    await expect(page.getByRole('link', { name: /Product/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Platform/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /ROI/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign in/i }).first()).toBeVisible();
  });

  test('should display logo', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const logo = page.getByRole('img', { name: /Echopad AI Logo/i });
    await expect(logo).toBeVisible();
  });

  test('should display featured products section', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Check for product cards
    await expect(page.getByRole('heading', { name: /Featured Product/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /AI Scribe/i })).toBeVisible();
  });

  test('should display footer with links', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check footer links
    await expect(page.getByRole('link', { name: /Privacy Policy/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms of Service/i }).first()).toBeVisible();
  });

  test('should have no critical console errors', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    const criticalErrors = validateNoConsoleErrors(consoleErrors);
    expect(criticalErrors).toHaveLength(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Mobile menu button should be visible
    const menuButton = page.getByRole('button', { name: /Toggle mobile menu/i });
    await expect(menuButton).toBeVisible();
  });

  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await waitForPageLoad(page);
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    console.log(`Homepage load time: ${loadTime}ms`);
  });
});
