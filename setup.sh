#!/bin/bash

# AI App Builder - Setup Script
# This script helps you set up the project quickly

echo "🚀 AI App Builder - Setup Script"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✓ Created .env.local from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your API keys:"
    echo "   - Supabase URL and keys (get from https://supabase.com)"
    echo "   - Anthropic API key (get from https://console.anthropic.com/)"
    echo "   - Vercel token (optional, get from https://vercel.com/account/tokens)"
    echo ""
else
    echo "✓ .env.local file already exists"
    echo ""
fi

# Check if Supabase is configured
echo "🔍 Checking environment configuration..."
if grep -q "your-project.supabase.co" .env.local 2>/dev/null; then
    echo "⚠️  Warning: Supabase URL not configured in .env.local"
    echo "   Please update NEXT_PUBLIC_SUPABASE_URL with your Supabase project URL"
fi

if grep -q "your-anon-key-here" .env.local 2>/dev/null; then
    echo "⚠️  Warning: Supabase anon key not configured in .env.local"
    echo "   Please update NEXT_PUBLIC_SUPABASE_ANON_KEY"
fi

if grep -q "sk-ant-api03-" .env.local 2>/dev/null; then
    echo "⚠️  Warning: Anthropic API key not configured in .env.local"
    echo "   Please update ANTHROPIC_API_KEY with your Claude API key"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Configure your environment variables in .env.local"
echo "2. Set up your Supabase project:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the SQL migration in supabase/migrations/001_initial_schema.sql"
echo "   - Copy your project URL and anon key to .env.local"
echo "3. Get your Anthropic API key from https://console.anthropic.com/"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed instructions, see README.md"
echo ""
echo "✨ Setup complete! Happy building!"
