#!/bin/bash

# 🔄 Watch All - Unified Claude CLI + Cursor Pro Watcher
# Manages parallel execution of both watchers with monitoring and auto-restart

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
CLAUDE_SCRIPT="./watch-claude.sh"
CURSOR_SCRIPT="./scripts/file-watcher.sh"
CLAUDE_LOG="logs/claude_watch.log"
CURSOR_LOG="logs/cursor_watch.log"
MAIN_LOG="logs/watch-all.log"
PIDFILE="logs/watch-all.pid"
RESTART_DELAY=5
MAX_RESTARTS=3

# PID variables
CLAUDE_PID=""
CURSOR_PID=""
RESTART_COUNT_CLAUDE=0
RESTART_COUNT_CURSOR=0

# Functions
print_header() {
    clear
    echo -e "${CYAN}${BOLD}🔄 ============================================${NC}"
    echo -e "${CYAN}${BOLD}   WINDVENTURE UNIFIED WATCHER SYSTEM${NC}"
    echo -e "${CYAN}${BOLD}   Claude CLI + Cursor Pro Integration${NC}"
    echo -e "${CYAN}${BOLD}============================================${NC}"
    echo ""
}

print_status() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[WATCH-ALL]${NC} $1"
    echo "[$timestamp] [WATCH-ALL] $1" >> "$MAIN_LOG"
}

print_success() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[$timestamp] [SUCCESS] $1" >> "$MAIN_LOG"
}

print_warning() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "[$timestamp] [WARNING] $1" >> "$MAIN_LOG"
}

print_error() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[$timestamp] [ERROR] $1" >> "$MAIN_LOG"
}

print_claude() {
    echo -e "${PURPLE}[CLAUDE]${NC} $1"
}

print_cursor() {
    echo -e "${CYAN}[CURSOR]${NC} $1"
}

# Function to create logs directory
create_logs_dir() {
    mkdir -p logs
    touch "$CLAUDE_LOG" "$CURSOR_LOG" "$MAIN_LOG"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Claude CLI is available
    if ! command -v claude >/dev/null 2>&1; then
        print_error "Claude CLI not found. Please install Claude CLI first."
        exit 1
    fi
    
    # Check if Claude watcher script exists
    if [ ! -f "$CLAUDE_SCRIPT" ]; then
        print_error "Claude watcher script not found: $CLAUDE_SCRIPT"
        exit 1
    fi
    
    # Check if Cursor watcher script exists
    if [ ! -f "$CURSOR_SCRIPT" ]; then
        print_error "Cursor watcher script not found: $CURSOR_SCRIPT"
        exit 1
    fi
    
    # Make scripts executable
    chmod +x "$CLAUDE_SCRIPT" "$CURSOR_SCRIPT"
    
    # Check for fswatch (required by both watchers)
    if ! command -v fswatch >/dev/null 2>&1; then
        print_warning "fswatch not found. Some features may not work."
        print_warning "Install with: brew install fswatch (macOS) or apt-get install fswatch (Linux)"
    fi
    
    print_success "Prerequisites check completed"
}

# Function to start Claude CLI watcher
start_claude_watcher() {
    print_claude "Starting Claude CLI watcher..."
    
    # Start Claude watcher in background
    nohup "$CLAUDE_SCRIPT" > "$CLAUDE_LOG" 2>&1 &
    CLAUDE_PID=$!
    
    # Verify process started
    if ps -p $CLAUDE_PID > /dev/null 2>&1; then
        print_success "Claude CLI watcher started (PID: $CLAUDE_PID)"
        echo "claude_pid=$CLAUDE_PID" >> "$PIDFILE"
        return 0
    else
        print_error "Failed to start Claude CLI watcher"
        return 1
    fi
}

# Function to start Cursor Pro watcher
start_cursor_watcher() {
    print_cursor "Starting Cursor Pro watcher..."
    
    # Start Cursor watcher in background
    nohup "$CURSOR_SCRIPT" > "$CURSOR_LOG" 2>&1 &
    CURSOR_PID=$!
    
    # Verify process started
    if ps -p $CURSOR_PID > /dev/null 2>&1; then
        print_success "Cursor Pro watcher started (PID: $CURSOR_PID)"
        echo "cursor_pid=$CURSOR_PID" >> "$PIDFILE"
        return 0
    else
        print_error "Failed to start Cursor Pro watcher"
        return 1
    fi
}

