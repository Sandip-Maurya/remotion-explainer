import React from 'react';
import { Series } from 'remotion';
import { EpisodeShell, BeatMotion } from '../../compositions/EpisodeShell';
import { SceneLayout } from '../../components/layout/SceneLayout';
import { EditorialCallout } from '../../components/captions/EditorialCallout';
import { MetricCard } from '../../components/graphics/MetricCard';
import { BeforeAfterSplit } from '../../components/graphics/BeforeAfterSplit';
import { LineChart } from '../../components/data/LineChart';
import { BarChart } from '../../components/data/BarChart';
import { AnimatedArrow } from '../../components/graphics/AnimatedArrow';
import { TensionVignette } from '../../components/storytelling/TensionVignette';
import { EndCard } from '../../components/core/EndCard';
import { OrganicHover } from '../../components/motion/OrganicHover';
import { THEME } from '../../styles/theme';
import type { EpisodeBeatV1 } from '../../types/content.types';
import type { TemplateRenderArgs, VideoTemplate } from '../types';
import { resolveCalloutTiming } from '../types';
import {
  DATA_EXPLAINER_SLOTS,
  type BarMechanismProps,
  type BeforeAfterBeatProps,
  type ClimaxDropProps,
  type LineMechanismProps,
  type MetricHookProps,
  type PayoffEndProps,
} from './schema';

function asProps<T>(beat: EpisodeBeatV1): T {
  return beat.props as T;
}

