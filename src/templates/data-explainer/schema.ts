import type { CalloutProps } from '../types';

export interface MetricHookProps {
  eyebrow: string;
  title: string | { prefix: string; accent: string };
  metric: {
    label: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
    delta?: string;
    trend?: 'up' | 'down' | 'neutral';
    subtext?: string;
    stats?: Array<{ label: string; value: string }>;
    color?: string;
  };
  callout?: CalloutProps;
}

export interface BeforeAfterBeatProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  before: {
    tag: string;
    value: string;
    label: string;
    subtext?: string;
    color?: string;
  };
  after: {
    tag: string;
    value: string;
    label: string;
    subtext?: string;
    isShock?: boolean;
  };
  connectorBadge?: string;
  layout?: 'stacked' | 'side-by-side';
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
  /** Delay silence start within the climax beat (frames from beat start) */
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

export const DATA_EXPLAINER_SLOTS = [
  'metric-hook',
  'before-after',
  'line-mechanism',
  'bar-mechanism',
  'climax-drop',
  'payoff-end',
] as const;

export type DataExplainerSlot = (typeof DATA_EXPLAINER_SLOTS)[number];
