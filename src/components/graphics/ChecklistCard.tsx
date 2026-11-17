// src/components/graphics/ChecklistCard.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';
import { LightSheen } from '../motion/LightSheen';

export interface ChecklistItem {
  text: string;
  tone?: 'pro' | 'con' | 'neutral';
}

export interface ChecklistCardProps {
  title: string;
  subtitle?: string;
  items: ChecklistItem[];
  accentColor?: string;
  width?: number;
  delayFrames?: number;
}

/**
 * Animated strength/weakness checklist for decision-style Shorts.
 * Staggered spring rows — not a dense data table.
 */
export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  title,
  subtitle,
  items,
  accentColor = THEME.colors.accentBlue,
  width = THEME.dimensions.standardCardWidth,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: THEME.springs.smooth,
  });

  return (
    <div
      style={{
        width,
        backgroundColor: THEME.colors.surfaceGlass,
        border: `2px solid ${accentColor}55`,
        borderRadius: 24,
        padding: '28px 30px 24px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [28, 0])}px) scale(${interpolate(entrance, [0, 1], [0.96, 1])})`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 30px ${accentColor}22`,
      }}
    >
      <LightSheen />

      <div
        style={{
          fontFamily: THEME.fonts.heading,
          fontSize: 28,
          fontWeight: 800,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: subtitle ? 6 : 18,
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: 20,
            fontWeight: 600,
            color: THEME.colors.textMuted,
            marginBottom: 18,
          }}
        >
          {subtitle}
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, index) => {
          const row = spring({
            frame: frame - delayFrames - 8 - index * 5,
            fps,
            config: THEME.springs.snappy,
          });

          const tone = item.tone ?? 'neutral';
          const mark = tone === 'pro' ? '✓' : tone === 'con' ? '!' : '•';
          const markColor =
            tone === 'pro'
              ? THEME.colors.accentEmerald
              : tone === 'con'
                ? THEME.colors.accentAmber
                : accentColor;

          return (
            <div
              key={`${item.text}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                opacity: row,
                transform: `translateX(${interpolate(row, [0, 1], [-18, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: `${markColor}22`,
                  border: `1.5px solid ${markColor}88`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: THEME.fonts.heading,
                  fontSize: 18,
                  fontWeight: 800,
                  color: markColor,
                }}
              >
                {mark}
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.body,
                  fontSize: 24,
                  fontWeight: 600,
                  color: THEME.colors.textWhite,
                  lineHeight: 1.35,
                  paddingTop: 4,
                }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface ProsConsPairProps {
  left: ChecklistCardProps;
  right: ChecklistCardProps;
  gap?: number;
  width?: number;
}

/** Two checklist cards stacked for vertical Shorts (Python then JavaScript). */
export const ProsConsPair: React.FC<ProsConsPairProps> = ({
  left,
  right,
  gap = 22,
  width = THEME.dimensions.standardCardWidth,
}) => {
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap }}>
      <ChecklistCard {...left} width={width} />
      <ChecklistCard {...right} width={width} delayFrames={(right.delayFrames ?? 0) + 10} />
    </div>
  );
};