function renderBeat(beat: EpisodeBeatV1): React.ReactNode {
  const d = beat.durationInFrames;

  switch (beat.slot) {
    case 'metric-hook': {
      const p = asProps<MetricHookProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 35);
      const title =
        typeof p.title === 'string' ? (
          p.title
        ) : (
          <>
            {p.title.prefix}{' '}
            <span style={{ color: THEME.colors.accentBlue }}>{p.title.accent}</span>
          </>
        );
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.045} driftOrigin="center 40%" bumpAt={0}>
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: THEME.colors.accentAmber,
              title,
            }}
            gap={48}
            mode="centered"
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
            <OrganicHover amplitude={5} speed={0.05}>
              <MetricCard
                label={p.metric.label}
                value={p.metric.value}
                prefix={p.metric.prefix}
                suffix={p.metric.suffix}
                delta={p.metric.delta}
                trend={p.metric.trend}
                subtext={p.metric.subtext}
                stats={p.metric.stats}
                color={p.metric.color ?? THEME.colors.accentBlue}
              />
            </OrganicHover>
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'before-after': {
      const p = asProps<BeforeAfterBeatProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 40);
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.04} driftOrigin="center 50%">
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              title: p.title,
              subtitle: p.subtitle,
            }}
            gap={40}
            mode="centered"
            footer={
              p.callout ? (
                <EditorialCallout
                  text={p.callout.text}
                  subtext={p.callout.subtext}
                  startFrame={timing.startFrame}
                  durationFrames={timing.durationFrames}
                  accentColor={p.callout.accentColor ?? THEME.colors.accentRed}
                  badgeTag={p.callout.badgeTag}
                  inFlow={true}
                />
              ) : undefined
            }
          >
            <OrganicHover amplitude={4} speed={0.06}>
              <BeforeAfterSplit
                before={p.before}
                after={p.after}
                connectorBadge={p.connectorBadge}
                layout={p.layout ?? 'stacked'}
              />
            </OrganicHover>
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'line-mechanism': {
      const p = asProps<LineMechanismProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 25);
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.045} driftOrigin="right bottom">
          <SceneLayout
            mode="centered"
            gap={36}
            footer={
              p.callout ? (
                <EditorialCallout
                  text={p.callout.text}
                  subtext={p.callout.subtext}
                  startFrame={timing.startFrame}
                  durationFrames={timing.durationFrames}
                  accentColor={p.callout.accentColor ?? THEME.colors.accentBlue}
                  badgeTag={p.callout.badgeTag}
                  inFlow={true}
                />
              ) : undefined
            }
          >
            <LineChart
              title={p.title}
              data={p.data}
              prefix={p.prefix}
              unit={p.unit}
              color={p.color ?? '#38bdf8'}
              curved={true}
              showArea={true}
              height={p.height ?? 660}
              width={THEME.dimensions.standardCardWidth}
            />
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'bar-mechanism': {
      const p = asProps<BarMechanismProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 25);
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.04} driftOrigin="center 60%">
          <SceneLayout
            mode="centered"
            gap={36}
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
            <BarChart
              title={p.title}
              data={p.data}
              prefix={p.prefix}
              unit={p.unit}
              highlightIndex={p.highlightIndex}
              height={p.height ?? 660}
              width={THEME.dimensions.standardCardWidth}
              decimals={p.decimals ?? 1}
            />
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'climax-drop': {
      const p = asProps<ClimaxDropProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 35);
      return (
        <BeatMotion durationInFrames={d} drift={false} bumpAt={130} bumpIntensity={8} bumpDurationFrames={10}>
          <SceneLayout
            mode="centered"
            gap={42}
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
            footer={
              p.callout ? (
                <EditorialCallout
                  text={p.callout.text}
                  subtext={p.callout.subtext}
                  startFrame={timing.startFrame}
                  durationFrames={timing.durationFrames}
                  accentColor={p.callout.accentColor ?? THEME.colors.accentRed}
                  badgeTag={p.callout.badgeTag}
                  inFlow={true}
                />
              ) : undefined
            }
            style={{ backgroundColor: THEME.colors.bgPitch }}
          >
            <TensionVignette color={THEME.colors.accentRed} intensity={0.45} />
            <AnimatedArrow
              direction="down"
              label={p.arrowLabel ?? 'PURCHASING POWER'}
              color={THEME.colors.accentRed}
              length={185}
              headWidth={100}
              shaftWidth={38}
              pulse={true}
            />
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'payoff-end': {
      const p = asProps<PayoffEndProps>(beat);
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.03}>
          <SceneLayout
            mode="centered"
            gap={36}
            style={{ backgroundColor: THEME.colors.bgEmerald }}
          >
            {(p.bannerEyebrow || p.bannerText) && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '2px solid rgba(16, 185, 129, 0.45)',
                  borderRadius: 24,
                  padding: '36px 32px',
                  textAlign: 'center',
                  boxShadow: '0 0 45px rgba(16, 185, 129, 0.3)',
                  maxWidth: THEME.dimensions.standardCardWidth,
                }}
              >
                {p.bannerEyebrow && (
                  <div
                    style={{
                      fontFamily: THEME.fonts.heading,
                      fontSize: 22,
                      fontWeight: 800,
                      color: THEME.colors.accentEmerald,
                      textTransform: 'uppercase',
                      marginBottom: 12,
                    }}
                  >
                    {p.bannerEyebrow}
                  </div>
                )}
                {p.bannerText && (
                  <div
                    style={{
                      fontFamily: THEME.fonts.heading,
                      fontSize: 34,
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.35,
                    }}
                  >
                    {p.bannerText}
                  </div>
                )}
              </div>
            )}

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
      throw new Error(`data-explainer: unsupported slot "${beat.slot}"`);
  }
}

export function DataExplainerTemplate({
  content,
  showSafeZone = false,
}: TemplateRenderArgs): React.ReactElement {
  return (
    <EpisodeShell
      content={content}
      showSafeZone={showSafeZone}
      progressColor={THEME.colors.accentBlue}
      ambientColor="rgba(56, 189, 248, 0.08)"
    >
      {content.beats.map((beat) => (
        <Series.Sequence key={beat.id} durationInFrames={beat.durationInFrames}>
          {renderBeat(beat)}
        </Series.Sequence>
      ))}
    </EpisodeShell>
  );
}

export const dataExplainerTemplate: VideoTemplate = {
  id: 'data-explainer',
  version: 1,
  status: 'ready',
  slots: DATA_EXPLAINER_SLOTS,
  defaults: {
    progressColor: THEME.colors.accentBlue,
    ambientColor: 'rgba(56, 189, 248, 0.08)',
  },
  render: (args) => <DataExplainerTemplate {...args} />,
};
