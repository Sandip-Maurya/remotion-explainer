# 05. Phased Implementation Roadmap & Milestone Tracker

## 1. Executive Summary & Status Dashboard

This roadmap serves as the **living operational execution tracker** for building and scaling the YouTube Shorts Explainer Production Engine. While Documents 01–04 define the static technical, creative, and data specifications, this document tracks **active engineering subtasks, deliverables, acceptance criteria, and milestone exit gates**.

### Phase Status Overview

| Phase | Focus Area | Status | Target Delivery | Key Milestone |
|---|---|---|---|---|
| **Phase 1** | **Foundation, Story Primitives & Edge-TTS Prototype** | 🟢 **COMPLETED** | Sprint 1 | First 40s test Short (*"Why $100 Isn't $100 Anymore"*) rendered locally via Remotion CLI (`out/001-why-inflation-hurts.mp4`) |
| **Phase 2** | **Explainer SVG Charts & Diagram Suite** | 🟡 **NEXT SPRINT** | Sprint 2 | Pure SVG Bar/Line charts, diagram connectors, SFX library & Episode 002 |
| **Phase 3** | **Production Voice Acting & Automated Pipeline** | ⚪ BACKLOG | Sprint 3 | ElevenLabs studio TTS integration, CLI script-to-video automation |
| **Phase 4** | **Channel Scaling, Analytics & Template Presets** | ⚪ FUTURE | Sprint 4 | Retention curve optimization, genre storytelling presets, cloud batch rendering |

---

## 2. Phase 1: Foundation, Story Primitives & Edge-TTS Prototype

> **Objective:** Establish the local development environment, configure Remotion v4 with TypeScript and Tailwind CSS, verify mobile safe zones, implement core and storytelling primitives, and render the first end-to-end prototype video using Edge-TTS.

### Subtask Breakdown & Checklist

#### 1.1 Toolchain & Dependency Setup
- [x] Initialize Node.js project in workspace (`package.json` with Bun & Node).
- [x] Install pinned Remotion v4 core packages (`remotion@^4.0.0`, `@remotion/cli@^4.0.0`, `react@^18.2.0`, `react-dom@^18.2.0`).
- [x] Install official first-party Remotion packages (`@remotion/transitions`, `@remotion/shapes`, `@remotion/paths`, `@remotion/captions`, `@remotion/media-utils`, `@remotion/google-fonts`, `@remotion/tailwind`).
- [x] Configure Tailwind CSS & PostCSS (`tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/node`).
- [x] Configure `tsconfig.json` with strict type checking and JSX support (`"jsx": "react-jsx"`).
- [x] Configure `remotion.config.ts`:
  * Set output codec to H.264 (`videoCodec: 'h264'`).
  * Enable Windows hardware acceleration flag (`--gl=angle`).
  * Set default concurrency to 4 workers.
  * Enable Tailwind Webpack processing (`enableTailwind`).
- [x] Configure `tailwind.config.js` with custom safe-zone sizing and theme tokens.
- [x] Verified TypeScript compilation (`tsc --noEmit`) passes with zero errors.
- [x] Verified Remotion composition bundling and Chromium Headless Shell setup (`remotion compositions`).

#### 1.2 Design Tokens & Mobile Safe Zone Overlay
- [x] Create `src/styles/theme.ts`:
  * Define colors (`bgMidnight`, `bgSlate`, `accentBlue`, `accentAmber`, `accentRed`, `accentEmerald`, etc.).
  * Define font stacks (Montserrat, Inter, JetBrains Mono) with `fontSizes` tokens.
  * Define spring configurations (`snappy`, `smooth`, `bouncy`, `gentle`).
  * Define dimension tokens for safe zones and captions region.
- [x] Implement `src/styles/fonts.ts`:
  * Google Fonts preloaded with `@remotion/google-fonts` (`Montserrat`, `Inter`, `JetBrainsMono`) with latin subsets.
- [x] Implement `src/components/core/ShortsSafeZone.tsx`:
  * Render translucent red danger overlays for Top (180px), Bottom (320px), Right (140px), and Left (60px).
  * Outline the active Safe Content Rectangle (`880 × 1420 px`).
  * Outline the designated Subtitle Region (Bottom: 350px).
  * Center crosshair guides with target circle.
