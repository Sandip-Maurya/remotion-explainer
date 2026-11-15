// src/components/graphics/BeforeAfterSplit.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface SplitItem {
  tag: string;
  value: string;
  label: string;
  subtext?: string;
  color?: string;
  isShock?: boolean;
}

export interface BeforeAfterSplitProps {
  before: SplitItem;
  after: SplitItem;
  width?: number;
  layout?: 'side-by-side' | 'stacked';
  staggerDelay?: number;
}

export const BeforeAfterSplit: React.FC<BeforeAfterSplitProps> = ({
  before,
  after,
  width = 860,
  layout = 'side-by-side',
  staggerDelay = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Before entrance (frame 0)
  const beforeSpring = spring({
    frame,
    fps,
    config: THEME.springs.bouncy,
  });

  // Divider entrance (frame staggerDelay / 2)
  const dividerSpring = spring({
    frame: frame - Math.round(staggerDelay / 2),
    fps,
    config: THEME.springs.snappy,
  });

  // After entrance (frame staggerDelay)
  const afterSpring = spring({
    frame: frame - staggerDelay,
    fps,
    config: THEME.springs.bouncy,
  });

  const beforeColor = before.color || THEME.colors.accentBlue;
  const afterColor = after.color || (after.isShock ? THEME.colors.accentRed : THEME.colors.accentEmerald);

  if (layout === 'stacked') {
    return (
      <div style={{ width, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
        {/* Top (Before) Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: `2px solid ${beforeColor}40`,
            borderRadius: 20,
            padding: '24px 32px',
            transform: `translateY(${interpolate(beforeSpring, [0, 1], [-30, 0])}px) scale(${beforeSpring})`,
            opacity: beforeSpring,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 16,
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 12,
                backgroundColor: `${beforeColor}20`,
                color: beforeColor,
                border: `1px solid ${beforeColor}50`,
                textTransform: 'uppercase',
              }}
            >
              {before.tag}
            </span>
            <span style={{ fontFamily: THEME.fonts.numbers, fontSize: 44, fontWeight: 900, color: '#ffffff' }}>
              {before.value}
            </span>
          </div>
          <div style={{ fontFamily: THEME.fonts.heading, fontSize: 24, fontWeight: 700, color: '#cbd5e1' }}>
            {before.label}
          </div>
          {before.subtext && (
            <div style={{ fontFamily: THEME.fonts.body, fontSize: 18, color: '#64748b', marginTop: 4 }}>
              {before.subtext}
            </div>
          )}
        </div>

        {/* Animated Divider Laser */}
        <div
          style={{
            height: 3,
            width: '100%',
            backgroundColor: '#334155',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            opacity: dividerSpring,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${dividerSpring * 100}%`,
              height: '100%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 12px #38bdf8',
            }}
          />
        </div>

        {/* Bottom (After) Card */}
        <div
          style={{
            backgroundColor: after.isShock ? 'rgba(69, 10, 10, 0.45)' : 'rgba(15, 23, 42, 0.75)',
            border: `2px solid ${afterColor}`,
            boxShadow: `0 0 35px ${afterColor}30`,
            borderRadius: 20,
            padding: '24px 32px',
            transform: `translateY(${interpolate(afterSpring, [0, 1], [30, 0])}px) scale(${afterSpring})`,
            opacity: afterSpring,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 16,
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 12,
                backgroundColor: `${afterColor}25`,
                color: afterColor,
                border: `1px solid ${afterColor}60`,
                textTransform: 'uppercase',
              }}
            >
              {after.tag}
            </span>
            <span style={{ fontFamily: THEME.fonts.numbers, fontSize: 44, fontWeight: 900, color: afterColor }}>
              {after.value}
            </span>
          </div>
          <div style={{ fontFamily: THEME.fonts.heading, fontSize: 24, fontWeight: 700, color: '#ffffff' }}>
            {after.label}
          </div>
          {after.subtext && (
            <div style={{ fontFamily: THEME.fonts.body, fontSize: 18, color: '#94a3b8', marginTop: 4 }}>
              {after.subtext}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Side-by-side layout
  const cardWidth = (width - 40) / 2;

  return (
    <div style={{ width, display: 'flex', alignItems: 'stretch', gap: 24, position: 'relative' }}>
      {/* Left (Before) */}
      <div
        style={{
          width: cardWidth,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          border: `2px solid ${beforeColor}40`,
          borderRadius: 20,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: `scale(${beforeSpring})`,
          opacity: beforeSpring,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 15,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 10,
              backgroundColor: `${beforeColor}20`,
              color: beforeColor,
              border: `1px solid ${beforeColor}50`,
              textTransform: 'uppercase',
            }}
          >
            {before.tag}
          </span>
          <div
            style={{
              fontFamily: THEME.fonts.numbers,
              fontSize: 48,
              fontWeight: 900,
              color: '#ffffff',
              margin: '20px 0 10px',
            }}
          >
            {before.value}
          </div>
          <div style={{ fontFamily: THEME.fonts.heading, fontSize: 22, fontWeight: 700, color: '#cbd5e1' }}>
            {before.label}
          </div>
        </div>
        {before.subtext && (
          <div style={{ fontFamily: THEME.fonts.body, fontSize: 16, color: '#64748b', marginTop: 14 }}>
            {before.subtext}
          </div>
        )}
      </div>

      {/* Right (After / Shock) */}
      <div
        style={{
          width: cardWidth,
          backgroundColor: after.isShock ? 'rgba(69, 10, 10, 0.45)' : 'rgba(15, 23, 42, 0.75)',
          border: `2.5px solid ${afterColor}`,
          boxShadow: `0 0 35px ${afterColor}35`,
          borderRadius: 20,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: `scale(${afterSpring})`,
          opacity: afterSpring,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 15,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 10,
              backgroundColor: `${afterColor}25`,
              color: afterColor,
              border: `1px solid ${afterColor}60`,
              textTransform: 'uppercase',
            }}
          >
            {after.tag}
          </span>
          <div
            style={{
              fontFamily: THEME.fonts.numbers,
              fontSize: 48,
              fontWeight: 900,
              color: afterColor,
              margin: '20px 0 10px',
              textShadow: `0 0 20px ${afterColor}60`,
            }}
          >
            {after.value}
          </div>
          <div style={{ fontFamily: THEME.fonts.heading, fontSize: 22, fontWeight: 700, color: '#ffffff' }}>
            {after.label}
          </div>
        </div>
        {after.subtext && (
          <div style={{ fontFamily: THEME.fonts.body, fontSize: 16, color: '#cbd5e1', marginTop: 14 }}>
            {after.subtext}
          </div>
        )}
      </div>
    </div>
  );
};
