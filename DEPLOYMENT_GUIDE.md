# 🚀 Weather Compare - Complete Deployment Guide

## What's Set Up For You

Your app is now ready for:
- ✅ Automatic deployment to GitHub Pages
- ✅ Easy edits with Claude Code → automatic publish
- ✅ Custom domain support (your own domain.com)
- ✅ HTTPS/SSL certificate (automatic)
- ✅ CI/CD pipeline (GitHub Actions)

---

## The Simple 3-Step Process

### 1️⃣ Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Weather Compare"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weather-compare.git
git push -u origin main
```

### 2️⃣ Enable GitHub Pages (Settings)

1. Go: **Repository → Settings → Pages**
2. Select: **Deploy from a branch**
3. Choose: **gh-pages** branch
4. Save ✅

GitHub Actions automatically creates this branch.

### 3️⃣ (Optional) Add Your Domain

**If you have a custom domain:**

1. Edit `public/CNAME`:
   ```
   yourdomain.com
   ```

2. Update your domain's DNS records:
   - CNAME: `yourdomain.com` → `YOUR_USERNAME.github.io`

3. Push:
   ```bash
   git add public/CNAME
   git commit -m "Add custom domain"
   git push
   ```

GitHub automatically handles HTTPS (may take a few minutes).

---

## The Edit & Publish Workflow

### Every Time You Want to Publish Changes:

**Option A: Quick Deploy Script**
```bash
./deploy.sh "Your change description here"
```

**Option B: Manual**
```bash
git add .
git commit -m "Your change description"
git push
```

**What happens automatically:**
1. ✅ GitHub Actions detects push
2. ✅ Builds the app (`npm run build`)
3. ✅ Creates static files (`out/` folder)
4. ✅ Deploys to `gh-pages` branch
5. ✅ Live on your domain within 30 seconds

### View Deployment Status

- **Log in:** GitHub → Repository → Actions tab
- **See:** Build logs, deployment status, timing
- **Debug:** Any errors appear here

---

## Local Testing Before Publishing

Always test locally before pushing:

```bash
npm run dev
# Open http://localhost:3000
# Test your changes
# Then: ./deploy.sh "message" or git push
```

---

## Your URLs After Setup

**Without custom domain (free):**
- `https://YOUR_USERNAME.github.io/weather-compare/`

**With custom domain (from `public/CNAME`):**
- `https://yourdomain.com/`

---

## Configuration Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | CI/CD pipeline - auto-triggers on push |
| `public/CNAME` | Tells GitHub your custom domain |
| `next.config.js` | Updated with `output: 'export'` for static build |
| `deploy.sh` | Quick publish script |

---

## How to Edit with Claude Code & Deploy

### Workflow:

1. **Open Claude Code** in this directory
2. **Make changes** together
3. **Test locally:** `npm run dev`
4. **Commit & Deploy:** `./deploy.sh "Fixed X feature"` or `git push`
5. **Live immediately** ✨

### Example Session:

```bash
# You start Claude Code session
# Claude makes changes to fix a bug
# You test: npm run dev (check localhost:3000)
# You run: ./deploy.sh "Fix AccuWeather temperature display"
# Changes are live in 30 seconds!
```

---

## Updating API Keys Securely

If you have API keys like AccuWeather:

### Development (Local):
- Keep in `.env.local` (already in `.gitignore`)

### Production (GitHub Pages):
1. **GitHub Settings → Secrets and variables → Actions**
2. **New repository secret:**
   - Name: `ACCUWEATHER_API_KEY`
   - Value: `your_key_here`
3. **Update `.github/workflows/deploy.yml`:**
   ```yaml
   - name: Build
     env:
       ACCUWEATHER_API_KEY: ${{ secrets.ACCUWEATHER_API_KEY }}
     run: npm run build
   ```

---

## Troubleshooting

### "Build failed" in GitHub Actions
- Check Actions tab for error logs
- Common fixes:
  - Node version mismatch (we use v18)
  - Missing dependencies: `npm install`
  - API key not set in GitHub secrets

### Site shows 404
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check deployment status in Actions tab

### Custom domain not working
- DNS can take 24 hours to propagate
- Verify CNAME exists: `cat public/CNAME`
- Check GitHub Pages settings have correct branch

### Changes not live
- Verify push succeeded: `git push`
- Check Actions tab - may still be building
- Wait 30 seconds and hard refresh

---

## Domain Registration (If Needed)

Recommended: Namecheap, GoDaddy, Google Domains

**Steps:**
1. Register domain (e.g., `yourdomain.com`)
2. Update DNS CNAME: `yourdomain.com` → `YOUR_USERNAME.github.io`
3. Add to `public/CNAME`
4. Push to GitHub
5. Wait for DNS propagation (usually instant, can be up to 24 hours)

---

## Command Reference

```bash
# Local development
npm run dev              # Start local server (localhost:3000)

# Deploy with script
./deploy.sh "message"   # Add, commit, push all at once

# Manual deploy
git add .               # Stage changes
git commit -m "msg"     # Commit
git push                # Triggers GitHub Actions

# Build locally (if needed)
npm run build           # Creates static export in 'out/' folder

# View deployed site
open https://yourdomain.com  # Or use your GitHub Pages URL
```

---

## File Structure

```
weather-compare/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← CI/CD pipeline
├── pages/
│   ├── index.jsx
│   └── api/
│       └── weather.js
├── components/
├── public/
│   └── CNAME                   ← Your custom domain
├── styles/
├── deploy.sh                   ← Quick deploy script
├── next.config.js              ← Updated for static export
├── package.json
└── GITHUB_PAGES_SETUP.md       ← Full setup guide
```

---

## Quick Reference: Edit → Publish Cycle

```
┌─────────────────────────────────┐
│   Make changes with Claude Code │
│   Test on localhost:3000        │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   ./deploy.sh "description"     │
│   or: git push                  │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   GitHub Actions triggers       │
│   • npm install                 │
│   • npm run build               │
│   • Deploy to gh-pages          │
└────────────┬────────────────────┘
             │
             ↓ (~30 seconds)
┌─────────────────────────────────┐
│   ✨ LIVE ON YOUR DOMAIN ✨     │
│   https://yourdomain.com        │
└─────────────────────────────────┘
```

---

## Need Help?

- **GitHub Pages Docs:** https://pages.github.com/
- **Next.js Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **GitHub Actions:** https://docs.github.com/en/actions

---

## Summary

**You now have:**
- ✅ Automatic deployment pipeline
- ✅ One-command publish workflow
- ✅ Custom domain ready
- ✅ HTTPS included
- ✅ Fast deployment (30 seconds)

**To get started:**
1. Create GitHub repo
2. Push your code
3. Enable GitHub Pages in Settings
4. Start editing & pushing! 🚀

---

**Ready to deploy? Run:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/weather-compare.git
git push -u origin main
```

Then enable GitHub Pages in your repository settings. Done! 🎉
