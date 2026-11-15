// src/compositions/TheDebtClockRemastered.tsx
import React from 'react';
import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
} from 'remotion';
import { THEME } from '../styles/theme';
import { ShortsSafeZone } from '../components/core/ShortsSafeZone';
import { ProgressBar } from '../components/core/ProgressBar';
import { AudioMixer } from '../audio/AudioMixer';
import { MetricCard } from '../components/graphics/MetricCard';
import { LineChart } from '../components/data/LineChart';
import { BarChart } from '../components/data/BarChart';
import { BeforeAfterSplit } from '../components/graphics/BeforeAfterSplit';
import { AnimatedArrow } from '../components/graphics/AnimatedArrow';
import { TensionVignette } from '../components/storytelling/TensionVignette';
import { EndCard } from '../components/core/EndCard';
import { EditorialCallout } from '../components/captions/EditorialCallout';
import { SceneLayout } from '../components/layout/SceneLayout';
import { CameraDrift } from '../components/motion/CameraDrift';
import { OrganicHover } from '../components/motion/OrganicHover';
import { CameraMicroBump } from '../components/motion/CameraMicroBump';
import { VideoContent } from '../types/content.types';

// Master episode configuration
import contentData from '../../videos/002-debt-clock/content.json';
const content = contentData as unknown as VideoContent;

