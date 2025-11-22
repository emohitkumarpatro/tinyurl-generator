# TinyLink Deployment Guide

This guide walks you through deploying TinyLink to production using Neon (PostgreSQL), Railway/Render (backend), and Vercel (frontend).

## 📊 Database Setup (Neon)

### 1. Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Create Database
1. In your Neon project, create a new database called `tinylink`
2. Copy the connection string (it looks like: `postgresql://user:pass@host/dbname`)
3. Save this for later use

### 3. Run Database Schema
1. In the Neon SQL Editor, run the contents of `backend/db/schema.sql`:

\`\`\`sql
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_code ON links(code);
\`\`\`

## 🚂 Backend Deployment (Railway)

### Option 1: Railway

1. **Create Account**
   - Go to [https://railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the `backend` directory

3. **Configure Environment Variables**
   - In Railway project settings, add:
   \`\`\`
   DATABASE_URL=<your_neon_connection_string>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=<your_vercel_url>
   \`\`\`

4. **Configure Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Deploy**
   - Railway will auto-deploy
   - Copy the deployment URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Account**
   - Go to [https://render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - Name: `tinylink-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Environment Variables**
   - Add in Render dashboard:
   \`\`\`
   DATABASE_URL=<your_neon_connection_string>
   NODE_ENV=production
   FRONTEND_URL=<your_vercel_url>
   \`\`\`

4. **Deploy**
   - Click "Create Web Service"
   - Copy the deployment URL

## 🌐 Frontend Deployment (Vercel)

### 1. Create Vercel Account
- Go to [https://vercel.com](https://vercel.com)
- Sign up with GitHub

### 2. Import Project
- Click "Add New..." → "Project"
- Import your Git repository
- Vercel will detect it's a Vite app

### 3. Configure Project
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Environment Variables
Add in Vercel project settings:
\`\`\`
VITE_API_URL=<your_railway_or_render_backend_url>
\`\`\`

### 5. Deploy
- Click "Deploy"
- Vercel will build and deploy your app
- Copy the production URL (e.g., `https://your-app.vercel.app`)

### 6. Update Backend CORS
- Go back to Railway/Render
- Update `FRONTEND_URL` environment variable with your Vercel URL
- Redeploy backend if needed

## 🔄 Post-Deployment Steps

### 1. Update CORS Settings
Make sure your backend `FRONTEND_URL` matches your Vercel deployment URL.

### 2. Test the Application
- Visit your Vercel URL
- Try creating a shortened URL
- Test the redirect functionality
- Verify click tracking works
- Check the stats page

### 3. Test API Endpoints
\`\`\`bash
# Health check
curl https://your-backend.railway.app/healthz

# Create a link
curl -X POST https://your-backend.railway.app/api/links \\
  -H "Content-Type: application/json" \\
  -d '{"originalUrl": "https://example.com"}'
\`\`\`

## 🛠️ Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if Neon database is active
- Ensure SSL is enabled in production

### CORS Errors
- Verify FRONTEND_URL in backend matches Vercel URL
- Check that both have `https://` (not `http://`)
- Redeploy backend after updating CORS settings

### Build Failures
- Check build logs in Vercel/Railway
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Redirect Not Working
- Ensure backend is deployed and running
- Check that the short code exists in database
- Verify redirect route is properly configured

## 📱 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Railway/Render
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use connection pooling, enable SSL
3. **API**: Consider adding rate limiting for production
4. **CORS**: Only allow specific frontend origin
5. **Input Validation**: Already implemented in the code

## 📊 Monitoring

### Railway
- View logs in the Railway dashboard
- Set up notifications for deployment failures

### Vercel
- Analytics available in Vercel dashboard
- Set up deployment notifications

### Neon
- Monitor database usage and performance
- Set up connection pooling if needed

## 🚀 Continuous Deployment

Both Railway/Render and Vercel support automatic deployments:
- Push to `main` branch → auto-deploy
- Pull requests create preview deployments
- Rollback available if issues occur

## 📝 Quick Deployment Checklist

- [ ] Neon database created and schema applied
- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable (VITE_API_URL) set
- [ ] CORS updated with production frontend URL
- [ ] Application tested end-to-end
- [ ] Short URLs redirect correctly
- [ ] Click tracking verified
- [ ] All API endpoints working

## 💰 Cost Estimation

- **Neon**: Free tier (0.5GB storage, 3GB data transfer)
- **Railway**: $5/month starter (after free trial)
- **Render**: Free tier available (with limitations)
- **Vercel**: Free tier (hobby projects)

**Total**: Can run completely free or ~$5/month for production use

---

## 🆘 Need Help?

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check database connectivity

Happy deploying! 🎉
