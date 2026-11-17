#!/usr/bin/env npx tsx
/**
 * Episode schema invariant checker + narration duration sync.
 *
 * Usage:
 *   npx tsx scripts/validate-episode.ts --slug 002-debt-clock
 *   npx tsx scripts/validate-episode.ts --slug 002-debt-clock --sync
 *   npx tsx scripts/validate-episode.ts --all
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Issue,
  VideoContentLike,
  loadCaptions,
  loadJson,
  resolveEpisodePaths,
  summarizeIssues,
  syncDurationFromNarration,
  validateEpisode,
} from './lib/episodeInvariants';

function parseArgs(argv: string[]) {
  const args = {
    slug: '' as string,
    all: false,
    sync: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') args.slug = argv[++i] ?? '';
    else if (a === '--all') args.all = true;
    else if (a === '--sync') args.sync = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }

  return args;
}

function printIssues(slug: string, issues: Issue[]) {
  console.log(`\n━━━ ${slug} ━━━`);
  for (const issue of issues) {
    const tag =
      issue.level === 'error' ? 'ERROR' : issue.level === 'warn' ? 'WARN ' : 'ok   ';
    console.log(`  [${tag}] ${issue.code}: ${issue.message}`);
  }
}

function listEpisodeSlugs(workspaceRoot: string): string[] {
  // Prefer episodes/, merge legacy videos/ (episodes wins on slug collision)
  const roots: Array<'episodes' | 'videos'> = ['videos', 'episodes'];
  const bySlug = new Map<string, string>();
  for (const root of roots) {
    const dir = path.join(workspaceRoot, root);
    if (!fs.existsSync(dir)) continue;
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      if (!fs.existsSync(path.join(dir, d.name, 'content.json'))) continue;
      bySlug.set(d.name, root);
    }
  }
  return [...bySlug.keys()].sort();
}

function validateOne(workspaceRoot: string, slug: string, sync: boolean): boolean {
  const paths = resolveEpisodePaths(workspaceRoot, slug);
  if (!fs.existsSync(paths.contentPath)) {
    console.error(`Missing content.json: ${paths.contentPath}`);
    return false;
  }

  const content = loadJson<VideoContentLike>(paths.contentPath);

  if (sync) {
    const result = syncDurationFromNarration(content);
    if (result.changed) {
      fs.writeFileSync(paths.contentPath, `${JSON.stringify(content, null, 2)}\n`, 'utf-8');
      console.log(
        `Synced ${slug}: totalDurationInFrames ${result.previous} → ${result.next}`,
      );
    } else {
      console.log(`Sync ${slug}: already matched (${result.next} frames)`);
    }
  }

  const captions = loadCaptions(paths, content);
  const issues = validateEpisode(content, captions, { checkAssets: true, paths });
  printIssues(slug, issues);

  const summary = summarizeIssues(issues);
  console.log(
    `  → ${summary.errors} error(s), ${summary.warnings} warning(s), ${summary.infos} info`,
  );
  return summary.ok;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.slug && !args.all)) {
    console.log(`Usage:
  npx tsx scripts/validate-episode.ts --slug <episode-slug> [--sync]
  npx tsx scripts/validate-episode.ts --all [--sync]

Checks:
  • Scene frame sum == totalDurationInFrames
  • Audio duration frames == totalDurationInFrames
  • Caption token bounds
  • Climax dramaticPauseFrames in 30–60
  • SFX soundIds + frame bounds
  • Required episode/public assets (warn)

--sync updates totalDurationInFrames from narration.durationInSeconds (does not rewrite scene beats).`);
    process.exit(args.help ? 0 : 1);
  }

  const workspaceRoot = process.cwd();
  const slugs = args.all ? listEpisodeSlugs(workspaceRoot) : [args.slug];

  if (slugs.length === 0) {
    console.error('No episodes found under episodes/ (or legacy videos/)');
    process.exit(1);
  }

  let failed = 0;
  for (const slug of slugs) {
    const ok = validateOne(workspaceRoot, slug, args.sync);
    if (!ok) failed += 1;
  }

  console.log(
    failed === 0
      ? `\nAll ${slugs.length} episode(s) passed invariant checks.`
      : `\n${failed}/${slugs.length} episode(s) failed invariant checks.`,
  );
  process.exit(failed === 0 ? 0 : 1);
}

main();