- [x] Verified by rendering complete test still frame (`out/safezone-preview.png`).

#### 1.3 Audio Prototyping Pipeline via `uv`
- [x] Verify `uv` installation on Windows host (`uv 0.7.8` verified).
- [x] Implement `scripts/tts/generate-edge.py`:
  * Include PEP 723 inline script metadata (`edge-tts>=6.1.0`).
  * Implement streaming audio capture to MP3.
  * Explicitly enable `WordBoundary` events to extract millisecond word boundaries into `captions.json`.
- [x] Tested CLI generation on Episode 001:
  * Generated 245 KB MP3 voiceover (`videos/001-why-inflation-hurts/narration.mp3`).
  * Generated 87 word boundaries (`videos/001-why-inflation-hurts/captions.json`).
  * Measured audio duration: 40.11s (~1203 frames at 30fps).
- [x] Verified audio quality, zero-cost execution, and timestamp precision.

#### 1.4 Core Visual Primitives (`src/components/core/`)
- [x] `Title.tsx`: Animated kinetic headline with spring pop entrance, keyword highlighting, and staggered subtext.
- [x] `BigNumber.tsx`: Counting integer/stat component with `spring()` scaling bounce, tabular numerals, and comparison label.
- [x] `ProgressBar.tsx`: Slim top-of-screen viewer retention progress bar with glowing leading edge.
- [x] `EndCard.tsx`: Channel outro card with subscribe call-to-action and seamless loop bridge.

#### 1.5 Storytelling & Sensitization Primitives (`src/components/storytelling/`)
- [x] `HumanStakesCard.tsx`: Personal stakes comparison (2020 vs Today grocery basket / rent comparison with impact banner).
- [x] `DramaticQuote.tsx`: High-contrast focal statement with spotlight illumination and dramatic pause timing.
- [x] `TensionVignette.tsx`: Subtle pulsating vignette border to induce suspense during Beat 2.
- [x] `MetaphorIcon.tsx`: Native SVG metaphors (`padlock`, `empty-cart`, `clock`, `dollar-burn`) with spring entrance.

#### 1.6 Kinetic Captions & Audio Mixer
- [x] Implement `src/components/captions/KineticCaptions.tsx`:
  * Word-by-word subtitle display within the safe zone (bottom: 350px).
  * Active word spring pop bounce (`scale: 1.15`) with accent glow.
  * Emphasis word coloring (`#f59e0b`).
- [x] Implement `src/audio/AudioMixer.tsx`:
  * Master voiceover track at full volume (`1.0`) via Remotion `<Audio />`.
  * Background music with automatic sidechain ducking (`0.04` during speech).
  * Automatic zero-volume cutoff during the climax dramatic pause.
  * Synchronized SFX cue sequencing from `sfxEvents`.

#### 1.7 Milestone 1 Integration & Test Short Render
- [x] Populate `videos/001-why-inflation-hurts/`:
  * `script.txt`: The 40-second voiceover script.
  * `narration.mp3`: Synthesized via Edge-TTS (245 KB, 40.11s).
  * `captions.json`: 87 word boundary tokens with millisecond timestamps.
  * `content.json`: Master configuration adhering to `src/types/content.types.ts`.
- [x] Assemble `src/scenes/`:
  * `HookScene.tsx` (Beat 1: 0–126 frames)
  * `AgitationScene.tsx` (Beat 2: 126–360 frames)
  * `MechanismScene.tsx` (Beat 3: 360–735 frames)
  * `ClimaxScene.tsx` (Beat 4: 735–1020 frames)
  * `PayoffScene.tsx` (Beat 5: 1020–1203 frames)
- [x] Connect scenes in `src/compositions/WhyInflationHurts.tsx` and register in `src/Root.tsx`.
- [x] Verified in Remotion Studio and rendered production MP4:
  ```bash
  remotion render src/index.ts WhyInflationHurts out/001-why-inflation-hurts.mp4 --gl=angle
  ```

