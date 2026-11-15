// src/Root.tsx
import React from 'react';
import { Composition } from 'remotion';
import { WhyInflationHurts } from './compositions/WhyInflationHurts';
import { ChartShowcase } from './compositions/ChartShowcase';
import { TheDebtClock } from './compositions/TheDebtClock';
import { TheDebtClockRemastered } from './compositions/TheDebtClockRemastered';
import { initFonts } from './styles/fonts';
import './styles/global.css';

// Preload Google Fonts
initFonts();

export const Root: React.FC = () => {
  return (
    <>
      {/* Production Episode 001: 1080x1920, 30fps, 1203 frames (40.11 seconds) */}
      <Composition
        id="WhyInflationHurts"
        component={WhyInflationHurts}
        durationInFrames={1203}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: false,
        }}
      />

      {/* Development Composition with Safe Zone Visible */}
      <Composition
        id="WhyInflationHurts-SafeZone"
        component={WhyInflationHurts}
        durationInFrames={1203}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: true,
        }}
      />

      {/* Phase 2A: Explainer SVG Charts & Diagram Suite Showcase */}
      <Composition
        id="ChartShowcase"
        component={ChartShowcase}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: false,
        }}
      />

      <Composition
        id="ChartShowcase-SafeZone"
        component={ChartShowcase}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: true,
        }}
      />

      {/* Milestone 2: Episode 002 "The $35 Trillion Debt Clock" (1770 frames, 59.0s @ 30fps) */}
      <Composition
        id="TheDebtClock"
        component={TheDebtClock}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: false,
        }}
      />

      <Composition
        id="TheDebtClock-SafeZone"
        component={TheDebtClock}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: true,
        }}
      />

      {/* Phase 2.5 & 3: Episode 002 Remastered with Living Canvas & ElevenLabs Narration */}
      <Composition
        id="TheDebtClockRemastered"
        component={TheDebtClockRemastered}
        durationInFrames={1902}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: false,
        }}
      />

      <Composition
        id="TheDebtClockRemastered-SafeZone"
        component={TheDebtClockRemastered}
        durationInFrames={1902}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: true,
        }}
      />
    </>
  );
};
