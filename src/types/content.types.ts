// src/types/content.types.ts

export type NarrativeMood =
  | 'tension-to-clarity'
  | 'curiosity-to-wonder'
  | 'myth-inversion'
  | 'urgent-escalation';

export type SceneType =
  | 'hook'
  | 'human-stakes'
  | 'chart-explanation'
  | 'dramatic-climax'
  | 'empowerment-payoff';

// --- Scene Schemas ---

export interface SceneTransitionConfig {
  type: 'fade' | 'slide' | 'wipe' | 'dissolve';
  durationInFrames: number;
}

export interface HookSceneData {
  id: string;
  type: 'hook';
  durationInFrames: number;
  headline: string;
  subtext?: string;
  highlightWord?: string;
  metaphor?: 'padlock' | 'empty-cart' | 'clock' | 'dollar-burn';
  transition?: SceneTransitionConfig;
}

export interface HumanStakesSceneData {
  id: string;
  type: 'human-stakes';
  durationInFrames: number;
  personaLabel: string; // e.g., "Your Monthly Rent", "The Average Grocery Cart"
  comparison: {
    pastLabel: string;
    pastValue: string | number;
    presentLabel: string;
    presentValue: string | number;
  };
  impactStatement: string; // e.g., "You work 3 hours more each week just to break even."
  transition?: SceneTransitionConfig;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartExplainerSceneData {
  id: string;
  type: 'chart-explanation';
  durationInFrames: number;
  chartType: 'bar' | 'line';
  chartTitle: string;
  data: ChartDataPoint[];
  unit?: string;
  highlightIndex?: number;
  keyTakeaway: string;
  transition?: SceneTransitionConfig;
}

export interface DramaticClimaxSceneData {
  id: string;
  type: 'dramatic-climax';
  durationInFrames: number;
  epiphanyHeadline: string; // The core paradigm shift
  punchline: string;
  dramaticPauseFrames: number; // Duration of silence on music track (30–60 frames)
  subBassHit: boolean;
  transition?: SceneTransitionConfig;
}

export interface PayoffSceneData {
  id: string;
  type: 'empowerment-payoff';
  durationInFrames: number;
  coreLesson: string;
  callToAction: string;
  loopTransitionPhrase: string; // Last word connects back to the video hook
  transition?: SceneTransitionConfig;
}

export type SceneData =
  | HookSceneData
  | HumanStakesSceneData
  | ChartExplainerSceneData
  | DramaticClimaxSceneData
  | PayoffSceneData;

// --- Audio & Subtitles ---

export interface SfxCue {
  frame: number;
  soundId: 'sub-drop' | 'pop' | 'whoosh' | 'cash-register' | 'chime' | 'clock-tick';
  volume?: number;
}

export interface CaptionToken {
  text: string;
  startMs: number;
  endMs: number;
  isEmphasized?: boolean;
}

// --- Master Video Object (legacy compositions: scenes[]) ---

export interface VideoContent {
  id: string;
  title: string;
  topic: 'Economics' | 'Technology' | 'Psychology' | 'Society';
  aspectRatio: '9:16';
  fps: number;
  totalDurationInFrames: number;

  narrativeMood: NarrativeMood;

  narration: {
    engine: 'edge-tts' | 'elevenlabs';
    voiceId: string;
    audioFile: string;
    durationInSeconds: number;
  };

  backgroundMusic?: {
    file: string;
    baseVolume: number; // Usually 0.08 - 0.12
    duckedVolume: number; // 0.04 during voiceover
  };

  sfxEvents: SfxCue[];
  captions?: CaptionToken[];
  /** @deprecated Prefer EpisodeContentV1.beats — kept for legacy compositions */
  scenes: SceneData[];
}

// --- Schema v1: template engine episodes (beats + templateId) ---

export type TemplateId =
  | 'decision-compare'
  | 'data-explainer'
  | 'evidence-explainer'
  | 'custom';


export interface EpisodeBeatV1 {
  id: string;
  /** Must be allowed by the resolved template */
  slot: string;
  durationInFrames: number;
  props: Record<string, unknown>;
}

export interface EpisodeContentV1 {
  id: string;
  title: string;
  topic: 'Economics' | 'Technology' | 'Psychology' | 'Society';
  aspectRatio: '9:16';
  fps: number;
  totalDurationInFrames: number;

  templateId: TemplateId;
  templateVersion: number;

  narrativeMood: NarrativeMood;

  narration: {
    engine: 'edge-tts' | 'elevenlabs';
    voiceId: string;
    audioFile: string;
    durationInSeconds: number;
  };

  backgroundMusic?: {
    file: string;
    baseVolume: number;
    duckedVolume: number;
  };

  sfxEvents: SfxCue[];
  /** Ordered beats; slot must be allowed by the template */
  beats: EpisodeBeatV1[];
}

/** Content that compositions may read during migration (legacy scenes or v1 beats). */
export type AnyEpisodeContent = VideoContent | EpisodeContentV1;
