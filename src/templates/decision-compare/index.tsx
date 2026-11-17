import React from 'react';
import { Series } from 'remotion';
import { EpisodeShell, BeatMotion } from '../../compositions/EpisodeShell';
import { SceneLayout } from '../../components/layout/SceneLayout';
import { EditorialCallout } from '../../components/captions/EditorialCallout';
import { BeforeAfterSplit } from '../../components/graphics/BeforeAfterSplit';
import { ChecklistCard } from '../../components/graphics/ChecklistCard';
import { GoalPathChooser } from '../../components/graphics/GoalPathChooser';
import { LanguageFaceOff } from '../../components/graphics/LanguageFaceOff';
import { TensionVignette } from '../../components/storytelling/TensionVignette';
import { EndCard } from '../../components/core/EndCard';
import { OrganicHover } from '../../components/motion/OrganicHover';
import { THEME } from '../../styles/theme';
import type { EpisodeBeatV1 } from '../../types/content.types';
import type { TemplateRenderArgs, VideoTemplate } from '../types';
import { resolveCalloutTiming } from '../types';
import {
  DECISION_COMPARE_SLOTS,
  type GoalPathsProps,
  type HookFaceOffProps,
  type ParalysisSplitProps,
  type PayoffDoorProps,
  type ProsConsProps,
} from './schema';

function asProps<T>(beat: EpisodeBeatV1): T {
  return beat.props as T;
}

function renderBeat(beat: EpisodeBeatV1): React.ReactNode {
  const d = beat.durationInFrames;

  switch (beat.slot) {
    case 'hook-faceoff': {
      const p = asProps<HookFaceOffProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 90);
      return (
        <BeatMotion durationInFrames={d} bumpAt={0}>
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: THEME.colors.accentAmber,
              title: p.title,
              subtitle: p.subtitle,
            }}
            mode="centered"
            gap={36}
            footer={
              <EditorialCallout
                text={p.callout.text}
                subtext={p.callout.subtext}
                startFrame={timing.startFrame}
                durationFrames={timing.durationFrames}
                accentColor={p.callout.accentColor ?? THEME.colors.accentRed}
                badgeTag={p.callout.badgeTag}
                inFlow={true}
              />
            }
          >
            <OrganicHover amplitude={4} speed={0.045}>
              <LanguageFaceOff
                leftLabel={p.leftLabel}
                rightLabel={p.rightLabel}
                leftColor={p.leftColor ?? THEME.colors.accentBlue}
                rightColor={p.rightColor ?? THEME.colors.accentAmber}
              />
            </OrganicHover>
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'paralysis-split': {
      const p = asProps<ParalysisSplitProps>(beat);
      return (
        <BeatMotion durationInFrames={d}>
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: THEME.colors.accentRed,
              title: p.title,
              subtitle: p.subtitle,
            }}
            mode="centered"
            gap={32}
          >
            <BeforeAfterSplit
              before={{
                ...p.before,
                color: p.before.color ?? THEME.colors.accentEmerald,
              }}
              after={p.after}
              connectorBadge={p.connectorBadge ?? 'TRAP'}
              layout="stacked"
            />
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'pros-cons': {
      const p = asProps<ProsConsProps>(beat);
      const accent = p.checklist.accentColor ?? THEME.colors.accentBlue;
      const timing = resolveCalloutTiming(d, p.callout, 40);
      return (
        <BeatMotion durationInFrames={d} driftOrigin="center 40%">
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: accent,
              title: p.title,
              subtitle: p.subtitle,
            }}
            mode="top-anchored"
            gap={28}
            style={p.backgroundColor ? { backgroundColor: p.backgroundColor } : undefined}
            footer={
              p.callout ? (
                <EditorialCallout
                  text={p.callout.text}
                  subtext={p.callout.subtext}
                  startFrame={timing.startFrame}
                  durationFrames={timing.durationFrames}
                  accentColor={p.callout.accentColor ?? accent}
                  badgeTag={p.callout.badgeTag}
                  inFlow={true}
                />
              ) : undefined
            }
          >
            <ChecklistCard
              title={p.checklist.title}
              subtitle={p.checklist.subtitle}
              accentColor={accent}
              delayFrames={p.checklist.delayFrames ?? 0}
              items={p.checklist.items}
            />
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'goal-paths': {
      const p = asProps<GoalPathsProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 120);
      return (
        <BeatMotion durationInFrames={d} drift={false} bumpAt={54}>
          <SceneLayout
            mode="centered"
            gap={28}
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: THEME.colors.accentRed,
              title: p.titleAccent ? (
                <>
                  {p.title}
                  <br />
                  <span style={{ color: THEME.colors.accentAmber }}>{p.titleAccent}</span>
                </>
              ) : (
                p.title
              ),
            }}
            style={{ backgroundColor: THEME.colors.bgPitch }}
            footer={
              p.callout ? (
                <EditorialCallout
                  text={p.callout.text}
                  subtext={p.callout.subtext}
                  startFrame={timing.startFrame}
                  durationFrames={timing.durationFrames}
                  accentColor={p.callout.accentColor ?? THEME.colors.accentAmber}
                  badgeTag={p.callout.badgeTag}
                  inFlow={true}
                />
              ) : undefined
            }
          >
            <TensionVignette color={THEME.colors.accentRed} intensity={0.4} />
            <GoalPathChooser title={p.chooserTitle} paths={p.paths} />
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'payoff-door': {
      const p = asProps<PayoffDoorProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 80);
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.03}>
          <SceneLayout
            mode="centered"
            gap={36}
            style={{ backgroundColor: THEME.colors.bgEmerald }}
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: THEME.colors.accentEmerald,
              title: p.title,
              subtitle: p.subtitle,
            }}
            footer={
              p.callout ? (
                <EditorialCallout
                  text={p.callout.text}
                  subtext={p.callout.subtext}
                  startFrame={timing.startFrame}
                  durationFrames={timing.durationFrames}
                  accentColor={p.callout.accentColor ?? THEME.colors.accentEmerald}
                  badgeTag={p.callout.badgeTag}
                  inFlow={true}
                />
              ) : undefined
            }
          >
            <EndCard
              coreLesson={p.coreLesson}
              callToAction={p.callToAction}
              loopBridge={p.loopBridge}
            />
          </SceneLayout>
        </BeatMotion>
      );
    }

    default:
      throw new Error(`decision-compare: unsupported slot "${beat.slot}"`);
  }
}

export function DecisionCompareTemplate({
  content,
  showSafeZone = false,
}: TemplateRenderArgs): React.ReactElement {
  return (
    <EpisodeShell
      content={content}
      showSafeZone={showSafeZone}
      progressColor={THEME.colors.accentAmber}
      ambientColor="rgba(245, 158, 11, 0.07)"
    >
      {content.beats.map((beat) => (
        <Series.Sequence key={beat.id} durationInFrames={beat.durationInFrames}>
          {renderBeat(beat)}
        </Series.Sequence>
      ))}
    </EpisodeShell>
  );
}

export const decisionCompareTemplate: VideoTemplate = {
  id: 'decision-compare',
  version: 1,
  status: 'ready',
  slots: DECISION_COMPARE_SLOTS,
  defaults: {
    progressColor: THEME.colors.accentAmber,
    ambientColor: 'rgba(245, 158, 11, 0.07)',
  },
  render: (args) => <DecisionCompareTemplate {...args} />,
};