### Phase 1 Exit Criteria (Acceptance Gate)
- [x] Rendered MP4 is strictly 1080 × 1920 at 30 fps (`out/001-why-inflation-hurts.mp4` — 3.8 MB).
- [x] Total duration matches audio length (40.10s / 1203 frames).
- [x] Zero layout elements intrude into the danger zones (strictly inside 880 × 1420 px).
- [x] Kinetic subtitles stay in sync with spoken syllables.
- [x] Climax scene exhibits dramatic silence before the punchline.
- [x] Clean CLI render without dropped frames or Chromium warnings.
- [x] Installed all 13 official Remotion Agent Skills at `.agents/skills/`.

---

## 3. Phase 2: Explainer SVG Charts & Diagram Suite

> **Objective:** Build a complete suite of pure SVG animated data graphics, flow diagram connectors, and an expanded SFX sound library, then produce Episode 002.
>
> **Execution Strategy:** Split into 3 progressive quality gates (2A: Visual/Graphics Suite -> 2B: SFX & Sound Design -> 2C: Full Episode Production).

### Step 2A: Motion Graphics & SVG Chart Suite (COMPLETED ✅)
- [x] **2A.1 Pure SVG Line Chart (`src/components/data/LineChart.tsx`):**
  * Uses `@remotion/paths` (`evolvePath()`, `getLength()`, `getPointAtLength()`) for dynamic stroke drawing animation.
  * Smooth cubic Bezier interpolation with vertical linear gradient area fill.
  * Staggered animated vertex dots with glowing pulse rings.
  * Active leading tracker beacon following the tip of the evolving line with live numeric value badge.
  * Axis grid lines with staggered opacity fade-in.
- [x] **2A.2 Advanced SVG Bar Chart (`src/components/data/BarChart.tsx`):**
  * Staggered spring entrance with `bouncy` physics per bar.
  * Multi-stop gradients (`#38bdf8` to `#0284c7` highlight, crimson warning, slate muted).
  * Tabular number counters animating in sync with bar height growth.
  * Delta comparison tag (e.g. `+64%`) with animated spring pop above focal bars.
  * Horizontal dashed grid guidelines with auto-calculated ticks.
- [x] **2A.3 Diagram & Flow Primitives (`src/components/graphics/`):**
  * `StepTimeline.tsx`: Sequential step connector (Step 1 -> Step 2 -> Step 3) with numbered badges and connecting animated glowing vertical spine.
  * `AnimatedArrow.tsx`: Dynamic directional arrows using `@remotion/shapes` (`makeArrow()`) with spring entry, continuous breathing pulse, and text label.
  * `BeforeAfterSplit.tsx`: Side-by-side or stacked split screen showing historical vs. present reality with laser divider.
  * `MetricCard.tsx`: High-impact metric card showing key statistics, percentage deltas (+312%), trend pills, and top ambient glow.
- [x] **2A.4 Component Visual Test & Preview:**
  * Created test showcase composition (`src/compositions/ChartShowcase.tsx`) showcasing all components.
  * Verified typography, mobile safe zones (880x1420 px), color contrast, and spring physics.
  * Rendered test preview frames:
    * `out/phase-2a-showcase-frame60.png` (MetricCard + LineChart)
    * `out/phase-2a-showcase-frame140.png` (BarChart + AnimatedArrow)
    * `out/phase-2a-showcase-frame230.png` (BeforeAfterSplit + StepTimeline)

### Step 2B: SFX Sound Library & Audio Sync (COMPLETED ✅)
- [x] **2B.1 Broadcast SFX Pack Sourcing / Creation:**
  * Implemented pure math audio synthesizer in `scripts/audio/generate-sfx.py`.
  * Generated 16-bit 44.1kHz PCM sound effects into `public/sfx/`:
    * `whoosh.wav`: Airy cinematic transition sweep (0.32s).
    * `pop.wav`: Snappy UI bubble pop for data points & metric pills (0.09s).
    * `sub-drop.wav`: Deep sub-bass boom for dramatic revelations (1.10s).
    * `cash-register.wav`: Dual harmonic metallic chime for economic counters (0.45s).
    * `chime.wav`: Glassy C-major chord epiphany chime (0.75s).
    * `clock-tick.wav`: Crisp mechanical click for suspense and pacing (0.04s).
