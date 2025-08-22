#!/usr/bin/env node

/**
 * Debug progressif Notion - Étapes par étapes pour identifier les champs problématiques
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl';

// Fonction pour générer une date future
function getFutureDate(daysFromNow = 30) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// ÉTAPE 1: 3 champs de base seulement
const etape1_minimal = {
  name: "Test Étape 1",
  email: "etape1@debug.com",
  checkin: getFutureDate(30)
};

// ÉTAPE 2: Ajout Package
const etape2_package = {
  ...etape1_minimal,
  name: "Test Étape 2",
  email: "etape2@debug.com",
  package: "🔵 SEMI-PRIVATE"
};

// ÉTAPE 3: Ajout Participants
const etape3_participants = {
  ...etape2_package,
  name: "Test Étape 3",
  email: "etape3@debug.com",
  participants: 2
};

// ÉTAPE 4: Ajout Niveau
const etape4_niveau = {
  ...etape3_participants,
  name: "Test Étape 4",
  email: "etape4@debug.com",
  level: "🟡 INTERMÉDIAIRE"
};

// ÉTAPE 5: Ajout Téléphone
const etape5_telephone = {
  ...etape4_niveau,
  name: "Test Étape 5",
  email: "etape5@debug.com",
  phone: "+33612345678"
};

// ÉTAPE 6: Données complètes
const etape6_complet = {
  ...etape5_telephone,
  name: "Test Étape 6 - Complet",
  email: "etape6@debug.com",
  notes: "Test complet debug progressif",
  accommodation: "Hôtel partenaire",
  services: ["Transfert aéroport"],
  source: "Debug progressif"
};

const etapes = [
  {
    numero: 1,
    nom: "🎯 ÉTAPE 1: Base (3 champs)",
    data: etape1_minimal,
    champsTestes: ["Client", "Email", "Date Arrivée"],
    instructions: [
      "Dans Make.com, module Notion:",
      "✅ Client: {{1.name}}",
      "✅ Email: {{1.email}}",
      "✅ Date Arrivée: {{parseDate(1.checkin; \"YYYY-MM-DD\")}}",
      "❌ TOUS les autres champs: VIDES"
    ]
  },
  {
    numero: 2,
    nom: "🎯 ÉTAPE 2: + Package",
    data: etape2_package,
    champsTestes: ["Client", "Email", "Date Arrivée", "Package"],
    instructions: [
      "Ajouter au module Notion:",
      "✅ Package: {{1.package}}"
    ]
  },
  {
    numero: 3,
    nom: "🎯 ÉTAPE 3: + Participants",
    data: etape3_participants,
    champsTestes: ["Client", "Email", "Date Arrivée", "Package", "Nb Personnes"],
    instructions: [
      "Ajouter au module Notion:",
      "✅ Nb Personnes: {{parseNumber(1.participants)}}"
    ]
  },
  {
    numero: 4,
    nom: "🎯 ÉTAPE 4: + Niveau",
    data: etape4_niveau,
    champsTestes: ["Client", "Email", "Date Arrivée", "Package", "Nb Personnes", "Niveau Kitesurf"],
    instructions: [
      "Ajouter au module Notion:",
      "✅ Niveau Kitesurf: {{1.level}}"
    ]
  },
  {
    numero: 5,
    nom: "🎯 ÉTAPE 5: + Téléphone",
    data: etape5_telephone,
    champsTestes: ["Client", "Email", "Date Arrivée", "Package", "Nb Personnes", "Niveau Kitesurf", "Téléphone"],
    instructions: [
      "Ajouter au module Notion:",
      "✅ Téléphone: {{1.phone}}"
    ]
  },
  {
    numero: 6,
    nom: "🎯 ÉTAPE 6: Configuration complète",
    data: etape6_complet,
    champsTestes: ["Tous les champs + Status fixes"],
    instructions: [
      "Ajouter les champs restants:",
      "✅ Notes & Commentaires: {{1.notes}}",
      "✅ Hébergement: {{1.accommodation}}",
      "✅ Services Extra: {{1.services}}",
      "✅ Source Réservation: Site web",
      "✅ Statut Réservation: ⏳ EN ATTENTE",
      "✅ Statut Paiement: En attente"
    ]
  }
];

async function testEtape(etape) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${etape.nom}`);
  console.log(`${'='.repeat(60)}`);
  
  console.log('\n📋 Configuration Make.com requise:');
  etape.instructions.forEach(instruction => {
    console.log(`   ${instruction}`);
  });
  
  console.log('\n📊 Données de test envoyées:');
  console.log(JSON.stringify(etape.data, null, 2));
  
  console.log(`\n🔧 Champs testés: ${etape.champsTestes.join(', ')}`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(etape.data)
    });
    
    const responseText = await response.text();
    
    console.log(`\n📡 Réponse: ${response.status} ${response.statusText}`);
    console.log(`📄 Body: ${responseText}`);
    
    if (response.ok) {
      console.log(`\n✅ ÉTAPE ${etape.numero} RÉUSSIE !`);
      console.log('🔍 Vérifications Make.com:');
      console.log('   1. History: Vérifiez que le module Notion est VERT');
      console.log('   2. Notion: Vérifiez la nouvelle entrée');
      console.log('   3. Si tout OK → Passez à l\'étape suivante');
      console.log('   4. Si erreur → Ce(s) champ(s) pose(nt) problème');
      return true;
    } else {
      console.log(`\n❌ ÉTAPE ${etape.numero} ÉCHOUÉE`);
      console.log('🔍 Actions:');
      console.log('   1. Vérifiez l\'erreur dans Make.com History');
      console.log('   2. Corrigez la configuration du module Notion');
      console.log('   3. Retestez cette étape avant de passer à la suivante');
      return false;
    }
  } catch (error) {
    console.error(`\n❌ ERREUR ÉTAPE ${etape.numero}:`, error.message);
    return false;
  }
}

async function runProgressiveDebug() {
  console.log('🔧 DEBUG PROGRESSIF NOTION - IDENTIFICATION DES ERREURS');
  console.log('=========================================================');
  
  console.log('\n📋 MÉTHODOLOGIE:');
  console.log('1. Commencer avec 3 champs de base');
  console.log('2. Ajouter un champ à la fois');
  console.log('3. Identifier exactement quel champ cause l\'erreur');
  console.log('4. Corriger puis passer à l\'étape suivante');
  
  console.log('\n⚠️  IMPORTANT:');
  console.log('• Configurez Make.com EXACTEMENT comme indiqué pour chaque étape');
  console.log('• Testez UNE étape à la fois');
  console.log('• Ne passez à l\'étape suivante QUE si la précédente marche');
  
  let continueDebug = true;
  let currentStep = 1;
  
  for (const etape of etapes) {
    if (!continueDebug) break;
    
    console.log(`\n⏳ Démarrage ${etape.nom}...`);
    console.log('⚠️  CONFIGUREZ D\'ABORD Make.com selon les instructions ci-dessus !');
    console.log('⚠️  Appuyez sur Ctrl+C pour arrêter si vous devez configurer');
    
    // Attendre 3 secondes pour permettre l'arrêt manuel
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const success = await testEtape(etape);
    
    if (success) {
      console.log(`\n🎉 ÉTAPE ${etape.numero} VALIDÉE !`);
      if (etape.numero < etapes.length) {
        console.log('➡️  Vous pouvez passer à l\'étape suivante');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else {
      console.log(`\n⛔ ARRÊT: ÉTAPE ${etape.numero} A ÉCHOUÉ`);
      console.log('🔧 Corrigez cette étape avant de continuer');
      continueDebug = false;
    }
  }
  
  if (continueDebug) {
    console.log('\n🎉 FÉLICITATIONS ! TOUS LES TESTS RÉUSSIS !');
    console.log('✅ Votre configuration Notion est maintenant parfaite');
    console.log('🚀 Le système est prêt pour la production');
  }
}

// Test d'une seule étape
async function testSingleStep(stepNumber) {
  const etape = etapes.find(e => e.numero === parseInt(stepNumber));
  if (!etape) {
    console.log(`❌ Étape ${stepNumber} introuvable. Étapes disponibles: 1-${etapes.length}`);
    return;
  }
  
  await testEtape(etape);
}

function showHelp() {
  console.log('Usage: node debug-notion-progressive.js [options]\n');
  console.log('Options:');
  console.log('  --all            Exécuter toutes les étapes de debug');
  console.log('  --step <1-6>     Tester une étape spécifique');
  console.log('  --help           Afficher cette aide\n');
  console.log('🔧 Debug progressif pour identifier les champs Notion problématiques\n');
  console.log('Étapes disponibles:');
  etapes.forEach(etape => {
    console.log(`  ${etape.numero}. ${etape.nom.replace('🎯 ', '')}`);
  });
}

// Exécution
const args = process.argv.slice(2);

if (args.includes('--help')) {
  showHelp();
} else if (args.includes('--all')) {
  runProgressiveDebug();
} else if (args.includes('--step')) {
  const stepIndex = args.indexOf('--step');
  const stepNumber = args[stepIndex + 1];
  if (stepNumber) {
    testSingleStep(stepNumber);
  } else {
    console.log('❌ Spécifiez un numéro d\'étape: --step 1');
  }
} else {
  // Par défaut: étape 1
  testSingleStep(1);
}