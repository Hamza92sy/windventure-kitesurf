#!/bin/bash

# 🗺️ Windventure Sitemap Generator
# Génère un sitemap dynamique avec next-sitemap

set -e

echo "🗺️ Génération du sitemap Windventure..."
echo "======================================="

# Configuration
SITE_URL=${SITE_URL:-"https://windventure.fr"}
OUTPUT_DIR=${OUTPUT_DIR:-"public"}

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de vérification de next-sitemap
check_next_sitemap() {
    echo -e "\n${BLUE}📦 VÉRIFICATION NEXT-SITEMAP${NC}"
    echo "----------------------------"

    if npm list next-sitemap > /dev/null 2>&1; then
        echo -e "${GREEN}✅ next-sitemap installé${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  next-sitemap non installé${NC}"
        echo -n "📦 Installation de next-sitemap... "
        npm install next-sitemap --save-dev
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    fi
}

# Fonction de création du fichier de configuration
create_sitemap_config() {
    echo -e "\n${BLUE}⚙️  CRÉATION DE LA CONFIGURATION${NC}"
    echo "--------------------------------"

    cat > next-sitemap.config.js << EOF
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || '${SITE_URL}',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  outDir: '${OUTPUT_DIR}',
  exclude: [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/404',
    '/500',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    additionalSitemaps: [
      '${SITE_URL}/sitemap.xml',
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  transform: async (config, path) => {
    // Personnalisation des priorités par page
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Pages principales - haute priorité
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/packages') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/book') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/contact') {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path.startsWith('/packages/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
EOF

    echo -e "${GREEN}✅ Configuration next-sitemap créée${NC}"
}

# Fonction de génération du sitemap
generate_sitemap() {
    echo -e "\n${BLUE}🗺️  GÉNÉRATION DU SITEMAP${NC}"
    echo "---------------------------"

    # Vérification que le build existe
    if [ ! -d ".next" ]; then
        echo -e "${YELLOW}⚠️  Build Next.js manquant, génération...${NC}"
        npm run build
    fi

    # Génération du sitemap
    echo -n "🗺️  Génération du sitemap... "
    npx next-sitemap
    echo -e "${GREEN}✅ OK${NC}"
}

# Fonction de vérification des fichiers générés
verify_generated_files() {
    echo -e "\n${BLUE}🔍 VÉRIFICATION DES FICHIERS GÉNÉRÉS${NC}"
    echo "----------------------------------------"

    # Vérification du sitemap.xml
    if [ -f "${OUTPUT_DIR}/sitemap.xml" ]; then
        echo -e "${GREEN}✅ sitemap.xml généré${NC}"
        echo -n "📊 Nombre d'URLs dans le sitemap: "
        grep -c "<url>" "${OUTPUT_DIR}/sitemap.xml" || echo "0"
    else
        echo -e "${RED}❌ sitemap.xml manquant${NC}"
    fi

    # Vérification du robots.txt
    if [ -f "${OUTPUT_DIR}/robots.txt" ]; then
        echo -e "${GREEN}✅ robots.txt généré${NC}"
        echo "📋 Contenu du robots.txt:"
        cat "${OUTPUT_DIR}/robots.txt"
    else
        echo -e "${RED}❌ robots.txt manquant${NC}"
    fi

    # Vérification du sitemap-index.xml
    if [ -f "${OUTPUT_DIR}/sitemap-index.xml" ]; then
        echo -e "${GREEN}✅ sitemap-index.xml généré${NC}"
    else
        echo -e "${YELLOW}⚠️  sitemap-index.xml manquant (normal si un seul sitemap)${NC}"
    fi
}

# Fonction de validation du sitemap
validate_sitemap() {
    echo -e "\n${BLUE}✅ VALIDATION DU SITEMAP${NC}"
    echo "---------------------------"

    if [ -f "${OUTPUT_DIR}/sitemap.xml" ]; then
        echo -n "🔍 Validation XML du sitemap... "
        if xmllint --noout "${OUTPUT_DIR}/sitemap.xml" 2>/dev/null; then
            echo -e "${GREEN}✅ XML valide${NC}"
        else
            echo -e "${RED}❌ XML invalide${NC}"
        fi

        # Vérification des URLs importantes
        echo -n "🔍 Vérification des URLs critiques... "
        if grep -q "<loc>${SITE_URL}/</loc>" "${OUTPUT_DIR}/sitemap.xml" && \
           grep -q "<loc>${SITE_URL}/packages</loc>" "${OUTPUT_DIR}/sitemap.xml" && \
           grep -q "<loc>${SITE_URL}/book</loc>" "${OUTPUT_DIR}/sitemap.xml"; then
            echo -e "${GREEN}✅ URLs critiques présentes${NC}"
        else
            echo -e "${YELLOW}⚠️  Certaines URLs critiques manquantes${NC}"
        fi
    fi
}

# Fonction d'affichage des statistiques
show_statistics() {
    echo -e "\n${BLUE}📊 STATISTIQUES DU SITEMAP${NC}"
    echo "----------------------------"

    if [ -f "${OUTPUT_DIR}/sitemap.xml" ]; then
        echo -n "📈 Nombre total d'URLs: "
        grep -c "<url>" "${OUTPUT_DIR}/sitemap.xml" || echo "0"

        echo -n "📅 Dernière modification: "
        date -r "${OUTPUT_DIR}/sitemap.xml" "+%Y-%m-%d %H:%M:%S"

        echo -n "💾 Taille du fichier: "
        ls -lh "${OUTPUT_DIR}/sitemap.xml" | awk '{print $5}'
    fi
}

# Fonction de nettoyage
cleanup() {
    echo -e "\n${BLUE}🧹 NETTOYAGE${NC}"
    echo "---------"

    # Suppression du fichier de configuration temporaire
    if [ -f "next-sitemap.config.js" ]; then
        rm next-sitemap.config.js
        echo -e "${GREEN}✅ Fichier de configuration nettoyé${NC}"
    fi
}

# Exécution principale
main() {
    # Vérifications préliminaires
    check_next_sitemap

    # Création de la configuration
    create_sitemap_config

    # Génération du sitemap
    generate_sitemap

    # Vérifications post-génération
    verify_generated_files
    validate_sitemap
    show_statistics

    # Nettoyage
    cleanup

    # Résumé final
    echo -e "\n${BLUE}📊 RÉSUMÉ DE LA GÉNÉRATION${NC}"
    echo "==============================="
    echo -e "${GREEN}🎉 Sitemap généré avec succès !${NC}"
    echo -e "${GREEN}✅ Fichiers disponibles dans ${OUTPUT_DIR}/${NC}"
    echo -e "${GREEN}✅ robots.txt configuré${NC}"
    echo -e "${GREEN}✅ URLs optimisées pour le SEO${NC}"

    echo -e "\n${YELLOW}💡 CONSEILS${NC}"
    echo "--------"
    echo "• Vérifiez que les fichiers sont bien déployés"
    echo "• Testez l'accessibilité via ${SITE_URL}/sitemap.xml"
    echo "• Surveillez les performances dans Google Search Console"

    echo -e "\n${GREEN}✨ Sitemap prêt pour la production !${NC}"
}

# Lancement du script principal
main "$@"
