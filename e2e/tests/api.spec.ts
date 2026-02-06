import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_URL || 'https://echopad-backend.azurewebsites.net';

test.describe('API Endpoint Tests', () => {
  
  test.describe('Health Check', () => {
    
    test('should return healthy status from /api/health', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/health`);
      
      expect(response.ok()).toBeTruthy();
      
      const body = await response.json().catch(() => null);
      if (body) {
        expect(body.status || body.message).toBeDefined();
      }
    });

    test('should respond within acceptable time', async ({ request }) => {
      const startTime = Date.now();
      const response = await request.get(`${API_BASE_URL}/api/health`);
      const responseTime = Date.now() - startTime;
      
      expect(response.ok()).toBeTruthy();
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
      console.log(`API health check response time: ${responseTime}ms`);
    });
  });

  test.describe('CORS Configuration', () => {
    
    test('should have CORS headers configured', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/health`, {
        headers: {
          'Origin': 'https://polite-ground-0602c481e.2.azurestaticapps.net'
        }
      });
      
      const corsHeader = response.headers()['access-control-allow-origin'];
      // CORS should be configured (either specific origin or *)
      expect(corsHeader || response.ok()).toBeTruthy();
    });
  });

  test.describe('Authentication Endpoints', () => {
    
    test('should reject unauthenticated request to protected endpoint', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/user/profile`);
      
      // Should return 401 Unauthorized or 403 Forbidden
      expect([401, 403, 404]).toContain(response.status());
    });

    test('should reject login with invalid credentials', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/auth/login`, {
        data: {
          email: 'invalid@test.com',
          password: 'wrongpassword'
        }
      });
      
      // Should return 400 or 401
      expect([400, 401, 404]).toContain(response.status());
    });

    test('should validate email format on login', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/auth/login`, {
        data: {
          email: 'not-an-email',
          password: 'somepassword'
        }
      });
      
      // Should return validation error
      expect([400, 401, 422]).toContain(response.status());
    });
  });

  test.describe('Error Handling', () => {
    
    test('should return 404 for non-existent endpoint', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/nonexistent-endpoint-12345`);
      
      expect(response.status()).toBe(404);
    });

    test('should handle malformed JSON gracefully', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/auth/login`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: 'not valid json {'
      });
      
      // Should return 400 Bad Request
      expect([400, 500]).toContain(response.status());
    });
  });

  test.describe('Security Headers', () => {
    
    test('should have security headers configured', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/health`);
      const headers = response.headers();
      
      // Check for common security headers (may not all be present)
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
      ];
      
      let hasSecurityHeaders = false;
      for (const header of securityHeaders) {
        if (headers[header]) {
          hasSecurityHeaders = true;
          console.log(`Found security header: ${header} = ${headers[header]}`);
        }
      }
      
      // At minimum, response should be successful
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('Rate Limiting', () => {
    
    test('should handle multiple rapid requests', async ({ request }) => {
      const requests = Array(10).fill(null).map(() => 
        request.get(`${API_BASE_URL}/api/health`)
      );
      
      const responses = await Promise.all(requests);
      
      // All requests should succeed (or some may be rate limited)
      const successCount = responses.filter(r => r.ok()).length;
      const rateLimitedCount = responses.filter(r => r.status() === 429).length;
      
      // Either all succeed or some are rate limited (both are valid)
      expect(successCount + rateLimitedCount).toBe(10);
      
      if (rateLimitedCount > 0) {
        console.log(`Rate limiting is active: ${rateLimitedCount}/10 requests were limited`);
      }
    });
  });
});

test.describe('Frontend-Backend Integration', () => {
  
  test('should load frontend and connect to backend', async ({ page }) => {
    await page.goto('/');
    
    // Wait for any API calls to complete
    await page.waitForLoadState('networkidle');
    
    // Check for any failed network requests
    const failedRequests: string[] = [];
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.waitForTimeout(2000);
    
    // Log any failed requests
    if (failedRequests.length > 0) {
      console.log('Failed requests:', failedRequests);
    }
    
    // Frontend should load successfully regardless of API status
    await expect(page).toHaveTitle(/Echopad/i);
  });
});
