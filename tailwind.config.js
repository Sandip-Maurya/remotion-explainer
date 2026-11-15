/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bgMidnight: '#070a13',
        bgCharcoal: '#0b0914',
        bgSlate: '#0a0e1a',
        bgEmerald: '#0a1612',
        surfaceCard: '#131b2e',
        borderLight: '#1f2d4a',
        accentBlue: '#38bdf8',
        accentAmber: '#f59e0b',
        accentRed: '#ef4444',
        accentEmerald: '#10b981',
        accentGold: '#fbbf24',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      width: {
        'safe-canvas': '880px',
      },
      height: {
        'safe-canvas': '1420px',
      },
    },
  },
  plugins: [],
};
