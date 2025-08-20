#!/usr/bin/env node

// scripts/generate-report.js  
// Générateur de rapport complet pour Windventure.fr

const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor() {
    this.reportData = {
      timestamp: new Date().toISOString(),
      site: 'windventure.fr',
      version: this.getPackageVersion(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  async run() {
    console.log('📊 GÉNÉRATEUR DE RAPPORT WINDVENTURE.FR');
    console.log('═'.repeat(45));
    
    try {
      // Collecter les données
      await this.collectSystemInfo();
      await this.collectBuildInfo();  
      await this.collectFileStats();
      await this.collectDiagnosticInfo();
      await this.collectPerformanceInfo();
      
      // Générer le rapport
      const report = this.generateReport();
      const filename = `reports/windventure-report-${new Date().toISOString().slice(0,10)}.md`;
      
      // Créer le dossier si nécessaire
      if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports', { recursive: true });
      }
      
      fs.writeFileSync(filename, report);
      
      console.log(`✅ Rapport généré: ${filename}`);
      console.log('\n📋 Contenu du rapport:');
      console.log('   • Informations système');
      console.log('   • Status de build');
      console.log('   • Statistiques des fichiers');
      console.log('   • Diagnostic visuel');
      console.log('   • Métriques de performance');
      
    } catch (error) {
      console.error('❌ Erreur génération rapport:', error.message);
      process.exit(1);
    }
  }
  
  getPackageVersion() {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.version;
    } catch (error) {
      return 'unknown';
    }
  }
  
  async collectSystemInfo() {
    this.reportData.system = {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      uptime: Math.round(process.uptime()) + 's'
    };
  }
  
  async collectBuildInfo() {
    this.reportData.build = {
      nextExists: fs.existsSync('.next'),
      buildTime: this.getFileModified('.next'),
      size: this.getDirectorySize('.next'),
      status: fs.existsSync('.next/BUILD_ID') ? 'success' : 'unknown'
    };
  }
  
  async collectFileStats() {
    const stats = {
      components: this.countFiles('components', ['.js', '.jsx', '.ts', '.tsx']),
      pages: this.countFiles('src/app', ['.js', '.jsx', '.ts', '.tsx']),  
      styles: this.countFiles('src', ['.css']),
      scripts: this.countFiles('scripts', ['.js', '.ts', '.sh']),
      assets: this.countFiles('public', ['.png', '.jpg', '.svg', '.ico'])
    };
    
    this.reportData.files = stats;
  }
  
  async collectDiagnosticInfo() {
    const diagnosticFile = 'windventure-visual-report.json';
    
    if (fs.existsSync(diagnosticFile)) {
      try {
        const diagnostic = JSON.parse(fs.readFileSync(diagnosticFile, 'utf8'));
        this.reportData.diagnostic = {
          exists: true,
          timestamp: diagnostic.timestamp,
          issues: diagnostic.recommendations?.length || 0,
          screenshots: diagnostic.screenshots?.length || 0
        };
      } catch (error) {
        this.reportData.diagnostic = { exists: false, error: error.message };
      }
    } else {
      this.reportData.diagnostic = { exists: false };
    }
  }
  
  async collectPerformanceInfo() {
    const buildLog = this.getLatestBuildLog();
    
    if (buildLog) {
      try {
        const content = fs.readFileSync(buildLog, 'utf8');
        const routeMatches = content.match(/Route \(app\).*?\n([\s\S]*?)(?=\n\n|\nƒ)/);
        
        this.reportData.performance = {
          buildLogExists: true,
          routes: routeMatches ? routeMatches[1].split('\n').length - 1 : 0,
          warnings: (content.match(/⚠/g) || []).length,
          errors: (content.match(/❌|Error:/g) || []).length
        };
      } catch (error) {
        this.reportData.performance = { error: error.message };
      }
    } else {
      this.reportData.performance = { buildLogExists: false };
    }
  }
  
  getLatestBuildLog() {
    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) return null;
    
    const buildLogs = fs.readdirSync(reportsDir)
      .filter(file => file.startsWith('build-') && file.endsWith('.log'))
      .map(file => ({
        name: file,
        path: path.join(reportsDir, file),
        modified: fs.statSync(path.join(reportsDir, file)).mtime
      }))
      .sort((a, b) => b.modified - a.modified);
      
    return buildLogs.length > 0 ? buildLogs[0].path : null;
  }
  
  getFileModified(filePath) {
    try {
      return fs.existsSync(filePath) ? 
        fs.statSync(filePath).mtime.toISOString() : null;
    } catch (error) {
      return null;
    }
  }
  
  getDirectorySize(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) return '0MB';
      
      let size = 0;
      const traverse = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            traverse(filePath);
          } else {
            size += stats.size;
          }
        }
      };
      
      traverse(dirPath);
      return Math.round(size / 1024 / 1024) + 'MB';
    } catch (error) {
      return 'error';
    }
  }
  
  countFiles(directory, extensions) {
    try {
      if (!fs.existsSync(directory)) return 0;
      
      let count = 0;
      const traverse = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isDirectory()) {
            traverse(filePath);
          } else if (extensions.some(ext => file.endsWith(ext))) {
            count++;
          }
        }
      };
      
      traverse(directory);
      return count;
    } catch (error) {
      return 0;
    }
  }
  
  generateReport() {
    const { timestamp, site, version, system, build, files, diagnostic, performance } = this.reportData;
    
    return `# 📊 Rapport Windventure.fr

**Date**: ${new Date(timestamp).toLocaleString('fr-FR')}  
**Site**: ${site}  
**Version**: ${version}  
**Environnement**: ${this.reportData.environment}

## 🖥️ Système

- **Node.js**: ${system.node}
- **Plateforme**: ${system.platform} (${system.arch})
- **Mémoire**: ${system.memory}
- **Uptime**: ${system.uptime}

## 🏗️ Build

- **Status**: ${build.status}
- **Build existe**: ${build.nextExists ? '✅' : '❌'}
- **Dernière compilation**: ${build.buildTime || 'Inconnue'}
- **Taille**: ${build.size}

## 📁 Fichiers

| Type | Nombre |
|------|---------|
| Composants | ${files.components} |
| Pages | ${files.pages} |
| Styles | ${files.styles} |
| Scripts | ${files.scripts} |
| Assets | ${files.assets} |

## 🔍 Diagnostic

- **Rapport disponible**: ${diagnostic.exists ? '✅' : '❌'}
- **Dernière analyse**: ${diagnostic.timestamp || 'Aucune'}
- **Problèmes détectés**: ${diagnostic.issues || 0}
- **Screenshots**: ${diagnostic.screenshots || 0}

## ⚡ Performance

- **Build log**: ${performance.buildLogExists ? '✅' : '❌'}
- **Routes générées**: ${performance.routes || 0}
- **Warnings**: ${performance.warnings || 0}
- **Erreurs**: ${performance.errors || 0}

## 🚀 Actions Recommandées

${this.generateRecommendations()}

---
*Rapport généré automatiquement le ${new Date(timestamp).toLocaleString('fr-FR')}*
`;
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    if (!this.reportData.build.nextExists) {
      recommendations.push('- 🏗️ Lancer `npm run build` pour générer le build');
    }
    
    if (!this.reportData.diagnostic.exists) {
      recommendations.push('- 🔍 Exécuter `npm run diagnostic:visual` pour analyser le site');
    }
    
    if (this.reportData.diagnostic.issues > 0) {
      recommendations.push('- 🔧 Corriger les problèmes avec `npm run fix:design`');
    }
    
    if (this.reportData.performance.errors > 0) {
      recommendations.push('- ❌ Corriger les erreurs de build détectées');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- ✅ Tout semble en ordre! Prêt pour le déploiement');
    }
    
    return recommendations.join('\n');
  }
}

// Exécution
if (require.main === module) {
  const generator = new ReportGenerator();
  generator.run();
}

module.exports = ReportGenerator;