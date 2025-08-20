#!/usr/bin/env node

// 📊 NOTION PROJECT MANAGER - Gestion automatique des projets Claude

require('dotenv').config();
const { NotionManager } = require('../lib/notion.js');
const { execSync } = require('child_process');
const fs = require('fs');

class NotionProjectManager {
  constructor() {
    this.notion = new NotionManager();
  }

  // 🚀 Créer un projet automatiquement depuis le git actuel
  async createCurrentProject(name, description = '') {
    try {
      // Récupérer les infos git actuelles
      const gitInfo = this.getGitInfo();
      
      const project = await this.notion.createProject({
        name: name,
        status: '🟢 En cours',
        type: this.detectProjectType(),
        priority: '📋 Normale',
        description: description || `Projet créé automatiquement par Claude`,
        repository: gitInfo.remote,
        branch: gitInfo.branch,
        commitSha: gitInfo.commit
      });
      
      console.log('✅ Projet créé dans Notion:', name);
      return project;
    } catch (error) {
      console.error('❌ Erreur création projet:', error.message);
      return null;
    }
  }

  // 🔄 Mettre à jour le projet Windventure
  async updateWindventureProject(status, results) {
    try {
      // Chercher le projet Windventure
      const project = await this.notion.findProjectByName('Windventure');
      
      if (project) {
        await this.notion.updateProjectStatus(project.id, status, results);
        console.log('✅ Projet Windventure mis à jour');
      } else {
        // Créer le projet s'il n'existe pas
        console.log('📝 Création du projet Windventure...');
        await this.createWindventureProject(status, results);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour Windventure:', error.message);
    }
  }

  // 🏗️ Créer le projet principal Windventure
  async createWindventureProject(status = '🟢 En cours', results = '') {
    const gitInfo = this.getGitInfo();
    
    const project = await this.notion.createProject({
      name: '🏄‍♂️ Windventure.fr - Kitesurf Premium Site',
      status: status,
      type: '🎨 Design/CSS',
      priority: '🔥 Critique',
      description: `Site vitrine premium pour école de kitesurf à Dakhla, Maroc.
      
✅ Fonctionnalités:
- Design responsive Tailwind CSS
- Système de réservation Stripe
- Galerie photos optimisée
- Blog intégré
- SEO optimisé

🔧 Stack technique:
- Next.js 14 App Router
- Tailwind CSS
- Stripe Payment
- Vercel déploiement`,
      repository: gitInfo.remote,
      branch: gitInfo.branch,
      commitSha: gitInfo.commit
    });

    // Ajouter les résultats si fournis
    if (results) {
      await this.notion.updateProjectStatus(project.id, status, results);
    }

    console.log('✅ Projet Windventure créé dans Notion');
    return project;
  }

  // 📊 Rapport quotidien automatique
  async generateDailyReport() {
    try {
      const stats = await this.notion.getProjectStats();
      const gitInfo = this.getGitInfo();
      
      const report = `🎯 RAPPORT QUOTIDIEN CLAUDE - ${new Date().toLocaleDateString()}

📊 STATISTIQUES PROJETS:
• Total: ${stats.total} projets
• En cours: ${stats.enCours}
• Terminés: ${stats.termines}
• Problèmes: ${stats.problemes}
• Urgents: ${stats.urgents}

🔧 REPOSITORY ACTUEL:
• Branch: ${gitInfo.branch}
• Dernier commit: ${gitInfo.commit.substring(0, 7)}
• Remote: ${gitInfo.remote}

📈 PRODUCTIVITÉ:
• Taux de réussite: ${stats.total > 0 ? Math.round((stats.termines / stats.total) * 100) : 0}%
• Projets actifs: ${stats.enCours}

Rapport généré automatiquement par Claude`;

      // Créer une entrée de rapport
      await this.notion.createProject({
        name: `📊 Rapport Quotidien - ${new Date().toLocaleDateString()}`,
        status: '✅ Terminé',
        type: '📊 Diagnostic',
        priority: '📋 Normale',
        description: report,
        repository: gitInfo.remote,
        branch: gitInfo.branch,
        commitSha: gitInfo.commit
      });

      console.log('✅ Rapport quotidien créé dans Notion');
      return report;
    } catch (error) {
      console.error('❌ Erreur génération rapport:', error.message);
      return null;
    }
  }

  // 🔍 Récupérer les infos git
  getGitInfo() {
    try {
      return {
        branch: execSync('git branch --show-current', { encoding: 'utf8' }).trim(),
        commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
        remote: execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim()
      };
    } catch (error) {
      return {
        branch: 'main',
        commit: 'unknown',
        remote: 'https://github.com/Hamza92sy/windventure-kitesurf'
      };
    }
  }

  // 🎯 Détecter le type de projet
  detectProjectType() {
    // Analyser les fichiers modifiés récemment
    try {
      const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' }).trim();
      
      if (changedFiles.includes('.css') || changedFiles.includes('tailwind')) {
        return '🎨 Design/CSS';
      }
      if (changedFiles.includes('middleware') || changedFiles.includes('config')) {
        return '🔧 Fix technique';
      }
      if (changedFiles.includes('package.json') || changedFiles.includes('scripts/')) {
        return '🛠️ Infrastructure';
      }
      if (changedFiles.includes('.github/workflows')) {
        return '🚀 Déploiement';
      }
      
      return '🔧 Fix technique';
    } catch (error) {
      return '🔧 Fix technique';
    }
  }
}

// 📋 CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const manager = new NotionProjectManager();
  
  switch (command) {
    case 'create':
      const name = args[1] || 'Nouveau Projet';
      const description = args[2] || '';
      await manager.createCurrentProject(name, description);
      break;
      
    case 'update-windventure':
      const status = args[1] || '🟢 En cours';
      const results = args[2] || '';
      await manager.updateWindventureProject(status, results);
      break;
      
    case 'report':
      await manager.generateDailyReport();
      break;
      
    case 'init-windventure':
      await manager.createWindventureProject();
      break;
      
    default:
      console.log('🔗 NOTION PROJECT MANAGER');
      console.log('========================');
      console.log('');
      console.log('📋 Commandes disponibles:');
      console.log('  create [nom] [description]  - Créer un projet');
      console.log('  update-windventure [status] [results] - MAJ Windventure');
      console.log('  report                      - Rapport quotidien');
      console.log('  init-windventure           - Initialiser Windventure');
      console.log('');
      console.log('💡 Exemples:');
      console.log('  node scripts/notion-project-manager.js create "Fix CSS" "Correction Tailwind"');
      console.log('  node scripts/notion-project-manager.js update-windventure "✅ Terminé" "CSS corrigé"');
      console.log('  node scripts/notion-project-manager.js report');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { NotionProjectManager };