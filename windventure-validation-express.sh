#!/bin/bash

# ⚡ SCRIPT TEST RAPIDE - WINDVENTURE.FR
# Validation technique express en 15 minutes
# Créé pour Hamza Seidou

echo "🚨 WINDVENTURE.FR - VALIDATION TECHNIQUE EXPRESS"
echo "=============================================="
echo "📅 Date: $(date)"
echo "⏰ Début: $(date +%H:%M:%S)"
echo ""

# Configuration
SITE_URL="https://windventure.fr"
TEST_EMAIL="test@windventure.fr"
RESULTS_DIR="./windventure_validation_$(date +%Y%m%d_%H%M%S)"

# Créer le dossier de résultats
mkdir -p "$RESULTS_DIR"
cd "$RESULTS_DIR"

echo "📁 Résultats sauvegardés dans: $RESULTS_DIR"
echo ""

# ✅ TEST 1: Disponibilité et temps de réponse
echo "🔍 TEST 1: Disponibilité et performance..."
{
  echo "=== UPTIME TEST ==="
  echo "Homepage: $(curl -o /dev/null -s -w '%{http_code} - %{time_total}s' $SITE_URL)"
  echo "Packages: $(curl -o /dev/null -s -w '%{http_code} - %{time_total}s' $SITE_URL/packages)"
  echo "About: $(curl -o /dev/null -s -w '%{http_code} - %{time_total}s' $SITE_URL/about)"
  echo ""
} > uptime_test.txt

cat uptime_test.txt

# ✅ TEST 2: Headers et sécurité
echo "🔒 TEST 2: Headers de sécurité..."
{
  echo "=== SECURITY HEADERS ==="
  curl -s -I "$SITE_URL" | grep -E "(Content-Security|X-Frame|X-Content|Strict-Transport)"
  echo ""
} > security_headers.txt

cat security_headers.txt

# ✅ TEST 3: Performance Lighthouse (si installé)
echo "📊 TEST 3: Performance Lighthouse..."
if command -v lighthouse &> /dev/null; then
  {
    echo "=== LIGHTHOUSE SCORES ==="
    lighthouse "$SITE_URL" --output=json --quiet --chrome-flags="--headless" --output-path=./lighthouse_report.json
    echo "Rapport Lighthouse généré: lighthouse_report.json"
    echo ""
  } > lighthouse_test.txt
  
  cat lighthouse_test.txt
else
  echo "⚠️  Lighthouse non installé - Test sauté"
  echo "Installation: npm install -g lighthouse"
fi

