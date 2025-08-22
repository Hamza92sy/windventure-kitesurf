#!/usr/bin/env node

/**
 * Test avec données validées pour éviter les erreurs Notion
 * Utilise des formats stricts et des valeurs par défaut
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl';

// Fonction pour formater une date au format YYYY-MM-DD
function formatDate(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Données validées et sûres
const validatedData = {
  // Client info - Tous les champs requis
  client: "Test Client Validé",
  email: "test.valide@example.com",
  telephone: "+33612345678",
  
  // Package avec valeur exacte
  package: "beginner-private",
  
  // Dates au bon format YYYY-MM-DD
  date_arrivee: formatDate(30), // Dans 30 jours
  date_depart: formatDate(37),  // Dans 37 jours
  
  // Nombres comme entiers
  duree_sejour: 7,
  nb_personnes: 2,
  prix_total: 1440,
  heures_formation: 6,
  
  // Sélections avec valeurs exactes
  niveau_kitesurf: "Débutant",
  hebergement: "Hôtel partenaire",
  
  // Array pour multi-select
  services_extra: ["Transfert aéroport", "Location matériel premium"],
  
  // Texte avec valeur par défaut
  notes_commentaires: "Test de validation des données pour éviter les erreurs",
  
  // Valeurs par défaut obligatoires
  source_reservation: "Site web",
  statut_reservation: "⏳ EN ATTENTE",
  statut_paiement: "En attente",
  
  // Date au format ISO
  date_reservation: new Date().toISOString()
};

async function testValidatedWebhook() {
  console.log('🧪 TEST AVEC DONNÉES VALIDÉES');
  console.log('================================\n');
  console.log('📊 Données envoyées (format strict):');
  console.log(JSON.stringify(validatedData, null, 2));
  console.log('\n================================\n');
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData)
    });
    
    console.log('📡 Réponse du webhook:');
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`Body: ${responseText}\n`);
    
    if (response.ok) {
      console.log('✅ SUCCESS! Données acceptées par le webhook\n');
      console.log('🔍 VÉRIFICATIONS À FAIRE:');
      console.log('1. Make.com > History : Vérifier que l\'exécution est verte');
      console.log('2. Si erreur Notion, vérifier:');
      console.log('   - La connexion Notion est active');
      console.log('   - La base de données est accessible');
      console.log('   - Les champs Select ont les bonnes options');
      console.log('3. Notion : Vérifier la nouvelle entrée');
      console.log('4. Outlook : Vérifier l\'email de notification\n');
      
      return true;
    } else {
      console.error('❌ Le webhook a rejeté les données');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error.message);
    return false;
  }
}

// Tests multiples avec différentes configurations
async function runComprehensiveTests() {
  console.log('🚀 SUITE DE TESTS COMPLETS\n');
  
  // Test 1: Données minimales obligatoires
  console.log('TEST 1: Données minimales\n');
  const minimalData = {
    client: "Client Minimal",
    email: "minimal@test.com",
    telephone: "+33600000000",
    package: "beginner-private",
    date_arrivee: formatDate(15),
    date_depart: formatDate(22),
    duree_sejour: 7,
    nb_personnes: 1,
    niveau_kitesurf: "Débutant",
    hebergement: "Déjà réservé",
    services_extra: [],
    source_reservation: "Site web",
    prix_total: 720,
    heures_formation: 6,
    statut_reservation: "⏳ EN ATTENTE",
    statut_paiement: "En attente",
    date_reservation: new Date().toISOString()
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minimalData)
    });
    console.log(`Résultat Test Minimal: ${response.ok ? '✅ Succès' : '❌ Échec'}\n`);
  } catch (error) {
    console.error('❌ Erreur Test Minimal:', error.message);
  }
  
  // Attendre 2 secondes entre les tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Données complètes
  console.log('\nTEST 2: Données complètes\n');
  await testValidatedWebhook();
  
  // Attendre 2 secondes
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Package différent
  console.log('\nTEST 3: Package Combined\n');
  const combinedData = {
    ...validatedData,
    client: "Test Package Combined",
    package: "combined",
    prix_total: 2700,
    heures_formation: 12,
    nb_personnes: 2
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(combinedData)
    });
    console.log(`Résultat Test Combined: ${response.ok ? '✅ Succès' : '❌ Échec'}\n`);
  } catch (error) {
    console.error('❌ Erreur Test Combined:', error.message);
  }
}

// Fonction pour afficher les formats attendus
function showExpectedFormats() {
  console.log('\n📋 FORMATS ATTENDUS PAR NOTION:');
  console.log('=====================================\n');
  
  const formats = {
    "Dates": "Format YYYY-MM-DD (ex: 2025-04-15)",
    "Numbers": "Entiers sans guillemets (ex: 7, pas '7')",
    "Select": "Valeur exacte de l'option Notion",
    "Multi-select": "Array de strings ['Option1', 'Option2']",
    "Email": "Format email valide",
    "Phone": "Avec indicatif (+33...)",
    "Text": "String, peut être vide mais pas null",
    "Title": "String non vide (obligatoire)"
  };
  
  console.log('Types de champs et formats:');
  Object.entries(formats).forEach(([type, format]) => {
    console.log(`  ${type}: ${format}`);
  });
  
  console.log('\n⚠️ ERREURS COURANTES:');
  console.log('  - Dates mal formatées → Utiliser parseDate() dans Make.com');
  console.log('  - Champs Select avec mauvaise valeur → Vérifier les options Notion');
  console.log('  - Numbers comme strings → Utiliser parseNumber() dans Make.com');
  console.log('  - Champs obligatoires vides → Ajouter des valeurs par défaut');
}

// Menu principal
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log('Usage: node test-notion-validated.js [options]');
  console.log('\nOptions:');
  console.log('  --simple   Test simple avec données validées');
  console.log('  --all      Tous les tests de validation');
  console.log('  --formats  Afficher les formats attendus');
  console.log('  --help     Afficher cette aide');
} else if (args.includes('--formats')) {
  showExpectedFormats();
} else if (args.includes('--all')) {
  runComprehensiveTests();
} else {
  // Test simple par défaut
  testValidatedWebhook();
}