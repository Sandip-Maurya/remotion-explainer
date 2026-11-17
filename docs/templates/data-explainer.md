# Template: `data-explainer` (v1)

> **Family:** Ticking Clock / Hidden Mechanism (Doc 01 Archetypes C & D lean)  
> **Proven by:** Episode `002-debt-clock` remaster (`TheDebtClockRemastered`)  
> **Engine doc:** [06. Template Engine Architecture](../06-template-engine-architecture.md)

Data-heavy economic/tech explainers: big number hook → human stakes → chart mechanism → dramatic climax → payoff loop.

---

## Allowed slots (ordered typical flow)

| Slot | Narrative beat | Primary visuals |
|---|---|---|
| `metric-hook` | Hook | `MetricCard`, micro-bump, editorial callout |
| `before-after` | Agitation | `BeforeAfterSplit` (stacked or side-by-side) |
| `line-mechanism` | Mechanism | Tall `LineChart` + callout |
| `bar-mechanism` | Mechanism | Tall `BarChart` + callout |
| `climax-drop` | Climax | `TensionVignette`, `AnimatedArrow`, dramatic pause |
| `payoff-end` | Payoff | Lesson banner + `EndCard` |

**Notes:**
- Mechanism may use `line-mechanism` and/or `bar-mechanism` (Ep 002 uses both).  
- Living Canvas wrappers (`CameraDrift`, `OrganicHover`, `CameraMicroBump`) are template defaults, not episode concerns.  
- Prefer editorial callouts over permanent subtitle bars.

---

## Slot props (v1)

### `metric-hook`
```ts
{
  eyebrow: string;
  title: string | { prefix: string; accent: string };
  metric: {
    label: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
    delta?: string;
    trend?: 'up' | 'down' | 'neutral';
    subtext?: string;
    stats?: Array<{ label: string; value: string }>;
  };
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

### `before-after`
```ts
{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  before: { tag: string; value: string; label: string; subtext?: string };
  after: { tag: string; value: string; label: string; subtext?: string; isShock?: boolean };
  connectorBadge?: string;
  layout?: 'stacked' | 'side-by-side';
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

### `line-mechanism`
```ts
{
  title: string;
  data: Array<{ label: string; value: number }>;
  prefix?: string;
  unit?: string;
  height?: number;
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

### `bar-mechanism`
```ts
{
  title: string;
  data: Array<{ label: string; value: number; sublabel?: string; delta?: string }>;
  prefix?: string;
  unit?: string;
  highlightIndex?: number;
  decimals?: number;
  height?: number;
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

### `climax-drop`
```ts
{
  eyebrow: string;
  title: string;
  titleAccent?: string;
  arrowLabel?: string;
  dramaticPauseFrames: number; // 30–60 required
  dramaticPauseOffsetFrames?: number; // delay silence within the climax beat
  subBassHit?: boolean;
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

### `payoff-end`
```ts
{
  coreLesson: string;
  callToAction: string;
  loopBridge: string;
  bannerEyebrow?: string;
  bannerText?: string;
}
```

---

## Episode wiring example (conceptual)

```json
{
  "id": "002-debt-clock",
  "templateId": "data-explainer",
  "templateVersion": 1,
  "beats": [
    { "id": "b1", "slot": "metric-hook", "durationInFrames": 390, "props": { } },
    { "id": "b2", "slot": "before-after", "durationInFrames": 455, "props": { } },
    { "id": "b3a", "slot": "line-mechanism", "durationInFrames": 175, "props": { } },
    { "id": "b3b", "slot": "bar-mechanism", "durationInFrames": 315, "props": { } },
    { "id": "b4", "slot": "climax-drop", "durationInFrames": 340, "props": { "dramaticPauseFrames": 45 } },
    { "id": "b5", "slot": "payoff-end", "durationInFrames": 227, "props": { } }
  ]
}
```

Align durations to committed ElevenLabs narration for Ep 002 remaster (**1902** frames / **63.39s** at gate time). Legacy Edge-TTS 59s master is historical only.

---

## Extend guidance

- New debt/inflation/macro number story → same template, new episode data.  
- New interaction pattern (e.g. map flyover, terminal typing) → **new template**.  
