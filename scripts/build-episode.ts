#!/usr/bin/env npx tsx
/**
 * Episode build pipeline: validate → (TTS if audio missing) → remotion render → out/<slug>.mp4
 *
 * Usage:
 *   npm run build -- --slug 002-debt-clock
 *   npm run build -- --slug 003-python-vs-javascript --skip-validate
 *   npx tsx scripts/build-episode.ts --slug 002-debt-clock --out out/custom.mp4
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {
  defaultGlFlag,
  defaultOutputPath,
  resolveCompositionId,
} from '../src/engine/buildEpisode';
import {
  Issue,
  VideoContentLike,
  loadCaptions,
  loadJson,
  resolveEpisodePaths,
  summarizeIssues,
  validateEpisode,
} from './lib/episodeInvariants';

interface BuildArgs {
  slug: string;
  out?: string;
  composition?: string;
  skipValidate: boolean;
  noTts: boolean;
  forceTts: boolean;
  gl?: string;
  help: boolean;
}

function parseArgs(argv: string[]): BuildArgs {
  const args: BuildArgs = {
    slug: '',
    skipValidate: false,
    noTts: false,
    forceTts: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') args.slug = argv[++i] ?? '';
    else if (a === '--out') args.out = argv[++i] ?? '';
    else if (a === '--composition') args.composition = argv[++i] ?? '';
    else if (a === '--skip-validate') args.skipValidate = true;
    else if (a === '--no-tts') args.noTts = true;
    else if (a === '--force-tts') args.forceTts = true;
    else if (a === '--gl') args.gl = argv[++i] ?? '';
    else if (a === '--help' || a === '-h') args.help = true;
  }

  return args;
}

function printIssues(slug: string, issues: Issue[]) {
  console.log(`\n━━━ validate ${slug} ━━━`);
  for (const issue of issues) {
    const tag =
      issue.level === 'error' ? 'ERROR' : issue.level === 'warn' ? 'WARN ' : 'ok   ';
    console.log(`  [${tag}] ${issue.code}: ${issue.message}`);
  }
}

function remotionBin(workspaceRoot: string): string {
  const local = path.join(
    workspaceRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'remotion.cmd' : 'remotion',
  );
  return fs.existsSync(local) ? local : 'remotion';
}

function ensurePublicAssets(
  paths: ReturnType<typeof resolveEpisodePaths>,
): void {
  fs.mkdirSync(paths.publicDir, { recursive: true });
  if (fs.existsSync(paths.narrationPath)) {
    fs.copyFileSync(paths.narrationPath, paths.publicNarrationPath);
    console.log(`Mirrored narration → ${path.relative(process.cwd(), paths.publicNarrationPath)}`);
  }
  if (fs.existsSync(paths.captionsPath)) {
    fs.copyFileSync(paths.captionsPath, paths.publicCaptionsPath);
    console.log(`Mirrored captions → ${path.relative(process.cwd(), paths.publicCaptionsPath)}`);
  }
}

function runTts(workspaceRoot: string, slug: string): boolean {
  console.log(`\n━━━ TTS (ElevenLabs) ${slug} ━━━`);
  const result = spawnSync(
    'uv',
    ['run', 'scripts/tts/generate-elevenlabs.py', '--slug', slug],
    { cwd: workspaceRoot, stdio: 'inherit' },
  );
  return result.status === 0;
}

function runValidate(
  workspaceRoot: string,
  slug: string,
  paths: ReturnType<typeof resolveEpisodePaths>,
): boolean {
  const content = loadJson<VideoContentLike>(paths.contentPath);
  const captions = loadCaptions(paths, content);
  const issues = validateEpisode(content, captions, { checkAssets: true, paths });
  printIssues(slug, issues);
  const summary = summarizeIssues(issues);
  console.log(
    `  → ${summary.errors} error(s), ${summary.warnings} warning(s), ${summary.infos} info`,
  );
  return summary.ok;
}

function runRender(
  workspaceRoot: string,
  compositionId: string,
  outputPath: string,
  gl?: string,
): boolean {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const bin = remotionBin(workspaceRoot);
  const entry = path.join(workspaceRoot, 'src', 'index.ts');
  const args = ['render', entry, compositionId, outputPath];
  const glFlag = gl ?? defaultGlFlag();
  if (glFlag) {
    args.push('--gl', glFlag);
  }

  console.log(`\n━━━ render ${compositionId} → ${path.relative(workspaceRoot, outputPath)} ━━━`);
  console.log(`$ remotion ${args.slice(0, 1).join(' ')} … ${compositionId}`);

  const result = spawnSync(bin, args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: process.env,
    // On Windows, remotion.cmd needs a shell; args are fixed (no user interpolation risk).
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.slug) {
    console.log(`Usage:
  npm run build -- --slug <episode-slug>
  npx tsx scripts/build-episode.ts --slug <episode-slug> [options]

Pipeline:
  1. Mirror episodes/<slug>/narration.mp3 + captions.json → public/<slug>/
  2. If narration missing: run ElevenLabs TTS (unless --no-tts)
  3. Validate invariants (unless --skip-validate)
  4. remotion render → out/<slug>.mp4

Options:
  --slug <id>         Episode folder name (required)
  --out <path>        Output MP4 (default: out/<slug>.mp4)
  --composition <id>  Override Remotion composition id
  --skip-validate     Skip invariant checks
  --no-tts            Fail if narration.mp3 is missing (do not call TTS)
  --force-tts         Regenerate narration via ElevenLabs before render
  --gl <backend>      Remotion GL backend (default: angle on Windows)
  --help              Show this help`);
    process.exit(args.help ? 0 : 1);
  }

  const workspaceRoot = process.cwd();
  const paths = resolveEpisodePaths(workspaceRoot, args.slug);

  if (!fs.existsSync(paths.contentPath)) {
    console.error(`Missing content.json: ${paths.contentPath}`);
    process.exit(1);
  }

  console.log(`Building episode: ${args.slug} (${paths.root}/)`);

  const needsTts = args.forceTts || !fs.existsSync(paths.narrationPath);
  if (needsTts) {
    if (args.noTts && !fs.existsSync(paths.narrationPath)) {
      console.error(
        `Missing narration.mp3 at ${paths.narrationPath}. Remove --no-tts or run: npm run tts:elevenlabs -- --slug ${args.slug}`,
      );
      process.exit(1);
    }
    if (!runTts(workspaceRoot, args.slug)) {
      console.error('TTS failed — aborting build.');
      process.exit(1);
    }
  } else {
    console.log(`Using committed narration: ${path.relative(workspaceRoot, paths.narrationPath)}`);
  }

  ensurePublicAssets(paths);

  if (!args.skipValidate) {
    if (!runValidate(workspaceRoot, args.slug, paths)) {
      console.error('Validation failed — aborting render.');
      process.exit(1);
    }
  } else {
    console.log('Skipping validation (--skip-validate)');
  }

  const content = loadJson<VideoContentLike>(paths.contentPath);
  const compositionId =
    args.composition ?? resolveCompositionId(args.slug, content);
  const outputPath = args.out
    ? path.resolve(workspaceRoot, args.out)
    : defaultOutputPath(workspaceRoot, args.slug);

  if (!runRender(workspaceRoot, compositionId, outputPath, args.gl)) {
    console.error('Render failed.');
    process.exit(1);
  }

  const stat = fs.statSync(outputPath);
  console.log(
    `\n✅ Built ${args.slug} → ${path.relative(workspaceRoot, outputPath)} (${(stat.size / (1024 * 1024)).toFixed(1)} MB)`,
  );
}

main();
