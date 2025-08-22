#!/bin/bash

# Script de test du webhook Stripe pour windventure.fr
# Nécessite Stripe CLI installé

echo "🧪 TEST DU WEBHOOK STRIPE - WINDVENTURE.FR"
echo "=========================================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier si Stripe CLI est installé
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI n'est pas installé${NC}"
    echo "Installez-le avec: brew install stripe/stripe-cli/stripe"
    exit 1
fi

echo -e "${BLUE}📋 Options de test:${NC}"
echo "1. Tester avec le webhook local (développement)"
echo "2. Tester avec le webhook de production (windventure.fr)"
echo ""
read -p "Choisissez une option (1 ou 2): " option

case $option in
    1)
        WEBHOOK_URL="http://localhost:3000/api/stripe-webhook"
        echo -e "${YELLOW}🔧 Test en mode développement${NC}"
        ;;
    2)
        WEBHOOK_URL="https://windventure.fr/api/stripe-webhook"
        echo -e "${GREEN}🚀 Test en mode production${NC}"
        ;;
    *)
        echo -e "${RED}Option invalide${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}🎯 URL du webhook: ${NC}$WEBHOOK_URL"
echo ""

# Démarrer l'écoute du webhook
echo -e "${YELLOW}📡 Démarrage de l'écoute du webhook...${NC}"
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

# Commande pour écouter et transférer les événements
stripe listen --forward-to $WEBHOOK_URL --events checkout.session.completed,payment_intent.succeeded &
LISTEN_PID=$!

# Attendre que l'écoute soit établie
sleep 3

echo ""
echo -e "${GREEN}✅ Webhook en écoute${NC}"
echo ""
echo -e "${BLUE}📦 Test des événements:${NC}"
echo ""

# Menu de test
while true; do
    echo "Que voulez-vous tester?"
    echo "1. Checkout session complétée (réservation réussie)"
    echo "2. Paiement réussi"
    echo "3. Paiement échoué"
    echo "4. Test complet (tous les événements)"
    echo "5. Quitter"
    echo ""
    read -p "Choisissez une option: " test_option

    case $test_option in
        1)
            echo -e "${YELLOW}🔄 Envoi d'un événement checkout.session.completed...${NC}"
            stripe trigger checkout.session.completed
            echo -e "${GREEN}✅ Événement envoyé${NC}"
            ;;
        2)
            echo -e "${YELLOW}🔄 Envoi d'un événement payment_intent.succeeded...${NC}"
            stripe trigger payment_intent.succeeded
            echo -e "${GREEN}✅ Événement envoyé${NC}"
            ;;
        3)
            echo -e "${YELLOW}🔄 Envoi d'un événement payment_intent.payment_failed...${NC}"
            stripe trigger payment_intent.payment_failed
            echo -e "${GREEN}✅ Événement envoyé${NC}"
            ;;
        4)
            echo -e "${YELLOW}🔄 Envoi de tous les événements de test...${NC}"
            stripe trigger checkout.session.completed
            sleep 1
            stripe trigger payment_intent.succeeded
            sleep 1
            stripe trigger payment_intent.payment_failed
            echo -e "${GREEN}✅ Tous les événements envoyés${NC}"
            ;;
        5)
            echo -e "${BLUE}👋 Arrêt du test...${NC}"
            kill $LISTEN_PID 2>/dev/null
            exit 0
            ;;
        *)
            echo -e "${RED}Option invalide${NC}"
            ;;
    esac
    echo ""
done