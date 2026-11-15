// src/components/storytelling/TensionVignette.tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface TensionVignetteProps {
  /** Maximum darkness intensity (0.0 to 1.0, default: 0.7) */
  intensity?: number;
  /** Whether the vignette gently pulses with a slow tension heartbeat */
  pulse?: boolean;
  /** Custom inner glow or shadow color */
  color?: string;
}

/**
 * Psychological atmosphere primitive that darkens the frame borders
 * and pulsates subtly to induce tension during Beat 2 (Agitation/Stakes).
 */
export const TensionVignette: React.FC<TensionVignetteProps> = ({
  intensity = 0.7,
  pulse = true,
  color = 'rgba(7, 10, 19, 0.85)',
}) => {
  const frame = useCurrentFrame();

  // Subtle sine oscillation simulating a slow heartbeat pulse
  const pulseFactor = pulse ? Math.sin(frame / 12) * 0.08 : 0;
  const currentIntensity = Math.min(1, Math.max(0, intensity + pulseFactor));

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 5,
        background: `radial-gradient(ellipse at center, transparent 45%, ${color} 100%)`,
        opacity: currentIntensity,
      }}
    />
  );
};
