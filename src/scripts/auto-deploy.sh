#!/bin/bash

# Auto-Deploy Script for Windventure
# Triggers manual Vercel deployment and verifies success

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="windventure"
VERCEL_TEAM="team_C9v8R7bpi3Fu2ZzivqdUgRko"
VERCEL_PROJECT_ID="prj_ZoG0FHNXGlTiqPXAgdDqS22S7d1D"
PRODUCTION_URL="https://windventure.fr"
MAX_WAIT_TIME=300 # 5 minutes
CHECK_INTERVAL=10 # 10 seconds

# Function to print colored output
print_status() {
    echo -e "${BLUE}[AUTO-DEPLOY]${NC} $1"
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

# Function to check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel >/dev/null 2>&1; then
        print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
}

# Function to check if user is logged in to Vercel
check_vercel_auth() {
    print_status "Checking Vercel authentication..."

    if ! vercel whoami >/dev/null 2>&1; then
        print_error "Not logged in to Vercel. Please run: vercel login"
        exit 1
    fi

    print_success "Vercel authentication verified"
}

# Function to trigger deployment
trigger_deployment() {
    print_status "Triggering Vercel deployment..."

    # Build the project first
    print_status "Building project..."
    if npm run build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi

    # Deploy to production
    print_status "Deploying to production..."
    if vercel --prod --yes; then
        print_success "Deployment triggered successfully"
        return 0
    else
        print_error "Deployment failed"
        return 1
    fi
}

# Function to get deployment status
get_deployment_status() {
    local deployment_url=$(vercel ls --prod | grep "$PROJECT_NAME" | head -1 | awk '{print $2}')

    if [ -n "$deployment_url" ]; then
        echo "$deployment_url"
    else
        echo ""
    fi
}

# Function to check if deployment is ready
check_deployment_ready() {
    local deployment_url="$1"
    local start_time=$(date +%s)

    print_status "Waiting for deployment to be ready..."
    print_status "Deployment URL: $deployment_url"

    while true; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))

        if [ $elapsed -gt $MAX_WAIT_TIME ]; then
            print_error "Deployment timeout after ${MAX_WAIT_TIME} seconds"
            return 1
        fi

        # Check if deployment is ready
        if curl -s -f "$deployment_url" >/dev/null 2>&1; then
            print_success "Deployment is ready!"
            return 0
        fi

        print_status "Deployment not ready yet... (${elapsed}s elapsed)"
        sleep $CHECK_INTERVAL
    done
}

# Function to verify production site
verify_production_site() {
    print_status "Verifying production site: $PRODUCTION_URL"

    # Check if site is accessible
    if curl -s -f "$PRODUCTION_URL" >/dev/null 2>&1; then
        print_success "Production site is accessible"

        # Check response time
        local response_time=$(curl -s -w "%{time_total}" -o /dev/null "$PRODUCTION_URL")
        print_status "Response time: ${response_time}s"

        # Check for specific content to verify it's the right site
        if curl -s "$PRODUCTION_URL" | grep -q "Windventure\|Dakhla\|Kitesurf"; then
            print_success "Site content verified - correct site loaded"
            return 0
        else
            print_warning "Site content verification failed - may be cached version"
            return 1
        fi
    else
        print_error "Production site is not accessible"
        return 1
    fi
}

# Function to clear cache and force refresh
clear_cache() {
    print_status "Clearing CDN cache..."

    # Try to clear Vercel cache
    if vercel domains ls | grep -q "$PRODUCTION_URL"; then
        print_status "Attempting to clear Vercel cache..."
        # Note: Vercel CLI doesn't have a direct cache clear command
        # This would require using the Vercel API
        print_warning "Cache clearing requires Vercel API access"
    fi
}

# Function to log deployment
log_deployment() {
    local deployment_url="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_file="CURSOR_LOG_$(date '+%Y-%m-%d').md"

    # Create log entry
    cat >> "$log_file" << EOF

## Deployment at $timestamp
- **Deployment URL**: $deployment_url
- **Production URL**: $PRODUCTION_URL
- **Status**: Success
- **Branch**: $(git branch --show-current)
- **Commit Hash**: $(git rev-parse HEAD)

---
EOF

    print_success "Deployment logged to $log_file"
}

# Function to show deployment info
show_deployment_info() {
    print_status "Current deployment information:"
    echo ""
    echo "Project: $PROJECT_NAME"
    echo "Team: $VERCEL_TEAM"
    echo "Project ID: $VERCEL_PROJECT_ID"
    echo "Production URL: $PRODUCTION_URL"
    echo ""

    # Show recent deployments
    print_status "Recent deployments:"
    vercel ls --prod | head -5
}

# Main execution
main() {
    print_status "Starting auto-deploy process..."

    # Check prerequisites
    check_vercel_cli
    check_vercel_auth

    # Show current deployment info
    show_deployment_info

    # Trigger deployment
    if trigger_deployment; then
        # Get deployment URL
        local deployment_url=$(get_deployment_status)

        if [ -n "$deployment_url" ]; then
            # Wait for deployment to be ready
            if check_deployment_ready "$deployment_url"; then
                # Verify production site
                if verify_production_site; then
                    # Log deployment
                    log_deployment "$deployment_url"

                    print_success "Auto-deploy completed successfully!"
                    print_status "Your changes are now live at: $PRODUCTION_URL"

                    # Clear cache if needed
                    if [ "$1" = "--clear-cache" ]; then
                        clear_cache
                    fi
                else
                    print_warning "Production site verification failed"
                    print_status "Deployment may still be processing or cached"
                fi
            else
                print_error "Deployment failed to become ready"
                exit 1
            fi
        else
            print_error "Could not get deployment URL"
            exit 1
        fi
    else
        print_error "Failed to trigger deployment"
        exit 1
    fi
}

# Handle script arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --clear-cache    Clear CDN cache after deployment"
    echo "  --help, -h       Show this help message"
    echo ""
    echo "This script will:"
    echo "  1. Build the project"
    echo "  2. Deploy to Vercel production"
    echo "  3. Wait for deployment to be ready"
    echo "  4. Verify the production site"
    echo "  5. Log the deployment"
    exit 0
fi

# Run main function
main "$1"