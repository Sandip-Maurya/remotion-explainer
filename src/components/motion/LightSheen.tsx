// src/components/motion/LightSheen.tsx
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface LightSheenProps {
  intervalFrames?: number;
  durationFrames?: number;
  delayFrames?: number;
  opacity?: number;
  color?: string;
  widthPercent?: number;
}

/**
 * Specular diagonal light sheen sweep.
 * Creates the high-end Apple / Vox glass reflection that sweeps
 * across cards periodically. Parent MUST have position: relative and overflow: hidden.
 */
export const LightSheen: React.FC<LightSheenProps> = ({
  intervalFrames = 90,
  durationFrames = 26,
  delayFrames = 15,
  opacity = 0.18,
  color = '#ffffff',
  widthPercent = 45,
}) => {
  const frame = useCurrentFrame();

  if (frame < delayFrames) return null;

  const activeFrame = (frame - delayFrames) % intervalFrames;

  if (activeFrame > durationFrames) return null;

  const positionPercent = interpolate(
    activeFrame,
    [0, durationFrames],
    [-100, 200],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: -100,
        bottom: -100,
        left: `${positionPercent}%`,
        width: `${widthPercent}%`,
        background: `linear-gradient(115deg, transparent, ${color}, transparent)`,
        opacity,
        transform: 'skewX(-20deg)',
        pointerEvents: 'none',
        zIndex: 5,
        filter: 'blur(8px)',
      }}
    />
  );
};
