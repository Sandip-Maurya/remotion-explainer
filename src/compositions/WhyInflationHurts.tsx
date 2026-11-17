// Thin adapter — Episode 001 now renders via data-explainer + episode data.
import React from 'react';
import { EpisodePlayer } from '../engine/EpisodePlayer';
import type { EpisodeContentV1 } from '../types/content.types';
import contentData from '../../episodes/001-why-inflation-hurts/content.json';

const content = contentData as unknown as EpisodeContentV1;

export const WhyInflationHurts: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => <EpisodePlayer content={content} showSafeZone={showSafeZone} />;
