# YouTube Shorts Explainer Production Engine

> **A local-first, programmatic video production system for high-retention English YouTube Shorts, motion graphics, and narrative-driven educational content.**

Built with **Remotion + React + TypeScript + Tailwind CSS**, powered by a two-tier voice pipeline (**Microsoft Edge-TTS** for rapid zero-cost prototyping and **ElevenLabs** for production voice acting).

---

## The Core Philosophy

1. **"Story & Emotion First, Data to Validate"**  
   Anchor every abstract concept in relatable human stakes before showing charts.
2. **"Change the Content, Not the Production System"**  
   Episodes are data products; templates own layout. (See Doc 06.)
3. **"In-Built First-Party Remotion Priority"**  
   Prefer official `@remotion/*` packages and pure SVG over third-party bloat.

---

## Project Documentation Hub

| Document | Purpose |
|---|---|
| [**01. Storytelling & Creative**](docs/01-storytelling-and-creative.md) | 5-beat arc, archetypes, mood, SFX |
| [**02. Technical Architecture**](docs/02-technical-architecture.md) | Remotion engine, safe zones, primitives, template-engine tree |
| [**03. Content Models & Schemas**](docs/03-content-and-schemas.md) | Schema v1 (`templateId` + `beats`) + legacy `scenes[]` |
| [**04. Production & Agent Guide**](docs/04-production-and-agent-guide.md) | TTS, build protocol, agent guardrails |
| [**05. Phased Roadmap**](docs/05-phased-roadmap.md) | Milestones + template-engine tracker |
| [**06. Template Engine Architecture**](docs/06-template-engine-architecture.md) | **SSOT for scale:** engine → templates → episodes → `out/` |
| [**templates/decision-compare**](docs/templates/decision-compare.md) | Ep 003 family slots |
| [**templates/data-explainer**](docs/templates/data-explainer.md) | Ep 002 family slots |

---

## Quick Reference

* **Engine:** Remotion `v4.0.x` + React + TypeScript + Tailwind  
* **Resolution:** `1080 × 1920` @ `30 fps`  
* **Duration:** Flexible (story first; often 45–90s+, longer OK when needed)  
* **Safe Zone:** Top 180 · Bottom 320 · Right 140 · Left 60 → **880 × 1420**  
* **Audio policy:** Commit `narration.mp3` + `captions.json` with each episode  
* **Renders:** `out/` is **gitignored** and regenerable  

### Voice
* Prototype: `uv run scripts/tts/generate-edge.py …`  
* Production: `npm run tts:elevenlabs -- --slug <slug>`  

### Episodes & validate
```bash
npm run episodes          # list products under episodes/
npm run validate -- --slug 003-python-vs-javascript
npm run validate:all
```

---

## Current Status

| Area | Status |
|---|---|
| Phase 1–2.5 | ✅ Complete (foundation, charts, Living Canvas, Ep 002) |
| Phase 3 voice/tooling | ✅ ElevenLabs + validate/scaffold; Ep 002/003 masters exist |
| Phase 3.5 Ep 003 | ✅ `out/003-python-vs-javascript.mp4` (+ thumbnail) |
| **Phase 3.6 Template Engine** | 🔵 **Docs complete → implementation next** |

**Validation gate (after code):** re-render Episodes **002** and **003** from templates + episode data only.

---

## Active Focus: Template Engine (docs → code → re-render)

Product model:

```text
ENGINE (stable) → TEMPLATES (extend) → EPISODES (data + committed audio) → out/ (ignored)
```

Initial templates:
- `data-explainer` ← Episode 002  
- `decision-compare` ← Episode 003  

See [docs/06-template-engine-architecture.md](docs/06-template-engine-architecture.md) before changing structure.

**Interim render (legacy compositions still active until cutover):**
```bash
.\node_modules\.bin\remotion render src/index.ts PythonVsJavascript out/003-python-vs-javascript.mp4 --gl=angle
```
