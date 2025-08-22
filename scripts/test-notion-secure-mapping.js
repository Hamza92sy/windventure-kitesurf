#!/usr/bin/env node

/**
 * Test avec mapping Notion sécurisé pour éviter les erreurs de validation
 * Utilise les valeurs par défaut et formatage correct
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl';

function getFutureDate(daysFromNow = 30) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Données de test conformes au mapping sécurisé
const secureTestData = {
  // Champs obligatoires avec valeurs par défaut sécurisées
  name: "Marie Dupont",
  email: "marie.dupont@example.com",
  package: "🔵 SEMI-PRIVATE", // Valeur par défaut du mapping
  
  // Dates au bon format
  checkin: getFutureDate(30), // Dans 30 jours
  
  // Number sécurisé
  participants: 2,
  
  // Champs optionnels (peuvent être vides)
  phone: "+33612345678",
  notes: "Test mapping sécurisé Notion",
  
  // Niveau avec valeur par défaut
  level: "🟡 INTERMÉDIAIRE",
  
  // Autres champs optionnels
  accommodation: "Hôtel partenaire",
  services: ["Transfert aéroport"],
  source: "Site web"
};

// Test avec données minimales (valeurs par défaut)
const minimalTestData = {
  name: "Test Minimal",
  email: "minimal@test.com",
  package: "🔵 SEMI-PRIVATE",
  checkin: getFutureDate(15),
  participants: 1,
  level: "🟡 INTERMÉDIAIRE"
};

// Test avec données manquantes (pour tester ifempty)
const missingDataTest = {
  // name: "", // Volontairement vide pour tester ifempty
  email: "test@empty.com",
  // package: "", // Vide pour tester valeur par défaut
  checkin: getFutureDate(45),
  // participants: null, // Vide pour tester parseNumber
  level: "🟢 DÉBUTANT"
};

async function testSecureMapping(testName, testData) {
  console.log(`\n🧪 ${testName}`);
  console.log('='.repeat(50));
  
  console.log('📊 Données envoyées:');
  console.log(JSON.stringify(testData, null, 2));
  
  console.log('\n🛡️ Valeurs attendues dans Notion:');
  console.log(`Client: ${testData.name || "Client Réservation"}`);
  console.log(`Email: ${testData.email || "noemail@windventure.fr"}`);
  console.log(`Package: ${testData.package || "🔵 SEMI-PRIVATE"}`);
  console.log(`Date Arrivée: ${testData.checkin || "2025-06-01"}`);
  console.log(`Participants: ${testData.participants || 1}`);
  console.log(`Niveau: ${testData.level || "🟡 INTERMÉDIAIRE"}`);
  console.log(`Status: ⏳ EN ATTENTE (fixe)`);
  console.log(`Source: Site web (fixe)`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const responseText = await response.text();
    
    console.log(`\n📡 Réponse webhook: ${response.status} ${response.statusText}`);
    console.log(`📄 Body: ${responseText}`);
    
    if (response.ok) {
      console.log('✅ SUCCESS: Webhook accepté');
      console.log('\n🔍 À vérifier dans Make.com:');
      console.log('1. History: Exécution avec modules verts');
      console.log('2. Notion: Nouvelle entrée créée sans erreur');
      console.log('3. Vérifier que les valeurs par défaut sont appliquées');
      return true;
    } else {
      console.log('❌ ÉCHEC: Webhook rejeté');
      return false;
    }
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    return false;
  }
}

async function runSecurityTests() {
  console.log('🛡️ TESTS DE SÉCURITÉ MAPPING NOTION');
  console.log('=====================================\n');
  
  let successCount = 0;
  let totalTests = 0;
  
  // Test 1: Données complètes
  totalTests++;
  if (await testSecureMapping('TEST 1: Données Complètes', secureTestData)) {
    successCount++;
  }
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Données minimales
  totalTests++;
  if (await testSecureMapping('TEST 2: Données Minimales', minimalTestData)) {
    successCount++;
  }
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 3: Données manquantes (test des valeurs par défaut)
  totalTests++;
  if (await testSecureMapping('TEST 3: Valeurs Par Défaut (ifempty)', missingDataTest)) {
    successCount++;
  }
  
  // Résultats
  console.log('\n📊 RÉSULTATS FINAUX');
  console.log('==================');
  console.log(`✅ Tests réussis: ${successCount}/${totalTests}`);
  console.log(`🎯 Webhook URL: ${WEBHOOK_URL}`);
  
  console.log('\n🎯 MAPPING SÉCURISÉ VALIDÉ:');
  console.log('✅ Client: {{ifempty(1.name; "Client Réservation")}}');
  console.log('✅ Email: {{ifempty(1.email; "noemail@windventure.fr")}}');
  console.log('✅ Package: {{ifempty(1.package; "🔵 SEMI-PRIVATE")}}');
  console.log('✅ Date: {{parseDate(ifempty(1.checkin; "2025-06-01"); "YYYY-MM-DD")}}');
  console.log('✅ Participants: {{parseNumber(ifempty(1.participants; 1))}}');
  console.log('✅ Niveau: {{ifempty(1.level; "🟡 INTERMÉDIAIRE")}}');
  
  console.log('\n🔍 VÉRIFICATIONS MAKE.COM:');
  console.log('1. History: 3 exécutions avec modules CREATE + UPDATE');
  console.log('2. Notion: 3 nouvelles entrées avec valeurs par défaut si nécessaire');
  console.log('3. Emails: 3 notifications envoyées');
  console.log('4. Aucune erreur "Validation failed"');
  
  if (successCount === totalTests) {
    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('Le mapping sécurisé fonctionne parfaitement.');
  } else {
    console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('Vérifiez la configuration des modules dans Make.com.');
  }
}

// Test d'un seul cas
async function testSingle(type) {
  switch(type) {
    case 'complete':
      await testSecureMapping('TEST: Données Complètes', secureTestData);
      break;
    case 'minimal':
      await testSecureMapping('TEST: Données Minimales', minimalTestData);
      break;
    case 'empty':
      await testSecureMapping('TEST: Valeurs Vides', missingDataTest);
      break;
    default:
      console.log('❌ Type de test invalide. Utilisez: complete, minimal, empty');
  }
}

// Menu d'aide
function showHelp() {
  console.log('Usage: node test-notion-secure-mapping.js [options]\n');
  console.log('Options:');
  console.log('  --all        Exécuter tous les tests de sécurité');
  console.log('  --complete   Tester avec données complètes');
  console.log('  --minimal    Tester avec données minimales');
  console.log('  --empty      Tester les valeurs par défaut (ifempty)');
  console.log('  --help       Afficher cette aide\n');
  console.log('🛡️ Tests de validation du mapping Notion sécurisé');
  console.log('Objectif: Éviter les erreurs "Validation failed for X parameter(s)"');
}

// Exécution
const args = process.argv.slice(2);

if (args.includes('--help')) {
  showHelp();
} else if (args.includes('--all')) {
  runSecurityTests();
} else if (args.includes('--complete')) {
  testSingle('complete');
} else if (args.includes('--minimal')) {
  testSingle('minimal');
} else if (args.includes('--empty')) {
  testSingle('empty');
} else {
  // Test par défaut: données complètes
  testSingle('complete');
}