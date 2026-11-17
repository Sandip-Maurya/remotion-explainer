// src/Root.tsx
import React from 'react';
import { Composition } from 'remotion';
import { WhyInflationHurts } from './compositions/WhyInflationHurts';
import { ChartShowcase } from './compositions/ChartShowcase';
import { TheDebtClock } from './compositions/TheDebtClock';
import { TheDebtClockRemastered } from './compositions/TheDebtClockRemastered';
import { PythonVsJavascript } from './compositions/PythonVsJavascript';
import { EpisodePlayer } from './engine/EpisodePlayer';
import type { EpisodeContentV1 } from './types/content.types';
import { initFonts } from './styles/fonts';
import './styles/global.css';

import content002 from '../episodes/002-debt-clock/content.json';
import content003 from '../episodes/003-python-vs-javascript/content.json';

// Preload Google Fonts
initFonts();

const ep002 = content002 as unknown as EpisodeContentV1;
const ep003 = content003 as unknown as EpisodeContentV1;

export const Root: React.FC = () => {
  return (
    <>
      {/* Production Episode 001: legacy composition (not yet templated) */}
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

      {/* Legacy Edge-TTS Episode 002 (59s) — historical composition */}
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

      {/* Template-driven: 002-debt-clock (data-explainer) */}
      <Composition
        id="002-debt-clock"
        component={EpisodePlayer}
        durationInFrames={ep002.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          content: ep002,
          showSafeZone: false,
        }}
      />

      {/* Alias: Studio / render scripts that still use TheDebtClockRemastered */}
      <Composition
        id="TheDebtClockRemastered"
        component={TheDebtClockRemastered}
        durationInFrames={ep002.totalDurationInFrames}
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
        durationInFrames={ep002.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: true,
        }}
      />

      {/* Template-driven: 003-python-vs-javascript (decision-compare) */}
      <Composition
        id="003-python-vs-javascript"
        component={EpisodePlayer}
        durationInFrames={ep003.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          content: ep003,
          showSafeZone: false,
        }}
      />

      {/* Alias: Studio / render scripts that still use PythonVsJavascript */}
      <Composition
        id="PythonVsJavascript"
        component={PythonVsJavascript}
        durationInFrames={ep003.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZone: false,
        }}
      />

      <Composition
        id="PythonVsJavascript-SafeZone"
        component={PythonVsJavascript}
        durationInFrames={ep003.totalDurationInFrames}
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
