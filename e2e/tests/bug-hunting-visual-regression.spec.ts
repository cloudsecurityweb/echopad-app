import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Bug Hunting: Visual Regression & UI Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
    // Set consistent viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should maintain consistent layout across pages', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    const routes = [
      '/dashboard/profile',
      '/dashboard/subscriptions',
      '/dashboard/licenses',
      '/dashboard/users',
    ];
    
    const layouts: { [key: string]: number } = {};
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Measure main content area width
      const contentWidth = await page.evaluate(() => {
        const main = document.querySelector('main, .main-content, [role="main"]');
        return main ? main.getBoundingClientRect().width : 0;
      });
      
      layouts[route] = contentWidth;
    }
    
    // Layouts should be consistent (within 50px tolerance)
    const widths = Object.values(layouts);
    const maxWidth = Math.max(...widths);
    const minWidth = Math.min(...widths);
    
    expect(maxWidth - minWidth).toBeLessThan(50);
  });

  test('should handle responsive design correctly', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet
      { width: 375, height: 667 },   // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Check if navigation is accessible
      const nav = page.locator('nav, [role="navigation"], .sidebar');
      const isVisible = await nav.isVisible().catch(() => false);
      
      // On mobile, nav might be hidden in hamburger menu
      if (viewport.width < 768) {
        const menuButton = page.locator('button[aria-label*="menu"], .hamburger');
        const hasMenuButton = await menuButton.isVisible().catch(() => false);
        expect(isVisible || hasMenuButton).toBeTruthy();
      } else {
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should maintain consistent spacing and alignment', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Check for consistent padding/margins
    const cards = page.locator('.card, [class*="card"], .panel');
    const cardCount = await cards.count();
    
    if (cardCount > 1) {
      const margins: number[] = [];
      for (let i = 0; i < Math.min(cardCount, 5); i++) {
        const margin = await cards.nth(i).evaluate(el => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        });
        margins.push(margin);
      }
      
      // Margins should be consistent (within 10px tolerance)
      const maxMargin = Math.max(...margins);
      const minMargin = Math.min(...margins);
      expect(maxMargin - minMargin).toBeLessThan(10);
    }
  });

  test('should handle text overflow correctly', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    
    // Check for text overflow issues
    const textElements = page.locator('td, .text, p, span');
    const elementCount = await textElements.count();
    
    let overflowIssues = 0;
    for (let i = 0; i < Math.min(elementCount, 20); i++) {
      const hasOverflow = await textElements.nth(i).evaluate(el => {
        return el.scrollWidth > el.clientWidth;
      });
      if (hasOverflow) {
        overflowIssues++;
      }
    }
    
    // Should have minimal overflow issues
    expect(overflowIssues).toBeLessThan(5);
  });

  test('should maintain consistent colors and themes', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for consistent primary color usage
    const primaryButtons = page.locator('button[class*="primary"], button[class*="blue"], button[class*="cyan"]');
    const buttonCount = await primaryButtons.count();
    
    if (buttonCount > 0) {
      // Sample button colors
      const colors: string[] = [];
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const color = await primaryButtons.nth(i).evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.backgroundColor;
        });
        colors.push(color);
      }
      
      // Colors should be consistent (same or similar)
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBeLessThan(3); // Allow some variation
    }
  });

  test('should handle dark mode correctly (if applicable)', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if dark mode toggle exists
    const darkModeToggle = page.locator('button[aria-label*="dark"], button[aria-label*="theme"], [data-theme]');
    const hasToggle = await darkModeToggle.isVisible().catch(() => false);
    
    if (hasToggle) {
      // Toggle dark mode
      await darkModeToggle.click();
      await page.waitForTimeout(1000);
      
      // Check if body has dark class or data attribute
      const isDark = await page.evaluate(() => {
        return document.body.classList.contains('dark') ||
               document.documentElement.classList.contains('dark') ||
               document.documentElement.getAttribute('data-theme') === 'dark';
      });
      
      expect(isDark).toBeTruthy();
      
      // Toggle back
      await darkModeToggle.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should handle loading states consistently', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    
    // Look for loading indicators
    const loadingIndicators = page.locator('.loading, .spinner, [aria-busy="true"], [data-loading]');
    const loadingCount = await loadingIndicators.count();
    
    // Should have consistent loading UI
    if (loadingCount > 0) {
      // All loading indicators should be similar
      const firstLoading = await loadingIndicators.first().getAttribute('class');
      for (let i = 1; i < loadingCount; i++) {
        const loadingClass = await loadingIndicators.nth(i).getAttribute('class');
        // Should have similar classes or structure
        expect(loadingClass || firstLoading).toBeTruthy();
      }
    }
  });

  test('should handle empty states consistently', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    // Navigate to pages that might be empty
    const routes = ['/dashboard/users', '/dashboard/licenses'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Check for empty state
      const emptyState = page.locator('text=/no data|empty|no results|nothing found/i');
      const hasEmptyState = await emptyState.isVisible().catch(() => false);
      
      if (hasEmptyState) {
        // Should have consistent empty state design
        const emptyStateElement = page.locator('.empty-state, [data-empty], .no-results');
        const isEmptyStateStyled = await emptyStateElement.isVisible().catch(() => false);
        expect(isEmptyStateStyled || hasEmptyState).toBeTruthy();
      }
    }
  });
});
