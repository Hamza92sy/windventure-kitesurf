#!/bin/bash

# 🧹 Windventure Build Cache Cleaner
# Nettoie proprement le cache .next et les fichiers temporaires

set -e

echo "🧹 Nettoyage du cache de build Windventure..."
echo "============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de nettoyage sécurisée
clean_directory() {
    local dir=$1
    local description=$2

    if [ -d "$dir" ]; then
        echo -n "🗑️  Suppression de $description... "
        rm -rf "$dir"
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${YELLOW}⚠️  $description n'existe pas${NC}"
    fi
}

# Fonction de vérification d'espace disque
check_disk_space() {
    echo -e "\n${BLUE}💾 ESPACE DISQUE${NC}"
    echo "----------------"

    # Espace avant nettoyage
    echo -n "📊 Espace disque avant nettoyage: "
    df -h . | tail -1 | awk '{print $4}'
}

# Fonction de nettoyage des modules node
clean_node_modules() {
    echo -e "\n${YELLOW}📦 NETTOYAGE NODE_MODULES${NC}"
    echo "---------------------------"

    if [ -d "node_modules" ]; then
        echo -n "🗑️  Suppression de node_modules... "
        rm -rf node_modules
        echo -e "${GREEN}✅ OK${NC}"

        echo -n "📦 Réinstallation des dépendances... "
        npm install --silent
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${YELLOW}⚠️  node_modules n'existe pas${NC}"
    fi
}

# Vérification de l'espace disque avant
check_disk_space

# Nettoyage des caches Next.js
echo -e "\n${YELLOW}🏗️  NETTOYAGE CACHE NEXT.JS${NC}"
echo "----------------------------"

clean_directory ".next" "Cache Next.js"
clean_directory ".next/cache" "Cache Next.js (sous-dossier)"

# Nettoyage des caches npm/yarn
echo -e "\n${YELLOW}📦 NETTOYAGE CACHE NPM${NC}"
echo "----------------------"

if command -v npm &> /dev/null; then
    echo -n "🗑️  Nettoyage cache npm... "
    npm cache clean --force --silent
    echo -e "${GREEN}✅ OK${NC}"
fi

# Nettoyage des fichiers temporaires
echo -e "\n${YELLOW}📄 NETTOYAGE FICHIERS TEMPORAIRES${NC}"
echo "--------------------------------"

# Suppression des fichiers .DS_Store (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
echo -e "${GREEN}✅ Fichiers .DS_Store supprimés${NC}"

# Suppression des fichiers de log
find . -name "*.log" -type f -delete 2>/dev/null || true
echo -e "${GREEN}✅ Fichiers de log supprimés${NC}"

# Suppression des fichiers temporaires
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.temp" -type f -delete 2>/dev/null || true
echo -e "${GREEN}✅ Fichiers temporaires supprimés${NC}"

# Nettoyage optionnel de node_modules (demande confirmation)
echo -e "\n${BLUE}🤔 NETTOYAGE COMPLET ?${NC}"
echo "========================"
read -p "Voulez-vous aussi nettoyer node_modules et réinstaller ? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    clean_node_modules
fi

# Vérification de l'espace disque après
check_disk_space

# Reconstruction du cache
echo -e "\n${YELLOW}🔨 RECONSTRUCTION DU CACHE${NC}"
echo "---------------------------"

echo -n "🏗️  Build de développement... "
npm run build --silent
echo -e "${GREEN}✅ OK${NC}"

# Résumé final
echo -e "\n${BLUE}📊 RÉSUMÉ DU NETTOYAGE${NC}"
echo "========================="
echo -e "${GREEN}🎉 Nettoyage terminé avec succès !${NC}"
echo -e "${GREEN}✅ Cache Next.js nettoyé${NC}"
echo -e "${GREEN}✅ Fichiers temporaires supprimés${NC}"
echo -e "${GREEN}✅ Build reconstruit${NC}"

echo -e "\n${YELLOW}💡 CONSEILS${NC}"
echo "--------"
echo "• Lancez 'npm run dev' pour redémarrer le serveur de développement"
echo "• Vérifiez que tout fonctionne correctement"
echo "• Le prochain build sera plus rapide"

echo -e "\n${GREEN}✨ Prêt pour le développement !${NC}"
