# Vercel Deployment Guide

## ✅ Your Project is Ready for Vercel!

### 📋 Pre-Deployment Checklist
- ✅ Frontend: React + Vite configured
- ✅ Backend: Node.js + Fastify with serverless setup
- ✅ Database: PostgreSQL-ready Prisma schema
- ✅ Environment: Production configuration
- ✅ Build scripts: Optimized for Vercel

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: Chatbot platform ready for deployment"

# Push to GitHub
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Set Up Database (Vercel Postgres)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Choose "Postgres" 
4. Name it: `chatbot-platform-db`
5. Copy the `DATABASE_URL` from the connection details

### 3. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project? N
# - What's your project's name? chatbot-platform
# - In which directory is your code located? ./
# - Want to override settings? Y
# - Build Command: cd frontend && npm run build
# - Output Directory: frontend/dist
# - Development Command: npm run dev
```

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

### 4. Configure Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your Vercel Postgres URL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Strong random string | `your-super-secret-jwt-key-256-bit` |
| `GEMINI_API_KEY` | Your Google Gemini key | `AIzaSyBkDmbTzos2Z1ebpaDFM_1eC_WaMFzJXFU` |
| `AI_PROVIDER` | `gemini` | `gemini` |
| `NODE_ENV` | `production` | `production` |

### 5. Deploy Database Schema
```bash
# After first deployment, run migrations
npx vercel env pull .env.local  # Downloads env vars locally
cd backend
DATABASE_URL="your-vercel-postgres-url" npx prisma migrate deploy
```

### 6. Test Your Deployment
1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Register a new account
3. Create a chatbot project
4. Test the chat functionality

## 🔧 Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# If build fails, check logs and try:
cd frontend && npm run build
cd backend && npm run vercel-build
```

**Database Connection:**
- Ensure `DATABASE_URL` is correctly set in Vercel environment variables
- Check that Vercel Postgres is in the same region

**API Routes Not Working:**
- Verify `vercel.json` is in the project root
- Check that environment variables are set

**CORS Issues:**
- Frontend URL should match your Vercel domain
- Update CORS settings if needed

## 📱 Production Features
- ✅ Frontend: React SPA with routing
- ✅ Backend: Serverless API functions  
- ✅ Database: PostgreSQL with Prisma
- ✅ Authentication: JWT tokens
- ✅ AI: Google Gemini integration
- ✅ File uploads: Ready for implementation
- ✅ Real-time chat: Working

## 🎯 Post-Deployment
1. **Custom Domain**: Add your domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics
3. **Monitoring**: Set up error tracking
4. **Backup**: Regular database backups
5. **Security**: Review JWT secrets and API keys

Your chatbot platform is now ready for production! 🚀
