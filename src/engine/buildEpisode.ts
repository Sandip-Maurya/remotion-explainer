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

export function defaultOutputPath(workspaceRoot: string, slug: string): string {
  return path.join(workspaceRoot, 'out', `${slug}.mp4`);
}

/** Prefer ANGLE on Windows (Chrome GPU quirks); leave unset elsewhere. */
export function defaultGlFlag(): string | undefined {
  return process.platform === 'win32' ? 'angle' : undefined;
}