export const TheDebtClockRemastered: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();

  // 34-Year National Debt Trajectory (Trillions)
  const debtHistory = [
    { label: '1990', value: 3.2 },
    { label: '2000', value: 5.6 },
    { label: '2008', value: 10.0 },
    { label: '2016', value: 19.5 },
    { label: '2020', value: 27.7 },
    { label: '2024', value: 35.2 },
  ];

  // Major Debt Holders Breakdown with exact decimal numbers
  const debtHolders = [
    { label: 'Foreign', value: 8.5, sublabel: 'Japan & China' },
    { label: 'Fed', value: 4.8, sublabel: 'Central Bank' },
    { label: 'Intragov', value: 7.1, sublabel: 'Social Security' },
    { label: 'You (Public)', value: 14.8, delta: 'Biggest', sublabel: 'Pensions & Banks' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bgMidnight }}>
      {/* Dynamic Ambient Background Glow (Breathes and floats slowly) */}
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          top: '18%',
          left: '0%',
          borderRadius: 550,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          transform: `translateY(${Math.sin(frame * 0.03) * 15}px)`,
        }}
      />

      <Series>
        {/* ==================================================================== */}
        {/* Beat 1: Hook (Frames 0 - 360 = 12.0s)                                */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={360}>
          <CameraDrift durationInFrames={360} scaleFrom={1.0} scaleTo={1.045} origin="center 40%">
            <CameraMicroBump triggerFrame={0} intensity={6} durationFrames={8}>
              <SceneLayout
                header={{
                  eyebrow: 'THE NATIONAL DEBT CLOCK',
                  eyebrowColor: THEME.colors.accentAmber,
                  title: (
                    <>
                      35 MILLION <span style={{ color: THEME.colors.accentBlue }}>MILLIONS</span>
                    </>
                  ),
                }}
                gap={48}
                mode="centered"
                footer={
                  <EditorialCallout
                    text="$104,000 PER CITIZEN"
                    subtext="Every man, woman, and child owes this today"
                    startFrame={35}
                    durationFrames={325}
                    accentColor={THEME.colors.accentAmber}
                    badgeTag="UNPAYABLE BURDEN"
                    inFlow={true}
                  />
                }
              >
                <OrganicHover amplitude={5} speed={0.05}>
                  <MetricCard
                    label="US National Debt"
                    value={35.2}
                    prefix="$"
                    suffix=" Trillion"
                    delta="+312%"
                    trend="up"
                    subtext="Every single American citizen now owes over $104,000 of federal debt."
                    stats={[
                      { label: 'Per Citizen', value: '$104,200' },
                      { label: 'Debt to GDP', value: '124%' },
                      { label: 'Daily Surge', value: '+$3.8B/day' },
                    ]}
                    color={THEME.colors.accentBlue}
                  />
                </OrganicHover>
              </SceneLayout>
            </CameraMicroBump>
          </CameraDrift>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 2: Agitation (Frames 360 - 735 = 12.5s)                         */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={375}>
          <CameraDrift durationInFrames={375} scaleFrom={1.0} scaleTo={1.04} origin="center 50%">
            <SceneLayout
              header={{
                title: 'EXPONENTIAL ACCELERATION',
                subtitle: 'Interest payments now consume more than defense.',
              }}
              gap={40}
              mode="centered"
              footer={
                <EditorialCallout
                  text="OVER $1.1 TRILLION / YR"
                  subtext="Interest alone consumes more than defense"
                  startFrame={40}
                  durationFrames={335}
                  accentColor={THEME.colors.accentRed}
                  badgeTag="RECORD INTEREST"
                  inFlow={true}
                />
              }
            >
              <OrganicHover amplitude={4} speed={0.06}>
                <BeforeAfterSplit
                  before={{
                    tag: 'Year 2000',
                    value: '$5.6T',
                    label: '56% of US GDP',
                    subtext: 'Manageable interest burden ($200B/yr)',
                  }}
                  after={{
                    tag: 'Today',
                    value: '$35.2T',
                    label: '124% of US GDP',
                    subtext: 'Interest exceeds $1.1 Trillion/year',
                    isShock: true,
                  }}
                  connectorBadge="▲ 6.3x SURGE"
                  layout="stacked"
                />
              </OrganicHover>
            </SceneLayout>
          </CameraDrift>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 3A: Mechanism - Tall Line Chart (Frames 735 - 985 = 8.3s)       */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={250}>
          <CameraDrift durationInFrames={250} scaleFrom={1.0} scaleTo={1.045} origin="right bottom">
            <SceneLayout
              mode="centered"
              gap={36}
              footer={
                <EditorialCallout
                  text="PARABOLIC EXPLOSION"
                  subtext="From linear growth to exponential surge"
                  startFrame={25}
                  durationFrames={225}
                  accentColor={THEME.colors.accentBlue}
                  badgeTag="EXPONENTIAL SPIKE"
                  inFlow={true}
                />
              }
            >
              <LineChart
                title="34-YEAR NATIONAL DEBT TRAJECTORY"
                data={debtHistory}
                prefix="$"
                unit="T"
                color="#38bdf8"
                curved={true}
                showArea={true}
                height={730}
                width={THEME.dimensions.standardCardWidth}
              />
            </SceneLayout>
          </CameraDrift>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 3B: Mechanism - Tall Bar Chart (Frames 985 - 1251 = 8.9s)       */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={266}>
          <CameraDrift durationInFrames={266} scaleFrom={1.0} scaleTo={1.04} origin="center 60%">
            <SceneLayout
              mode="centered"
              gap={36}
              footer={
                <EditorialCallout
                  text="YOU ARE THE BIGGEST CREDITOR"
                  subtext="Held inside your 401(k), pensions, and savings"
                  startFrame={25}
                  durationFrames={241}
                  accentColor={THEME.colors.accentEmerald}
                  badgeTag="THE REVELATION"
                  inFlow={true}
                />
              }
            >
              <BarChart
                title="WHO ACTUALLY OWNS THE $35 TRILLION?"
                data={debtHolders}
                prefix="$"
                unit="T"
                highlightIndex={3}
                height={710}
                width={THEME.dimensions.standardCardWidth}
                decimals={1}
              />
            </SceneLayout>
          </CameraDrift>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 4: Climax (Frames 1251 - 1579 = 10.9s)                          */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={328}>
          <CameraMicroBump triggerFrame={130} intensity={8} durationFrames={10}>
            <SceneLayout
              mode="centered"
              gap={42}
              header={{
                eyebrow: 'THE STEALTH TRAP',
                eyebrowColor: THEME.colors.accentRed,
                title: (
                  <>
                    THEY DON'T RAISE TAXES.
                    <br />
                    <span style={{ color: THEME.colors.accentAmber }}>THEY DILUTE THE DOLLAR.</span>
                  </>
                ),
              }}
              footer={
                <EditorialCallout
                  text="THE STEALTH DEBASEMENT"
                  subtext="Quietly diluting every dollar you work for"
                  startFrame={35}
                  durationFrames={293}
                  accentColor={THEME.colors.accentRed}
                  badgeTag="HIDDEN MECHANISM"
                  inFlow={true}
                />
              }
              style={{ backgroundColor: THEME.colors.bgPitch }}
            >
              <TensionVignette color={THEME.colors.accentRed} intensity={0.45} />
              <AnimatedArrow
                direction="down"
                label="PURCHASING POWER"
                color={THEME.colors.accentRed}
                length={185}
                headWidth={100}
                shaftWidth={38}
                pulse={true}
              />
            </SceneLayout>
          </CameraMicroBump>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 5: Payoff (Frames 1579 - 1770 = 6.4s)                           */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={191}>
          <CameraDrift durationInFrames={191} scaleFrom={1.0} scaleTo={1.03}>
            <SceneLayout
              mode="centered"
              gap={36}
              style={{ backgroundColor: THEME.colors.bgEmerald }}
            >
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
                  THE BRUTAL REALITY
                </div>
                <div
                  style={{
                    fontFamily: THEME.fonts.heading,
                    fontSize: 34,
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.35,
                  }}
                >
                  "When debt grows faster than real value, it's not a loan anymore."
                </div>
              </div>

              <EndCard
                coreLesson="It quietly dilutes every single hour you work."
                callToAction="Subscribe to see through the financial illusion"
                loopBridge="Thirty-five trillion dollars..."
              />
            </SceneLayout>
          </CameraDrift>
        </Series.Sequence>
      </Series>

      {/* Persistent Retention Progress Bar */}
      <ProgressBar color={THEME.colors.accentBlue} height={5} />

      {/* Master 3-Track Audio Mixer (Narration + Ducked BGM + Punchy SFX) */}
      <AudioMixer content={content} />

      {/* Safe Zone Overlay */}
      {showSafeZone && <ShortsSafeZone visible={true} mode="outline" />}
    </AbsoluteFill>
  );
};
