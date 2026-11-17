# Template: `decision-compare` (v1)

> **Family:** Myth vs Reality + decision helper (Doc 01 Archetype B)  
> **Proven by:** Episode `003-python-vs-javascript`  
> **Engine doc:** [06. Template Engine Architecture](../06-template-engine-architecture.md)

Neutral comparison / “pick a destination” Shorts. No forced winner. Strengths + weaknesses + goal chooser.

---

## Allowed slots (ordered typical flow)

| Slot | Narrative beat | Primary visuals |
|---|---|---|
| `hook-faceoff` | Hook | `LanguageFaceOff`, editorial callout |
| `paralysis-split` | Agitation | `BeforeAfterSplit` (wanted vs got) |
| `pros-cons` | Mechanism (repeatable) | `ChecklistCard` (one side per beat) |
| `goal-paths` | Climax | `GoalPathChooser`, tension vignette |
| `payoff-door` | Payoff | `EndCard` + reassurance callout |

**Notes:**
- Mechanism often uses **two** `pros-cons` beats (e.g. Python then JavaScript).  
- Climax should support dramatic pause metadata (30–60 frames) for music ducking.  
- Prefer checklists over dense tables on Shorts.

---

## Slot props (v1)

### `hook-faceoff`
```ts
{
  eyebrow: string;
  title: string;
  subtitle?: string;
  leftLabel: string;   // e.g. "PYTHON"
  rightLabel: string;  // e.g. "JAVASCRIPT"
  leftColor?: string;
  rightColor?: string;
  callout: { text: string; subtext?: string; badgeTag?: string };
}
```

### `paralysis-split`
```ts
{
  eyebrow: string;
  title: string;
  subtitle?: string;
  before: { tag: string; value: string; label: string; subtext?: string };
  after: { tag: string; value: string; label: string; subtext?: string; isShock?: boolean };
  connectorBadge?: string;
}
```

### `pros-cons`
```ts
{
  eyebrow: string;
  title: string;
  subtitle?: string;
  checklist: {
    title: string;
    subtitle?: string;
    accentColor?: string;
    items: Array<{ text: string; tone: 'pro' | 'con' | 'neutral' }>;
  };
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

### `goal-paths`
```ts
{
  eyebrow: string;
  title: string;          // e.g. "DON'T PICK A LANGUAGE"
  titleAccent?: string;   // e.g. "PICK A DESTINATION"
  chooserTitle?: string;
  paths: Array<{ ifLabel: string; thenLabel: string; accentColor?: string }>;
  callout?: { text: string; subtext?: string; badgeTag?: string };
  dramaticPauseFrames?: number; // 30–60
}
```

### `payoff-door`
```ts
{
  eyebrow: string;
  title: string;
  subtitle?: string;
  coreLesson: string;
  callToAction: string;
  loopBridge: string;
  callout?: { text: string; subtext?: string; badgeTag?: string };
}
```

---

## Episode wiring example (conceptual)

```json
{
  "id": "003-python-vs-javascript",
  "templateId": "decision-compare",
  "templateVersion": 1,
  "beats": [
    { "id": "b1", "slot": "hook-faceoff", "durationInFrames": 749, "props": { } },
    { "id": "b2", "slot": "paralysis-split", "durationInFrames": 436, "props": { } },
    { "id": "b3a", "slot": "pros-cons", "durationInFrames": 1056, "props": { } },
    { "id": "b3b", "slot": "pros-cons", "durationInFrames": 1070, "props": { } },
    { "id": "b4", "slot": "goal-paths", "durationInFrames": 765, "props": { "dramaticPauseFrames": 42 } },
    { "id": "b5", "slot": "payoff-door", "durationInFrames": 866, "props": { } }
  ]
}
```

Durations must match committed narration (Ep 003: **4942** frames / **164.72s** at gate time).

---

## Extend guidance

- New “A vs B for beginners” topic → same template, new episode folder.  
- New layout (e.g. three-way compare) → **new template**, do not overload this one.  
