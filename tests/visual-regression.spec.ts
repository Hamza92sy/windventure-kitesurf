import React from 'react';
import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

const ROUTES = [
  { path: '/', name: 'homepage' },
  { path: '/packages', name: 'packages' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' }
];

/**
 * Utilitaire pour attendre le chargement complet
 */
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Attendre les animations
}

/**
 * Tests de régression visuelle par viewport
 */
for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`Visual Regression - ${viewportName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
    });

    for (const route of ROUTES) {
      test(`${route.name} - ${viewportName}`, async ({ page }) => {
        // Navigation vers la page
        await page.goto(`${BASE_URL}${route.path}`);
        await waitForPageLoad(page);

        // Masquer les éléments dynamiques
        await page.addStyleTag({
          content: `
            .dynamic-content,
            .loading-spinner,
            .cursor-blink,
            [data-testid="date"],
            [data-testid="timestamp"] {
              visibility: hidden !important;
            }
          `
        });

        // Screenshot de la page complète
        await expect(page).toHaveScreenshot(
          `${route.name}-${viewportName}-full.png`,
          {
            fullPage: true,
            threshold: 0.2,
            animations: 'disabled'
          }
        );

        // Screenshot du viewport uniquement
        await expect(page).toHaveScreenshot(
          `${route.name}-${viewportName}-viewport.png`,
          {
            fullPage: false,
            threshold: 0.2,
            animations: 'disabled'
          }
        );
      });
    }
  });
}

/**
 * Tests d'éléments spécifiques
 */
test.describe('Components Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto(BASE_URL);
    await waitForPageLoad(page);
  });

  test('Navigation Header', async ({ page }) => {
    const header = page.locator('header, nav, [role="navigation"]').first();
    await expect(header).toHaveScreenshot('navigation-header.png', {
      threshold: 0.1
    });
  });

  test('Hero Section', async ({ page }) => {
    const hero = page.locator('.hero, [data-testid="hero"], section').first();
    await expect(hero).toHaveScreenshot('hero-section.png', {
      threshold: 0.1
    });
  });

  test('Footer', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toHaveScreenshot('footer.png', {
      threshold: 0.1
    });
  });

  test('Call-to-Action Buttons', async ({ page }) => {
    const buttons = page.locator('button, .btn, [role="button"]');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      await expect(button).toHaveScreenshot(`button-${i}.png`, {
        threshold: 0.05
      });
    }
  });
});

/**
 * Tests d'interaction et d'états
 */
test.describe('Interactive States', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto(BASE_URL);
    await waitForPageLoad(page);
  });

  test('Button Hover States', async ({ page }) => {
    const buttons = page.locator('button, .btn, [role="button"]');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i);
      
      // État normal
      await expect(button).toHaveScreenshot(`button-${i}-normal.png`);
      
      // État hover
      await button.hover();
      await page.waitForTimeout(200);
      await expect(button).toHaveScreenshot(`button-${i}-hover.png`);
    }
  });

  test('Menu Mobile Toggle', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    
    const menuToggle = page.locator('[aria-label*="menu"], .menu-toggle, .hamburger');
    
    if (await menuToggle.count() > 0) {
      // Menu fermé
      await expect(page).toHaveScreenshot('mobile-menu-closed.png');
      
      // Ouvrir le menu
      await menuToggle.first().click();
      await page.waitForTimeout(500);
      
      // Menu ouvert
      await expect(page).toHaveScreenshot('mobile-menu-open.png');
    }
  });
});

/**
 * Tests de contenu dynamique
 */
test.describe('Dynamic Content', () => {
  test('Loading States', async ({ page }) => {
    // Intercepter les requêtes pour simuler le loading
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto(`${BASE_URL}/packages`);
    
    // Screenshot pendant le loading
    await expect(page).toHaveScreenshot('packages-loading.png', {
      timeout: 2000
    });
    
    // Attendre le chargement complet
    await waitForPageLoad(page);
    
    // Screenshot final
    await expect(page).toHaveScreenshot('packages-loaded.png');
  });

  test('Error States', async ({ page }) => {
    // Simuler une erreur réseau
    await page.route('**/api/**', route => route.abort());
    
    await page.goto(`${BASE_URL}/packages`);
    await page.waitForTimeout(2000);
    
    // Vérifier l'état d'erreur
    const errorElement = page.locator('.error, [data-testid="error"], .alert-error');
    if (await errorElement.count() > 0) {
      await expect(errorElement).toHaveScreenshot('error-state.png');
    }
  });
});

/**
 * Tests de performance visuelle
 */
test.describe('Visual Performance', () => {
  test('Layout Stability (CLS)', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Mesurer le CLS
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        let clsEntries: any[] = [];
        
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              clsEntries.push(entry);
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => {
          observer.disconnect();
          resolve({ cls: clsValue, entries: clsEntries });
        }, 3000);
      });
    });
    
    .cls);
    
    // Le CLS doit être < 0.1
    expect((cls as any).cls).toBeLessThan(0.1);
  });

  test('Image Loading Performance', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Vérifier que toutes les images se chargent
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      
      // Vérifier que l'image est chargée
      const isLoaded = await img.evaluate((element: HTMLImageElement) => {
        return element.complete && element.naturalHeight !== 0;
      });
      
      expect(isLoaded).toBe(true);
    }
  });
});

/**
 * Tests de cross-browser
 */
test.describe('Cross-Browser Visual Tests', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`Homepage - ${browserName}`, async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);
      
      await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
        fullPage: true,
        threshold: 0.3 // Plus tolérant pour les différences de navigateur
      });
    });
  });
});

/**
 * Tests d'accessibilité visuelle
 */
test.describe('Visual Accessibility', () => {
  test('High Contrast Mode', async ({ page }) => {
    // Forcer le mode high contrast
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            filter: contrast(2) !important;
          }
        }
      `
    });
    
    await page.goto(BASE_URL);
    await waitForPageLoad(page);
    
    await expect(page).toHaveScreenshot('high-contrast.png');
  });

  test('Focus States', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForPageLoad(page);
    
    // Naviguer avec le clavier
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('focus-first-element.png');
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('focus-second-element.png');
  });
});