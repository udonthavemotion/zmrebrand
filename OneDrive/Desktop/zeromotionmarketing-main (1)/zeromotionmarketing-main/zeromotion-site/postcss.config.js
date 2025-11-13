import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import purgecss from '@fullhuman/postcss-purgecss';
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';

export default {
  plugins: [
    postcssImport(),
    postcssNesting(),
    autoprefixer(),
    
    // PurgeCSS temporarily disabled for build compatibility
    // TODO: Re-enable PurgeCSS with proper configuration
    
    // Minify CSS in production
    ...(process.env.NODE_ENV === 'production' ? [
      cssnano({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // Preserve important browser hacks and vendor prefixes
          autoprefixer: false,
          // Optimize custom properties
          customProperties: false,
          // Preserve CSS calc() functions
          calc: false,
          // Don't remove unused keyframes (they might be used by JS)
          discardUnused: false,
          // Preserve font-display values
          minifyFontValues: false,
          // Don't merge media queries (can break responsive design)
          mergeMediaQueries: false,
          // Preserve z-index values (important for layering)
          zindex: false
        }]
      })
    ] : [])
  ]
};
