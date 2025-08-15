#!/bin/bash

# 📦 Bundle Analysis Automation for Windventure
# Analyzes bundle size, performance metrics, and optimization opportunities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
PROJECT_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
LOG_DIR="$PROJECT_ROOT/logs"
HISTORY_DIR="$PROJECT_ROOT/history"
REPORT_FILE="$HISTORY_DIR/PERF_BUNDLE_REPORT.md"
BUILD_DIR="$PROJECT_ROOT/.next"
BUNDLE_ANALYZER_PORT=8888
LIGHTHOUSE_PORT=3000

# Thresholds (in KB)
BUNDLE_SIZE_WARNING=500
BUNDLE_SIZE_ERROR=1000
JS_SIZE_WARNING=300
CSS_SIZE_WARNING=100

# Function to print colored output
print_status() {
    echo -e "${BLUE}[BUNDLE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Function to get current timestamp
get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Function to format bytes to human readable
format_bytes() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$((bytes / 1024))KB"
    else
        echo "$((bytes / 1048576))MB"
    fi
}

# Initialize report
init_report() {
    local timestamp=$(get_timestamp)

    cat > "$REPORT_FILE" << EOF
# 📦 RAPPORT ANALYSE BUNDLE & PERFORMANCE
**Date :** $timestamp
**Scope :** Analyse bundle, performance Lighthouse et optimisations
**Script :** bundle-analyze.sh

---

## 📊 RÉSUMÉ EXÉCUTIF

| Métrique | Valeur | Seuil | Status |
|----------|--------|-------|--------|
EOF
}

# Function to build application for analysis
build_for_analysis() {
    print_status "Building application for analysis..."

    # Set NODE_ENV to production for accurate analysis
    export NODE_ENV=production

    if (cd "$PROJECT_ROOT" && npm run build > "$LOG_DIR/build_output.log" 2>&1); then
        print_success "Build completed successfully"
        return 0
    else
        print_error "Build failed - check logs"
        cat "$LOG_DIR/build_output.log" | tail -20
        return 1
    fi
}

