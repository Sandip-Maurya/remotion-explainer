# 04. Production Runbook, Audio Pipelines & AI Agent Guardrails

## 1. Two-Tier Audio Generation Runbook

Audio duration dictates video timing. The audio track and its word-level timestamps must be generated **before** building Remotion compositions.

### Tier 1 (Prototyping & Development): Microsoft Edge-TTS (via `uv`)

Edge-TTS delivers free, zero-cost, high-fidelity neural speech with millisecond word boundaries. We use [`uv`](https://docs.astral.sh/uv/) for blazing-fast, isolated execution without manual virtual environment management.

#### Python Script with Inline Dependency Metadata (`scripts/tts/generate-edge.py`)

Using PEP 723 inline script metadata, `uv` automatically resolves and caches `edge-tts` on the fly:

```python
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "edge-tts",
# ]
# ///

# scripts/tts/generate-edge.py
import asyncio
import json
import argparse
import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural" # Deep, calm, authoritative
# Alternatives: "en-US-GuyNeural" (dynamic, energetic), "en-US-JennyNeural" (clear female)

async def generate_audio_and_timestamps(text: str, voice: str, audio_out: str, captions_out: str):
    communicate = edge_tts.Communicate(text, voice)
    subtitles = []

    with open(audio_out, "wb") as file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                subtitles.append({
                    "text": chunk["text"],
                    "startMs": chunk["offset"] / 10000,
                    "endMs": (chunk["offset"] + chunk["duration"]) / 10000
                })

    with open(captions_out, "w", encoding="utf-8") as f:
        json.dump(subtitles, f, indent=2)

    print(f"Audio written to: {audio_out}")
    print(f"Word timestamps ({len(subtitles)} words) written to: {captions_out}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--script", required=True, help="Path to text script file")
    parser.add_argument("--audio", required=True, help="Output MP3 path")
    parser.add_argument("--captions", required=True, help="Output JSON captions path")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    args = parser.parse_args()

    with open(args.script, "r", encoding="utf-8") as f:
        script_text = f.read().strip()

    asyncio.run(generate_audio_and_timestamps(script_text, args.voice, args.audio, args.captions))
```

#### CLI Execution via `uv run` (Zero Setup Required):
```bash
uv run scripts/tts/generate-edge.py --script videos/001-why-inflation-hurts/script.txt --audio videos/001-why-inflation-hurts/narration.mp3 --captions videos/001-why-inflation-hurts/captions.json
```
*(Alternatively, execute ad-hoc without metadata: `uv run --with edge-tts scripts/tts/generate-edge.py ...`).*

---

### Tier 2 (Production Polish): ElevenLabs Integration ✅ LIVE

Studio-grade emotional speech with word alignments via `scripts/tts/generate-elevenlabs.py` (Python stdlib — no Node ElevenLabs SDK required). Already production-validated on Episode 002 (Daniel voice, 63.39s).

#### Prerequisites
* Set `ELEVENLABS_API_KEY` in the environment **or** in a workspace-root `.env` as `ELEVENLABS_API_KEY=sk_...`.
* Episode folder must contain `videos/<slug>/script.txt`.

#### What the script does
1. Calls ElevenLabs `POST /v1/text-to-speech/{voice_id}/with-timestamps` (`eleven_multilingual_v2`).
2. Writes `videos/<slug>/narration.mp3` and word-level `captions.json`.
3. Mirrors both into `public/<slug>/` for Remotion `staticFile()`.
4. Updates `videos/<slug>/content.json` narration metadata (`engine`, `voiceId`, `audioFile`, `durationInSeconds`).

#### Default voice settings
| Setting | Default | Notes |
|---|---|---|
| Voice | `onwK4e9ZLuTAKqWW03F9` (Daniel) | Authoritative British broadcaster |
| Stability | `0.38` | Lower = more dynamic delivery |
| Similarity boost | `0.85` | Persona preservation |
| Style | `0.15` | Light dramatic exaggeration |
| Speaker boost | `true` | Clarity on mobile speakers |

Fallback / audition voices are registered in the script (`Brian`, `Adam`, `George`, `Antoni`, `Charlie`). Use `scripts/11labs/audio_test.py` to generate short A/B clips under `public/audio/`.

#### CLI Command:
```bash
uv run scripts/tts/generate-elevenlabs.py --slug 002-debt-clock

# Optional overrides:
uv run scripts/tts/generate-elevenlabs.py --slug 003-my-topic --voice nPczCjzI2devNBz1zQrb --stability 0.40 --style 0.20
```

> **Note:** Scene frame budgets in `content.json` / compositions are **not** auto-recalculated yet. After regenerating voice, re-check total duration and beat cut points in Remotion Studio before final render.

---

## 2. Step-by-Step Production Protocol

```text
[Step 0: Scaffold]
  - npm run scaffold -- --slug 003-topic --title "Episode Title"
  - Creates videos/<slug>/, public/<slug>/, content.json stub, and EpisodeShell composition stub.

[Step 1: Topic & Narrative Draft]
  - Formulate the core paradox or dilemma using Doc 01.
  - Write script in `videos/<slug>/script.txt` (130–180 words, 45–80 seconds).

[Step 2: Generate Speech & Timestamps]
  - Prototype (free): npm run tts:edge -- --script videos/<slug>/script.txt --audio videos/<slug>/narration.mp3 --captions videos/<slug>/captions.json
  - Production: npm run tts:elevenlabs -- --slug <slug>
    (writes audio + captions, mirrors to public/, updates narration meta + totalDurationInFrames).

[Step 3: Validate & Assemble Beats]
  - npm run validate -- --slug <slug> --sync
  - Rebalance scene durations in content.json so scene sum == audio frames.
  - Map SFX frames and chart/callout copy to the spoken beat map.

[Step 4: Interactive Remotion Studio Review]
  - Register the scaffolded composition in src/Root.tsx if not already.
  - Run `npm run dev` to launch Remotion Studio.
  - Enable the safe-zone overlay composition variant.
  - Scrub timeline to confirm:
    1. Visuals enter precisely on audio keywords.
    2. Numbers count up smoothly with spring physics.
    3. No text touches the top 180px, bottom 320px, right 140px, or left 60px danger zones.

[Step 5: Local CLI Render]
  - npx remotion render src/index.ts <CompositionId> out/<slug>.mp4 --gl=angle
  - Verify exported MP4 visually and auditorily from start to finish.
```

---

## 3. Strict Guardrails for AI Coding Agents

When working inside this codebase, AI coding assistants (Claude Code, Cursor, Antigravity) must strictly obey these ten directives:

1. **In-Built Remotion Priority:** Always use official first-party packages (`@remotion/shapes`, `@remotion/paths`, `@remotion/transitions`, `@remotion/captions`, `@remotion/media-utils`, and `@remotion/google-fonts`). Do not install external chart, icon, or animation packages without explicit human approval.
2. **Mandatory `.tsx` Extension:** All visual components, scenes, and overlays must be saved as `.tsx` files with strict TypeScript types.
3. **No Hard-Coded Copy or Statistics:** Never hardcode script text, stats, or values inside visual scene components. Pull them strictly from `content.json` or typed scene props.
4. **Mobile Safe Zone Enforcement:** Never position critical text, titles, charts, or focal elements inside the danger zones:
   - Top 180px (Search, header, sound track)
   - Bottom 320px (Account handle, title, audio pill, subscribe button)
   - Right 140px (Like, comment, share, remix icons)
   - Left 60px (Edge curvature and gesture navigation)
5. **Human Stakes with Every Stat:** Never render a dry chart or macro statistic without an accompanying relatable human stakes callout (e.g. grocery basket, rent, hours of labor).
6. **100% Deterministic Animations:** Never use unseeded `Math.random()`, `setInterval`, `requestAnimationFrame`, or CSS transitions (`transition: ...`). All layout and animation state must be pure mathematical functions of `useCurrentFrame()` and `fps`.
7. **Dramatic Silence Enforcement:** In the Climax scene, mute or duck the background music track completely for 30–60 frames (1.0–2.0 seconds) around the core realization statement.
8. **Respect Narrative Duration Flexibility:** Do not butcher a compelling narrative or truncate essential dramatic pauses just to hit an arbitrary 50-second timer. The target sweet spot is 45–90 seconds; storytelling depth takes precedence over rigid cutoffs.
9. **Pure SVG Vector Graphics for Data:** Always render charts and metric graphs using native SVG (`<svg>`, `<rect>`, `<path>`, `<text>`). Never use HTML `<div>` mockups for data visualizations.
10. **Single Source of Truth Adherence:** All video episode configurations must strictly validate against the master TypeScript schema defined in `src/types/content.types.ts`.

---

## 4. Definition of Done & Production Quality Checklist

### Definition of Done
The system is declared production-ready when:
> A new topic can be drafted with an emotional narrative arc, instantly voiced via TTS with word-level alignments, dynamically animated with native Remotion SVG primitives, and rendered locally into a broadcast-quality 1080 × 1920 YouTube Short that **educates, hooks, and emotionally moves the viewer without requiring manual timeline editing**.

### Pre-Publish 14-Point Quality Checklist

Before any exported `.mp4` is published to YouTube Shorts:

- [ ] **First 3 Seconds:** Hook disrupts the infinite scroll with an emotional dilemma or provocative paradox.
- [ ] **Human Stakes:** The macro problem is viscerally translated to the viewer's daily dinner table or wallet.
- [ ] **Duration Check:** Total video duration falls within the 45–90 second narrative sweet spot.
- [ ] **Safe Zone Passed:** No text, captions, or graphs overlap with the Top 180px, Bottom 320px, Right 140px, or Left 60px margins.
- [ ] **One Idea Per Beat:** Screen maintains low cognitive load; only one focal visual concept appears at a time.
- [ ] **Word-by-Word Subtitles:** Captions are clearly legible on mobile screens and pop with spring physics on active syllables.
- [ ] **Color Mood Shifts:** Visual background transitions smoothly across emotional states using `interpolateColors()`.
- [ ] **Audio Balance:** Voiceover is crisp and normalized to -14 LUFS; music ducks to 0.04 during speech; SFX trigger 3–5 frames before visual hits.
- [ ] **Dramatic Silence:** Background music cuts to absolute silence for 30–60 frames during the epiphany statement.
- [ ] **Seamless Loop Test:** The final sentence syntactically or thematically flows into the opening word of Beat 1.
- [ ] **Pure SVG Rendering:** Charts and trendlines are rendered deterministically using SVG primitives and `@remotion/paths`.
- [ ] **Font Preloading:** All fonts (Montserrat, Inter, JetBrains Mono) are loaded via `@remotion/google-fonts` without layout shift.
- [ ] **Frame Invariants Validated:** Total frame count strictly equals the sum of individual scene frames and matches narration duration.
- [ ] **Full Mobile Playthrough:** Video verified at 1x speed on an actual mobile device display.

---

## 5. Phased Implementation Roadmap Overview

> For the granular, living task tracker, acceptance criteria, and subtask checklists, refer to the authoritative document:  
> 🔗 [**05. Phased Implementation Roadmap & Milestone Tracker**](file:///c:/Users/skmpa/vdo/rm/docs/05-phased-roadmap.md)

### Phase 1 — Foundation, Story Primitives & Edge-TTS Prototype ✅ COMPLETED
- [x] Remotion v4 + TypeScript + Tailwind (`1080 × 1920`, 30 fps), first-party packages, `<ShortsSafeZone />`.
- [x] Edge-TTS via `uv run scripts/tts/generate-edge.py`; core + storytelling primitives.
- [x] **Milestone 1:** `out/001-why-inflation-hurts.mp4`.

### Phase 2 / 2.5 — Charts, SFX, Living Canvas ✅ COMPLETED
- [x] Pure SVG `<BarChart />`, `<LineChart />`, connectors, `<AudioMixer />` + SFX pack.
- [x] Living Canvas motion engine + `<EditorialCallout />`; Episode 002 remaster.
- [x] **Milestone 2:** `out/002-debt-clock.mp4` + `out/002-debt-clock-remastered.mp4`.

### Phase 3 — Production Voice Acting & Automation 🟡 PARTIAL
- [x] `scripts/tts/generate-elevenlabs.py` with expressive parameters + word timestamps (live on Ep 002).
- [x] `scripts/validate-episode.ts` invariant checks + `--sync` duration helper.
- [x] `scripts/scaffold-episode.ts` + `EpisodeShell` / `BeatSequence` for fast Episode 003+ starts.
- [ ] Full `build-episode` one-command render (**deferred**).

### Active Focus — Content-First Episode Production 🔵
- [ ] Ship Episode 003+ via scaffold → script → ElevenLabs → validate → thin composition → render.
- [ ] Prefer new topics/story/data over new tooling until the episode pattern is boring.

### Phase 4 — Analytics & Template Scaling ⚪ FUTURE
- [ ] Analyze YouTube Shorts retention drop-offs and refine hook pacing.
- [ ] Build genre presets (Finance, Tech/AI, Science).

---

## 6. Cross-Document Architecture Links

* **[01. Storytelling, Narrative & Sensitization Bible](file:///c:/Users/skmpa/vdo/rm/docs/01-storytelling-and-creative.md):** 5-beat emotional arc, SFX taxonomy, and creative copywriting.
* **[02. Technical Architecture & Engineering Specification](file:///c:/Users/skmpa/vdo/rm/docs/02-technical-architecture.md):** Remotion component implementations, `<ShortsSafeZone />`, `<AudioMixer />`, and SVG charting engine.
* **[03. Content Models, Schemas & Data Contracts](file:///c:/Users/skmpa/vdo/rm/docs/03-content-and-schemas.md):** TypeScript data contracts, `content.types.ts`, and episode configurations.
* **[05. Phased Implementation Roadmap & Milestone Tracker](file:///c:/Users/skmpa/vdo/rm/docs/05-phased-roadmap.md):** Living operational task tracker, subtask breakdowns, and acceptance gates.
