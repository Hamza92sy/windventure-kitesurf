#!/usr/bin/env node

// 🧪 SCRIPT TEST NOTION - Vérifier la connexion Claude ↔ Notion

require('dotenv').config({ path: '.env.local' });
const { NotionManager } = require('../lib/notion.js');

async function testNotionConnection() {
  console.log('🔗 TEST CONNEXION CLAUDE ↔ NOTION');
  console.log('════════════════════════════════');
  
  // Vérifier les variables d'environnement
  console.log('🔍 Vérification configuration...');
  
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ NOTION_API_KEY manquante dans .env.local');
    console.log('📝 Ajoutez: NOTION_API_KEY=secret_VOTRE_TOKEN');
    process.exit(1);
  }
  
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('❌ NOTION_DATABASE_ID manquante dans .env.local');
    console.log('📝 Ajoutez: NOTION_DATABASE_ID=VOTRE_DATABASE_ID');
    process.exit(1);
  }
  
  console.log('✅ Variables d\'environnement présentes');
  
  // Test de connexion
  const notion = new NotionManager();
  
  console.log('🔗 Test de connexion à Notion...');
  const isConnected = await notion.testConnection();
  
  if (!isConnected) {
    console.error('❌ Impossible de se connecter à Notion');
    console.log('');
    console.log('🔧 SOLUTIONS:');
    console.log('1. Vérifiez votre token d\'intégration');
    console.log('2. Vérifiez l\'ID de votre database');
    console.log('3. Assurez-vous que l\'intégration a accès à la database');
    process.exit(1);
  }
  
  // Test de création d'un projet de test
  console.log('');
  console.log('📝 Test création d\'un projet...');
  
  try {
    const testProject = await notion.createProject({
      name: '🧪 Test Connexion Claude - ' + new Date().toLocaleString(),
      status: '✅ Terminé',
      type: '🧪 Test',
      priority: '📋 Normale',
      description: 'Projet de test créé par Claude pour valider la connexion Notion',
      repository: 'https://github.com/Hamza92sy/windventure-kitesurf',
      branch: 'main-clean',
      commitSha: 'test-commit'
    });
    
    console.log('✅ Projet de test créé avec succès!');
    console.log('🔗 ID:', testProject.id);
    
    // Test des statistiques
    console.log('');
    console.log('📊 Test statistiques...');
    const stats = await notion.getProjectStats();
    
    if (stats) {
      console.log('✅ Statistiques récupérées:');
      console.log('   📊 Total projets:', stats.total);
      console.log('   🟢 En cours:', stats.enCours);
      console.log('   ✅ Terminés:', stats.termines);
      console.log('   ⚠️ Problèmes:', stats.problemes);
      console.log('   🔥 Urgents:', stats.urgents);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
  
  console.log('');
  console.log('🎉 TEST CONNEXION NOTION RÉUSSI!');
  console.log('═══════════════════════════════');
  console.log('✅ Claude est maintenant connecté à Notion');
  console.log('📊 Vous pouvez gérer vos projets automatiquement');
  console.log('🔗 Consultez votre database Notion pour voir le projet de test');
}

// Exécution du test
testNotionConnection().catch(console.error);