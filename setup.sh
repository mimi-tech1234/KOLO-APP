#!/bin/bash

# Kolo App - Development Setup Script
# This script installs all dependencies and prepares the app for development

set -e

echo "================================"
echo "Kolo App - Development Setup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install workspace dependencies
echo "Installing API dependencies..."
npm --workspace @kolo/api install

echo "Installing Web dependencies..."
npm --workspace @kolo/web install

echo "Installing Mobile dependencies..."
npm --workspace @kolo/mobile install

echo ""
echo "================================"
echo "✓ Setup complete!"
echo "================================"
echo ""
echo "Available commands:"
echo "  npm run dev:api      - Start API server (port 4000)"
echo "  npm run dev:web      - Start Web app (port 5173)"
echo "  npm run dev:mobile   - Start Mobile dev server"
echo "  npm run start:api    - Start API in production mode"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and configure"
echo "  2. Set up database: bash setup-db.sh (or setup-db.bat on Windows)"
echo "  3. Run: npm run dev:api"
echo ""
