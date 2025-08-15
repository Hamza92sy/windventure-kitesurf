#!/bin/bash

# Hourly Monitoring Script for WindVenture
# This script checks that the English version is live

LOG_FILE="/Users/pro/Windventurefinal/logs/monitor-$(date +%Y%m%d).log"
mkdir -p /Users/pro/Windventurefinal/logs

echo "=== WindVenture Hourly Check - $(date '+%Y-%m-%d %H:%M:%S') ===" >> $LOG_FILE

# Check HTTP status
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://windventure.fr)
echo "HTTP Status: $STATUS" >> $LOG_FILE

# Check for English content
CONTENT=$(curl -s https://windventure.fr | grep -c "Your Ultimate Kitesurfing Adventure Starts Here")

if [ $STATUS -eq 200 ] && [ $CONTENT -gt 0 ]; then
    echo "✅ SUCCESS: Site is live with English content" >> $LOG_FILE
else
    echo "❌ ERROR: Site issue detected!" >> $LOG_FILE
    echo "   Status: $STATUS, English content found: $CONTENT" >> $LOG_FILE
    
    # Auto-recovery attempt
    echo "🔧 Attempting auto-recovery..." >> $LOG_FILE
    cd /Users/pro/Windventurefinal
    vercel --prod --yes >> $LOG_FILE 2>&1
fi

echo "=== End Check ===" >> $LOG_FILE
echo "" >> $LOG_FILE