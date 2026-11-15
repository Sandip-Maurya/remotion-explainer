// src/components/motion/LiveTicker.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../../styles/theme';

export interface LiveTickerProps {
  ratePerSecond: number;
  prefix?: string;
  suffix?: string;
  baseValue?: number;
  label?: string;
  color?: string;
  decimals?: number;
}

/**
 * Continuous real-time data ticker that advances frame-by-frame.
 * Communicates live compounding momentum and urgency.
 */
export const LiveTicker: React.FC<LiveTickerProps> = ({
  ratePerSecond,
  prefix = '+$',
  suffix = '/sec',
  baseValue = 0,
  label = 'CURRENT ACCELERATION',
  color = THEME.colors.accentRed,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Accumulate value at 30 fps
  const incrementPerFrame = ratePerSecond / fps;
  const currentTotal = baseValue + frame * incrementPerFrame;

  // Blinking live pulse dot (toggles every 15 frames = 0.5s)
  const isDotLit = (frame % 30) < 18;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 20px',
        borderRadius: 24,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        border: `1.5px solid ${color}60`,
        boxShadow: `0 0 20px ${color}25`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Live Pulsing Dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          boxShadow: isDotLit ? `0 0 12px ${color}` : 'none',
          opacity: isDotLit ? 1 : 0.35,
          transition: 'opacity 0.1s ease',
        }}
      />

      {/* Label and Value */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && (
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 13,
              fontWeight: 800,
              color: '#94a3b8',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        )}
        <div
          style={{
            fontFamily: THEME.fonts.numbers,
            fontSize: 24,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: 0.5,
          }}
        >
          <span style={{ color }}>{prefix}</span>
          <span>{Math.round(currentTotal).toLocaleString()}</span>
          {suffix && <span style={{ fontSize: 16, color: '#94a3b8', marginLeft: 4 }}>{suffix}</span>}
        </div>
      </div>
    </div>
  );
};
