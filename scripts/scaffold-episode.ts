#!/usr/bin/env npx tsx
/**
 * Scaffold a new episode workspace for content-first production.
 *
 * Usage:
 *   npx tsx scripts/scaffold-episode.ts --slug 003-hidden-fee --title "The Hidden Fee Tax"
 *   npx tsx scripts/scaffold-episode.ts --slug 003-hidden-fee --title "The Hidden Fee Tax" --topic Economics --mood urgent-escalation
 */

import * as fs from 'fs';
import * as path from 'path';

type Topic = 'Economics' | 'Technology' | 'Psychology' | 'Society';
type Mood =
  | 'tension-to-clarity'
  | 'curiosity-to-wonder'
  | 'myth-inversion'
  | 'urgent-escalation';

function parseArgs(argv: string[]) {
  const args = {
    slug: '',
    title: '',
    topic: 'Economics' as Topic,
    mood: 'tension-to-clarity' as Mood,
    force: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') args.slug = argv[++i] ?? '';
    else if (a === '--title') args.title = argv[++i] ?? '';
    else if (a === '--topic') args.topic = (argv[++i] ?? args.topic) as Topic;
    else if (a === '--mood') args.mood = (argv[++i] ?? args.mood) as Mood;
    else if (a === '--force') args.force = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }

  return args;
}

