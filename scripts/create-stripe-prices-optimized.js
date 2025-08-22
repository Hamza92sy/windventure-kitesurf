#!/usr/bin/env node

/**
 * 🚀 SCRIPT CRÉATION PRIX STRIPE - PACKAGES OPTIMISÉS 4 PERSONNES
 * Crée automatiquement tous les nouveaux prix Stripe pour la migration
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');

const OPTIMIZED_PACKAGES = [
  {
    id: 'beginner-private',
    name: 'Beginner Private - 3 jours',
    description: 'Formation kitesurf privée 3 jours avec hébergement (1 personne max)',
    price: 72000, // 720€ en centimes
    maxPersons: 1,
    durationDays: 3,
    isPerPerson: false
  },
  {
    id: 'semi-private-discovery',
    name: 'Semi-Private Discovery - 3 jours',
    description: 'Découverte kitesurf groupe 3 jours avec hébergement (par personne, max 4)',
    price: 38000, // 380€ par personne
    maxPersons: 4,
    durationDays: 3,
    isPerPerson: true
  },
  {
    id: 'semi-private-experience',
    name: 'Semi-Private Experience - 5 jours',
    description: 'Expérience kitesurf groupe 5 jours avec hébergement (par personne, max 4)',
    price: 58000, // 580€ par personne
    maxPersons: 4,
    durationDays: 5,
    isPerPerson: true
  },
  {
    id: 'exploration-adventure',
    name: 'Exploration Adventure - 6 jours',
    description: 'Aventure kitesurf exploration spots 6 jours (par personne, max 4)',
    price: 75000, // 750€ par personne
    maxPersons: 4,
    durationDays: 6,
    isPerPerson: true
  },
  {
    id: 'combined-ultimate',
    name: 'Combined Ultimate Experience - 7 jours',
    description: 'Expérience kitesurf ultime 7 jours formation complète (par personne, max 4)',
    price: 95000, // 950€ par personne
    maxPersons: 4,
    durationDays: 7,
    isPerPerson: true
  }
];

async function createStripeProducts() {
  console.log('🚀 CRÉATION PRODUITS STRIPE - PACKAGES OPTIMISÉS 4 PERSONNES');
  console.log('===============================================================\n');

  const results = [];

  for (const pkg of OPTIMIZED_PACKAGES) {
    try {
      console.log(`📦 Création: ${pkg.name}...`);
      
      // Créer le produit Stripe
      const product = await stripe.products.create({
        name: pkg.name,
        description: pkg.description,
        metadata: {
          package_id: pkg.id,
          max_persons: pkg.maxPersons.toString(),
          duration_days: pkg.durationDays.toString(),
          price_per_person: pkg.isPerPerson.toString(),
          created_for: 'windventure_4persons_migration',
          business_margin: calculateMargin(pkg).toString()
        }
      });

      // Créer le prix associé
      const price = await stripe.prices.create({
        unit_amount: pkg.price,
        currency: 'eur',
        product: product.id,
        metadata: {
          package_id: pkg.id,
          max_persons: pkg.maxPersons.toString(),
          price_per_person: pkg.isPerPerson.toString()
        }
      });

      const result = {
        packageId: pkg.id,
        productId: product.id,
        priceId: price.id,
        amount: pkg.price / 100, // En euros
        maxPersons: pkg.maxPersons,
        isPerPerson: pkg.isPerPerson,
        estimatedMargin: calculateMargin(pkg)
      };
      
      results.push(result);
      
      console.log(`✅ Créé: ${pkg.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Price ID: ${price.id}`);
      console.log(`   Prix: ${pkg.price / 100}€ ${pkg.isPerPerson ? 'par personne' : 'forfait'}`);
      console.log(`   Marge estimée: ${calculateMargin(pkg)}€ (max ${pkg.maxPersons} pers)\n`);
      
    } catch (error) {
      console.error(`❌ Erreur création ${pkg.name}:`, error.message);
    }
  }

  // Sauvegarder les résultats
  const config = {
    migrationDate: new Date().toISOString(),
    packages: results,
    totalProducts: results.length,
    estimatedAnnualGain: calculateAnnualGain(results)
  };

  fs.writeFileSync(
    './stripe-products-optimized.json',
    JSON.stringify(config, null, 2)
  );

  console.log('💾 Configuration sauvegardée: stripe-products-optimized.json');
  console.log(`\n🎯 RÉSUMÉ MIGRATION:`);
  console.log(`   • Produits créés: ${results.length}/5`);
  console.log(`   • Gain annuel estimé: +${config.estimatedAnnualGain}€`);
  console.log(`   • Capacité max: 4 personnes simultanées`);
  
  return results;
}

function calculateMargin(pkg) {
  // Calcul marge basé sur business plan
  const dailyCosts = 200; // 200€/jour charges fixes
  const instructorRate = 0.15; // 15% du CA
  
  if (pkg.id === 'beginner-private') {
    const revenue = pkg.price / 100;
    const costs = dailyCosts * pkg.durationDays;
    const instructorCost = revenue * instructorRate;
    return Math.round(revenue - costs - instructorCost);
  } else {
    // Packages groupe - calcul à capacité max
    const revenueMax = (pkg.price / 100) * pkg.maxPersons;
    const costs = dailyCosts * pkg.durationDays;
    const instructorCost = revenueMax * instructorRate;
    return Math.round(revenueMax - costs - instructorCost);
  }
}

function calculateAnnualGain(results) {
  // Calcul gain annuel vs ancien système
  const weeklyClients = 12; // Moyenne 10-15 clients/semaine
  const activeWeeks = 26; // 6 mois saison active
  
  const totalAnnualMargin = results.reduce((total, pkg) => {
    if (pkg.packageId === 'beginner-private') {
      return total + (pkg.estimatedMargin * weeklyClients * 0.2 * activeWeeks); // 20% des clients
    } else {
      return total + (pkg.estimatedMargin * weeklyClients * 0.2 * activeWeeks); // 20% chaque package
    }
  }, 0);
  
  return Math.round(totalAnnualMargin);
}

// Exécution du script
if (require.main === module) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY non défini dans .env');
    process.exit(1);
  }
  
  createStripeProducts()
    .then(() => {
      console.log('\n🎉 MIGRATION STRIPE TERMINÉE AVEC SUCCÈS !');
      console.log('📋 Prochaines étapes:');
      console.log('   1. ✅ Mettre à jour le code avec les nouveaux Price IDs');
      console.log('   2. ✅ Tester les workflows Make.com');
      console.log('   3. ✅ Déployer en production');
    })
    .catch((error) => {
      console.error('💥 Erreur migration Stripe:', error);
      process.exit(1);
    });
}

module.exports = { createStripeProducts, OPTIMIZED_PACKAGES };