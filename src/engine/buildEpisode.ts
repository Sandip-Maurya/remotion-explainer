import * as path from 'path';

/**
 * Remotion composition id for an episode slug.
 * Template-driven episodes register as the slug itself in Root.
 */
export function resolveCompositionId(
  slug: string,
  content: { templateId?: string },
): string {
  if (content.templateId && content.templateId !== 'custom') {
    return slug;
  }
  return slug;
}

/** Episode publish folder: out/<slug>/ */
export function episodeOutDir(workspaceRoot: string, slug: string): string {
  return path.join(workspaceRoot, 'out', slug);
}

/** Canonical master render: out/<slug>/master.mp4 */
export function defaultOutputPath(workspaceRoot: string, slug: string): string {
  return path.join(episodeOutDir(workspaceRoot, slug), 'master.mp4');
}

/** Review stills folder: out/<slug>/stills/ */
export function episodeStillsDir(workspaceRoot: string, slug: string): string {
  return path.join(episodeOutDir(workspaceRoot, slug), 'stills');
}

/** Prefer ANGLE on Windows (Chrome GPU quirks); leave unset elsewhere. */
export function defaultGlFlag(): string | undefined {
  return process.platform === 'win32' ? 'angle' : undefined;
}
