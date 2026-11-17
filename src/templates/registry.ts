/**
 * Template registry — maps templateId → render module.
 */

import type { TemplateId } from '../types/content.types';
import { decisionCompareTemplate } from './decision-compare';
import { dataExplainerTemplate } from './data-explainer';
import type { VideoTemplate } from './types';

export type { VideoTemplate, TemplateRenderArgs } from './types';

export const TEMPLATE_REGISTRY: Record<Exclude<TemplateId, 'custom'>, VideoTemplate> = {
  'decision-compare': decisionCompareTemplate,
  'data-explainer': dataExplainerTemplate,
};

export function getTemplate(templateId: TemplateId): VideoTemplate | null {
  if (templateId === 'custom') return null;
  return TEMPLATE_REGISTRY[templateId] ?? null;
}

/** @deprecated Prefer getTemplate */
export function getTemplateMeta(templateId: TemplateId): VideoTemplate | null {
  return getTemplate(templateId);
}

export function listRegisteredTemplateIds(): TemplateId[] {
  return Object.keys(TEMPLATE_REGISTRY) as TemplateId[];
}

export function listReadyTemplates(): VideoTemplate[] {
  return Object.values(TEMPLATE_REGISTRY).filter((t) => t.status === 'ready');
}
