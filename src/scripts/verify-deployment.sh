#!/bin/bash

# 🚀 Windventure Deployment Verification Script
# Vérifie que les composants critiques sont en production

set -e

echo "🔍 Vérification du déploiement Windventure..."
echo "=============================================="

# Configuration
SITE_URL=${SITE_URL:-"https://windventure.fr"}
PREVIEW_URL=${PREVIEW_URL:-"https://windventure-git-main.vercel.app"}

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de vérification
check_component() {
    local url=$1
    local component=$2
    local selector=$3

    echo -n "🔍 Vérification de $component... "

    if curl -s "$url" | grep -q "$selector"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ MANQUANT${NC}"
        return 1
    fi
}

# Fonction de vérification d'image
check_image() {
    local url=$1
    local image_path=$2
    local image_name=$3

    echo -n "🖼️  Vérification de $image_name... "

    if curl -s -I "$url$image_path" | grep -q "200 OK"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ MANQUANT${NC}"
        return 1
    fi
}

# Fonction de vérification de favicon
check_favicon() {
    local url=$1

    echo -n "🎯 Vérification du favicon... "

    if curl -s -I "$url/favicon.ico" | grep -q "200 OK"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ MANQUANT${NC}"
        return 1
    fi
}

# Fonction de vérification de performance
check_performance() {
    local url=$1

    echo -n "⚡ Vérification des performances... "

    # Vérification basique du temps de réponse
    response_time=$(curl -s -w "%{time_total}" -o /dev/null "$url")

    if (( $(echo "$response_time < 3.0" | bc -l) )); then
        echo -e "${GREEN}✅ OK (${response_time}s)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  LENT (${response_time}s)${NC}"
        return 1
    fi
}

# Vérifications principales
echo -e "\n${BLUE}📊 VÉRIFICATIONS COMPOSANTS CRITIQUES${NC}"
echo "----------------------------------------"

errors=0

# Vérification de la homepage
echo -e "\n${YELLOW}🏠 HOMEPAGE${NC}"
check_component "$SITE_URL" "HeroDakhla" "HeroDakhla" || ((errors++))
check_component "$SITE_URL" "NavigationSimple" "NavigationSimple" || ((errors++))
check_component "$SITE_URL" "DakhlaGallery" "DakhlaGallery" || ((errors++))
check_component "$SITE_URL" "FooterMinimal" "FooterMinimal" || ((errors++))

# Vérification des images Dakhla
echo -e "\n${YELLOW}🖼️  IMAGES DAKHLA${NC}"
check_image "$SITE_URL" "/images/dakhla/dakhla-lagoon-1.jpg" "Dakhla Lagoon 1" || ((errors++))
check_image "$SITE_URL" "/images/dakhla/dakhla-lagoon-2.jpg" "Dakhla Lagoon 2" || ((errors++))
check_image "$SITE_URL" "/images/dakhla/white-dune-1.jpg" "White Dune 1" || ((errors++))
check_image "$SITE_URL" "/images/dakhla/white-dune-2.jpg" "White Dune 2" || ((errors++))

# Vérification du favicon
echo -e "\n${YELLOW}🎯 FAVICON${NC}"
check_favicon "$SITE_URL" || ((errors++))

# Vérification des pages critiques
echo -e "\n${YELLOW}📄 PAGES CRITIQUES${NC}"
check_component "$SITE_URL/packages" "Packages" "Choose Your Adventure" || ((errors++))
check_component "$SITE_URL/book" "Booking" "Book Your Adventure" || ((errors++))

# Vérification des performances
echo -e "\n${YELLOW}⚡ PERFORMANCES${NC}"
check_performance "$SITE_URL" || ((errors++))

# Vérification des APIs
echo -e "\n${YELLOW}🔌 APIS${NC}"
echo -n "🔍 Vérification API Supabase... "
if curl -s -I "$SITE_URL/api/create-booking" | grep -q "405 Method Not Allowed"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ ERREUR${NC}"
    ((errors++))
fi

echo -n "🔍 Vérification API Stripe... "
if curl -s -I "$SITE_URL/api/create-checkout-session" | grep -q "405 Method Not Allowed"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ ERREUR${NC}"
    ((errors++))
fi

# Résumé
echo -e "\n${BLUE}📊 RÉSUMÉ DE LA VÉRIFICATION${NC}"
echo "================================="

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUTES LES VÉRIFICATIONS SONT PASSÉES !${NC}"
    echo -e "${GREEN}✅ Déploiement réussi${NC}"
    exit 0
else
    echo -e "${RED}❌ $errors ERREUR(S) DÉTECTÉE(S)${NC}"
    echo -e "${YELLOW}⚠️  Vérifiez les composants manquants${NC}"
    exit 1
fi
