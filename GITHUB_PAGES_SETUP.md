# GitHub Pages Deployment Setup

## Quick Start

Your Weather Compare app is now configured for GitHub Pages with automatic deployment via GitHub Actions.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Weather Compare app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weather-compare.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Settings → Pages**
3. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` / `/ (root)`

The workflow automatically creates and deploys to the `gh-pages` branch.

### Step 3: Add Custom Domain (Optional)

#### Option A: Using a Custom Domain

1. Edit `public/CNAME` and replace `weather.example.com` with your domain:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS records to point to GitHub Pages:
   - **For HTTPS (Recommended):**
     - Add CNAME record: `yourdomain.com` → `YOUR_USERNAME.github.io`
     - OR add A records pointing to GitHub's IP addresses (see GitHub docs)

3. Push the change:
   ```bash
   git add public/CNAME
   git commit -m "Add custom domain"
   git push
   ```

4. GitHub will automatically detect the CNAME file and configure SSL/HTTPS

#### Option B: Using GitHub Pages Domain

If you don't have a custom domain, your site will be available at:
- `https://YOUR_USERNAME.github.io/weather-compare/` (for a regular repo)
- `https://YOUR_USERNAME.github.io/` (if the repo is named `YOUR_USERNAME.github.io`)

## How the Pipeline Works

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file automatically:

1. **Triggers on:** Push to `main` or `master` branch (or PR for testing)
2. **Builds:** Runs `npm run build` to create static export in `out/` directory
3. **Deploys:** Uploads to GitHub Pages via the `gh-pages` branch
4. **Goes Live:** Available at your GitHub Pages URL within seconds

### Deployment Process

```
You make changes locally
        ↓
git push to main branch
        ↓
GitHub Actions triggers automatically
        ↓
Installs dependencies (npm ci)
        ↓
Builds the app (npm run build)
        ↓
Exports to static HTML/CSS/JS (out/)
        ↓
Deploys to gh-pages branch
        ↓
Live on GitHub Pages!
```

## Edit & Publish Workflow

### Simple Workflow with Claude Code:

1. **Make changes locally** with Claude Code:
   ```bash
   # You and Claude edit files together
   # Test on localhost:3000
   ```

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Feature: Add X"
   git push
   ```

3. **Auto-deployed**: GitHub Actions runs automatically, your changes are live in ~30 seconds

### View Deployment Status

- **Actions tab:** https://github.com/YOUR_USERNAME/weather-compare/actions
  - Shows build logs, deployment status, any errors

## Configuration Files

### `.github/workflows/deploy.yml`
- Defines the CI/CD pipeline
- Automatically triggers on push to main
- Handles build and deployment

### `next.config.js`
- Added `output: 'export'` to enable static export
- Required for GitHub Pages (no Node.js server needed)

### `public/CNAME`
- Tells GitHub which custom domain to use
- Auto-generates HTTPS certificate

## Troubleshooting

### Build fails
- Check GitHub Actions logs in the Actions tab
- Common issues: Missing environment variables, Node version mismatch

### Site not updating
- Push took longer than expected (check Actions tab)
- Browser cache: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- CNAME issue: Make sure `public/CNAME` exists and has correct domain

### Custom domain not working
- Wait up to 24 hours for DNS propagation
- Verify DNS records are set correctly
- Check that CNAME file exists in repo

### 404 errors after deployment
- This is normal for routes - GitHub Pages needs `.nojekyll` file (already handled by Next.js export)

## Advanced: Manual Deploy

If you want to deploy without GitHub Actions:

```bash
npm run build
npm install -g gh-pages
gh-pages -d out
```

## Environment Variables

If you need environment variables for your API keys:

1. Create `.env.local` (never commit this)
2. For production, add secrets in GitHub Actions:
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add your API key

3. Update workflow to use the secret:
   ```yaml
   - name: Build
     run: npm run build
     env:
       ACCUWEATHER_API_KEY: ${{ secrets.ACCUWEATHER_API_KEY }}
   ```

## Domain Registration Tips

Recommended registrars: Namecheap, GoDaddy, Google Domains

1. Register your domain
2. Update DNS to point to GitHub Pages
3. Create `public/CNAME` with your domain
4. GitHub automatically generates HTTPS certificate (may take a few minutes)

## Next Steps

1. Create GitHub repo
2. Push your code
3. Enable GitHub Pages in settings
4. (Optional) Add custom domain
5. Start editing and pushing - auto-deploy takes care of the rest!

---

**Happy deploying! 🚀**
