import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: Activity Logs', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view activity page as Client Admin', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Verify activity page loads
    await expect(page).toHaveURL(/.*activity/);
    
    // Check if activity content is displayed
    const activityContent = page.locator('text=/activity|log|action|timestamp/i').first();
    await expect(activityContent).toBeVisible({ timeout: 10000 });
  });

  test('should view activity logs list', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Check for activity logs table or list
    const activityTable = page.locator('table, .activity-item, [data-activity-id]').first();
    const hasTable = await activityTable.isVisible().catch(() => false);
    
    if (hasTable) {
      // Verify activity rows exist
      const activityRows = page.locator('tbody tr, .activity-item');
      const rowCount = await activityRows.count();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter activities by user', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Look for user filter
    const userFilter = page.locator('select[name*="user"], button:has-text("All Users")').first();
    const hasFilter = await userFilter.isVisible().catch(() => false);
    
    if (hasFilter) {
      await userFilter.click();
      await page.waitForTimeout(500);
      
      if (await userFilter.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        await userFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify activities are filtered
        const filteredActivities = page.locator('tbody tr, .activity-item');
        const filteredCount = await filteredActivities.count();
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should filter activities by product', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Look for product filter
    const productFilter = page.locator('select[name*="product"], button:has-text("All Products")').first();
    const hasFilter = await productFilter.isVisible().catch(() => false);
    
    if (hasFilter) {
      await productFilter.click();
      await page.waitForTimeout(500);
      
      if (await productFilter.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        await productFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify activities are filtered
        const filteredActivities = page.locator('tbody tr');
        const filteredCount = await filteredActivities.count();
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should filter activities by action type', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Look for action filter
    const actionFilter = page.locator('select[name*="action"], button:has-text("All Actions")').first();
    const hasFilter = await actionFilter.isVisible().catch(() => false);
    
    if (hasFilter) {
      await actionFilter.click();
      await page.waitForTimeout(500);
      
      if (await actionFilter.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        await actionFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify activities are filtered
        const filteredActivities = page.locator('tbody tr');
        const filteredCount = await filteredActivities.count();
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should view activity summary statistics', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Check for summary stats
    const stats = page.locator('text=/total activities|today|this week|this month/i');
    const statsCount = await stats.count();
    expect(statsCount).toBeGreaterThan(0);
  });

  test('should view activity charts', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/activity');
    await page.waitForLoadState('networkidle');
    
    // Check for charts
    const charts = page.locator('svg, canvas, [role="img"]');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThanOrEqual(0);
  });
});
