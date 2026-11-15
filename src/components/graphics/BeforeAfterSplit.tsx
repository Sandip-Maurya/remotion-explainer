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
  connectorBadge?: string;
}

export const BeforeAfterSplit: React.FC<BeforeAfterSplitProps> = ({
  before,
  after,
  width = THEME.dimensions.standardCardWidth,
  layout = 'side-by-side',
  staggerDelay = 14,
  connectorBadge,
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
      <div style={{ width, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
        {/* Top (Before) Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            border: `2px solid ${beforeColor}40`,
            borderRadius: 22,
            padding: '30px 38px',
            transform: `translateY(${interpolate(beforeSpring, [0, 1], [-30, 0])}px) scale(${beforeSpring})`,
            opacity: beforeSpring,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 18,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 14,
                backgroundColor: `${beforeColor}20`,
                color: beforeColor,
                border: `1px solid ${beforeColor}50`,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {before.tag}
            </span>
            <span style={{ fontFamily: THEME.fonts.numbers, fontSize: 64, fontWeight: 900, color: '#ffffff', letterSpacing: -1 }}>
              {before.value}
            </span>
          </div>
          <div style={{ fontFamily: THEME.fonts.heading, fontSize: 28, fontWeight: 800, color: '#e2e8f0' }}>
            {before.label}
          </div>
          {before.subtext && (
            <div style={{ fontFamily: THEME.fonts.body, fontSize: 22, color: '#94a3b8', marginTop: 6, lineHeight: 1.35 }}>
              {before.subtext}
            </div>
          )}
        </div>

        {/* Animated Divider Laser with Optional Connector Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            height: connectorBadge ? 36 : 4,
            opacity: dividerSpring,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: '#334155',
              transform: 'translateY(-50%)',
              borderRadius: 2,
              overflow: 'hidden',
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

          {connectorBadge && (
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                padding: '6px 18px',
                borderRadius: 16,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1.5px solid #f43f5e',
                boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)',
                fontFamily: THEME.fonts.heading,
                fontSize: 18,
                fontWeight: 900,
                color: '#f43f5e',
                letterSpacing: 1,
                textTransform: 'uppercase',
                transform: `scale(${dividerSpring})`,
              }}
            >
              {connectorBadge}
            </div>
          )}
        </div>

        {/* Bottom (After) Card */}
        <div
          style={{
            backgroundColor: after.isShock ? 'rgba(69, 10, 10, 0.55)' : 'rgba(15, 23, 42, 0.82)',
            border: `2px solid ${afterColor}`,
            boxShadow: `0 0 40px ${afterColor}35`,
            borderRadius: 22,
            padding: '30px 38px',
            transform: `translateY(${interpolate(afterSpring, [0, 1], [30, 0])}px) scale(${afterSpring})`,
            opacity: afterSpring,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 18,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 14,
                backgroundColor: `${afterColor}25`,
                color: afterColor,
                border: `1px solid ${afterColor}60`,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {after.tag}
            </span>
            <span style={{ fontFamily: THEME.fonts.numbers, fontSize: 64, fontWeight: 900, color: afterColor, letterSpacing: -1 }}>
              {after.value}
            </span>
          </div>
          <div style={{ fontFamily: THEME.fonts.heading, fontSize: 28, fontWeight: 800, color: '#ffffff' }}>
            {after.label}
          </div>
          {after.subtext && (
            <div style={{ fontFamily: THEME.fonts.body, fontSize: 22, color: '#cbd5e1', marginTop: 6, lineHeight: 1.35 }}>
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
