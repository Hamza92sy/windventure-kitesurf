#!/usr/bin/env node

/**
 * 🔍 Diagnostic CSP Live pour windventure.fr
 * Analyse en temps réel du Content Security Policy et génère des recommandations
 */

const https = require('https');
const puppeteer = require('puppeteer');
const fs = require('fs');

class CSPLiveDiagnostic {
  constructor() {
    this.results = {
      headers: {},
      violations: [],
      recommendations: [],
      status: 'unknown'
    };
  }

  async run() {
    console.log('🔍 DIAGNOSTIC CSP LIVE - windventure.fr');
    console.log('═'.repeat(50));
    
    await this.checkHeaders();
    await this.checkBrowserViolations();
    await this.generateRecommendations();
    this.displayResults();
  }

  async checkHeaders() {
    console.log('\n📡 1. Vérification des headers HTTP...');
    
    return new Promise((resolve) => {
      const req = https.request('https://windventure.fr', { method: 'HEAD' }, (res) => {
        console.log(`   Status: ${res.statusCode}`);
        
        // Vérifier CSP
        const csp = res.headers['content-security-policy'];
        const cspRO = res.headers['content-security-policy-report-only'];
        
        if (csp) {
          console.log('   ✅ CSP Header détecté:');
          console.log(`      ${csp}`);
          this.results.headers.csp = csp;
        } else {
          console.log('   ❌ Aucun header CSP détecté');
          this.results.headers.csp = null;
        }
        
        if (cspRO) {
          console.log('   📊 CSP Report-Only détecté:');
          console.log(`      ${cspRO}`);
          this.results.headers.cspReportOnly = cspRO;
        }
        
        // Autres headers de sécurité
        const securityHeaders = {
          'x-frame-options': 'X-Frame-Options',
          'x-content-type-options': 'X-Content-Type-Options',
          'strict-transport-security': 'Strict-Transport-Security',
          'referrer-policy': 'Referrer-Policy'
        };
        
        console.log('   🔒 Autres headers de sécurité:');
        Object.entries(securityHeaders).forEach(([key, name]) => {
          if (res.headers[key]) {
            console.log(`      ✅ ${name}: ${res.headers[key]}`);
            this.results.headers[key] = res.headers[key];
          } else {
            console.log(`      ❌ ${name}: absent`);
            this.results.headers[key] = null;
          }
        });
        
        resolve();
      });
      
      req.on('error', (err) => {
        console.error('   ❌ Erreur requête:', err.message);
        resolve();
      });
      
      req.end();
    });
  }

  async checkBrowserViolations() {
    console.log('\n🌐 2. Test violations CSP dans le navigateur...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Intercepter les violations CSP
    page.on('console', msg => {
      if (msg.text().includes('Content Security Policy') || 
          msg.text().includes('Refused to') ||
          msg.text().includes('blocked by')) {
        this.results.violations.push({
          type: 'csp',
          message: msg.text(),
          level: msg.type()
        });
        console.log(`   🚨 Violation: ${msg.text()}`);
      }
    });
    
    // Intercepter les erreurs de chargement
    page.on('response', response => {
      if (response.status() >= 400) {
        this.results.violations.push({
          type: 'network',
          url: response.url(),
          status: response.status(),
          resourceType: response.request().resourceType()
        });
        console.log(`   ❌ Erreur ${response.status()}: ${response.url()}`);
      }
    });
    
    try {
      await page.goto('https://windventure.fr', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Attendre le chargement complet
      await page.waitForTimeout(3000);
      
      // Vérifier si Tailwind CSS est chargé
      const tailwindCheck = await page.evaluate(() => {
        const el = document.documentElement;
        const style = getComputedStyle(el);
        
        return {
          hasTailwindVar: !!style.getPropertyValue('--tw-bg-opacity'),
          hasClassUtility: !!document.querySelector('[class*="bg-"]'),
          backgroundColor: style.backgroundColor,
          fontFamily: style.fontFamily
        };
      });
      
      console.log('   🎨 État Tailwind CSS:');
      console.log(`      Variables CSS: ${tailwindCheck.hasTailwindVar ? '✅' : '❌'}`);
      console.log(`      Classes utilitaires: ${tailwindCheck.hasClassUtility ? '✅' : '❌'}`);
      console.log(`      Background: ${tailwindCheck.backgroundColor}`);
      console.log(`      Font: ${tailwindCheck.fontFamily}`);
      
      this.results.tailwindStatus = tailwindCheck;
      
      // Vérifier les assets Next.js
      const nextAssets = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const links = Array.from(document.querySelectorAll('link[href]'));
        
        return {
          nextScripts: scripts.filter(s => s.src.includes('/_next/')).length,
          nextStyles: links.filter(l => l.href.includes('/_next/')).length,
          totalScripts: scripts.length,
          totalLinks: links.length
        };
      });
      
      console.log('   🚀 Assets Next.js:');
      console.log(`      Scripts Next.js: ${nextAssets.nextScripts}/${nextAssets.totalScripts}`);
      console.log(`      Styles Next.js: ${nextAssets.nextStyles}/${nextAssets.totalLinks}`);
      
      this.results.nextAssets = nextAssets;
      
    } catch (error) {
      console.error('   ❌ Erreur navigation:', error.message);
      this.results.violations.push({
        type: 'navigation',
        message: error.message
      });
    } finally {
      await browser.close();
    }
    
    console.log(`   📊 Total violations détectées: ${this.results.violations.length}`);
  }

