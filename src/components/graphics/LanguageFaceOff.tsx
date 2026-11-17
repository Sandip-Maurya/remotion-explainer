// src/components/graphics/LanguageFaceOff.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface LanguageFaceOffProps {
  leftLabel?: string;
  rightLabel?: string;
  centerBadge?: string;
  width?: number;
  leftColor?: string;
  rightColor?: string;
}

/**
 * Hook visual: PYTHON vs JAVASCRIPT split face-off with animated VS badge.
 */
export const LanguageFaceOff: React.FC<LanguageFaceOffProps> = ({
  leftLabel = 'PYTHON',
  rightLabel = 'JAVASCRIPT',
  centerBadge = 'VS',
  width = THEME.dimensions.standardCardWidth,
  leftColor = THEME.colors.accentBlue,
  rightColor = THEME.colors.accentAmber,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const left = spring({ frame, fps, config: THEME.springs.bouncy });
  const badge = spring({ frame: frame - 8, fps, config: THEME.springs.snappy });
  const right = spring({ frame: frame - 14, fps, config: THEME.springs.bouncy });

  const panel = (
    label: string,
    color: string,
    progress: number,
    fromX: number,
  ) => (
    <div
      style={{
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        border: `2px solid ${color}66`,
        borderRadius: 22,
        padding: '36px 18px',
        textAlign: 'center',
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [fromX, 0])}px) scale(${interpolate(progress, [0, 1], [0.92, 1])})`,
        boxShadow: `0 14px 36px rgba(0,0,0,0.45), 0 0 28px ${color}25`,
      }}
    >
      <div
        style={{
          fontFamily: THEME.fonts.heading,
          fontSize: label.length > 8 ? 36 : 42,
          fontWeight: 900,
          color,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
      }}
    >
      {panel(leftLabel, leftColor, left, -40)}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(badge, [0, 1], [0.5, 1])})`,
          opacity: badge,
          zIndex: 2,
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: THEME.colors.bgPitch,
          border: `2px solid ${THEME.colors.accentRed}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: THEME.fonts.heading,
          fontSize: 22,
          fontWeight: 900,
          color: THEME.colors.textWhite,
          boxShadow: '0 0 24px rgba(239,68,68,0.45)',
        }}
      >
        {centerBadge}
      </div>
      {panel(rightLabel, rightColor, right, 40)}
    </div>
  );
};
