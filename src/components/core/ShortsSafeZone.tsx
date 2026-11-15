// src/components/core/ShortsSafeZone.tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { THEME } from '../../styles/theme';

export interface ShortsSafeZoneProps {
  /** Whether the guide is visible during preview */
  visible?: boolean;
  /** Overlay rendering mode: 'full' (solid bands), 'outline' (clean borders), or 'minimal' */
  mode?: 'full' | 'outline' | 'minimal';
  /** Highlight the designated subtitle/captions region */
  showCaptionsZone?: boolean;
  /** Render center crosshair guides */
  showCrosshairs?: boolean;
}

/**
 * Visual developer guide that displays the exact mobile interface cutouts
 * for YouTube Shorts (1080 x 1920).
 *
 * Content outside the 880 x 1420 px safe rectangle will be obscured by
 * channel avatars, subscribe buttons, action icons, or search headers.
 */
export const ShortsSafeZone: React.FC<ShortsSafeZoneProps> = ({
  visible = true,
  mode = 'full',
  showCaptionsZone = true,
  showCrosshairs = true,
}) => {
  if (!visible) return null;

  const { safeZone, captionsRegion } = THEME.dimensions;

  const dangerBg = mode === 'full' ? 'rgba(239, 68, 68, 0.22)' : 'transparent';
  const dangerBorder = '2px dashed rgba(239, 68, 68, 0.8)';

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 99999,
        fontFamily: THEME.fonts.heading,
      }}
    >
      {/* 1. Top Danger Buffer (180px) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: safeZone.top,
          backgroundColor: dangerBg,
          borderBottom: dangerBorder,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.85)',
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 800,
            padding: '4px 16px',
            borderRadius: 8,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Top Danger Zone (180px) • Search & Audio Header
        </div>
      </div>

      {/* 2. Left Danger Buffer (60px) */}
      <div
        style={{
          position: 'absolute',
          top: safeZone.top,
          bottom: safeZone.bottom,
          left: 0,
          width: safeZone.left,
          backgroundColor: dangerBg,
          borderRight: dangerBorder,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#ef4444',
            fontSize: 16,
            fontWeight: 800,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            letterSpacing: '0.08em',
          }}
        >
          LEFT BUFFER (60px)
        </span>
      </div>

      {/* 3. Right Danger Buffer (140px) */}
      <div
        style={{
          position: 'absolute',
          top: safeZone.top,
          bottom: safeZone.bottom,
          right: 0,
          width: safeZone.right,
          backgroundColor: dangerBg,
          borderLeft: dangerBorder,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.85)',
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 800,
            writingMode: 'vertical-rl',
            padding: '16px 6px',
            borderRadius: 8,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Right Danger Zone (140px) • Likes / Comments / Remix
        </div>
      </div>

      {/* 4. Bottom Danger Buffer (320px) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: safeZone.bottom,
          backgroundColor: dangerBg,
          borderTop: dangerBorder,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.85)',
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 800,
            padding: '6px 20px',
            borderRadius: 8,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Bottom Danger Zone (320px) • Channel, Title & Subscribe
        </div>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16, fontWeight: 600 }}>
          Scrubber bar, Audio tag, and Account pill sit here
        </span>
      </div>

      {/* 5. Active Safe Content Area Outline (880 x 1420 px) */}
      <div
        style={{
          position: 'absolute',
          top: safeZone.top,
          left: safeZone.left,
          width: safeZone.width,
          height: safeZone.height,
          border: '2px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 24,
          boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.1)',
          pointerEvents: 'none',
        }}
      >
        {/* Safe Area Tag */}
        <span
          style={{
            position: 'absolute',
            top: 12,
            left: 16,
            color: '#38bdf8',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: THEME.fonts.numbers,
            letterSpacing: '0.04em',
          }}
        >
          SAFE AREA: 880 x 1420 px
        </span>
      </div>

      {/* 6. Subtitles Safe Region (Upper portion of lower third) */}
      {showCaptionsZone && (
        <div
          style={{
            position: 'absolute',
            bottom: captionsRegion.bottom,
            left: captionsRegion.left,
            right: captionsRegion.right,
            height: captionsRegion.height,
            border: '2px dotted rgba(245, 158, 11, 0.7)',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#f59e0b',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            RECOMMENDED SUBTITLES ZONE (Bottom: 350px)
          </span>
        </div>
      )}

      {/* 7. Center Crosshairs */}
      {showCrosshairs && (
        <>
          {/* Vertical Center Line */}
          <div
            style={{
              position: 'absolute',
              top: safeZone.top,
              bottom: safeZone.bottom,
              left: 540,
              width: 1,
              backgroundColor: 'rgba(56, 189, 248, 0.25)',
            }}
          />
          {/* Horizontal Center Line */}
          <div
            style={{
              position: 'absolute',
              top: safeZone.top + safeZone.height / 2, // 180 + 710 = 890px
              left: safeZone.left,
              right: safeZone.right,
              height: 1,
              backgroundColor: 'rgba(56, 189, 248, 0.25)',
            }}
          />
          {/* Center Target Box */}
          <div
            style={{
              position: 'absolute',
              top: safeZone.top + safeZone.height / 2 - 20,
              left: 540 - 20,
              width: 40,
              height: 40,
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '50%',
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
