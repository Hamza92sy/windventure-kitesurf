#!/usr/bin/env node

/**
 * Script de test du webhook de production
 * Teste directement l'endpoint de windventure.fr
 */

const https = require('https');

console.log('🧪 Test du webhook de production windventure.fr');
console.log('================================================');

// Test simple de l'endpoint
const testEndpoint = () => {
  const options = {
    hostname: 'windventure.fr',
    path: '/api/stripe-webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Windventure-Webhook-Test/1.0'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📡 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📥 Response Body:', data);
      
      if (res.statusCode === 400) {
        console.log('✅ Erreur 400 attendue (pas de signature Stripe)');
        console.log('✅ L\'endpoint webhook répond correctement');
      } else if (res.statusCode === 405) {
        console.log('❌ Erreur 405: Méthode non autorisée');
      } else {
        console.log(`ℹ️  Status inattendu: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Erreur de connexion:', e.message);
  });

  // Envoyer une requête vide (pour tester la connectivité)
  req.write('{}');
  req.end();
};

console.log('🚀 Test de connectivité vers windventure.fr/api/stripe-webhook...');
testEndpoint();

setTimeout(() => {
  console.log('');
  console.log('📋 Prochaines étapes pour finaliser:');
  console.log('1. Connectez-vous à https://dashboard.stripe.com');
  console.log('2. Allez dans Developers → Webhooks');
  console.log('3. Cliquez sur "Send test webhook" sur votre webhook windventure.fr');
  console.log('4. Sélectionnez "checkout.session.completed"');
  console.log('5. Vérifiez que le status est 200 OK');
  console.log('');
  console.log('✅ Si status = 200 : Webhook configuré avec succès !');
  console.log('❌ Si status = 400 : Vérifiez la signing secret dans Vercel');
}, 2000);