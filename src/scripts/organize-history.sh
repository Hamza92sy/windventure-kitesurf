#!/bin/bash

# Windventure: Organize History Script
# Déplace les rapports terminés, crée archive/, génère HISTORY_INDEX.md

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Chemins
HISTORY_DIR="src/history"
ARCHIVE_DIR="$HISTORY_DIR/archive"
INDEX_FILE="$HISTORY_DIR/HISTORY_INDEX.md"
SRC_DIR="src"

echo -e "${BLUE}🎯 Windventure: Organize History${NC}"
echo -e "${CYAN}================================${NC}"

# 1. Créer le dossier archive s'il n'existe pas
if [ ! -d "$ARCHIVE_DIR" ]; then
    echo -e "${YELLOW}📁 Création du dossier archive...${NC}"
    mkdir -p "$ARCHIVE_DIR"
    echo -e "${GREEN}✅ Dossier archive créé: $ARCHIVE_DIR${NC}"
else
    echo -e "${GREEN}✅ Dossier archive existe déjà${NC}"
fi

# 2. Déplacer les fichiers terminés
echo -e "${YELLOW}📦 Déplacement des rapports terminés...${NC}"

# Patterns pour les fichiers terminés
TERMINATED_PATTERNS=(
    "*FIX*.md"
    "*REPORT*.md"
    "*SUCCESS*.md"
    "*COMPLETE*.md"
    "*FINAL*.md"
    "*ACCOMPLISHED*.md"
    "*VALIDATION*.md"
    "*AUDIT*.md"
    "*ANALYSIS*.md"
    "*DIAGNOSTIC*.md"
    "*SOLUTION*.md"
    "*DEPLOY*.md"
    "*BACKUP*.md"
    "*TRANSFORMATION*.md"
    "*IMPLEMENTATION*.md"
    "*CORRECTION*.md"
    "*MONITORING*.md"
    "*PREPARATION*.md"
    "*COMPARATIVE*.md"
    "*GALLERY*.md"
    "*MATRIX*.md"
    "*TYPOGRAPHY*.md"
    "*COMPONENTS*.md"
    "*DEPENDENCIES*.md"
    "*ENV_INJECTION*.md"
    "*FORM_REDESIGN*.md"
    "*PACKAGE_PAGE*.md"
    "*BOOKING_*.md"
    "*HYDRATATION*.md"
    "*PHASE_*.md"
    "*MISSION_*.md"
    "*WINDVENTURE_*.md"
    "*CURSOR_*.md"
    "*CLAUDE_*.md"
    "*FIGMA_*.md"
    "*TAILWIND_*.md"
    "*PRODUCTION_*.md"
    "*REDEPLOY_*.md"
    "*FORCE_DEPLOY*.md"
    "*VERCEL_*.md"
    "*SUPABASE_*.md"
    "*STRIPE_*.md"
    "*N8N_*.md"
    "*OPENAI_*.md"
    "*GEMINI_*.md"
    "*CHATGPT_*.md"
)

# Patterns pour les fichiers actifs (à ignorer)
ACTIVE_PATTERNS=(
    "*TODO*.md"
    "*prompt*.md"
    "*ACTIVE_*.md"
    "*IN_PROGRESS*.md"
    "*DRAFT*.md"
    "*WORKING*.md"
    "*TEST*.md"
    "*DEBUG*.md"
    "*TEMP*.md"
    "*BACKUP_*.md"
)

moved_count=0
ignored_count=0

# Fonction pour vérifier si un fichier est actif
is_active_file() {
    local file="$1"
    local filename=$(basename "$file")

    for pattern in "${ACTIVE_PATTERNS[@]}"; do
        if [[ "$filename" == $pattern ]]; then
            return 0 # Fichier actif
        fi
    done
    return 1 # Fichier terminé
}

# Chercher et déplacer les fichiers terminés dans src/
for pattern in "${TERMINATED_PATTERNS[@]}"; do
    while IFS= read -r -d '' file; do
        if [ -f "$file" ] && ! is_active_file "$file"; then
            filename=$(basename "$file")
            target="$ARCHIVE_DIR/$filename"

            if [ ! -f "$target" ]; then
                mv "$file" "$target"
                echo -e "${GREEN}  ✅ Déplacé: $filename${NC}"
                ((moved_count++))
            else
                echo -e "${YELLOW}  ⚠️  Existe déjà: $filename${NC}"
                ((ignored_count++))
            fi
        fi
    done < <(find "$SRC_DIR" -name "$pattern" -type f -print0 2>/dev/null || true)
done

echo -e "${GREEN}✅ Déplacement terminé: $moved_count fichiers déplacés, $ignored_count ignorés${NC}"

