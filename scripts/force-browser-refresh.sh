#!/bin/bash

echo "🔄 FORÇAGE RAFRAÎCHISSEMENT NAVIGATEUR"
echo "======================================"

# 1. Purger le cache CDN avec plusieurs méthodes
echo "1️⃣ Purge CDN cache..."
curl -X PURGE https://windventure.fr >/dev/null 2>&1
curl -H "Cache-Control: no-cache" https://windventure.fr >/dev/null 2>&1

# 2. Vérifier le contenu actuel
echo "2️⃣ Vérification contenu..."
ENGLISH=$(curl -s https://windventure.fr | grep -c "Your Ultimate Kitesurfing")
FRENCH=$(curl -s https://windventure.fr | grep -c "Libérez le Vent")

echo "   - Contenu anglais trouvé: $ENGLISH"
echo "   - Contenu français trouvé: $FRENCH"

# 3. Instructions pour l'utilisateur
echo "3️⃣ ACTIONS UTILISATEUR NÉCESSAIRES:"
echo ""
echo "   🔥 VIDER LE CACHE NAVIGATEUR:"
echo "   - Chrome/Safari: Cmd+Shift+R (Mac) ou Ctrl+Shift+R (PC)"
echo "   - Firefox: Ctrl+F5"
echo ""
echo "   🕵️ TESTER EN NAVIGATION PRIVÉE:"
echo "   - Ouvrez une fenêtre privée/incognito"
echo "   - Allez sur https://windventure.fr"
echo ""
echo "   ⚡ SI PROBLÈME PERSISTE:"
echo "   - Redémarrez votre navigateur"
echo "   - Videz complètement le cache dans les paramètres"
echo ""

if [ $ENGLISH -gt 0 ]; then
    echo "✅ STATUT: Le serveur sert le bon contenu anglais"
    echo "   Le problème est uniquement le cache du navigateur"
else
    echo "❌ STATUT: Problème serveur détecté"
    echo "   Nouveau déploiement nécessaire"
fi

echo "======================================"