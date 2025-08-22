#!/usr/bin/env node

/**
 * 🔍 WINDVENTURE STRIPE VERIFICATION
 * Vérifie que la configuration Stripe est correcte
 */

const fs = require('fs');
const path = require('path');

async function verifyStripeSetup() {
  console.log('\n🔍 WINDVENTURE STRIPE VERIFICATION');
  console.log('='.repeat(50));

  const results = {
    envFile: false,
    stripeKeys: false,
    webhookSecret: false,
    productIds: false,
    baseUrl: false
  };

  // 1. Check .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  console.log('\n📁 1. VÉRIFICATION FICHIER .env.local');
  if (fs.existsSync(envPath)) {
    console.log('   ✅ .env.local trouvé');
    results.envFile = true;
    
    // Read and parse env file
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        envVars[key.trim()] = value.trim();
      }
    });

    // 2. Check Stripe keys
    console.log('\n🔑 2. VÉRIFICATION CLÉS STRIPE');
    const publishableKey = envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const secretKey = envVars.STRIPE_SECRET_KEY;
    
    if (publishableKey && (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))) {
      console.log('   ✅ Publishable Key valide');
      const keyType = publishableKey.startsWith('pk_live_') ? 'PRODUCTION' : 'TEST';
      console.log(`   📋 Type: ${keyType}`);
      results.stripeKeys = true;
    } else {
      console.log('   ❌ Publishable Key manquante ou invalide');
    }
    
    if (secretKey && (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_'))) {
      console.log('   ✅ Secret Key valide');
    } else {
      console.log('   ❌ Secret Key manquante ou invalide');
      results.stripeKeys = false;
    }

    // 3. Check webhook secret
    console.log('\n🔗 3. VÉRIFICATION WEBHOOK SECRET');
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && webhookSecret.startsWith('whsec_')) {
      console.log('   ✅ Webhook Secret valide');
      results.webhookSecret = true;
    } else {
      console.log('   ❌ Webhook Secret manquant ou invalide');
    }

    // 4. Check Product IDs
    console.log('\n🏷️  4. VÉRIFICATION PRODUCT IDS');
    const productIds = [
      'STRIPE_BEGINNER_PRIVATE_PRICE',
      'STRIPE_BEGINNER_SEMI_PRIVATE_PRICE', 
      'STRIPE_EXPLORATION_PRICE',
      'STRIPE_COMBINED_PRICE'
    ];
    
    const foundIds = productIds.filter(id => envVars[id] && envVars[id].startsWith('price_'));
    if (foundIds.length === 4) {
      console.log('   ✅ Tous les Product IDs configurés');
      results.productIds = true;
    } else {
      console.log(`   ⚠️  ${foundIds.length}/4 Product IDs trouvés`);
    }

    // 5. Check Base URL
    console.log('\n🌐 5. VÉRIFICATION BASE URL');
    const baseUrl = envVars.NEXT_PUBLIC_BASE_URL;
    if (baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'))) {
      console.log(`   ✅ Base URL: ${baseUrl}`);
      results.baseUrl = true;
    } else {
      console.log('   ❌ Base URL manquante ou invalide');
    }

  } else {
    console.log('   ❌ .env.local non trouvé');
    console.log('   💡 Exécutez: node scripts/setup-stripe.js');
  }

  // 6. Check API files
  console.log('\n📄 6. VÉRIFICATION FICHIERS API');
  const apiFiles = [
    'app/api/checkout/route.ts',
    'app/api/checkout/verify/route.ts',
    'app/api/stripe-webhook/route.ts'
  ];
  
  let apiFilesOk = 0;
  apiFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`   ✅ ${file}`);
      apiFilesOk++;
    } else {
      console.log(`   ❌ ${file} manquant`);
    }
  });

  // 7. Check pages
  console.log('\n📱 7. VÉRIFICATION PAGES');
  const pages = [
    'app/book/page.tsx',
    'app/success/page.tsx', 
    'app/cancel/page.tsx'
  ];
  
  let pagesOk = 0;
  pages.forEach(page => {
    if (fs.existsSync(path.join(process.cwd(), page))) {
      console.log(`   ✅ ${page}`);
      pagesOk++;
    } else {
      console.log(`   ❌ ${page} manquante`);
    }
  });

  // Summary
  console.log('\n📊 RÉSUMÉ VÉRIFICATION');
  console.log('='.repeat(30));
  
  const score = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`📁 Configuration: ${results.envFile ? '✅' : '❌'}`);
  console.log(`🔑 Clés Stripe: ${results.stripeKeys ? '✅' : '❌'}`);  
  console.log(`🔗 Webhook: ${results.webhookSecret ? '✅' : '❌'}`);
  console.log(`🏷️  Product IDs: ${results.productIds ? '✅' : '❌'}`);
  console.log(`🌐 Base URL: ${results.baseUrl ? '✅' : '❌'}`);
  console.log(`📄 Fichiers API: ${apiFilesOk}/3`);
  console.log(`📱 Pages: ${pagesOk}/3`);

  console.log(`\n🎯 SCORE GLOBAL: ${score}/${total} (${Math.round(score/total*100)}%)`);

  if (score === total && apiFilesOk === 3 && pagesOk === 3) {
    console.log('\n🎉 CONFIGURATION PARFAITE!');
    console.log('✅ Windventure Stripe est prêt pour la production');
    console.log('\n🚀 COMMANDES DE TEST:');
    console.log('   npm run dev');
    console.log('   Ouvrir: http://localhost:3000/book?package=combined');
  } else {
    console.log('\n⚠️  CONFIGURATION INCOMPLÈTE');
    console.log('💡 Exécutez: node scripts/setup-stripe.js');
  }

  // Test connection (if keys present)
  if (results.stripeKeys && results.envFile) {
    console.log('\n🧪 TEST CONNEXION STRIPE...');
    try {
      // This would require Stripe SDK, but we'll keep it simple for now
      console.log('   💡 Pour tester la connexion, utilisez le formulaire de booking');
    } catch (error) {
      console.log(`   ❌ Erreur connexion: ${error.message}`);
    }
  }
}

// Run verification
verifyStripeSetup().catch(console.error);