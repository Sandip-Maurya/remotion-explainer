# 02. Technical Architecture & Engineering Specification

## 1. Core Engineering Principle: Inbuilt First-Party Priority

To maintain extreme render determinism, lightning-fast build speeds, and zero dependency rot, we enforce a strict package policy:

> **The Remotion-First Rule:**  
> Always prioritize Remotion's official first-party packages (`remotion`, `@remotion/*`) and native SVG/CSS before adding external npm libraries.  
> Third-party dependencies are permitted only when first-party solutions do not exist.

### Target Engine Specification
* **Remotion Version:** `v4.0.x` (Pinned to modern Remotion 4.x runtime).
* **Language & Runtime:** TypeScript 5+, React 18/19.
* **Styling Engine:** Tailwind CSS integrated via standard PostCSS (`global.css`) or `@remotion/tailwind`.
* **Rendering Engine:** Headless Chromium with deterministic frame-by-frame stepping (`--gl=angle` recommended for Windows).

---

## 2. First-Party Remotion Ecosystem Mapping

| Capability | Official Package | Key Components & APIs | Why We Use It |
|---|---|---|---|
| **Core Animation Engine** | `remotion` (v4.0+) | `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, `interpolateColors()`, `spring()`, `measureSpring()`, `Easing`, `<Composition>`, `<Sequence>`, `<Audio>`, `<AbsoluteFill>`, `delayRender()`, `continueRender()`, `staticFile()` | Frame-by-frame deterministic rendering, physics-based springs, color interpolation, asset preloading. |
| **Scene Transitions** | `@remotion/transitions` | `<TransitionSeries>`, `slide()`, `wipe()`, `fade()`, `flip()`, `circularWipe()`, `dissolve()` | Seamless orchestration between narrative beats without manual frame offsetting math. |
| **Geometric Motion Graphics** | `@remotion/shapes` | `<Arrow />`, `<Rect />`, `<Circle />`, `<Triangle />`, `<Callout />`, `<Star />`, `<Pie />`, `<Polygon />`, `makeArrow()` | Vector primitives for callouts, visual pointers, metaphor shapes, and badges. |
| **Path Morphing & Line Drawing** | `@remotion/paths` | `evolvePath()`, `interpolatePath()`, `getLength()`, `getPointAtLength()`, `cutPath()` | Drawing SVG trendlines, connecting node graphs, and progressive stroke animations. |
| **Kinetic Word Subtitles** | `@remotion/captions` | `parseSrt()`, `parseVtt()`, caption tokens with millisecond timestamps | Word-by-word highlighted subtitles with spring bounce animations. |
| **Audio Reactivity** | `@remotion/media-utils` | `useAudioData()`, `visualizeAudio()`, `getVideoMetadata()` | Extracting frequency bands for subtle pulsating audio reactive elements. |
| **Font Management** | `@remotion/google-fonts` | `loadFont()` (Montserrat, Inter, JetBrains Mono) | Guarantees web fonts are fully loaded before rendering frames, eliminating layout shifting. |

---

## 3. Canonical Project Directory Structure

```text
explainer-channel/
├─ package.json                    # Remotion v4, React, Tailwind CSS, TypeScript dependencies
├─ tsconfig.json                   # Strict TypeScript compiler options
├─ tailwind.config.js              # Theme tokens & safe zone layout extensions
├─ remotion.config.ts              # Output codec, concurrency, chromium flags (--gl=angle)
├─ README.md                       # Project overview & documentation index
│
├─ docs/                           # Authoritative System Documentation (Single Source of Truth)
│  ├─ 01-storytelling-and-creative.md
│  ├─ 02-technical-architecture.md
│  ├─ 03-content-and-schemas.md
│  └─ 04-production-and-agent-guide.md
│
├─ scripts/
│  ├─ tts/
│  │  ├─ generate-edge.py          # Free Edge-TTS prototype audio & millisecond timestamps
│  │  └─ generate-elevenlabs.ts    # Production broadcast TTS with character/word alignment
│  └─ render.ts                    # Local CLI batch render wrapper
│
├─ src/
│  ├─ index.ts                     # Remotion root entrypoint
│  ├─ Root.tsx                     # Composition registration & font preloading
│  │
│  ├─ components/
│  │  ├─ core/
│  │  │  ├─ Title.tsx              # Expressive headline with spring pop entrance
│  │  │  ├─ BigNumber.tsx          # Animated counting metric with scale bounce
│  │  │  ├─ TextBlock.tsx          # Clean body text with highlight styling
│  │  │  ├─ ProgressBar.tsx        # Top retention progress indicator
│  │  │  ├─ ShortsSafeZone.tsx     # Development visual overlay guide for mobile UI bounds
│  │  │  └─ EndCard.tsx            # Channel outro & loop back trigger
│  │  │
│  │  ├─ storytelling/             # Emotional & Narrative Primitives (.tsx)
│  │  │  ├─ HumanStakesCard.tsx    # "What this means for you" personal stakes card
│  │  │  ├─ DramaticQuote.tsx      # Emotive realization statement with dim background
│  │  │  ├─ TensionVignette.tsx    # Pulsing vignette shadow overlay for suspense
│  │  │  ├─ BeforeAfterSplit.tsx   # Contrast comparison (2020 vs Today)
│  │  │  └─ MetaphorIcon.tsx       # SVG visual metaphors (padlock, empty-cart, clock, dollar-burn)
│  │  │
│  │  ├─ data/                     # Pure SVG Informational & Data Components (.tsx)
│  │  │  ├─ BarChart.tsx           # Deterministic SVG animated bar chart
│  │  │  ├─ LineChart.tsx          # SVG line chart animated via @remotion/paths
│  │  │  ├─ MetricCard.tsx         # Comparative stat card with change indicator
│  │  │  └─ SimpleTable.tsx        # Side-by-side metric breakdown
│  │  │
│  │  ├─ graphics/                 # Geometric & Vector Primitives (.tsx)
│  │  │  ├─ AnimatedArrow.tsx      # Native arrow via @remotion/shapes
│  │  │  ├─ CalloutBox.tsx         # Native callout bubble via @remotion/shapes
│  │  │  └─ StepTimeline.tsx       # Progressive step-by-step connector
│  │  │
│  │  └─ captions/
│  │     └─ KineticCaptions.tsx    # Word-by-word subtitles with spring pops & emphasis
│  │
│  ├─ scenes/                      # 5-Beat Narrative Scene Compositions (.tsx)
│  │  ├─ HookScene.tsx             # Beat 1: High-impact curiosity or emotional paradox
│  │  ├─ AgitationScene.tsx        # Beat 2: Human stakes and lived tension
│  │  ├─ MechanismScene.tsx        # Beat 3: Data, mechanics & chart breakdown
│  │  ├─ ClimaxScene.tsx           # Beat 4: Paradigm epiphany with dramatic silence
│  │  └─ PayoffScene.tsx           # Beat 5: Core takeaway & seamless loop bridge
│  │
│  ├─ audio/
│  │  ├─ AudioMixer.tsx            # Narration, side-chain music ducking, and SFX trigger engine
│  │  └─ sfxLibrary.ts             # Audio asset mapping for all soundId cues
│  │
│  ├─ styles/
│  │  ├─ theme.ts                  # Centralized color tokens, font families, spring presets
│  │  └─ global.css                # Tailwind utility directives and base reset
│  │
│  └─ types/
│     ├─ content.types.ts          # Master TypeScript schema for episodes & scenes
│     └─ audio.types.ts            # Sound effects, ducking envelopes & caption token interfaces
│
├─ videos/                         # Episode Workspace Folders
│  └─ 001-why-inflation-hurts/
│     ├─ script.txt                # Plain text voiceover script for TTS synthesis
│     ├─ script.md                 # Storyboard with emotional tags and director cues
│     ├─ content.json              # Declarative scene & audio config adhering to content.types.ts
│     ├─ narration.mp3             # Synthesized voiceover audio file
│     ├─ captions.json             # Word-level timestamp array
│     ├─ assets/                   # Episode-specific custom SVGs or images
│     └─ output/                   # Final rendered 1080x1920 MP4
│
└─ assets/                         # Global Shared Static Assets
   ├─ fonts/                       # Local font fallbacks (Montserrat, Inter, JetBrains Mono)
   ├─ sfx/                         # Pre-trimmed broadcast audio cues (sub-drop, pop, whoosh, etc.)
   └─ music/                       # Mood-aligned audio tracks (tension, ambient, synth)
