// src/components/motion/CameraMicroBump.tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CameraMicroBumpProps {
  children: React.ReactNode;
  triggerFrame?: number;
  intensity?: number;
  durationFrames?: number;
}

/**
 * Rapid damped camera micro-bump.
 * Simulates physical impact and inertia when massive numbers or punches drop.
 */
export const CameraMicroBump: React.FC<CameraMicroBumpProps> = ({
  children,
  triggerFrame = 0,
  intensity = 5,
  durationFrames = 8,
}) => {
  const frame = useCurrentFrame();

  const elapsed = frame - triggerFrame;

  let dx = 0;
  let dy = 0;

  if (elapsed >= 0 && elapsed <= durationFrames) {
    const decay = Math.exp(-elapsed * 0.45);
    dx = Math.sin(elapsed * Math.PI * 2.2) * intensity * decay;
    dy = Math.cos(elapsed * Math.PI * 1.8) * (intensity * 0.7) * decay;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: elapsed >= 0 && elapsed <= durationFrames ? `translate(${dx}px, ${dy}px)` : undefined,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
