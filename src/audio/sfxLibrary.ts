// src/audio/sfxLibrary.ts

export type SfxSoundId =
  | 'pop'
  | 'whoosh'
  | 'sub-drop'
  | 'cash-register'
  | 'chime'
  | 'clock-tick';

export interface SfxDefinition {
  file: string;
  defaultVolume: number;
  description: string;
}

export const SFX_REGISTRY: Record<SfxSoundId, SfxDefinition> = {
  pop: {
    file: 'sfx/pop.wav',
    defaultVolume: 0.65,
    description: 'Snappy UI pop for data point reveals, bullet points, and chart bars.',
  },
  whoosh: {
    file: 'sfx/whoosh.wav',
    defaultVolume: 0.48,
    description: 'Cinematic air whoosh for camera pans and scene transitions.',
  },
  'sub-drop': {
    file: 'sfx/sub-drop.wav',
    defaultVolume: 0.82,
    description: 'Deep sub-bass impact for dramatic revelations, climax drops, and shock stats.',
  },
  'cash-register': {
    file: 'sfx/cash-register.wav',
    defaultVolume: 0.70,
    description: 'Metallic chime for economic counters, debt clocks, and cost comparisons.',
  },
  chime: {
    file: 'sfx/chime.wav',
    defaultVolume: 0.60,
    description: 'Harmonic glass chime for epiphanies, key takeaways, and positive resolutions.',
  },
  'clock-tick': {
    file: 'sfx/clock-tick.wav',
    defaultVolume: 0.45,
    description: 'Mechanical click for suspense, countdowns, and compounding time loops.',
  },
};

/**
 * Resolves any sound ID to its audio file path in the public directory.
 * If the sound is in the registry, returns its exact path; otherwise defaults to .wav or .mp3.
 */
export const resolveSfxPath = (soundId: string): string => {
  if (soundId in SFX_REGISTRY) {
    return SFX_REGISTRY[soundId as SfxSoundId].file;
  }
  // Fallback to sfx/<soundId>.wav if not specified
  return `sfx/${soundId}.wav`;
};

/**
 * Returns the recommended volume level for a given sound ID.
 */
export const getSfxDefaultVolume = (soundId: string): number => {
  if (soundId in SFX_REGISTRY) {
    return SFX_REGISTRY[soundId as SfxSoundId].defaultVolume;
  }
  return 0.5;
};
