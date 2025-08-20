// scripts/visual-diagnostic-complete.js
// Diagnostic visuel ultra-complet pour windventure.fr

const puppeteer = require('puppeteer');
const fs = require('fs');

class WindventureVisualDiagnostic {
  constructor() {
    this.issues = [];
    this.report = {
      timestamp: new Date().toISOString(),
      url: 'https://windventure.fr',
      screenshots: [],
      styles: {},
      layout: {},
      responsive: {},
      images: {},
      performance: {},
      recommendations: []
    };
  }

  async runComplete() {
    console.log('🔍 DIAGNOSTIC VISUEL COMPLET - windventure.fr');
    console.log('═'.repeat(60));
    
    const browser = await puppeteer.launch({ 
      headless: true, // Mode headless pour éviter les problèmes d'affichage
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    try {
      await this.setupPageMonitoring(page);
      await page.goto('https://windventure.fr', { waitUntil: 'networkidle0' });
      
      // Diagnostics visuels
      await this.checkTailwindStyles(page);
      await this.checkLayoutStructure(page);
      await this.checkImageLoading(page);
      await this.checkResponsiveDesign(page);
      await this.checkColorScheme(page);
      await this.checkTypography(page);
      await this.checkNavigation(page);
      await this.checkPerformanceVisuals(page);
      
      // Screenshots de diagnostic
      await this.takeScreenshots(page);
      
      // Générer recommandations
      this.generateRecommendations();
      
      // Afficher rapport
      this.displayVisualReport();
      
    } catch (error) {
      console.error('❌ Erreur diagnostic:', error.message);
    } finally {
      await browser.close();
    }
  }

  async setupPageMonitoring(page) {
    console.log('🔧 Configuration du monitoring...');
    
    // Intercepter les erreurs console
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('Failed to load')) {
        this.issues.push({
          type: 'console_error',
          message: msg.text(),
          location: msg.location()
        });
      }
    });
    
