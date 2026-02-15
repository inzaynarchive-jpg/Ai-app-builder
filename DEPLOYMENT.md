# Deployment Guide

This guide covers deploying your AI App Builder platform to production.

## Prerequisites

- GitHub account (for code hosting)
- Vercel account (for hosting)
- Supabase project (already set up from development)
- Anthropic API key

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ai-app-builder.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add all environment variables from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-api03-...
VERCEL_TOKEN=your-vercel-deployment-token
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete. Your app will be live at `https://your-app.vercel.app`

## Option 2: Deploy to Other Platforms

### Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy

### Railway

1. Create new project from GitHub repo
2. Add environment variables
3. Railway will auto-detect Next.js and deploy

### DigitalOcean App Platform

1. Create new app from GitHub
2. Select Next.js as framework
3. Add environment variables
4. Deploy

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Supabase Row Level Security policies are enabled
- [ ] Database indexes are created (already done in migration)
- [ ] Rate limiting is configured (optional)
- [ ] Error tracking is set up (optional - use Sentry)
- [ ] Analytics are configured (optional)
- [ ] Custom domain is configured (optional)
- [ ] SSL certificate is active (automatic on Vercel)

## Post-Deployment

### Monitor Your App

1. Check Vercel Analytics for performance metrics
2. Monitor Supabase logs for database errors
3. Track API usage in Anthropic console

### Set Up Custom Domain

In Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS settings at your domain registrar
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### Enable Automatic Deployments

Vercel automatically deploys on every push to main branch. To deploy other branches:
1. Go to Project Settings → Git
2. Enable branch deployments

## Scaling Considerations

### Database

- Supabase free tier supports up to 500MB database
- Upgrade to Pro for larger databases and better performance
- Consider connection pooling for high traffic

### AI API

- Monitor Anthropic API usage and costs
- Implement rate limiting to prevent abuse
- Consider caching generated apps

### Hosting

- Vercel free tier supports hobby projects
- Upgrade to Pro for commercial use and better performance
- Consider edge functions for faster response times

## Security Best Practices

1. **API Keys**: Never commit `.env.local` to git
2. **Rate Limiting**: Implement rate limits on API routes
3. **Input Validation**: Validate all user inputs
4. **CORS**: Configure CORS properly in production
5. **Updates**: Keep dependencies updated

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Database Connection Issues
- Check Supabase project is active
- Verify connection pooler settings
- Check RLS policies

### Deployment Fails
- Ensure Vercel token has proper permissions
- Check Vercel deployment logs
- Verify API quotas aren't exceeded

## Monitoring & Maintenance

### Recommended Tools

- **Error Tracking**: Sentry (sentry.io)
- **Analytics**: Vercel Analytics or Plausible
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Performance**: Vercel Speed Insights

### Regular Maintenance

- Update dependencies monthly
- Review and optimize database queries
- Monitor API costs
- Back up database regularly
- Review error logs weekly

## Rollback Strategy

If deployment fails:

1. In Vercel, go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

Or revert git commit:

```bash
git revert HEAD
git push origin main
```

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

Need help? Open an issue on GitHub or check the documentation.
