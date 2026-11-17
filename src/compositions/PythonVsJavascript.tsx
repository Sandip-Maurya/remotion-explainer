// Thin adapter — Episode 003 now renders via decision-compare + episode data.
import React from 'react';
import { EpisodePlayer } from '../engine/EpisodePlayer';
import type { EpisodeContentV1 } from '../types/content.types';
import contentData from '../../episodes/003-python-vs-javascript/content.json';

const content = contentData as unknown as EpisodeContentV1;

export const PythonVsJavascript: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => <EpisodePlayer content={content} showSafeZone={showSafeZone} />;
