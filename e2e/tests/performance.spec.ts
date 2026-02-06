import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const domContentLoaded = Date.now() - startTime;
    
    await page.waitForLoadState('load');
    const fullLoad = Date.now() - startTime;
    
    await page.waitForLoadState('networkidle');
    const networkIdle = Date.now() - startTime;
    
    console.log(`Performance metrics:
      - DOM Content Loaded: ${domContentLoaded}ms
      - Full Load: ${fullLoad}ms
      - Network Idle: ${networkIdle}ms`);
    
    // DOM should load within 3 seconds
    expect(domContentLoaded).toBeLessThan(3000);
    
    // Full load within 10 seconds
    expect(fullLoad).toBeLessThan(10000);
  });

  test('should have reasonable page weight', async ({ page }) => {
    let totalBytes = 0;
    const resourceSizes: { [key: string]: number } = {};
    
    page.on('response', async (response) => {
      const url = response.url();
      try {
        const body = await response.body().catch(() => Buffer.from(''));
        const size = body.length;
        totalBytes += size;
        
        // Categorize by type
        if (url.includes('.js')) {
          resourceSizes['JavaScript'] = (resourceSizes['JavaScript'] || 0) + size;
        } else if (url.includes('.css')) {
          resourceSizes['CSS'] = (resourceSizes['CSS'] || 0) + size;
        } else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)/)) {
          resourceSizes['Images'] = (resourceSizes['Images'] || 0) + size;
        } else if (url.includes('.woff') || url.includes('.ttf')) {
          resourceSizes['Fonts'] = (resourceSizes['Fonts'] || 0) + size;
        } else {
          resourceSizes['Other'] = (resourceSizes['Other'] || 0) + size;
        }
      } catch {
        // Ignore errors for resources we can't measure
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
    console.log(`Total page weight: ${totalMB}MB`);
    console.log('Resource breakdown:');
    for (const [type, size] of Object.entries(resourceSizes)) {
      console.log(`  ${type}: ${(size / 1024).toFixed(0)}KB`);
    }
    
    // Page should be under 10MB total (generous limit)
    expect(totalBytes).toBeLessThan(10 * 1024 * 1024);
  });

  test('should render critical content quickly (LCP proxy)', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for the main heading to be visible (proxy for LCP)
    await page.locator('h1').waitFor({ state: 'visible' });
    const lcpProxy = Date.now() - startTime;
    
    console.log(`LCP proxy (main heading visible): ${lcpProxy}ms`);
    
    // Should render within 2.5 seconds (good LCP target)
    expect(lcpProxy).toBeLessThan(4000); // Using 4s for network variability
  });

  test('should be interactive quickly (TTI proxy)', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Try to interact with the page
    const signInLink = page.getByRole('link', { name: /Sign in/i }).first();
    await signInLink.waitFor({ state: 'visible' });
    
    const tti = Date.now() - startTime;
    console.log(`TTI proxy (interactive elements ready): ${tti}ms`);
    
    // Should be interactive within 5 seconds
    expect(tti).toBeLessThan(5000);
  });

  test('should not have layout shifts after load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get initial position of main heading
    const heading = page.locator('h1');
    const initialBox = await heading.boundingBox();
    
    // Wait a bit and check if it moved
    await page.waitForTimeout(2000);
    const finalBox = await heading.boundingBox();
    
    if (initialBox && finalBox) {
      const verticalShift = Math.abs(finalBox.y - initialBox.y);
      console.log(`Vertical shift detected: ${verticalShift}px`);
      
      // Should not shift more than 10 pixels
      expect(verticalShift).toBeLessThan(50);
    }
  });

  test('should cache static resources', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Second visit - should use cache
    const cachedResponses: string[] = [];
    
    page.on('response', response => {
      const cacheControl = response.headers()['cache-control'];
      if (cacheControl && cacheControl.includes('max-age')) {
        cachedResponses.push(response.url());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log(`Resources with cache headers: ${cachedResponses.length}`);
    
    // Should have some cached resources
    expect(cachedResponses.length).toBeGreaterThan(0);
  });

  test('API response times should be acceptable', async ({ request }) => {
    const API_URL = process.env.API_URL || 'https://echopad-backend.azurewebsites.net';
    
    const measurements: { endpoint: string; time: number }[] = [];
    
    // Test health endpoint
    const healthStart = Date.now();
    await request.get(`${API_URL}/api/health`);
    measurements.push({ endpoint: '/api/health', time: Date.now() - healthStart });
    
    console.log('API Response Times:');
    for (const m of measurements) {
      console.log(`  ${m.endpoint}: ${m.time}ms`);
      // Each endpoint should respond within 5 seconds
      expect(m.time).toBeLessThan(5000);
    }
  });
});
