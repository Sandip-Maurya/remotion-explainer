import type { ReactElement } from 'react';
import type { EpisodeContentV1, TemplateId } from '../types/content.types';

export interface TemplateRenderArgs {
  content: EpisodeContentV1;
  showSafeZone?: boolean;
}

export interface VideoTemplate {
  id: Exclude<TemplateId, 'custom'>;
  version: number;
  slots: readonly string[];
  status: 'planned' | 'ready';
  defaults?: {
    progressColor?: string;
    ambientColor?: string;
  };
  render: (args: TemplateRenderArgs) => ReactElement;
}

export interface CalloutProps {
  text: string;
  subtext?: string;
  badgeTag?: string;
  accentColor?: string;
  startFrame?: number;
  durationFrames?: number;
}

/** Resolve editorial callout timing from props or beat length. */
export function resolveCalloutTiming(
  durationInFrames: number,
  callout?: CalloutProps,
  fallbackStart = 40,
): { startFrame: number; durationFrames: number } {
  const startFrame = callout?.startFrame ?? Math.min(fallbackStart, Math.max(20, Math.floor(durationInFrames * 0.08)));
  const durationFrames =
    callout?.durationFrames ?? Math.max(60, durationInFrames - startFrame - 20);
  return { startFrame, durationFrames };
}
