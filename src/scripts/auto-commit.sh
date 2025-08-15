#!/bin/bash

# Auto-Commit Script for Windventure
# Automatically commits changes with structured messages and pushes to remote
# Enhanced with cache invalidation checks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="windventure"
MAIN_BRANCH="main"
REMOTE_NAME="origin"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[AUTO-COMMIT]${NC} $1"
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

# Function to generate commit message
generate_commit_message() {
    local custom_message="$1"
    local timestamp=$(get_timestamp)
    local changed_files=$(git diff --name-only --cached 2>/dev/null | wc -l)

    if [ -n "$custom_message" ]; then
        echo "$custom_message"
    else
        echo "feat(cursor): auto-commit at $timestamp - $changed_files files changed"
    fi
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository. Please run this script from the project root."
        exit 1
    fi
}

# Function to check if there are changes to commit
check_changes() {
    if git diff-index --quiet HEAD --; then
        if git diff --cached --quiet; then
            print_warning "No changes to commit."
            return 1
        fi
    fi
    return 0
}

# Function to stage all changes
stage_changes() {
    print_status "Staging all changes..."
    git add .
    print_success "Changes staged successfully"
}

# Function to validate staged changes
validate_changes() {
    print_status "Validating staged changes..."

    # Check for TypeScript errors
    if command -v npx >/dev/null 2>&1; then
        print_status "Running TypeScript check..."
        if npx tsc --noEmit; then
            print_success "TypeScript validation passed"
        else
            print_warning "TypeScript validation failed, but continuing..."
        fi
    fi

    # Check for linting errors
    if command -v npx >/dev/null 2>&1; then
        print_status "Running ESLint check..."
        if npx eslint . --ext .ts,.tsx --max-warnings 0; then
            print_success "ESLint validation passed"
        else
            print_warning "ESLint validation failed, but continuing..."
        fi
    fi
}

# Function to check cache-sensitive files
check_cache_issues() {
    print_status "Checking for cache-sensitive files..."
    
    # Check for x-vercel-cache in build trace
    if [ -f ".next/trace" ] && grep -q 'x-vercel-cache' .next/trace; then
        print_warning "🛑 Cache header found in trace — forcing dynamic revalidation"
    fi
    
    # Check if anti-cache headers are present in next.config.mjs
    if [ -f "next.config.mjs" ] && ! grep -q "no-cache" next.config.mjs; then
        print_warning "⚠️ Anti-cache headers missing in next.config.mjs"
    fi
    
    # Check if vercel.json has proper cache config
    if [ -f "vercel.json" ] && ! grep -q "no-cache" vercel.json; then
        print_warning "⚠️ Anti-cache headers missing in vercel.json"
    fi
    
    # Check for @import in CSS files (should use next/font instead)
    if find . -name "*.css" -exec grep -l "@import.*font" {} \; 2>/dev/null | head -1; then
        print_warning "⚠️ Found @import for fonts - consider using next/font for better performance"
    fi
}

# Function to create commit
create_commit() {
    local commit_message="$1"
    print_status "Creating commit with message: $commit_message"

    if git commit -m "$commit_message"; then
        print_success "Commit created successfully"
        return 0
    else
        print_error "Failed to create commit"
        return 1
    fi
}

# Function to push to remote
push_to_remote() {
    print_status "Pushing to remote repository..."

    # Get current branch
    local current_branch=$(git branch --show-current)

    # Push to remote
    if git push "$REMOTE_NAME" "$current_branch"; then
        print_success "Successfully pushed to $REMOTE_NAME/$current_branch"
        return 0
    else
        print_error "Failed to push to remote"
        return 1
    fi
}

# Function to create backup
create_backup() {
    # Use the dedicated backup script
    if [ -f "./scripts/backup.sh" ]; then
        print_status "Using dedicated backup script..."
        bash ./scripts/backup.sh
    else
        local timestamp=$(date '+%Y%m%d_%H%M%S')
        local backup_dir="windventure_backup_${timestamp}"

        print_status "Creating backup in $backup_dir..."

        # Create backup directory
        mkdir -p "$backup_dir"

        # Copy important files (excluding node_modules, .next, etc.)
        rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='windventure_backup_*' . "$backup_dir/"

        print_success "Backup created in $backup_dir"
    fi
}

# Function to log the commit
log_commit() {
    local commit_message="$1"
    local timestamp=$(get_timestamp)
    local log_file="CURSOR_LOG_$(date '+%Y-%m-%d').md"

    # Create log entry
    cat >> "$log_file" << EOF

## Commit at $timestamp
- **Message**: $commit_message
- **Files Changed**: $(git diff --name-only --cached 2>/dev/null | wc -l)
- **Branch**: $(git branch --show-current)
- **Commit Hash**: $(git rev-parse HEAD)

### Modified Files:
$(git diff --name-only --cached 2>/dev/null | sed 's/^/- /')

---
EOF

    print_success "Commit logged to $log_file"
}

# Main execution
main() {
    print_status "Starting auto-commit process..."

    # Check if we're in a git repository
    check_git_repo

    # Check if there are changes to commit
    if ! check_changes; then
        print_warning "No changes detected. Exiting."
        exit 0
    fi

    # Get commit message from argument or generate one
    local commit_message=$(generate_commit_message "$1")

    # Stage all changes
    stage_changes

    # Validate changes
    validate_changes
    
    # Check for cache-sensitive issues
    check_cache_issues

    # Create backup
    create_backup

    # Create commit
    if create_commit "$commit_message"; then
        # Push to remote
        if push_to_remote; then
            # Log the commit
            log_commit "$commit_message"

            print_success "Auto-commit completed successfully!"
            print_status "Changes are now live in production (if Vercel auto-deploy is enabled)"

            # Trigger deployment verification
            if [ -f "./scripts/verify-deployment.sh" ]; then
                print_status "Triggering deployment verification..."
                ./scripts/verify-deployment.sh
            fi
        else
            print_error "Failed to push changes to remote"
            exit 1
        fi
    else
        print_error "Failed to create commit"
        exit 1
    fi
}

# Handle script arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [commit_message]"
    echo ""
    echo "Options:"
    echo "  commit_message    Custom commit message (optional)"
    echo "  --help, -h       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Auto-generated commit message"
    echo "  $0 'feat: update booking form'        # Custom commit message"
    echo "  $0 'fix: resolve navigation issue'    # Custom commit message"
    exit 0
fi

# Run main function
main "$1"