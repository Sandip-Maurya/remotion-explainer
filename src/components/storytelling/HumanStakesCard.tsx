// src/components/storytelling/HumanStakesCard.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface HumanStakesCardProps {
  /** Persona or item being evaluated (e.g. "Your Grocery Cart") */
  personaLabel: string;
  /** Historical benchmark label (e.g. "2020") */
  pastLabel: string;
  /** Historical value (e.g. "$100 (Full Cart)") */
  pastValue: string | number;
  /** Current benchmark label (e.g. "Today") */
  presentLabel: string;
  /** Current value (e.g. "$142 (Half Empty)") */
  presentValue: string | number;
  /** Visceral impact statement (e.g. "You work 4 hours more each week just to buy the same food.") */
  impactStatement: string;
  /** Frame offset at which the card enters */
  startFrame?: number;
}

/**
 * Storytelling primitive that translates abstract macro statistics into a visceral
 * personal comparison between past security and present inflation/crisis.
 */
export const HumanStakesCard: React.FC<HumanStakesCardProps> = ({
  personaLabel,
  pastLabel,
  pastValue,
  presentLabel,
  presentValue,
  impactStatement,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: THEME.springs.smooth,
  });

  const impactPop = spring({
    frame: frame - startFrame - 15,
    fps,
    config: THEME.springs.snappy,
  });

  const cardY = interpolate(entrance, [0, 1], [30, 0]);
  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 840,
        backgroundColor: THEME.colors.surfaceCard,
        borderRadius: 32,
        border: `2px solid ${THEME.colors.borderLight}`,
        boxShadow: THEME.shadows.card,
        padding: '36px 32px',
        transform: `translateY(${cardY}px)`,
        opacity: cardOpacity,
      }}
    >
      {/* Persona Header Pill */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: THEME.colors.textWhite,
          fontFamily: THEME.fonts.heading,
          fontSize: THEME.fontSizes.body,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '8px 24px',
          borderRadius: 999,
          marginBottom: 28,
        }}
      >
        {personaLabel}
      </div>

      {/* Dual Comparison Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          width: '100%',
          marginBottom: 28,
        }}
      >
        {/* Past Column */}
        <div
          style={{
            backgroundColor: 'rgba(11, 15, 26, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span style={{ color: THEME.colors.textMuted, fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>
            {pastLabel}
          </span>
          <span
            style={{
              color: THEME.colors.accentEmerald,
              fontFamily: THEME.fonts.heading,
              fontSize: 32,
              fontWeight: 900,
              marginTop: 10,
            }}
          >
            {pastValue}
          </span>
          <div style={{ marginTop: 12, color: THEME.colors.accentEmerald, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>✓ Baseline Value</span>
          </div>
        </div>

        {/* Present Column */}
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: `2px solid ${THEME.colors.borderGlowRed}`,
            borderRadius: 20,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.2)',
          }}
        >
          <span style={{ color: THEME.colors.accentRed, fontSize: 20, fontWeight: 800, textTransform: 'uppercase' }}>
            {presentLabel}
          </span>
          <span
            style={{
              color: '#ffffff',
              fontFamily: THEME.fonts.heading,
              fontSize: 32,
              fontWeight: 900,
              marginTop: 10,
            }}
          >
            {presentValue}
          </span>
          <div style={{ marginTop: 12, color: THEME.colors.accentRed, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚠ Higher Cost, Less Value</span>
          </div>
        </div>
      </div>

      {/* Impact Statement Banner */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${THEME.colors.borderGlowAmber}`,
          borderRadius: 18,
          padding: '18px 24px',
          textAlign: 'center',
          opacity: Math.max(0, interpolate(impactPop, [0, 1], [0, 1])),
          transform: `scale(${interpolate(impactPop, [0, 1], [0.92, 1])})`,
        }}
      >
        <p
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: THEME.fontSizes.body,
            fontWeight: 700,
            color: THEME.colors.accentAmber,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {impactStatement}
        </p>
      </div>
    </div>
  );
};
