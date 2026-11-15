// src/compositions/TheDebtClock.tsx
import React from 'react';
import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { THEME } from '../styles/theme';
import { ShortsSafeZone } from '../components/core/ShortsSafeZone';
import { ProgressBar } from '../components/core/ProgressBar';
import { KineticCaptions } from '../components/captions/KineticCaptions';
import { AudioMixer } from '../audio/AudioMixer';
import { MetricCard } from '../components/graphics/MetricCard';
import { LineChart } from '../components/data/LineChart';
import { BarChart } from '../components/data/BarChart';
import { BeforeAfterSplit } from '../components/graphics/BeforeAfterSplit';
import { AnimatedArrow } from '../components/graphics/AnimatedArrow';
import { TensionVignette } from '../components/storytelling/TensionVignette';
import { EndCard } from '../components/core/EndCard';
import { CaptionToken, VideoContent } from '../types/content.types';

// Load content and enriched captions
import contentData from '../../videos/002-debt-clock/content.json';
import captionsData from '../../videos/002-debt-clock/captions.json';

const content = contentData as unknown as VideoContent;
const captions = captionsData as CaptionToken[];

export const TheDebtClock: React.FC<{ showSafeZone?: boolean }> = ({ showSafeZone = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Debt Growth data (Trillions of $)
  const debtHistory = [
    { label: '1990', value: 3.2 },
    { label: '2000', value: 5.6 },
    { label: '2008', value: 10.0 },
    { label: '2016', value: 19.5 },
    { label: '2020', value: 27.7 },
    { label: '2024', value: 35.2 },
  ];

  // Holders of US Debt (Trillions of $)
  const debtHolders = [
    { label: 'Foreign', value: 8.5, sublabel: 'Japan & China' },
    { label: 'Fed', value: 4.8, sublabel: 'Central Bank' },
    { label: 'Intragov', value: 7.1, sublabel: 'Social Security' },
    { label: 'You (Public)', value: 14.8, delta: 'Biggest', sublabel: 'Pensions & Banks' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bgMidnight }}>
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          top: '20%',
          left: '5%',
          borderRadius: 500,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Series>
        {/* ==================================================================== */}
        {/* Beat 1: Hook (Frames 0 - 360 = 12.0s)                                */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={360}>
          <AbsoluteFill
            style={{
              padding: '210px 100px 340px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 40,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 28,
                  fontWeight: 800,
                  color: THEME.colors.accentAmber,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                THE DEBT CLOCK
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 52,
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.15,
                }}
              >
                35 MILLION <span style={{ color: THEME.colors.accentBlue }}>MILLIONS</span>
              </div>
            </div>

            <MetricCard
              label="US National Debt"
              value={35.2}
              prefix="$"
              suffix=" Trillion"
              delta="+312%"
              trend="up"
              subtext="Every single American citizen now owes over $104,000 of federal debt."
              color={THEME.colors.accentBlue}
            />
          </AbsoluteFill>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 2: Agitation (Frames 360 - 735 = 12.5s)                         */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={375}>
          <AbsoluteFill
            style={{
              padding: '210px 100px 340px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 36,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 38,
                  fontWeight: 900,
                  color: '#ffffff',
                }}
              >
                EXPONENTIAL ACCELERATION
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.body,
                  fontSize: 22,
                  color: '#94a3b8',
                  marginTop: 6,
                }}
              >
                Interest payments now exceed the entire defense budget.
              </div>
            </div>

            <BeforeAfterSplit
              before={{
                tag: 'Year 2000',
                value: '$5.6T',
                label: '56% of US GDP',
                subtext: 'Manageable interest load',
              }}
              after={{
                tag: 'Today',
                value: '$35.2T',
                label: '124% of US GDP',
                subtext: 'Interest exceeds $1.1 Trillion/yr',
                isShock: true,
              }}
              layout="stacked"
            />
          </AbsoluteFill>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 3A: Mechanism - Line Chart (Frames 735 - 985 = 8.3s)            */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={250}>
          <AbsoluteFill
            style={{
              padding: '210px 100px 340px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#ffffff',
                }}
              >
                DEBT TRAJECTORY (1990–2024)
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.body,
                  fontSize: 22,
                  color: '#94a3b8',
                  marginTop: 6,
                }}
              >
                From steady climb to parabolic surge.
              </div>
            </div>

            <LineChart
              data={debtHistory}
              prefix="$"
              unit="T"
              color="#38bdf8"
              curved={true}
              showArea={true}
              height={520}
            />
          </AbsoluteFill>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 3B: Mechanism - Bar Chart (Frames 985 - 1251 = 8.9s)            */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={266}>
          <AbsoluteFill
            style={{
              padding: '210px 100px 340px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#ffffff',
                }}
              >
                WHO OWNS THE $35 TRILLION?
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.body,
                  fontSize: 22,
                  color: '#94a3b8',
                  marginTop: 6,
                }}
              >
                The biggest creditor is everyday Americans.
              </div>
            </div>

            <BarChart
              data={debtHolders}
              prefix="$"
              unit="T"
              highlightIndex={3}
              height={520}
            />
          </AbsoluteFill>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 4: Climax (Frames 1251 - 1579 = 10.9s)                          */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={328}>
          <AbsoluteFill
            style={{
              padding: '220px 100px 340px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 36,
              backgroundColor: THEME.colors.bgPitch,
            }}
          >
            <TensionVignette color={THEME.colors.accentRed} intensity={0.4} />

            <div
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 26,
                fontWeight: 800,
                color: THEME.colors.accentRed,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              THE STEALTH TRAP
            </div>

            <div
              style={{
                fontFamily: THEME.fonts.heading,
                fontSize: 48,
                fontWeight: 900,
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.25,
                maxWidth: 820,
              }}
            >
              THEY DON'T RAISE TAXES.
              <br />
              <span style={{ color: THEME.colors.accentAmber }}>THEY PRINT MORE MONEY.</span>
            </div>

            <AnimatedArrow
              direction="down"
              label="PURCHASING POWER"
              color={THEME.colors.accentRed}
              length={130}
            />
          </AbsoluteFill>
        </Series.Sequence>

        {/* ==================================================================== */}
        {/* Beat 5: Payoff (Frames 1579 - 1770 = 6.4s)                           */}
        {/* ==================================================================== */}
        <Series.Sequence durationInFrames={191}>
          <AbsoluteFill
            style={{
              padding: '210px 100px 340px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 30,
              backgroundColor: THEME.colors.bgEmerald,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 24,
                padding: '36px 32px',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.25)',
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
                "It's not a loan anymore. It's a stealth tax on your time."
              </div>
            </div>

            <EndCard
              coreLesson="When debt grows faster than real value, it's not a loan anymore."
              callToAction="Subscribe to see through the financial illusion"
              loopBridge="Thirty-five trillion dollars..."
            />
          </AbsoluteFill>
        </Series.Sequence>
      </Series>

      {/* Persistent Retention Progress Bar */}
      <ProgressBar color={THEME.colors.accentBlue} height={5} />

      {/* Kinetic Captions */}
      <KineticCaptions captions={captions} />

      {/* Master 3-Track Audio Mixer */}
      <AudioMixer content={content} />

      {/* Safe Zone Overlay */}
      {showSafeZone && <ShortsSafeZone visible={true} mode="outline" />}
    </AbsoluteFill>
  );
};
