#!/bin/bash

# Security Check Script for DeathChat Repository
# This script verifies that no sensitive information is being committed

echo "🔐 DeathChat Security Check"
echo "=========================="

# Check if .env file exists but is ignored
if [ -f ".env" ]; then
    echo "✅ .env file exists locally"
    if git check-ignore .env > /dev/null 2>&1; then
        echo "✅ .env file is properly ignored by git"
    else
        echo "❌ WARNING: .env file is NOT ignored by git!"
        exit 1
    fi
else
    echo "ℹ️  No .env file found (this is okay for first-time setup)"
fi

# Check if .env.example exists and has placeholder values
if [ -f ".env.example" ]; then
    echo "✅ .env.example file exists"
    if grep -q "your_openrouter_api_key_here" .env.example; then
        echo "✅ .env.example contains placeholder values"
    else
        echo "❌ WARNING: .env.example might contain real API keys!"
        exit 1
    fi
else
    echo "❌ .env.example file is missing"
    exit 1
fi

# Check for API keys in source code
echo "🔍 Scanning for API keys in source code..."
if grep -r "sk-or-" src/ --exclude-dir=node_modules 2>/dev/null; then
    echo "❌ WARNING: Potential API keys found in source code!"
    exit 1
else
    echo "✅ No API keys found in source code"
fi

# Check .gitignore
if grep -q "\.env$" .gitignore; then
    echo "✅ .gitignore properly excludes .env files"
else
    echo "❌ WARNING: .gitignore doesn't exclude .env files!"
    exit 1
fi

echo ""
echo "🎉 Security check passed! Repository is safe to publish."
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push -u origin main"
echo "2. Set up GitHub Pages in repository settings"
echo "3. Users should copy .env.example to .env and add their API key"
