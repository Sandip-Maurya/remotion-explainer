// src/styles/theme.ts

/**
 * Authoritative Design Tokens for the YouTube Shorts Explainer Engine.
 * Tailored strictly for 1080 x 1920 vertical mobile displays.
 */
export const THEME = {
  // Color Palette & Semantic Tokens
  colors: {
    // Mood Backgrounds (for dynamic transitions across beats)
    bgMidnight: '#070a13',   // Beat 1: Hook / Curiosity
    bgCharcoal: '#0b0914',   // Beat 2: Tension / Injustice
    bgSlate: '#0a0e1a',      // Beat 3: Analysis / Mechanism
    bgPitch: '#050508',      // Beat 4: Climax / Sudden Drop
    bgEmerald: '#0a1612',    // Beat 5: Payoff / Resolution

    // Surfaces & Card Materials
    surfaceCard: '#131b2e',
    surfaceCardElevated: '#1a243c',
    surfaceGlass: 'rgba(19, 27, 46, 0.75)',

    // Borders & Dividers
    borderLight: '#1f2d4a',
    borderGlowBlue: 'rgba(56, 189, 248, 0.3)',
    borderGlowAmber: 'rgba(245, 158, 11, 0.3)',
    borderGlowEmerald: 'rgba(16, 185, 129, 0.3)',
    borderGlowRed: 'rgba(239, 68, 68, 0.3)',

    // Primary Accents
    accentBlue: '#38bdf8',     // Electric Sky Blue (Data & Tech)
    accentAmber: '#f59e0b',    // Warning Amber (Caution / Highlight)
    accentRed: '#ef4444',      // Crimson Red (Loss / Threat)
    accentEmerald: '#10b981',  // Vibrant Emerald (Growth / Hope)
    accentGold: '#fbbf24',     // Warm Gold (Value & Epiphany)
    accentPurple: '#a855f7',   // Mystical Purple (Paradox / Secret)

    // Typography Colors
    textWhite: '#ffffff',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    textInverse: '#070a13',
  },

  // Typography Configuration
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Inter, sans-serif',
    numbers: 'JetBrains Mono, monospace',
  },

  // Font Sizes calibrated for 1080 x 1920 mobile viewport
  fontSizes: {
    hero: 72,      // Major 1-2 word hook headlines
    h1: 56,        // Scene titles
    h2: 44,        // Card headers / Big callouts
    h3: 36,        // Subheaders
    bodyLg: 28,    // Primary narrative body text
    body: 24,      // Secondary descriptions
    caption: 20,   // Metadata / Axis labels
  },

  // Layout Dimensions & YouTube Shorts Safe Zones
  dimensions: {
    width: 1080,
    height: 1920,
    fps: 30,

    // Safe Zone Cutouts (Mobile UI Obstructions)
    safeZone: {
      top: 180,        // Search bar, camera icon, audio track
      bottom: 320,     // Avatar, title, subscribe pill, scrubber bar
      left: 60,        // Edge curvature / swipe navigation buffer
      right: 140,      // Likes, comments, shares, remix buttons
      width: 880,      // Usable content width (1080 - 140 - 60)
      height: 1420,    // Usable content height (1920 - 180 - 320)
    },

    // Recommended Caption Placement
    captionsRegion: {
      bottom: 350,
      height: 140,
      left: 80,
      right: 140,
    },
  },

  // Physics-based Spring Presets (Remotion SpringConfig)
  springs: {
    // Punchy pop for stats, active subtitles, and title entrances
    snappy: { damping: 14, mass: 0.6, stiffness: 160 },

    // Organic, elegant motion for charts, cards, and scene transitions
    smooth: { damping: 18, mass: 1.0, stiffness: 100 },

    // Dynamic bounce for icons, callout bubbles, and metric badges
    bouncy: { damping: 12, mass: 0.8, stiffness: 140 },

    // Slow, cinematic reveal for background glow and dramatic cards
    gentle: { damping: 22, mass: 1.2, stiffness: 70 },
  },

  // Glow Shadows & Depth Effects
  shadows: {
    glowBlue: '0 0 35px rgba(56, 189, 248, 0.4)',
    glowAmber: '0 0 35px rgba(245, 158, 11, 0.4)',
    glowEmerald: '0 0 35px rgba(16, 185, 129, 0.4)',
    glowRed: '0 0 35px rgba(239, 68, 68, 0.4)',
    card: '0 20px 40px rgba(0, 0, 0, 0.6)',
  },
} as const;

export type ThemeType = typeof THEME;