    // Intercepter les erreurs réseau
    page.on('response', response => {
      if (response.status() >= 400) {
        this.issues.push({
          type: 'network_error',
          url: response.url(),
          status: response.status(),
          resourceType: response.request().resourceType()
        });
      }
    });
  }

  async checkTailwindStyles(page) {
    console.log('\n🎨 1. Vérification Tailwind CSS...');
    
    const tailwindCheck = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      
      // Vérifier les variables CSS Tailwind
      const hasTailwindVars = {
        bgOpacity: computed.getPropertyValue('--tw-bg-opacity'),
        textOpacity: computed.getPropertyValue('--tw-text-opacity'),
        borderOpacity: computed.getPropertyValue('--tw-border-opacity'),
        ringOpacity: computed.getPropertyValue('--tw-ring-opacity')
      };
      
      // Vérifier les classes utilitaires communes
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500 text-white p-4 rounded-lg shadow-lg';
      document.body.appendChild(testElement);
      
      const testStyles = getComputedStyle(testElement);
      const tailwindWorking = {
        backgroundColor: testStyles.backgroundColor,
        color: testStyles.color,
        padding: testStyles.padding,
        borderRadius: testStyles.borderRadius,
        boxShadow: testStyles.boxShadow
      };
      
      document.body.removeChild(testElement);
      
      // Vérifier les éléments existants
      const heroSection = document.querySelector('h1, .hero, [class*="hero"]');
      const buttons = document.querySelectorAll('button, .btn, [class*="btn"]');
      
      return {
        variables: hasTailwindVars,
        testStyles: tailwindWorking,
        heroStyles: heroSection ? getComputedStyle(heroSection) : null,
        buttonCount: buttons.length,
        buttonStyles: buttons.length > 0 ? getComputedStyle(buttons[0]) : null
      };
    });
    
    this.report.styles.tailwind = tailwindCheck;
    
    // Analyser les résultats
    const hasVars = Object.values(tailwindCheck.variables).some(val => val !== '');
    const hasStyles = tailwindCheck.testStyles.backgroundColor !== 'rgba(0, 0, 0, 0)';
    
    if (hasVars && hasStyles) {
      console.log('   ✅ Tailwind CSS est actif');
      console.log(`      Variables CSS: ${Object.keys(tailwindCheck.variables).length} détectées`);
      console.log(`      Classes utilitaires: Fonctionnelles`);
    } else {
      console.log('   ❌ Problème Tailwind détecté');
      console.log(`      Variables CSS: ${hasVars ? 'OK' : 'MANQUANTES'}`);
      console.log(`      Classes utilitaires: ${hasStyles ? 'OK' : 'NON APPLIQUÉES'}`);
      
      this.issues.push({
        type: 'tailwind_issue',
        hasVars,
        hasStyles,
        details: tailwindCheck
      });
    }
  }

  async checkLayoutStructure(page) {
    console.log('\n📐 2. Analyse de la structure layout...');
    
    const layoutCheck = await page.evaluate(() => {
      const body = document.body;
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Vérifier la structure générale
      const header = document.querySelector('header, nav, .header, .navbar');
      const main = document.querySelector('main, .main, .content');
      const footer = document.querySelector('footer, .footer');
      
      // Vérifier les sections principales
      const sections = Array.from(document.querySelectorAll('section, .section, [class*="section"]'));
      
      // Détecter les problèmes de layout
      const overflowElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > viewport.width + 10 || rect.bottom > viewport.height + 5000;
      });
      
      // Vérifier l'alignement vertical
      const centerElements = Array.from(document.querySelectorAll('[class*="center"], [class*="flex"], [class*="grid"]'));
      
      return {
        viewport,
        structure: {
          hasHeader: !!header,
          hasMain: !!main,
          hasFooter: !!footer,
          sectionsCount: sections.length
        },
        overflow: overflowElements.length,
        overflowElements: overflowElements.slice(0, 5).map(el => ({
          tag: el.tagName,
          className: el.className,
          rect: el.getBoundingClientRect()
        })),
        centerElements: centerElements.length
      };
    });
    
    this.report.layout = layoutCheck;
    
    console.log(`   📱 Viewport: ${layoutCheck.viewport.width}x${layoutCheck.viewport.height}`);
    console.log(`   🏗️ Structure: ${layoutCheck.structure.hasHeader ? '✅' : '❌'} Header, ${layoutCheck.structure.hasMain ? '✅' : '❌'} Main, ${layoutCheck.structure.hasFooter ? '✅' : '❌'} Footer`);
    console.log(`   📊 Sections: ${layoutCheck.structure.sectionsCount} détectées`);
    
    if (layoutCheck.overflow > 0) {
      console.log(`   ⚠️ Débordements: ${layoutCheck.overflow} éléments`);
      this.issues.push({
        type: 'layout_overflow',
        count: layoutCheck.overflow,
        elements: layoutCheck.overflowElements
      });
    } else {
      console.log('   ✅ Pas de débordements détectés');
    }
  }

  async checkImageLoading(page) {
    console.log('\n🖼️ 3. Vérification des images...');
    
    const imageCheck = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const imageData = images.map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.naturalWidth,
        height: img.naturalHeight,
        complete: img.complete,
        loading: img.loading,
        className: img.className,
        isNextImage: img.src.includes('/_next/image'),
        visible: img.getBoundingClientRect().width > 0
      }));
      
      const brokenImages = imageData.filter(img => !img.complete || img.width === 0);
      const nextImages = imageData.filter(img => img.isNextImage);
      const missingAlt = imageData.filter(img => !img.alt);
      
      return {
        total: images.length,
        loaded: imageData.filter(img => img.complete && img.width > 0).length,
        broken: brokenImages.length,
        nextOptimized: nextImages.length,
        missingAlt: missingAlt.length,
        details: imageData.slice(0, 10), // Première 10 pour éviter la surcharge
        brokenList: brokenImages
      };
    });
    
    this.report.images = imageCheck;
    
    console.log(`   📊 Images totales: ${imageCheck.total}`);
    console.log(`   ✅ Chargées: ${imageCheck.loaded}/${imageCheck.total}`);
    console.log(`   🚀 Next.js optimisées: ${imageCheck.nextOptimized}`);
    
    if (imageCheck.broken > 0) {
      console.log(`   ❌ Images cassées: ${imageCheck.broken}`);
      imageCheck.brokenList.forEach(img => {
        console.log(`      - ${img.src}`);
      });
      
      this.issues.push({
        type: 'broken_images',
        count: imageCheck.broken,
        images: imageCheck.brokenList
      });
    }
    
    if (imageCheck.missingAlt > 0) {
      console.log(`   ⚠️ ALT manquants: ${imageCheck.missingAlt} (SEO/Accessibilité)`);
    }
  }

  async checkResponsiveDesign(page) {
    console.log('\n📱 4. Test responsive design...');
    
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    this.report.responsive = {};
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Laisser le temps au responsive
      
      const responsiveCheck = await page.evaluate((viewportName) => {
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        const visibleElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length;
        
        // Vérifier les éléments de navigation
        const nav = document.querySelector('nav, .nav, .navbar');
        const navVisible = nav ? getComputedStyle(nav).display !== 'none' : false;
        
        // Vérifier les boutons et liens
        const clickableElements = document.querySelectorAll('button, a, input[type="submit"]');
        const tooSmallElements = Array.from(clickableElements).filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44; // Standards d'accessibilité
        });
        
        return {
          hasHorizontalScroll,
          visibleElements,
          navVisible,
          tooSmallClickable: tooSmallElements.length,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        };
      }, viewport.name);
      
      this.report.responsive[viewport.name] = responsiveCheck;
      
      console.log(`   📱 ${viewport.name} (${viewport.width}x${viewport.height}):`);
      console.log(`      Scroll horizontal: ${responsiveCheck.hasHorizontalScroll ? '❌' : '✅'}`);
      console.log(`      Navigation visible: ${responsiveCheck.navVisible ? '✅' : '⚠️'}`);
      console.log(`      Éléments trop petits: ${responsiveCheck.tooSmallClickable}`);
      
      if (responsiveCheck.hasHorizontalScroll) {
        this.issues.push({
          type: 'responsive_overflow',
          viewport: viewport.name,
          details: responsiveCheck
        });
      }
    }
    
    // Remettre en desktop pour la suite
    await page.setViewport({ width: 1920, height: 1080 });
  }

  async checkColorScheme(page) {
    console.log('\n🎨 5. Analyse du scheme de couleurs...');
    
    const colorCheck = await page.evaluate(() => {
      const body = document.body;
      const root = document.documentElement;
      
      // Couleurs principales
      const bodyStyles = getComputedStyle(body);
      const rootStyles = getComputedStyle(root);
      
      // Analyser les couleurs des éléments importants
      const hero = document.querySelector('h1, .hero, [class*="hero"]') || document.querySelector('header');
      const buttons = Array.from(document.querySelectorAll('button, .btn, [class*="btn"]'));
      const links = Array.from(document.querySelectorAll('a'));
      
      const colors = {
        background: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        hero: hero ? getComputedStyle(hero).color : 'none',
        buttons: buttons.slice(0, 3).map(btn => ({
          bg: getComputedStyle(btn).backgroundColor,
          color: getComputedStyle(btn).color,
          border: getComputedStyle(btn).borderColor
        })),
        links: links.slice(0, 5).map(link => getComputedStyle(link).color)
      };
      
      // Détecter les problèmes de contraste
      const hasTransparentBackground = bodyStyles.backgroundColor === 'rgba(0, 0, 0, 0)';
      const hasDefaultText = bodyStyles.color === 'rgb(0, 0, 0)' || bodyStyles.color === 'black';
      
      return {
        colors,
        issues: {
          transparentBackground: hasTransparentBackground,
          defaultTextColor: hasDefaultText
        }
      };
    });
    
    this.report.styles.colors = colorCheck;
    
    console.log(`   🎨 Background: ${colorCheck.colors.background}`);
    console.log(`   📝 Text color: ${colorCheck.colors.color}`);
    console.log(`   🔵 Boutons: ${colorCheck.colors.buttons.length} analysés`);
    
    if (colorCheck.issues.transparentBackground) {
      console.log('   ⚠️ Background transparent détecté');
      this.issues.push({
        type: 'transparent_background',
        details: colorCheck
      });
    }
    
    if (colorCheck.issues.defaultTextColor) {
      console.log('   ⚠️ Couleur de texte par défaut (noir)');
    }
  }

  async checkTypography(page) {
    console.log('\n📝 6. Analyse de la typographie...');
    
    const typoCheck = await page.evaluate(() => {
      const body = document.body;
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      const p = document.querySelector('p');
      
      const fonts = {
        body: getComputedStyle(body).fontFamily,
        h1: h1 ? getComputedStyle(h1) : null,
        h2: h2 ? getComputedStyle(h2) : null,
        p: p ? getComputedStyle(p) : null
      };
      
      // Vérifier si les fonts se chargent
      const fontLoadCheck = document.fonts ? document.fonts.size : 0;
      
      return {
        fonts,
        fontCount: fontLoadCheck,
        customFontsLoaded: fontLoadCheck > 0
      };
    });
    
    this.report.styles.typography = typoCheck;
    
    console.log(`   📖 Font principale: ${typoCheck.fonts.body}`);
    console.log(`   🔤 Fonts chargées: ${typoCheck.fontCount}`);
    console.log(`   ✅ Fonts personnalisées: ${typoCheck.customFontsLoaded ? 'OUI' : 'NON'}`);
    
    if (typoCheck.fonts.body.includes('Times') || typoCheck.fonts.body === 'serif') {
      console.log('   ⚠️ Font par défaut détectée (Times/serif)');
      this.issues.push({
        type: 'default_font',
        font: typoCheck.fonts.body
      });
    }
  }

  async checkNavigation(page) {
    console.log('\n🧭 7. Test de navigation...');
    
    const navCheck = await page.evaluate(() => {
      const navElements = document.querySelectorAll('nav, .nav, .navbar, header a');
      const links = Array.from(document.querySelectorAll('a[href]'));
      
      const linkAnalysis = links.map(link => ({
        href: link.href,
        text: link.textContent.trim(),
        isInternal: link.href.includes(window.location.hostname) || link.href.startsWith('/'),
        hasTarget: !!link.target,
        visible: getComputedStyle(link).display !== 'none'
      }));
      
      const internalLinks = linkAnalysis.filter(l => l.isInternal);
      const externalLinks = linkAnalysis.filter(l => !l.isInternal);
      
      return {
        navElements: navElements.length,
        totalLinks: links.length,
        internalLinks: internalLinks.length,
        externalLinks: externalLinks.length,
        visibleLinks: linkAnalysis.filter(l => l.visible).length,
        linkDetails: linkAnalysis.slice(0, 10)
      };
    });
    
    this.report.layout.navigation = navCheck;
    
    console.log(`   🧭 Éléments navigation: ${navCheck.navElements}`);
    console.log(`   🔗 Links totaux: ${navCheck.totalLinks}`);
    console.log(`   🏠 Links internes: ${navCheck.internalLinks}`);
    console.log(`   🌐 Links externes: ${navCheck.externalLinks}`);
    console.log(`   👁️ Links visibles: ${navCheck.visibleLinks}`);
  }

  async checkPerformanceVisuals(page) {
    console.log('\n⚡ 8. Métriques de performance visuelle...');
    
    const perfMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach(entry => {
            if (entry.entryType === 'paint') {
              metrics[entry.name] = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
          });
          
          observer.disconnect();
          resolve(metrics);
        });
        
        observer.observe({ type: 'paint', buffered: true });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        
        setTimeout(() => {
          observer.disconnect();
          resolve({});
        }, 3000);
      });
    });
    
    this.report.performance = perfMetrics;
    
    console.log(`   🎨 First Paint: ${Math.round(perfMetrics['first-paint'] || 0)}ms`);
    console.log(`   🖼️ First Contentful Paint: ${Math.round(perfMetrics['first-contentful-paint'] || 0)}ms`);
    console.log(`   📏 Largest Contentful Paint: ${Math.round(perfMetrics.lcp || 0)}ms`);
    
    if (perfMetrics['first-contentful-paint'] > 2000) {
      this.issues.push({
        type: 'slow_fcp',
        value: perfMetrics['first-contentful-paint']
      });
    }
  }

  async takeScreenshots(page) {
    console.log('\n📸 9. Captures d\'écran diagnostic...');
    
    // Desktop full page
    await page.screenshot({ 
      path: 'windventure-desktop-full.png', 
      fullPage: true 
    });
    console.log('   ✅ Desktop full page sauvée');
    
    // Mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'windventure-mobile.png',
      fullPage: true 
    });
    console.log('   ✅ Mobile screenshot sauvée');
    
    // Tablet viewport  
    await page.setViewport({ width: 768, height: 1024 });
    await page.screenshot({ 
      path: 'windventure-tablet.png',
      fullPage: true 
    });
    console.log('   ✅ Tablet screenshot sauvée');
    
    // Remettre en desktop
    await page.setViewport({ width: 1920, height: 1080 });
    
    this.report.screenshots = [
      'windventure-desktop-full.png',
      'windventure-mobile.png', 
      'windventure-tablet.png'
    ];
  }

  generateRecommendations() {
    console.log('\n💡 10. Génération des recommandations...');
    
    // Analyser les problèmes et générer des solutions
    this.issues.forEach(issue => {
      switch (issue.type) {
        case 'tailwind_issue':
          this.report.recommendations.push({
            priority: 'HIGH',
            category: 'Styles',
            issue: 'Tailwind CSS non fonctionnel',
            solution: 'Vérifier le CSP style-src et la configuration Tailwind',
            action: 'Ajuster middleware.ts et globals.css'
          });
          break;
          
        case 'layout_overflow':
          this.report.recommendations.push({
            priority: 'MEDIUM',
            category: 'Layout',
            issue: `${issue.count} éléments débordent`,
            solution: 'Ajuster les largeurs et utiliser overflow-hidden',
            action: 'Réviser les classes Tailwind max-w-* et w-full'
          });
          break;
          
        case 'broken_images':
          this.report.recommendations.push({
            priority: 'HIGH',
            category: 'Images',
            issue: `${issue.count} images cassées`,
            solution: 'Vérifier les chemins et optimiser avec Next/Image',
            action: 'Corriger les URLs et ajouter les images manquantes'
          });
          break;
          
        case 'responsive_overflow':
          this.report.recommendations.push({
            priority: 'MEDIUM',
            category: 'Responsive',
            issue: `Débordement sur ${issue.viewport}`,
            solution: 'Utiliser des breakpoints Tailwind appropriés',
            action: 'Ajouter classes responsive (sm:, md:, lg:)'
          });
          break;
          
        case 'transparent_background':
          this.report.recommendations.push({
            priority: 'LOW',
            category: 'Design',
            issue: 'Background transparent',
            solution: 'Définir une couleur de fond',
            action: 'Ajouter bg-white ou bg-gray-50 au body'
          });
          break;
          
        case 'default_font':
          this.report.recommendations.push({
            priority: 'LOW',
            category: 'Typography',
            issue: 'Font par défaut utilisée',
            solution: 'Configurer des fonts personnalisées',
            action: 'Ajouter Google Fonts ou fonts système'
          });
          break;
      }
    });
    
    // Recommandations générales
    if (this.report.images.missingAlt > 0) {
      this.report.recommendations.push({
        priority: 'LOW',
        category: 'Accessibilité',
        issue: `${this.report.images.missingAlt} images sans ALT`,
        solution: 'Ajouter des descriptions ALT appropriées',
        action: 'Compléter les attributs alt des images'
      });
    }
  }

  displayVisualReport() {
    console.log('\n📊 RAPPORT VISUEL COMPLET');
    console.log('═'.repeat(60));
    
    const issueCount = this.issues.length;
    const highPriority = this.report.recommendations.filter(r => r.priority === 'HIGH').length;
    
    console.log(`\n🎯 STATUT GLOBAL: ${issueCount === 0 ? '✅ EXCELLENT' : highPriority > 0 ? '🚨 CRITIQUE' : '⚠️ AMÉLIORATIONS POSSIBLES'}`);
    
    console.log('\n📊 RÉSUMÉ PAR CATÉGORIE:');
    console.log(`   🎨 Styles Tailwind: ${this.report.styles.tailwind ? '✅' : '❌'}`);
    console.log(`   📐 Layout: ${this.report.layout.overflow === 0 ? '✅' : '⚠️'} (${this.report.layout.overflow} débordements)`);
    console.log(`   🖼️ Images: ${this.report.images.broken === 0 ? '✅' : '❌'} (${this.report.images.loaded}/${this.report.images.total})`);
    console.log(`   📱 Responsive: ${Object.values(this.report.responsive).filter(r => r.hasHorizontalScroll).length === 0 ? '✅' : '⚠️'}`);
    console.log(`   ⚡ Performance: ${this.report.performance['first-contentful-paint'] < 2000 ? '✅' : '⚠️'}`);
    
    if (this.report.recommendations.length > 0) {
      console.log('\n💡 RECOMMANDATIONS PRIORITAIRES:');
      this.report.recommendations
        .sort((a, b) => {
          const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priority[b.priority] - priority[a.priority];
        })
        .slice(0, 5)
        .forEach((rec, index) => {
          const emoji = rec.priority === 'HIGH' ? '🚨' : rec.priority === 'MEDIUM' ? '⚠️' : '📋';
          console.log(`   ${emoji} ${index + 1}. [${rec.category}] ${rec.issue}`);
          console.log(`      → ${rec.solution}`);
          console.log(`      💡 ${rec.action}`);
          console.log('');
        });
    }
    
    console.log('\n📸 CAPTURES GÉNÉRÉES:');
    this.report.screenshots.forEach(screenshot => {
      console.log(`   📷 ${screenshot}`);
    });
    
    console.log('\n📄 RAPPORT DÉTAILLÉ: windventure-visual-report.json');
    
    // Sauvegarder le rapport complet
    fs.writeFileSync('windventure-visual-report.json', JSON.stringify(this.report, null, 2));
    
    console.log('═'.repeat(60));
    
    console.log('\n🛠️ PROCHAINES ACTIONS RECOMMANDÉES:');
    if (highPriority > 0) {
      console.log('   🚨 URGENT: Corriger les problèmes HIGH priority');
      console.log('   1. Vérifier les styles Tailwind');
      console.log('   2. Corriger les images cassées');
      console.log('   3. Ajuster le responsive design');
    } else {
      console.log('   ✅ Site fonctionnel - optimisations mineures possibles');
      console.log('   1. Améliorer l\'accessibilité (ALT images)');
      console.log('   2. Peaufiner le design');
      console.log('   3. Optimiser les performances');
    }
  }
}

// Exécution
if (require.main === module) {
  const diagnostic = new WindventureVisualDiagnostic();
  diagnostic.runComplete().catch(console.error);
}

module.exports = WindventureVisualDiagnostic;