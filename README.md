# AI App Builder Platform - MVP

A fully functional AI-powered platform that allows users to describe apps in natural language and receive working, deployable web applications.

## 🚀 Features

- **Natural Language App Generation**: Describe your app, get working code
- **Live Preview**: See your generated app instantly
- **One-Click Deployment**: Deploy to Vercel with a single click
- **User Authentication**: Secure email/password authentication via Supabase
- **Project Management**: Dashboard to manage all your generated apps
- **AI-Powered**: Uses Claude API for intelligent code generation

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Engine**: Anthropic Claude API
- **Deployment**: Vercel (Frontend) + Supabase (Backend)
- **Storage**: Supabase Storage (for generated code)

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Anthropic API key (Claude)
- Vercel account (for deployment)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your `Project URL` and `anon public` API key
4. Go to SQL Editor and run the migration script in `supabase/migrations/001_initial_schema.sql`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Vercel (for deployment features)
VERCEL_TOKEN=your_vercel_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-app-builder/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── dashboard/         # User dashboard
│   │   ├── create/            # App creation page
│   │   ├── preview/[id]/      # App preview page
│   │   └── api/               # API routes
│   │       ├── generate/      # AI generation endpoint
│   │       ├── deploy/        # Deployment endpoint
│   │       └── projects/      # Project CRUD endpoints
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility libraries
│   │   ├── supabase.ts       # Supabase client
│   │   ├── ai.ts             # AI integration
│   │   └── deployer.ts       # Deployment logic
│   └── types/                 # TypeScript type definitions
├── supabase/
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

## 🎯 Usage Flow

1. **Sign Up / Login**: Create an account or log in
2. **Dashboard**: View all your generated apps
3. **Create New App**: Click "Create New App"
4. **Describe Your App**: Enter a natural language description
   - Example: "A todo app with authentication, dark mode, and priority levels"
5. **Generate**: AI generates the complete app code
6. **Preview**: See your app running in real-time
7. **Deploy**: One-click deployment to Vercel
8. **Share**: Get a live URL to share your app

## 🧪 Example Prompts

- "A simple calculator app with basic arithmetic operations"
- "A weather app that shows current weather for any city"
- "A markdown note-taking app with local storage"
- "A pomodoro timer with customizable intervals"
- "A random quote generator with share functionality"

## 🔐 Authentication

- Email/password authentication via Supabase
- Secure session management
- Protected routes for authenticated users
- Auto-redirect for unauthorized access

## 💾 Database Schema

### Projects Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `name`: Text
- `description`: Text (User's prompt)
- `code`: JSONB (Generated code files)
- `preview_url`: Text
- `deploy_url`: Text
- `status`: Text (generating, ready, deployed, failed)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## 🚢 Deployment

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add all environment variables from `.env.local` to your Vercel project settings.

## 🔄 How It Works

1. **User Input**: User describes their desired app
2. **AI Processing**: Prompt sent to Claude API
3. **Code Generation**: AI generates:
   - React components
   - Styling (Tailwind CSS)
   - State management
   - API routes (if needed)
4. **Storage**: Code saved to Supabase
5. **Preview**: Code rendered in iframe
6. **Deployment**: One-click deploy to Vercel via API

## 🎨 Generated App Structure

Each generated app includes:
- `index.html` - Main HTML file
- `app.js` - React component code
- `styles.css` - Tailwind CSS styles
- `package.json` - Dependencies
- `README.md` - App documentation

## 📝 API Endpoints

- `POST /api/generate` - Generate app from prompt
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `DELETE /api/projects/:id` - Delete project
- `POST /api/deploy/:id` - Deploy project to Vercel

## 🔮 Future Enhancements

- [ ] Code editing interface
- [ ] Multiple AI models (GPT-4, Gemini)
- [ ] Template library
- [ ] GitHub integration
- [ ] Collaborative editing
- [ ] Custom domains
- [ ] Analytics dashboard
- [ ] Stripe payment integration
- [ ] Export to GitHub
- [ ] Advanced theming

## 🐛 Troubleshooting

**Issue**: "Supabase connection failed"
- Check your Supabase URL and API keys
- Verify your Supabase project is active

**Issue**: "AI generation timeout"
- Claude API may be rate-limited
- Check your API key is valid
- Try a simpler prompt

**Issue**: "Deployment failed"
- Verify Vercel token is correct
- Check Vercel account has available deployments

## 📄 License

MIT License - feel free to use this project as you wish.

## 🤝 Contributing

This is an MVP. Contributions welcome!

## 📧 Support

For issues, please open a GitHub issue or contact support.

---

Built with ❤️ using Next.js, Supabase, and Claude AI
