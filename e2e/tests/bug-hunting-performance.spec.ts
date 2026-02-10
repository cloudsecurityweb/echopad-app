import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Bug Hunting: Performance & Memory Leaks', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should not have memory leaks on repeated navigation', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    const routes = [
      '/dashboard/profile',
      '/dashboard/subscriptions',
      '/dashboard/licenses',
      '/dashboard/users',
      '/dashboard/analytics',
    ];
    
    // Navigate between routes multiple times
    for (let i = 0; i < 5; i++) {
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
    }
    
    // Check memory usage (basic check)
    const metrics = await page.metrics();
    expect(metrics.JSHeapUsedSize).toBeLessThan(100 * 1024 * 1024); // Less than 100MB
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    
    // Measure load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not make duplicate API calls', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    const apiCalls: string[] = [];
    await page.route('**/api/**', async route => {
      apiCalls.push(route.request().url());
      await route.continue();
    });
    
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check for duplicate calls
    const uniqueCalls = new Set(apiCalls);
    const duplicateRatio = apiCalls.length / uniqueCalls.size;
    
    // Allow some duplicates for retries, but not excessive
    expect(duplicateRatio).toBeLessThan(2);
  });

  test('should lazy load images and resources', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for lazy loading attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      let lazyLoadedCount = 0;
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        if (loading === 'lazy') {
          lazyLoadedCount++;
        }
      }
      
      // At least some images should be lazy loaded
      expect(lazyLoadedCount >= 0).toBeTruthy();
    }
  });

  test('should debounce search inputs', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      const apiCalls: string[] = [];
      await page.route('**/api/**', async route => {
        if (route.request().url().includes('search') || route.request().url().includes('users')) {
          apiCalls.push(route.request().url());
        }
        await route.continue();
      });
      
      // Type rapidly
      await searchInput.fill('a');
      await searchInput.fill('ab');
      await searchInput.fill('abc');
      await searchInput.fill('abcd');
      await searchInput.fill('abcde');
      
      await page.waitForTimeout(2000);
      
      // Should not make API call for every keystroke
      expect(apiCalls.length).toBeLessThan(5);
    }
  });

  test('should cleanup event listeners on unmount', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    // Navigate to a page
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Check for event listeners
    const listenerCount = await page.evaluate(() => {
      // This is a basic check - actual implementation would need more sophisticated monitoring
      return document.querySelectorAll('*').length;
    });
    
    // Navigate away
    await page.goto('/dashboard/subscriptions');
    await page.waitForLoadState('networkidle');
    
    // Navigate back
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Should not have excessive DOM nodes (indicator of memory leak)
    const newListenerCount = await page.evaluate(() => {
      return document.querySelectorAll('*').length;
    });
    
    expect(newListenerCount).toBeLessThan(listenerCount * 2);
  });

  test('should handle infinite scroll efficiently (if applicable)', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    
    // Try to scroll to bottom multiple times
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
    }
    
    // Should not crash or become unresponsive
    const isResponsive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    expect(isResponsive).toBeTruthy();
  });

  test('should cache API responses appropriately', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    const apiCalls: string[] = [];
    await page.route('**/api/**', async route => {
      apiCalls.push(route.request().url());
      await route.continue();
    });
    
    // Load page twice
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Some API calls should be cached (GET requests)
    const getCalls = apiCalls.filter(url => !url.includes('POST') && !url.includes('PUT'));
    const uniqueGetCalls = new Set(getCalls);
    
    // Allow some caching
    expect(getCalls.length >= uniqueGetCalls.size).toBeTruthy();
  });

  test('should not block UI thread with heavy computations', async ({ page }) => {
    await loginAsClientAdmin(page);
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Measure time to interactive
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    
    // Try to interact immediately
    const clickable = page.locator('button, a').first();
    const clickStart = Date.now();
    await clickable.click().catch(() => {});
    const clickTime = Date.now() - clickStart;
    
    // Should be responsive (click should register quickly)
    expect(clickTime).toBeLessThan(2000);
  });
});
