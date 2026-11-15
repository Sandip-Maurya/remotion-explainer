// src/components/motion/CameraDrift.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface CameraDriftProps {
  children: React.ReactNode;
  durationInFrames?: number;
  scaleFrom?: number;
  scaleTo?: number;
  origin?: string;
  enablePan?: boolean;
  panX?: number;
  panY?: number;
}

/**
 * Continuous cinematic camera drift (Ken Burns effect).
 * Eliminates visual static freezes across scene sequences by maintaining
 * subtle forward or panning momentum.
 */
export const CameraDrift: React.FC<CameraDriftProps> = ({
  children,
  durationInFrames,
  scaleFrom = 1.0,
  scaleTo = 1.045,
  origin = 'center center',
  enablePan = false,
  panX = 0,
  panY = 12,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: totalDuration } = useVideoConfig();

  const activeDuration = durationInFrames ?? totalDuration;

  const currentScale = interpolate(
    frame,
    [0, activeDuration],
    [scaleFrom, scaleTo],
    { extrapolateRight: 'clamp' }
  );

  const currentPanX = enablePan
    ? interpolate(frame, [0, activeDuration], [0, panX], { extrapolateRight: 'clamp' })
    : 0;

  const currentPanY = enablePan
    ? interpolate(frame, [0, activeDuration], [0, panY], { extrapolateRight: 'clamp' })
    : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${currentScale}) translate(${currentPanX}px, ${currentPanY}px)`,
        transformOrigin: origin,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
