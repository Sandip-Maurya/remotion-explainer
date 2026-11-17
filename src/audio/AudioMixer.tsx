// src/audio/AudioMixer.tsx
import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import type { AnyEpisodeContent, EpisodeBeatV1, SceneData } from '../types/content.types';
import { resolveSfxPath, getSfxDefaultVolume } from './sfxLibrary';

export interface AudioMixerProps {
  content: AnyEpisodeContent;
}

function findClimaxSilence(content: AnyEpisodeContent): {
  startFrame: number;
  pauseDuration: number;
} {
  let accumulated = 0;

  if ('beats' in content && content.beats && content.beats.length > 0) {
    for (const beat of content.beats as EpisodeBeatV1[]) {
      const pause = beat.props?.dramaticPauseFrames;
      if (typeof pause === 'number' && pause > 0) {
        return { startFrame: accumulated, pauseDuration: pause };
      }
      accumulated += beat.durationInFrames;
    }
    return { startFrame: 0, pauseDuration: 0 };
  }

  accumulated = 0;
  for (const scene of (content as { scenes?: SceneData[] }).scenes ?? []) {
    if (scene.type === 'dramatic-climax') {
      return {
        startFrame: accumulated,
        pauseDuration: scene.dramaticPauseFrames,
      };
    }
    accumulated += scene.durationInFrames;
  }

  return { startFrame: 0, pauseDuration: 0 };
}

/**
 * Three-track audio mixing engine with side-chain ducking,
 * synchronized SFX triggers, and zero-volume dramatic silence.
 */
export const AudioMixer: React.FC<AudioMixerProps> = ({ content }) => {
  const { fps } = useVideoConfig();
  const { startFrame: climaxStartFrame, pauseDuration: climaxPauseDuration } =
    findClimaxSilence(content);

  const musicFile = content.backgroundMusic?.file;
  const baseVolume = content.backgroundMusic?.baseVolume ?? 0.1;
  const duckedVolume = content.backgroundMusic?.duckedVolume ?? 0.04;
  const narrationDurationFrames = Math.round(content.narration.durationInSeconds * fps);

  return (
    <>
      {content.narration.audioFile && (
        <Audio src={staticFile(content.narration.audioFile)} volume={1.0} />
      )}

      {musicFile && (
        <Audio
          src={staticFile(musicFile)}
          volume={(frame) => {
            if (
              climaxPauseDuration > 0 &&
              frame >= climaxStartFrame &&
              frame <= climaxStartFrame + climaxPauseDuration
            ) {
              return 0;
            }
            const narrationActive = frame <= narrationDurationFrames;
            return narrationActive ? duckedVolume : baseVolume;
          }}
        />
      )}

      {content.sfxEvents?.map((cue, idx) => {
        const sfxFile = resolveSfxPath(cue.soundId);
        const volume = cue.volume ?? getSfxDefaultVolume(cue.soundId);

        return (
          <Sequence
            key={`sfx-${idx}-${cue.soundId}-${cue.frame}`}
            from={cue.frame}
            durationInFrames={Math.round(fps * 2)}
          >
            <Audio src={staticFile(sfxFile)} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};
