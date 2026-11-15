// src/components/captions/EditorialCallout.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface EditorialCalloutProps {
  text: string;
  subtext?: string;
  startFrame?: number;
  durationFrames?: number;
  position?: 'top' | 'center' | 'bottom';
  accentColor?: string;
  badgeTag?: string;
  inFlow?: boolean;
}

/**
 * Editorial Keyword Punchout component.
 * Replaces permanent bottom subtitles with dynamic, contextual shock-word stamps.
 * Punches in with high velocity, holds for 1.2-1.8s (or scene duration), and fades out cleanly.
 */
export const EditorialCallout: React.FC<EditorialCalloutProps> = ({
  text,
  subtext,
  startFrame = 0,
  durationFrames = 48,
  position = 'bottom',
  accentColor = THEME.colors.accentAmber,
  badgeTag,
  inFlow = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame - startFrame;

  // Not yet started or already finished
  if (elapsed < 0 || elapsed > durationFrames) {
    return null;
  }

  // Entrance spring (snappy bounce)
  const entrance = spring({
    frame: elapsed,
    fps,
    config: THEME.springs.snappy,
  });

  // Exit fade out over last 8 frames
  const exitFrames = 8;
  const exitProgress = Math.max(0, elapsed - (durationFrames - exitFrames));
  const exitOpacity = interpolate(exitProgress, [0, exitFrames], [1, 0], {
    extrapolateRight: 'clamp',
  });

  const finalOpacity = entrance * exitOpacity;
  const translateY = interpolate(entrance, [0, 1], [30, 0]);

  // Position alignment
  const positionStyle: React.CSSProperties = inFlow
    ? { position: 'relative' }
    : position === 'top'
    ? { position: 'absolute', top: 220, left: 80, right: 80 }
    : position === 'center'
    ? { position: 'absolute', top: '50%', left: 80, right: 80, transform: `translateY(-50%) translateY(${translateY}px)` }
    : { position: 'absolute', bottom: 350, left: 80, right: 80 };

  return (
    <div
      style={{
        ...positionStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity: finalOpacity,
        transform: !inFlow && position === 'center' ? undefined : `translateY(${translateY}px) scale(${entrance})`,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          padding: '20px 34px',
          borderRadius: 22,
          backgroundColor: 'rgba(7, 10, 19, 0.94)',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 14px 40px rgba(0,0,0,0.85), 0 0 30px ${accentColor}40`,
          backdropFilter: 'blur(14px)',
          maxWidth: THEME.dimensions.standardCardWidth,
        }}
      >
        {badgeTag && (
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              color: accentColor,
              textTransform: 'uppercase',
            }}
          >
            {badgeTag}
          </span>
        )}

        <span
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: 34,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: 0.5,
            lineHeight: 1.2,
          }}
        >
          {text}
        </span>

        {subtext && (
          <span
            style={{
              fontFamily: THEME.fonts.body,
              fontSize: 22,
              fontWeight: 500,
              color: '#cbd5e1',
              marginTop: 4,
            }}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
