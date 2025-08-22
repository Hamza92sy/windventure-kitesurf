#!/usr/bin/env node

/**
 * Script de test pour webhook Make.com -> Notion
 * Teste l'intégration avec la structure exacte de la base Notion WindVenture
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl';

// Données de test conformes à la structure Notion
const testData = {
  // Informations client
  client: "Marie Dubois",
  email: "marie.dubois@example.com",
  telephone: "+33 6 12 34 56 78",
  
  // Package et formation
  package: "combined",
  niveau_kitesurf: "Intermédiaire",
  heures_formation: 12,
  
  // Dates du séjour
  date_arrivee: "2025-04-15",
  date_depart: "2025-04-22",
  duree_sejour: 7,
  
  // Détails réservation
  nb_personnes: 2,
  hebergement: "Hôtel partenaire",
  services_extra: ["Transfert aéroport", "Location matériel premium", "Photographe professionnel"],
  
  // Informations complémentaires
  notes_commentaires: "Couple avec niveaux différents. Mari confirmé, femme intermédiaire. Végétariens. Souhaitons cours séparés certains jours.",
  source_reservation: "Site web",
  
  // Données calculées
  prix_total: 2700, // 1350€ x 2 personnes
  statut_reservation: "⏳ EN ATTENTE",
  statut_paiement: "En attente",
  date_reservation: new Date().toISOString(),
  
  // Métadonnées
  timestamp: new Date().toISOString(),
  utm_source: "google",
  utm_medium: "organic",
  utm_campaign: "spring-2025"
};

async function testWebhook() {
  console.log('🚀 Test du webhook Make.com -> Notion');
  console.log('URL:', WEBHOOK_URL);
  console.log('\n📊 Données envoyées:');
  console.log(JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n✅ Réponse du webhook:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Body:', responseText);
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS! Le webhook a accepté les données.');
      console.log('\n📋 Prochaines étapes:');
      console.log('1. Vérifiez dans Make.com > Historique que la requête est arrivée');
      console.log('2. Vérifiez dans Notion que la nouvelle entrée a été créée');
      console.log('3. Vérifiez vos emails pour la notification');
      
      return true;
    } else {
      console.error('\n❌ ERREUR: Le webhook a rejeté les données');
      return false;
    }
  } catch (error) {
    console.error('\n❌ ERREUR lors de l\'envoi:', error.message);
    return false;
  }
}

// Tests additionnels avec différents scénarios
async function runAllTests() {
  console.log('========================================');
  console.log('🧪 SUITE DE TESTS WEBHOOK NOTION');
  console.log('========================================\n');
  
  // Test 1: Réservation standard
  console.log('TEST 1: Réservation standard');
  await testWebhook();
  
  // Attendre 2 secondes entre les tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Réservation minimaliste
  console.log('\n\nTEST 2: Réservation minimaliste');
  const minimalData = {
    client: "Test Minimal",
    email: "test@example.com",
    telephone: "+33600000000",
    package: "beginner-private",
    date_arrivee: "2025-05-01",
    date_depart: "2025-05-08",
    nb_personnes: 1,
    niveau_kitesurf: "Débutant",
    hebergement: "Déjà réservé",
    services_extra: [],
    source_reservation: "Site web",
    prix_total: 720,
    duree_sejour: 7,
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
    
    if (response.ok) {
      console.log('✅ Test minimal réussi');
    } else {
      console.log('❌ Test minimal échoué');
    }
  } catch (error) {
    console.error('❌ Erreur test minimal:', error.message);
  }
  
  // Attendre 2 secondes
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Groupe large
  console.log('\n\nTEST 3: Réservation groupe');
  const groupData = {
    ...testData,
    client: "Groupe SportAventure",
    nb_personnes: 6,
    prix_total: 8100, // 1350€ x 6
    notes_commentaires: "Groupe d'entreprise pour team building. Niveaux variés.",
    services_extra: ["Transfert aéroport", "Photographe professionnel", "Repas sur site", "Excursion Dune Blanche"]
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData)
    });
    
    if (response.ok) {
      console.log('✅ Test groupe réussi');
    } else {
      console.log('❌ Test groupe échoué');
    }
  } catch (error) {
    console.error('❌ Erreur test groupe:', error.message);
  }
  
  console.log('\n========================================');
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('========================================');
  console.log('✅ Tests terminés. Vérifiez:');
  console.log('1. Make.com: 3 exécutions dans l\'historique');
  console.log('2. Notion: 3 nouvelles entrées dans la base');
  console.log('3. Emails: 3 notifications reçues');
}

// Fonction d'aide pour afficher la structure
function showDataStructure() {
  console.log('\n📋 STRUCTURE DE DONNÉES POUR MAKE.COM:');
  console.log('=====================================\n');
  
  const structure = {
    client: "string - Nom complet du client",
    email: "string - Email valide",
    telephone: "string - Téléphone avec indicatif",
    package: "string - ID du package (beginner-private, semi-private, combined, exploration)",
    date_arrivee: "string - Format YYYY-MM-DD",
    date_depart: "string - Format YYYY-MM-DD",
    duree_sejour: "number - Calculé automatiquement",
    nb_personnes: "number - Entre 1 et 8",
    niveau_kitesurf: "string - Débutant|Initié|Intermédiaire|Confirmé|Expert",
    hebergement: "string - Type d'hébergement",
    services_extra: "array - Liste des services supplémentaires",
    notes_commentaires: "string - Commentaires libres",
    source_reservation: "string - Origine de la réservation",
    prix_total: "number - Prix calculé",
    heures_formation: "number - Heures selon package",
    statut_reservation: "string - ⏳ EN ATTENTE par défaut",
    statut_paiement: "string - En attente par défaut",
    date_reservation: "string - ISO timestamp"
  };
  
  console.log(JSON.stringify(structure, null, 2));
}

// Exécution
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log('Usage: node test-notion-webhook.js [options]');
  console.log('Options:');
  console.log('  --all     Exécuter tous les tests');
  console.log('  --struct  Afficher la structure de données');
  console.log('  --help    Afficher cette aide');
} else if (args.includes('--struct')) {
  showDataStructure();
} else if (args.includes('--all')) {
  runAllTests();
} else {
  // Test simple par défaut
  testWebhook();
}