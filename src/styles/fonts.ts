// src/styles/fonts.ts
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

/**
 * Initializes and preloads authoritative Google Fonts for Remotion.
 * Scoped to 'latin' subset and essential weights for ultra-fast headless rendering.
 */
export const initFonts = () => {
  const { fontFamily: montserrat } = loadMontserrat('normal', {
    weights: ['700', '900'],
    subsets: ['latin'],
    ignoreTooManyRequestsWarning: true,
  });

  const { fontFamily: inter } = loadInter('normal', {
    weights: ['400', '600', '700'],
    subsets: ['latin'],
    ignoreTooManyRequestsWarning: true,
  });

  const { fontFamily: jetbrainsMono } = loadJetBrainsMono('normal', {
    weights: ['700'],
    subsets: ['latin'],
    ignoreTooManyRequestsWarning: true,
  });

  return {
    montserrat,
    inter,
    jetbrainsMono,
  };
};
