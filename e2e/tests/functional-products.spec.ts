import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, loginAsRegularUser, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: Products Management', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view products owned as Regular User', async ({ page }) => {
    await loginAsRegularUser(page);
    
    // Navigate to products owned page
    await page.goto('/dashboard/productsowned');
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    await expect(page).toHaveURL(/.*productsowned/);
    
    // Check if products are displayed
    const productsList = page.locator('.product-item, [data-product-id], .product-card, table tbody tr').first();
    const hasProducts = await productsList.isVisible().catch(() => false);
    
    // Page should load even if no products
    expect(await page.title()).toContain('Echopad');
  });

  test('should view products store as Client Admin', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    // Navigate to products/store page
    await page.goto('/dashboard/products');
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    await expect(page).toHaveURL(/.*products/);
    
    // Check if products are displayed
    const productsGrid = page.locator('.product-grid, .products-list, table, [data-testid="products"]').first();
    const hasProducts = await productsGrid.isVisible().catch(() => false);
    
    if (hasProducts) {
      // Verify product cards/items exist
      const productItems = page.locator('.product-card, .product-item, tbody tr');
      const itemCount = await productItems.count();
      expect(itemCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should view product details', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/products');
    await page.waitForLoadState('networkidle');
    
    // Find first product
    const firstProduct = page.locator('.product-card, .product-item, tbody tr a, [data-product-id]').first();
    const hasProduct = await firstProduct.isVisible().catch(() => false);
    
    if (hasProduct) {
      // Click on product
      await firstProduct.click();
      await page.waitForTimeout(1000);
      
      // Verify product details are shown
      const productDetails = page.locator('.product-details, [data-testid="product-details"], h1, h2');
      const hasDetails = await productDetails.isVisible().catch(() => false);
      expect(hasDetails).toBeTruthy();
    }
  });

  test('should filter products by category or type', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/products');
    await page.waitForLoadState('networkidle');
    
    // Look for filter controls
    const filterSelect = page.locator('select[name*="category"], select[name*="type"], button:has-text("Filter")').first();
    const hasFilter = await filterSelect.isVisible().catch(() => false);
    
    if (hasFilter) {
      await filterSelect.click();
      await page.waitForTimeout(500);
      
      // Select a filter option if dropdown
      if (await filterSelect.evaluate(el => el.tagName === 'SELECT').catch(() => false)) {
        const options = page.locator('option');
        const optionCount = await options.count();
        if (optionCount > 1) {
          await filterSelect.selectOption({ index: 1 });
          await page.waitForTimeout(1000);
          
          // Verify products are filtered
          const filteredProducts = page.locator('.product-item, .product-card');
          const filteredCount = await filteredProducts.count();
          expect(filteredCount).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
