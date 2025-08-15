#!/bin/bash

# Watch Changes Script for Windventure
# Monitors file changes during development and triggers builds/tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WATCH_DIRS=("app" "components" "lib" "hooks" "styles")
IGNORE_PATTERNS=("*.log" "*.tmp" "*.temp" ".next/*" "node_modules/*")
BUILD_TIMEOUT=60
TEST_TIMEOUT=30

# Function to print colored output
print_status() {
    echo -e "${BLUE}[WATCH]${NC} $1"
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

# Function to check if file should be ignored
should_ignore_file() {
    local file="$1"

    for pattern in "${IGNORE_PATTERNS[@]}"; do
        if [[ "$file" == $pattern ]]; then
            return 0
        fi
    done

    return 1
}

# Function to run TypeScript check
run_typescript_check() {
    print_status "Running TypeScript check..."

    if timeout $BUILD_TIMEOUT npx tsc --noEmit; then
        print_success "TypeScript check passed"
        return 0
    else
        print_error "TypeScript check failed"
        return 1
    fi
}

# Function to run ESLint check
run_eslint_check() {
    print_status "Running ESLint check..."

    if timeout $BUILD_TIMEOUT npx eslint . --ext .ts,.tsx --max-warnings 0; then
        print_success "ESLint check passed"
        return 0
    else
        print_warning "ESLint check failed (continuing...)"
        return 1
    fi
}

# Function to run build check
run_build_check() {
    print_status "Running build check..."

    if timeout $BUILD_TIMEOUT npm run build; then
        print_success "Build check passed"
        return 0
    else
        print_error "Build check failed"
        return 1
    fi
}

# Function to check Supabase connectivity
check_supabase_connectivity() {
    print_status "Checking Supabase connectivity..."

    local supabase_url="${NEXT_PUBLIC_SUPABASE_URL:-https://gxrtgopnchnwxuucbpog.supabase.co}"
    local supabase_key="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
    local log_dir="../logs"
    local timestamp=$(get_timestamp)

    # Create logs directory if it doesn't exist
    mkdir -p "$log_dir"

    # Test Supabase connectivity
    local response=$(curl -s -w "%{http_code}" "$supabase_url/rest/v1/" -H "apikey: $supabase_key" -o /dev/null)

    if [ "$response" = "200" ] || [ "$response" = "401" ]; then
        print_success "Supabase is responsive (HTTP $response)"
        echo "[$timestamp] Supabase OK - HTTP $response" >> "$log_dir/supabase_health.log"
        return 0
    else
        print_error "Supabase connectivity issue (HTTP $response)"
        echo "[$timestamp] Supabase ERROR - HTTP $response" >> "$log_dir/supabase_health.log"

        # Alert to console
        print_warning "⚠️  SUPABASE PROJECT MAY BE PAUSED!"
        print_warning "⚠️  Check https://supabase.com/dashboard to restore project"

        return 1
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."

    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        if timeout $TEST_TIMEOUT npm test; then
            print_success "Tests passed"
            return 0
        else
            print_warning "Tests failed (continuing...)"
            return 1
        fi
    else
        print_status "No tests configured"
        return 0
    fi
}

# Function to log file change
log_file_change() {
    local file="$1"
    local change_type="$2"
    local timestamp=$(get_timestamp)
    local log_file="CURSOR_LOG_$(date '+%Y-%m-%d').md"

    # Create log entry
    cat >> "$log_file" << EOF

## File Change at $timestamp
- **File**: $file
- **Change Type**: $change_type
- **Branch**: $(git branch --show-current)

---
EOF
}

# Function to handle file change
handle_file_change() {
    local file="$1"
    local change_type="$2"

    print_status "File changed: $file ($change_type)"

    # Log the change
    log_file_change "$file" "$change_type"

    # Run checks based on file type
    case "$file" in
        *.ts|*.tsx)
            print_status "TypeScript file changed - running checks..."
            run_typescript_check
            run_eslint_check
            ;;
        *.js|*.jsx)
            print_status "JavaScript file changed - running checks..."
            run_eslint_check
            ;;
        *.css|*.scss|*.sass)
            print_status "Style file changed - running build check..."
            run_build_check
            ;;
        *.json|*.md|*.txt)
            print_status "Config/documentation file changed - skipping checks..."
            ;;
        *)
            print_status "Unknown file type - running full checks..."
            run_typescript_check
            run_eslint_check
            run_build_check
            ;;
    esac

    # Run tests if available
    run_tests

    # Check Supabase connectivity periodically (every 10th file change)
    if (( RANDOM % 10 == 0 )); then
        check_supabase_connectivity
    fi

    print_success "File change processed: $file"
}

# Function to start file watcher
start_file_watcher() {
    print_status "Starting file watcher..."
    print_status "Watching directories: ${WATCH_DIRS[*]}"
    print_status "Press Ctrl+C to stop"
    echo ""

    # Use fswatch if available, otherwise use inotifywait
    if command -v fswatch >/dev/null 2>&1; then
        print_status "Using fswatch for file monitoring..."

        # Build fswatch command
        local fswatch_cmd="fswatch -r"
        for dir in "${WATCH_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                fswatch_cmd="$fswatch_cmd $dir"
            fi
        done

        # Start watching
        $fswatch_cmd | while read file; do
            if [ -n "$file" ] && ! should_ignore_file "$file"; then
                handle_file_change "$file" "modified"
            fi
        done

    elif command -v inotifywait >/dev/null 2>&1; then
        print_status "Using inotifywait for file monitoring..."

        # Build inotifywait command
        local inotify_cmd="inotifywait -m -r -e modify,create,delete"
        for dir in "${WATCH_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                inotify_cmd="$inotify_cmd $dir"
            fi
        done

        # Start watching
        $inotify_cmd | while read path action file; do
            if [ -n "$file" ] && ! should_ignore_file "$file"; then
                handle_file_change "$file" "$action"
            fi
        done

    else
        print_error "No file watcher available. Please install fswatch or inotify-tools:"
        echo "  macOS: brew install fswatch"
        echo "  Ubuntu: sudo apt-get install inotify-tools"
        exit 1
    fi
}

# Function to run initial checks
run_initial_checks() {
    print_status "Running initial checks..."

    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_warning "Not in a git repository"
    else
        print_success "Git repository detected"
    fi

    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        exit 1
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Run 'npm install' first."
    fi

    # Run initial TypeScript check
    run_typescript_check

    # Run initial ESLint check
    run_eslint_check

    # Run initial Supabase connectivity check
    check_supabase_connectivity

    print_success "Initial checks completed"
}

# Function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --check-only     Run checks without starting watcher"
    echo "  --no-tests       Skip running tests"
    echo ""
    echo "This script will:"
    echo "  1. Monitor file changes in app/, components/, lib/, hooks/, styles/"
    echo "  2. Run appropriate checks based on file type"
    echo "  3. Log all changes"
    echo "  4. Run tests when available"
    echo ""
    echo "Requirements:"
    echo "  - fswatch (macOS) or inotify-tools (Linux)"
    echo "  - Node.js and npm"
    echo "  - TypeScript and ESLint configured"
}

# Main execution
main() {
    # Parse arguments
    local check_only=false
    local no_tests=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --check-only)
                check_only=true
                shift
                ;;
            --no-tests)
                no_tests=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    print_status "Starting watch-changes process..."

    # Run initial checks
    run_initial_checks

    # If check-only mode, exit here
    if [ "$check_only" = true ]; then
        print_success "Check-only mode completed"
        exit 0
    fi

    # Start file watcher
    start_file_watcher
}

# Run main function
main "$@"