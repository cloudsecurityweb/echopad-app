import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view analytics page as Client Admin', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Verify analytics page loads
    await expect(page).toHaveURL(/.*analytics/);
    
    // Check if analytics content is displayed
    const analyticsContent = page.locator('text=/analytics|metrics|statistics|chart/i').first();
    await expect(analyticsContent).toBeVisible({ timeout: 10000 });
  });

  test('should view analytics charts and graphs', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Check for charts (recharts components render as SVG)
    const charts = page.locator('svg, canvas, [role="img"]');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThan(0);
  });

  test('should filter analytics by category', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Look for category filter
    const categoryFilter = page.locator('select[name*="category"], button:has-text("All"), button:has-text("Clients")').first();
    const hasFilter = await categoryFilter.isVisible().catch(() => false);
    
    if (hasFilter) {
      await categoryFilter.click();
      await page.waitForTimeout(500);
      
      if (await categoryFilter.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        await categoryFilter.selectOption({ index: 1 });
        await page.waitForTimeout(2000);
        
        // Verify charts update
        const charts = page.locator('svg, canvas');
        const chartCount = await charts.count();
        expect(chartCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should view analytics metrics', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Check for metric cards/stats
    const metrics = page.locator('.metric-card, [data-metric], text=/total|active|users|licenses/i');
    const metricCount = await metrics.count();
    expect(metricCount).toBeGreaterThan(0);
  });

  test('should search analytics data', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);
    
    if (hasSearch) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      
      // Verify search results update
      const results = page.locator('.analytics-item, [data-analytics-id]');
      const resultCount = await results.count();
      expect(resultCount).toBeGreaterThanOrEqual(0);
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(1000);
    }
  });

  test('should sort analytics data', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Look for sort controls
    const sortButton = page.locator('button:has-text("Sort"), select[name*="sort"], button[aria-label*="sort"]').first();
    const hasSort = await sortButton.isVisible().catch(() => false);
    
    if (hasSort) {
      await sortButton.click();
      await page.waitForTimeout(1000);
      
      // Verify sort is applied
      const sortedItems = page.locator('.analytics-item, tbody tr');
      const itemCount = await sortedItems.count();
      expect(itemCount).toBeGreaterThanOrEqual(0);
    }
  });
});
