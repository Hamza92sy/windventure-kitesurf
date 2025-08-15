#!/bin/bash

# Script de monitoring pour windventure.fr
echo "🔍 Monitoring WindVenture..."

# Test principal site
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://windventure.fr)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ windventure.fr - OK (Status: $RESPONSE)"
else
    echo "❌ ALERTE: windventure.fr - Problème détecté (Status: $RESPONSE)"
    
    # Auto-correction
    echo "🔧 Tentative de correction automatique..."
    cd /Users/pro/Windventurefinal
    vercel --prod --yes
fi

# Test Vercel app
VERCEL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://windventure-premium.vercel.app)
echo "📊 Vercel App Status: $VERCEL_RESPONSE"

# Rapport
echo "📅 $(date '+%Y-%m-%d %H:%M:%S') - Check complet"