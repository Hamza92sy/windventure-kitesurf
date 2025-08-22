import { test, expect } from '@playwright/test';

test.describe('Windventure - Validation Technique Complète', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Homepage - Desktop Chrome', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;
    
    // Screenshot HD homepage
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ 
      path: 'screenshots/homepage-desktop-chrome.png',
      fullPage: true 
    });
    
    // Vérifier éléments principaux
    await expect(page.locator('h1')).toContainText('Windventure');
    await expect(page.locator('button:has-text("Réserver")')).toBeVisible();
    
    // Core Web Vitals
    const metrics = await page.evaluate(() => {
      return {
        LCP: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
        FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        CLS: 0 // Simplified for now
      };
    });
    
    console.log('Desktop Chrome Metrics:', metrics);
    expect(metrics.LCP).toBeLessThan(2500);
    expect(metrics.FCP).toBeLessThan(1800);
  });

  test('Homepage - Mobile iOS', async ({ page }) => {
    // iPhone 14 Pro viewport
    await page.setViewportSize({ width: 393, height: 852 });
    
    await page.screenshot({ 
      path: 'screenshots/homepage-mobile-ios.png',
      fullPage: true 
    });
    
    // Vérifier responsive
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Touch targets
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Booking Flow - Formulaire', async ({ page }) => {
    // Navigate to booking
    await page.click('button:has-text("Réserver")');
    await page.waitForTimeout(1000);
    
    // Screenshot formulaire
    await page.screenshot({ 
      path: 'screenshots/booking-form-step1.png',
      fullPage: true 
    });
    
    // Remplir formulaire
    await page.fill('input[type="email"]', 'test@windventure.fr');
    await page.fill('input[type="tel"]', '+33612345678');
    await page.fill('input[name="name"]', 'Test Client');
    
    // Validation
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue('test@windventure.fr');
    
    // Sélection date
    await page.click('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[type="date"]', tomorrow.toISOString().split('T')[0]);
    
    await page.screenshot({ 
      path: 'screenshots/booking-form-filled.png',
      fullPage: true 
    });
  });

  test('Responsive - Multi-tailles', async ({ page }) => {
    const viewports = [
      { name: 'mobile-375', width: 375, height: 667 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'desktop-1440', width: 1440, height: 900 },
      { name: 'wide-1920', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.screenshot({ 
        path: `screenshots/responsive-${viewport.name}.png`,
        fullPage: false 
      });
      
      // Vérifier pas d'overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
    }
  });

  test('Performance - Lighthouse Metrics', async ({ page }) => {
    // Mesurer performance
    const performanceMetrics = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint');
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        LCP: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
        TTFB: navigation.responseStart - navigation.fetchStart,
        DOMContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        LoadComplete: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log('Performance Metrics:', performanceMetrics);
    
    // Assertions
    expect(performanceMetrics.FCP).toBeLessThan(1800);
    expect(performanceMetrics.TTFB).toBeLessThan(800);
    expect(performanceMetrics.LoadComplete).toBeLessThan(3000);
  });

  test('Accessibilité - WCAG', async ({ page }) => {
    // Vérifier navigation clavier
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
    
    // Vérifier ARIA labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
    
    // Vérifier alt text images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('SEO - Meta tags', async ({ page }) => {
    // Vérifier meta tags
    const title = await page.title();
    expect(title).toContain('Windventure');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    
    // Open Graph
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
  });
});

test.describe('Stripe Payment Flow', () => {
  test.skip('Checkout Session - Test Mode', async ({ page }) => {
    // Skip si pas en mode test Stripe
    await page.goto('http://localhost:3000');
    
    // Simuler booking
    await page.click('button:has-text("Réserver")');
    await page.fill('input[type="email"]', 'test@windventure.fr');
    await page.fill('input[name="name"]', 'Test Client');
    
    // Déclencher checkout
    await page.click('button:has-text("Payer")');
    
    // Vérifier redirection Stripe
    await page.waitForURL(/checkout.stripe.com/, { timeout: 10000 });
    
    // Test card
    await page.fill('input[placeholder*="1234"]', '4242 4242 4242 4242');
    await page.fill('input[placeholder*="MM / YY"]', '12/34');
    await page.fill('input[placeholder*="CVC"]', '123');
    
    await page.screenshot({ 
      path: 'screenshots/stripe-checkout.png',
      fullPage: true 
    });
  });
});