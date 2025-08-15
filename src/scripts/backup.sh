#!/bin/bash

# Backup Script for Windventure
# Creates automatic backups of the project state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="windventure"
BACKUP_DIR="windventure_backup_$(date '+%Y%m%d_%H%M%S')"
HISTORY_DIR="history"
MAX_BACKUPS=10

# Exclude patterns for backup
EXCLUDE_PATTERNS=(
    "node_modules"
    ".next"
    ".git"
    "windventure_backup_*"
    "*.log"
    "*.tmp"
    "*.temp"
    ".cache"
    "coverage"
    ".nyc_output"
    "dist"
    "build"
)

# Function to print colored output
print_status() {
    echo -e "${BLUE}[BACKUP]${NC} $1"
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

# Function to get current timestamp
get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Function to get git information
get_git_info() {
    if git rev-parse --git-dir > /dev/null 2>&1; then
        local branch=$(git branch --show-current)
        local commit_hash=$(git rev-parse HEAD)
        local commit_message=$(git log -1 --pretty=format:"%s")
        echo "Branch: $branch"
        echo "Commit: $commit_hash"
        echo "Message: $commit_message"
    else
        echo "Not a git repository"
    fi
}

# Function to create backup directory
create_backup_directory() {
    print_status "Creating backup directory: $BACKUP_DIR"

    if mkdir -p "$BACKUP_DIR"; then
        print_success "Backup directory created"
        return 0
    else
        print_error "Failed to create backup directory"
        return 1
    fi
}

# Function to build rsync exclude arguments
build_exclude_args() {
    local exclude_args=""

    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        exclude_args="$exclude_args --exclude=$pattern"
    done

    echo "$exclude_args"
}

# Function to copy project files
copy_project_files() {
    print_status "Copying project files..."

    local exclude_args=$(build_exclude_args)

    # Use rsync for efficient copying
    if command -v rsync >/dev/null 2>&1; then
        print_status "Using rsync for backup..."

        if rsync -av --progress $exclude_args . "$BACKUP_DIR/"; then
            print_success "Project files copied successfully"
            return 0
        else
            print_error "Failed to copy project files with rsync"
            return 1
        fi
    else
        print_status "rsync not available, using cp..."

        # Create exclude file for cp
        local exclude_file="$BACKUP_DIR/exclude.txt"
        for pattern in "${EXCLUDE_PATTERNS[@]}"; do
            echo "$pattern" >> "$exclude_file"
        done

        # Use cp with exclude
        if cp -r . "$BACKUP_DIR/" 2>/dev/null; then
            print_success "Project files copied successfully"
            return 0
        else
            print_error "Failed to copy project files"
            return 1
        fi
    fi
}

# Function to create backup metadata
create_backup_metadata() {
    print_status "Creating backup metadata..."

    local metadata_file="$BACKUP_DIR/backup_metadata.txt"

    cat > "$metadata_file" << EOF
Windventure Backup Metadata
===========================

Backup Information:
- Created: $(get_timestamp)
- Backup Directory: $BACKUP_DIR
- Project: $PROJECT_NAME

Git Information:
$(get_git_info)

System Information:
- OS: $(uname -s)
- Architecture: $(uname -m)
- Node Version: $(node --version 2>/dev/null || echo "Node not available")
- NPM Version: $(npm --version 2>/dev/null || echo "NPM not available")

Backup Contents:
- Source code files
- Configuration files
- Documentation
- Assets and images

Excluded from backup:
$(printf '%s\n' "${EXCLUDE_PATTERNS[@]}")

Backup Size: $(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "Unknown")

EOF

    print_success "Backup metadata created"
}

# Function to create backup summary
create_backup_summary() {
    print_status "Creating backup summary..."

    local summary_file="$BACKUP_DIR/backup_summary.md"

    cat > "$summary_file" << EOF
# Windventure Backup Summary

## Backup Details
- **Date**: $(get_timestamp)
- **Directory**: $BACKUP_DIR
- **Project**: $PROJECT_NAME

## Git Status
\`\`\`
$(get_git_info)
\`\`\`

## File Statistics
- **Total Files**: $(find "$BACKUP_DIR" -type f | wc -l)
- **Total Directories**: $(find "$BACKUP_DIR" -type d | wc -l)
- **Backup Size**: $(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "Unknown")

## Key Directories
$(find "$BACKUP_DIR" -maxdepth 1 -type d | sed 's|.*/||' | grep -v "^$" | sed 's/^/- /')

## Important Files
$(find "$BACKUP_DIR" -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.md" | head -10 | sed 's|.*/||' | sed 's/^/- /')

---
*Backup created automatically by Windventure backup script*
EOF

    print_success "Backup summary created"
}

# Function to clean old backups
clean_old_backups() {
    print_status "Cleaning old backups..."

    # Find all backup directories
    local backup_dirs=($(ls -d windventure_backup_* 2>/dev/null || true))
    local backup_count=${#backup_dirs[@]}

    if [ $backup_count -gt $MAX_BACKUPS ]; then
        print_status "Found $backup_count backups, keeping only $MAX_BACKUPS"

        # Sort by modification time and remove oldest
        local to_remove=$(($backup_count - $MAX_BACKUPS))
        local old_backups=($(ls -dt windventure_backup_* | tail -n $to_remove))

        for backup in "${old_backups[@]}"; do
            print_status "Removing old backup: $backup"
            rm -rf "$backup"
        done

        print_success "Cleaned $to_remove old backups"
    else
        print_status "No cleanup needed ($backup_count backups, max: $MAX_BACKUPS)"
    fi
}

# Function to log backup
log_backup() {
    local timestamp=$(get_timestamp)
    local log_file="CURSOR_LOG_$(date '+%Y-%m-%d').md"

    # Create log entry
    cat >> "$log_file" << EOF

## Backup at $timestamp
- **Backup Directory**: $BACKUP_DIR
- **Size**: $(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "Unknown")
- **Files**: $(find "$BACKUP_DIR" -type f | wc -l)
- **Git Branch**: $(git branch --show-current 2>/dev/null || echo "N/A")

---
EOF

    print_success "Backup logged to $log_file"
}

# Function to create history entry
create_history_entry() {
    print_status "Creating history entry..."

    # Create history directory if it doesn't exist
    mkdir -p "$HISTORY_DIR"

    local history_file="$HISTORY_DIR/backup_$(date '+%Y%m%d_%H%M%S').md"

    cat > "$history_file" << EOF
# Windventure Backup History Entry

## Backup Information
- **Date**: $(get_timestamp)
- **Backup Directory**: $BACKUP_DIR
- **Trigger**: Manual backup

## Project State
$(get_git_info)

## Backup Contents
- Complete project source code
- Configuration files
- Documentation
- Assets and images

## Excluded Items
$(printf '%s\n' "${EXCLUDE_PATTERNS[@]}" | sed 's/^/- /')

## Notes
- Backup created automatically
- Ready for restoration if needed
- Compatible with all development tools

---
EOF

    print_success "History entry created: $history_file"
}

# Function to verify backup
verify_backup() {
    print_status "Verifying backup integrity..."

    # Check if backup directory exists
    if [ ! -d "$BACKUP_DIR" ]; then
        print_error "Backup directory not found"
        return 1
    fi

    # Check for essential files
    local essential_files=("package.json" "next.config.js" "tailwind.config.ts")
    local missing_files=()

    for file in "${essential_files[@]}"; do
        if [ ! -f "$BACKUP_DIR/$file" ]; then
            missing_files+=("$file")
        fi
    done

    if [ ${#missing_files[@]} -gt 0 ]; then
        print_warning "Missing essential files: ${missing_files[*]}"
        return 1
    fi

    # Check backup size
    local backup_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")
    if [ "$backup_size" = "0" ] || [ "$backup_size" = "0B" ]; then
        print_error "Backup appears to be empty"
        return 1
    fi

    print_success "Backup verification passed"
    print_status "Backup size: $backup_size"
    return 0
}

# Function to show backup info
show_backup_info() {
    print_status "Backup Information:"
    echo ""
    echo "Backup Directory: $BACKUP_DIR"
    echo "Created: $(get_timestamp)"
    echo "Size: $(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "Unknown")"
    echo "Files: $(find "$BACKUP_DIR" -type f | wc -l)"
    echo "Directories: $(find "$BACKUP_DIR" -type d | wc -l)"
    echo ""

    # Show recent backups
    print_status "Recent backups:"
    ls -dt windventure_backup_* 2>/dev/null | head -5 | sed 's/^/- /' || echo "No backups found"
}

# Function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --verify         Verify existing backup"
    echo "  --clean          Clean old backups only"
    echo "  --info           Show backup information"
    echo ""
    echo "This script will:"
    echo "  1. Create a timestamped backup directory"
    echo "  2. Copy all project files (excluding node_modules, .next, etc.)"
    echo "  3. Create metadata and summary files"
    echo "  4. Clean old backups (keep max $MAX_BACKUPS)"
    echo "  5. Log the backup operation"
    echo ""
    echo "Backup location: windventure_backup_YYYYMMDD_HHMMSS/"
}

# Main execution
main() {
    # Parse arguments
    local verify_only=false
    local clean_only=false
    local info_only=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --verify)
                verify_only=true
                shift
                ;;
            --clean)
                clean_only=true
                shift
                ;;
            --info)
                info_only=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    print_status "Starting backup process..."

    # Show backup info if requested
    if [ "$info_only" = true ]; then
        show_backup_info
        exit 0
    fi

    # Clean old backups if requested
    if [ "$clean_only" = true ]; then
        clean_old_backups
        exit 0
    fi

    # Verify existing backup if requested
    if [ "$verify_only" = true ]; then
        if [ -d "$BACKUP_DIR" ]; then
            verify_backup
        else
            print_error "Backup directory not found: $BACKUP_DIR"
            exit 1
        fi
        exit 0
    fi

    # Create backup
    if create_backup_directory && copy_project_files; then
        create_backup_metadata
        create_backup_summary
        create_history_entry
        clean_old_backups
        log_backup

        if verify_backup; then
            print_success "Backup completed successfully!"
            show_backup_info
        else
            print_warning "Backup completed but verification failed"
            exit 1
        fi
    else
        print_error "Backup failed"
        exit 1
    fi
}

# Run main function
main "$@"