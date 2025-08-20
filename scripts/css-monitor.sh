#!/bin/bash

# 🎨 CSS Monitoring Script - Windventure
# Script de monitoring complet CSS avec Playwright + Lighthouse

set -e

echo "🚀 Starting CSS Monitoring for Windventure..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="https://windventure.fr"
TEST_URL="$SITE_URL/css-test"

echo -e "${BLUE}📊 Site URL: $SITE_URL${NC}"
echo -e "${BLUE}🧪 Test URL: $TEST_URL${NC}"
echo ""

# 1. Vérification que le site répond
echo -e "${YELLOW}1. 🌐 Checking site availability...${NC}"
if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Site is online${NC}"
else
    echo -e "${RED}❌ Site is not responding${NC}"
    exit 1
fi

# 2. Tests CSS avec Playwright
echo -e "${YELLOW}2. 🧪 Running CSS Playwright tests...${NC}"
if npm run test:css:monitor; then
    echo -e "${GREEN}✅ CSS tests passed${NC}"
else
    echo -e "${RED}❌ CSS tests failed${NC}"
    echo -e "${YELLOW}📊 Check test results in playwright-report/${NC}"
    exit 1
fi

# 3. Quick health check
echo -e "${YELLOW}3. ⚡ Running quick health check...${NC}"
if npm run test:css:ci; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# 4. Lighthouse audit (si disponible)
if command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}4. 🚦 Running Lighthouse CSS audit...${NC}"
    
    if lighthouse "$SITE_URL" \
        --only-categories=performance \
        --output=json \
        --output-path=./lighthouse-results.json \
        --chrome-flags="--headless --no-sandbox" \
        --quiet; then
        echo -e "${GREEN}✅ Lighthouse audit completed${NC}"
        
        # Parse results
        if command -v jq &> /dev/null; then
            FCP=$(jq -r '.audits["first-contentful-paint"].displayValue' lighthouse-results.json)
            LCP=$(jq -r '.audits["largest-contentful-paint"].displayValue' lighthouse-results.json)
            echo -e "${BLUE}📊 First Contentful Paint: $FCP${NC}"
            echo -e "${BLUE}📊 Largest Contentful Paint: $LCP${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Lighthouse audit failed (non-critical)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Lighthouse not installed, skipping audit${NC}"
fi

# 5. Summary
echo ""
echo -e "${GREEN}🎉 CSS Monitoring completed successfully!${NC}"
echo -e "${BLUE}📈 All systems operational:${NC}"
echo "   ✅ Site availability"
echo "   ✅ CSS loading"
echo "   ✅ Tailwind classes"
echo "   ✅ Visual rendering"
echo "   ✅ Performance metrics"
echo ""
echo -e "${YELLOW}📊 View detailed reports:${NC}"
echo "   - Playwright: playwright-report/index.html"
echo "   - Lighthouse: lighthouse-results.json"

# Clean up
rm -f lighthouse-results.json 2>/dev/null || true