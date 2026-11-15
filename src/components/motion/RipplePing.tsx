// src/components/motion/RipplePing.tsx
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface RipplePingProps {
  cx: number;
  cy: number;
  color?: string;
  maxRadius?: number;
  cycleFrames?: number;
  strokeWidth?: number;
}

/**
 * SVG Concentric ripple ping.
 * Draws the viewer's eye to active data vertices or focal points.
 * Must be rendered inside an <svg> element.
 */
export const RipplePing: React.FC<RipplePingProps> = ({
  cx,
  cy,
  color = '#38bdf8',
  maxRadius = 26,
  cycleFrames = 45,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();

  const cycle = (frame % cycleFrames) / cycleFrames;

  const radius = interpolate(cycle, [0, 1], [4, maxRadius]);
  const opacity = interpolate(cycle, [0, 0.7, 1], [0.8, 0.4, 0]);

  // Second offset ripple (halfway through cycle)
  const cycle2 = ((frame + Math.round(cycleFrames / 2)) % cycleFrames) / cycleFrames;
  const radius2 = interpolate(cycle2, [0, 1], [4, maxRadius]);
  const opacity2 = interpolate(cycle2, [0, 0.7, 1], [0.8, 0.4, 0]);

  return (
    <g pointerEvents="none">
      {/* Outer Ripple 1 */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      {/* Outer Ripple 2 */}
      <circle
        cx={cx}
        cy={cy}
        r={radius2}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity2}
      />
      {/* Center Beacon Solid Dot */}
      <circle cx={cx} cy={cy} r={5} fill="#ffffff" />
      <circle cx={cx} cy={cy} r={3} fill={color} />
    </g>
  );
};
