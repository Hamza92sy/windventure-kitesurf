#!/bin/sh

# 🛡️ Environment Validation & Security Scan for Windventure
# Validates .env files, scans for secrets, and checks security best practices

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
LOG_DIR="../logs"
HISTORY_DIR="../history"
REPORT_FILE="$HISTORY_DIR/ENV_VALIDATION_REPORT.md"
ENV_TEMPLATE="../.env.template"
ENV_LOCAL="../.env.local"
SECURITY_LOG="$LOG_DIR/security_scan.log"

# Function to print colored output
print_status() {
    echo "${BLUE}[ENV]${NC} $1"
}

print_success() {
    echo "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo "${CYAN}[INFO]${NC} $1"
}

# Function to get current timestamp
get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Initialize report
init_report() {
    local timestamp=$(get_timestamp)

    cat > "$REPORT_FILE" << EOF
# 🛡️ RAPPORT VALIDATION ENV & SÉCURITÉ
**Date :** $timestamp
**Scope :** Validation env vars, scan secrets, vérifications sécurité
**Script :** validate-env.sh

---

## 📊 RÉSUMÉ EXÉCUTIF

| Vérification | Statut | Problèmes | Actions |
|--------------|--------|-----------|---------|
EOF
}

# Function to validate .env.local against template
validate_env_file() {
    print_status "Validating .env.local against template..."

    local missing_vars=0
    local extra_vars=0

    if [ ! -f "$ENV_TEMPLATE" ]; then
        print_error "Template file not found: $ENV_TEMPLATE"
        echo "| **Validation .env** | ❌ ÉCHEC | Template manquant | - |" >> "$REPORT_FILE"
        return 1
    fi

    if [ ! -f "$ENV_LOCAL" ]; then
        print_warning "Local env file not found: $ENV_LOCAL"
        echo "| **Validation .env** | ⚠️ ATTENTION | Fichier .env.local manquant | - |" >> "$REPORT_FILE"
        return 1
    fi

    # Get variables from template and local env
    local template_vars=$(grep -v '^' "$ENV_TEMPLATE" | cut -d= -f1)
    local local_vars=$(grep -v '^' "$ENV_LOCAL" | cut -d= -f1)

    # Check for missing variables
    for var in $template_vars; do
        if ! echo "$local_vars" | grep -q "^$var$"; then
            print_warning "Variable '$var' missing in .env.local"
            missing_vars=$((missing_vars + 1))
        fi
    done

    # Check for extra variables
    for var in $local_vars; do
        if ! echo "$template_vars" | grep -q "^$var$"; then
            print_info "Extra variable '$var' found in .env.local"
            extra_vars=$((extra_vars + 1))
        fi
    done

    if [ $missing_vars -eq 0 ] && [ $extra_vars -eq 0 ]; then
        print_success ".env.local is synchronized with template"
        echo "| **Validation .env** | ✅ OK | 0 | Synchronisé |" >> "$REPORT_FILE"
    else
        echo "| **Validation .env** | ⚠️ ATTENTION | $missing_vars manquantes, $extra_vars en trop | Réviser |" >> "$REPORT_FILE"
    fi
}

# Function to scan for hardcoded secrets
scan_for_secrets() {
    print_status "Scanning for hardcoded secrets..."

    local secrets_found=0
    local files_scanned=0

    # Patterns for common secrets
    local patterns=(
        "SECRET_KEY"
        "API_KEY"
        "PRIVATE_KEY"
        "ACCESS_TOKEN"
        "DATABASE_URL"
        "SUPABASE_SERVICE_ROLE_KEY"
    )

    # Find all relevant files
    find ../app ../components ../lib ../hooks -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read file; do
        if [ -f "$file" ]; then
            files_scanned=$((files_scanned + 1))

            for pattern in "${patterns[@]}"; do
                if grep -q -i "$pattern" "$file"; then
                    # Avoid matching environment variable definitions
                    if ! grep -q "process.env.$pattern" "$file"; then
                        print_error "Potential hardcoded secret '$pattern' in $file"
                        echo "[$(get_timestamp)] Potential secret '$pattern' in $file" >> "$SECURITY_LOG"
                        secrets_found=$((secrets_found + 1))
                    fi
                fi
            done
        fi
    done

    if [ $secrets_found -eq 0 ]; then
        print_success "No hardcoded secrets found"
        echo "| **Scan Secrets** | ✅ OK | 0 | - |" >> "$REPORT_FILE"
    else
        print_error "Found $secrets_found potential hardcoded secrets"
        echo "| **Scan Secrets** | ❌ CRITIQUE | $secrets_found | Vérifier logs |" >> "$REPORT_FILE"
    fi
}

