import type { CalloutProps } from '../types';

export interface SplitSideProps {
  tag: string;
  value: string;
  label: string;
  subtext?: string;
  color?: string;
  isShock?: boolean;
}

export interface ChecklistItemProps {
  text: string;
  tone?: 'pro' | 'con' | 'neutral';
}

export interface HookFaceOffProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
  callout: CalloutProps;
}

export interface ParalysisSplitProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  before: SplitSideProps;
  after: SplitSideProps;
  connectorBadge?: string;
}

export interface ProsConsProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  checklist: {
    title: string;
    subtitle?: string;
    accentColor?: string;
    delayFrames?: number;
    items: ChecklistItemProps[];
  };
  callout?: CalloutProps;
}

export interface GoalPathsProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  chooserTitle?: string;
  paths: Array<{ ifLabel: string; thenLabel: string; accentColor?: string }>;
  callout?: CalloutProps;
  dramaticPauseFrames?: number;
}

export interface PayoffDoorProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  coreLesson: string;
  callToAction: string;
  loopBridge: string;
  callout?: CalloutProps;
}

export const DECISION_COMPARE_SLOTS = [
  'hook-faceoff',
  'paralysis-split',
  'pros-cons',
  'goal-paths',
  'payoff-door',
] as const;

export type DecisionCompareSlot = (typeof DECISION_COMPARE_SLOTS)[number];
