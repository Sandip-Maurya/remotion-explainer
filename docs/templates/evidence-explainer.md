# Template: `evidence-explainer` (v1)

> **Family:** Photo / documentary evidence + mechanism (Doc 01 ticking-clock lean)  
> **Proven by:** Episode `004-credit-card-blood`  
> **Engine doc:** [06. Template Engine Architecture](../06-template-engine-architecture.md)

Evidence-led Shorts: documentary stills → diagram/chart mechanism → dramatic climax → payoff. Use when the story needs real imagery more than metric cards.

---

## Allowed slots (ordered typical flow)

| Slot | Narrative beat | Primary visuals |
|---|---|---|
| `asset-spotlight` | Hook / agitation (repeatable) | `DocumentaryImage` + callout |
| `diagram-spotlight` | Mechanism (visual system) | Registered SVG diagrams |
| `line-mechanism` | Mechanism (data) | Tall `LineChart` + callout |
| `bar-mechanism` | Mechanism (data) | Tall `BarChart` + callout |
| `climax-drop` | Climax | `TensionVignette`, `AnimatedArrow`, dramatic pause |
| `payoff-end` | Payoff | Lesson banner + `EndCard` |

**Notes:**
- Prefer multiple `asset-spotlight` beats over packing several photos into one beat.  
- New diagram kinds → extend `diagramType` union + renderer (bump `templateVersion` if breaking).  
- Do **not** patch `data-explainer` for photo stories — that template stays metric/chart-first.

---

## Slot props (v1)

### `asset-spotlight`
```ts
{
  eyebrow?: string;
  eyebrowColor?: string;
  title: string | { prefix: string; accent: string };
  subtitle?: string;
  imageSrc: string; // path under public/
  badgeTag?: string;
  badgeColor?: string;
  caption?: string;
  zoomDirection?: 'in' | 'out';
  callout?: { text: string; subtext?: string; badgeTag?: string; accentColor?: string; startFrame?: number; durationFrames?: number };
}
```

### `diagram-spotlight`
```ts
{
  eyebrow?: string;
  eyebrowColor?: string;
  title: string | { prefix: string; accent: string };
  subtitle?: string;
  diagramType: 'fragmentation';
  callout?: { … };
}
```

### `line-mechanism` / `bar-mechanism` / `climax-drop` / `payoff-end`
Same contracts as [`data-explainer`](./data-explainer.md).  
`climax-drop` may also set `dramaticPauseOffsetFrames` to delay music silence within the beat.

---

## Episode wiring example

```json
{
  "id": "004-credit-card-blood",
  "templateId": "evidence-explainer",
  "templateVersion": 1,
  "beats": [
    { "id": "b1", "slot": "asset-spotlight", "durationInFrames": 200, "props": { } },
    { "id": "b2", "slot": "diagram-spotlight", "durationInFrames": 535, "props": { "diagramType": "fragmentation" } },
    { "id": "b3", "slot": "line-mechanism", "durationInFrames": 387, "props": { } },
    { "id": "b4", "slot": "climax-drop", "durationInFrames": 288, "props": { "dramaticPauseFrames": 45 } },
    { "id": "b5", "slot": "payoff-end", "durationInFrames": 380, "props": { } }
  ]
}
```

---

## Extend guidance

- New microplastic / climate / forensics photo story → same template, new episode folder.  
- Pure number explainer without photos → use `data-explainer`, not this template.  
- New interaction (e.g. map flyover) → **new template**.
