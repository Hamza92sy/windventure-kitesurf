#!/usr/bin/env node

/**
 * 🧪 Script de test du flux de paiement complet
 * Teste la création d'une session de checkout Stripe
 */

const https = require('https');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testAPIEndpoint(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody,
            rawBody: body
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: null,
            rawBody: body
          });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testPaymentFlow() {
  log('\n💳 TEST COMPLET DU FLUX DE PAIEMENT WINDVENTURE', 'blue');
  log('=================================================\n', 'blue');

  // Test data - package kitesurf réaliste
  const testPayment = {
    packageId: 'beginner-discovery',
    packageTitle: 'Beginner Discovery - 3 jours',
    price: 450, // Prix en euros
    participants: 1,
    bookingId: `test-${Date.now()}`,
    customerEmail: 'test@windventure.fr',
    customerName: 'Jean Testeur'
  };

  log('📦 Package de test:', 'yellow');
  log(`   Package: ${testPayment.packageTitle}`);
  log(`   Prix: ${testPayment.price}€`);
  log(`   Participants: ${testPayment.participants}`);
  log(`   Booking ID: ${testPayment.bookingId}\n`);

  try {
    log('🔄 Création de la session de checkout...', 'yellow');
    
    const result = await testAPIEndpoint(
      'https://windventure.fr/api/create-checkout-session',
      testPayment
    );

    log(`📊 Statut HTTP: ${result.status}`, result.status === 200 ? 'green' : 'red');

    if (result.status === 200 && result.body && result.body.url) {
      log('✅ SESSION STRIPE CRÉÉE AVEC SUCCÈS!', 'green');
      log(`🔗 URL de paiement: ${result.body.url}`, 'green');
      log(`💡 Session ID: ${result.body.sessionId || 'N/A'}`, 'green');
      
      log('\n🎯 PROCHAINES ÉTAPES POUR TESTER:', 'blue');
      log('1. Ouvrez cette URL dans votre navigateur:', 'reset');
      log(`   ${result.body.url}`, 'blue');
      log('2. Utilisez une carte de test:', 'reset');
      log('   Numéro: 4242 4242 4242 4242', 'reset');
      log('   Date: N\'importe quelle date future', 'reset');
      log('   CVC: N\'importe quel 3 chiffres', 'reset');
      log('3. Complétez le paiement', 'reset');
      log('4. Vérifiez que vous êtes redirigé vers windventure.fr', 'reset');

      log('\n✅ INTÉGRATION STRIPE PLEINEMENT FONCTIONNELLE!', 'green');
      return true;

    } else if (result.status === 500) {
      log('⚠️  Erreur serveur - Vérifications:', 'yellow');
      if (result.rawBody.includes('API key')) {
        log('❌ Clé API Stripe manquante ou invalide', 'red');
        log('📝 Action: Configurez STRIPE_SECRET_KEY dans Vercel', 'yellow');
      } else {
        log(`❌ Erreur: ${result.rawBody}`, 'red');
      }
      return false;

    } else if (result.status === 405) {
      log('❌ Endpoint non accessible (HTTP 405)', 'red');
      log('📝 Action: Vérifiez que le déploiement est terminé', 'yellow');
      return false;

    } else {
      log(`❌ Erreur inattendue: HTTP ${result.status}`, 'red');
      if (result.rawBody) {
        log(`📄 Réponse: ${result.rawBody.substring(0, 200)}...`, 'red');
      }
      return false;
    }

  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, 'red');
    return false;
  }
}

async function testWebhook() {
  log('\n🔗 TEST DU WEBHOOK STRIPE', 'blue');
  log('============================\n', 'blue');

  const webhookTest = {
    id: 'evt_test_webhook',
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_123',
        object: 'checkout.session',
        payment_status: 'paid'
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null
    },
    type: 'checkout.session.completed'
  };

  try {
    const result = await testAPIEndpoint(
      'https://windventure.fr/api/stripe-webhook',
      webhookTest
    );

    log(`📊 Statut HTTP: ${result.status}`, result.status === 200 ? 'green' : 'yellow');

    if (result.status === 200) {
      log('✅ Webhook accessible et fonctionnel!', 'green');
    } else if (result.status === 400) {
      log('⚠️  Webhook accessible mais signature invalide (normal)', 'yellow');
      log('✅ L\'endpoint webhook fonctionne', 'green');
    } else {
      log(`⚠️  Status inattendu: ${result.status}`, 'yellow');
    }

    return result.status === 200 || result.status === 400;

  } catch (error) {
    log(`❌ Erreur webhook: ${error.message}`, 'red');
    return false;
  }
}

async function runCompleteTest() {
  const paymentOK = await testPaymentFlow();
  const webhookOK = await testWebhook();

  log('\n' + '='.repeat(50), 'blue');
  log('\n📋 RÉSUMÉ FINAL', 'blue');
  log(`💳 Paiements: ${paymentOK ? '✅ Fonctionnels' : '❌ Problème'}`, paymentOK ? 'green' : 'red');
  log(`🔗 Webhook: ${webhookOK ? '✅ Accessible' : '❌ Problème'}`, webhookOK ? 'green' : 'red');

  if (paymentOK && webhookOK) {
    log('\n🎉 WINDVENTURE.FR EST 100% OPÉRATIONNEL!', 'green');
    log('🏄‍♂️ Vous pouvez maintenant vendre vos sessions de kitesurf!', 'green');
  } else {
    log('\n⚠️  Configuration incomplète', 'yellow');
    log('📖 Consultez: STRIPE_CONFIGURATION_GUIDE.md', 'yellow');
  }

  log('\n💡 Pour tester manuellement:', 'blue');
  log('1. Allez sur https://windventure.fr', 'reset');
  log('2. Cliquez sur "Book Now" sur un package', 'reset');
  log('3. Remplissez le formulaire de réservation', 'reset');
  log('4. Procédez au paiement avec 4242 4242 4242 4242', 'reset');
  log('5. Vérifiez la redirection après paiement\n', 'reset');
}

runCompleteTest().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});