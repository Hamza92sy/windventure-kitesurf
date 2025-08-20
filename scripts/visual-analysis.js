#!/usr/bin/env node

/**
 * 🔍 Analyse Visuelle Automatique pour Windventure.fr
 * Détecte : assets manquants, images cassées, problèmes CSS, débordements
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VisualDebugger {
  constructor() {
    this.issues = [];
    this.metrics = {};
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  async analyze() {
    console.log('🔍 Analyse visuelle en cours...\n');
    
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Configuration viewport desktop
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Intercepter les erreurs réseau
      const networkErrors = [];
      page.on('response', response => {
        if (response.status() >= 400) {
          networkErrors.push({
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
      
      // Intercepter les erreurs JavaScript
      page.on('pageerror', error => {
        this.issues.push({
          type: 'javascript_error',
          severity: 'high',
          message: error.message,
          stack: error.stack
        });
      });
      
      await page.goto(this.baseUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // 1. Vérifier les assets manquants (404)
      console.log('📦 Vérification des assets...');
      if (networkErrors.length > 0) {
        networkErrors.forEach(err => {
          this.issues.push({
            type: 'missing_asset',
            severity: err.type === 'stylesheet' || err.type === 'script' ? 'critical' : 'high',
            url: err.url,
            status: err.status,
            resourceType: err.type
          });
          console.log(`   ❌ ${err.status} - ${err.type}: ${err.url}`);
        });
      } else {
        console.log('   ✅ Tous les assets sont chargés');
      }
      
      // 2. Vérifier les images cassées
      console.log('\n🖼️ Vérification des images...');
      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images
          .filter(img => !img.complete || img.naturalHeight === 0 || !img.src)
          .map(img => ({
            src: img.src || 'none',
            alt: img.alt || 'no-alt',
            width: img.width,
            height: img.height,
            className: img.className
          }));
      });
      
      if (brokenImages.length > 0) {
        brokenImages.forEach(img => {
          this.issues.push({
            type: 'broken_image',
            severity: 'medium',
            src: img.src,
            alt: img.alt,
            dimensions: `${img.width}x${img.height}`
          });
          console.log(`   ❌ Image cassée: ${img.src}`);
        });
      } else {
        console.log('   ✅ Toutes les images sont valides');
      }
      
      // 3. Vérifier Tailwind CSS
      console.log('\n🎨 Vérification de Tailwind CSS...');
      const tailwindCheck = await page.evaluate(() => {
        const hasTailwind = !!getComputedStyle(document.documentElement)
          .getPropertyValue('--tw-bg-opacity');
        
        const tailwindClasses = Array.from(document.querySelectorAll('*'))
          .map(el => el.className)
          .filter(className => typeof className === 'string' && className.includes('tw-') || 
                              className.includes('bg-') || 
                              className.includes('text-') ||
                              className.includes('flex') ||
                              className.includes('grid'));
        
        return {
          loaded: hasTailwind,
          classesFound: tailwindClasses.length > 0,
          sampleClasses: tailwindClasses.slice(0, 5)
        };
      });
      
      if (!tailwindCheck.loaded) {
        this.issues.push({
          type: 'css_framework',
          severity: 'critical',
          framework: 'Tailwind CSS',
          status: 'not_loaded'
        });
        console.log('   ❌ Tailwind CSS non détecté');
      } else {
        console.log('   ✅ Tailwind CSS chargé correctement');
      }
      
      // 4. Détecter les éléments débordants
      console.log('\n📐 Vérification des débordements...');
      const overflowingElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const overflowing = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          // Vérifier débordement horizontal
          if (rect.right > window.innerWidth || rect.left < 0) {
            overflowing.push({
              selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ')[0]}` : ''),
              overflow: 'horizontal',
              position: `left: ${rect.left}px, right: ${rect.right}px`,
              width: rect.width
            });
          }
          
          // Vérifier z-index anormal
          if (styles.zIndex && parseInt(styles.zIndex) > 9999) {
            overflowing.push({
              selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
              issue: 'z-index',
              value: styles.zIndex
            });
          }
        });
        
        return overflowing;
      });
      
      if (overflowingElements.length > 0) {
        overflowingElements.forEach(el => {
          this.issues.push({
            type: 'layout_overflow',
            severity: 'medium',
            element: el.selector,
            details: el
          });
          console.log(`   ⚠️ Débordement: ${el.selector}`);
        });
      } else {
        console.log('   ✅ Aucun débordement détecté');
      }
      
      // 5. Vérifier les polices manquantes
      console.log('\n🔤 Vérification des polices...');
      const fontCheck = await page.evaluate(() => {
        const fonts = new Set();
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.fontFamily) {
            fonts.add(style.fontFamily);
          }
        });
        
        return Array.from(fonts);
      });
      
      console.log(`   📝 ${fontCheck.length} familles de polices détectées`);
      
      // 6. Mesurer les performances visuelles
      console.log('\n⚡ Métriques de performance visuelle...');
      const metrics = await page.metrics();
      const performanceTiming = await page.evaluate(() => {
        const timing = performance.timing;
        return {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
        };
      });
      
      this.metrics = {
        ...metrics,
        ...performanceTiming
      };
      
      console.log(`   ⏱️ DOM Content Loaded: ${performanceTiming.domContentLoaded}ms`);
      console.log(`   ⏱️ Page Load Complete: ${performanceTiming.loadComplete}ms`);
      console.log(`   ⏱️ First Paint: ${performanceTiming.firstPaint}ms`);
      
      // 7. Capture d'écran pour analyse manuelle
      console.log('\n📸 Capture d\'écran...');
      await page.screenshot({ 
        path: 'visual-debug-screenshot.png', 
        fullPage: true 
      });
      console.log('   ✅ Screenshot sauvegardé: visual-debug-screenshot.png');
      
      // 8. Test responsive
      console.log('\n📱 Test responsive...');
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];
      
      for (const viewport of viewports) {
        await page.setViewport(viewport);
        await page.waitForTimeout(500);
        
        const responsiveIssues = await page.evaluate(() => {
          const issues = [];
          const elements = document.querySelectorAll('*');
          
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > window.innerWidth) {
              issues.push({
                selector: el.tagName + (el.id ? `#${el.id}` : ''),
                width: rect.width,
                viewportWidth: window.innerWidth
              });
            }
          });
          
          return issues;
        });
        
        if (responsiveIssues.length > 0) {
          responsiveIssues.forEach(issue => {
            this.issues.push({
              type: 'responsive_issue',
              severity: 'medium',
              viewport: viewport.name,
              element: issue.selector,
              elementWidth: issue.width,
              viewportWidth: issue.viewportWidth
            });
          });
          console.log(`   ⚠️ ${viewport.name}: ${responsiveIssues.length} problèmes`);
        } else {
          console.log(`   ✅ ${viewport.name}: OK`);
        }
        
        await page.screenshot({ 
          path: `visual-debug-${viewport.name}.png`,
          fullPage: false 
        });
      }
      
      // 9. Vérifier les erreurs console
      if (consoleErrors.length > 0) {
        consoleErrors.forEach(error => {
          this.issues.push({
            type: 'console_error',
            severity: 'medium',
            message: error
          });
        });
        console.log(`\n❌ ${consoleErrors.length} erreurs console détectées`);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse:', error.message);
      this.issues.push({
        type: 'analysis_error',
        severity: 'critical',
        message: error.message
      });
    } finally {
      await browser.close();
    }
    
    this.generateReport();
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.baseUrl,
      issues: this.issues,
      metrics: this.metrics,
      summary: {
        total: this.issues.length,
        critical: this.issues.filter(i => i.severity === 'critical').length,
        high: this.issues.filter(i => i.severity === 'high').length,
        medium: this.issues.filter(i => i.severity === 'medium').length,
        low: this.issues.filter(i => i.severity === 'low').length
      }
    };
    
    // Sauvegarder le rapport JSON
    fs.writeFileSync('visual-debug-report.json', JSON.stringify(report, null, 2));
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT D\'ANALYSE VISUELLE');
    console.log('='.repeat(60));
    console.log(`\n📅 Date: ${report.timestamp}`);
    console.log(`🔗 URL: ${report.url}`);
    console.log(`\n📈 Résumé des problèmes:`);
    console.log(`   🔴 Critiques: ${report.summary.critical}`);
    console.log(`   🟠 Élevés: ${report.summary.high}`);
    console.log(`   🟡 Moyens: ${report.summary.medium}`);
    console.log(`   🟢 Faibles: ${report.summary.low}`);
    console.log(`   📊 Total: ${report.summary.total}`);
    
    if (report.summary.critical > 0) {
      console.log('\n🚨 PROBLÈMES CRITIQUES:');
      this.issues
        .filter(i => i.severity === 'critical')
        .forEach(issue => {
          console.log(`   - ${issue.type}: ${issue.message || issue.url || issue.framework}`);
        });
    }
    
    console.log('\n📁 Rapport complet: visual-debug-report.json');
    console.log('📸 Screenshots: visual-debug-*.png');
    
    // Retourner le code de sortie
    process.exit(report.summary.critical > 0 ? 1 : 0);
  }
}

// Exécution
if (require.main === module) {
  const debugger = new VisualDebugger();
  debugger.analyze();
}

module.exports = VisualDebugger;