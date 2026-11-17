// src/Root.tsx
import React from 'react';
import { Composition } from 'remotion';
import { WhyInflationHurts } from './compositions/WhyInflationHurts';
import { ChartShowcase } from './compositions/ChartShowcase';
import { TheDebtClockRemastered } from './compositions/TheDebtClockRemastered';
import { PythonVsJavascript } from './compositions/PythonVsJavascript';
import { CreditCardBlood } from './compositions/CreditCardBlood';
import { EpisodePlayer } from './engine/EpisodePlayer';
import type { EpisodeContentV1 } from './types/content.types';
import { initFonts } from './styles/fonts';
import './styles/global.css';

import content001 from '../episodes/001-why-inflation-hurts/content.json';
import content002 from '../episodes/002-debt-clock/content.json';
import content003 from '../episodes/003-python-vs-javascript/content.json';
import content004 from '../episodes/004-credit-card-blood/content.json';

// Preload Google Fonts
initFonts();

const ep001 = content001 as unknown as EpisodeContentV1;
const ep002 = content002 as unknown as EpisodeContentV1;
const ep003 = content003 as unknown as EpisodeContentV1;
const ep004 = content004 as unknown as EpisodeContentV1;

export const Root: React.FC = () => {
  return (
    <>
      {/* Template-driven episodes (composition id === slug) */}
      <Composition
        id="001-why-inflation-hurts"
        component={EpisodePlayer}
        durationInFrames={ep001.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ content: ep001, showSafeZone: false }}
      />
      <Composition
        id="002-debt-clock"
        component={EpisodePlayer}
        durationInFrames={ep002.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ content: ep002, showSafeZone: false }}
      />
      <Composition
        id="003-python-vs-javascript"
        component={EpisodePlayer}
        durationInFrames={ep003.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ content: ep003, showSafeZone: false }}
      />
      <Composition
        id="004-credit-card-blood"
        component={EpisodePlayer}
        durationInFrames={ep004.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ content: ep004, showSafeZone: false }}
      />

      {/* Studio aliases (thin EpisodePlayer adapters) */}
      <Composition
        id="WhyInflationHurts"
        component={WhyInflationHurts}
        durationInFrames={ep001.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: false }}
      />
      <Composition
        id="WhyInflationHurts-SafeZone"
        component={WhyInflationHurts}
        durationInFrames={ep001.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: true }}
      />
      <Composition
        id="TheDebtClockRemastered"
        component={TheDebtClockRemastered}
        durationInFrames={ep002.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: false }}
      />
      <Composition
        id="TheDebtClockRemastered-SafeZone"
        component={TheDebtClockRemastered}
        durationInFrames={ep002.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: true }}
      />
      <Composition
        id="PythonVsJavascript"
        component={PythonVsJavascript}
        durationInFrames={ep003.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: false }}
      />
      <Composition
        id="PythonVsJavascript-SafeZone"
        component={PythonVsJavascript}
        durationInFrames={ep003.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: true }}
      />
      <Composition
        id="CreditCardBlood"
        component={CreditCardBlood}
        durationInFrames={ep004.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: false }}
      />
      <Composition
        id="CreditCardBlood-SafeZone"
        component={CreditCardBlood}
        durationInFrames={ep004.totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: true }}
      />

      {/* Component playground */}
      <Composition
        id="ChartShowcase"
        component={ChartShowcase}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: false }}
      />
      <Composition
        id="ChartShowcase-SafeZone"
        component={ChartShowcase}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeZone: true }}
      />
    </>
  );
};
