#!/usr/bin/env node

// 🔍 ANALYSER SCHEMA DATABASE NOTION

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function analyzeSchema() {
  console.log('🔍 ANALYSE SCHEMA DATABASE NOTION');
  console.log('═'.repeat(50));
  
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });
  
  try {
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID
    });
    
    console.log(`\n📊 Database: ${database.title?.[0]?.text?.content || 'Sans titre'}`);
    console.log(`🆔 ID: ${database.id}`);
    
    console.log('\n📋 PROPRIÉTÉS EXISTANTES:');
    console.log('═'.repeat(40));
    
    const properties = database.properties;
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      console.log(`\n🏷️  "${key}"`);
      console.log(`   Type: ${prop.type}`);
      
      // Afficher les options pour les select
      if (prop.type === 'select' && prop.select?.options) {
        console.log(`   Options: [${prop.select.options.map(opt => `"${opt.name}"`).join(', ')}]`);
      }
      
      // Afficher les options pour les multi_select
      if (prop.type === 'multi_select' && prop.multi_select?.options) {
        console.log(`   Options: [${prop.multi_select.options.map(opt => `"${opt.name}"`).join(', ')}]`);
      }
    });
    
    console.log('\n' + '═'.repeat(50));
    console.log('💡 Propriétés requises pour notre script:');
    console.log('   • Titre/Nom (title)');
    console.log('   • Status (select)');
    console.log('   • Type (select)');
    console.log('   • Description (rich_text)');
    
    // Générer un mapping automatique
    console.log('\n🔧 MAPPING AUTOMATIQUE SUGGÉRÉ:');
    const mapping = {};
    
    // Chercher le champ titre
    const titleField = Object.keys(properties).find(key => properties[key].type === 'title');
    if (titleField) {
      mapping.title = titleField;
      console.log(`   Title: "${titleField}"`);
    }
    
    // Chercher les champs select
    const selectFields = Object.keys(properties).filter(key => properties[key].type === 'select');
    selectFields.forEach(field => {
      console.log(`   Select: "${field}"`);
    });
    
    // Chercher les champs rich_text
    const textFields = Object.keys(properties).filter(key => properties[key].type === 'rich_text');
    textFields.forEach(field => {
      console.log(`   Text: "${field}"`);
    });
    
    // Générer le code adapté
    console.log('\n📝 CODE ADAPTÉ À COPIER:');
    console.log('═'.repeat(30));
    console.log(`
const projectData = {
  parent: { database_id: process.env.NOTION_DATABASE_ID },
  properties: {
    "${titleField || 'Name'}": {
      title: [{ text: { content: name } }]
    },
    // Ajoutez les autres propriétés selon votre schema
  }
};`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

analyzeSchema().catch(console.error);