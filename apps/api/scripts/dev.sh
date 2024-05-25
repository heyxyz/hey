#!/bin/bash

# Development script to run server and cron job concurrently
echo "Starting development environment..."

concurrently --prefix "{name}" \
  "nodemon -w src -x tsx src/server.ts" \
  "nodemon -w src -x tsx src/cron/index.ts" 
