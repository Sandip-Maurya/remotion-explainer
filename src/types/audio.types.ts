// src/types/audio.types.ts

export type SfxSoundId =
  | 'sub-drop'
  | 'pop'
  | 'whoosh'
  | 'cash-register'
  | 'chime'
  | 'clock-tick';

export interface SfxCue {
  frame: number;
  soundId: SfxSoundId;
  volume?: number; // 0.0 to 1.0 (default: 0.5)
}

export interface CaptionToken {
  text: string;
  startMs: number;
  endMs: number;
  isEmphasized?: boolean;
}

export interface BackgroundMusicTrack {
  file: string;
  baseVolume: number;   // Default 0.08 - 0.12
  duckedVolume: number; // Default 0.04 during voiceover
}

export interface NarrationTrack {
  engine: 'edge-tts' | 'elevenlabs';
  voiceId: string;
  audioFile: string;
  durationInSeconds: number;
}
