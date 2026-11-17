// src/compositions/PythonVsJavascript.tsx
import React from 'react';
import { Series } from 'remotion';
import { EpisodeShell, BeatMotion } from './EpisodeShell';
import { SceneLayout } from '../components/layout/SceneLayout';
import { EditorialCallout } from '../components/captions/EditorialCallout';
import { BeforeAfterSplit } from '../components/graphics/BeforeAfterSplit';
import { ChecklistCard } from '../components/graphics/ChecklistCard';
import { GoalPathChooser } from '../components/graphics/GoalPathChooser';
import { LanguageFaceOff } from '../components/graphics/LanguageFaceOff';
import { TensionVignette } from '../components/storytelling/TensionVignette';
import { EndCard } from '../components/core/EndCard';
import { OrganicHover } from '../components/motion/OrganicHover';
import { THEME } from '../styles/theme';
import {
  VideoContent,
  HookSceneData,
  HumanStakesSceneData,
  DramaticClimaxSceneData,
  PayoffSceneData,
} from '../types/content.types';
import contentData from '../../episodes/003-python-vs-javascript/content.json';

const content = contentData as unknown as VideoContent;

// Caption-aligned beat splits inside the mechanism scene
const MECHANISM_PYTHON_FRAMES = 1056; // ~1223 → 2241
const MECHANISM_JS_FRAMES = 1070; // ~2241 → 3311

