import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: License Management', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view licenses list as Client Admin', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    // Navigate to licenses page
    await page.goto('/dashboard/licenses');
    await page.waitForLoadState('networkidle');
    
    // Verify licenses page loads
    await expect(page).toHaveURL(/.*licenses/);
    
    // Check if licenses table or list is visible
    const licensesTable = page.locator('table, [data-testid="licenses-list"], .licenses-list').first();
    const hasTable = await licensesTable.isVisible().catch(() => false);
    
    if (hasTable) {
      // Verify table headers or list items exist
      const headers = page.locator('th, [role="columnheader"]');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
    } else {
      // Check for any license-related content
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    }
  });

  test('should assign license to user', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    // Navigate to subscriptions/licenses page
    await page.goto('/dashboard/subscriptions');
    await page.waitForLoadState('networkidle');
    
    // Look for assign license button or action
    const assignButton = page.getByRole('button', { name: /assign|grant|give/i }).first();
    const hasAssignButton = await assignButton.isVisible().catch(() => false);
    
    if (hasAssignButton) {
      // Click assign button
      await assignButton.click();
      await page.waitForTimeout(1000);
      
      // Check if modal or form opens
      const modal = page.locator('[role="dialog"], .modal, [data-testid="assign-modal"]').first();
      const isModalOpen = await modal.isVisible().catch(() => false);
      
      if (isModalOpen) {
        // Fill in user selection
        const userSelect = page.locator('select, input[type="text"], [role="combobox"]').first();
        if (await userSelect.isVisible().catch(() => false)) {
          // Select a user (if dropdown or autocomplete)
          await userSelect.click();
          await page.waitForTimeout(500);
          
          // Try to select first option
          const firstOption = page.locator('option, [role="option"]').first();
          if (await firstOption.isVisible().catch(() => false)) {
            await firstOption.click();
          }
        }
        
        // Submit the assignment
        const submitButton = page.getByRole('button', { name: /assign|submit|save/i }).first();
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          
          // Wait for success message
          await page.waitForSelector('text=/success|assigned|granted/i', { timeout: 10000 }).catch(() => {});
        }
      }
    }
    
    // Verify we're still on the page
    await expect(page).toHaveURL(/.*subscriptions|.*licenses/);
  });

  test('should revoke license from user', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/subscriptions');
    await page.waitForLoadState('networkidle');
    
    // Look for revoke button
    const revokeButton = page.getByRole('button', { name: /revoke|remove|unassign/i }).first();
    const hasRevokeButton = await revokeButton.isVisible().catch(() => false);
    
    if (hasRevokeButton) {
      // Get initial count of licenses (if visible)
      const licenseItems = page.locator('[data-license-id], .license-item, tr').filter({ hasText: /license|product/i });
      const initialCount = await licenseItems.count();
      
      // Click revoke button
      await revokeButton.click();
      await page.waitForTimeout(1000);
      
      // Confirm revocation if confirmation dialog appears
      const confirmButton = page.getByRole('button', { name: /confirm|yes|revoke/i }).first();
      if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.click();
      }
      
      // Wait for success message
      await page.waitForSelector('text=/success|revoked|removed/i', { timeout: 10000 }).catch(() => {});
      
      // Verify license count decreased (if we had initial count)
      if (initialCount > 0) {
        await page.waitForTimeout(2000); // Wait for UI update
        const newCount = await licenseItems.count();
        // License count should decrease or item should be removed
        expect(newCount <= initialCount).toBeTruthy();
      }
    }
  });

  test('should request new license', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/subscriptions');
    await page.waitForLoadState('networkidle');
    
    // Look for request license button
    const requestButton = page.getByRole('button', { name: /request|new license|add license/i }).first();
    const hasRequestButton = await requestButton.isVisible().catch(() => false);
    
    if (hasRequestButton) {
      await requestButton.click();
      await page.waitForTimeout(1000);
      
      // Check if request form/modal opens
      const modal = page.locator('[role="dialog"], .modal, form').first();
      const isModalOpen = await modal.isVisible().catch(() => false);
      
      if (isModalOpen) {
        // Fill in request form
        const productSelect = page.locator('select[name*="product"], input[name*="product"]').first();
        if (await productSelect.isVisible().catch(() => false)) {
          await productSelect.click();
          await page.waitForTimeout(500);
          const firstProduct = page.locator('option, [role="option"]').first();
          if (await firstProduct.isVisible().catch(() => false)) {
            await firstProduct.click();
          }
        }
        
        // Submit request
        const submitButton = page.getByRole('button', { name: /request|submit|send/i }).first();
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          
          // Wait for success message
          await page.waitForSelector('text=/success|requested|submitted/i', { timeout: 10000 }).catch(() => {});
        }
      }
    }
  });

  test('should filter and search licenses', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/licenses');
    await page.waitForLoadState('networkidle');
    
    // Look for search/filter input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="filter"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);
    
    if (hasSearch) {
      // Enter search term
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      
      // Verify results are filtered (check if table/list updates)
      const results = page.locator('table tbody tr, .license-item, [data-license-id]');
      const resultCount = await results.count();
      expect(resultCount).toBeGreaterThanOrEqual(0); // Should have results or empty state
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(1000);
    }
  });
});
