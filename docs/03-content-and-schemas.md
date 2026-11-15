# 03. Content Models, Schemas & Data Contracts

## 1. Architectural Mandate: Complete Content Decoupling

The Remotion code is an **abstract rendering engine**. It must know *how* to draw an animated bar chart, a kinetic subtitle, or an emotional vignette, but it must **never hardcode what is being explained**.

All scripts, numbers, scene sequences, and audio cues are defined in a structured **Content Model** (`content.json` or `video.config.ts`).

---

## 2. Master TypeScript Schema (`src/types/content.types.ts`)

```ts
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

// --- Master Video Object ---

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
  captions: CaptionToken[];
  scenes: SceneData[];
}
```

---

## 3. Production Example: `videos/001-why-inflation-hurts/content.json`

```json
{
  "id": "001-why-inflation-hurts",
  "title": "Why $100 Isn't $100 Anymore",
  "topic": "Economics",
  "aspectRatio": "9:16",
  "fps": 30,
  "totalDurationInFrames": 1890,
  "narrativeMood": "tension-to-clarity",
  "narration": {
    "engine": "edge-tts",
    "voiceId": "en-US-ChristopherNeural",
    "audioFile": "narration.mp3",
    "durationInSeconds": 63.0
  },
  "backgroundMusic": {
    "file": "ambient-tension-synth.mp3",
    "baseVolume": 0.10,
    "duckedVolume": 0.04
  },
  "sfxEvents": [
    { "frame": 5, "soundId": "sub-drop", "volume": 0.7 },
    { "frame": 155, "soundId": "pop", "volume": 0.4 },
    { "frame": 380, "soundId": "whoosh", "volume": 0.5 },
    { "frame": 850, "soundId": "cash-register", "volume": 0.5 },
    { "frame": 1400, "soundId": "chime", "volume": 0.6 }
  ],
  "scenes": [
    {
      "id": "scene-1-hook",
      "type": "hook",
      "durationInFrames": 150,
      "headline": "Somebody is quietly taking 4 hours of your work every week.",
      "subtext": "You never signed up for it.",
      "highlightWord": "quietly",
      "metaphor": "dollar-burn"
    },
    {
      "id": "scene-2-stakes",
      "type": "human-stakes",
      "durationInFrames": 300,
      "personaLabel": "Your Grocery Cart",
      "comparison": {
        "pastLabel": "2020",
        "pastValue": "$100 (Full Cart)",
        "presentLabel": "Today",
        "presentValue": "$142 (Half Empty)"
      },
      "impactStatement": "You did not work any less. So where did the missing food go?"
    },
    {
      "id": "scene-3-chart",
      "type": "chart-explanation",
      "durationInFrames": 600,
      "chartType": "bar",
      "chartTitle": "Purchasing Power of the Dollar",
      "unit": "%",
      "data": [
        { "label": "2020", "value": 100 },
        { "label": "2022", "value": 85 },
        { "label": "2024", "value": 72 },
        { "label": "2026", "value": 61 }
      ],
      "highlightIndex": 3,
      "keyTakeaway": "39% of your purchasing power vanished in 6 years."
    },
    {
      "id": "scene-4-climax",
      "type": "dramatic-climax",
      "durationInFrames": 450,
      "epiphanyHeadline": "Inflation isn't prices rising.",
      "punchline": "It is your life energy being quietly diluted.",
      "dramaticPauseFrames": 45,
      "subBassHit": true
    },
    {
      "id": "scene-5-payoff",
      "type": "empowerment-payoff",
      "durationInFrames": 390,
      "coreLesson": "Don't save currency that can be printed. Own real assets.",
      "callToAction": "Follow to protect your time.",
      "loopTransitionPhrase": "Because every single week..."
    }
  ]
}
```

---

## 4. Asset Guidelines & Normalization

To ensure consistent broadcast quality across every rendered video:

### Audio Standards
* **Sample Rate:** `44,100 Hz` (44.1 kHz), 16-bit Stereo or Mono.
* **Target Loudness:** `-14 LUFS` (standard for YouTube Shorts / Reels).
* **True Peak:** Maximum `-1.0 dBFS` to prevent mobile clipping distortion.
* **Music Ducking:** Side-chain volume drops to `0.04` whenever `narration.mp3` is active.

### Typography
* **Heading Font:** Montserrat (Bold / ExtraBold, 900 weight).
* **Body Font:** Inter (SemiBold / Medium, 600 weight).
* **Data / Numbers:** JetBrains Mono (Bold tabular numerals, zero width shifting).

---

## 5. Schema Validation & Integrity Rules

To guarantee render determinism, the build pipeline or test suite should enforce the following invariants before rendering:

1. **Frame Sum Equivalence:**  
   $$\sum_{i=1}^{N} \text{scene}_i.\text{durationInFrames} == \text{totalDurationInFrames}$$
   *(For episode `001`: $150 + 300 + 600 + 450 + 390 = 1890$ frames).*
2. **Audio-to-Video Duration Synchronization:**  
   $$\text{totalDurationInFrames} == \lceil \text{narration.durationInSeconds} \times \text{fps} \rceil$$
   *(For episode `001`: $\lceil 63.0 \times 30 \rceil = 1890$ frames).*
3. **Caption Boundary Invariant:**  
   Every caption token must fall strictly within the video bounds:
   $$0 \le \text{token.startMs} < \text{token.endMs} \le \frac{\text{totalDurationInFrames}}{\text{fps}} \times 1000$$
4. **Dramatic Pause Constraint:**  
   For `dramatic-climax` scenes, `dramaticPauseFrames` must satisfy $30 \le \text{dramaticPauseFrames} \le 60$ frames (1.0 to 2.0 seconds at 30 fps) to guarantee an emotionally effective silent drop without dead air.
5. **Mobile Safe Area Constraint:**  
   Visual layouts must remain within the 880 × 1420 px safe rectangle (`left: 60px`, `right: 140px`, `top: 180px`, `bottom: 320px`).

---

## 6. Master Audio Schema (`src/types/audio.types.ts`)

```ts
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
```

---

## 7. Cross-Document Architecture Links

* **[01. Storytelling, Narrative & Sensitization Bible](file:///c:/Users/skmpa/vdo/rm/docs/01-storytelling-and-creative.md):** 5-beat emotional arc, SFX taxonomy, and script copywriting examples.
* **[02. Technical Architecture & Engineering Specification](file:///c:/Users/skmpa/vdo/rm/docs/02-technical-architecture.md):** Remotion component implementations, `<AudioMixer />`, and SVG charting engine.
* **[04. Production Runbook, Audio Pipelines & AI Agent Guardrails](file:///c:/Users/skmpa/vdo/rm/docs/04-production-and-agent-guide.md):** Audio generation CLI tools, AI agent guardrails, and validation runbook.
