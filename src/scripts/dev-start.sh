#!/bin/bash

# 🚀 Windventure Development Starter
# Lance npm run dev + vérifie les ports ouverts + preview local

set -e

echo "🚀 Démarrage du développement Windventure..."
echo "============================================"

# Configuration
DEV_PORT=${DEV_PORT:-3000}
PREVIEW_PORT=${PREVIEW_PORT:-3001}
HOST=${HOST:-"localhost"}

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction de vérification de port
check_port() {
    local port=$1
    local service=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Port $port déjà utilisé par $service${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $port disponible${NC}"
        return 0
    fi
}

# Fonction de vérification des dépendances
check_dependencies() {
    echo -e "\n${BLUE}📦 VÉRIFICATION DES DÉPENDANCES${NC}"
    echo "--------------------------------"

    # Vérification de Node.js
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        echo -e "${GREEN}✅ Node.js $node_version${NC}"
    else
        echo -e "${RED}❌ Node.js non installé${NC}"
        exit 1
    fi

    # Vérification de npm
    if command -v npm &> /dev/null; then
        npm_version=$(npm --version)
        echo -e "${GREEN}✅ npm $npm_version${NC}"
    else
        echo -e "${RED}❌ npm non installé${NC}"
        exit 1
    fi

    # Vérification de package.json
    if [ -f "package.json" ]; then
        echo -e "${GREEN}✅ package.json trouvé${NC}"
    else
        echo -e "${RED}❌ package.json manquant${NC}"
        exit 1
    fi

    # Vérification de node_modules
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ node_modules installé${NC}"
    else
        echo -e "${YELLOW}⚠️  node_modules manquant, installation...${NC}"
        npm install
    fi
}

# Fonction de vérification des variables d'environnement
check_env() {
    echo -e "\n${BLUE}🔧 VÉRIFICATION DES VARIABLES D'ENVIRONNEMENT${NC}"
    echo "--------------------------------------------"

    # Vérification de .env.local
    if [ -f ".env.local" ]; then
        echo -e "${GREEN}✅ .env.local trouvé${NC}"

        # Vérification des variables critiques
        if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
            echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_URL configuré${NC}"
        else
            echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SUPABASE_URL manquant${NC}"
        fi

        if grep -q "STRIPE_SECRET_KEY" .env.local; then
            echo -e "${GREEN}✅ STRIPE_SECRET_KEY configuré${NC}"
        else
            echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY manquant${NC}"
        fi

        if grep -q "NEXT_PUBLIC_GA_ID" .env.local; then
            echo -e "${GREEN}✅ NEXT_PUBLIC_GA_ID configuré${NC}"
        else
            echo -e "${YELLOW}⚠️  NEXT_PUBLIC_GA_ID manquant${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  .env.local manquant${NC}"
        echo -e "${YELLOW}   Créez un fichier .env.local avec vos variables${NC}"
    fi
}

# Fonction de vérification des ports
check_ports() {
    echo -e "\n${BLUE}🔌 VÉRIFICATION DES PORTS${NC}"
    echo "---------------------------"

    check_port $DEV_PORT "serveur de développement" || {
        echo -e "${YELLOW}💡 Arrêtez le processus sur le port $DEV_PORT ou changez DEV_PORT${NC}"
        read -p "Voulez-vous continuer quand même ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }

    check_port $PREVIEW_PORT "serveur de preview"
}

# Fonction de démarrage du serveur
start_dev_server() {
    echo -e "\n${BLUE}🚀 DÉMARRAGE DU SERVEUR DE DÉVELOPPEMENT${NC}"
    echo "----------------------------------------"

    echo -e "${GREEN}🌐 URL: http://$HOST:$DEV_PORT${NC}"
    echo -e "${GREEN}📱 Mobile: http://$(ipconfig getifaddr en0 2>/dev/null || echo $HOST):$DEV_PORT${NC}"

    # Démarrage en arrière-plan avec logs
    echo -e "\n${PURPLE}📋 Logs du serveur:${NC}"
    echo "=================="

    # Démarrage du serveur
    npm run dev
}

# Fonction de vérification post-démarrage
post_start_check() {
    echo -e "\n${BLUE}🔍 VÉRIFICATION POST-DÉMARRAGE${NC}"
    echo "--------------------------------"

    # Attendre que le serveur démarre
    echo -n "⏳ Attente du démarrage du serveur... "
    sleep 5

    # Vérification de la réponse du serveur
    if curl -s "http://$HOST:$DEV_PORT" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Serveur accessible${NC}"
    else
        echo -e "${RED}❌ Serveur non accessible${NC}"
    fi
}

# Fonction d'affichage des URLs utiles
show_useful_urls() {
    echo -e "\n${BLUE}🔗 URLS UTILES${NC}"
    echo "-------------"
    echo -e "${GREEN}🏠 Homepage: http://$HOST:$DEV_PORT${NC}"
    echo -e "${GREEN}📦 Packages: http://$HOST:$DEV_PORT/packages${NC}"
    echo -e "${GREEN}📅 Booking: http://$HOST:$DEV_PORT/book${NC}"
    echo -e "${GREEN}📞 Contact: http://$HOST:$DEV_PORT/contact${NC}"
    echo -e "${GREEN}🔧 API Health: http://$HOST:$DEV_PORT/api/health${NC}"
}

# Fonction de gestion des signaux
cleanup() {
    echo -e "\n${YELLOW}🛑 Arrêt du serveur...${NC}"
    exit 0
}

# Capture des signaux d'arrêt
trap cleanup SIGINT SIGTERM

# Exécution principale
main() {
    # Vérifications préliminaires
    check_dependencies
    check_env
    check_ports

    # Affichage des URLs utiles
    show_useful_urls

    # Démarrage du serveur
    start_dev_server
}

# Lancement du script principal
main "$@"
