// src/components/graphics/GoalPathChooser.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface GoalPath {
  ifLabel: string;
  thenLabel: string;
  accentColor?: string;
}

export interface GoalPathChooserProps {
  title?: string;
  paths: GoalPath[];
  width?: number;
  delayFrames?: number;
}

/**
 * 30-day destination chooser: IF goal → THEN language.
 * Decision UI for beginner comparison Shorts.
 */
export const GoalPathChooser: React.FC<GoalPathChooserProps> = ({
  title = 'IF YOUR 30-DAY PROJECT IS…',
  paths,
  width = THEME.dimensions.standardCardWidth,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame: frame - delayFrames,
    fps,
    config: THEME.springs.snappy,
  });

  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div
        style={{
          fontFamily: THEME.fonts.heading,
          fontSize: 26,
          fontWeight: 800,
          color: THEME.colors.accentAmber,
          textAlign: 'center',
          letterSpacing: '0.03em',
          opacity: titleIn,
          transform: `scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`,
        }}
      >
        {title}
      </div>

      {paths.map((path, index) => {
        const enter = spring({
          frame: frame - delayFrames - 12 - index * 10,
          fps,
          config: THEME.springs.bouncy,
        });
        const color = path.accentColor ?? THEME.colors.accentBlue;

        return (
          <div
            key={`${path.ifLabel}-${path.thenLabel}`}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              border: `2px solid ${color}55`,
              borderRadius: 22,
              padding: '22px 24px',
              opacity: enter,
              transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
              boxShadow: `0 12px 32px rgba(0,0,0,0.4), 0 0 24px ${color}18`,
            }}
          >
            <div
              style={{
                fontFamily: THEME.fonts.body,
                fontSize: 22,
                fontWeight: 600,
                color: THEME.colors.textMuted,
                marginBottom: 10,
              }}
            >
              {path.ifLabel}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 22,
                  fontWeight: 800,
                  color: color,
                  letterSpacing: '0.06em',
                }}
              >
                →
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 32,
                  fontWeight: 800,
                  color: THEME.colors.textWhite,
                }}
              >
                {path.thenLabel}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
