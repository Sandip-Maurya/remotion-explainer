import type { CalloutProps } from '../types';

export interface AssetSpotlightProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: string | { prefix: string; accent: string };
  subtitle?: string;
  imageSrc: string;
  badgeTag?: string;
  badgeColor?: string;
  caption?: string;
  callout?: CalloutProps;
  zoomDirection?: 'in' | 'out';
}

export interface DiagramSpotlightProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: string | { prefix: string; accent: string };
  subtitle?: string;
  /** Registered diagram modules in this template */
  diagramType: 'fragmentation';
  callout?: CalloutProps;
}

export interface LineMechanismProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  prefix?: string;
  unit?: string;
  color?: string;
  height?: number;
  callout?: CalloutProps;
}

export interface BarMechanismProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    sublabel?: string;
    delta?: string;
  }>;
  prefix?: string;
  unit?: string;
  highlightIndex?: number;
  decimals?: number;
  height?: number;
  callout?: CalloutProps;
}

export interface ClimaxDropProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  arrowLabel?: string;
  dramaticPauseFrames: number;
  dramaticPauseOffsetFrames?: number;
  subBassHit?: boolean;
  callout?: CalloutProps;
}

export interface PayoffEndProps {
  coreLesson: string;
  callToAction: string;
  loopBridge: string;
  bannerEyebrow?: string;
  bannerText?: string;
}

export const EVIDENCE_EXPLAINER_SLOTS = [
  'asset-spotlight',
  'diagram-spotlight',
  'line-mechanism',
  'bar-mechanism',
  'climax-drop',
  'payoff-end',
] as const;

export type EvidenceExplainerSlot = (typeof EVIDENCE_EXPLAINER_SLOTS)[number];
