// src/components/storytelling/MetaphorIcon.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export type MetaphorType = 'dollar-burn' | 'empty-cart' | 'clock' | 'padlock';

export interface MetaphorIconProps {
  /** The symbolic metaphor type */
  type: MetaphorType;
  /** Size in pixels (default: 200px) */
  size?: number;
  /** Primary accent stroke/fill color */
  color?: string;
  /** Frame offset at which the icon enters */
  startFrame?: number;
}

/**
 * Pure SVG vector storytelling icons representing abstract economic and systemic metaphors.
 * Animated deterministically via Remotion spring physics.
 */
export const MetaphorIcon: React.FC<MetaphorIconProps> = ({
  type,
  size = 200,
  color = THEME.colors.accentBlue,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: THEME.springs.bouncy,
  });

  const scale = interpolate(entrance, [0, 1], [0.7, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Specific animations per icon type
  const renderIcon = () => {
    switch (type) {
      case 'dollar-burn': {
        const flameFlicker = Math.sin(frame / 4) * 4;
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Dollar Note Outline */}
            <rect
              x="12"
              y="28"
              width="76"
              height="44"
              rx="8"
              stroke={color}
              strokeWidth="4"
              fill="rgba(56, 189, 248, 0.08)"
            />
            {/* Dollar Sign */}
            <path
              d="M50 36v28M44 42c0-3.3 2.7-5 6-5s6 1.7 6 5-2.7 4-6 5-6 1.7-6 5 2.7 5 6 5 6-1.7 6-5"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Flame Accent */}
            <path
              d={`M70 ${26 + flameFlicker}c2-6 8-10 6-16-4 2-6 5-7 8-1-3-3-5-6-5 1 5 4 8 7 13z`}
              fill={THEME.colors.accentAmber}
              filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))"
            />
          </svg>
        );
      }

      case 'empty-cart': {
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Shopping Cart Body */}
            <path
              d="M15 22h12l10 40h36l8-28H32"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Left Wheel */}
            <circle cx="42" cy="72" r="6" stroke={color} strokeWidth="4" />
            {/* Right Wheel */}
            <circle cx="68" cy="72" r="6" stroke={color} strokeWidth="4" />
            {/* Empty Ghost Goods (dashed line) */}
            <path
              d="M38 42h28"
              stroke="rgba(239, 68, 68, 0.7)"
              strokeWidth="4"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          </svg>
        );
      }

      case 'clock': {
        // Rotating hour hand based on frames
        const handRotation = (frame * 4) % 360;
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Outer Dial */}
            <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="5" />
            {/* Center Pin */}
            <circle cx="50" cy="50" r="4" fill={color} />
            {/* Ticking Hand */}
            <g transform={`rotate(${handRotation} 50 50)`}>
              <line x1="50" y1="50" x2="50" y2="24" stroke={THEME.colors.accentRed} strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Fixed Hour Hand */}
            <line x1="50" y1="50" x2="68" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      }

      case 'padlock': {
        const shackleY = interpolate(entrance, [0, 1], [-8, 0]);
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Shackle */}
            <path
              d="M32 46v-14c0-9.9 8.1-18 18-18s18 8.1 18 18v14"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              transform={`translate(0, ${shackleY})`}
            />
            {/* Lock Body */}
            <rect
              x="22"
              y="44"
              width="56"
              height="44"
              rx="12"
              fill={THEME.colors.surfaceCard}
              stroke={color}
              strokeWidth="5"
            />
            {/* Keyhole */}
            <circle cx="50" cy="62" r="5" fill={color} />
            <path d="M50 66v10" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        transform: `scale(${scale})`,
        opacity,
        filter: `drop-shadow(0 0 20px ${color}44)`,
      }}
    >
      {renderIcon()}
    </div>
  );
};
