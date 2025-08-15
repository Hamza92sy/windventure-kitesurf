#!/bin/bash

echo "🚀 Déploiement Multi-Plateformes WindVenture"

# 1. Vercel Principal
echo "📦 Déploiement Vercel..."
vercel --prod --yes

# 2. GitHub Pages (backup)
echo "📦 Préparation GitHub Pages..."
npm run build
npx next export -o docs
echo "windventure.fr" > docs/CNAME
git add docs
git commit -m "Deploy to GitHub Pages"
git push

# 3. Test de santé
echo "🔍 Test des déploiements..."
curl -s -o /dev/null -w "Vercel: %{http_code}\n" https://windventure.fr
curl -s -o /dev/null -w "Vercel App: %{http_code}\n" https://windventure-premium.vercel.app

echo "✅ Déploiement terminé!"