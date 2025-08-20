#!/bin/bash

echo "🔍 Test rapide connexion Notion..."
echo ""

# Test diagnostic
node scripts/notion-diagnostic.js | grep -E "(Databases trouvées:|Database Windventure|✅|❌)"

echo ""
echo "═══════════════════════════════════════"
echo "📝 Si vous voyez 'Databases trouvées: 0'"
echo "   → L'intégration n'a pas encore accès"
echo ""
echo "📝 Si vous voyez 'Databases trouvées: 1' ou plus"
echo "   → L'intégration a accès! Lancez: npm run notion:test"
echo "═══════════════════════════════════════"