export const PythonVsJavascript: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => {
  const hook = content.scenes[0] as HookSceneData;
  const stakes = content.scenes[1] as HumanStakesSceneData;
  const climax = content.scenes[3] as DramaticClimaxSceneData;
  const payoff = content.scenes[4] as PayoffSceneData;

  return (
    <EpisodeShell
      content={content}
      showSafeZone={showSafeZone}
      progressColor={THEME.colors.accentAmber}
      ambientColor="rgba(245, 158, 11, 0.07)"
    >
      {/* Beat 1: Hook — face-off + wrong question */}
      <Series.Sequence durationInFrames={hook.durationInFrames}>
        <BeatMotion durationInFrames={hook.durationInFrames} bumpAt={0}>
          <SceneLayout
            header={{
              eyebrow: 'BEGINNER TRAP',
              eyebrowColor: THEME.colors.accentAmber,
              title: hook.headline,
              subtitle: 'Two videos. Two answers. Zero progress.',
            }}
            mode="centered"
            gap={36}
            footer={
              <EditorialCallout
                text="WRONG QUESTION"
                subtext="You're not coding — you're worrying"
                startFrame={90}
                durationFrames={620}
                accentColor={THEME.colors.accentRed}
                badgeTag="PARALYSIS"
                inFlow={true}
              />
            }
          >
            <OrganicHover amplitude={4} speed={0.045}>
              <LanguageFaceOff />
            </OrganicHover>
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      {/* Beat 2: Agitation — wanted vs got */}
      <Series.Sequence durationInFrames={stakes.durationInFrames}>
        <BeatMotion durationInFrames={stakes.durationInFrames}>
          <SceneLayout
            header={{
              eyebrow: stakes.personaLabel.toUpperCase(),
              eyebrowColor: THEME.colors.accentRed,
              title: 'THE REAL COST',
              subtitle: stakes.impactStatement,
            }}
            mode="centered"
            gap={32}
          >
            <BeforeAfterSplit
              before={{
                tag: stakes.comparison.pastLabel,
                value: String(stakes.comparison.pastValue),
                label: 'Ship something',
                subtext: 'Curiosity → first project',
                color: THEME.colors.accentEmerald,
              }}
              after={{
                tag: stakes.comparison.presentLabel,
                value: String(stakes.comparison.presentValue),
                label: 'Endless switching',
                subtext: 'Fear of wasting months',
                isShock: true,
              }}
              connectorBadge="TRAP"
              layout="stacked"
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      {/* Beat 3A: Python — patient teacher */}
      <Series.Sequence durationInFrames={MECHANISM_PYTHON_FRAMES}>
        <BeatMotion
          durationInFrames={MECHANISM_PYTHON_FRAMES}
          driftOrigin="center 40%"
        >
          <SceneLayout
            header={{
              eyebrow: 'PYTHON',
              eyebrowColor: THEME.colors.accentBlue,
              title: 'The patient teacher',
              subtitle: 'Readable. Calm. Built for data, AI & automation.',
            }}
            mode="top-anchored"
            gap={28}
            footer={
              <EditorialCallout
                text="FINALLY BREATHE"
                subtext="Fast on-ramp when the goal is numbers & models"
                startFrame={40}
                durationFrames={900}
                accentColor={THEME.colors.accentBlue}
                badgeTag="STRENGTH"
                inFlow={true}
              />
            }
          >
            <ChecklistCard
              title="Python"
              subtitle="Where it shines — and where it doesn't"
              accentColor={THEME.colors.accentBlue}
              items={[
                { text: 'Reads almost like English', tone: 'pro' },
                { text: 'Strong for AI, data, automation, science', tone: 'pro' },
                { text: 'Gets beginners moving with less panic', tone: 'pro' },
                { text: 'Not the natural home for rich browser UI', tone: 'con' },
              ]}
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      {/* Beat 3B: JavaScript — language of the internet */}
      <Series.Sequence durationInFrames={MECHANISM_JS_FRAMES}>
        <BeatMotion
          durationInFrames={MECHANISM_JS_FRAMES}
          driftOrigin="center 55%"
        >
          <SceneLayout
            header={{
              eyebrow: 'JAVASCRIPT',
              eyebrowColor: THEME.colors.accentAmber,
              title: 'Language of the internet',
              subtitle: 'Already inside the sites you use every day.',
            }}
            mode="top-anchored"
            gap={24}
            style={{ backgroundColor: THEME.colors.bgSlate }}
            footer={
              <EditorialCallout
                text="THINGS PEOPLE CLICK"
                subtext="Pages, buttons, dashboards, real products"
                startFrame={35}
                durationFrames={900}
                accentColor={THEME.colors.accentAmber}
                badgeTag="STRENGTH"
                inFlow={true}
              />
            }
          >
            <ChecklistCard
              title="JavaScript"
              subtitle="Powerful on the web — chaotic at first"
              accentColor={THEME.colors.accentAmber}
              delayFrames={4}
              items={[
                { text: 'Runs in almost every browser', tone: 'pro' },
                { text: 'Build what people actually touch', tone: 'pro' },
                { text: 'Browser + server with one language', tone: 'pro' },
                { text: 'Quirks, async & tool overload early on', tone: 'con' },
                { text: 'Usually not the first door for AI/data', tone: 'con' },
              ]}
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      {/* Beat 4: Climax — destination test */}
      <Series.Sequence durationInFrames={climax.durationInFrames}>
        <BeatMotion
          durationInFrames={climax.durationInFrames}
          drift={false}
          bumpAt={54}
        >
          <SceneLayout
            mode="centered"
            gap={28}
            header={{
              eyebrow: 'THE HUMAN WAY',
              eyebrowColor: THEME.colors.accentRed,
              title: (
                <>
                  {climax.epiphanyHeadline}
                  <br />
                  <span style={{ color: THEME.colors.accentAmber }}>
                    PICK A DESTINATION
                  </span>
                </>
              ),
            }}
            style={{ backgroundColor: THEME.colors.bgPitch }}
            footer={
              <EditorialCallout
                text="SHOW A FRIEND IN 30 DAYS"
                subtext={climax.punchline}
                startFrame={120}
                durationFrames={580}
                accentColor={THEME.colors.accentAmber}
                badgeTag="DECISION"
                inFlow={true}
              />
            }
          >
            <TensionVignette color={THEME.colors.accentRed} intensity={0.4} />
            <GoalPathChooser
              paths={[
                {
                  ifLabel: 'AI · data · automation · research',
                  thenLabel: 'Start with Python',
                  accentColor: THEME.colors.accentBlue,
                },
                {
                  ifLabel: 'Website · web app · clickable UI',
                  thenLabel: 'Start with JavaScript',
                  accentColor: THEME.colors.accentAmber,
                },
              ]}
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>

      {/* Beat 5: Payoff — door, not prison */}
      <Series.Sequence durationInFrames={payoff.durationInFrames}>
        <BeatMotion durationInFrames={payoff.durationInFrames} scaleTo={1.03}>
          <SceneLayout
            mode="centered"
            gap={36}
            style={{ backgroundColor: THEME.colors.bgEmerald }}
            header={{
              eyebrow: 'PERMISSION SLIP',
              eyebrowColor: THEME.colors.accentEmerald,
              title: 'A door, not a prison',
              subtitle: "You're not behind. You're not choosing forever.",
            }}
            footer={
              <EditorialCallout
                text="START WITH THE THING"
                subtext="you can't stop thinking about building"
                startFrame={80}
                durationFrames={650}
                accentColor={THEME.colors.accentEmerald}
                badgeTag="NEXT STEP"
                inFlow={true}
              />
            }
          >
            <EndCard
              coreLesson={payoff.coreLesson}
              callToAction={payoff.callToAction}
              loopBridge={payoff.loopTransitionPhrase}
            />
          </SceneLayout>
        </BeatMotion>
      </Series.Sequence>
    </EpisodeShell>
  );
};