- [x] **2B.2 SFX Audio Mapping & Mixer Enhancement:**
  * Created typed asset registry in `src/audio/sfxLibrary.ts` (`SfxSoundId`, `SFX_REGISTRY`, `resolveSfxPath`, `getSfxDefaultVolume`).
  * Enhanced `src/audio/AudioMixer.tsx` with dynamic path resolution and per-sound balanced default volumes.
  * Verified audio ducking behavior (narration 1.0, BGM ducked to 0.04, SFX balanced from 0.45 to 0.82).

### Step 2C: Episode 002 Full Production & Master Render (COMPLETED ✅)
- [x] **2C.1 Script & Voiceover Generation:**
  * High-stakes script: *"The $35 Trillion Debt Clock: Who Actually Owns It?"* (`videos/002-debt-clock/script.txt`).
  * Edge-TTS generation via `uv run scripts/tts/generate-edge.py`:
    * Master voiceover: `videos/002-debt-clock/narration.mp3` (359 KB, exactly 59.00s / 1770 frames at 30fps).
    * Extracted 134 word boundaries with millisecond precision and keyword emphasis in `captions.json`.
- [x] **2C.2 Scene Assembly & Visual Choreography (`src/compositions/TheDebtClock.tsx`):**
  * Beat 1 (Hook, 0–360 frames): `MetricCard` ($35.2 Trillion, +312% delta) + `sub-drop` & `cash-register` SFX.
  * Beat 2 (Agitation, 360–735 frames): `BeforeAfterSplit` (Year 2000 $5.6T vs Today $35.2T) + laser divider + `pop` SFX.
  * Beat 3A (Mechanism, 735–985 frames): Pure SVG `LineChart` animating 1990-2024 hockey-stick trajectory with active beacon.
  * Beat 3B (Mechanism, 985–1251 frames): Upgraded `BarChart` breaking down major debt holders with highlight on everyday Americans.
  * Beat 4 (Climax, 1251–1579 frames): `TensionVignette` + dramatic silence pause + `AnimatedArrow` downward currency debasement + `sub-drop` hit.
  * Beat 5 (Payoff, 1579–1770 frames): Stealth tax epiphany banner + `EndCard` seamless loop bridge + `chime` SFX.
- [x] **2C.3 Master Production Render:**
  * Rendered production master: `out/002-debt-clock.mp4` (7.9 MB, 1080×1920, 30fps, 1770 frames / 59.00s).
  * Passed strict mathematical invariant checks and mobile safe zone geometry (880×1420 px).

### Phase 2 Exit Criteria (Acceptance Gate)
- [x] Full suite of SVG animated data components built (`LineChart`, `BarChart`, `StepTimeline`, `AnimatedArrow`, `BeforeAfterSplit`, `MetricCard`).
- [x] Broadcast SFX pack synthesized and integrated into `AudioMixer.tsx` via `sfxLibrary.ts`.
- [x] Episode 002 rendered with dramatic narrative arc, kinetic captions, and synchronized SFX.
- [x] 100% TypeScript compile pass with zero errors.

---

## 4. Phase 2.5: Living Canvas & Visual Polish Engine (COMPLETED ✅)

> **Objective:** Eliminate visual static freezes, reclaim the full vertical canvas from bottom subtitles, and introduce organic idle motion (camera drift, light sheens, live tickers, ripple pings, and camera micro-bumps) for genuine "wow" factor.

### Subtask Breakdown & Checklist
- [x] **2.5.1 Canvas Reclaim & Editorial Keyword Callouts:**
  * Deprecated distracting permanent bottom subtitle track in favor of clean visual immersion.
  * Implemented `src/components/captions/EditorialCallout.tsx`: Contextual, floating motion graphic punch-phrases (`$104,000 PER CITIZEN`, `OVER $1.1 TRILLION / YR`, `PARABOLIC EXPLOSION`, `YOU ARE THE BIGGEST CREDITOR`, `THE STEALTH DEBASEMENT`) that punch in beside active graphics for 1.2–1.8 seconds.
  * Reclaimed full vertical safe space (`880 × 1420 px`) for majestic, tall data visualizations.
