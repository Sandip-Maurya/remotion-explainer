// src/components/captions/EditorialCallout.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface EditorialCalloutProps {
  text: string;
  subtext?: string;
  startFrame: number;
  durationFrames?: number;
  position?: 'top' | 'center' | 'bottom';
  accentColor?: string;
  badgeTag?: string;
}

/**
 * Editorial Keyword Punchout component.
 * Replaces permanent bottom subtitles with dynamic, contextual shock-word stamps.
 * Punches in with high velocity, holds for 1.2-1.8s, and fades out cleanly.
 */
export const EditorialCallout: React.FC<EditorialCalloutProps> = ({
  text,
  subtext,
  startFrame,
  durationFrames = 48,
  position = 'bottom',
  accentColor = THEME.colors.accentAmber,
  badgeTag,
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
  const positionStyle: React.CSSProperties =
    position === 'top'
      ? { top: 220 }
      : position === 'center'
      ? { top: '50%', transform: `translateY(-50%) translateY(${translateY}px)` }
      : { bottom: 350 };

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        ...positionStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity: finalOpacity,
        transform: position !== 'center' ? `translateY(${translateY}px) scale(${entrance})` : undefined,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          padding: '16px 28px',
          borderRadius: 20,
          backgroundColor: 'rgba(7, 10, 19, 0.92)',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 12px 35px rgba(0,0,0,0.8), 0 0 25px ${accentColor}40`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {badgeTag && (
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 2,
              color: accentColor,
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            {badgeTag}
          </span>
        )}

        <div
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: 32,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: -0.5,
            textShadow: `0 0 20px ${accentColor}80`,
            textTransform: 'uppercase',
          }}
        >
          {text}
        </div>

        {subtext && (
          <div
            style={{
              fontFamily: THEME.fonts.body,
              fontSize: 18,
              color: '#cbd5e1',
              fontWeight: 500,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
