// src/components/core/ProgressBar.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface ProgressBarProps {
  /** Height in pixels of the progress bar (default: 8px) */
  height?: number;
  /** Custom fill color */
  color?: string;
  /** Whether to render a bright glow on the leading edge */
  glow?: boolean;
}

/**
 * Top-of-screen viewer retention progress bar.
 * Visually communicates video completion progress to maximize viewer watch time.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  height = 8,
  color = THEME.colors.accentBlue,
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const widthPercent = `${progress * 100}%`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: widthPercent,
          height: '100%',
          backgroundColor: color,
          position: 'relative',
          boxShadow: glow ? `0 0 15px ${color}` : 'none',
        }}
      >
        {glow && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: height * 2.5,
              height: height * 2.5,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: `0 0 16px ${color}, 0 0 8px #ffffff`,
            }}
          />
        )}
      </div>
    </div>
  );
};
