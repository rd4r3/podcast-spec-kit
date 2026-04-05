# Vercel Deployment Configuration

This file documents the setup required to deploy the Podcast Website to Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel
- Node.js 18.0 or higher

## Configuration Files

### vercel.json (optional - for advanced configuration)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### next.config.js

The project is already configured for static export:
- `output: 'export'` enables static generation
- All pages are pre-rendered as static HTML

## Environment Variables

Create a `.env.local` file for local development (not committed to git):

```bash
# Optional: API endpoints if needed in future
# NEXT_PUBLIC_API_URL=https://api.example.com
# API_SECRET=your_secret_here
```

## Deployment Steps

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

#### Option A: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import the GitHub repository
4. Framework: Next.js (auto-detected)
5. Root Directory: `./podcast-website`
6. Environment Variables: (none required for MVP)
7. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
npm i -g vercel
cd podcast-website
vercel
# Follow prompts to connect and deploy
```

### Step 3: Configure Build Settings

In Vercel Dashboard:
1. Go to Project Settings → Build & Development Settings
2. Build Command: `npm run build`
3. Output Directory: `out`
4. Install Command: `npm ci`
5. Dev Command: `npm run dev`

### Step 4: Verify Deployment

After deployment:
1. Visit your Vercel project URL
2. Test all pages load correctly
3. Verify static generation worked
4. Check dark mode toggle
5. Test audio player
6. Verify responsive design

## Performance Optimization

### Built-in Optimizations (Next.js)
- ✅ Image optimization with `next/image`
- ✅ Font optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification

### Vercel CDN Benefits
- ✅ Global edge caching
- ✅ Automatic compression
- ✅ HTTP/2 push
- ✅ DDoS protection
- ✅ SSL/TLS encryption

### Analytics

Enable Vercel Web Analytics:
1. Dashboard → Project Settings → Analytics
2. Enable "Web Analytics"
3. Add tracking code (auto-injected for Next.js)

## Continuous Deployment

### Automatic Deployments
- Main branch: Auto-deploys on push
- Preview deployments: Auto-created for pull requests
- Rollback: Available in Deployment History

### Manual Rollback
1. Dashboard → Deployments
2. Find previous deployment
3. Click "Promote to Production"

## SSL/TLS Certificate

Vercel automatically provides:
- Free SSL certificate for `*.vercel.app` domain
- Free SSL certificate for custom domains
- Auto-renewal

## Custom Domain Setup

If using a custom domain:

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

## Environment-Specific Configuration

### Production
```bash
NEXT_PUBLIC_ENV=production
```

### Preview/Staging
```bash
NEXT_PUBLIC_ENV=preview
```

### Local Development
```bash
NEXT_PUBLIC_ENV=development
```

## Monitoring & Analytics

### Vercel Analytics
- Page load performance
- Core Web Vitals
- Error rates
- Traffic patterns

### Third-party Integration (Optional)
- Sentry for error tracking
- Datadog for monitoring
- LogRocket for session replay

## Troubleshooting

### Build Failures
- Check Node.js version compatibility
- Review build logs in Vercel Dashboard
- Verify all environment variables set

### Slow Deployments
- Check project size
- Verify no large files in output
- Ensure dependencies cached

### Performance Issues
- Check Vercel Analytics
- Review Core Web Vitals
- Optimize images if needed

## Rollback Procedure

If issues occur after deployment:

1. Vercel Dashboard → Deployments
2. Click previous deployment
3. Click "Promote to Production"
4. Verify site restored

Alternative: `git revert` and push new code

## Security Considerations

✅ **Already Implemented**
- Static site (no server vulnerabilities)
- Content Security Policy headers
- Secure headers via Next.js
- No sensitive data in code

## Maintenance

### Regular Tasks
- Monitor error rates
- Review Core Web Vitals
- Check for dependency updates
- Update content as needed

### Quarterly Review
- Audit dependencies
- Review analytics
- Test all features
- Check accessibility compliance

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Discussions**: Community support
- **Vercel Support**: priority@vercel.com

## Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Build settings configured
- [ ] Environment variables set (if any)
- [ ] SSL certificate verified
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Monitoring setup
- [ ] Backup/rollback procedure documented
- [ ] Team members notified

---

**Deployment Status**: Ready for production
**Last Updated**: 2024-04-05
