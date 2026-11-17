// Thin adapter — Episode 002 remaster now renders via data-explainer + episode data.
import React from 'react';
import { EpisodePlayer } from '../engine/EpisodePlayer';
import type { EpisodeContentV1 } from '../types/content.types';
import contentData from '../../episodes/002-debt-clock/content.json';

const content = contentData as unknown as EpisodeContentV1;

export const TheDebtClockRemastered: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => <EpisodePlayer content={content} showSafeZone={showSafeZone} />;
