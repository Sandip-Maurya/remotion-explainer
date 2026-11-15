// src/components/captions/KineticCaptions.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CaptionToken } from '../../types/content.types';
import { THEME } from '../../styles/theme';

export interface KineticCaptionsProps {
  /** Array of millisecond-precision word tokens */
  captions: CaptionToken[];
  /** Optional custom bottom position (defaults to safe zone 350px) */
  bottom?: number;
  /** Primary active word highlight color */
  activeColor?: string;
  /** Color for words marked isEmphasized */
  emphasisColor?: string;
}

/**
 * High-impact kinetic word-by-word subtitle component.
 * Displays a rolling window of words centered in the safe zone with active-word
 * spring physics, glowing accents, and emphasis highlights.
 */
export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  captions,
  bottom = THEME.dimensions.captionsRegion.bottom,
  activeColor = THEME.colors.accentBlue,
  emphasisColor = THEME.colors.accentAmber,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  // Find active token index
  const activeIndex = captions.findIndex(
    (token) => currentTimeMs >= token.startMs && currentTimeMs <= token.endMs
  );

  // If no word is actively being spoken, check if we're between words within 300ms
  let displayIndex = activeIndex;
  if (displayIndex === -1) {
    const nextIndex = captions.findIndex((token) => token.startMs > currentTimeMs);
    if (nextIndex > 0) {
      const prevToken = captions[nextIndex - 1];
      if (currentTimeMs - prevToken.endMs < 350) {
        displayIndex = nextIndex - 1;
      }
    }
  }

  if (displayIndex === -1) return null;

  // Rolling window of 3-4 words (1 previous, active, 1-2 upcoming)
  const windowStart = Math.max(0, displayIndex - 1);
  const windowEnd = Math.min(captions.length, displayIndex + 3);
  const visibleTokens = captions.slice(windowStart, windowEnd);

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: THEME.dimensions.captionsRegion.left,
        right: THEME.dimensions.captionsRegion.right,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      {visibleTokens.map((token, i) => {
        const isCurrent = token === captions[displayIndex];
        const tokenStartFrame = Math.round((token.startMs / 1000) * fps);

        const pop = isCurrent
          ? spring({
              frame: frame - tokenStartFrame,
              fps,
              config: THEME.springs.snappy,
            })
          : 1;

        const scale = isCurrent ? interpolate(pop, [0, 1], [0.85, 1.15]) : 1.0;
        const color = isCurrent
          ? token.isEmphasized
            ? emphasisColor
            : activeColor
          : 'rgba(255, 255, 255, 0.45)';

        const textShadow = isCurrent
          ? token.isEmphasized
            ? `0 0 25px ${emphasisColor}88`
            : `0 0 25px ${activeColor}88`
          : 'none';

        return (
          <span
            key={`${token.startMs}-${token.text}-${i}`}
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: token.isEmphasized ? 44 : 38,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color,
              transform: `scale(${scale})`,
              textShadow,
              transition: 'color 0.1s ease',
              display: 'inline-block',
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};