function toPascalCase(slug: string): string {
  return slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Valid TS component name — strip leading episode number (003-foo → Foo). */
function toCompositionName(slug: string): string {
  const withoutNumber = slug.replace(/^\d+-/, '');
  const name = toPascalCase(withoutNumber || slug);
  return /^\d/.test(name) ? `Episode${name}` : name;
}

function buildContentJson(opts: {
  slug: string;
  title: string;
  topic: Topic;
  mood: Mood;
}) {
  // Placeholder 60s / 1800 frames — replace after TTS with validate --sync + beat rebalance
  return {
    id: opts.slug,
    title: opts.title,
    topic: opts.topic,
    aspectRatio: '9:16' as const,
    fps: 30,
    totalDurationInFrames: 1800,
    narrativeMood: opts.mood,
    narration: {
      engine: 'elevenlabs' as const,
      voiceId: 'Daniel (onwK4e9ZLuTAKqWW03F9)',
      audioFile: `${opts.slug}/narration.mp3`,
      durationInSeconds: 60,
    },
    sfxEvents: [
      { frame: 0, soundId: 'sub-drop', volume: 0.8 },
      { frame: 360, soundId: 'whoosh', volume: 0.5 },
      { frame: 720, soundId: 'pop', volume: 0.6 },
      { frame: 1200, soundId: 'sub-drop', volume: 0.85 },
      { frame: 1560, soundId: 'chime', volume: 0.65 },
    ],
    scenes: [
      {
        id: 'scene-1-hook',
        type: 'hook',
        durationInFrames: 360,
        headline: 'HOOK HEADLINE — replace me',
        subtext: 'One-line paradox or personal stakes.',
        highlightWord: 'replace',
        metaphor: 'clock',
      },
      {
        id: 'scene-2-stakes',
        type: 'human-stakes',
        durationInFrames: 360,
        personaLabel: 'Your Wallet / Dinner Table',
        comparison: {
          pastLabel: 'Before',
          pastValue: '$X',
          presentLabel: 'Today',
          presentValue: '$Y',
        },
        impactStatement: 'Translate the macro number into lived consequence.',
      },
      {
        id: 'scene-3-mechanism',
        type: 'chart-explanation',
        durationInFrames: 480,
        chartType: 'line',
        chartTitle: 'Mechanism Chart Title',
        data: [
          { label: 'A', value: 10 },
          { label: 'B', value: 25 },
          { label: 'C', value: 55 },
          { label: 'D', value: 90 },
        ],
        unit: '',
        highlightIndex: 3,
        keyTakeaway: 'One sentence behind-the-curtain takeaway.',
      },
      {
        id: 'scene-4-climax',
        type: 'dramatic-climax',
        durationInFrames: 360,
        epiphanyHeadline: 'THE REAL MECHANISM',
        punchline: 'Deliver the paradigm shift in one clean line.',
        dramaticPauseFrames: 45,
        subBassHit: true,
      },
      {
        id: 'scene-5-payoff',
        type: 'empowerment-payoff',
        durationInFrames: 240,
        coreLesson: 'Leave the viewer smarter and empowered.',
        callToAction: 'Follow for the next hidden mechanism.',
        loopTransitionPhrase: 'Because every single week...',
      },
    ],
  };
}

function buildScriptStub(title: string): string {
  return `HOOK — open with a paradox or personal stake about ${title}.

AGITATION — make the macro pain land at the dinner table or wallet.

MECHANISM — one clean explanation of how the system actually works.

CLIMAX — cut the fluff. Deliver the paradigm shift in one sentence.

PAYOFF — empower the viewer and bridge back into the opening loop.
`;
}

function buildScriptMd(title: string): string {
  return `# ${title}

## Narrative Arc
- Archetype: (Dinner Table / Myth vs Reality / Ticking Clock / David vs Goliath)
- Mood beat colors: Hook amber → Agitation red → Mechanism blue → Climax white → Payoff emerald

## Script with Audio Direction
\`\`\`markdown
[Beat 1 — Hook]
...
[SFX: sub-drop]
[PAUSE: 0.5s]

[Beat 2 — Agitation]
...
[SFX: whoosh]

[Beat 3 — Mechanism]
...
[SFX: pop]

[Beat 4 — Climax]
[MUSIC_STOP: 1.5s]
...
[SFX: sub-drop]

[Beat 5 — Payoff]
...
[SFX: chime]
[MUSIC_RESUME]
\`\`\`
`;
}

function buildCompositionStub(opts: {
  slug: string;
  componentName: string;
  title: string;
}): string {
  return `// src/compositions/${opts.componentName}.tsx
// Scaffolded for ${opts.slug} — replace placeholders, then register in Root.tsx
import React from 'react';
import { Series } from 'remotion';
import { EpisodeShell, BeatMotion } from './EpisodeShell';
import { SceneLayout } from '../components/layout/SceneLayout';
import { EditorialCallout } from '../components/captions/EditorialCallout';
import { MetricCard } from '../components/graphics/MetricCard';
import { BeforeAfterSplit } from '../components/graphics/BeforeAfterSplit';
import { LineChart } from '../components/data/LineChart';
import { AnimatedArrow } from '../components/graphics/AnimatedArrow';
import { TensionVignette } from '../components/storytelling/TensionVignette';
import { EndCard } from '../components/core/EndCard';
import { OrganicHover } from '../components/motion/OrganicHover';
import { THEME } from '../styles/theme';
import { VideoContent } from '../types/content.types';
import contentData from '../../videos/${opts.slug}/content.json';

const content = contentData as unknown as VideoContent;

export const ${opts.componentName}: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => {
  const scenes = content.scenes;

  return (
    <EpisodeShell content={content} showSafeZone={showSafeZone}>
      <Series.Sequence durationInFrames={scenes[0].durationInFrames}>
        <BeatMotion durationInFrames={scenes[0].durationInFrames} bumpAt={0}>
          <SceneLayout
            header={{
              eyebrow: '${opts.title}'.toUpperCase(),
              eyebrowColor: THEME.colors.accentAmber,
              title: scenes[0].type === 'hook' ? scenes[0].headline : 'HOOK',
            }}
            mode="centered"
            footer={
              <EditorialCallout
                text="REPLACE CALLOUT"
                subtext="Shock phrase for beat 1"
                startFrame={30}
                durationFrames={Math.max(60, scenes[0].durationInFrames - 40)}
                accentColor={THEME.colors.accentAmber}
                badgeTag="HOOK"
                inFlow={true}
              />
            }
          >
            <OrganicHover>
              <MetricCard
                label="Primary Metric"
                value={100}
                prefix="$"
                suffix=""
                delta="+0%"
                trend="up"
                subtext="Replace with episode-specific stakes"
                color={THEME.colors.accentBlue}
              />
            </OrganicHover>
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      <Series.Sequence durationInFrames={scenes[1].durationInFrames}>
        <BeatMotion durationInFrames={scenes[1].durationInFrames}>
          <SceneLayout header={{ title: 'MAKE IT PERSONAL' }} mode="centered">
            <BeforeAfterSplit
              before={{ tag: 'Before', value: '$X', label: 'Past', subtext: '' }}
              after={{
                tag: 'Today',
                value: '$Y',
                label: 'Present',
                subtext: '',
                isShock: true,
              }}
              connectorBadge="SURGE"
              layout="stacked"
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      <Series.Sequence durationInFrames={scenes[2].durationInFrames}>
        <BeatMotion durationInFrames={scenes[2].durationInFrames} driftOrigin="right bottom">
          <SceneLayout mode="centered">
            <LineChart
              title="MECHANISM CHART"
              data={[
                { label: 'A', value: 10 },
                { label: 'B', value: 25 },
                { label: 'C', value: 55 },
                { label: 'D', value: 90 },
              ]}
              height={660}
              width={THEME.dimensions.standardCardWidth}
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      <Series.Sequence durationInFrames={scenes[3].durationInFrames}>
        <BeatMotion durationInFrames={scenes[3].durationInFrames} drift={false} bumpAt={40}>
          <SceneLayout
            mode="centered"
            header={{
              eyebrow: 'THE DROP',
              eyebrowColor: THEME.colors.accentRed,
              title: 'REPLACE EPIPHANY',
            }}
            style={{ backgroundColor: THEME.colors.bgPitch }}
          >
            <TensionVignette color={THEME.colors.accentRed} intensity={0.45} />
            <AnimatedArrow direction="down" label="IMPACT" color={THEME.colors.accentRed} pulse />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      <Series.Sequence durationInFrames={scenes[4].durationInFrames}>
        <BeatMotion durationInFrames={scenes[4].durationInFrames} scaleTo={1.03}>
          <SceneLayout mode="centered" style={{ backgroundColor: THEME.colors.bgEmerald }}>
            <EndCard
              coreLesson={
                scenes[4].type === 'empowerment-payoff'
                  ? scenes[4].coreLesson
                  : 'Core lesson'
              }
              callToAction={
                scenes[4].type === 'empowerment-payoff'
                  ? scenes[4].callToAction
                  : 'Follow for more'
              }
              loopBridge={
                scenes[4].type === 'empowerment-payoff'
                  ? scenes[4].loopTransitionPhrase
                  : 'Because every single week...'
              }
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>
    </EpisodeShell>
  );
};
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.slug || !args.title) {
    console.log(`Usage:
  npx tsx scripts/scaffold-episode.ts --slug 003-topic-slug --title "Episode Title"
  npx tsx scripts/scaffold-episode.ts --slug 003-topic-slug --title "Episode Title" --topic Economics --mood urgent-escalation

Creates:
  videos/<slug>/{script.txt,script.md,content.json,assets/,output/}
  public/<slug>/
  src/compositions/<PascalSlug>.tsx  (5-beat EpisodeShell stub)

Next:
  1. Write the real script.txt
  2. uv run scripts/tts/generate-elevenlabs.py --slug <slug>
  3. npx tsx scripts/validate-episode.ts --slug <slug> --sync
  4. Rebalance scene durations + register composition in Root.tsx
  5. npm run dev → scrub → render`);
    process.exit(args.help ? 0 : 1);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) {
    console.error('Slug must be kebab-case (e.g. 003-hidden-fee-tax)');
    process.exit(1);
  }

  const root = process.cwd();
  const episodeDir = path.join(root, 'videos', args.slug);
  const publicDir = path.join(root, 'public', args.slug);
  const compositionName = toCompositionName(args.slug);
  const compositionPath = path.join(root, 'src', 'compositions', `${compositionName}.tsx`);

  if (fs.existsSync(episodeDir) && !args.force) {
    console.error(`Episode already exists: ${episodeDir} (pass --force to overwrite stubs)`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(episodeDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(episodeDir, 'output'), { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const content = buildContentJson({
    slug: args.slug,
    title: args.title,
    topic: args.topic,
    mood: args.mood,
  });

  const writeIfNeeded = (filePath: string, body: string) => {
    if (fs.existsSync(filePath) && !args.force) {
      console.log(`  skip (exists): ${path.relative(root, filePath)}`);
      return;
    }
    fs.writeFileSync(filePath, body, 'utf-8');
    console.log(`  wrote: ${path.relative(root, filePath)}`);
  };

  console.log(`\nScaffolding episode ${args.slug}…`);
  writeIfNeeded(path.join(episodeDir, 'content.json'), `${JSON.stringify(content, null, 2)}\n`);
  writeIfNeeded(path.join(episodeDir, 'script.txt'), buildScriptStub(args.title));
  writeIfNeeded(path.join(episodeDir, 'script.md'), buildScriptMd(args.title));
  writeIfNeeded(
    compositionPath,
    buildCompositionStub({
      slug: args.slug,
      componentName: compositionName,
      title: args.title,
    }),
  );

  console.log(`
Done.

Next steps:
  1. Edit videos/${args.slug}/script.txt
  2. uv run scripts/tts/generate-elevenlabs.py --slug ${args.slug}
  3. npx tsx scripts/validate-episode.ts --slug ${args.slug} --sync
  4. Register in src/Root.tsx:
       import { ${compositionName} } from './compositions/${compositionName}';
       <Composition id="${compositionName}" component={${compositionName}} durationInFrames={…} fps={30} width={1080} height={1920} />
  5. npm run dev
`);
}

main();
