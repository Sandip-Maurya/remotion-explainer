import React from 'react';
import { Series } from 'remotion';
import { EpisodeShell, BeatMotion } from '../../compositions/EpisodeShell';
import { SceneLayout } from '../../components/layout/SceneLayout';
import { EditorialCallout } from '../../components/captions/EditorialCallout';
import { LineChart } from '../../components/data/LineChart';
import { BarChart } from '../../components/data/BarChart';
import { AnimatedArrow } from '../../components/graphics/AnimatedArrow';
import { DocumentaryImage } from '../../components/graphics/DocumentaryImage';
import { FragmentationDiagram } from '../../components/graphics/FragmentationDiagram';
import { TensionVignette } from '../../components/storytelling/TensionVignette';
import { EndCard } from '../../components/core/EndCard';
import { OrganicHover } from '../../components/motion/OrganicHover';
import { THEME } from '../../styles/theme';
import type { EpisodeBeatV1 } from '../../types/content.types';
import type { TemplateRenderArgs, VideoTemplate } from '../types';
import { resolveCalloutTiming } from '../types';
import {
  EVIDENCE_EXPLAINER_SLOTS,
  type AssetSpotlightProps,
  type BarMechanismProps,
  type ClimaxDropProps,
  type DiagramSpotlightProps,
  type LineMechanismProps,
  type PayoffEndProps,
} from './schema';

function asProps<T>(beat: EpisodeBeatV1): T {
  return beat.props as T;
}

function renderTitle(
  title: string | { prefix: string; accent: string },
  accentColor: string,
): React.ReactNode {
  if (typeof title === 'string') return title;
  return (
    <>
      {title.prefix} <span style={{ color: accentColor }}>{title.accent}</span>
    </>
  );
}

function renderBeat(beat: EpisodeBeatV1): React.ReactNode {
  const d = beat.durationInFrames;

  switch (beat.slot) {
    case 'asset-spotlight': {
      const p = asProps<AssetSpotlightProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 35);
      const accent = p.eyebrowColor ?? THEME.colors.accentAmber;
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.035} driftOrigin="center 45%">
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: accent,
              title: renderTitle(p.title, accent),
              subtitle: p.subtitle,
            }}
            mode="centered"
            gap={32}
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
            <OrganicHover amplitude={3} speed={0.04}>
              <DocumentaryImage
                src={p.imageSrc}
                durationInFrames={d}
                badgeTag={p.badgeTag}
                badgeColor={p.badgeColor}
                caption={p.caption}
                zoomDirection={p.zoomDirection}
                height={740}
              />
            </OrganicHover>
          </SceneLayout>
        </BeatMotion>
      );
    }

    case 'diagram-spotlight': {
      const p = asProps<DiagramSpotlightProps>(beat);
      const timing = resolveCalloutTiming(d, p.callout, 35);
      const accent = p.eyebrowColor ?? THEME.colors.accentBlue;
      return (
        <BeatMotion durationInFrames={d} scaleTo={1.04} driftOrigin="center 45%">
          <SceneLayout
            header={{
              eyebrow: p.eyebrow,
              eyebrowColor: accent,
              title: renderTitle(p.title, THEME.colors.accentBlue),
              subtitle: p.subtitle,
            }}
            mode="centered"
            gap={32}
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
            <OrganicHover amplitude={3} speed={0.04}>
              {p.diagramType === 'fragmentation' ? (
                <FragmentationDiagram height={560} />
              ) : null}
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
              label={p.arrowLabel ?? 'INTERNAL ACCUMULATION'}
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
      throw new Error(`evidence-explainer: unsupported slot "${beat.slot}"`);
  }
}

export function EvidenceExplainerTemplate({
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

export const evidenceExplainerTemplate: VideoTemplate = {
  id: 'evidence-explainer',
  version: 1,
  status: 'ready',
  slots: EVIDENCE_EXPLAINER_SLOTS,
  defaults: {
    progressColor: THEME.colors.accentAmber,
    ambientColor: 'rgba(245, 158, 11, 0.07)',
  },
  render: (args) => <EvidenceExplainerTemplate {...args} />,
};
