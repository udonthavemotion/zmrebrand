// @ts-nocheck
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  // Site URL for SEO and canonical URLs
  site: 'https://www.zeromotionmarketing.com',
  
  // Use server output because the project includes API routes under `src/pages/api/*`.
  // This enables serverless functions on Vercel.
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  }),
  
  // Performance optimizations with asset versioning
  build: {
    // Enable asset inlining for critical resources
    inlineStylesheets: 'auto',
    // Split chunks for better caching
    split: true,
    // Enable asset versioning for cache busting
    rollupOptions: {
      output: {
        // Add content hash to asset filenames for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },

  // Image optimization
  image: {
    domains: ["localhost", "zeromotionmarketing.com"],
    formats: ['webp', 'avif', 'jpeg', 'png'],
    quality: 85,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.zeromotionmarketing.com",
      }
    ]
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Enable advanced minification and tree shaking
      minify: 'esbuild',
      cssMinify: 'esbuild',
      // Enable source maps for debugging (remove in production if needed)
      sourcemap: false,
      // Enable compression
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-animation': ['framer-motion', 'maath'],
            'vendor-ui': ['astro-icon', 'zod']
          },
          // Optimize chunk size
          chunkSizeWarningLimit: 1000
        }
      }
    },
    server: {
      // Disable caching in development
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    // Enable compression
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  },

  integrations: [
    react(),
    // Sentry configuration is now in sentry.client.config.js and sentry.server.config.js
    sentry()
  ],

  // Prefetch configuration
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport'
  },

  // Experimental features removed for compatibility

  // Security and performance headers
  security: {
    checkOrigin: true
  }
});
