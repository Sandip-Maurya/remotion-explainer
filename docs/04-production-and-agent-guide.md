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

### Tier 2 (Production Polish): ElevenLabs Integration

Once the script and animation timings are locked in Remotion Studio, run the ElevenLabs production script to generate studio-grade human-like emotional speech with word alignments.

#### TypeScript Implementation (`scripts/tts/generate-elevenlabs.ts`)

```bash
npm install elevenlabs
```

```ts
// scripts/tts/generate-elevenlabs.ts
import { ElevenLabsClient } from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function generateProductionAudio(episodeDir: string, voiceId = 'pNInz6obpgDQGcFmaJgB') {
  const scriptPath = path.join(episodeDir, 'script.txt');
  const audioOutputPath = path.join(episodeDir, 'narration.mp3');
  const captionsOutputPath = path.join(episodeDir, 'captions.json');

  const text = fs.readFileSync(scriptPath, 'utf-8').trim();

  console.log(`Generating ElevenLabs audio for: ${scriptPath}`);

  // Request audio with timestamp alignments
  const response = await client.textToSpeech.convertWithTimestamps(voiceId, {
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.45,        // Higher dynamic emotional range
      similarity_boost: 0.85, // Crisp persona preservation
      style: 0.35,            // Subtle dramatic exaggeration
      use_speaker_boost: true,
    },
  });

  // Write MP3 audio
  const audioBuffer = Buffer.from(response.audio_base64, 'base64');
  fs.writeFileSync(audioOutputPath, audioBuffer);

  // Normalize character alignments into word-level CaptionTokens
  const words: { text: string; startMs: number; endMs: number; isEmphasized?: boolean }[] = [];
  const chars = response.alignment?.characters || [];
  const startTimes = response.alignment?.character_start_times_seconds || [];
  const endTimes = response.alignment?.character_end_times_seconds || [];

  let currentWord = '';
  let wordStartMs = 0;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (currentWord === '' && char.trim() !== '') {
      wordStartMs = Math.round(startTimes[i] * 1000);
    }

    if (/\s/.test(char) || i === chars.length - 1) {
      if (char.trim() !== '') currentWord += char;
      if (currentWord.trim().length > 0) {
        const cleanWord = currentWord.trim().replace(/^[^\w]+|[^\w]+$/g, '');
        const wordEndMs = Math.round(endTimes[i] * 1000);
        words.push({
          text: cleanWord,
          startMs: wordStartMs,
          endMs: wordEndMs,
        });
        currentWord = '';
      }
    } else {
      currentWord += char;
    }
  }

  fs.writeFileSync(captionsOutputPath, JSON.stringify(words, null, 2), 'utf-8');
  console.log(`Audio saved: ${audioOutputPath}`);
  console.log(`Captions saved (${words.length} words): ${captionsOutputPath}`);
}
```

#### CLI Command:
```bash
npx tsx scripts/tts/generate-elevenlabs.ts --episode videos/001-why-inflation-hurts
```

---

## 2. Step-by-Step Production Protocol

```text
[Step 1: Topic & Narrative Draft]
  - Formulate the core paradox or dilemma using Doc 01.
  - Write script in `videos/<slug>/script.txt` (130–180 words, 45–80 seconds).

[Step 2: Generate Speech & Timestamps]
  - Execute `uv run scripts/tts/generate-edge.py --script videos/<slug>/script.txt --audio videos/<slug>/narration.mp3 --captions videos/<slug>/captions.json`.
  - Check the output audio duration: `durationInFrames = Math.ceil(audioSeconds * 30)`.

[Step 3: Assemble `content.json`]
  - Break script into 4–5 scenes: Hook -> Stakes -> Mechanism -> Climax -> Payoff.
  - Map specific word timestamps to scene cut points.

[Step 4: Interactive Remotion Studio Review]
  - Run `npm run dev` to launch Remotion Studio at `http://localhost:3000`.
  - Enable the `<ShortsSafeZone />` overlay.
  - Scrub timeline to confirm:
    1. Visuals enter precisely on audio keywords.
    2. Numbers count up smoothly with spring physics.
    3. No text touches the top 180px, bottom 320px, right 140px, or left 60px danger zones.

[Step 5: Local CLI Render]
  - Execute render command:
    npx remotion render Root <CompositionId> out/<slug>.mp4 --gl=angle
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

### Phase 1 — Foundation, Story Primitives & Edge-TTS Prototype (Current Active Sprint)
- [ ] Initialize Remotion project with TypeScript + Tailwind CSS (`1080 x 1920`, 30 fps).
- [ ] Install first-party packages: `@remotion/transitions`, `@remotion/shapes`, `@remotion/paths`, `@remotion/captions`, `@remotion/media-utils`, `@remotion/google-fonts`.
- [ ] Implement `<ShortsSafeZone />` overlay guide.
- [ ] Configure `scripts/tts/generate-edge.py` with `uv` inline metadata for instant local speech & timestamp extraction.
- [ ] Build Core Visual Primitives: `<Title />`, `<BigNumber />`, `<ProgressBar />`, `<KineticCaptions />`.
- [ ] Build Storytelling Primitives: `<HumanStakesCard />`, `<DramaticQuote />`, `<TensionVignette />`.
- [ ] **Milestone 1:** Produce one complete 50–70s test Short (*"Why $100 Isn't $100 Anymore"*) with Edge-TTS, dynamic background mood, and synchronized SFX.

### Phase 2 — Explainer Charts & Component Suite
- [ ] Build pure SVG `<BarChart />` and `<LineChart />` using `@remotion/paths`.
- [ ] Build diagram connectors: `<StepTimeline />`, `<AnimatedArrow />`, `<BeforeAfterSplit />`.
- [ ] Implement `<AudioMixer />` with dynamic music ducking and SFX library.
- [ ] **Milestone 2:** Produce a data-heavy economic/tech explainer short using the component suite.

### Phase 3 — Production Voice Acting & ElevenLabs Integration
- [ ] Implement `scripts/tts/generate-elevenlabs.ts` with expressive voice parameters.
- [ ] Integrate automatic character/word timestamping for caption synchronization.
- [ ] Build automated pipeline where providing `script.txt` automatically generates audio, updates `content.json`, and triggers local render.

### Phase 4 — Analytics & Template Scaling
- [ ] Analyze YouTube Shorts retention drop-offs and refine hook pacing.
- [ ] Build genre presets (Finance, Tech/AI, Science).

---

## 6. Cross-Document Architecture Links

* **[01. Storytelling, Narrative & Sensitization Bible](file:///c:/Users/skmpa/vdo/rm/docs/01-storytelling-and-creative.md):** 5-beat emotional arc, SFX taxonomy, and creative copywriting.
* **[02. Technical Architecture & Engineering Specification](file:///c:/Users/skmpa/vdo/rm/docs/02-technical-architecture.md):** Remotion component implementations, `<ShortsSafeZone />`, `<AudioMixer />`, and SVG charting engine.
* **[03. Content Models, Schemas & Data Contracts](file:///c:/Users/skmpa/vdo/rm/docs/03-content-and-schemas.md):** TypeScript data contracts, `content.types.ts`, and episode configurations.
* **[05. Phased Implementation Roadmap & Milestone Tracker](file:///c:/Users/skmpa/vdo/rm/docs/05-phased-roadmap.md):** Living operational task tracker, subtask breakdowns, and acceptance gates.
