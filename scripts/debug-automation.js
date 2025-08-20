#!/usr/bin/env node

/**
 * Script de debug automatisé pour Windventure
 * Détecte et corrige automatiquement les problèmes courants
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DebugAutomation {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
  }

  // Vérifier l'environnement
  checkEnvironment() {
    console.log('🔍 Checking environment...\n');

    // Vérifier Node.js version
    const nodeVersion = process.version;
    const requiredVersion = 'v18.0.0';
    if (nodeVersion < requiredVersion) {
      this.errors.push(`Node.js version ${nodeVersion} is below required ${requiredVersion}`);
    }

    // Vérifier les variables d'environnement
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
    ];

    const envFile = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envFile)) {
      this.errors.push('.env.local file not found');
    } else {
      const envContent = fs.readFileSync(envFile, 'utf8');
      requiredEnvVars.forEach(varName => {
        if (!envContent.includes(varName)) {
          this.warnings.push(`Missing environment variable: ${varName}`);
        }
      });
    }

    // Vérifier les dépendances
    try {
      execSync('npm ls --depth=0', { stdio: 'ignore' });
    } catch (error) {
      this.warnings.push('Some dependencies have issues. Running npm install...');
      this.autoFix('npm install', 'Installing dependencies');
    }
  }

  // Vérifier le code TypeScript
  checkTypeScript() {
    console.log('🔍 Checking TypeScript...\n');

    try {
      execSync('npm run type-check', { stdio: 'pipe' });
      console.log('✅ TypeScript check passed');
    } catch (error) {
      const output = error.stdout?.toString() || error.message;
      this.errors.push('TypeScript errors found');
      
      // Analyser les erreurs courantes
      if (output.includes('Cannot find module')) {
        this.autoFix('npm install', 'Installing missing modules');
      }
      
      if (output.includes('Property') && output.includes('does not exist')) {
        this.warnings.push('Type definition issues detected. Review type definitions.');
      }
    }
  }

  // Vérifier ESLint
  checkLinting() {
    console.log('🔍 Checking ESLint...\n');

    try {
      const result = execSync('npm run lint', { stdio: 'pipe' });
      console.log('✅ ESLint check passed');
    } catch (error) {
      this.warnings.push('ESLint issues found');
      
      // Tenter une correction automatique
      try {
        execSync('npx eslint . --fix', { stdio: 'pipe' });
        this.fixes.push('Applied automatic ESLint fixes');
      } catch (fixError) {
        this.errors.push('Some ESLint errors require manual fixing');
      }
    }
  }

  // Vérifier le build
  checkBuild() {
    console.log('🔍 Checking build...\n');

    // Nettoyer le cache si nécessaire
    if (fs.existsSync('.next')) {
      const buildTime = fs.statSync('.next').mtime;
      const hoursSinceBuild = (Date.now() - buildTime) / (1000 * 60 * 60);
      
      if (hoursSinceBuild > 24) {
        console.log('Build cache is old, clearing...');
        this.autoFix('rm -rf .next', 'Clearing build cache');
      }
    }

    try {
      console.log('Building application (this may take a few minutes)...');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build successful');
    } catch (error) {
      this.errors.push('Build failed');
      
      // Analyser les erreurs de build courantes
      const output = error.stdout?.toString() || '';
      
      if (output.includes('out of memory')) {
        this.autoFix('export NODE_OPTIONS="--max-old-space-size=4096" && npm run build', 
                      'Increasing memory allocation');
      }
      
      if (output.includes('Module not found')) {
        this.autoFix('npm install && npm run build', 'Reinstalling dependencies');
      }
    }
  }

  // Vérifier les tests
  checkTests() {
    console.log('🔍 Checking tests...\n');

    // Tests unitaires
    if (fs.existsSync('vitest.config.ts')) {
      try {
        execSync('npm run test:unit', { stdio: 'pipe' });
        console.log('✅ Unit tests passed');
      } catch (error) {
        this.warnings.push('Some unit tests are failing');
      }
    }

    // Tests E2E
    try {
      execSync('npx playwright test --list', { stdio: 'pipe' });
      console.log('✅ Playwright tests configured');
    } catch (error) {
      this.warnings.push('Playwright not properly configured');
      this.autoFix('npx playwright install', 'Installing Playwright browsers');
    }
  }

  // Vérifier la sécurité
  checkSecurity() {
    console.log('🔍 Checking security...\n');

    try {
      const auditResult = execSync('npm audit --json', { stdio: 'pipe' });
      const audit = JSON.parse(auditResult.toString());
      
      if (audit.metadata.vulnerabilities.total > 0) {
        const critical = audit.metadata.vulnerabilities.critical;
        const high = audit.metadata.vulnerabilities.high;
        
        if (critical > 0 || high > 0) {
          this.errors.push(`Found ${critical} critical and ${high} high vulnerabilities`);
          this.autoFix('npm audit fix --force', 'Fixing vulnerabilities');
        } else {
          this.warnings.push(`Found ${audit.metadata.vulnerabilities.total} low/moderate vulnerabilities`);
        }
      } else {
        console.log('✅ No security vulnerabilities found');
      }
    } catch (error) {
      this.warnings.push('Could not complete security audit');
    }
  }

  // Vérifier les performances
  checkPerformance() {
    console.log('🔍 Checking performance metrics...\n');

    // Vérifier la taille du bundle
    if (fs.existsSync('.next')) {
      const getBundleSize = (dir) => {
        let totalSize = 0;
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            totalSize += getBundleSize(filePath);
          } else {
            totalSize += stat.size;
          }
        });
        
        return totalSize;
      };

      const bundleSize = getBundleSize('.next/static');
      const sizeMB = (bundleSize / (1024 * 1024)).toFixed(2);
      
      if (sizeMB > 5) {
        this.warnings.push(`Bundle size is ${sizeMB}MB (recommended: < 5MB)`);
      } else {
        console.log(`✅ Bundle size: ${sizeMB}MB`);
      }
    }
  }

  // Appliquer une correction automatique
  autoFix(command, description) {
    console.log(`🔧 ${description}...`);
    try {
      execSync(command, { stdio: 'inherit' });
      this.fixes.push(description);
    } catch (error) {
      this.errors.push(`Failed to apply fix: ${description}`);
    }
  }

  // Générer un rapport
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DEBUG AUTOMATION REPORT');
    console.log('='.repeat(60) + '\n');

    if (this.fixes.length > 0) {
      console.log('✅ FIXES APPLIED:');
      this.fixes.forEach(fix => console.log(`   - ${fix}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('❌ ERRORS (require manual intervention):');
      this.errors.forEach(error => console.log(`   - ${error}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
      console.log('');
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 All checks passed! Your project is healthy.');
    }

    // Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      errors: this.errors,
      warnings: this.warnings,
      status: this.errors.length === 0 ? 'success' : 'failed'
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'debug-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📁 Full report saved to debug-report.json');

    // Retourner le code de sortie approprié
    process.exit(this.errors.length > 0 ? 1 : 0);
  }

  // Exécuter tous les checks
  async run() {
    console.log('🚀 Starting automated debug process...\n');
    console.log('='.repeat(60) + '\n');

    this.checkEnvironment();
    this.checkTypeScript();
    this.checkLinting();
    this.checkSecurity();
    this.checkBuild();
    this.checkTests();
    this.checkPerformance();

    this.generateReport();
  }
}

// Exécution
if (require.main === module) {
  const debugger = new DebugAutomation();
  debugger.run();
}

module.exports = DebugAutomation;