#!/usr/bin/env node

/**
 * Image Optimization Script for ZeroMotion Marketing Site
 * 
 * Converts all PNGs and JPGs to modern formats (WebP + AVIF)
 * Generates responsive sizes for performance optimization
 * Maintains originals as fallbacks
 * 
 * Usage: node scripts/optimize-images.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// Configuration
const CONFIG = {
  webp: {
    quality: 90,
    effort: 6, // 0-6, higher = smaller file but slower
  },
  avif: {
    quality: 85,
    effort: 5, // 0-9, higher = smaller file but slower
  },
  responsiveSizes: [320, 640, 1024, 1920],
  // Priority images that get AVIF treatment
  criticalImages: [
    'brand/ZeroMotion-Outline.png',
    'brand/ZeroMotion-Layerstyle.png',
    'favico/android-chrome-512x512.png',
    'assets/implementation/brisclothing.png',
    'assets/implementation/godspeedbulldogs.png',
    'assets/implementation/southsidemobile.png',
    'assets/implementation/cursed ink.png',
  ],
};

// Track stats
const stats = {
  processed: 0,
  webpGenerated: 0,
  avifGenerated: 0,
  responsiveGenerated: 0,
  skipped: 0,
  errors: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
};

/**
 * Get file size in bytes
 */
async function getFileSize(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if image is critical (needs AVIF)
 */
function isCriticalImage(relativePath) {
  return CONFIG.criticalImages.some(critical => 
    relativePath.includes(critical.replace(/\\/g, '/'))
  );
}

/**
 * Get all image files recursively
 */
async function getImageFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, dist, optimized
      if (!['node_modules', 'dist', 'optimized', '.git'].includes(entry.name)) {
        files.push(...await getImageFiles(fullPath, baseDir));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        files.push({
          fullPath,
          relativePath: path.relative(baseDir, fullPath),
          ext,
        });
      }
    }
  }

  return files;
}

/**
 * Optimize a single image
 */
