#!/bin/bash

# Vietnam Tax Calculator - Setup Script
# This script will install dependencies and start the development server

echo "🇻🇳 Vietnam Personal Income Tax Calculator - Setup"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Start development server
echo "🚀 Starting development server..."
echo ""
echo "The app will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