# 3. Générer l'index de l'historique
echo -e "${YELLOW}📄 Génération de HISTORY_INDEX.md...${NC}"

# Créer le contenu de l'index
cat > "$INDEX_FILE" << EOF
# 📚 Windventure - Index de l'Historique

> Index automatiquement généré des rapports et analyses Windventure

**Dernière mise à jour:** $(date '+%d/%m/%Y à %H:%M')

---

## 🎯 Rapports par Outil

EOF

# Fonction pour détecter l'outil utilisé
detect_tool() {
    local file="$1"
    local content=$(head -20 "$file" 2>/dev/null || echo "")

    if echo "$content" | grep -qi "claude"; then
        echo "Claude"
    elif echo "$content" | grep -qi "cursor"; then
        echo "Cursor"
    elif echo "$content" | grep -qi "gemini"; then
        echo "Gemini"
    elif echo "$content" | grep -qi "chatgpt\|gpt"; then
        echo "ChatGPT"
    else
        echo "Autre"
    fi
}

# Organiser les fichiers par outil (compatible bash ancien)
claude_files=""
cursor_files=""
gemini_files=""
chatgpt_files=""
autre_files=""

# Lire les fichiers dans archive
if [ -d "$ARCHIVE_DIR" ]; then
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            tool=$(detect_tool "$file")

            case "$tool" in
                "Claude")
                    claude_files="$claude_files$filename"$'\n'
                    ;;
                "Cursor")
                    cursor_files="$cursor_files$filename"$'\n'
                    ;;
                "Gemini")
                    gemini_files="$gemini_files$filename"$'\n'
                    ;;
                "ChatGPT")
                    chatgpt_files="$chatgpt_files$filename"$'\n'
                    ;;
                *)
                    autre_files="$autre_files$filename"$'\n'
                    ;;
            esac
        fi
    done < <(find "$ARCHIVE_DIR" -name "*.md" -type f -print0 2>/dev/null || true)
fi

# Fonction pour ajouter les fichiers d'un outil
add_tool_files() {
    local tool_name="$1"
    local files="$2"

    if [ -n "$files" ]; then
        echo "" >> "$INDEX_FILE"
        echo "### $tool_name" >> "$INDEX_FILE"
        echo "" >> "$INDEX_FILE"

        # Trier les fichiers
        sorted_files=$(echo "$files" | sort)
        while IFS= read -r file; do
            if [ -n "$file" ]; then
                # Extraire la date si disponible
                date_info=""
                if [[ "$file" =~ ([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
                    date_info=" (${BASH_REMATCH[1]})"
                fi

                # Créer le lien
                echo "- [${file%.md}](archive/$file)$date_info" >> "$INDEX_FILE"
            fi
        done <<< "$sorted_files"
    fi
}

# Ajouter les fichiers par outil
add_tool_files "🤖 Claude" "$claude_files"
add_tool_files "🎯 Cursor" "$cursor_files"
add_tool_files "🌟 Gemini" "$gemini_files"
add_tool_files "💬 ChatGPT" "$chatgpt_files"
add_tool_files "🔧 Autre" "$autre_files"

# Ajouter la section des statistiques
cat >> "$INDEX_FILE" << EOF

---

## 📊 Statistiques

- **Total des rapports archivés:** $(find "$ARCHIVE_DIR" -name "*.md" -type f | wc -l | tr -d ' ')
- **Dernière organisation:** $(date '+%d/%m/%Y à %H:%M')
- **Script:** \`src/scripts/organize-history.sh\`

---

## 🚀 Utilisation

1. **Raccourci clavier:** \`Cmd+Shift+H\` (macOS) / \`Ctrl+Shift+H\` (Windows/Linux)
2. **Commande manuelle:** \`bash src/scripts/organize-history.sh\`
3. **VS Code:** Tâche "Windventure: Organize History"

---

## 📝 Notes

- Les fichiers actifs (TODO, ACTIVE_, IN_PROGRESS) ne sont pas déplacés
- L'index est régénéré à chaque exécution
- Les doublons sont détectés automatiquement
EOF

echo -e "${GREEN}✅ HISTORY_INDEX.md généré${NC}"

# 4. Afficher le résumé
echo -e "${CYAN}================================${NC}"
echo -e "${GREEN}🎉 Organisation terminée !${NC}"
echo -e "${BLUE}📁 Archive: $ARCHIVE_DIR${NC}"
echo -e "${BLUE}📄 Index: $INDEX_FILE${NC}"
echo -e "${BLUE}📊 Rapports archivés: $(find "$ARCHIVE_DIR" -name "*.md" -type f | wc -l | tr -d ' ')${NC}"
echo -e "${CYAN}================================${NC}"