// src/components/graphics/DocumentaryImage.tsx
import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { THEME } from '../../styles/theme';

export interface DocumentaryImageProps {
  /** Relative path inside public/ or URL */
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  durationInFrames: number;
  badgeTag?: string;
  badgeColor?: string;
  caption?: string;
  zoomDirection?: 'in' | 'out';
  overlayGradient?: boolean;
}

export const DocumentaryImage: React.FC<DocumentaryImageProps> = ({
  src,
  alt = 'Documentary Visual',
  width = 860,
  height = 820,
  durationInFrames,
  badgeTag,
  badgeColor = THEME.colors.accentAmber,
  caption,
  zoomDirection = 'in',
  overlayGradient = true,
}) => {
  const frame = useCurrentFrame();

  const scale =
    zoomDirection === 'in'
      ? interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
          extrapolateRight: 'clamp',
        })
      : interpolate(frame, [0, durationInFrames], [1.08, 1.0], {
          extrapolateRight: 'clamp',
        });

  // Resolve static file path if not starting with http/data:
  const imageSrc =
    src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')
      ? src
      : staticFile(src);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 28,
        overflow: 'hidden',
        border: '1.5px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
        backgroundColor: '#0a0d18',
      }}
    >
      {/* Zooming / drifting image */}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Img
          src={imageSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Cinematic dark vignette overlays for text legibility */}
      {overlayGradient && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(7, 10, 19, 0.65) 0%, transparent 25%, transparent 60%, rgba(7, 10, 19, 0.85) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top Badge Tag */}
      {badgeTag && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 9999,
            backgroundColor: 'rgba(7, 10, 19, 0.8)',
            border: `1.5px solid ${badgeColor}`,
            boxShadow: `0 0 16px ${badgeColor}33`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: badgeColor,
              boxShadow: `0 0 8px ${badgeColor}`,
            }}
          />
          <span
            style={{
              fontFamily: THEME.fonts.heading,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            {badgeTag}
          </span>
        </div>
      )}

      {/* Bottom Caption Overlay */}
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 28px',
            background:
              'linear-gradient(0deg, rgba(7, 10, 19, 0.95) 0%, rgba(7, 10, 19, 0.7) 70%, transparent 100%)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: THEME.fonts.body,
              fontSize: 24,
              fontWeight: 500,
              color: '#e2e8f0',
              lineHeight: 1.4,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
            }}
          >
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};
