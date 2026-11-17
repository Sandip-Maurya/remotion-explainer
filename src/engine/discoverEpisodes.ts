// src/engine/discoverEpisodes.ts
import * as fs from 'fs';
import * as path from 'path';

export const EPISODES_DIR_NAME = 'episodes';
/** @deprecated Prefer episodes/ — kept during migration */
export const LEGACY_VIDEOS_DIR_NAME = 'videos';

export interface DiscoveredEpisode {
  slug: string;
  /** Absolute path to the episode product folder */
  dir: string;
  contentPath: string;
  /** Which root folder the episode was found under */
  root: 'episodes' | 'videos';
}

/**
 * Resolve the on-disk folder for a slug.
 * Prefers `episodes/<slug>`, falls back to legacy `videos/<slug>`.
 */
export function resolveEpisodeDir(workspaceRoot: string, slug: string): string | null {
  const primary = path.join(workspaceRoot, EPISODES_DIR_NAME, slug);
  if (fs.existsSync(path.join(primary, 'content.json'))) {
    return primary;
  }
  const legacy = path.join(workspaceRoot, LEGACY_VIDEOS_DIR_NAME, slug);
  if (fs.existsSync(path.join(legacy, 'content.json'))) {
    return legacy;
  }
  return null;
}

function listFromRoot(
  workspaceRoot: string,
  rootName: 'episodes' | 'videos',
): DiscoveredEpisode[] {
  const rootDir = path.join(workspaceRoot, rootName);
  if (!fs.existsSync(rootDir)) return [];

  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(rootDir, d.name);
      const contentPath = path.join(dir, 'content.json');
      if (!fs.existsSync(contentPath)) return null;
      return {
        slug: d.name,
        dir,
        contentPath,
        root: rootName,
      } satisfies DiscoveredEpisode;
    })
    .filter((e): e is DiscoveredEpisode => e !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Discover episode products. `episodes/` wins over legacy `videos/` for the same slug.
 */
export function discoverEpisodes(workspaceRoot: string = process.cwd()): DiscoveredEpisode[] {
  const fromEpisodes = listFromRoot(workspaceRoot, 'episodes');
  const fromVideos = listFromRoot(workspaceRoot, 'videos');
  const bySlug = new Map<string, DiscoveredEpisode>();

  for (const ep of fromVideos) {
    bySlug.set(ep.slug, ep);
  }
  for (const ep of fromEpisodes) {
    bySlug.set(ep.slug, ep); // episodes overrides legacy
  }

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function listEpisodeSlugs(workspaceRoot: string = process.cwd()): string[] {
  return discoverEpisodes(workspaceRoot).map((e) => e.slug);
}