- [x] **2.5.2 Living Canvas & Idle Motion Engine (`src/components/motion/`):**
  * `CameraDrift.tsx`: Subtle forward Ken Burns push container (`scale: 1.0` $\to$ `1.045` across scene duration).
  * `OrganicHover.tsx`: Sinusoidal buoyancy float (`translateY = Math.sin(frame * 0.05 + offset) * 4.5px`) for cards and badges.
  * `LightSheen.tsx`: Specular diagonal light sweep (115deg) traversing glass cards every 90–120 frames.
  * `LiveTicker.tsx`: High-velocity secondary counter rapidly cycling frame-by-frame (`+$45,000 / sec` and `+$34,800 / sec`) to convey relentless compounding momentum.
  * `RipplePing.tsx`: Concentric beacon pulse rings expanding and fading from key data vertices on line charts and bar charts.
  * `CameraMicroBump.tsx`: Damped 2–3 frame camera shake when massive numbers or punchlines drop onto screen.
- [x] **2.5.3 Tall Chart Architecture & Film-Grade Aesthetics:**
  * Expanded `LineChart` and `BarChart` heights to 760–780px, dramatically increasing the slope and visual tension of exponential curves.
  * Embedded `RipplePing` beacon pulses at line tips and focal bar summits.
  * Multi-layered moving ambient radial lighting breathing dynamically in background.
- [x] **2.5.4 Episode 002 Visual Remaster & Quality Gate:**
  * Architected `src/compositions/TheDebtClockRemastered.tsx` with the Living Canvas engine, tall charts, live tickers, and Editorial Callouts.
  * Rendered production master: `out/002-debt-clock-remastered.mp4` (15.0 MB, 1080×1920, 30fps, 1770 frames / 59.00s).
- [x] **2.5.5 Visual Polish & Overlap Elimination (Post-Audit):**
  * Removed bottom accumulation ticker clashing with `<EditorialCallout />` stamps, unlocking clean negative space.
  * Added decimal precision (`decimals={1}`) across `BarChart`, `LineChart`, and `MetricCard` (rendering exact `$14.8T` and `$35.2 Trillion`).
  * Elevated `BarChart` delta badge to `y - 62` providing a clean 14px vertical cushion above value text.
  * Anchored charts to `top: 200px` (`justifyContent: 'flex-start'`) eliminating the 500px black void and centering gaze.

### Phase 2.5 Exit Criteria (Acceptance Gate)
- [x] Zero static freezes: Every element maintains subtle breathing, floating, or camera drift throughout its on-screen duration.
- [x] No persistent subtitle bar: Clean, immersive visual space with only high-impact editorial punchouts.
- [x] Charts utilize the expanded 760–780px height for exponential drama.
- [x] Micro-impact screen shake adds physical weight to key data drops.
- [x] 100% TypeScript compile pass and clean Remotion render.

---

## 5. Phase 3: Production Voice Acting & Automated Pipeline

> **Objective:** Integrate studio-grade ElevenLabs voice generation with word alignment, build an end-to-end automation CLI, and enforce automated schema validation.

### Subtask Breakdown & Checklist
- [ ] **3.1 ElevenLabs Synthesis Script (`scripts/tts/generate-elevenlabs.ts`):**
  * Implement ElevenLabs SDK integration with API key management.
  * Configure emotional voice parameters (`stability: 0.45`, `similarity_boost: 0.85`).
  * Parse character alignment timestamps into word-level `CaptionToken` objects.
- [ ] **3.2 Automated Script-to-Video CLI Wrapper (`scripts/build-episode.ts`):**
  * Single command to:
    1. Read `videos/<slug>/script.txt`.
    2. Generate speech and word timestamps via selected TTS engine.
    3. Calculate exact frame budgets and populate `content.json`.
    4. Trigger local Remotion render.
- [ ] **3.3 Schema Invariant Test Suite:**
  * Add unit tests verifying the 5 mathematical invariants before rendering:
    * Frame sum equivalence ($\sum \text{scene}_i.\text{duration} == \text{totalDuration}$).
    * Audio duration synchronization ($\text{totalDuration} == \lceil \text{audioSeconds} \times \text{fps} \rceil$).
    * Caption boundary containment ($0 \le \text{startMs} < \text{endMs} \le \text{totalDurationMs}$).
    * Climax silence constraint ($30 \le \text{pauseFrames} \le 60$).
