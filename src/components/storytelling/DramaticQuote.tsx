// src/components/storytelling/DramaticQuote.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface DramaticQuoteProps {
  /** The setup or initial statement (e.g. "Inflation isn't prices rising.") */
  headline: string;
  /** The core paradigm shift punchline (e.g. "It is your life energy being quietly diluted.") */
  punchline: string;
  /** Frame offset at which the headline appears */
  startFrame?: number;
  /** Delay in frames between headline and punchline (the dramatic pause) */
  pauseFrames?: number;
}

/**
 * Dramatic epiphany component designed for Beat 4 (Climax).
 * Features a spotlight illumination effect, high-contrast typography,
 * and deliberate staggered timing to maximize emotional impact.
 */
export const DramaticQuote: React.FC<DramaticQuoteProps> = ({
  headline,
  punchline,
  startFrame = 0,
  pauseFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline entrance
  const headlineSpring = spring({
    frame: frame - startFrame,
    fps,
    config: THEME.springs.smooth,
  });

  // Punchline entrance after the dramatic pause
  const punchlineSpring = spring({
    frame: frame - startFrame - pauseFrames,
    fps,
    config: THEME.springs.snappy,
  });

  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);
  const headlineY = interpolate(headlineSpring, [0, 1], [20, 0]);

  const punchlineOpacity = interpolate(punchlineSpring, [0, 1], [0, 1]);
  const punchlineScale = interpolate(punchlineSpring, [0, 1], [0.88, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 820,
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Background Spotlight Glow on Punchline */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(7, 10, 19, 0) 70%)',
          opacity: punchlineOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Headline (Premise / Setup) */}
      <span
        style={{
          fontFamily: THEME.fonts.body,
          fontSize: THEME.fontSizes.h3,
          fontWeight: 600,
          color: THEME.colors.textMuted,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          marginBottom: 24,
          lineHeight: 1.3,
        }}
      >
        {headline}
      </span>

      {/* Decorative Golden Divider */}
      <div
        style={{
          width: 120,
          height: 3,
          backgroundColor: THEME.colors.accentGold,
          borderRadius: 2,
          opacity: punchlineOpacity,
          boxShadow: '0 0 15px rgba(251, 191, 36, 0.6)',
          marginBottom: 32,
        }}
      />

      {/* Punchline (The Core Revelation) */}
      <h2
        style={{
          fontFamily: THEME.fonts.heading,
          fontSize: THEME.fontSizes.h1,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: 0,
          opacity: punchlineOpacity,
          transform: `scale(${punchlineScale})`,
          textShadow: '0 0 45px rgba(255, 255, 255, 0.4), 0 0 20px rgba(251, 191, 36, 0.3)',
        }}
      >
        {punchline}
      </h2>
    </div>
  );
};
