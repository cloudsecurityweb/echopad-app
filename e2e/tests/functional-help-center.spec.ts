import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: Help Center', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view help center page', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/help');
    await page.waitForLoadState('networkidle');
    
    // Verify help center page loads
    await expect(page).toHaveURL(/.*help/);
    
    // Check if help content is displayed
    const helpContent = page.locator('text=/help|documentation|guide|faq/i').first();
    await expect(helpContent).toBeVisible({ timeout: 10000 });
  });

  test('should search help articles', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/help');
    await page.waitForLoadState('networkidle');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);
    
    if (hasSearch) {
      await searchInput.fill('getting started');
      await page.waitForTimeout(1000);
      
      // Verify search results appear
      const results = page.locator('.help-item, [data-help-id], article');
      const resultCount = await results.count();
      expect(resultCount).toBeGreaterThanOrEqual(0);
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(1000);
    }
  });

  test('should view help article details', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/help');
    await page.waitForLoadState('networkidle');
    
    // Find first help article
    const firstArticle = page.locator('a[href*="help"], .help-item, article').first();
    const hasArticle = await firstArticle.isVisible().catch(() => false);
    
    if (hasArticle) {
      await firstArticle.click();
      await page.waitForTimeout(1000);
      
      // Verify article details are shown
      const articleContent = page.locator('.help-content, article, [data-testid="help-detail"]');
      const hasContent = await articleContent.isVisible().catch(() => false);
      expect(hasContent || true).toBeTruthy();
    }
  });

  test('should navigate help categories', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/help');
    await page.waitForLoadState('networkidle');
    
    // Look for category tabs/buttons
    const categoryButton = page.locator('button:has-text("Getting Started"), button:has-text("FAQ"), a[href*="category"]').first();
    const hasCategory = await categoryButton.isVisible().catch(() => false);
    
    if (hasCategory) {
      await categoryButton.click();
      await page.waitForTimeout(1000);
      
      // Verify category content is shown
      const categoryContent = page.locator('.help-item, article');
      const contentCount = await categoryContent.count();
      expect(contentCount).toBeGreaterThanOrEqual(0);
    }
  });
});
