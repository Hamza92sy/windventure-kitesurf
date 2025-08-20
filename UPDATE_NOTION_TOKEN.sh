#!/bin/bash

# Script pour mettre à jour le token Notion facilement

echo "🔐 MISE À JOUR TOKEN NOTION"
echo "═══════════════════════════"
echo ""
echo "📝 Collez votre token Notion (commence par secret_) :"
read -r NOTION_TOKEN

# Vérifier que le token commence par secret_
if [[ ! "$NOTION_TOKEN" =~ ^secret_ ]]; then
    echo "❌ Le token doit commencer par 'secret_'"
    exit 1
fi

# Backup de .env.local
cp .env.local .env.local.backup-$(date +%s)

# Mettre à jour le token
if grep -q "NOTION_API_KEY=" .env.local; then
    # Sur macOS, utiliser sed -i '' 
    sed -i '' "s/NOTION_API_KEY=.*/NOTION_API_KEY=$NOTION_TOKEN/" .env.local
    echo "✅ Token Notion mis à jour dans .env.local"
else
    echo "NOTION_API_KEY=$NOTION_TOKEN" >> .env.local
    echo "✅ Token Notion ajouté à .env.local"
fi

echo ""
echo "🔗 ÉTAPE SUIVANTE : Connecter l'intégration à votre database"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "1. Ouvrez votre database Notion : Windventure Command Center"
echo "2. Cliquez sur '...' (trois points) en haut à droite"
echo "3. Sélectionnez 'Add connections'"
echo "4. Choisissez 'Windventure Command Center'"
echo ""
echo "📊 Une fois fait, testez avec : npm run notion:test"