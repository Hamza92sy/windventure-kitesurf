#!/bin/bash

# track-component-usage.sh
# Analyzes the codebase to track component usage frequency and identify dead components.

# --- Configuration ---
SEARCH_DIR="src"
COMPONENTS_DIR="src/components"
OUTPUT_FILE="logs/component-usage.log"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# --- ANSI Color Codes ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Setup ---
setup() {
    mkdir -p "$(dirname "$OUTPUT_FILE")"
    # Clear previous log file
    > "$OUTPUT_FILE"
}

# --- Header for the Log File ---
write_header() {
    echo "--- Component Usage Report ---" >> "$OUTPUT_FILE"
    echo "Generated at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUTPUT_FILE"
    echo "------------------------------------" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# --- Main Logic ---

# Get a clean list of all component names
get_all_components() {
    ls -1 "$COMPONENTS_DIR" | grep -E '\.tsx$' | sed 's/\.tsx//'
}

# Track usage and find dead components
track_usage() {
    echo -e "${GREEN}🔍 Analyzing component usage across the project...${NC}"
    local all_components=$(get_all_components)
    local used_components=()
    local dead_components=()

    # --- Usage Frequency ---
    echo "[Component Usage Frequency]" >> "$OUTPUT_FILE"
    for component in $all_components; do
        # Search for component usage (e.g., `<Component`, `import { Component }`)
        count=$(grep -r -o "<$component" "$SEARCH_DIR" | wc -l | tr -d ' ')
        echo "- $component: $count usages" >> "$OUTPUT_FILE"

        if [ "$count" -gt 0 ]; then
            used_components+=("$component")
        else
            dead_components+=("$component")
        fi
    done
    echo "" >> "$OUTPUT_FILE"

    # --- Dead Components ---
    echo "[Dead Components (Never Used)]" >> "$OUTPUT_FILE"
    if [ ${#dead_components[@]} -eq 0 ]; then
        echo "✔ No dead components found." >> "$OUTPUT_FILE"
        echo -e "${GREEN}✔ No dead components found!${NC}"
    else
        for component in "${dead_components[@]}"; do
            echo "- $component" >> "$OUTPUT_FILE"
            echo -e "${RED}❌ Dead component found: ${YELLOW}$component${NC}"
        done
    fi
}

# --- Execution ---
main() {
    echo -e "${GREEN}🚀 Starting Component Usage Tracker...${NC}"
    setup
    write_header
    track_usage
    echo -e "\n${GREEN}✅ Analysis complete. Report generated at: ${YELLOW}$OUTPUT_FILE${NC}"
}

# --- Run ---
main
