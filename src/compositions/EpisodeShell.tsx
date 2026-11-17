// src/compositions/EpisodeShell.tsx
import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame } from 'remotion';
import { THEME } from '../styles/theme';
import { ShortsSafeZone } from '../components/core/ShortsSafeZone';
import { ProgressBar } from '../components/core/ProgressBar';
import { AudioMixer } from '../audio/AudioMixer';
import { CameraDrift } from '../components/motion/CameraDrift';
import { CameraMicroBump } from '../components/motion/CameraMicroBump';
import { VideoContent } from '../types/content.types';

export interface EpisodeShellProps {
  content: VideoContent;
  showSafeZone?: boolean;
  progressColor?: string;
  backgroundColor?: string;
  ambientColor?: string;
  /** Must be direct <Series.Sequence /> children */
  children: React.ReactNode;
}

/**
 * Shared episode chrome for content-first Shorts:
 * ambient glow, Series stage, progress bar, AudioMixer, optional safe-zone overlay.
 *
 * Important: Remotion <Series /> only accepts <Series.Sequence /> as direct children.
 * Wrap beat bodies with <BeatMotion> inside each Sequence (not as Series children).
 */
export const EpisodeShell: React.FC<EpisodeShellProps> = ({
  content,
  showSafeZone = false,
  progressColor = THEME.colors.accentBlue,
  backgroundColor = THEME.colors.bgMidnight,
  ambientColor = 'rgba(56, 189, 248, 0.08)',
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          top: '18%',
          left: '0%',
          borderRadius: 550,
          background: `radial-gradient(circle, ${ambientColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
          transform: `translateY(${Math.sin(frame * 0.03) * 15}px)`,
        }}
      />

      <Series>{children}</Series>

      <ProgressBar color={progressColor} height={5} />
      <AudioMixer content={content} />
      {showSafeZone && <ShortsSafeZone visible={true} mode="outline" />}
    </AbsoluteFill>
  );
};

export interface BeatMotionProps {
  children: React.ReactNode;
  durationInFrames: number;
  /** Enable continuous Ken Burns drift (default true) */
  drift?: boolean;
  scaleFrom?: number;
  scaleTo?: number;
  driftOrigin?: string;
  /** Optional micro-bump impact frame relative to beat start */
  bumpAt?: number;
  bumpIntensity?: number;
  bumpDurationFrames?: number;
}

/**
 * Camera drift / micro-bump wrappers for use INSIDE a <Series.Sequence>.
 */
export const BeatMotion: React.FC<BeatMotionProps> = ({
  children,
  durationInFrames,
  drift = true,
  scaleFrom = 1.0,
  scaleTo = 1.04,
  driftOrigin = 'center 45%',
  bumpAt,
  bumpIntensity = 6,
  bumpDurationFrames = 8,
}) => {
  let body: React.ReactNode = children;

  if (typeof bumpAt === 'number') {
    body = (
      <CameraMicroBump
        triggerFrame={bumpAt}
        intensity={bumpIntensity}
        durationFrames={bumpDurationFrames}
      >
        {body}
      </CameraMicroBump>
    );
  }

  if (drift) {
    body = (
      <CameraDrift
        durationInFrames={durationInFrames}
        scaleFrom={scaleFrom}
        scaleTo={scaleTo}
        origin={driftOrigin}
      >
        {body}
      </CameraDrift>
    );
  }

  return <>{body}</>;
};

/** @deprecated Use Series.Sequence + BeatMotion — Series rejects wrapper children. */
export const BeatSequence = BeatMotion;
