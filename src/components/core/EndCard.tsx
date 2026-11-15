// src/components/core/EndCard.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface EndCardProps {
  /** The core takeaway or moral of the video */
  coreLesson: string;
  /** Follow or subscribe call-to-action text */
  callToAction: string;
  /** Final phrase bridging into the first sentence of the video */
  loopBridge?: string;
  /** Frame offset at which the end card enters */
  startFrame?: number;
}

/**
 * High-conversion End Card component designed for YouTube Shorts loops.
 * Presents the core takeaway, channel CTA, and seamless loop bridge.
 */
export const EndCard: React.FC<EndCardProps> = ({
  coreLesson,
  callToAction,
  loopBridge,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEntrance = spring({
    frame: frame - startFrame,
    fps,
    config: THEME.springs.smooth,
  });

  const ctaEntrance = spring({
    frame: frame - startFrame - 10,
    fps,
    config: THEME.springs.snappy,
  });

  // Looping pulse for the seamless loop indicator
  const pulse = Math.sin(frame / 6) * 0.05 + 1;

  const cardY = interpolate(cardEntrance, [0, 1], [40, 0]);
  const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: 820,
        padding: '48px 36px',
        backgroundColor: THEME.colors.surfaceCard,
        borderRadius: 32,
        border: `2px solid ${THEME.colors.borderGlowEmerald}`,
        boxShadow: THEME.shadows.glowEmerald,
        transform: `translateY(${cardY}px)`,
        opacity: cardOpacity,
      }}
    >
      {/* Category Pill */}
      <span
        style={{
          fontFamily: THEME.fonts.heading,
          fontSize: 22,
          fontWeight: 800,
          color: THEME.colors.accentEmerald,
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          padding: '8px 24px',
          borderRadius: 999,
          marginBottom: 20,
        }}
      >
        Core Takeaway
      </span>

      {/* Core Lesson */}
      <h2
        style={{
          fontFamily: THEME.fonts.heading,
          fontSize: THEME.fontSizes.h2,
          fontWeight: 900,
          color: THEME.colors.textWhite,
          lineHeight: 1.25,
          margin: 0,
          maxWidth: 720,
        }}
      >
        {coreLesson}
      </h2>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 36,
          backgroundColor: THEME.colors.accentEmerald,
          color: '#070a13',
          fontFamily: THEME.fonts.heading,
          fontSize: 32,
          fontWeight: 900,
          padding: '18px 44px',
          borderRadius: 999,
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
          transform: `scale(${interpolate(ctaEntrance, [0, 1], [0.85, 1])})`,
          opacity: interpolate(ctaEntrance, [0, 1], [0, 1]),
          letterSpacing: '-0.01em',
        }}
      >
        {callToAction}
      </div>

      {/* Seamless Loop Bridge */}
      {loopBridge && (
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: '#cbd5e1',
            fontFamily: THEME.fonts.body,
            fontSize: 26,
            fontWeight: 600,
            transform: `scale(${pulse})`,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>{loopBridge}</span>
        </div>
      )}
    </div>
  );
};