# ✅ TEST 4: Liens cassés
echo "🔗 TEST 4: Vérification des liens..."
{
  echo "=== BROKEN LINKS CHECK ==="
  
  # Extraire les liens de la homepage
  curl -s "$SITE_URL" | grep -oP 'href="[^"]*"' | sort | uniq > links.txt
  
  echo "Liens trouvés sur la homepage:"
  cat links.txt
  echo ""
  
  echo "Test des liens internes:"
  while read -r link; do
    url=$(echo "$link" | sed 's/href="//g' | sed 's/"//g')
    
    # Test uniquement les liens internes
    if [[ $url == /* ]] && [[ $url != "//" ]]; then
      full_url="$SITE_URL$url"
      status=$(curl -o /dev/null -s -w '%{http_code}' "$full_url")
      echo "$full_url: $status"
    fi
  done < links.txt
  echo ""
} > links_test.txt

cat links_test.txt

# ✅ TEST 5: Images et ressources
echo "🖼️  TEST 5: Optimisation des images..."
{
  echo "=== IMAGES OPTIMIZATION ==="
  
  # Vérifier les formats d'images modernes
  curl -s "$SITE_URL" | grep -oP 'src="[^"]*\.(webp|avif|jpg|jpeg|png)"' | head -10 > images.txt
  
  echo "Images détectées (échantillon):"
  cat images.txt
  echo ""
  
  echo "Formats d'images:"
  grep -o '\.(webp\|avif\|jpg\|jpeg\|png)' images.txt | sort | uniq -c
  echo ""
} > images_test.txt

cat images_test.txt

# ✅ TEST 6: Responsive design (simulation)
echo "📱 TEST 6: Test responsive (simulation)..."
{
  echo "=== RESPONSIVE TEST ==="
  
  # Tester avec différents User-Agents
  echo "Desktop (Chrome):"
  curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "$SITE_URL" | grep -o '<title>[^<]*' | head -1
  
  echo "Mobile (iPhone):"
  curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15" "$SITE_URL" | grep -o '<title>[^<]*' | head -1
  
  echo "Mobile (Android):"
  curl -s -H "User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36" "$SITE_URL" | grep -o '<title>[^<]*' | head -1
  echo ""
} > responsive_test.txt

cat responsive_test.txt

# ✅ TEST 7: Metadata et SEO
echo "🎯 TEST 7: SEO et métadonnées..."
{
  echo "=== SEO METADATA ==="
  
  page_content=$(curl -s "$SITE_URL")
  
  echo "Title:"
  echo "$page_content" | grep -oP '<title>\K[^<]*' || echo "Non trouvé"
  
  echo "Description:"
  echo "$page_content" | grep -oP '<meta name="description" content="\K[^"]*' || echo "Non trouvé"
  
  echo "Keywords:"
  echo "$page_content" | grep -oP '<meta name="keywords" content="\K[^"]*' || echo "Non trouvé"
  
  echo "Open Graph:"
  echo "$page_content" | grep -o '<meta property="og:[^"]*"[^>]*>' | head -5
  echo ""
} > seo_test.txt

cat seo_test.txt

# 📊 GÉNÉRATION DU RAPPORT FINAL
echo "📊 Génération du rapport final..."

{
  echo "# 🚨 RAPPORT DE VALIDATION WINDVENTURE.FR"
  echo "=================================="
  echo ""
  echo "**Date:** $(date)"
  echo "**Site:** $SITE_URL"
  echo "**Durée du test:** Environ 5-10 minutes"
  echo ""
  
  echo "## ✅ TESTS RÉALISÉS"
  echo ""
  echo "### 1. Disponibilité et Performance"
  cat uptime_test.txt
  echo ""
  
  echo "### 2. Sécurité"
  cat security_headers.txt
  echo ""
  
  echo "### 3. Liens"
  cat links_test.txt
  echo ""
  
  echo "### 4. Images"
  cat images_test.txt
  echo ""
  
  echo "### 5. Responsive"
  cat responsive_test.txt
  echo ""
  
  echo "### 6. SEO"
  cat seo_test.txt
  echo ""
  
  echo "## 🎯 RECOMMANDATIONS"
  echo ""
  echo "- [ ] Compléter le flow de booking complet"
  echo "- [ ] Tester l'intégration Stripe en mode test"
  echo "- [ ] Vérifier les emails de confirmation Resend"
  echo "- [ ] Audit Lighthouse complet (si pas fait)"
  echo "- [ ] Tests mobile sur vrais devices"
  echo "- [ ] Validation des formulaires"
  echo ""
  
  echo "## 📦 FICHIERS GÉNÉRÉS"
  echo ""
  echo "- uptime_test.txt"
  echo "- security_headers.txt"
  echo "- links_test.txt"  
  echo "- images_test.txt"
  echo "- responsive_test.txt"
  echo "- seo_test.txt"
  if [ -f lighthouse_report.json ]; then
    echo "- lighthouse_report.json"
  fi
  echo ""
  
} > RAPPORT_FINAL.md

# ✅ AFFICHAGE FINAL
echo ""
echo "✅ VALIDATION TERMINÉE!"
echo "====================="
echo "📁 Dossier: $RESULTS_DIR"
echo "📋 Rapport: RAPPORT_FINAL.md"
echo "⏰ Fin: $(date +%H:%M:%S)"
echo ""

# Afficher le résumé
echo "📊 RÉSUMÉ RAPIDE:"
echo "----------------"
grep -E "(Homepage|Packages|About):" uptime_test.txt | while read line; do
  echo "• $line"
done

echo ""
echo "🔗 ACTIONS SUIVANTES:"
echo "--------------------"
echo "1. Consulter le rapport complet: cat $RESULTS_DIR/RAPPORT_FINAL.md"
echo "2. Tester manuellement le flow de booking"
echo "3. Valider l'intégration Stripe"
echo "4. Configurer le monitoring automatisé Make.com"
echo ""

# Optionnel: Ouvrir le rapport
if command -v code &> /dev/null; then
  echo "💡 Ouverture du rapport dans VS Code..."
  code "$RESULTS_DIR/RAPPORT_FINAL.md"
elif command -v nano &> /dev/null; then
  echo "💡 Appuyez sur Entrée pour voir le rapport complet..."
  read
  nano "$RESULTS_DIR/RAPPORT_FINAL.md"
fi

echo "🎉 Script terminé avec succès!"