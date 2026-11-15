// src/components/graphics/MetricCard.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';
import { LightSheen } from '../motion/LightSheen';

export interface MetricCardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  color?: string;
  width?: number;
  delayFrames?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  prefix = '',
  suffix = '',
  delta,
  trend = 'neutral',
  subtext,
  color,
  width = 860,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: THEME.springs.bouncy,
  });

  // Delta badge entrance (slightly delayed)
  const deltaEntrance = spring({
    frame: frame - delayFrames - 8,
    fps,
    config: THEME.springs.snappy,
  });

  const resolvedColor = color || THEME.colors.accentBlue;

  // Numerical counter animation if value is a number
  const isNumeric = typeof value === 'number';
  const hasDecimals = isNumeric && (value as number) % 1 !== 0;
  const rawInterpolated = isNumeric
    ? interpolate(entrance, [0, 1], [0, value as number])
    : 0;
  const displayedValue = isNumeric
    ? hasDecimals
      ? rawInterpolated.toFixed(1)
      : Math.round(rawInterpolated).toLocaleString()
    : value;

  const trendColor =
    trend === 'up'
      ? THEME.colors.accentEmerald
      : trend === 'down'
      ? THEME.colors.accentRed
      : THEME.colors.textMuted;

  return (
    <div
      style={{
        width,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        border: `2px solid ${resolvedColor}50`,
        borderRadius: 24,
        padding: '32px 36px',
        boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${resolvedColor}20`,
        backdropFilter: 'blur(12px)',
        transform: `scale(${entrance})`,
        opacity: entrance,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Specular Glass Sheen Sweep */}
      <LightSheen delayFrames={delayFrames + 12} />

      {/* Top ambient highlight line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${resolvedColor}, transparent)`,
        }}
      />

      {/* Header: Label & Delta Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: 22,
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>

        {delta && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 14,
              backgroundColor: `${trendColor}20`,
              border: `1.5px solid ${trendColor}60`,
              transform: `scale(${deltaEntrance})`,
              opacity: deltaEntrance,
            }}
          >
            <span
              style={{
                fontFamily: THEME.fonts.numbers,
                fontSize: 18,
                fontWeight: 800,
                color: trendColor,
              }}
            >
              {delta}
            </span>
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div
        style={{
          fontFamily: THEME.fonts.numbers,
          fontSize: 64,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: -1,
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
        }}
      >
        <span style={{ color: resolvedColor }}>{prefix}</span>
        <span>{displayedValue.toLocaleString()}</span>
        {suffix && (
          <span style={{ fontSize: 32, fontWeight: 700, color: '#94a3b8', marginLeft: 4 }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Subtext description */}
      {subtext && (
        <div
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: 20,
            color: '#64748b',
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
