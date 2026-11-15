// src/components/core/BigNumber.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface BigNumberProps {
  /** Target numeric value to count up to */
  value: number;
  /** Optional prefix symbol (e.g. '$', '+', '-') */
  prefix?: string;
  /** Optional suffix symbol (e.g. '%', 'k', 'M', ' hours') */
  suffix?: string;
  /** Descriptive label under the number */
  label?: string;
  /** Secondary comparison stat (e.g. "$142 today" or "Was $100 in 2020") */
  comparisonText?: string;
  /** Accent color for the number */
  color?: string;
  /** Frame offset at which the animation begins */
  startFrame?: number;
  /** Number of frames over which the counter rolls up */
  countDuration?: number;
  /** Font size for the large number (default hero: 72px) */
  fontSize?: number;
}

/**
 * Animated counting statistic component with spring physics and tabular numerals.
 * Ensures zero horizontal layout shifting during count-up.
 */
export const BigNumber: React.FC<BigNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  label,
  comparisonText,
  color = THEME.colors.accentBlue,
  startFrame = 0,
  countDuration = 35,
  fontSize = 96,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance pop spring
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: THEME.springs.snappy,
  });

  // Label entrance delayed
  const labelPop = spring({
    frame: frame - startFrame - 8,
    fps,
    config: THEME.springs.smooth,
  });

  // Numeric count-up progress (0 to 1)
  const countProgress = interpolate(
    frame - startFrame,
    [0, countDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const currentValue = Math.round(interpolate(countProgress, [0, 1], [0, value]));

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Big Number Display */}
      <div
        style={{
          fontFamily: THEME.fonts.numbers,
          fontSize,
          fontWeight: 900,
          color,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          textShadow: `0 0 40px ${color}55`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix && <span style={{ fontSize: fontSize * 0.75, marginRight: 4 }}>{prefix}</span>}
        <span>{currentValue.toLocaleString()}</span>
        {suffix && <span style={{ fontSize: fontSize * 0.65, marginLeft: 6 }}>{suffix}</span>}
      </div>

      {/* Primary Label */}
      {label && (
        <span
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: THEME.fontSizes.h3,
            fontWeight: 700,
            color: THEME.colors.textWhite,
            marginTop: 16,
            opacity: Math.max(0, interpolate(labelPop, [0, 1], [0, 1])),
            transform: `translateY(${interpolate(labelPop, [0, 1], [10, 0])}px)`,
          }}
        >
          {label}
        </span>
      )}

      {/* Comparison Subtext */}
      {comparisonText && (
        <span
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: THEME.fontSizes.body,
            fontWeight: 600,
            color: THEME.colors.textMuted,
            marginTop: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            padding: '6px 18px',
            borderRadius: 999,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: Math.max(0, interpolate(labelPop, [0, 1], [0, 1])),
          }}
        >
          {comparisonText}
        </span>
      )}
    </div>
  );
};
