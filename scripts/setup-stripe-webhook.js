#!/usr/bin/env node

/**
 * Script de configuration du webhook Stripe pour windventure.fr
 * Ce script vous guide pour configurer correctement le webhook Stripe
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan(`
╔════════════════════════════════════════════════════════════╗
║      CONFIGURATION DU WEBHOOK STRIPE - WINDVENTURE.FR      ║
╚════════════════════════════════════════════════════════════╝
`));

console.log(chalk.yellow('📋 ÉTAPES À SUIVRE:\n'));

console.log(chalk.bold('1. CONNECTEZ-VOUS AU DASHBOARD STRIPE'));
console.log('   👉 https://dashboard.stripe.com\n');

console.log(chalk.bold('2. NAVIGUEZ VERS LES WEBHOOKS'));
console.log('   👉 Developers → Webhooks\n');

console.log(chalk.bold('3. CRÉEZ UN NOUVEAU WEBHOOK ENDPOINT'));
console.log('   Cliquez sur "Add endpoint"\n');

console.log(chalk.bold('4. CONFIGUREZ L\'ENDPOINT'));
console.log(chalk.green('   URL de l\'endpoint:'), chalk.bold.white('https://windventure.fr/api/stripe-webhook'));
console.log(chalk.green('   Description:'), 'Windventure Production Webhook\n');

console.log(chalk.bold('5. SÉLECTIONNEZ LES ÉVÉNEMENTS À ÉCOUTER'));
console.log('   Cochez les événements suivants:');
console.log('   ✅', chalk.cyan('checkout.session.completed'), '(Principal - pour les réservations)');
console.log('   ✅', chalk.cyan('payment_intent.succeeded'), '(Confirmation de paiement)');
console.log('   ✅', chalk.cyan('payment_intent.payment_failed'), '(Échec de paiement)');
console.log('   ✅', chalk.cyan('customer.created'), '(Optionnel - nouveau client)');
console.log('   ✅', chalk.cyan('invoice.payment_succeeded'), '(Optionnel - factures)\n');

console.log(chalk.bold('6. RÉCUPÉREZ LA SIGNING SECRET'));
console.log('   Après création, cliquez sur "Reveal" pour voir la signing secret');
console.log('   Elle ressemble à:', chalk.gray('whsec_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456...\n'));

console.log(chalk.bold('7. METTEZ À JOUR VERCEL'));
console.log('   👉 https://vercel.com/windventure/windventure-premium/settings/environment-variables');
console.log('   Mettez à jour:', chalk.green('STRIPE_WEBHOOK_SECRET'));
console.log('   Avec la nouvelle valeur de signing secret\n');

console.log(chalk.bgRed.white.bold(' IMPORTANT: NE SUPPRIMEZ PAS L\'ANCIEN WEBHOOK TOUT DE SUITE! '));
console.log(chalk.yellow('Gardez les deux actifs pendant 24h pour assurer la transition.\n'));

console.log(chalk.bold.green('📦 PRODUCT IDS ACTUELS (pour référence):'));
console.log('┌─────────────────────────┬────────────────────────────────────────┐');
console.log('│ Package                 │ Product ID                             │');
console.log('├─────────────────────────┼────────────────────────────────────────┤');
console.log('│ Beginner Private (€720) │ price_1Reo9xHUqGxCezEFwTKoXkzJ        │');
console.log('│ Semi-Private (€1,100)   │ price_1Reo8SHUqGxCezEF3ca4QL34        │');
console.log('│ Exploration (€1,250)    │ price_1ReoC9HUqGxCezEFSDRUrGTz        │');
console.log('│ Combined (€1,350)       │ price_1ReoApHUqGxCezEFCuWVKKGB        │');
console.log('└─────────────────────────┴────────────────────────────────────────┘\n');

console.log(chalk.bold.blue('🧪 TEST DU WEBHOOK:'));
console.log('Après configuration, testez avec:');
console.log(chalk.gray('stripe listen --forward-to https://windventure.fr/api/stripe-webhook'));
console.log(chalk.gray('stripe trigger checkout.session.completed\n'));

console.log(chalk.bold.green('✅ VÉRIFICATION FINALE:'));
console.log('1. Faites un test de paiement sur https://windventure.fr/book?package=combined');
console.log('2. Vérifiez dans Stripe Dashboard → Webhooks → Recent deliveries');
console.log('3. Assurez-vous que le statut est "Succeeded" (200)\n');

console.log(chalk.bgGreen.black.bold(' SUCCÈS! Votre webhook est maintenant configuré pour windventure.fr '));