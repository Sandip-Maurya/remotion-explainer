// src/templates/registry.ts
/**
 * Template registry stub (Iteration I1).
 * I2 will register `decision-compare` and `data-explainer` modules here.
 */

import type { TemplateId } from '../types/content.types';

export interface VideoTemplateMeta {
  id: TemplateId;
  version: number;
  slots: readonly string[];
  /** Filled in I2+ when render modules land */
  status: 'planned' | 'ready';
}

export const TEMPLATE_REGISTRY: Record<Exclude<TemplateId, 'custom'>, VideoTemplateMeta> = {
  'decision-compare': {
    id: 'decision-compare',
    version: 1,
    status: 'planned',
    slots: [
      'hook-faceoff',
      'paralysis-split',
      'pros-cons',
      'goal-paths',
      'payoff-door',
    ] as const,
  },
  'data-explainer': {
    id: 'data-explainer',
    version: 1,
    status: 'planned',
    slots: [
      'metric-hook',
      'before-after',
      'line-mechanism',
      'bar-mechanism',
      'climax-drop',
      'payoff-end',
    ] as const,
  },
};

export function getTemplateMeta(templateId: TemplateId): VideoTemplateMeta | null {
  if (templateId === 'custom') return null;
  return TEMPLATE_REGISTRY[templateId] ?? null;
}

export function listRegisteredTemplateIds(): TemplateId[] {
  return Object.keys(TEMPLATE_REGISTRY) as TemplateId[];
}
