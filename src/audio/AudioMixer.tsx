// src/audio/AudioMixer.tsx
import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { VideoContent } from '../types/content.types';
import { resolveSfxPath, getSfxDefaultVolume } from './sfxLibrary';

export interface AudioMixerProps {
  content: VideoContent;
}

/**
 * Three-track audio mixing engine with side-chain ducking,
 * synchronized SFX triggers, and zero-volume dramatic silence.
 */
export const AudioMixer: React.FC<AudioMixerProps> = ({ content }) => {
  const { fps } = useVideoConfig();

  // Find climax scene for dramatic silence window
  let climaxStartFrame = 0;
  let climaxPauseDuration = 0;
  let accumulatedFrames = 0;

  for (const scene of content.scenes) {
    if (scene.type === 'dramatic-climax') {
      climaxStartFrame = accumulatedFrames;
      climaxPauseDuration = scene.dramaticPauseFrames;
      break;
    }
    accumulatedFrames += scene.durationInFrames;
  }

  const musicFile = content.backgroundMusic?.file;
  const baseVolume = content.backgroundMusic?.baseVolume ?? 0.10;
  const duckedVolume = content.backgroundMusic?.duckedVolume ?? 0.04;
  const narrationDurationFrames = Math.round(content.narration.durationInSeconds * fps);

  return (
    <>
      {/* 1. Main Narration Track */}
      {content.narration.audioFile && (
        <Audio
          src={staticFile(content.narration.audioFile)}
          volume={1.0}
        />
      )}

      {/* 2. Background Music with Dynamic Ducking & Climax Silence */}
      {musicFile && (
        <Audio
          src={staticFile(musicFile)}
          volume={(frame) => {
            // Cut music completely during dramatic pause in Climax
            if (
              climaxPauseDuration > 0 &&
              frame >= climaxStartFrame &&
              frame <= climaxStartFrame + climaxPauseDuration
            ) {
              return 0;
            }
            // Duck during active narration
            const narrationActive = frame <= narrationDurationFrames;
            return narrationActive ? duckedVolume : baseVolume;
          }}
        />
      )}

      {/* 3. Synchronized SFX Cue Sequence */}
      {content.sfxEvents?.map((cue, idx) => {
        const sfxFile = resolveSfxPath(cue.soundId);
        const volume = cue.volume ?? getSfxDefaultVolume(cue.soundId);

        return (
          <Sequence
            key={`sfx-${idx}-${cue.soundId}-${cue.frame}`}
            from={cue.frame}
            durationInFrames={Math.round(fps * 2)}
          >
            <Audio
              src={staticFile(sfxFile)}
              volume={volume}
            />
          </Sequence>
        );
      })}
    </>
  );
};
