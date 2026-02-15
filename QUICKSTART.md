# Quick Start Guide

Get up and running with AI App Builder in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An Anthropic API key

## Step 1: Clone and Install

```bash
# Install dependencies
npm install

# Or use the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Where to Get These Keys:

**Supabase:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy your Project URL and anon/service role keys

**Anthropic API:**
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Go to API Keys
4. Create a new API key

## Step 3: Set Up Database

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the query

This will create all necessary tables and set up authentication.

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Create Your First App

1. Click "Sign Up" and create an account
2. Go to "Create New App"
3. Describe your app (e.g., "A simple calculator")
4. Click "Generate App"
5. Preview and deploy!

## Optional: Set Up Deployment

To enable one-click deployment to Vercel:

1. Get a Vercel API token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add it to `.env.local`:
   ```env
   VERCEL_TOKEN=your-vercel-token
   ```

Without a Vercel token, the app will use a mock deployment (shows preview URL but doesn't actually deploy).

## Troubleshooting

### "Supabase connection failed"
- Double-check your Supabase URL and API keys in `.env.local`
- Make sure your Supabase project is active

### "AI generation timeout"
- Check that your Anthropic API key is valid
- Make sure you have API credits
- Try a simpler prompt

### "Database error"
- Make sure you ran the migration SQL script in Supabase
- Check that Row Level Security policies are set up correctly

## What's Next?

- Explore different app types by trying various prompts
- Deploy your apps to share them with others
- Check out the full [README.md](README.md) for more details

## Support

For issues or questions:
- Check the README.md
- Open an issue on GitHub
- Review the Supabase and Anthropic documentation

---

**Happy Building! 🚀**
