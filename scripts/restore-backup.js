#!/usr/bin/env node

// scripts/restore-backup.js
// Script de restauration automatique des backups Windventure

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BackupRestorer {
  constructor() {
    this.backupDir = 'backups';
  }

  run() {
    console.log('🔄 RESTAURATION BACKUP WINDVENTURE.FR');
    console.log('═'.repeat(40));
    
    try {
      // Lister les backups disponibles
      const backups = this.listAvailableBackups();
      
      if (backups.length === 0) {
        console.log('❌ Aucun backup trouvé');
        return;
      }
      
      // Prendre le plus récent par défaut
      const latestBackup = backups[0];
      console.log(`📁 Backup le plus récent: ${latestBackup}`);
      
      // Restaurer les fichiers
      this.restoreBackup(latestBackup);
      
      console.log('✅ Restauration terminée!');
      console.log('\n🚀 Prochaines étapes:');
      console.log('   1. npm run build - Vérifier la compilation');
      console.log('   2. npm run dev - Tester localement');
      
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error.message);
      process.exit(1);
    }
  }
  
  listAvailableBackups() {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }
    
    return fs.readdirSync(this.backupDir)
      .filter(dir => {
        const fullPath = path.join(this.backupDir, dir);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort()
      .reverse(); // Plus récent en premier
  }
  
  restoreBackup(backupName) {
    const backupPath = path.join(this.backupDir, backupName);
    const files = fs.readdirSync(backupPath);
    
    console.log(`\n🔄 Restauration depuis ${backupName}:`);
    
    files.forEach(file => {
      const sourcePath = path.join(backupPath, file);
      let targetPath = '';
      
      // Déterminer la destination en fonction du nom du fichier
      switch (file) {
        case 'globals.css':
          targetPath = 'src/app/globals.css';
          break;
        case 'tailwind.config.js':
        case 'next.config.js':
        case 'middleware.ts':
        case 'vercel.json':
          targetPath = file;
          break;
        default:
          console.log(`⚠️ Fichier non reconnu: ${file}`);
          return;
      }
      
      try {
        // Créer le dossier parent si nécessaire
        const targetDir = path.dirname(targetPath);
        if (targetDir !== '.' && !fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // Copier le fichier
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`   ✅ ${file} → ${targetPath}`);
      } catch (error) {
        console.log(`   ❌ Erreur ${file}: ${error.message}`);
      }
    });
  }
}

// Exécution
if (require.main === module) {
  const restorer = new BackupRestorer();
  restorer.run();
}

module.exports = BackupRestorer;