#!/bin/bash
# Kermit Thought Generator - Cron Wrapper
# Run this every 30 minutes via system cron
# Add to crontab: */30 * * * * /root/clawd/frug-bots/frug-knowledge-base/scripts/run-kermit.sh >> /var/log/kermit.log 2>&1

cd /root/clawd/frug-bots/frug-knowledge-base

# Load environment from secure location
if [ -f /root/.env/kermit.env ]; then
  source /root/.env/kermit.env
fi

# Run the generator
node scripts/kermit-thought-generator.js