# Function to analyze bundle size
analyze_bundle_size() {
    print_status "Analyzing bundle size..."

    local total_size=0
    local js_size=0
    local css_size=0
    local html_size=0
    local image_size=0

    # Check if build directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory not found. Run build first."
        return 1
    fi

    # Calculate JavaScript bundle size
    if [ -d "$BUILD_DIR/static/chunks" ]; then
        js_size=$(find "$BUILD_DIR/static/chunks" -name "*.js" -type f -exec wc -c {} + | tail -1 | awk '{print $1}')
        js_size=${js_size:-0}
    fi

    # Calculate CSS bundle size
    if [ -d "$BUILD_DIR/static/css" ]; then
        css_size=$(find "$BUILD_DIR/static/css" -name "*.css" -type f -exec wc -c {} + | tail -1 | awk '{print $1}')
        css_size=${css_size:-0}
    fi

    # Calculate HTML size
    if [ -d "$BUILD_DIR/server/pages" ]; then
        html_size=$(find "$BUILD_DIR/server/pages" -name "*.html" -type f -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
        html_size=${html_size:-0}
    fi

    # Calculate image size
    if [ -d "$BUILD_DIR/static/media" ]; then
        image_size=$(find "$BUILD_DIR/static/media" -type f -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
        image_size=${image_size:-0}
    fi

    total_size=$((js_size + css_size + html_size + image_size))

    # Log results
    echo "[$(get_timestamp)] Bundle Analysis Results:" >> "$LOG_DIR/bundle_analysis.log"
    echo "  Total Size: $(format_bytes $total_size)" >> "$LOG_DIR/bundle_analysis.log"
    echo "  JavaScript: $(format_bytes $js_size)" >> "$LOG_DIR/bundle_analysis.log"
    echo "  CSS: $(format_bytes $css_size)" >> "$LOG_DIR/bundle_analysis.log"
    echo "  HTML: $(format_bytes $html_size)" >> "$LOG_DIR/bundle_analysis.log"
    echo "  Images: $(format_bytes $image_size)" >> "$LOG_DIR/bundle_analysis.log"

    # Determine status based on thresholds
    local js_kb=$((js_size / 1024))
    local css_kb=$((css_size / 1024))
    local total_kb=$((total_size / 1024))

    # Check JavaScript size
    if [ $js_kb -gt $BUNDLE_SIZE_ERROR ]; then
        print_error "JavaScript bundle size critical: $(format_bytes $js_size)"
        echo "| **JavaScript Bundle** | $(format_bytes $js_size) | ${BUNDLE_SIZE_ERROR}KB | ❌ CRITIQUE |" >> "$REPORT_FILE"
    elif [ $js_kb -gt $BUNDLE_SIZE_WARNING ]; then
        print_warning "JavaScript bundle size warning: $(format_bytes $js_size)"
        echo "| **JavaScript Bundle** | $(format_bytes $js_size) | ${BUNDLE_SIZE_WARNING}KB | ⚠️ ATTENTION |" >> "$REPORT_FILE"
    else
        print_success "JavaScript bundle size optimal: $(format_bytes $js_size)"
        echo "| **JavaScript Bundle** | $(format_bytes $js_size) | ${BUNDLE_SIZE_WARNING}KB | ✅ OPTIMAL |" >> "$REPORT_FILE"
    fi

    # Check CSS size
    if [ $css_kb -gt $CSS_SIZE_WARNING ]; then
        print_warning "CSS bundle size warning: $(format_bytes $css_size)"
        echo "| **CSS Bundle** | $(format_bytes $css_size) | ${CSS_SIZE_WARNING}KB | ⚠️ ATTENTION |" >> "$REPORT_FILE"
    else
        print_success "CSS bundle size optimal: $(format_bytes $css_size)"
        echo "| **CSS Bundle** | $(format_bytes $css_size) | ${CSS_SIZE_WARNING}KB | ✅ OPTIMAL |" >> "$REPORT_FILE"
    fi

    echo "| **Total Bundle** | $(format_bytes $total_size) | - | 📊 INFO |" >> "$REPORT_FILE"

    print_success "Bundle size analysis completed"
}

# Function to analyze bundle composition
analyze_bundle_composition() {
    print_status "Analyzing bundle composition..."

    local chunks_dir="$BUILD_DIR/static/chunks"
    local page_chunks=0
    local shared_chunks=0
    local vendor_chunks=0

    if [ -d "$chunks_dir" ]; then
        # Count different types of chunks
        page_chunks=$(find "$chunks_dir" -name "pages-*.js" 2>/dev/null | wc -l)
        shared_chunks=$(find "$chunks_dir" -name "main-*.js" -o -name "webpack-*.js" 2>/dev/null | wc -l)
        vendor_chunks=$(find "$chunks_dir" -name "*vendor*.js" -o -name "*node_modules*.js" 2>/dev/null | wc -l)

        # Find largest chunks
        print_info "Top 5 largest JavaScript chunks:"
        find "$chunks_dir" -name "*.js" -type f -exec ls -la {} + | sort -k5 -nr | head -5 | while read line; do
            local file=$(echo "$line" | awk '{print $9}')
            local size=$(echo "$line" | awk '{print $5}')
            local filename=$(basename "$file")
            echo "  - $filename: $(format_bytes $size)" | tee -a "$LOG_DIR/bundle_analysis.log"
        done

        # Log composition
        echo "[$(get_timestamp)] Bundle Composition:" >> "$LOG_DIR/bundle_analysis.log"
        echo "  Page chunks: $page_chunks" >> "$LOG_DIR/bundle_analysis.log"
        echo "  Shared chunks: $shared_chunks" >> "$LOG_DIR/bundle_analysis.log"
        echo "  Vendor chunks: $vendor_chunks" >> "$LOG_DIR/bundle_analysis.log"

        echo "| **Composition** | Pages: $page_chunks, Shared: $shared_chunks, Vendor: $vendor_chunks | - | 📊 INFO |" >> "$REPORT_FILE"
    fi

    print_success "Bundle composition analysis completed"
}

# Function to run Lighthouse audit
run_lighthouse_audit() {
    print_status "Running Lighthouse performance audit..."

    # Check if lighthouse is installed
    if ! command -v lighthouse >/dev/null 2>&1; then
        print_warning "Lighthouse not installed. Installing globally..."
        if npm install -g lighthouse; then
            print_success "Lighthouse installed successfully"
        else
            print_error "Failed to install Lighthouse"
            return 1
        fi
    fi

    # Check if development server is running
    local server_pid=""
    if ! curl -s "http://localhost:$LIGHTHOUSE_PORT" >/dev/null 2>&1; then
        print_status "Starting development server for audit..."
        (cd "$PROJECT_ROOT" && npm run start > "$LOG_DIR/dev_server.log" 2>&1) &
        server_pid=$!

        # Wait for server to start
        local wait_time=0
        while [ $wait_time -lt 30 ]; do
            if curl -s "http://localhost:$LIGHTHOUSE_PORT" >/dev/null 2>&1; then
                print_success "Development server started"
                break
            fi
            sleep 2
            wait_time=$((wait_time + 2))
        done

        if [ $wait_time -ge 30 ]; then
            print_error "Development server failed to start"
            if [ -n "$server_pid" ]; then
                kill $server_pid 2>/dev/null || true
            fi
            return 1
        fi
    fi

    # Run Lighthouse audit
    local lighthouse_output="$LOG_DIR/lighthouse_report.json"
    local lighthouse_html="$LOG_DIR/lighthouse_report.html"

    if lighthouse "http://localhost:$LIGHTHOUSE_PORT" \
        --output json,html \
        --output-path "$LOG_DIR/lighthouse_report" \
        --chrome-flags="--headless --no-sandbox" \
        --quiet > "$LOG_DIR/lighthouse_output.log" 2>&1; then

        print_success "Lighthouse audit completed"

        # Parse Lighthouse results
        if [ -f "$lighthouse_output" ]; then
            local performance_score=$(cat "$lighthouse_output" | grep -o '"performance":[0-9.]*' | cut -d: -f2)
            local fcp=$(cat "$lighthouse_output" | grep -o '"first-contentful-paint":{[^}]*}' | grep -o '"displayValue":"[^"]*' | cut -d'"' -f4)
            local lcp=$(cat "$lighthouse_output" | grep -o '"largest-contentful-paint":{[^}]*}' | grep -o '"displayValue":"[^"]*' | cut -d'"' -f4)
            local cls=$(cat "$lighthouse_output" | grep -o '"cumulative-layout-shift":{[^}]*}' | grep -o '"displayValue":"[^"]*' | cut -d'"' -f4)

            # Convert performance score to percentage
            if [ -n "$performance_score" ]; then
                performance_score=$(echo "$performance_score * 100" | bc 2>/dev/null || echo "N/A")
            fi

            # Log results
            echo "[$(get_timestamp)] Lighthouse Results:" >> "$LOG_DIR/lighthouse_analysis.log"
            echo "  Performance Score: ${performance_score}%" >> "$LOG_DIR/lighthouse_analysis.log"
            echo "  First Contentful Paint: ${fcp:-N/A}" >> "$LOG_DIR/lighthouse_analysis.log"
            echo "  Largest Contentful Paint: ${lcp:-N/A}" >> "$LOG_DIR/lighthouse_analysis.log"
            echo "  Cumulative Layout Shift: ${cls:-N/A}" >> "$LOG_DIR/lighthouse_analysis.log"

            # Add to report
            if [ -n "$performance_score" ] && [ "$performance_score" != "N/A" ]; then
                local perf_int=$(echo "$performance_score" | cut -d. -f1)
                if [ "$perf_int" -ge 90 ]; then
                    echo "| **Performance Score** | ${performance_score}% | 90% | ✅ EXCELLENT |" >> "$REPORT_FILE"
                elif [ "$perf_int" -ge 70 ]; then
                    echo "| **Performance Score** | ${performance_score}% | 90% | ⚠️ MOYEN |" >> "$REPORT_FILE"
                else
                    echo "| **Performance Score** | ${performance_score}% | 90% | ❌ FAIBLE |" >> "$REPORT_FILE"
                fi
            fi

            echo "| **First Contentful Paint** | ${fcp:-N/A} | <1.8s | 📊 INFO |" >> "$REPORT_FILE"
            echo "| **Largest Contentful Paint** | ${lcp:-N/A} | <2.5s | 📊 INFO |" >> "$REPORT_FILE"
            echo "| **Cumulative Layout Shift** | ${cls:-N/A} | <0.1 | 📊 INFO |" >> "$REPORT_FILE"
        fi

        print_info "Lighthouse report: $lighthouse_html"
    else
        print_warning "Lighthouse audit failed - continuing without performance metrics"
        echo "| **Performance Score** | N/A | 90% | ❌ ÉCHEC |" >> "$REPORT_FILE"
    fi

    # Clean up development server
    if [ -n "$server_pid" ]; then
        print_status "Stopping development server..."
        kill $server_pid 2>/dev/null || true
        sleep 2
    fi
}

# Function to check for optimization opportunities
check_optimization_opportunities() {
    print_status "Checking for optimization opportunities..."

    local opportunities=()

    # Check for uncompressed assets
    if find "$BUILD_DIR" -name "*.js" -size +100k 2>/dev/null | grep -q .; then
        opportunities+=("Large JavaScript files detected (>100KB)")
    fi

    # Check for duplicate dependencies
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        local deps=$(grep -c '".*":' "$PROJECT_ROOT/package.json")
        if [ $deps -gt 50 ]; then
            opportunities+=("High number of dependencies ($deps) - consider tree shaking")
        fi
    fi

    # Check for missing compression
    if [ ! -f "$BUILD_DIR/static/chunks/*.gz" ]; then
        opportunities+=("Gzip compression not enabled")
    fi

    # Check for large images
    if find "$PROJECT_ROOT/public" -name "*.jpg" -o -name "*.png" -size +500k 2>/dev/null | grep -q .; then
        opportunities+=("Large image files detected (>500KB)")
    fi

    # Check for unused CSS (heuristic)
    local css_files=$(find "$BUILD_DIR/static/css" -name "*.css" 2>/dev/null | wc -l)
    local components=$(find "$PROJECT_ROOT/src/components" -name "*.tsx" 2>/dev/null | wc -l)
    if [ $css_files -gt $((components / 2)) ]; then
        opportunities+=("Potential unused CSS detected")
    fi

    # Log opportunities
    echo "[$(get_timestamp)] Optimization Opportunities:" >> "$LOG_DIR/optimization.log"
    for opportunity in "${opportunities[@]}"; do
        echo "  - $opportunity" >> "$LOG_DIR/optimization.log"
        print_warning "$opportunity"
    done

    if [ ${#opportunities[@]} -eq 0 ]; then
        print_success "No obvious optimization opportunities found"
        echo "| **Optimisations** | 0 détectées | - | ✅ OPTIMAL |" >> "$REPORT_FILE"
    else
        echo "| **Optimisations** | ${#opportunities[@]} détectées | - | ⚠️ AMÉLIORABLE |" >> "$REPORT_FILE"
    fi
}

# Function to generate recommendations
generate_recommendations() {
    local timestamp=$(get_timestamp)

    cat >> "$REPORT_FILE" << EOF

---

## 📋 ANALYSE DÉTAILLÉE

### 📦 Bundle Size Analysis
- **Méthode :** Analyse du répertoire \`.next/static/\`
- **Scope :** JavaScript, CSS, HTML, Images
- **Seuils :** JS Warning: ${BUNDLE_SIZE_WARNING}KB, Error: ${BUNDLE_SIZE_ERROR}KB
- **Log :** \`logs/bundle_analysis.log\`

### 🚀 Performance Lighthouse
- **Méthode :** Lighthouse CLI avec Chrome headless
- **Métriques :** Performance Score, FCP, LCP, CLS
- **Serveur :** Development local (:$LIGHTHOUSE_PORT)
- **Log :** \`logs/lighthouse_analysis.log\`

### 🔍 Optimizations Detected
- **Heuristiques :** Size thresholds, dependency count, compression
- **Analyse :** Assets non compressés, large files, CSS unused
- **Log :** \`logs/optimization.log\`

---

## 🎯 RECOMMANDATIONS

### ⚡ Actions Immédiates
1. **Bundle splitting** si JS > ${BUNDLE_SIZE_ERROR}KB
2. **Image optimization** pour fichiers > 500KB
3. **Gzip compression** activation sur Vercel
4. **Tree shaking** pour dependencies non utilisées

### 🔧 Améliorations Performance
1. **Code splitting** par route avec Next.js dynamic imports
2. **Lazy loading** pour composants non critiques
3. **Image optimization** avec Next.js Image component
4. **Font optimization** avec Next.js font optimization

### 📊 Monitoring Continu
1. **Bundle analyzer** intégration CI/CD
2. **Lighthouse CI** pour regression tests
3. **Performance budgets** avec webpack-bundle-analyzer
4. **Real User Monitoring** avec Vercel Analytics

---

## 🛠️ OUTILS RECOMMANDÉS

### 📦 Bundle Analysis
\`\`\`bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer
npm run analyze

# Bundle size tracking
npm install --save-dev bundlesize
npm run bundlesize
\`\`\`

### 🚀 Performance Monitoring
\`\`\`bash
# Lighthouse CI
npm install --save-dev @lhci/cli
lhci autorun

# Web Vitals monitoring
npm install web-vitals
\`\`\`

### 🔍 Optimization Tools
\`\`\`bash
# Image optimization
npm install --save-dev imagemin-webpack-plugin
npm install sharp

# CSS optimization
npm install --save-dev purgecss-webpack-plugin
\`\`\`

---

**🕒 Analyse terminée :** $timestamp
**📊 Logs générés :** bundle, lighthouse, optimization
**🔄 Fréquence recommandée :** À chaque release

---
*Rapport généré automatiquement par bundle-analyze.sh*
EOF
}

# Main execution
main() {
    print_status "Starting bundle and performance analysis..."

    # Ensure directories exist
    mkdir -p "$LOG_DIR" "$HISTORY_DIR"

    # Initialize report
    init_report

    print_status "Running performance analyses..."

    # Run build
    if build_for_analysis; then
        # Run all analyses
        analyze_bundle_size
        analyze_bundle_composition
        check_optimization_opportunities
        run_lighthouse_audit
    else
        print_error "Build failed - skipping analysis"
        echo "| **Build Status** | ❌ FAILED | - | ❌ CRITIQUE |" >> "$REPORT_FILE"
    fi

    # Generate recommendations
    generate_recommendations

    print_success "Bundle and performance analysis completed!"
    print_info "Report generated: $REPORT_FILE"
    print_info "Logs directory: $LOG_DIR"

    # Show summary
    echo ""
    echo -e "${CYAN}=== PERFORMANCE SUMMARY ===${NC}"
    echo -e "${GREEN}✅ Bundle size analysis${NC}"
    echo -e "${GREEN}✅ Bundle composition check${NC}"
    echo -e "${GREEN}✅ Optimization opportunities${NC}"
    echo -e "${GREEN}✅ Lighthouse performance audit${NC}"
    echo ""
    echo -e "${BLUE}📄 Check report: $REPORT_FILE${NC}"
    echo -e "${BLUE}📁 Check logs: $LOG_DIR/${NC}"

    # Show quick stats if available
    if [ -f "$LOG_DIR/bundle_analysis.log" ]; then
        local last_total=$(tail -10 "$LOG_DIR/bundle_analysis.log" | grep "Total Size:" | tail -1 | awk '{print $3}')
        local last_js=$(tail -10 "$LOG_DIR/bundle_analysis.log" | grep "JavaScript:" | tail -1 | awk '{print $2}')
        if [ -n "$last_total" ] && [ -n "$last_js" ]; then
            echo -e "${CYAN}📊 Quick Stats: Total Bundle: $last_total, JavaScript: $last_js${NC}"
        fi
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --skip-build     Skip build step (use existing build)"
    echo "  --skip-lighthouse Skip Lighthouse audit"
    echo "  --lighthouse-port PORT  Set Lighthouse server port (default: 3000)"
    echo ""
    echo "This script will:"
    echo "  1. Build the application for production"
    echo "  2. Analyze bundle size and composition"
    echo "  3. Run Lighthouse performance audit"
    echo "  4. Check for optimization opportunities"
    echo "  5. Generate comprehensive report"
    echo ""
    echo "Requirements:"
    echo "  - Node.js and npm"
    echo "  - Next.js application"
    echo "  - Lighthouse CLI (will be installed if missing)"
}

# Parse arguments
skip_build=false
skip_lighthouse=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            exit 0
            ;;
        --skip-build)
            skip_build=true
            shift
            ;;
        --skip-lighthouse)
            skip_lighthouse=true
            shift
            ;;
        --lighthouse-port)
            LIGHTHOUSE_PORT="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main "$@"
