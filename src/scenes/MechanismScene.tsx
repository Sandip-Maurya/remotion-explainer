// src/scenes/MechanismScene.tsx
import React from 'react';
import { ChartExplainerSceneData } from '../types/content.types';
import { BarChart } from '../components/data/BarChart';
import { THEME } from '../styles/theme';

export interface MechanismSceneProps {
  data: ChartExplainerSceneData;
}

export const MechanismScene: React.FC<MechanismSceneProps> = ({ data }) => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: THEME.colors.bgSlate,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 60px',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Tech Glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(10, 14, 26, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Chart Title */}
      <div style={{ textAlign: 'center', marginBottom: 36, zIndex: 10 }}>
        <span
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: THEME.fontSizes.caption,
            fontWeight: 800,
            color: THEME.colors.accentBlue,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            padding: '6px 20px',
            borderRadius: 999,
            display: 'inline-block',
            marginBottom: 16,
          }}
        >
          Purchasing Power Drop
        </span>
        <h2
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: THEME.fontSizes.h2,
            fontWeight: 900,
            color: THEME.colors.textWhite,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.chartTitle}
        </h2>
      </div>

      {/* Pure SVG Deterministic Bar Chart */}
      <div style={{ zIndex: 10, marginBottom: 36 }}>
        <BarChart
          data={data.data}
          unit={data.unit}
          highlightIndex={data.highlightIndex}
          width={800}
          height={440}
        />
      </div>

      {/* Key Takeaway Banner */}
      <div
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${THEME.colors.borderGlowRed}`,
          borderRadius: 16,
          padding: '14px 28px',
          color: '#ffffff',
          fontFamily: THEME.fonts.body,
          fontSize: THEME.fontSizes.body,
          fontWeight: 700,
          zIndex: 10,
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
        }}
      >
        {data.keyTakeaway}
      </div>
    </div>
  );
};
