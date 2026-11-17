// Thin adapter — Episode 004 renders via evidence-explainer + episode data.
import React from 'react';
import { EpisodePlayer } from '../engine/EpisodePlayer';
import type { EpisodeContentV1 } from '../types/content.types';
import contentData from '../../episodes/004-credit-card-blood/content.json';

const content = contentData as unknown as EpisodeContentV1;

export const CreditCardBlood: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => <EpisodePlayer content={content} showSafeZone={showSafeZone} />;
