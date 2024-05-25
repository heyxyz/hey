#!/bin/bash

# Production script to run server and cron job concurrently
echo "Starting production environment..."

concurrently --prefix "{name}" \
  "NODE_ENV=production tsx src/server.ts" \
  "NODE_ENV=production tsx src/cron/index.ts"
