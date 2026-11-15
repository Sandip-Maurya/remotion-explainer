// src/components/core/Title.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface TitleProps {
  /** The primary headline text */
  headline: string;
  /** Optional subtext or explanatory sentence */
  subtext?: string;
  /** Specific keyword in the headline to highlight with accent color */
  highlightWord?: string;
  /** Accent color for the highlight word */
  highlightColor?: string;
  /** Frame offset at which the entrance animation starts */
  startFrame?: number;
  /** Text alignment */
  align?: 'left' | 'center';
  /** Max width (clamped inside safe area) */
  maxWidth?: number;
}

/**
 * Animated kinetic headline designed for the 1080 x 1920 mobile viewport.
 * Features a spring pop entrance, keyword glow highlight, and staggered subtext.
 */
export const Title: React.FC<TitleProps> = ({
  headline,
  subtext,
  highlightWord,
  highlightColor = THEME.colors.accentBlue,
  startFrame = 0,
  align = 'center',
  maxWidth = 840,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Primary headline spring pop
  const pop = spring({
    frame: frame - startFrame,
    fps,
    config: THEME.springs.snappy,
  });

  // Staggered subtext spring entrance
  const subtextPop = spring({
    frame: frame - startFrame - 8,
    fps,
    config: THEME.springs.smooth,
  });

  const scale = interpolate(pop, [0, 1], [0.85, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [30, 0]);

  // Split headline to style highlightWord distinctly
  const renderHeadline = () => {
    if (!highlightWord) {
      return headline;
    }

    const regex = new RegExp(`(${highlightWord})`, 'gi');
    const parts = headline.split(regex);

    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === highlightWord.toLowerCase();
      if (isMatch) {
        return (
          <span
            key={index}
            style={{
              color: highlightColor,
              textShadow: `0 0 35px ${highlightColor}66`,
              display: 'inline-block',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        maxWidth,
        width: '100%',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        fontFamily: THEME.fonts.heading,
      }}
    >
      <h1
        style={{
          fontSize: THEME.fontSizes.h1,
          fontWeight: 900,
          color: THEME.colors.textWhite,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: 0,
          wordBreak: 'break-word',
        }}
      >
        {renderHeadline()}
      </h1>

      {subtext && (
        <p
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: THEME.fontSizes.bodyLg,
            color: THEME.colors.textMuted,
            marginTop: 20,
            marginBottom: 0,
            lineHeight: 1.4,
            opacity: Math.max(0, interpolate(subtextPop, [0, 1], [0, 1])),
            transform: `translateY(${interpolate(subtextPop, [0, 1], [15, 0])}px)`,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};