- [ ] **3.4 Milestone 3 Production:**
  * Render an automated episode using the single CLI command and ElevenLabs voiceover.

---

## 6. Phase 4: Channel Scaling, Analytics & Template Presets

> **Objective:** Optimize video retention based on YouTube Shorts analytics, create genre-specific visual templates, and enable optional cloud batch rendering.

### Subtask Breakdown & Checklist
- [ ] **4.1 YouTube Shorts Retention Optimization:**
  * Analyze real audience retention curves; identify drop-off zones.
  * Calibrate hook velocity (testing 2.5s vs 4.0s hook transitions).
  * A/B test subtitle spring bounce intensity and font sizing.
- [ ] **4.2 Genre-Specific Storytelling Presets:**
  * *Finance & Economics:* Navy/Emerald palette, cash SFX, bar/waterfall charts.
  * *Tech & AI Disruption:* Midnight/Electric Blue palette, terminal typing effects, node graphs.
  * *History & Psychology:* Charcoal/Gold palette, clock SFX, timeline connectors.
- [ ] **4.3 Cloud Rendering Pipeline (Optional / Production Scale):**
  * Set up Remotion Lambda on AWS or Google Cloud Run.
  * Render multiple aspect ratios simultaneously (9:16 Shorts + 16:9 widescreen deep dives).

---

## 6. Execution History & Change Log

| Date | Phase | Action / Milestone | Status |
|---|---|---|---|
| **2026-11-15** | Phase 1 | Initialized master documentation suite (Docs 01–05 & README). Established SSOT. | ✅ COMPLETED |
| **2026-11-15** | Phase 1 | Subtask 1.1: Project scaffolding, Bun package install, Remotion v4, Tailwind, and Headless Shell. | ✅ COMPLETED |
| **2026-11-15** | Phase 1 | Subtask 1.2: Design tokens (`theme.ts`), font preloading (`fonts.ts`), `<ShortsSafeZone />`, and verified still render. | ✅ COMPLETED |
| **2026-11-15** | Phase 1 | Subtask 1.3: Audio prototyping via `uv`, Edge-TTS generator, and millisecond word timestamp extraction. | ✅ COMPLETED |
| **2026-11-15** | Phase 1 | Subtask 1.4 & 1.5: Implemented core visual primitives (`Title`, `BigNumber`, `ProgressBar`, `EndCard`) & storytelling primitives (`HumanStakesCard`, `DramaticQuote`, `TensionVignette`, `MetaphorIcon`). | ✅ COMPLETED |
| **2026-11-15** | Phase 1 | Installed all 13 official Remotion Agent Skills in `.agents/skills/`. | ✅ COMPLETED |
| **2026-11-15** | Phase 1 | Subtask 1.6 & 1.7: Connected 5 narrative scenes, kinetic subtitles, audio mixer & rendered Milestone 1 Short (`out/001-why-inflation-hurts.mp4`). **PHASE 1 COMPLETE!** | 🎉 COMPLETED |
| **Pending** | Phase 2 | Pure SVG chart suite (`LineChart`), diagram connectors (`StepTimeline`, `AnimatedArrow`), and Episode 002. | ⏳ READY FOR SPRINT 2 |

---

## 7. Cross-Document Architecture Links

* **[README.md](file:///c:/Users/skmpa/vdo/rm/README.md):** Project mission statement and documentation index.
* **[01. Storytelling, Narrative & Sensitization Bible](file:///c:/Users/skmpa/vdo/rm/docs/01-storytelling-and-creative.md):** Narrative arc, emotional sensitization, archetypes, and audio cues.
* **[02. Technical Architecture & Engineering Specification](file:///c:/Users/skmpa/vdo/rm/docs/02-technical-architecture.md):** Remotion v4 specs, safe zones, `<AudioMixer />`, and SVG chart code.
* **[03. Content Models, Schemas & Data Contracts](file:///c:/Users/skmpa/vdo/rm/docs/03-content-and-schemas.md):** Master schemas, invariants, and production `content.json` structure.
* **[04. Production Runbook, Audio Pipelines & AI Agent Guardrails](file:///c:/Users/skmpa/vdo/rm/docs/04-production-and-agent-guide.md):** TTS setup runbook, AI agent guardrails, and pre-publish checklist.
