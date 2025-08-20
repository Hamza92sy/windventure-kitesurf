import { Page, expect } from '@playwright/test';

export class TailwindChecker {
  constructor(private page: Page) {}

  /**
   * Vérifie qu'un élément avec une classe Tailwind a bien les styles appliqués
   */
  async checkTailwindClass(selector: string, className: string, expectedCSS: { [key: string]: string }) {
    const element = this.page.locator(selector).filter({ hasText: new RegExp(className) }).first();
    
    // Vérifie que l'élément existe
    await expect(element).toBeVisible();
    
    // Récupère les styles computed
    const styles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        padding: computed.padding,
        margin: computed.margin,
        display: computed.display,
        border: computed.border,
      };
    });
    
    // Vérifie les styles attendus
    for (const [property, expectedValue] of Object.entries(expectedCSS)) {
      if (styles[property] !== expectedValue) {
        console.warn(`❌ ${selector} .${className}: ${property} = ${styles[property]} (attendu: ${expectedValue})`);
      } else {
              }
    }
    
    return styles;
  }

  /**
   * Vérifie que les styles inline n'écrasent pas Tailwind
   */
  async checkNoInlineStyleOverride(selector: string = 'body') {
    const element = this.page.locator(selector).first();
    const inlineStyle = await element.getAttribute('style');
    
    if (inlineStyle && inlineStyle.length > 0) {
      console.warn(`⚠️ Style inline détecté sur ${selector}: ${inlineStyle}`);
      
      // Vérifie si c'est le style problématique connu
      if (inlineStyle.includes('background: #fff') || inlineStyle.includes('color: #000')) {
        throw new Error(`🚨 Style inline destructeur détecté sur ${selector}: ${inlineStyle}`);
      }
    } else {
          }
    
    return inlineStyle;
  }

  /**
   * Test complet Tailwind
   */
  async runFullCheck() {
        
    // 1. Vérifie qu'il n'y a pas de style inline destructeur
    await this.checkNoInlineStyleOverride('body');
    
    // 2. Trouve un élément avec des classes Tailwind
    const tailwindElement = this.page.locator('[class*="bg-"], [class*="text-"], [class*="p-"]').first();
    
    if (await tailwindElement.count() > 0) {
      const classes = await tailwindElement.getAttribute('class');
            
      // 3. Vérifie que les styles sont appliqués
      const bgColor = await tailwindElement.evaluate(el => window.getComputedStyle(el).backgroundColor);
      const textColor = await tailwindElement.evaluate(el => window.getComputedStyle(el).color);
      
      // Si transparent ou blanc par défaut, Tailwind ne fonctionne pas
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'rgb(255, 255, 255)') {
        console.warn(`⚠️ Background par défaut détecté: ${bgColor}`);
        return false;
      }
      
            return true;
    }
    
    console.warn('❌ Aucun élément Tailwind trouvé');
    return false;
  }
}