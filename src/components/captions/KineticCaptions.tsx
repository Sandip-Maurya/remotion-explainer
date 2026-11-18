// src/components/captions/KineticCaptions.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import type { CaptionToken } from '../../types/content.types';
import { THEME } from '../../styles/theme';

export interface KineticCaptionsProps {
  captions: CaptionToken[];
  bottom?: number;
  activeColor?: string;
  emphasisColor?: string;
}

/**
 * Rolling word-by-word captions with spring pop on the active token.
 * Positioned in the Shorts captions safe region.
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

  let displayIndex = captions.findIndex(
    (token) => currentTimeMs >= token.startMs && currentTimeMs <= token.endMs,
  );

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
          : '0 2px 12px rgba(0,0,0,0.85)';

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
