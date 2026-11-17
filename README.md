# YouTube Shorts Explainer Production Engine

> **A local-first, programmatic video production system for high-retention English YouTube Shorts, motion graphics, and narrative-driven educational content.**

Built with **Remotion + React + TypeScript + Tailwind CSS**, powered by a two-tier voice pipeline (**Microsoft Edge-TTS** for rapid zero-cost prototyping and **ElevenLabs** for production voice acting).

---

## 🎯 The Core Philosophy

1. **"Story & Emotion First, Data to Validate"**  
   We combat robotic AI monotony by anchoring every abstract concept in relatable human stakes before showing charts.
2. **"Change the Content, Not the Production System"**  
   Videos are driven declaratively by structured `content.json` files. The visual engine renders them without hardcoded content.
3. **"In-Built First-Party Remotion Priority"**  
   Zero third-party library bloat. We leverage official Remotion packages (`@remotion/shapes`, `@remotion/paths`, `@remotion/transitions`, `@remotion/captions`, `@remotion/media-utils`).

---

## 📚 Project Documentation Hub

The five documents in the `docs/` directory serve as the **authoritative Single Source of Truth (SSOT)** for the entire system:

| Document | Purpose | Key Topics |
|---|---|---|
| [**01. Storytelling & Creative Bible**](file:///c:/Users/skmpa/vdo/rm/docs/01-storytelling-and-creative.md) | Creative Direction | 5-beat narrative arc, human stakes sensitization, 4 story archetypes, dynamic mood & color psychology, SFX taxonomy, dramatic silence |
| [**02. Technical Architecture**](file:///c:/Users/skmpa/vdo/rm/docs/02-technical-architecture.md) | Engineering Spec | Remotion v4 ecosystem, canonical directory tree, mobile safe zones (880×1420), `<ShortsSafeZone />`, pure SVG animated charts, theme tokens, `<TransitionSeries>`, `<KineticCaptions />`, `<AudioMixer />` |
| [**03. Content Models & Schemas**](file:///c:/Users/skmpa/vdo/rm/docs/03-content-and-schemas.md) | Data Contracts | Master TypeScript schemas (`content.types.ts`, `audio.types.ts`), canonical `content.json` example, frame/duration validation invariants |
| [**04. Production Runbook & Agent Guide**](file:///c:/Users/skmpa/vdo/rm/docs/04-production-and-agent-guide.md) | Operations & Rules | Two-tier TTS (Edge-TTS + live ElevenLabs Python CLI), 10 AI agent guardrails, Definition of Done, 14-point pre-publish checklist |
| [**05. Phased Roadmap & Tracker**](file:///c:/Users/skmpa/vdo/rm/docs/05-phased-roadmap.md) | Execution & Milestones | Phase status (1–2.5 done, 3 partial), content-first Episode 003+ focus, deferred automation backlog, changelog |

---

## 🚀 Quick Reference

### Video Specifications
* **Engine:** Remotion `v4.0.x` + React 18/19 + TypeScript + Tailwind CSS
* **Resolution:** `1080 × 1920` (9:16 vertical)
* **Framerate:** `30 fps`
* **Duration:** Flexible `45–90 seconds` (prioritizing story pacing over arbitrary cuts)
* **Safe Zone:** Top 180px, Bottom 320px, Right 140px, Left 60px (Safe Content Area: `880 × 1420 px`)

### Voice Pipeline
* **Development / Prototype:** `uv run scripts/tts/generate-edge.py` (Free, instant, word-level timestamps via `uv`)
* **Final Production:** `uv run scripts/tts/generate-elevenlabs.py --slug <episode-slug>` (Emotional nuance, word/character alignment, mirrors audio + captions into `public/`)

---

## 🚦 Current Status: Phase 2 — COMPLETED ✅

**Phase 2 Complete:**
- [x] **Step 2A: Motion Graphics & SVG Chart Suite** (COMPLETED ✅)
  - [x] `LineChart.tsx`: Animated SVG line chart with `@remotion/paths` `evolvePath()`, glowing area gradient, vertex dots, live tracker beacon
  - [x] `BarChart.tsx`: Upgraded with staggered spring physics, glowing highlight bar, counters, delta pills, auto guidelines
  - [x] `StepTimeline.tsx`: Sequential step connector (Step 1 -> 2 -> 3) with glowing vertical progress spine
  - [x] `AnimatedArrow.tsx`: Dynamic pointer using `@remotion/shapes` `makeArrow()` with breathing pulse & labels
  - [x] `BeforeAfterSplit.tsx`: Side-by-side or stacked comparison screen with animated laser divider
  - [x] `MetricCard.tsx`: Metric stats card with percentage delta (+312%) and ambient glow
  - [x] Showcase composition (`ChartShowcase.tsx`) & 3 visual preview frames verified in `out/`
- [x] **Step 2B: SFX Sound Library & Audio Sync** (COMPLETED ✅)
  - [x] Synthesized broadcast SFX audio pack in `public/sfx/` (`whoosh`, `pop`, `sub-drop`, `cash-register`, `chime`, `clock-tick`)
  - [x] Typed registry in `src/audio/sfxLibrary.ts`
  - [x] Upgraded `AudioMixer.tsx` with dynamic cue triggering and sidechain balance
- [x] **Step 2C: Episode 002 Full Production & Master Render** (COMPLETED ✅)
  - [x] Edge-TTS prototype pass, then ElevenLabs production narration for Episode 002
  - [x] Choreographed 5-beat scene architecture (`TheDebtClock.tsx`) incorporating LineChart, BarChart, MetricCard, BeforeAfterSplit, and synchronized SFX cues
  - [x] Master render complete: `out/002-debt-clock.mp4` (7.9 MB, 1080x1920 @ 30fps, 1770 frames / 59.00s)

---

## 🚦 Current Status: Phase 2.5 — COMPLETED ✅

**Phase 2.5 Complete (Living Canvas & Visual Polish):**
- [x] **Subtask 2.5.1: Canvas Reclaim & Editorial Keyword Callouts**
  - Deprecated permanent bottom subtitle bar; built `<EditorialCallout />` for contextual floating shock-words
  - Reclaimed full `880 × 1420 px` vertical canvas for majestic data visualizations
- [x] **Subtask 2.5.2: Living Canvas & Idle Motion Engine (`src/components/motion/`)**
  - `CameraDrift.tsx`: Subtle continuous Ken Burns push (`1.0` -> `1.045` scale)
  - `OrganicHover.tsx`: Sinusoidal buoyancy float (`translateY: Math.sin(frame * 0.05) * 4.5px`)
  - `LightSheen.tsx`: Specular diagonal light sweep traversing glass cards every 90–120 frames
  - `LiveTicker.tsx`: High-velocity secondary counter cycling frame-by-frame (`+$45,000 / sec`)
  - `RipplePing.tsx`: Concentric beacon pulse rings expanding and fading from key data vertices
  - `CameraMicroBump.tsx`: Damped 2–3 frame camera shake when massive numbers drop onto screen
- [x] **Subtask 2.5.3: Tall Chart Architecture & Film-Grade Aesthetics**
  - Expanded `LineChart` and `BarChart` heights to 760–780px for dramatic exponential curves
  - Embedded `RipplePing` beacon pulses at line tips and focal bar summits
- [x] **Subtask 2.5.4: Episode 002 Visual Remaster & Quality Gate**
  - Master render complete: `out/002-debt-clock-remastered.mp4` (15.0 MB+, 1080x1920 @ 30fps, 1902 frames / 63.39s with ElevenLabs narration)

---

## 🚦 Current Status: Phase 3 — PARTIAL ✅ (Voice Done; Automation Deferred)

**Done:**
- [x] **3.1 ElevenLabs synthesis** (`scripts/tts/generate-elevenlabs.py`) — live on Episode 002 (Daniel)
- [x] **3.3 Invariant + duration sync** — `npm run validate -- --slug <slug> [--sync]`
- [x] **3.5 Episode scaffold + shell** — `npm run scaffold -- --slug 003-topic --title "Title"` + `EpisodeShell` / `BeatSequence`

**Deferred (not blocking new episodes):**
- [ ] 3.2 Full `build-episode.ts` one-command pipeline
- [ ] 3.4 Fully automated Milestone 3 one-button render

---

## 🎯 Active Focus: Content-First Episode Production

```bash
npm run scaffold -- --slug 003-topic --title "Episode Title"
# edit videos/003-topic/script.txt
npm run tts:elevenlabs -- --slug 003-topic
npm run validate -- --slug 003-topic --sync
# rebalance beats in content.json, finish composition stub, register in Root.tsx
npm run dev
```

Full `build-episode` automation stays backlog until a couple more episodes harden the pattern.
