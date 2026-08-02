# Deployment Guide

This guide covers deploying TowerOS to production using Vercel (web) and other hosting providers.

## Prerequisites

- GitHub account
- Vercel account
- PostgreSQL database (Neon, Supabase, or similar)
- API hosting (Render, Railway, or similar)

## 1. Deploy Web Dashboard to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `dseis92/toweros`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm turbo build --filter=@tower/web`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

6. Click "Deploy"

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/dylanseis/tower
vercel --prod
```

## 2. Deploy API Server

### Option A: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: toweros-api
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm --filter @tower/api build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: Starter ($7/month)

5. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_PRIVATE_KEY=<your-private-key>
   JWT_PUBLIC_KEY=<your-public-key>
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   CORS_CREDENTIALS=true
   ```

### Option B: Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm --filter @tower/api build`
   - **Start Command**: `node dist/index.js`

5. Add the same environment variables as above

## 3. Set Up Database

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and sign in
2. Create a new project: "TowerOS Production"
3. Copy the connection string
4. Run migrations:
   ```bash
   DATABASE_URL="postgresql://..." pnpm --filter @tower/database migrate
   ```

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Go to Settings → Database → Connection string
4. Run migrations as shown above

## 4. Generate JWT Keys

Generate RSA key pair for production:

```bash
# Generate private key
openssl genrsa -out jwt.key 4096

# Generate public key
openssl rsa -in jwt.key -pubout -out jwt.key.pub

# Convert to single-line format for environment variables
echo "JWT_PRIVATE_KEY=$(awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' jwt.key)"
echo "JWT_PUBLIC_KEY=$(awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' jwt.key.pub)"
```

Store these values securely in your hosting provider's environment variables.

## 5. Update Web App Environment

Update the `NEXT_PUBLIC_API_URL` in Vercel to point to your deployed API:

```
NEXT_PUBLIC_API_URL=https://toweros-api.onrender.com
```

Then redeploy the web app.

## 6. Verify Deployment

1. Visit your Vercel URL
2. Try logging in with demo credentials:
   - Email: `admin@acme-telecom.com`
   - Password: `password`
3. Check that API calls are working correctly

## Security Checklist

- [ ] JWT keys are unique and securely generated
- [ ] Database connection uses SSL
- [ ] CORS is configured to only allow your frontend domain
- [ ] Environment variables are not committed to Git
- [ ] API rate limiting is enabled
- [ ] Database backups are configured

## Monitoring

### Vercel Analytics

Vercel automatically provides:
- Build logs
- Function logs
- Performance metrics

### API Monitoring

For Render/Railway:
- Check application logs in the dashboard
- Set up log drains to services like Logtail or Datadog
- Configure health check endpoints

## Troubleshooting

### Build Fails on Vercel

Check that all dependencies are properly listed in package.json and that the monorepo structure is recognized.

### API Cannot Connect to Database

Verify the DATABASE_URL is correct and that the database allows connections from your API hosting provider's IP ranges.

### CORS Errors

Ensure CORS_ORIGIN in your API matches your Vercel domain exactly (including https://).

## Cost Estimate

- **Vercel**: Free tier (hobbyist projects)
- **Render API**: $7/month (Starter)
- **Neon Database**: Free tier (up to 10GB)

**Total**: ~$7/month for production deployment

## Scaling

As your usage grows:
- Upgrade Render to Standard ($25/month) for better performance
- Upgrade Neon to Pro ($19/month) for higher limits
- Add Redis for caching (Upstash free tier)
- Consider moving API to a dedicated server or container platform
