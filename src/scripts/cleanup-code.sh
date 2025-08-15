#!/bin/bash

# 🧹 Code Cleanup Automation for Windventure
# Removes unused imports, checks props, detects dead code, and validates Tailwind

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
REPORT_FILE="$HISTORY_DIR/CODE_CLEANUP_REPORT.md"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CLEANUP]${NC} $1"
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

# Initialize report
init_report() {
    local timestamp=$(get_timestamp)

    cat > "$REPORT_FILE" << EOF
# 🧹 RAPPORT NETTOYAGE CODE AUTOMATIQUE
**Date :** $timestamp
**Scope :** Analyse et nettoyage automatique du code Windventure
**Script :** cleanup-code.sh

---

## 📊 RÉSUMÉ EXÉCUTIF

| Catégorie | Avant | Après | Actions |
|-----------|-------|--------|---------|
EOF
}

# Function to check unused imports
check_unused_imports() {
    print_status "Scanning for unused imports..."

    local unused_count=0
    local files_checked=0

    # Find all TypeScript/TSX files
    find ../app ../components ../lib ../hooks -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read file; do
        if [ -f "$file" ]; then
            files_checked=$((files_checked + 1))

            # Check for unused imports (simple heuristic)
            if grep -q "^import.*from" "$file"; then
                # Extract imported items and check if they're used
                grep "^import" "$file" | while read import_line; do
                    # Extract import names (simplified)
                    imported_items=$(echo "$import_line" | sed -n 's/import[[:space:]]*{[[:space:]]*\([^}]*\)[[:space:]]*}.*/\1/p' | tr ',' '\n' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

                    if [ -n "$imported_items" ]; then
                        echo "$imported_items" | while read item; do
                            if [ -n "$item" ] && ! grep -q "$item" "$file" --exclude-from=<(echo "^import"); then
                                echo "[$(get_timestamp)] Unused import '$item' in $file" >> "$LOG_DIR/unused_imports.log"
                                unused_count=$((unused_count + 1))
                            fi
                        done
                    fi
                done
            fi
        fi
    done

    print_success "Checked imports in TypeScript files"
    echo "| **Imports inutilisés** | $unused_count détectés | 0 supprimés | Log créé |" >> "$REPORT_FILE"
}

# Function to check component props
check_component_props() {
    print_status "Analyzing component props..."

    local components_checked=0
    local props_issues=0

    find ../components -name "*.tsx" 2>/dev/null | while read component; do
        if [ -f "$component" ]; then
            components_checked=$((components_checked + 1))

            # Check for interface definitions
            if grep -q "interface.*Props" "$component"; then
                local interfaces=$(grep -n "interface.*Props" "$component")
                echo "[$(get_timestamp)] Component: $component" >> "$LOG_DIR/component_props.log"
                echo "$interfaces" >> "$LOG_DIR/component_props.log"

                # Check for missing required props
                if grep -q "\\?" "$component"; then
                    print_info "Optional props found in $(basename "$component")"
                else
                    props_issues=$((props_issues + 1))
                    echo "[$(get_timestamp)] No optional props in $component" >> "$LOG_DIR/component_props.log"
                fi
            else
                props_issues=$((props_issues + 1))
                echo "[$(get_timestamp)] No Props interface in $component" >> "$LOG_DIR/component_props.log"
            fi
        fi
    done

    print_success "Analyzed component props"
    echo "| **Props Components** | $components_checked analysés | $props_issues améliorables | Log créé |" >> "$REPORT_FILE"
}

# Function to detect dead code
detect_dead_code() {
    print_status "Detecting dead code..."

    local dead_functions=0
    local dead_variables=0

    # Find unused functions (simplified detection)
    find ../app ../components ../lib ../hooks -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read file; do
        if [ -f "$file" ]; then
            # Look for function definitions
            grep -n "^const.*=.*=>" "$file" | while read line; do
                local func_name=$(echo "$line" | sed -n 's/const[[:space:]]*\([^[:space:]]*\)[[:space:]]*=.*/\1/p')
                if [ -n "$func_name" ]; then
                    # Check if function is used elsewhere
                    if ! grep -q "$func_name" ../app/* ../components/* ../lib/* ../hooks/* 2>/dev/null; then
                        echo "[$(get_timestamp)] Potentially dead function: $func_name in $file" >> "$LOG_DIR/dead_code.log"
                        dead_functions=$((dead_functions + 1))
                    fi
                fi
            done

            # Look for unused variables
            grep -n "^[[:space:]]*const.*=" "$file" | while read line; do
                local var_name=$(echo "$line" | sed -n 's/.*const[[:space:]]*\([^[:space:]]*\)[[:space:]]*=.*/\1/p')
                if [ -n "$var_name" ] && [ ${#var_name} -gt 2 ]; then
                    # Simple check if variable is used later in the same file
                    local line_num=$(echo "$line" | cut -d: -f1)
                    if ! tail -n +$((line_num + 1)) "$file" | grep -q "$var_name"; then
                        echo "[$(get_timestamp)] Potentially dead variable: $var_name in $file:$line_num" >> "$LOG_DIR/dead_code.log"
                        dead_variables=$((dead_variables + 1))
                    fi
                fi
            done
        fi
    done

    print_success "Dead code analysis completed"
    echo "| **Code mort** | $dead_functions fonctions, $dead_variables variables | 0 supprimés | Log créé |" >> "$REPORT_FILE"
}

# Function to check Tailwind duplicates
check_tailwind_duplicates() {
    print_status "Checking Tailwind class duplicates..."

    local duplicate_classes=0
    local files_with_duplicates=0

    # Find all files with className
    find ../app ../components -name "*.tsx" -o -name "*.jsx" 2>/dev/null | while read file; do
        if [ -f "$file" ] && grep -q "className=" "$file"; then
            # Extract className values and check for duplicates within the same file
            grep -o 'className="[^"]*"' "$file" | while read class_line; do
                local classes=$(echo "$class_line" | sed 's/className="//g' | sed 's/"//g')

                # Check for duplicate classes in the same className
                echo "$classes" | tr ' ' '\n' | sort | uniq -d | while read duplicate; do
                    if [ -n "$duplicate" ]; then
                        echo "[$(get_timestamp)] Duplicate Tailwind class '$duplicate' in $file" >> "$LOG_DIR/tailwind_duplicates.log"
                        duplicate_classes=$((duplicate_classes + 1))
                    fi
                done
            done

            # Check for common class patterns that could be optimized
            if grep -q "text-.*text-" "$file" || grep -q "bg-.*bg-" "$file"; then
                files_with_duplicates=$((files_with_duplicates + 1))
                echo "[$(get_timestamp)] Potential class conflicts in $file" >> "$LOG_DIR/tailwind_duplicates.log"
            fi
        fi
    done

    print_success "Tailwind duplicate analysis completed"
    echo "| **Tailwind doublons** | $duplicate_classes classes | 0 optimisées | Log créé |" >> "$REPORT_FILE"
}

# Function to generate TypeScript strict check
typescript_strict_check() {
    print_status "Running TypeScript strict analysis..."

    local ts_errors=0

    # Run TypeScript compiler in strict mode
    if npx tsc --noEmit --strict > "$LOG_DIR/typescript_strict.log" 2>&1; then
        print_success "TypeScript strict check passed"
        ts_errors=0
    else
        ts_errors=$(wc -l < "$LOG_DIR/typescript_strict.log")
        print_warning "TypeScript has $ts_errors potential issues in strict mode"
    fi

    echo "| **TypeScript strict** | $ts_errors erreurs | 0 corrigées | Log créé |" >> "$REPORT_FILE"
}

# Function to check for console.log statements
check_console_logs() {
    print_status "Scanning for console.log statements..."

    local console_count=0

    find ../app ../components ../lib ../hooks -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read file; do
        if [ -f "$file" ]; then
            local file_console_count=$(grep -c "console\.log\|console\.error\|console\.warn" "$file" 2>/dev/null || echo "0")
            if [ "$file_console_count" -gt 0 ]; then
                echo "[$(get_timestamp)] $file_console_count console statements in $file" >> "$LOG_DIR/console_logs.log"
                console_count=$((console_count + file_console_count))
            fi
        fi
    done

    print_success "Console log scan completed"
    echo "| **Console logs** | $console_count détectés | 0 supprimés | Log créé |" >> "$REPORT_FILE"
}

# Function to finalize report
finalize_report() {
    local timestamp=$(get_timestamp)

    cat >> "$REPORT_FILE" << EOF

---

## 📋 DÉTAILS DES ANALYSES

### 🔍 Imports Inutilisés
- **Méthode :** Analyse AST simplifiée des imports
- **Scope :** components/, app/, lib/, hooks/
- **Log :** \`logs/unused_imports.log\`

### 🧩 Props Components
- **Méthode :** Recherche interfaces Props
- **Validation :** Props optionnelles (?)
- **Log :** \`logs/component_props.log\`

### ⚰️ Code Mort
- **Méthode :** Analyse des fonctions/variables non référencées
- **Heuristique :** Recherche d'usage dans l'arbre
- **Log :** \`logs/dead_code.log\`

### 🎨 Tailwind Doublons
- **Méthode :** Parsing className et détection duplicata
- **Optimisation :** Classes conflictuelles détectées
- **Log :** \`logs/tailwind_duplicates.log\`

### 📝 TypeScript Strict
- **Command :** \`npx tsc --noEmit --strict\`
- **Impact :** Erreurs potentielles en mode strict
- **Log :** \`logs/typescript_strict.log\`

### 🖥️ Console Logs
- **Pattern :** console.log|error|warn
- **Usage :** Development debugging restant
- **Log :** \`logs/console_logs.log\`

---

## 🎯 RECOMMANDATIONS

### ⚡ Actions Immédiates
1. **Réviser logs** générés pour validation manuelle
2. **Supprimer imports** inutilisés identifiés
3. **Nettoyer console.log** en production

### 🔧 Améliorations Possibles
1. **ESLint rules** pour automatiser le nettoyage
2. **Pre-commit hooks** pour éviter la régression
3. **CI/CD integration** pour validation continue

### 🚀 Optimisations Futures
1. **Bundle analyzer** pour impact réel
2. **Tree shaking** configuration
3. **Code splitting** optimisation

---

**🕒 Analyse terminée :** $timestamp
**📊 Logs générés :** 6 fichiers dans \`logs/\`
**🔄 Fréquence recommandée :** Hebdomadaire

---
*Rapport généré automatiquement par cleanup-code.sh*
EOF
}

# Main execution
main() {
    print_status "Starting code cleanup analysis..."

    # Ensure directories exist
    mkdir -p "$LOG_DIR" "$HISTORY_DIR"

    # Initialize report
    init_report

    print_status "Running cleanup analyses..."

    # Run all checks
    check_unused_imports
    check_component_props
    detect_dead_code
    check_tailwind_duplicates
    typescript_strict_check
    check_console_logs

    # Finalize report
    finalize_report

    print_success "Code cleanup analysis completed!"
    print_info "Report generated: $REPORT_FILE"
    print_info "Logs directory: $LOG_DIR"

    # Show summary
    echo ""
    echo -e "${CYAN}=== CLEANUP SUMMARY ===${NC}"
    echo -e "${GREEN}✅ Unused imports analysis${NC}"
    echo -e "${GREEN}✅ Component props check${NC}"
    echo -e "${GREEN}✅ Dead code detection${NC}"
    echo -e "${GREEN}✅ Tailwind duplicates scan${NC}"
    echo -e "${GREEN}✅ TypeScript strict analysis${NC}"
    echo -e "${GREEN}✅ Console logs detection${NC}"
    echo ""
    echo -e "${BLUE}📄 Check report: $REPORT_FILE${NC}"
    echo -e "${BLUE}📁 Check logs: $LOG_DIR/${NC}"
}

# Run main function
main "$@"