# Function to check if process is running
is_process_running() {
    local pid=$1
    if [ -n "$pid" ] && ps -p "$pid" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to restart Claude watcher
restart_claude_watcher() {
    if [ $RESTART_COUNT_CLAUDE -ge $MAX_RESTARTS ]; then
        print_error "Claude watcher exceeded maximum restart attempts ($MAX_RESTARTS)"
        return 1
    fi
    
    RESTART_COUNT_CLAUDE=$((RESTART_COUNT_CLAUDE + 1))
    print_warning "Restarting Claude watcher (attempt $RESTART_COUNT_CLAUDE/$MAX_RESTARTS)..."
    
    sleep $RESTART_DELAY
    
    if start_claude_watcher; then
        print_success "Claude watcher restarted successfully"
        RESTART_COUNT_CLAUDE=0  # Reset counter on successful restart
        return 0
    else
        print_error "Failed to restart Claude watcher"
        return 1
    fi
}

# Function to restart Cursor watcher
restart_cursor_watcher() {
    if [ $RESTART_COUNT_CURSOR -ge $MAX_RESTARTS ]; then
        print_error "Cursor watcher exceeded maximum restart attempts ($MAX_RESTARTS)"
        return 1
    fi
    
    RESTART_COUNT_CURSOR=$((RESTART_COUNT_CURSOR + 1))
    print_warning "Restarting Cursor watcher (attempt $RESTART_COUNT_CURSOR/$MAX_RESTARTS)..."
    
    sleep $RESTART_DELAY
    
    if start_cursor_watcher; then
        print_success "Cursor watcher restarted successfully"
        RESTART_COUNT_CURSOR=0  # Reset counter on successful restart
        return 0
    else
        print_error "Failed to restart Cursor watcher"
        return 1
    fi
}

# Function to monitor processes
monitor_processes() {
    print_status "Starting process monitoring..."
    
    while true; do
        # Check Claude watcher
        if ! is_process_running "$CLAUDE_PID"; then
            print_warning "Claude watcher stopped unexpectedly"
            if ! restart_claude_watcher; then
                print_error "Cannot restart Claude watcher. Exiting..."
                break
            fi
        fi
        
        # Check Cursor watcher
        if ! is_process_running "$CURSOR_PID"; then
            print_warning "Cursor watcher stopped unexpectedly"
            if ! restart_cursor_watcher; then
                print_error "Cannot restart Cursor watcher. Exiting..."
                break
            fi
        fi
        
        # Sleep before next check
        sleep 10
    done
}

# Function to show status
show_status() {
    echo ""
    echo -e "${BOLD}📊 WATCHER STATUS${NC}"
    echo "================================"
    
    # Claude status
    if is_process_running "$CLAUDE_PID"; then
        echo -e "🧠 Claude CLI:  ${GREEN}RUNNING${NC} (PID: $CLAUDE_PID)"
    else
        echo -e "🧠 Claude CLI:  ${RED}STOPPED${NC}"
    fi
    
    # Cursor status
    if is_process_running "$CURSOR_PID"; then
        echo -e "🔁 Cursor Pro:  ${GREEN}RUNNING${NC} (PID: $CURSOR_PID)"
    else
        echo -e "🔁 Cursor Pro:  ${RED}STOPPED${NC}"
    fi
    
    echo ""
    echo -e "${BOLD}📁 LOG FILES${NC}"
    echo "================================"
    echo "🧠 Claude Log:  $CLAUDE_LOG"
    echo "🔁 Cursor Log:  $CURSOR_LOG"
    echo "📊 Main Log:    $MAIN_LOG"
    
    echo ""
    echo -e "${BOLD}📈 STATISTICS${NC}"
    echo "================================"
    echo "🔄 Claude Restarts: $RESTART_COUNT_CLAUDE/$MAX_RESTARTS"
    echo "🔄 Cursor Restarts: $RESTART_COUNT_CURSOR/$MAX_RESTARTS"
    
    # Show last few log entries
    echo ""
    echo -e "${BOLD}📝 RECENT ACTIVITY${NC}"
    echo "================================"
    if [ -f "$MAIN_LOG" ]; then
        tail -5 "$MAIN_LOG" 2>/dev/null || echo "No recent activity"
    fi
}

# Function to tail logs in real time
tail_logs() {
    print_status "Displaying real-time logs (Ctrl+C to stop)..."
    echo ""
    
    # Start tail processes in background
    if [ -f "$CLAUDE_LOG" ]; then
        tail -f "$CLAUDE_LOG" | sed 's/^/[CLAUDE] /' &
        local claude_tail_pid=$!
    fi
    
    if [ -f "$CURSOR_LOG" ]; then
        tail -f "$CURSOR_LOG" | sed 's/^/[CURSOR] /' &
        local cursor_tail_pid=$!
    fi
    
    if [ -f "$MAIN_LOG" ]; then
        tail -f "$MAIN_LOG" | sed 's/^/[MAIN] /' &
        local main_tail_pid=$!
    fi
    
    # Wait for interrupt
    trap "kill $claude_tail_pid $cursor_tail_pid $main_tail_pid 2>/dev/null; echo; print_status 'Log tail stopped'" INT
    wait
}

# Function to cleanup on exit
cleanup() {
    print_status "Stopping all watchers..."
    
    # Kill Claude watcher
    if [ -n "$CLAUDE_PID" ] && is_process_running "$CLAUDE_PID"; then
        print_claude "Stopping Claude watcher (PID: $CLAUDE_PID)"
        kill "$CLAUDE_PID" 2>/dev/null || true
        wait "$CLAUDE_PID" 2>/dev/null || true
    fi
    
    # Kill Cursor watcher
    if [ -n "$CURSOR_PID" ] && is_process_running "$CURSOR_PID"; then
        print_cursor "Stopping Cursor watcher (PID: $CURSOR_PID)"
        kill "$CURSOR_PID" 2>/dev/null || true
        wait "$CURSOR_PID" 2>/dev/null || true
    fi
    
    # Clean up PID file
    if [ -f "$PIDFILE" ]; then
        rm -f "$PIDFILE"
    fi
    
    print_success "All watchers stopped"
    exit 0
}

# Function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Unified watcher for Claude CLI + Cursor Pro integration"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --status         Show current status of watchers"
    echo "  --logs           Display real-time logs"
    echo "  --stop           Stop all running watchers"
    echo "  --restart        Restart all watchers"
    echo ""
    echo "This script will:"
    echo "  1. Start Claude CLI watcher for intelligent code analysis"
    echo "  2. Start Cursor Pro watcher for automated commits"
    echo "  3. Monitor both processes and restart if they crash"
    echo "  4. Provide unified logging and status reporting"
    echo ""
    echo "Log files:"
    echo "  - Claude CLI: $CLAUDE_LOG"
    echo "  - Cursor Pro: $CURSOR_LOG"
    echo "  - Main log:   $MAIN_LOG"
}

