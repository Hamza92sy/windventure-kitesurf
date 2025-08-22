#!/usr/bin/env node

/**
 * Test avec les noms exacts des packages Notion (avec emojis)
 * Pour tester le module UPDATE avec calculs automatiques
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl';

// Fonction pour générer une date future
function getFutureDate(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Test avec chaque package exact de Notion
const testPackages = [
  {
    name: "Test Beginner Private",
    package: "🟢 BEGINNER PRIVATE",
    expectedPrice: 150, // 2 personnes × 75€
    expectedHours: 6,
    expectedDuration: 2
  },
  {
    name: "Test Semi-Private", 
    package: "🔵 SEMI-PRIVATE",
    expectedPrice: 240, // 4 personnes × 60€
    expectedHours: 9,
    expectedDuration: 3
  },
  {
    name: "Test Combined Package",
    package: "⭐ COMBINED PACKAGE", 
    expectedPrice: 260, // 2 personnes × 130€
    expectedHours: 15,
    expectedDuration: 5
  },
  {
    name: "Test Exploration Package",
    package: "🟣 EXPLORATION PACKAGE",
    expectedPrice: 285, // 3 personnes × 95€
    expectedHours: 12,
    expectedDuration: 4
  }
];

async function testPackage(testData) {
  console.log(`\n🧪 TEST: ${testData.name}`);
  console.log(`📦 Package: ${testData.package}`);
  
  const webhookData = {
    name: testData.name,
    email: "test@windventure.fr",
    phone: "+33612345678",
    package: testData.package,
    checkin: getFutureDate(30),
    checkout: getFutureDate(30 + testData.expectedDuration),
    participants: testData.name === "Test Semi-Private" ? 4 : 
                  testData.name === "Test Exploration Package" ? 3 : 2,
    level: "Intermédiaire",
    accommodation: "Hôtel partenaire",
    services: ["Transfert aéroport"],
    notes: `Test calculs automatiques pour ${testData.package}`,
    source: "Test script"
  };
  
  console.log(`👥 Participants: ${webhookData.participants}`);
  console.log(`📅 Dates: ${webhookData.checkin} → ${webhookData.checkout}`);
  console.log(`💰 Prix attendu: ${testData.expectedPrice}€`);
  console.log(`⏰ Heures attendues: ${testData.expectedHours}h`);
  console.log(`📅 Durée attendue: ${testData.expectedDuration} jours\n`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      console.log(`✅ ${testData.name}: Webhook accepté (Status 200)`);
      return true;
    } else {
      console.log(`❌ ${testData.name}: Webhook rejeté (Status ${response.status})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${testData.name}: Erreur réseau:`, error.message);
    return false;
  }
}

async function runAllPackageTests() {
  console.log('🚀 TEST COMPLET DES PACKAGES NOTION AVEC CALCULS');
  console.log('================================================\n');
  
  let successCount = 0;
  
  for (const testData of testPackages) {
    const success = await testPackage(testData);
    if (success) successCount++;
    
    // Attendre 2 secondes entre les tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 RÉSULTATS FINAUX:');
  console.log('==================');
  console.log(`✅ Tests réussis: ${successCount}/${testPackages.length}`);
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  
  console.log('\n🔍 VÉRIFICATIONS À FAIRE:');
  console.log('1. Make.com > History: 4 exécutions avec modules CREATE + UPDATE');
  console.log('2. Notion: 4 nouvelles entrées avec calculs automatiques:');
  
  testPackages.forEach(test => {
    console.log(`   - ${test.name}: ${test.expectedPrice}€, ${test.expectedHours}h, ${test.expectedDuration}j`);
  });
  
  console.log('3. Emails: 4 notifications Outlook reçues');
  console.log('4. Vérifier que les dates de départ sont calculées automatiquement');
  console.log('5. Vérifier les planning de cours personnalisés\n');
}

// Test simple d'un seul package
async function testSinglePackage(packageName) {
  const testData = testPackages.find(p => 
    p.package.toLowerCase().includes(packageName.toLowerCase())
  );
  
  if (!testData) {
    console.log('❌ Package non trouvé. Packages disponibles:');
    testPackages.forEach(p => console.log(`  - ${p.package}`));
    return;
  }
  
  await testPackage(testData);
}

// Menu d'aide
function showHelp() {
  console.log('Usage: node test-notion-exact-packages.js [options]\n');
  console.log('Options:');
  console.log('  --all              Tester tous les packages');
  console.log('  --beginner         Tester uniquement Beginner Private');
  console.log('  --semi             Tester uniquement Semi-Private');
  console.log('  --combined         Tester uniquement Combined Package');
  console.log('  --exploration      Tester uniquement Exploration Package');
  console.log('  --help             Afficher cette aide\n');
  console.log('Packages disponibles:');
  testPackages.forEach(p => {
    console.log(`  ${p.package} (${p.expectedPrice}€, ${p.expectedHours}h, ${p.expectedDuration}j)`);
  });
}

// Exécution selon les arguments
const args = process.argv.slice(2);

if (args.includes('--help')) {
  showHelp();
} else if (args.includes('--all')) {
  runAllPackageTests();
} else if (args.includes('--beginner')) {
  testSinglePackage('beginner');
} else if (args.includes('--semi')) {
  testSinglePackage('semi');
} else if (args.includes('--combined')) {
  testSinglePackage('combined');
} else if (args.includes('--exploration')) {
  testSinglePackage('exploration');
} else {
  // Test par défaut: Combined Package
  testSinglePackage('combined');
}