async function optimizeImage(imageFile) {
  const { fullPath, relativePath, ext } = imageFile;
  
  try {
    console.log(`\n📸 Processing: ${relativePath}`);
    
    // Get original size
    const originalSize = await getFileSize(fullPath);
    stats.totalOriginalSize += originalSize;
    
    // Load image
    const image = sharp(fullPath);
    const metadata = await image.metadata();
    
    console.log(`   Original: ${metadata.width}x${metadata.height} (${formatBytes(originalSize)})`);
    
    // Determine output directory (maintain folder structure)
    const relativeDir = path.dirname(relativePath);
    const outputDir = path.join(OPTIMIZED_DIR, relativeDir);
    await fs.mkdir(outputDir, { recursive: true });
    
    const baseName = path.basename(relativePath, ext);
    const isCritical = isCriticalImage(relativePath);
    
    let optimizedSize = 0;
    
    // 1. Generate WebP (always)
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    await image.clone()
      .webp(CONFIG.webp)
      .toFile(webpPath);
    
    const webpSize = await getFileSize(webpPath);
    optimizedSize += webpSize;
    stats.webpGenerated++;
    console.log(`   ✓ WebP: ${formatBytes(webpSize)} (${Math.round((webpSize / originalSize) * 100)}% of original)`);
    
    // 2. Generate AVIF (for critical images)
    if (isCritical) {
      const avifPath = path.join(outputDir, `${baseName}.avif`);
      await image.clone()
        .avif(CONFIG.avif)
        .toFile(avifPath);
      
      const avifSize = await getFileSize(avifPath);
      optimizedSize += avifSize;
      stats.avifGenerated++;
      console.log(`   ✓ AVIF: ${formatBytes(avifSize)} (${Math.round((avifSize / originalSize) * 100)}% of original) [CRITICAL]`);
    }
    
    // 3. Generate responsive sizes (for large images)
    if (metadata.width > 640) {
      console.log(`   📐 Generating responsive sizes...`);
      
      for (const width of CONFIG.responsiveSizes) {
        if (width < metadata.width) {
          const responsiveWebpPath = path.join(outputDir, `${baseName}-${width}w.webp`);
          await image.clone()
            .resize(width, null, { withoutEnlargement: true })
            .webp(CONFIG.webp)
            .toFile(responsiveWebpPath);
          
          const responsiveSize = await getFileSize(responsiveWebpPath);
          optimizedSize += responsiveSize;
          stats.responsiveGenerated++;
          console.log(`      ${width}w: ${formatBytes(responsiveSize)}`);
        }
      }
    }
    
    stats.totalOptimizedSize += optimizedSize;
    stats.processed++;
    
    const savings = originalSize - optimizedSize;
    const savingsPercent = Math.round((savings / originalSize) * 100);
    console.log(`   💾 Total savings: ${formatBytes(savings)} (${savingsPercent}%)`);
    
  } catch (error) {
    console.error(`   ❌ Error processing ${relativePath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Generate implementation guide
 */
async function generateImplementationGuide() {
  const guide = `# Image Optimization Implementation Guide

## ✅ Optimization Complete

**Stats:**
- Images processed: ${stats.processed}
- WebP generated: ${stats.webpGenerated}
- AVIF generated: ${stats.avifGenerated} (critical images only)
- Responsive sizes: ${stats.responsiveGenerated}
- Skipped: ${stats.skipped}
- Errors: ${stats.errors}

**Size Reduction:**
- Original total: ${formatBytes(stats.totalOriginalSize)}
- Optimized total: ${formatBytes(stats.totalOptimizedSize)}
- **Total savings: ${formatBytes(stats.totalOriginalSize - stats.totalOptimizedSize)} (${Math.round(((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize) * 100)}%)**

---

## 🔧 How to Use Optimized Images

All optimized images are in \`/public/optimized/\` maintaining the same folder structure.

### Option 1: Picture Element (Recommended)

\`\`\`astro
<picture>
  <!-- AVIF for critical images -->
  <source srcset="/optimized/brand/ZeroMotion-Outline.avif" type="image/avif" />
  
  <!-- WebP (always available) -->
  <source srcset="/optimized/brand/ZeroMotion-Outline.webp" type="image/webp" />
  
  <!-- Original fallback -->
  <img 
    src="/brand/ZeroMotion-Outline.png" 
    alt="ZeroMotion Marketing Logo"
    loading="lazy"
    width="200"
    height="80"
  />
</picture>
\`\`\`

### Option 2: Responsive Images with Sizes

\`\`\`astro
<picture>
  <!-- WebP with responsive sizes -->
  <source 
    srcset="
      /optimized/path/image-320w.webp 320w,
      /optimized/path/image-640w.webp 640w,
      /optimized/path/image-1024w.webp 1024w,
      /optimized/path/image-1920w.webp 1920w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    type="image/webp"
  />
  
  <!-- Original fallback -->
  <img 
    src="/path/original-image.jpg" 
    alt="Description"
    loading="lazy"
    width="1920"
    height="1080"
  />
</picture>
\`\`\`

---

## 📝 Next Steps

1. **Update Components:**
   - \`src/components/TransparentLogo.astro\` - Use optimized logo
   - \`src/components/TrustSection.astro\` - Use optimized client logos
   - \`src/components/Footer.astro\` - Use optimized footer logo
   
2. **Critical Images (use AVIF + WebP):**
${CONFIG.criticalImages.map(img => `   - ${img}`).join('\n')}

3. **Test:**
   - Build site: \`npm run build\`
   - Check Network tab for WebP/AVIF loading
   - Run Lighthouse: \`npm run perf:lighthouse\`
   
4. **Deploy:**
   - Commit optimized images
   - Vercel will automatically serve them

---

## 🎯 Expected Performance Improvements

- **Lighthouse Score:** +10-20 points
- **Page Load Time:** -30-50%
- **Bandwidth Usage:** -60-80%
- **LCP (Largest Contentful Paint):** -1-2s

---

Generated: ${new Date().toISOString()}
`;

  const guidePath = path.join(__dirname, '..', 'IMAGE_OPTIMIZATION_GUIDE.md');
  await fs.writeFile(guidePath, guide, 'utf-8');
  console.log(`\n📄 Implementation guide saved: IMAGE_OPTIMIZATION_GUIDE.md`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 ZeroMotion Image Optimization Starting...\n');
  console.log('📁 Scanning for images in:', PUBLIC_DIR);
  
  // Create optimized directory
  await fs.mkdir(OPTIMIZED_DIR, { recursive: true });
  
  // Get all image files
  const imageFiles = await getImageFiles(PUBLIC_DIR);
  console.log(`\n✅ Found ${imageFiles.length} images to optimize\n`);
  
  if (imageFiles.length === 0) {
    console.log('❌ No images found. Check your PUBLIC_DIR path.');
    process.exit(1);
  }
  
  // Process each image
  for (const imageFile of imageFiles) {
    await optimizeImage(imageFile);
  }
  
  // Generate implementation guide
  await generateImplementationGuide();
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ OPTIMIZATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`📦 WebP: ${stats.webpGenerated} files`);
  console.log(`🎯 AVIF: ${stats.avifGenerated} files (critical only)`);
  console.log(`📐 Responsive: ${stats.responsiveGenerated} files`);
  console.log(`⚠️  Errors: ${stats.errors}`);
  console.log(`\n💾 Size reduction: ${formatBytes(stats.totalOriginalSize - stats.totalOptimizedSize)} (${Math.round(((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize) * 100)}%)`);
  console.log(`\n📄 See IMAGE_OPTIMIZATION_GUIDE.md for implementation instructions`);
  console.log('='.repeat(60) + '\n');
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
