import React from 'react';
import type { EpisodeContentV1 } from '../types/content.types';
import { getTemplate } from '../templates/registry';

export interface EpisodePlayerProps {
  /** Optional for Remotion Composition typing; required at runtime via defaultProps */
  content?: EpisodeContentV1;
  showSafeZone?: boolean;
}

/**
 * Resolves templateId from episode content and renders the matching template.
 */
export const EpisodePlayer: React.FC<EpisodePlayerProps> = ({
  content,
  showSafeZone = false,
}) => {
  if (!content) {
    throw new Error('EpisodePlayer requires content (pass via Composition defaultProps)');
  }

  const template = getTemplate(content.templateId);

  if (!template) {
    throw new Error(
      `No template registered for templateId="${content.templateId}" (episode ${content.id})`,
    );
  }

  if (template.status !== 'ready') {
    throw new Error(
      `Template "${content.templateId}" is not ready (status=${template.status})`,
    );
  }

  return template.render({ content, showSafeZone });
};
