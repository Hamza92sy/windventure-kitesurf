#!/usr/bin/env node

// 🔍 DIAGNOSTIC NOTION - Vérifier la configuration et l'accès

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function diagnosticNotion() {
  console.log('🔍 DIAGNOSTIC CONNEXION NOTION');
  console.log('═'.repeat(50));
  
  // Afficher la configuration (masquée)
  console.log('\n📋 Configuration actuelle:');
  console.log('   Token:', process.env.NOTION_API_KEY ? '✅ Configuré' : '❌ Manquant');
  console.log('   Database ID:', process.env.NOTION_DATABASE_ID || 'Non configuré');
  
  if (!process.env.NOTION_API_KEY) {
    console.error('\n❌ Token API manquant dans .env.local');
    return;
  }
  
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });
  
  console.log('\n🔗 Test de connexion à l\'API Notion...');
  
  try {
    // Tester l'authentification en listant les users
    const response = await notion.users.list();
    console.log('✅ Authentification réussie!');
    console.log(`   Workspace: ${response.results.length} utilisateur(s) trouvé(s)`);
    
    // Lister toutes les databases accessibles
    console.log('\n📊 Recherche des databases accessibles...');
    const search = await notion.search({
      filter: {
        value: 'database',
        property: 'object'
      }
    });
    
    console.log(`\n📋 Databases trouvées: ${search.results.length}`);
    
    if (search.results.length > 0) {
      console.log('\n📊 Databases disponibles:');
      search.results.forEach((db, index) => {
        const title = db.title?.[0]?.text?.content || 'Sans titre';
        console.log(`   ${index + 1}. ${title}`);
        console.log(`      ID: ${db.id}`);
        console.log(`      URL: ${db.url}`);
        console.log('');
      });
      
      // Chercher spécifiquement Windventure Command Center
      const windventure = search.results.find(db => {
        const title = db.title?.[0]?.text?.content || '';
        return title.includes('Windventure') || title.includes('Command Center');
      });
      
      if (windventure) {
        console.log('🎯 Database Windventure trouvée!');
        console.log(`   ID correct: ${windventure.id}`);
        console.log('\n💡 Mettez à jour .env.local avec:');
        console.log(`   NOTION_DATABASE_ID=${windventure.id}`);
      }
    } else {
      console.log('\n⚠️ Aucune database accessible');
      console.log('   Vérifiez que l\'intégration est bien connectée à votre database');
    }
    
    // Tester l'ID configuré si présent
    if (process.env.NOTION_DATABASE_ID) {
      console.log('\n🧪 Test de l\'ID configuré...');
      try {
        const dbId = process.env.NOTION_DATABASE_ID;
        const database = await notion.databases.retrieve({
          database_id: dbId
        });
        console.log('✅ Database configurée accessible!');
        console.log(`   Titre: ${database.title?.[0]?.text?.content || 'Sans titre'}`);
      } catch (error) {
        console.error('❌ Database configurée non accessible');
        console.error(`   Erreur: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n🔧 Solution: Vérifiez votre token API');
    } else if (error.code === 'restricted_resource') {
      console.log('\n🔧 Solution: L\'intégration n\'a pas accès aux ressources');
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log('📝 Pour plus d\'aide: https://developers.notion.com/');
}

// Exécution
diagnosticNotion().catch(console.error);