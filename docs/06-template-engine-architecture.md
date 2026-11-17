# 06. Template Engine Architecture

> **Status:** Design SSOT — approved for implementation.  
> **Checkpoint:** Pre-refactor code committed. Audio (`narration.mp3`) **stays in git**.  
> **Validation gate:** Re-render Episode 002 + Episode 003 from templates + episode data only.

This document is the authoritative architecture for scaling the Shorts engine. Documents 01–05 remain valid for creative rules, Remotion primitives, invariants, and production ops; **this doc defines the engine → templates → episodes product model.**

---

## 1. Problem Statement

Today the system is **componentized but not productized**:

| Layer | Status |
|---|---|
| Primitives (charts, motion, SFX, shell) | Reusable |
| Episode product | Custom `.tsx` still owns timing, copy, layout |
| `content.json` | Partial contract — often ignored by composition |
| Scaling cost | New video = clone/edit composition + risk touching shared files |

**Goal:** Most new videos are **data products**. New looks are **new templates** (extend), never patches to old templates or the engine for a single episode.

---

## 2. Product Model

```text
ENGINE (stable runtime)
  └─ TEMPLATES (versioned layout recipes — additive)
       └─ EPISODES (data products — script, content, audio, captions)
            └─ RENDER ARTIFACTS (out/ — disposable, gitignored)
```

### Responsibilities

| Layer | Owns | Must not own |
|---|---|---|
| **Engine** | Remotion boot, `Root` discovery, AudioMixer, theme, motion primitives, validate/TTS/render CLI, invariants | Episode-specific copy, chart series, callout text |
| **Template** | Slot layouts, animation choreography, default mood/SFX policy for a *genre of story* | Hardcoded episode statistics or scripts |
| **Episode** | `script.txt`, `content.json`, `narration.mp3`, `captions.json`, optional assets | Forked copies of template markup |
| **`out/`** | Final MP4 / stills / thumbnails for publish | Source of truth (always regenerable) |

### Design Principles

1. **Episode never patches shared templates** — only adds data or a new template.  
2. **Template versioning** — `templateVersion` keeps old episodes renderable.  
3. **Invariants stay engine-level** — frame sum, audio sync, caption bounds, climax pause.  
4. **Render is a pure function** of `(engine, templateVersion, episode data, assets)`.  
5. **Improve by regenerating**, not by forking composition code per video.  
6. **Audio in git** — `narration.mp3` + `captions.json` are committed (not heavy; guarantees offline/bit-stable VO).

---

## 3. Target Directory Tree

```text
explainer-channel/
├─ docs/
│  ├─ 01-…05-…                 # Existing SSOT docs (aligned with template engine)
│  ├─ 06-template-engine-architecture.md   # THIS FILE
│  └─ templates/
│     ├─ decision-compare.md   # Slot + props contract (Ep 003 family)
│     └─ data-explainer.md     # Slot + props contract (Ep 002 family)
│
├─ scripts/                    # Engine CLIs (validate, scaffold, TTS, build)
├─ public/                     # staticFile() mirrors (sfx, episode audio/captions)
├─ out/                        # GITIGNORED — renders & publish artifacts
│
├─ src/                        # ENGINE
│  ├─ index.ts
│  ├─ Root.tsx                 # Discovers episodes; registers compositions
│  ├─ engine/
│  │  ├─ discoverEpisodes.ts
│  │  ├─ registerComposition.ts
│  │  └─ buildEpisode.ts       # CLI orchestration (later)
│  ├─ templates/
│  │  ├─ registry.ts           # templateId → module
│  │  ├─ decision-compare/
│  │  │  ├─ index.tsx          # render(content)
│  │  │  ├─ slots/             # optional per-slot components
│  │  │  └─ schema.ts          # slot prop types
│  │  └─ data-explainer/
│  │     ├─ index.tsx
│  │     ├─ slots/
│  │     └─ schema.ts
│  ├─ components/              # Shared primitives (unchanged role)
│  ├─ audio/
│  ├─ styles/
│  └─ types/
│     ├─ content.types.ts      # Episode schema v1 (templateId + beats)
│     └─ audio.types.ts
│
└─ episodes/                   # EPISODE PRODUCTS (renamed from videos/ over time)
   ├─ 002-debt-clock/
   │  ├─ script.txt
   │  ├─ script.md
   │  ├─ content.json          # templateId: data-explainer
   │  ├─ narration.mp3         # COMMITTED
   │  ├─ captions.json         # COMMITTED
   │  └─ assets/
   └─ 003-python-vs-javascript/
      ├─ script.txt
      ├─ script.md
      ├─ content.json          # templateId: decision-compare
      ├─ narration.mp3
      ├─ captions.json
      └─ assets/
```

**Migration note:** **I1 done** — episode products live under `episodes/`; Schema v1 types + discovery + registry stub exist. Legacy `src/compositions/*` still render until I2/I3 extract templates. `videos/` is a pointer-only leftover. Doc 05 tracks the cutover.

**Git policy:**
- ✅ Commit: episode data, narration, captions, templates, engine  
- ❌ Ignore: `out/**` (MP4 masters, preview stills, generated thumbnails for publish)

---

## 4. Episode Product Contract

Every episode folder is a **reproducible product**:

| File | Required | Notes |
|---|---|---|
| `content.json` | Yes | Schema v1 — see Doc 03 + §5 below |
| `script.txt` | Yes | VO source for TTS / regen |
| `narration.mp3` | Yes (in git) | Production voice; do not rely on API for clone builds |
| `captions.json` | Yes (in git) | Word-level tokens |
| `script.md` | Recommended | Director cues, SFX tags, visual board |
| `assets/` | Optional | Episode-only images/SVGs |