  generateRecommendations() {
    console.log('\n💡 3. Génération des recommandations...');
    
    // Analyser les résultats et générer des recommandations
    if (!this.results.headers.csp) {
      this.results.recommendations.push({
        priority: 'HIGH',
        action: 'Implémenter CSP',
        description: 'Aucun header Content-Security-Policy détecté',
        solution: 'Utiliser middleware.ts ou vercel.json'
      });
    }
    
    if (!this.results.headers['x-frame-options']) {
      this.results.recommendations.push({
        priority: 'MEDIUM',
        action: 'Ajouter X-Frame-Options',
        description: 'Protection contre le clickjacking manquante',
        solution: 'Ajouter X-Frame-Options: DENY'
      });
    }
    
    if (this.results.violations.filter(v => v.type === 'csp').length > 0) {
      this.results.recommendations.push({
        priority: 'HIGH',
        action: 'Corriger violations CSP',
        description: `${this.results.violations.filter(v => v.type === 'csp').length} violations détectées`,
        solution: 'Ajuster les directives CSP pour autoriser les ressources légitimes'
      });
    }
    
    if (!this.results.tailwindStatus?.hasTailwindVar) {
      this.results.recommendations.push({
        priority: 'HIGH',
        action: 'Réparer Tailwind CSS',
        description: 'Tailwind CSS ne semble pas chargé correctement',
        solution: 'Vérifier la CSP style-src et script-src'
      });
    }
    
    if (this.results.violations.filter(v => v.type === 'network').length > 0) {
      this.results.recommendations.push({
        priority: 'MEDIUM',
        action: 'Corriger erreurs réseau',
        description: `${this.results.violations.filter(v => v.type === 'network').length} ressources en erreur`,
        solution: 'Vérifier les URLs et la configuration du serveur'
      });
    }
    
    // Déterminer le statut global
    const highPriorityIssues = this.results.recommendations.filter(r => r.priority === 'HIGH').length;
    if (highPriorityIssues === 0) {
      this.results.status = 'healthy';
    } else if (highPriorityIssues <= 2) {
      this.results.status = 'warning';
    } else {
      this.results.status = 'critical';
    }
  }

  displayResults() {
    console.log('\n📊 RÉSULTATS DU DIAGNOSTIC');
    console.log('═'.repeat(50));
    
    const statusEmoji = {
      healthy: '✅',
      warning: '⚠️',
      critical: '🚨'
    };
    
    console.log(`\n🎯 Statut global: ${statusEmoji[this.results.status]} ${this.results.status.toUpperCase()}`);
    
    console.log('\n🔒 HEADERS DE SÉCURITÉ:');
    console.log(`   CSP: ${this.results.headers.csp ? '✅ Présent' : '❌ Absent'}`);
    console.log(`   X-Frame-Options: ${this.results.headers['x-frame-options'] ? '✅' : '❌'}`);
    console.log(`   HSTS: ${this.results.headers['strict-transport-security'] ? '✅' : '❌'}`);
    
    console.log('\n🎨 ÉTAT VISUEL:');
    if (this.results.tailwindStatus) {
      console.log(`   Tailwind CSS: ${this.results.tailwindStatus.hasTailwindVar ? '✅ Actif' : '❌ Inactif'}`);
      console.log(`   Classes utilitaires: ${this.results.tailwindStatus.hasClassUtility ? '✅' : '❌'}`);
    }
    
    console.log('\n🚀 ASSETS NEXT.JS:');
    if (this.results.nextAssets) {
      console.log(`   Scripts: ${this.results.nextAssets.nextScripts} chargés`);
      console.log(`   Styles: ${this.results.nextAssets.nextStyles} chargés`);
    }
    
    if (this.results.violations.length > 0) {
      console.log('\n🚨 VIOLATIONS DÉTECTÉES:');
      this.results.violations.slice(0, 5).forEach((violation, index) => {
        console.log(`   ${index + 1}. [${violation.type.toUpperCase()}] ${violation.message || violation.url}`);
      });
      
      if (this.results.violations.length > 5) {
        console.log(`   ... et ${this.results.violations.length - 5} autres violations`);
      }
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMANDATIONS:');
      this.results.recommendations.forEach((rec, index) => {
        const emoji = rec.priority === 'HIGH' ? '🚨' : rec.priority === 'MEDIUM' ? '⚠️' : '📋';
        console.log(`   ${emoji} ${rec.action}`);
        console.log(`      ${rec.description}`);
        console.log(`      → ${rec.solution}`);
        console.log('');
      });
    }
    
    console.log('🛠️ ACTIONS IMMÉDIATES:');
    if (!this.results.headers.csp) {
      console.log('   1. Copier middleware.ts fourni dans la solution');
      console.log('   2. Lancer: npm run build && npm run deploy');
      console.log('   3. Tester: npm run test:csp:prod');
    } else {
      console.log('   1. Analyser les violations CSP');
      console.log('   2. Ajuster les directives dans middleware.ts');
      console.log('   3. Redéployer et retester');
    }
    
    console.log('\n📄 Rapport complet sauvé: csp-diagnostic-report.json');
    
    // Sauvegarder le rapport
    fs.writeFileSync('csp-diagnostic-report.json', JSON.stringify(this.results, null, 2));
    
    console.log('═'.repeat(50));
  }
}

// Exécution
if (require.main === module) {
  const diagnostic = new CSPLiveDiagnostic();
  diagnostic.run().catch(console.error);
}

module.exports = CSPLiveDiagnostic;