# Function to check security headers
check_security_headers() {
    print_status "Checking for security headers configuration..."

    local headers_found=0
    local next_config="../next.config.mjs"

    if [ ! -f "$next_config" ]; then
        print_warning "next.config.mjs not found"
        return
    fi

    # Check for common security headers
    local headers=(
        "Content-Security-Policy"
        "X-Content-Type-Options"
        "X-Frame-Options"
        "Strict-Transport-Security"
        "X-XSS-Protection"
        "Referrer-Policy"
    )

    for header in "${headers[@]}"; do
        if grep -q "$header" "$next_config"; then
            headers_found=$((headers_found + 1))
        fi
    done

    if [ $headers_found -ge 4 ]; then
        print_success "Security headers seem to be configured"
        echo "| **Headers Sécurité** | ✅ OK | $headers_found/6 | - |" >> "$REPORT_FILE"
    else
        print_warning "Security headers might be missing ($headers_found/6)"
        echo "| **Headers Sécurité** | ⚠️ ATTENTION | $headers_found/6 | Configurer |" >> "$REPORT_FILE"
    fi
}

# Function to check dependencies for vulnerabilities
check_dependencies() {
    print_status "Checking dependencies for vulnerabilities..."

    local vulnerabilities=0

    if ! command -v npm >/dev/null 2>&1; then
        print_warning "npm not found, skipping dependency check"
        return
    fi

    # Run npm audit
    if npm audit --json > "$LOG_DIR/npm_audit.json" 2>/dev/null; then
        vulnerabilities=$(grep -c '"severity":' "$LOG_DIR/npm_audit.json")
    else
        print_error "npm audit failed"
        return
    fi

    if [ $vulnerabilities -eq 0 ]; then
        print_success "No vulnerabilities found in dependencies"
        echo "| **Dépendances** | ✅ OK | 0 | - |" >> "$REPORT_FILE"
    else
        print_error "Found $vulnerabilities vulnerabilities in dependencies"
        echo "| **Dépendances** | ❌ CRITIQUE | $vulnerabilities | npm audit fix |" >> "$REPORT_FILE"
    fi
}

# Function to finalize report
finalize_report() {
    local timestamp=$(get_timestamp)

    cat >> "$REPORT_FILE" << EOF

---

## 📋 DÉTAILS DES VÉRIFICATIONS

### 🔑 Validation .env
- **Méthode :** Comparaison .env.local vs .env.template
- **Objectif :** Synchronisation des variables d'environnement
- **Action :** Ajouter variables manquantes, supprimer extras

### 🤫 Scan Secrets
- **Méthode :** Recherche de patterns de clés (API_KEY, etc.)
- **Scope :** Code source (app, components, lib, hooks)
- **Log :** `logs/security_scan.log`

### 🛡️ Headers Sécurité
- **Fichier :** next.config.mjs
- **Headers :** CSP, X-Content-Type-Options, etc.
- **Objectif :** Protection contre XSS, clickjacking

### 📦 Dépendances
- **Commande :** `npm audit --json`
- **Analyse :** Vulnérabilités connues (CVEs)
- **Log :** `logs/npm_audit.json`

---

## 🎯 RECOMMANDATIONS

### ⚡ Actions Immédiates
1. **Corriger .env.local** si des variables manquent
2. **Supprimer secrets hardcodés** et utiliser variables d'env
3. **Lancer `npm audit fix`** si vulnérabilités détectées

### 🔧 Améliorations Sécurité
1. **Configurer tous les headers** de sécurité recommandés
2. **Utiliser un gestionnaire de secrets** (ex: Doppler, Vault)
3. **Intégrer Snyk ou Dependabot** pour scan continu

### 🚀 Stratégie Long Terme
1. **Politique de sécurité** pour gestion des secrets
2. **Security by design** dans le cycle de développement
3. **Audits de sécurité** réguliers par des tiers

---

**🕒 Scan terminé :** $timestamp
**📊 Logs générés :** security_scan.log, npm_audit.json
**🔄 Fréquence recommandée :** Avant chaque déploiement

---
*Rapport généré automatiquement par validate-env.sh*
EOF
}

# Main execution
main() {
    print_status "Starting environment validation and security scan..."

    # Ensure directories exist
    mkdir -p "$LOG_DIR" "$HISTORY_DIR"

    # Initialize report
    init_report

    print_status "Running security checks..."

    # Run all checks
    validate_env_file
    scan_for_secrets
    check_security_headers
    check_dependencies

    # Finalize report
    finalize_report

    print_success "Environment validation and security scan completed!"
    print_info "Report generated: $REPORT_FILE"
    print_info "Logs directory: $LOG_DIR"

    # Show summary
    echo ""
    echo -e "${CYAN}=== SECURITY SCAN SUMMARY ===${NC}"
    echo -e "${GREEN}✅ .env file validation${NC}"
    echo -e "${GREEN}✅ Hardcoded secrets scan${NC}"
    echo -e "${GREEN}✅ Security headers check${NC}"
    echo -e "${GREEN}✅ Dependency vulnerability scan${NC}"
    echo ""
    echo -e "${BLUE}📄 Check report: $REPORT_FILE${NC}"
    echo -e "${BLUE}📁 Check logs: $LOG_DIR/${NC}"
}

# Run main function
main "$@"
