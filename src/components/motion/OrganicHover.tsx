// src/components/motion/OrganicHover.tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface OrganicHoverProps {
  children: React.ReactNode;
  amplitude?: number;
  speed?: number;
  phaseOffset?: number;
  enableTilt?: boolean;
  style?: React.CSSProperties;
}

/**
 * Applies subtle organic floating buoyancy to cards and graphics,
 * keeping elements suspended and breathing rather than static.
 */
export const OrganicHover: React.FC<OrganicHoverProps> = ({
  children,
  amplitude = 4.5,
  speed = 0.055,
  phaseOffset = 0,
  enableTilt = false,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const yOffset = Math.sin(frame * speed + phaseOffset) * amplitude;
  const tilt = enableTilt
    ? Math.sin(frame * (speed * 0.6) + phaseOffset) * 0.35
    : 0;

  return (
    <div
      style={{
        ...style,
        transform: `translateY(${yOffset}px) rotate(${tilt}deg)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
