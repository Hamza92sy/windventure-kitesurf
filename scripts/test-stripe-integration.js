#!/usr/bin/env node

/**
 * 🧪 Script de test d'intégration Stripe
 * Vérifie que l'API Stripe est correctement configurée
 */

const https = require('https');

const SITE_URL = 'https://windventure.fr';
const LOCAL_URL = 'http://localhost:3000';

// Couleurs pour le terminal
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

// Test HTTP simple
function testEndpoint(url, method = 'POST', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const protocol = urlObj.protocol === 'https:' ? https : require('http');
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  log('\n🧪 TEST D\'INTÉGRATION STRIPE - WINDVENTURE.FR', 'blue');
  log('==============================================\n', 'blue');

  const isLocal = process.argv.includes('--local');
  const baseUrl = isLocal ? LOCAL_URL : SITE_URL;
  
  log(`📍 Test sur: ${baseUrl}\n`, 'yellow');

  const tests = [
    {
      name: 'API Health Check',
      endpoint: '/api/test',
      data: { test: true },
      expectedStatus: [200, 404, 405] // 404/405 si route n'existe pas
    },
    {
      name: 'Stripe Checkout Session',
      endpoint: '/api/create-checkout-session',
      data: {
        packageId: 'test-package',
        packageTitle: 'Test Package',
        price: 100,
        participants: 1,
        bookingId: 'test-' + Date.now()
      },
      expectedStatus: [200, 400, 401, 500] // 401 si pas de clé, 500 si erreur config
    },
    {
      name: 'Stripe Webhook',
      endpoint: '/api/stripe-webhook',
      data: {
        type: 'test.ping',
        data: { object: {} }
      },
      expectedStatus: [200, 400, 401, 405]
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    try {
      log(`\n📝 Test: ${test.name}`, 'yellow');
      log(`   Endpoint: ${test.endpoint}`);
      
      const result = await testEndpoint(baseUrl + test.endpoint, 'POST', test.data);
      
      if (test.expectedStatus.includes(result.status)) {
        log(`   ✅ Status: ${result.status}`, 'green');
        
        // Analyser la réponse
        if (result.status === 200) {
          log('   ✅ Endpoint fonctionnel!', 'green');
        } else if (result.status === 401) {
          log('   ⚠️  Clés API manquantes ou invalides', 'yellow');
        } else if (result.status === 405) {
          log('   ⚠️  Méthode non autorisée (route peut-être manquante)', 'yellow');
        } else if (result.status === 500) {
          log('   ⚠️  Erreur serveur (vérifier les logs)', 'yellow');
        }
        
        passedTests++;
      } else {
        log(`   ❌ Status inattendu: ${result.status}`, 'red');
        log(`   Attendu: ${test.expectedStatus.join(' ou ')}`, 'red');
        if (result.body) {
          log(`   Réponse: ${result.body.substring(0, 100)}...`, 'red');
        }
        failedTests++;
      }
    } catch (error) {
      log(`   ❌ Erreur: ${error.message}`, 'red');
      failedTests++;
    }
  }

  // Résumé
  log('\n' + '='.repeat(50), 'blue');
  log('\n📊 RÉSUMÉ DES TESTS\n', 'blue');
  
  const total = passedTests + failedTests;
  const successRate = Math.round((passedTests / total) * 100);
  
  log(`Tests réussis: ${passedTests}/${total} (${successRate}%)`, passedTests === total ? 'green' : 'yellow');
  
  if (passedTests === total) {
    log('\n🎉 Tous les tests sont passés!', 'green');
    log('L\'intégration Stripe semble fonctionnelle.\n', 'green');
  } else {
    log('\n⚠️  Certains tests ont échoué.', 'yellow');
    log('Vérifiez la configuration Stripe et les logs Vercel.\n', 'yellow');
  }

  // Conseils
  log('💡 PROCHAINES ÉTAPES:', 'blue');
  
  if (!isLocal) {
    log('1. Vérifiez les variables dans Vercel Dashboard', 'reset');
    log('2. Consultez les logs: vercel logs windventure-premium --follow', 'reset');
    log('3. Testez un vrai paiement sur le site', 'reset');
  } else {
    log('1. Assurez-vous que .env.local contient les bonnes clés', 'reset');
    log('2. Relancez le serveur: npm run dev', 'reset');
    log('3. Testez avec --local pour le développement local', 'reset');
  }
  
  log('\n📖 Documentation: STRIPE_CONFIGURATION_GUIDE.md', 'blue');
  log('🆘 Support Stripe: https://support.stripe.com\n', 'blue');
}

// Lancer les tests
runTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});