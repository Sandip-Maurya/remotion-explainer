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
* Episode folder must contain `episodes/<slug>/script.txt` (falls back to legacy `videos/<slug>/`).

#### What the script does
1. Calls ElevenLabs `POST /v1/text-to-speech/{voice_id}/with-timestamps` (`eleven_multilingual_v2`).
2. Writes `episodes/<slug>/narration.mp3` and word-level `captions.json`.
3. Mirrors both into `public/<slug>/` for Remotion `staticFile()`.
4. Updates `episodes/<slug>/content.json` narration metadata (`engine`, `voiceId`, `audioFile`, `durationInSeconds`).

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

> **Template engine target** ([Doc 06](./06-template-engine-architecture.md)): episode = data product; template = layout recipe; `out/` gitignored; **audio committed**.

```text
[Step 0: Choose template + scaffold]
  - Pick templateId: decision-compare | data-explainer | (rare) custom
  - npm run scaffold -- --slug 004-topic --title "Title" --template decision-compare
  - Creates episodes/<slug>/ with content.json (beats/slots), script stubs, public mirror dirs
  - Does NOT invent a one-off composition in shared engine files

[Step 1: Topic & Narrative Draft]
  - Formulate the core paradox using Doc 01 + template slot doc
  - Write episodes/<slug>/script.txt (flexible duration; story over hard cutoffs)

[Step 2: Generate Speech & Timestamps]
  - Prototype: Edge-TTS into episodes/<slug>/
  - Production: npm run tts:elevenlabs -- --slug <slug>
  - Commit narration.mp3 + captions.json with the episode (policy: audio stays in git)

[Step 3: Fill beat props + validate]
  - Map spoken beats → slot props in content.json (no hardcoded copy in templates)
  - npm run validate -- --slug <slug> [--sync]
  - Rebalance beat durations so Σ beats == audio frames

[Step 4: Studio review]
  - npm run dev → open composition id == slug (auto-registered after template-engine cutover)
  - Safe-zone scrub; one idea per beat; SFX/callout timing

[Step 5: Render]
  - npm run build -- --slug <slug>
  - Pipeline: mirror public audio → validate → remotion render → out/<slug>.mp4
  - TTS runs only when narration.mp3 is missing (or with --force-tts)
  - Low-level escape: npm run render -- src/index.ts <CompositionId> out/<slug>.mp4 --gl=angle
```


---

## 3. Strict Guardrails for AI Coding Agents

When working inside this codebase, AI coding assistants must obey these directives:

1. **In-Built Remotion Priority:** Official `@remotion/*` first; no external chart/icon/animation packages without human approval.
2. **Mandatory `.tsx` Extension:** Visual components/templates as `.tsx` with strict types.
3. **No Hard-Coded Episode Copy:** Never hardcode script/stats inside templates or shared components — only `content.json` beat props.
4. **Extend Templates, Don't Patch for One Video:** New genre → new `src/templates/<id>/`. Normal episode → new `episodes/<slug>/` only. Do not modify `decision-compare` / `data-explainer` just to ship one topic.
5. **Mobile Safe Zone Enforcement:** No focal UI in Top 180 / Bottom 320 / Right 140 / Left 60.
6. **Human Stakes with Every Stat:** Macro numbers need a lived-consequence callout.
7. **100% Deterministic Animations:** No unseeded `Math.random()`, `setInterval`, `requestAnimationFrame`, or CSS `transition`.
8. **Dramatic Silence Enforcement:** Climax music duck/cut 30–60 frames when the template slot declares it.
9. **Narrative Duration Flexibility:** Story depth over rigid 45–60s cuts (Shorts limits may still apply for publish format).
10. **Pure SVG for Data Charts:** Native SVG + `@remotion/paths` — no HTML div faux charts.
11. **Schema SSOT:** Episodes validate as Schema v1 (`templateId` + `beats`) per Doc 03 / Doc 06; legacy `scenes[]` only for pre-migration files.
12. **Audio in Git:** Commit `narration.mp3` + `captions.json`; do not delete them to “save space.” Ignore `out/` renders only.

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
- [x] ElevenLabs TTS + validate/scaffold tooling; Ep 002/003 shipped with committed audio.
- [ ] Full `build-episode` CLI (completes with the template engine).

### Active Focus — Template Engine 🔵
- [x] Design docs: Doc 06 + template slot catalogs (`decision-compare`, `data-explainer`).
- [ ] Implement engine/templates/episodes cutover.
- [ ] Validation gate: re-render Ep 002 + Ep 003 from templates + episode data only.

### Phase 4 — Analytics & Template Scaling ⚪ FUTURE
- [ ] Analyze YouTube Shorts retention drop-offs and refine hook pacing.
- [ ] Build genre presets (Finance, Tech/AI, Science).

---

## 6. Cross-Document Architecture Links

* **[01. Storytelling](./01-storytelling-and-creative.md):** arcs, SFX, copy.
* **[02. Technical Architecture](./02-technical-architecture.md):** engine tree + primitives.
* **[03. Content Models](./03-content-and-schemas.md):** Schema v1 + invariants.
* **[05. Phased Roadmap](./05-phased-roadmap.md):** Template-engine milestone tracker.
* **[06. Template Engine Architecture](./06-template-engine-architecture.md):** Template-engine SSOT.