```

---

## 4. Mobile Safe Zones & Layout Geometry

Vertical video interfaces (YouTube Shorts, TikTok, Instagram Reels) have heavy native UI overlays. Content placed in the perimeter will be covered or unclickable.

```text
+------------------------------------------+ (0, 0)
| [X] Top Danger Zone (180px)              | <-- Search bar, camera icon, audio track
+--------------------+---------------------+
|                    |                     |
| [X] Left           |  SAFE CONTENT AREA  |
| Danger Zone (60px) |     (880 x 1420)    | <-- All text, titles, charts,
| Screen curvature & |                     |     and captions MUST live here!
| edge navigation    +---------------------+
|                    | [X] Right           |
|                    | Danger Zone (140px) | <-- Likes, comments, shares, remix buttons
+--------------------+---------------------+
| [X] Bottom Danger Zone (320px)           | <-- Channel avatar, handle, subscribe button,
+------------------------------------------+     title, and scrubber bar
(0, 1920)
```

### `<ShortsSafeZone />` Development Guide Component

During local development and preview in Remotion Studio, this overlay displays the exact cutouts.

```tsx
// src/components/core/ShortsSafeZone.tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';

export const ShortsSafeZone: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 9999 }}>
      {/* Top Danger Buffer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, background: 'rgba(239, 68, 68, 0.25)', borderBottom: '2px dashed #ef4444' }}>
        <span style={{ color: '#ef4444', fontSize: 24, fontWeight: 'bold', padding: 16, display: 'block' }}>
          TOP DANGER ZONE (180px) — YouTube Header & Audio Info
        </span>
      </div>

      {/* Left Danger Buffer */}
      <div style={{ position: 'absolute', top: 180, bottom: 320, left: 0, width: 60, background: 'rgba(239, 68, 68, 0.25)', borderRight: '2px dashed #ef4444' }}>
        <span style={{ color: '#ef4444', fontSize: 16, fontWeight: 'bold', writingMode: 'vertical-rl', padding: 8 }}>
          LEFT (60px) — Edge Padding
        </span>
      </div>

      {/* Right Danger Buffer */}
      <div style={{ position: 'absolute', top: 180, bottom: 320, right: 0, width: 140, background: 'rgba(239, 68, 68, 0.25)', borderLeft: '2px dashed #ef4444' }}>
        <span style={{ color: '#ef4444', fontSize: 20, fontWeight: 'bold', writingMode: 'vertical-rl', padding: 16 }}>
          RIGHT DANGER ZONE (140px) — Action Buttons
        </span>
      </div>

      {/* Bottom Danger Buffer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 320, background: 'rgba(239, 68, 68, 0.25)', borderTop: '2px dashed #ef4444' }}>
        <span style={{ color: '#ef4444', fontSize: 24, fontWeight: 'bold', padding: 16, display: 'block' }}>
          BOTTOM DANGER ZONE (320px) — Avatar, Subscribe, Title & Captions
        </span>
      </div>

      {/* Recommended Captions Safe Region (Upper portion of lower third) */}
      <div style={{ position: 'absolute', bottom: 330, left: 80, right: 160, height: 160, border: '2px dotted #38bdf8', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#38bdf8', fontSize: 22, fontWeight: 'bold' }}>
          RECOMMENDED CAPTIONS REGION (Bottom: 330px - 490px)
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 5. Pure SVG & Remotion Charting Strategy

### Why Avoid Heavy 3rd-Party Chart Libraries (Chart.js, Canvas, etc.)
- Most JavaScript charting libraries run their own internal animation loops (`requestAnimationFrame`, `setTimeout`), which desync or freeze inside Remotion's headless Chromium frame-by-frame renderer.
- **Solution:** Build pure SVG components whose positions, dimensions, fills, and labels are direct mathematical functions of Remotion’s `spring()` and `interpolate()` hooks. Never use real-time CSS transitions (`transition: ...`), which desync during offline rendering.

### Animated SVG Bar Chart Implementation (100% Deterministic Vector)

```tsx
// src/components/data/BarChart.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors } from 'remotion';

export interface BarData {
  label: string;
  value: number;
}

export const BarChart: React.FC<{
  data: BarData[];
  unit?: string;
  highlightIndex?: number;
  width?: number;
  height?: number;
}> = ({ data, unit = '', highlightIndex, width = 800, height = 500 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barCount = data.length;
  const paddingX = 40;
  const bottomLabelHeight = 60;
  const topLabelHeight = 50;
  const usableHeight = height - bottomLabelHeight - topLabelHeight;
  const availableWidth = width - paddingX * 2;
  const gap = 30;
  const barWidth = Math.min(140, (availableWidth - (barCount - 1) * gap) / barCount);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.5" />
        </filter>
      </defs>

      {data.map((item, index) => {
        // Stagger each bar entrance by 6 frames
        const entrance = spring({
          frame: frame - index * 6,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const targetBarHeight = (item.value / maxValue) * usableHeight;
        const currentHeight = interpolate(entrance, [0, 1], [0, targetBarHeight]);
        const isHighlighted = highlightIndex === undefined || highlightIndex === index;

        const x = paddingX + index * (barWidth + gap);
        const y = topLabelHeight + (usableHeight - currentHeight);

        const barColor = interpolateColors(
          entrance,
          [0, 1],
          ['#0f172a', isHighlighted ? '#38bdf8' : '#1e293b']
        );

        const displayedValue = Math.round(interpolate(entrance, [0, 1], [0, item.value]));

        return (
          <g key={item.label}>
            {/* Animated Value Label */}
            <text
              x={x + barWidth / 2}
              y={y - 14}
              textAnchor="middle"
              fill={isHighlighted ? '#ffffff' : '#64748b'}
              fontSize="28"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
              opacity={entrance}
            >
              {displayedValue}{unit}
            </text>

            {/* Pure SVG Animated Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(0, currentHeight)}
              rx={12}
              ry={12}
              fill={barColor}
              filter={isHighlighted && entrance > 0.8 ? 'url(#barGlow)' : undefined}
            />

            {/* X-Axis Label */}
            <text
              x={x + barWidth / 2}
              y={height - 16}
              textAnchor="middle"
              fill={isHighlighted ? '#ffffff' : '#94a3b8'}
              fontSize="22"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
```

### Animated SVG Line Chart via `@remotion/paths`

```tsx
// src/components/data/LineChart.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { evolvePath } from '@remotion/paths';

export const LineChart: React.FC<{
  pathD: string; // Precalculated SVG path data
  width?: number;
  height?: number;
}> = ({ pathD, width = 800, height = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, pathD);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={pathD}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
```

---

## 6. Design Tokens & Physics Presets

All stylistic consistency is enforced via centralized design tokens in `src/styles/theme.ts`:

```ts
// src/styles/theme.ts
export const THEME = {
  colors: {
    // Mood Backgrounds
    bgMidnight: '#070a13',
    bgCharcoal: '#0b0914',
    bgSlate: '#0a0e1a',
    bgEmerald: '#0a1612',

    // Surfaces & Borders
    surfaceCard: '#131b2e',
    borderLight: '#1f2d4a',
    borderGlow: 'rgba(56, 189, 248, 0.3)',

    // Accents
    accentBlue: '#38bdf8',
    accentAmber: '#f59e0b',
    accentRed: '#ef4444',
    accentEmerald: '#10b981',
    accentGold: '#fbbf24',

    // Typography
    textWhite: '#ffffff',
    textMuted: '#94a3b8',
    textDim: '#64748b',
  },
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Inter, sans-serif',
    numbers: 'JetBrains Mono, monospace',
  },
  springs: {
    // Punchy pop for stats and titles
    snappy: { damping: 14, mass: 0.6, stiffness: 160 },
    // Organic motion for charts and cards
    smooth: { damping: 18, mass: 1.0, stiffness: 100 },
    // Playful bounce for icons and callouts
    bouncy: { damping: 12, mass: 0.8, stiffness: 140 },
  },
};
```

---

## 7. Scene Transitions Architecture

We use `@remotion/transitions` with `<TransitionSeries>` to sequence the 5 narrative beats. Rather than hardcoding frame shifts, `<TransitionSeries>` calculates overlaps automatically.

### Recommended Beat Transition Pairings

| Beat Transition | Transition Type | Duration | Emotional Purpose |
|---|---|---|---|
| **Beat 1 $\to$ Beat 2** (Hook $\to$ Stakes) | `wipe({ direction: 'from-bottom' })` or Hard Cut | 10–12 frames | Immediate momentum; anchors the viewer into reality. |
| **Beat 2 $\to$ Beat 3** (Stakes $\to$ Mechanism) | `slide({ direction: 'from-right' })` | 14–16 frames | Lateral movement into the analytical "behind-the-curtain" mode. |
| **Beat 3 $\to$ Beat 4** (Mechanism $\to$ Climax) | Hard Cut or `fade()` to pitch black | 8–10 frames | Sudden vacuum effect; aligns with the dramatic music stop. |
| **Beat 4 $\to$ Beat 5** (Climax $\to$ Payoff) | `dissolve()` or luminous `fade()` | 16–20 frames | Smooth awakening into empowering takeaway and loop bridge. |

---

## 8. Kinetic Subtitles Specification (`<KineticCaptions />`)

Subtitles are critical: **over 70% of vertical mobile viewers watch with sound on low or muted initially**. Word-level highlight tokens are delivered via `captions.json` (generated by Edge-TTS or ElevenLabs).

```tsx
// src/components/captions/KineticCaptions.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CaptionToken } from '../../types/content.types';

export const KineticCaptions: React.FC<{
  captions: CaptionToken[];
}> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  // Find active token or tokens in current small window (3-4 words)
  const activeIndex = captions.findIndex(
    (c) => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs
  );

  if (activeIndex === -1) return null;

  // Window of surrounding words (previous 1 word, current, next 1 word)
  const windowStart = Math.max(0, activeIndex - 1);
  const windowEnd = Math.min(captions.length, activeIndex + 2);
  const visibleWords = captions.slice(windowStart, windowEnd);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 350, // Placed strictly in captions safe zone (330px - 490px)
        left: 80,
        right: 140,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        pointerEvents: 'none',
      }}
    >
      {visibleWords.map((token, i) => {
        const isCurrent = token === captions[activeIndex];
        const tokenEntranceFrame = Math.round((token.startMs / 1000) * fps);

        const pop = isCurrent
          ? spring({
              frame: frame - tokenEntranceFrame,
              fps,
              config: { damping: 12, stiffness: 200 },
            })
          : 1;

        const scale = isCurrent ? interpolate(pop, [0, 1], [0.85, 1.15]) : 1.0;
        const color = isCurrent
          ? token.isEmphasized
            ? '#f59e0b' // Warning Amber for emphasized climax words
            : '#38bdf8' // Electric Sky Blue for normal active word
          : 'rgba(255, 255, 255, 0.45)'; // Dimmed contextual words

        return (
          <span
            key={`${token.startMs}-${token.text}`}
            style={{
              fontSize: token.isEmphasized ? 44 : 38,
              fontWeight: 900,
              fontFamily: 'Montserrat, sans-serif',
              textTransform: 'uppercase',
              color,
              transform: `scale(${scale})`,
              textShadow: isCurrent ? '0 0 20px rgba(56, 189, 248, 0.6)' : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};
```

---

## 9. Audio Mixing & Dynamic Ducking Engine (`<AudioMixer />`)

The audio architecture mixes 3 discrete tracks with dynamic sidechain ducking and zero-volume dramatic cutouts:

```tsx
// src/audio/AudioMixer.tsx
import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { VideoContent } from '../types/content.types';

export const AudioMixer: React.FC<{ content: VideoContent }> = ({ content }) => {
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

  return (
    <>
      {/* 1. Main Narration Track */}
      <Audio
        src={staticFile(content.narration.audioFile)}
        volume={1.0}
      />

      {/* 2. Background Music with Dynamic Ducking & Dramatic Drop */}
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
            // Duck during active narration, return to base volume during pauses
            const narrationActive = frame <= content.narration.durationInSeconds * fps;
            return narrationActive ? duckedVolume : baseVolume;
          }}
        />
      )}

      {/* 3. Synchronized SFX Cue Sequence */}
      {content.sfxEvents.map((cue, idx) => (
        <Sequence
          key={`sfx-${idx}-${cue.soundId}`}
          from={cue.frame}
          durationInFrames={Math.round(fps * 2)} // Standard 2s SFX tail
        >
          <Audio
            src={staticFile(`sfx/${cue.soundId}.mp3`)}
            volume={cue.volume ?? 0.5}
          />
        </Sequence>
      ))}
    </>
  );
};
```

---

## 10. Font Management & Deterministic Preloading

To prevent **Flash of Invisible Text (FOIT)** or layout shifting in headless Chromium, fonts are registered and awaited using `@remotion/google-fonts`:

```ts
// src/Root.tsx (Font initialization)
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: montserrat } = loadMontserrat();
const { fontFamily: inter } = loadInter();
const { fontFamily: jetbrainsMono } = loadJetBrainsMono();
```

---

## 11. Symbolic Metaphor Primitives (`<MetaphorIcon />`)

Vector primitives visually illustrate abstract concepts without external heavy icon assets:

* **`padlock`:** Dual-arc vector lock for trapped wages or closed financial systems.
* **`empty-cart`:** Minimalist grocery cart wireframe that drops its fill percentage.
* **`clock`:** Thin circular dial with an accelerating hour hand for demographic or debt ticking clocks.
* **`dollar-burn`:** Dollar bill outline with evolving path flame stroke using `@remotion/paths`.

---

## 12. Cross-Document Architecture Links

* **[01. Storytelling, Narrative & Sensitization Bible](file:///c:/Users/skmpa/vdo/rm/docs/01-storytelling-and-creative.md):** 5-beat emotional arc, SFX taxonomy, and color psychology.
* **[03. Content Models, Schemas & Data Contracts](file:///c:/Users/skmpa/vdo/rm/docs/03-content-and-schemas.md):** TypeScript data contracts, `content.types.ts`, and episode configs.
* **[04. Production Runbook, Audio Pipelines & AI Agent Guardrails](file:///c:/Users/skmpa/vdo/rm/docs/04-production-and-agent-guide.md):** TTS generation pipelines, AI coding agent guardrails, and validation runbook.
