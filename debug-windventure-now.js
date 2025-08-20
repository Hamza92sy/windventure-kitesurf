#!/usr/bin/env node

/**
 * 🚨 DIAGNOSTIC IMMÉDIAT WINDVENTURE.FR
 * Script d'urgence pour identifier rapidement les problèmes d'affichage
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🔍 DIAGNOSTIC EXPRESS WINDVENTURE.FR');
  console.log('='.repeat(50));
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, 
      devtools: true,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    const page = await browser.newPage();
    
    // Intercepter les erreurs réseau
    const errors = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        errors.push({
          url: response.url(),
          status: response.status(),
          type: response.request().resourceType()
        });
      }
    });
    
    // Intercepter les erreurs console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    console.log('🌐 Connexion à https://windventure.fr...');
    await page.goto('https://windventure.fr', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Page chargée avec succès\\n');
    
    // 1. VÉRIFICATION DES ASSETS
    console.log('📦 ASSETS MANQUANTS:');
    if (errors.length > 0) {
      errors.forEach(err => {
        const severity = err.type === 'stylesheet' || err.type === 'script' ? '🔴 CRITIQUE' : '🟡 MINEUR';
        console.log(`   ${severity} ${err.status} - ${err.type}: ${err.url.split('/').pop()}`);
      });
    } else {
      console.log('   ✅ Tous les assets sont chargés correctement');
    }
    
    // 2. VÉRIFICATION DES IMAGES
    console.log('\\n🖼️ IMAGES CASSÉES:');
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter(img => !img.complete || img.naturalHeight === 0)
        .map(img => ({ 
          src: img.src.split('/').pop(), 
          alt: img.alt,
          visible: img.offsetParent !== null 
        }));
    });
    
    if (brokenImages.length > 0) {
      brokenImages.forEach(img => {
        const visibility = img.visible ? '👁️ VISIBLE' : '🙈 CACHÉE';
        console.log(`   ❌ ${visibility} ${img.src} (alt: "${img.alt}")`);
      });
    } else {
      console.log('   ✅ Toutes les images se chargent correctement');
    }
    
    // 3. VÉRIFICATION TAILWIND CSS
    console.log('\\n🎨 TAILWIND CSS:');
    const tailwindStatus = await page.evaluate(() => {
      // Vérifier si Tailwind est chargé
      const hasTailwindVars = !!getComputedStyle(document.documentElement)
        .getPropertyValue('--tw-bg-opacity');
      
      // Vérifier les classes Tailwind courantes
      const commonClasses = ['flex', 'grid', 'bg-blue-500', 'text-white', 'container'];
      const detectedClasses = [];
      
      commonClasses.forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        if (elements.length > 0) {
          detectedClasses.push(`${className} (${elements.length} éléments)`);
        }
      });
      
      // Vérifier le contenu du <style> pour Tailwind
      const styleTags = Array.from(document.querySelectorAll('style'));
      const hasTailwindCSS = styleTags.some(style => 
        style.textContent.includes('tailwind') || 
        style.textContent.includes('--tw-')
      );
      
      return {
        variables: hasTailwindVars,
        classes: detectedClasses,
        cssContent: hasTailwindCSS,
        totalStyleTags: styleTags.length
      };
    });
    
    if (tailwindStatus.variables || tailwindStatus.cssContent) {
      console.log('   ✅ Tailwind CSS détecté et actif');
      if (tailwindStatus.classes.length > 0) {
        console.log('   📝 Classes détectées:', tailwindStatus.classes.slice(0, 3).join(', '));
      }
    } else {
      console.log('   ❌ Tailwind CSS non détecté ou non chargé');
      console.log('   🔍 Suggestions:');
      console.log('      - Vérifiez que globals.css contient @tailwind directives');
      console.log('      - Relancez npm run build');
      console.log('      - Vérifiez tailwind.config.js');
    }
    
    // 4. ANALYSE DES ERREURS CONSOLE
    console.log('\\n💬 ERREURS CONSOLE:');
    if (consoleErrors.length > 0) {
      consoleErrors.slice(0, 5).forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.substring(0, 100)}${error.length > 100 ? '...' : ''}`);
      });
      if (consoleErrors.length > 5) {
        console.log(`   ... et ${consoleErrors.length - 5} autres erreurs`);
      }
    } else {
      console.log('   ✅ Aucune erreur console détectée');
    }
    
    // 5. DÉTECTION DES DÉBORDEMENTS
    console.log('\\n📐 DÉBORDEMENTS DÉTECTÉS:');
    const overflows = await page.evaluate(() => {
      const issues = [];
      const elements = Array.from(document.querySelectorAll('*'));
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        
        // Débordement horizontal
        if (rect.right > window.innerWidth || rect.left < 0) {
          issues.push({
            type: 'overflow-x',
            element: el.tagName.toLowerCase() + (el.className ? `.${el.className.split(' ')[0]}` : ''),
            width: Math.round(rect.width),
            position: Math.round(rect.left)
          });
        }
        
        // Z-index suspect
        if (styles.zIndex && parseInt(styles.zIndex) > 9999) {
          issues.push({
            type: 'z-index',
            element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
            value: styles.zIndex
          });
        }
      });
      
      return issues.slice(0, 5); // Limiter à 5 pour éviter le spam
    });
    
    if (overflows.length > 0) {
      overflows.forEach(issue => {
        if (issue.type === 'overflow-x') {
          console.log(`   📱 ${issue.element}: largeur ${issue.width}px, position ${issue.position}px`);
        } else {
          console.log(`   🔢 ${issue.element}: z-index ${issue.value}`);
        }
      });
    } else {
      console.log('   ✅ Aucun débordement majeur détecté');
    }
    
    // 6. TEST RESPONSIVE RAPIDE
    console.log('\\n📱 TEST RESPONSIVE:');
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.waitForTimeout(500);
      
      const responsiveIssues = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let issueCount = 0;
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth + 10) { // +10px de tolérance
            issueCount++;
          }
        });
        
        return issueCount;
      });
      
      const status = responsiveIssues === 0 ? '✅' : `⚠️ ${responsiveIssues} éléments`;
      console.log(`   ${viewport.name} (${viewport.width}px): ${status}`);
    }
    
    // 7. CAPTURE D'ÉCRAN POUR ANALYSE MANUELLE
    console.log('\n📸 CAPTURES D\'ÉCRAN:');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.screenshot({ 
      path: 'windventure-desktop.png', 
      fullPage: true 
    });
    console.log('   💻 Desktop: windventure-desktop.png');
    
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'windventure-mobile.png', 
      fullPage: true 
    });
    console.log('   📱 Mobile: windventure-mobile.png');
    
    // 8. MESURE DE PERFORMANCE
    console.log('\\n⚡ PERFORMANCE:');
    const metrics = await page.metrics();
    console.log(`   🕒 Nodes DOM: ${metrics.Nodes}`);
    console.log(`   💾 Heap utilisé: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(1)} MB`);
    
    // 9. GÉNÉRATEUR DE RAPPORT RAPIDE
    const quickReport = {
      timestamp: new Date().toISOString(),
      url: 'https://windventure.fr',
      issues: {
        missingAssets: errors.length,
        brokenImages: brokenImages.length,
        consoleErrors: consoleErrors.length,
        overflows: overflows.length,
        tailwindOK: tailwindStatus.variables || tailwindStatus.cssContent
      },
      severity: (errors.filter(e => e.type === 'stylesheet' || e.type === 'script').length > 0) ? 'CRITIQUE' : 
                (brokenImages.filter(img => img.visible).length > 0) ? 'ÉLEVÉ' : 'FAIBLE'
    };
    
    fs.writeFileSync('diagnostic-express.json', JSON.stringify(quickReport, null, 2));
    
    // 10. RÉSUMÉ FINAL
    console.log('\n' + '='.repeat(50));
    console.log('📋 RÉSUMÉ DIAGNOSTIC EXPRESS');
    console.log('='.repeat(50));
    console.log(`🎯 Sévérité globale: ${quickReport.severity}`);
    console.log(`📦 Assets manquants: ${quickReport.issues.missingAssets}`);
    console.log(`🖼️ Images cassées: ${quickReport.issues.brokenImages}`);
    console.log(`💬 Erreurs console: ${quickReport.issues.consoleErrors}`);
    console.log(`📐 Débordements: ${quickReport.issues.overflows}`);
    console.log(`🎨 Tailwind CSS: ${quickReport.issues.tailwindOK ? '✅ OK' : '❌ Problème'}`);
    
    console.log('\n🔧 PROCHAINES ACTIONS:');
    if (quickReport.severity === 'CRITIQUE') {
      console.log('   1. 🚨 Corrigez les assets CSS/JS manquants');
      console.log('   2. 🔧 Relancez npm run build');
      console.log('   3. 🧪 Testez en local avec npm run start');
    } else if (quickReport.severity === 'ÉLEVÉ') {
      console.log('   1. 🖼️ Vérifiez les chemins des images cassées');
      console.log('   2. 📱 Testez responsive sur mobile');
    } else {
      console.log('   ✅ Site en bon état général');
      console.log('   🔍 Analysez les captures d\'écran pour détails');
    }
    
    console.log('\n📁 Fichiers générés:');
    console.log('   - diagnostic-express.json (rapport machine)');
    console.log('   - windventure-desktop.png (capture desktop)');
    console.log('   - windventure-mobile.png (capture mobile)');
    
    console.log('\n🔧 DevTools ouvert - Inspectez manuellement pendant 30 secondes...');
    console.log('   💡 Vérifiez: Network tab, Console, Elements');
    
    // Laisser 30 secondes pour inspection manuelle
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ ERREUR CRITIQUE:', error.message);
    
    // Suggestions en cas d'erreur
    console.log('\n🆘 SOLUTIONS D\'URGENCE:');
    console.log('   1. Vérifiez votre connexion internet');
    console.log('   2. Le site windventure.fr est-il accessible?');
    console.log('   3. Essayez: curl -I https://windventure.fr');
    console.log('   4. Lancez en local: npm run dev');
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();