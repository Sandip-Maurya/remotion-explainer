// src/compositions/ChartShowcase.tsx
import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, interpolate } from 'remotion';
import { THEME } from '../styles/theme';
import { ShortsSafeZone } from '../components/core/ShortsSafeZone';
import { LineChart } from '../components/data/LineChart';
import { BarChart } from '../components/data/BarChart';
import { MetricCard } from '../components/graphics/MetricCard';
import { BeforeAfterSplit } from '../components/graphics/BeforeAfterSplit';
import { StepTimeline } from '../components/graphics/StepTimeline';
import { AnimatedArrow } from '../components/graphics/AnimatedArrow';

export const ChartShowcase: React.FC<{ showSafeZone?: boolean }> = ({ showSafeZone = true }) => {
  const frame = useCurrentFrame();

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
    { label: 'Intragov', value: 7.1, sublabel: 'Social Security' },
    { label: 'Foreign', value: 8.5, sublabel: 'Japan, China, UK' },
    { label: 'Fed', value: 4.8, sublabel: 'Central Bank' },
    { label: 'Public', value: 14.8, delta: '+64%', sublabel: 'Mutual Funds & Banks' },
  ];

  // Mechanism steps
  const mechanismSteps = [
    {
      stepNumber: 1,
      title: 'Deficit Spending',
      description: 'Congress spends $1.9 Trillion more than it collects in taxes each year.',
    },
    {
      stepNumber: 2,
      title: 'Bond Issuance',
      description: 'The Treasury issues IOUs to borrow trillions from global markets.',
    },
    {
      stepNumber: 3,
      title: 'Monetary Expansion',
      description: 'Central banks buy the debt, flooding the system with newly minted dollars.',
      isAlert: true,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bgMidnight }}>
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          top: '15%',
          left: '10%',
          borderRadius: 450,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Series>
        {/* Section 1: Metric Card + Evolving SVG Line Chart (Frames 0 - 90 = 3s) */}
        <Series.Sequence durationInFrames={90}>
          <AbsoluteFill style={{ padding: '200px 100px 340px 80px', display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <MetricCard
              label="US National Debt (2024)"
              value={35.2}
              prefix="$"
              suffix=" Trillion"
              delta="+312%"
              trend="up"
              subtext="Up from $5.6T in 2000. Interest payments alone now exceed the entire defense budget."
              color={THEME.colors.accentBlue}
            />

            <LineChart
              title="National Debt Trajectory"
              data={debtHistory}
              prefix="$"
              unit="T"
              color="#38bdf8"
              curved={true}
              showArea={true}
              height={500}
            />
          </AbsoluteFill>
        </Series.Sequence>

        {/* Section 2: Upgraded SVG Bar Chart + Animated Arrow (Frames 90 - 180 = 3s) */}
        <Series.Sequence durationInFrames={90}>
          <AbsoluteFill style={{ padding: '220px 100px 340px 80px', display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: THEME.fonts.heading, fontSize: 36, fontWeight: 900, color: '#ffffff' }}>
                WHO OWNS THE $35 TRILLION?
              </div>
              <div style={{ fontFamily: THEME.fonts.body, fontSize: 22, color: '#94a3b8', marginTop: 8 }}>
                The largest creditor might surprise you.
              </div>
            </div>

            <BarChart
              title="Major Debt Holders (Trillions)"
              data={debtHolders}
              prefix="$"
              unit="T"
              highlightIndex={3}
              height={540}
            />

            <AnimatedArrow direction="up" label="Exponential Spike" color={THEME.colors.accentRed} length={100} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* Section 3: Before / After Split & Step Timeline (Frames 180 - 270 = 3s) */}
        <Series.Sequence durationInFrames={90}>
          <AbsoluteFill style={{ padding: '200px 100px 340px 80px', display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>
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
              layout="stacked"
            />

            <StepTimeline steps={mechanismSteps} activeStepIndex={2} />
          </AbsoluteFill>
        </Series.Sequence>
      </Series>

      {/* Safe Zone Overlay */}
      {showSafeZone && <ShortsSafeZone visible={true} mode="outline" />}
    </AbsoluteFill>
  );
};
