#!/bin/bash

# Quick Start Script for Haikus for Codespaces
# This script sets up and runs the application

set -e  # Exit on error

echo "🚀 Starting Haikus for Codespaces setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v12 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Starting the application..."
echo "   The server will run on http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the application
npm start
