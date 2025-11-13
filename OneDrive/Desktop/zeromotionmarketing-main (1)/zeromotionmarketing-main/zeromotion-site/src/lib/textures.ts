// Centralized texture video library for alternating backgrounds
export interface TextureVideo {
  path: string;
  name: string;
  opacity?: number;
  brightness?: number; // Optional brightness control (1.0 = normal)
  contrast?: number;   // Optional contrast control (1.0 = normal)
}

// Available texture videos from existing assets - Enhanced for bright, colorful display
export const TEXTURE_VIDEOS: TextureVideo[] = [
  {
    path: "/assets/textures/150253-798222949_small.mp4",
    name: "dots-flow",
    opacity: 0.6, // Increased for more vibrant display
    brightness: 1.1,
    contrast: 1.05
  },
  {
    path: "/assets/textures/36471-410610193_small.mp4",
    name: "geometric-flow",
    opacity: 0.6, // Increased for more vibrant display
    brightness: 1.1,
    contrast: 1.05
  },
  {
    path: "/assets/textures/6962343-hd_1920_1080_25fps.mp4",
    name: "gradient-wave",
    opacity: 0.55, // Increased for more vibrant display
    brightness: 1.15,
    contrast: 1.1
  },
  {
    path: "/assets/textures/9461-219710531_small.mp4",
    name: "subtle-motion",
    opacity: 0.6, // Increased for more vibrant display
    brightness: 1.1,
    contrast: 1.05
  },
  {
    path: "/assets/textures/purpledots.mp4",
    name: "purple-dots",
    opacity: 0.7, // Highest opacity for most colorful texture
    brightness: 1.2,
    contrast: 1.15
  },
  {
    path: "/assets/textures/199285-909903160_small.mp4",
    name: "fluid-motion",
    opacity: 0.65, // Enhanced for smooth animation
    brightness: 1.1,
    contrast: 1.08
  }
];

// Get texture video by index with automatic cycling
export function getAlternatingTexture(index: number): TextureVideo {
  return TEXTURE_VIDEOS[index % TEXTURE_VIDEOS.length];
}

// Get multiple textures for a page (ensures variety)
export function getPageTextures(count: number, startIndex: number = 0): TextureVideo[] {
  const textures: TextureVideo[] = [];
  for (let i = 0; i < count; i++) {
    textures.push(getAlternatingTexture(startIndex + i));
  }
  return textures;
}

// Preload critical textures for performance
export function getPreloadTextures(count: number = 2): string[] {
  return TEXTURE_VIDEOS.slice(0, count).map(texture => texture.path);
}