# Function to stop all watchers
stop_watchers() {
    print_status "Stopping all watchers..."
    
    # Read PIDs from file if exists
    if [ -f "$PIDFILE" ]; then
        source "$PIDFILE" 2>/dev/null || true
        
        if [ -n "$claude_pid" ] && is_process_running "$claude_pid"; then
            print_claude "Stopping Claude watcher (PID: $claude_pid)"
            kill "$claude_pid" 2>/dev/null || true
        fi
        
        if [ -n "$cursor_pid" ] && is_process_running "$cursor_pid"; then
            print_cursor "Stopping Cursor watcher (PID: $cursor_pid)"
            kill "$cursor_pid" 2>/dev/null || true
        fi
        
        rm -f "$PIDFILE"
    fi
    
    # Kill any remaining processes
    pkill -f "watch-claude.sh" 2>/dev/null || true
    pkill -f "file-watcher.sh" 2>/dev/null || true
    
    print_success "All watchers stopped"
}

# Main execution
main() {
    # Parse arguments
    case "${1:-}" in
        --help|-h)
            show_help
            exit 0
            ;;
        --status)
            if [ -f "$PIDFILE" ]; then
                source "$PIDFILE" 2>/dev/null || true
                CLAUDE_PID=${claude_pid:-}
                CURSOR_PID=${cursor_pid:-}
            fi
            show_status
            exit 0
            ;;
        --logs)
            tail_logs
            exit 0
            ;;
        --stop)
            stop_watchers
            exit 0
            ;;
        --restart)
            stop_watchers
            sleep 2
            # Continue to normal execution to restart
            ;;
        "")
            # Normal execution
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
    
    # Setup signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Print header
    print_header
    
    # Create logs directory
    create_logs_dir
    
    # Check prerequisites
    check_prerequisites
    
    # Initialize PID file
    echo "# Watch-All PID file - $(date)" > "$PIDFILE"
    
    print_status "Starting unified watcher system..."
    
    # Start both watchers
    if start_claude_watcher && start_cursor_watcher; then
        print_success "Both watchers started successfully"
        
        # Show initial status
        show_status
        
        echo ""
        print_status "Monitoring processes... (Press Ctrl+C to stop)"
        print_status "Use '$0 --status' to check status"
        print_status "Use '$0 --logs' to view real-time logs"
        
        # Start monitoring
        monitor_processes
    else
        print_error "Failed to start watchers"
        cleanup
        exit 1
    fi
}

# Run main function
main "$@"