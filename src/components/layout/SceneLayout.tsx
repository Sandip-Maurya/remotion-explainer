// src/components/layout/SceneLayout.tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { THEME } from '../../styles/theme';

export interface SceneHeaderConfig {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  eyebrowColor?: string;
  titleColor?: string;
}

export interface SceneLayoutProps {
  header?: SceneHeaderConfig;
  children: React.ReactNode;
  footer?: React.ReactNode;
  mode?: 'centered' | 'space-between' | 'top-anchored';
  gap?: number;
  padding?: string;
  style?: React.CSSProperties;
  showAmbientGrid?: boolean;
}

/**
 * Universal 3-Slot Scene Template for 1080x1920 YouTube Shorts.
 * Automatically distributes vertical space across:
 *   - Slot 1: Context Header (Eyebrow + Title + Subtitle)
 *   - Slot 2: Hero Visual Stage (Charts, Metric Cards, Split Comparisons)
 *   - Slot 3: Impact Punchline (Editorial Callouts, Takeaways)
 */
export const SceneLayout: React.FC<SceneLayoutProps> = ({
  header,
  children,
  footer,
  mode = 'centered',
  gap = 56,
  padding = '200px 80px 240px 80px',
  style,
  showAmbientGrid = false,
}) => {
  const resolvedJustify =
    mode === 'space-between'
      ? 'space-between'
      : mode === 'top-anchored'
      ? 'flex-start'
      : 'center';

  return (
    <AbsoluteFill
      style={{
        padding,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: resolvedJustify,
        alignItems: 'center',
        gap: mode === 'space-between' ? undefined : gap,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Optional Ambient Background Coordinate Grid */}
      {showAmbientGrid && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.04,
          }}
        >
          <defs>
            <pattern id="sceneGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sceneGridPattern)" />
        </svg>
      )}

      {/* ==================================================================== */}
      {/* SLOT 1: Context Header                                               */}
      {/* ==================================================================== */}
      {header && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: THEME.dimensions.standardCardWidth,
            zIndex: 10,
          }}
        >
          {header.eyebrow && (
            <div
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 24,
                fontWeight: 800,
                color: header.eyebrowColor || THEME.colors.accentAmber,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {header.eyebrow}
            </div>
          )}

          <div
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: THEME.fontSizes.h1,
              fontWeight: 900,
              color: header.titleColor || '#ffffff',
              lineHeight: 1.16,
              letterSpacing: -0.5,
            }}
          >
            {header.title}
          </div>

          {header.subtitle && (
            <div
              style={{
                fontFamily: THEME.fonts.body,
                fontSize: 26,
                fontWeight: 500,
                color: THEME.colors.textMuted,
                marginTop: 12,
                lineHeight: 1.35,
              }}
            >
              {header.subtitle}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SLOT 2: Hero Visual Stage (Children)                                 */}
      {/* ==================================================================== */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {children}
      </div>

      {/* ==================================================================== */}
      {/* SLOT 3: Impact Punchline / Footer                                    */}
      {/* ==================================================================== */}
      {footer && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            width: '100%',
            maxWidth: THEME.dimensions.standardCardWidth,
          }}
        >
          {footer}
        </div>
      )}
    </AbsoluteFill>
  );
};
