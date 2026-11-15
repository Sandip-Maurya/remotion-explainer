// src/components/graphics/AnimatedArrow.tsx
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { makeArrow } from '@remotion/shapes';
import { THEME } from '../../styles/theme';

export interface AnimatedArrowProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  length?: number;
  headWidth?: number;
  shaftWidth?: number;
  color?: string;
  label?: string;
  delayFrames?: number;
  pulse?: boolean;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  direction = 'down',
  length = 130,
  headWidth = 72,
  shaftWidth = 28,
  color,
  label,
  delayFrames = 0,
  pulse = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Default color based on direction (down = crimson red alert, up = emerald green growth)
  const resolvedColor =
    color ||
    (direction === 'down'
      ? THEME.colors.accentRed
      : direction === 'up'
      ? THEME.colors.accentEmerald
      : THEME.colors.accentBlue);

  const shape = useMemo(() => {
    return makeArrow({
      direction,
      length,
      headWidth,
      headLength: Math.round(length * 0.42),
      shaftWidth,
      cornerRadius: 4,
    });
  }, [direction, length, headWidth, shaftWidth]);

  // Entrance spring
  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: THEME.springs.bouncy,
  });

  // Continuous subtle pulse motion
  const pulseOffset = pulse
    ? Math.sin(((frame - delayFrames) / fps) * Math.PI * 3) * 6
    : 0;

  const arrowTransform =
    direction === 'down'
      ? `translateY(${pulseOffset}px)`
      : direction === 'up'
      ? `translateY(${-pulseOffset}px)`
      : direction === 'right'
      ? `translateX(${pulseOffset}px)`
      : `translateX(${-pulseOffset}px)`;

  const arrowId = useMemo(() => `arrow-${Math.random().toString(36).substring(2, 9)}`, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: direction === 'down' || direction === 'up' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      <div style={{ transform: arrowTransform, transition: 'transform 0.1s linear' }}>
        <svg
          width={shape.width}
          height={shape.height}
          viewBox={`0 0 ${shape.width} ${shape.height}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id={`arrowGlow-${arrowId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={resolvedColor} floodOpacity="0.6" />
            </filter>
          </defs>
          <path
            d={shape.path}
            fill={resolvedColor}
            filter={`url(#arrowGlow-${arrowId})`}
          />
        </svg>
      </div>

      {label && (
        <div
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: 22,
            fontWeight: 800,
            color: resolvedColor,
            textShadow: `0 0 12px ${resolvedColor}60`,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
