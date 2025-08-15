#!/bin/bash

# generate-component-docs.sh
# Scans TypeScript components and generates Markdown documentation.

# --- Configuration ---
COMPONENTS_DIR="src/components"
OUTPUT_DIR="docs/components"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
LOG_FILE="logs/docs-generator-$TIMESTAMP.log"

# --- ANSI Color Codes ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Helper Functions ---

# Log messages with timestamp
log() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
}

# Clean up and create directories
setup_environment() {
    mkdir -p "$OUTPUT_DIR" || { echo -e "${RED}Failed to create output directory.${NC}"; exit 1; }
    mkdir -p "logs" || { echo -e "${RED}Failed to create logs directory.${NC}"; exit 1; }
    log "INFO: Environment setup complete. Outputting to $OUTPUT_DIR."
}

# --- Main Execution ---
main() {
    echo -e "${GREEN}🚀 Starting Component Documentation Generator...${NC}"
    setup_environment

    for component_path in "$COMPONENTS_DIR"/*.tsx; do
        if [ -f "$component_path" ]; then
            component_name=$(basename "$component_path" .tsx)
            output_file="$OUTPUT_DIR/$component_name.md"

            echo -e "${GREEN}➤ Generating docs for ${YELLOW}$component_name...${NC}"

            # --- Documentation Content ---
            {
                printf -- "---\n"
                printf "title: %s\n" "$component_name"
                printf "description: Technical documentation for the %s component.\n" "$component_name"
                printf "generated_at: %s\n" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
                printf -- "---\n\n"
                printf "# Component: `%s`\n\n" "$component_name"
                printf "**Source:** `%s`\n\n" "$component_path"

                printf "## Props\n"
                if grep -q 'interface.*Props' "$component_path"; then
                    grep -o 'interface.*Props\s*{[^}]*}' "$component_path" | sed -e 's/interface.*Props\s*{/```typescript\ninterface Props {\n/' -e 's/}/\n}\n```/'
                else
                    printf "No 'Props' interface found.\n"
                fi
                printf "\n"

                printf "## Hooks Used\n"
                if grep -q 'use[A-Z]' "$component_path"; then
                    grep -o 'use[A-Z][a-zA-Z]*' "$component_path" | sort -u | sed 's/^/* `/' | sed 's/$/`/'
                else
                    printf "No hooks detected.\n"
                fi
                printf "\n"

                printf "## Example Usage\n"
                printf '```typescriptx\n'
                printf "import { %s } from '@/components/%s';\n\n" "$component_name" "$component_name"
                printf "<%s />\n" "$component_name"
                printf '```\n'
            } > "$output_file"

            log "SUCCESS: Generated docs for $component_name at $output_file"
            echo -e "${GREEN}✔ Successfully generated documentation at:${NC} $output_file"
        fi
    done

    echo -e "\n${GREEN}✅ All components documented successfully!${NC}"
    echo -e "Detailed logs available at: ${YELLOW}$LOG_FILE${NC}"
}

# --- Run ---
main