### Reproduce command (target)

```bash
npm run build -- --slug 003-python-vs-javascript
# validate → render → out/003-python-vs-javascript.mp4
# TTS skipped when narration.mp3 already present (default)
```

Cloud / mobile agent instruction collapses to: *choose template → write episode folder → run build*.

---

## 5. Content Schema v1 (Declarative Beats)

Conceptual shape (TypeScript authority lives in Doc 03 / `content.types.ts` after implementation):

```ts
interface EpisodeContentV1 {
  id: string;
  title: string;
  topic: 'Economics' | 'Technology' | 'Psychology' | 'Society';
  aspectRatio: '9:16';
  fps: 30;
  totalDurationInFrames: number;

  templateId: 'decision-compare' | 'data-explainer' | 'custom';
  templateVersion: number; // start at 1

  narrativeMood: NarrativeMood;
  narration: NarrationTrack;
  backgroundMusic?: BackgroundMusicTrack;
  sfxEvents: SfxCue[];

  /** Ordered beats; slot must be allowed by the template */
  beats: Array<{
    id: string;
    slot: string;
    durationInFrames: number;
    props: Record<string, unknown>; // validated per template schema
  }>;
}
```

**Invariants (unchanged, engine-enforced):**
1. Σ `beats.durationInFrames` == `totalDurationInFrames`  
2. `totalDurationInFrames` == ⌈`narration.durationInSeconds` × fps⌉  
3. Caption tokens within video bounds  
4. Climax / dramatic pause 30–60 frames when template declares a climax slot  
5. Safe zone geometry for all focal UI  

Legacy `scenes[]` (hook / human-stakes / …) remains documented for Ep 001 and transitional files; **new work uses `beats[]` + `templateId`.**

---

## 6. Template Interface & Registry

```ts
interface VideoTemplate {
  id: string;
  version: number;
  /** Allowed slot names */
  slots: readonly string[];
  /** Optional default SFX / mood policy */
  defaults?: { progressColor?: string; ambientColor?: string };
  render: (content: EpisodeContentV1) => React.ReactNode;
}
```

`src/templates/registry.ts` maps `templateId` → module.  
`Root.tsx` discovers `episodes/*/content.json`, resolves template, registers `<Composition id={slug} />` with `calculateMetadata` from `totalDurationInFrames`.

### Escape hatch

```json
{
  "templateId": "custom",
  "compositionModule": "./episodes/012-special/Custom.tsx"
}
```

Rare. 80–90% of channel videos must not use it.

### Extend vs modify

| Change request | Action |
|---|---|
| New topic, same story shape | New `episodes/<slug>/` only |
| New visual genre / layout | New `src/templates/<id>/` + doc under `docs/templates/` |
| Bug in all decision videos | Fix `decision-compare` (bump `templateVersion` if breaking) |
| Engine-wide audio/validate | Change `src/engine` / scripts only |

---

## 7. Initial Template Catalog

| templateId | Family | Source video | Doc |
|---|---|---|---|
| `decision-compare` | Myth vs Reality / decision helper | `003-python-vs-javascript` | [templates/decision-compare.md](./templates/decision-compare.md) |
| `data-explainer` | Ticking clock / mechanism explainer | `002-debt-clock` (remaster) | [templates/data-explainer.md](./templates/data-explainer.md) |

Episode 001 (`why-inflation-hurts`) may remain a thin legacy composition until both templates pass the validation gate.

---

## 8. Implementation Phases (Code — after this doc)

| Phase | Deliverable |
|---|---|
| **M1** | Folders + types + discovery stubs; `out/` gitignored; audio remains committed |
| **M2** | Extract `decision-compare` + `data-explainer` from existing compositions |
| **M3** | Migrate Ep 002 + 003 `content.json` to beats/slots; thin adapters or delete old compositions |
| **M4** | Validation gate: re-render both masters from engine |
| **M5** | Scaffold writes episode **data for a template**; `build --slug` CLI; agent runbook |

**Do not invert:** schema/folders → templates from existing videos → data migration → re-render → delete legacy markup.

---

## 9. Validation Gate (Definition of Done)

Reproduce:

```bash
npm run build -- --slug 002-debt-clock
npm run build -- --slug 003-python-vs-javascript
```

**Pass criteria:**
1. No edits to shared templates required to build either episode as a one-off.  
2. Frame/audio/caption invariants pass.  
3. Visual parity “good enough” vs current `out/002-debt-clock-remastered.mp4` and `out/003-python-vs-javascript.mp4` (same beats, VO, SFX intent).  
4. Smoke test: change one callout/prop in Ep 003 JSON only → re-render succeeds.  
5. `out/` is gitignored; episode audio remains in git and is used without mandatory TTS.

---

## 10. Non-Goals

- A single unbounded “mega-renderer” that turns arbitrary JSON into any scene without templates  
- Rewriting Doc 01 creative rules into engineering slots  
- Deleting legacy compositions before the validation gate passes  
- Cloud/Lambda batch render (Phase 4)  
- Removing committed narration to save repo size  

---

## 11. Cross-Document Links

* [01. Storytelling](./01-storytelling-and-creative.md) — arcs & archetypes (templates map to these)  
* [02. Technical Architecture](./02-technical-architecture.md) — Remotion primitives + updated tree  
* [03. Content Models](./03-content-and-schemas.md) — Schema v1 + invariants  
* [04. Production & Agent Guide](./04-production-and-agent-guide.md) — build protocol & guardrails  
* [05. Phased Roadmap](./05-phased-roadmap.md) — Template-engine milestone tracker  
* [decision-compare template](./templates/decision-compare.md)  
* [data-explainer template](./templates/data-explainer.md)  
