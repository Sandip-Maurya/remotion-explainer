// src/components/graphics/FragmentationDiagram.tsx
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../../styles/theme';

export interface FragmentationDiagramProps {
  width?: number;
  height?: number;
  highlightLevel?: 1 | 2 | 3; // 1 = macro, 2 = micro, 3 = nano/bloodstream
}

export const FragmentationDiagram: React.FC<FragmentationDiagramProps> = ({
  width = 860,
  height = 540,
  highlightLevel = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step1Entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const step2Entrance = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const step3Entrance = spring({
    frame: frame - 36,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Gentle idle pulse for nanoplastics
  const pulse = Math.sin((frame / 15) * Math.PI) * 0.15 + 0.85;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        background: 'linear-gradient(180deg, #101728 0%, #080b14 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 16,
              fontWeight: 800,
              color: THEME.colors.accentBlue,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            BIOLOGICAL INFILTRATION CASCADE
          </span>
          <h3
            style={{
              margin: '6px 0 0 0',
              fontFamily: THEME.fonts.heading,
              fontSize: 26,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            How Plastic Crosses The Gut Barrier
          </h3>
        </div>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 9999,
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            fontFamily: THEME.fonts.numbers,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          NANOPOLYMERS
        </div>
      </div>

      {/* 3 Cascade Horizontal Stages */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 40px 1fr 40px 1.2fr',
          alignItems: 'center',
          gap: 12,
          marginTop: 16,
        }}
      >
        {/* Stage 1: Macro Waste */}
        <div
          style={{
            opacity: step1Entrance,
            transform: `translateY(${interpolate(step1Entrance, [0, 1], [20, 0])}px)`,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: '20px 16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              height: 70,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* SVG Bottle Icon */}
            <svg width="44" height="60" viewBox="0 0 44 60" fill="none">
              <rect x="16" y="2" width="12" height="8" rx="2" fill="#64748b" />
              <path
                d="M14 12 C14 10, 30 10, 30 12 L34 22 C36 26, 38 32, 38 38 L38 52 C38 56, 34 58, 30 58 L14 58 C10 58, 6 56, 6 52 L6 38 C6 32, 8 26, 10 22 Z"
                stroke="#94a3b8"
                strokeWidth="2.5"
                fill="rgba(56, 189, 248, 0.15)"
              />
            </svg>
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 18,
              fontWeight: 800,
              color: '#ffffff',
              marginTop: 10,
            }}
          >
            MACRO
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.numbers,
              fontSize: 14,
              color: '#94a3b8',
              marginTop: 4,
            }}
          >
            &gt; 5 mm
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Ocean Debris</div>
        </div>

        {/* Arrow 1 */}
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 24 }}>➔</div>

        {/* Stage 2: Microplastics */}
        <div
          style={{
            opacity: step2Entrance,
            transform: `translateY(${interpolate(step2Entrance, [0, 1], [20, 0])}px)`,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 18,
            padding: '20px 16px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
          }}
        >
          <div
            style={{
              height: 70,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* SVG Micro Particles */}
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="12,18 20,10 26,20 18,26" fill="#f59e0b" opacity="0.9" />
              <polygon points="34,14 44,8 48,18 38,22" fill="#fbbf24" opacity="0.8" />
              <polygon points="18,36 30,32 26,44 14,42" fill="#f59e0b" opacity="0.85" />
              <polygon points="38,32 50,36 46,50 36,44" fill="#f59e0b" opacity="0.95" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 18,
              fontWeight: 800,
              color: '#f59e0b',
              marginTop: 10,
            }}
          >
            MICRO
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.numbers,
              fontSize: 14,
              color: '#fbbf24',
              marginTop: 4,
            }}
          >
            &lt; 5 mm
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Ingested</div>
        </div>

        {/* Arrow 2 */}
        <div style={{ textAlign: 'center', color: '#ef4444', fontSize: 24 }}>➔</div>

        {/* Stage 3: Nanoplastics In Bloodstream */}
        <div
          style={{
            opacity: step3Entrance,
            transform: `translateY(${interpolate(step3Entrance, [0, 1], [20, 0])}px)`,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid #ef4444',
            borderRadius: 18,
            padding: '20px 16px',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
          }}
        >
          <div
            style={{
              height: 70,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* SVG Glowing Nanosphere Crossing Vascular Barrier */}
            <svg width="80" height="60" viewBox="0 0 80 60">
              {/* Vascular Wall line */}
              <line
                x1="40"
                y1="4"
                x2="40"
                y2="56"
                stroke="#64748b"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
              {/* Cellular passage arrow */}
              <path d="M 24 30 L 52 30" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="50,26 58,30 50,34" fill="#ef4444" />
              {/* Nanoplastic glowing dot */}
              <circle
                cx="58"
                cy="30"
                r={6 * pulse}
                fill="#38bdf8"
                filter="drop-shadow(0 0 6px #38bdf8)"
              />
            </svg>
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 18,
              fontWeight: 900,
              color: '#ef4444',
              marginTop: 10,
            }}
          >
            NANO
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.numbers,
              fontSize: 14,
              color: '#ffffff',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            &lt; 1 µm
          </div>
          <div style={{ fontSize: 13, color: '#fca5a5', marginTop: 4 }}>Crosses Barriers</div>
        </div>
      </div>

      {/* Bottom Medical Warning Footer */}
      <div
        style={{
          marginTop: 14,
          padding: '12px 18px',
          borderRadius: 12,
          backgroundColor: 'rgba(7, 10, 19, 0.7)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: 15,
            color: '#f87171',
            fontWeight: 600,
          }}
        >
          Reported in: Blood, Lung Tissue, Placenta & Brain (study-dependent rates).
        </span>
      </div>
    </div>
  );
};
