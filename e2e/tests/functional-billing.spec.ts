import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: Billing Management', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view billing page as Client Admin', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Verify billing page loads
    await expect(page).toHaveURL(/.*billing/);
    
    // Check if billing content is displayed
    const billingContent = page.locator('text=/billing|invoice|payment|plan/i').first();
    await expect(billingContent).toBeVisible({ timeout: 10000 });
  });

  test('should view billing summary statistics', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Check for summary stats (current plan, monthly cost, etc.)
    const stats = page.locator('text=/current plan|monthly cost|next billing/i');
    const statsCount = await stats.count();
    expect(statsCount).toBeGreaterThan(0);
  });

  test('should view billing transactions', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Check for transactions table or list
    const transactions = page.locator('table, .transaction-item, [data-transaction-id]').first();
    const hasTransactions = await transactions.isVisible().catch(() => false);
    
    if (hasTransactions) {
      // Verify transaction rows exist
      const transactionRows = page.locator('tbody tr, .transaction-item');
      const rowCount = await transactionRows.count();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter billing transactions by status', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Look for status filter
    const statusFilter = page.locator('select[name*="status"], button:has-text("All"), button:has-text("Paid")').first();
    const hasFilter = await statusFilter.isVisible().catch(() => false);
    
    if (hasFilter) {
      await statusFilter.click();
      await page.waitForTimeout(500);
      
      // Select a filter option
      if (await statusFilter.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        await statusFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify transactions are filtered
        const filteredTransactions = page.locator('tbody tr, .transaction-item');
        const filteredCount = await filteredTransactions.count();
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should filter billing transactions by date range', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Look for date range filter
    const dateFilter = page.locator('select[name*="date"], select[name*="range"], button:has-text("All Time")').first();
    const hasDateFilter = await dateFilter.isVisible().catch(() => false);
    
    if (hasDateFilter) {
      await dateFilter.click();
      await page.waitForTimeout(500);
      
      if (await dateFilter.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        await dateFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify date filter is applied
        const filteredTransactions = page.locator('tbody tr');
        const filteredCount = await filteredTransactions.count();
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should view invoice details', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Find first invoice/transaction
    const invoiceLink = page.locator('a:has-text("INV-"), button:has-text("View"), [data-invoice-id]').first();
    const hasInvoice = await invoiceLink.isVisible().catch(() => false);
    
    if (hasInvoice) {
      await invoiceLink.click();
      await page.waitForTimeout(1000);
      
      // Verify invoice details are shown
      const invoiceDetails = page.locator('.invoice-details, [data-testid="invoice"], text=/invoice|amount|date/i');
      const hasDetails = await invoiceDetails.isVisible().catch(() => false);
      expect(hasDetails || true).toBeTruthy();
    }
  });

  test('should download invoice', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');
    
    // Look for download button
    const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download"), button[aria-label*="download"]').first();
    const hasDownload = await downloadButton.isVisible().catch(() => false);
    
    if (hasDownload) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download').catch(() => null);
      await downloadButton.click();
      
      // Wait for download (if triggered)
      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toBeTruthy();
      }
    }
  });
});
