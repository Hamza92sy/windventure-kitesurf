#!/bin/bash

# 🔑 Script de configuration Stripe pour Vercel
# Auteur: WindVenture Team
# Date: 16/08/2025

echo "🔑 Configuration Stripe pour WindVenture.fr"
echo "=========================================="
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé."
    echo "Installez-le avec: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI détecté"
echo ""

# Demander le mode
echo "Quel mode voulez-vous configurer?"
echo "1) TEST (développement)"
echo "2) LIVE (production - paiements réels)"
read -p "Choix (1 ou 2): " mode_choice

if [ "$mode_choice" = "1" ]; then
    KEY_PREFIX="test"
    echo "📝 Mode TEST sélectionné"
else
    KEY_PREFIX="live"
    echo "💳 Mode LIVE sélectionné (paiements réels)"
fi

echo ""
echo "📋 Vous allez avoir besoin de:"
echo "1. Votre clé publique Stripe (pk_${KEY_PREFIX}_...)"
echo "2. Votre clé secrète Stripe (sk_${KEY_PREFIX}_...)"
echo "3. Votre webhook secret (whsec_...) - optionnel"
echo ""
echo "Trouvez ces clés sur: https://dashboard.stripe.com/apikeys"
echo ""
read -p "Appuyez sur Entrée quand vous êtes prêt..."

# Demander les clés
echo ""
read -p "Entrez votre clé PUBLIQUE Stripe (pk_${KEY_PREFIX}_...): " STRIPE_PK
read -s -p "Entrez votre clé SECRÈTE Stripe (sk_${KEY_PREFIX}_...): " STRIPE_SK
echo ""
read -p "Entrez votre webhook secret (whsec_...) ou Entrée pour ignorer: " WEBHOOK_SECRET

# Validation basique
if [[ ! "$STRIPE_PK" =~ ^pk_${KEY_PREFIX}_ ]]; then
    echo "❌ Clé publique invalide (doit commencer par pk_${KEY_PREFIX}_)"
    exit 1
fi

if [[ ! "$STRIPE_SK" =~ ^sk_${KEY_PREFIX}_ ]]; then
    echo "❌ Clé secrète invalide (doit commencer par sk_${KEY_PREFIX}_)"
    exit 1
fi

echo ""
echo "🔧 Configuration des variables d'environnement Vercel..."
echo ""

# Configurer les variables
echo "1️⃣ Configuration de STRIPE_SECRET_KEY..."
vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SK"
vercel env add STRIPE_SECRET_KEY preview <<< "$STRIPE_SK"
vercel env add STRIPE_SECRET_KEY development <<< "$STRIPE_SK"

echo "2️⃣ Configuration de NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<< "$STRIPE_PK"
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview <<< "$STRIPE_PK"
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY development <<< "$STRIPE_PK"

echo "3️⃣ Configuration de NEXT_PUBLIC_BASE_URL..."
vercel env add NEXT_PUBLIC_BASE_URL production <<< "https://windventure.fr"

if [ ! -z "$WEBHOOK_SECRET" ]; then
    echo "4️⃣ Configuration de STRIPE_WEBHOOK_SECRET..."
    vercel env add STRIPE_WEBHOOK_SECRET production <<< "$WEBHOOK_SECRET"
fi

echo ""
echo "✅ Variables configurées avec succès!"
echo ""

# Proposer de redéployer
read -p "Voulez-vous redéployer maintenant? (o/n): " deploy_choice

if [ "$deploy_choice" = "o" ] || [ "$deploy_choice" = "O" ]; then
    echo "🚀 Déploiement en cours..."
    vercel --prod
    echo ""
    echo "✅ Déploiement terminé!"
else
    echo "⚠️  N'oubliez pas de redéployer pour appliquer les changements:"
    echo "   vercel --prod"
fi

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez le webhook dans Stripe Dashboard:"
echo "   URL: https://windventure.fr/api/stripe-webhook"
echo "2. Testez un paiement sur https://windventure.fr"
echo ""

if [ "$KEY_PREFIX" = "test" ]; then
    echo "🧪 Cartes de test:"
    echo "   Succès: 4242 4242 4242 4242"
    echo "   Décliné: 4000 0000 0000 0002"
    echo "   Date: N'importe quelle date future"
    echo "   CVC: N'importe quel 3 chiffres"
fi

echo ""
echo "📖 Documentation complète: STRIPE_CONFIGURATION_GUIDE.md"
echo "🆘 Support: https://stripe.com/support"
echo ""