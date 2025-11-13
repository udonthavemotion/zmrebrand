#!/bin/bash
# ZeroMotion Marketing - Pre-Deployment Verification Script
# Run this before EVERY production push to prevent build failures

set -e  # Exit on any error

echo "🔍 ZeroMotion Pre-Deployment Verification"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any checks fail
FAILED=0

# Check critical files
echo "📁 Checking critical files..."
FILES=(
  "package.json"
  "astro.config.mjs"
  "tsconfig.json"
  "vercel.json"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file exists${NC}"
  else
    echo -e "${RED}❌ ERROR: $file is MISSING${NC}"
    FAILED=1
  fi
done

echo ""

# Check essential directories
echo "📂 Checking essential directories..."
DIRS=(
  "src"
  "src/pages"
  "src/components"
  "src/layouts"
  "src/styles"
  "public"
)

for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    FILE_COUNT=$(find "$dir" -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ $dir/ exists ($FILE_COUNT files)${NC}"
  else
    echo -e "${RED}❌ ERROR: $dir/ is MISSING${NC}"
    FAILED=1
  fi
done

echo ""

# Check for common issues
echo "🔍 Checking for common issues..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ node_modules/ exists${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: node_modules/ not found. Running npm install...${NC}"
  npm install
fi

# Check vercel.json configuration
if [ -f "vercel.json" ]; then
  if grep -q '"outputDirectory"' vercel.json; then
    echo -e "${GREEN}✅ vercel.json has outputDirectory configured${NC}"
  else
    echo -e "${YELLOW}⚠️  WARNING: vercel.json missing outputDirectory${NC}"
  fi
fi

echo ""

# Test build
echo "🔨 Testing production build..."
if npm run build > /tmp/build.log 2>&1; then
  echo -e "${GREEN}✅ Build successful${NC}"
  
  # Check if dist directory was created
  if [ -d "dist" ]; then
    DIST_FILES=$(find dist -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ dist/ directory created ($DIST_FILES files)${NC}"
  else
    echo -e "${RED}❌ ERROR: dist/ directory not created after build${NC}"
    FAILED=1
  fi
else
  echo -e "${RED}❌ ERROR: Build failed${NC}"
  echo "Build log:"
  cat /tmp/build.log
  FAILED=1
fi

echo ""
echo "=========================================="

# Final result
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED - SAFE TO DEPLOY!${NC}"
  echo ""
  echo "Next steps:"
  echo "  git push origin main"
  exit 0
else
  echo -e "${RED}❌ DEPLOYMENT VERIFICATION FAILED${NC}"
  echo ""
  echo "DO NOT PUSH TO PRODUCTION"
  echo "Fix the errors above before deploying."
  exit 1
fi

