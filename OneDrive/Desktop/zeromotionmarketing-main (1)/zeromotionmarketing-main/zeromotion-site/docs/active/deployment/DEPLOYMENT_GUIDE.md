# ZeroMotion Marketing - Production Deployment Guide

## 🚨 Critical: Prevent "No Output Directory" Errors

### The Issue (Resolved 2025-10-26)
Vercel failed with: "No Output Directory named 'dist' found after the Build completed."

**Root Cause:** The `main` branch was missing essential build files (`package.json`, `astro.config.mjs`, etc.)

**Resolution:** 
1. Reset `main` branch to match working feature branch
2. Added `vercel.json` configuration
3. Force pushed complete project to main

---

## 📋 Required Files Checklist

Before any production deployment, verify these files exist on `main`:

### Essential Build Files
- ✅ `package.json` - npm dependencies and scripts
- ✅ `package-lock.json` or `pnpm-lock.yaml` - lock file
- ✅ `astro.config.mjs` - Astro configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `vercel.json` - Vercel deployment configuration (NEW)

### Essential Directories
- ✅ `src/` - Source code
- ✅ `public/` - Static assets
- ✅ `src/pages/` - Astro pages
- ✅ `src/components/` - Astro components
- ✅ `src/layouts/` - Layout templates
- ✅ `src/styles/` - CSS files

---

## 🔧 Vercel Configuration

The `vercel.json` file explicitly tells Vercel:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

This prevents ambiguity about:
- Where to find the build output
- What command to run
- What framework is being used

---

## 🚀 Deployment Workflows

### Option 1: Feature Branch → Main (Recommended)

```bash
# 1. Ensure feature branch is working and tested
git checkout feature-name
npm run build  # Verify build works locally

# 2. Switch to main
git checkout main

# 3. Merge or reset (choose one):

# Option A: Merge (preserves history)
git merge feature-name --no-ff

# Option B: Reset (clean slate - use when main is broken)
git reset --hard feature-name

# 4. Verify critical files exist
ls -la package.json astro.config.mjs vercel.json

# 5. Push to production
git push origin main  # or --force if you used reset
```

### Option 2: Direct Feature Branch Deploy

If main is broken, you can deploy directly from feature branch:

```bash
# Push feature branch to main
git push origin feature-name:main --force

# Then update local main
git checkout main
git reset --hard origin/main
```

---

## ⚠️ Warning Signs of Deployment Issues

If you see these, **DO NOT PUSH TO MAIN**:

1. **Missing package.json**
   ```bash
   git checkout main
   test -f package.json || echo "ERROR: Missing package.json"
   ```

2. **Empty src/ directory**
   ```bash
   ls src/ | wc -l  # Should show > 10 files
   ```

3. **No astro.config.mjs**
   ```bash
   test -f astro.config.mjs || echo "ERROR: Missing astro config"
   ```

4. **Build fails locally**
   ```bash
   npm run build  # Must succeed before pushing
   ```

---

## ✅ Pre-Deployment Verification Script

Run this before EVERY production push:

```bash
#!/bin/bash
echo "🔍 Verifying deployment readiness..."

# Check critical files
FILES=(
  "package.json"
  "astro.config.mjs"
  "tsconfig.json"
  "vercel.json"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ ERROR: $file is MISSING"
    exit 1
  fi
done

# Check directories
DIRS=("src" "public")
for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "✅ $dir/ exists"
  else
    echo "❌ ERROR: $dir/ is MISSING"
    exit 1
  fi
done

# Test build
echo "🔨 Testing build..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ ERROR: Build failed"
  exit 1
fi

echo "✅ All checks passed - safe to deploy!"
```

Save as `scripts/verify-deployment.sh` and run before pushing:

```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh && git push origin main
```

---

## 🔄 Recovery from Failed Deployment

If Vercel deployment fails:

1. **Check Vercel Build Logs**
   - Go to Vercel dashboard
   - Click failed deployment
   - Read error message

2. **Common Errors & Fixes**

   **"No Output Directory"**
   ```bash
   # Main branch is missing files
   git checkout main
   git reset --hard feature/working-branch
   git push origin main --force
   ```

   **"Module not found"**
   ```bash
   # Missing dependencies
   npm install
   git add package-lock.json
   git commit -m "fix: update dependencies"
   git push origin main
   ```

   **"Build failed"**
   ```bash
   # Test locally first
   npm run build
   # Fix errors, then push
   ```

3. **Nuclear Option (Last Resort)**
   ```bash
   # Re-deploy from last known working commit
   git checkout main
   git reset --hard <WORKING_COMMIT_SHA>
   git push origin main --force
   ```

---

## 📊 Monitoring Deployments

After pushing to `main`:

1. **Watch Vercel Dashboard**
   - Deployment should start within 30 seconds
   - Build takes 2-4 minutes typically

2. **Verify Production**
   - Visit your production URL
   - Check: Header spacing fixed
   - Check: Mobile menu gradient purple
   - Check: Booking modal works

3. **Monitor Errors**
   - Check Vercel logs for runtime errors
   - Monitor Sentry for client-side errors

---

## 🎯 Best Practices

### DO:
- ✅ Always test `npm run build` locally before pushing
- ✅ Keep `vercel.json` in repository
- ✅ Use feature branches for development
- ✅ Verify main branch has all files before deploying
- ✅ Document any deployment issues

### DON'T:
- ❌ Push to main without testing
- ❌ Delete `vercel.json` or `package.json`
- ❌ Force push without verification
- ❌ Deploy during high-traffic times
- ❌ Ignore build warnings

---

## 📝 Deployment Checklist

Before EVERY production deployment:

- [ ] Code changes tested locally
- [ ] `npm run build` succeeds
- [ ] All critical files present (package.json, astro.config.mjs, etc.)
- [ ] vercel.json exists and is correct
- [ ] No linting errors
- [ ] Feature branch up to date
- [ ] Commit messages are clear
- [ ] Team notified (if applicable)

---

## 🆘 Emergency Contacts

If deployment fails and you need help:
1. Check this guide first
2. Review Vercel build logs
3. Test build locally
4. Check git branch status
5. Rollback if necessary

---

**Last Updated:** October 26, 2025  
**Status:** Production configuration stabilized  
**Next Review:** Before major feature deployments

