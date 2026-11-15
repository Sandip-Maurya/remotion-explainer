// src/compositions/WhyInflationHurts.tsx
import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { HookScene } from '../scenes/HookScene';
import { AgitationScene } from '../scenes/AgitationScene';
import { MechanismScene } from '../scenes/MechanismScene';
import { ClimaxScene } from '../scenes/ClimaxScene';
import { PayoffScene } from '../scenes/PayoffScene';
import { KineticCaptions } from '../components/captions/KineticCaptions';
import { ProgressBar } from '../components/core/ProgressBar';
import { AudioMixer } from '../audio/AudioMixer';
import { ShortsSafeZone } from '../components/core/ShortsSafeZone';
import { VideoContent, CaptionToken, HookSceneData, HumanStakesSceneData, ChartExplainerSceneData, DramaticClimaxSceneData, PayoffSceneData } from '../types/content.types';

// Load episode content & captions data
import contentJson from '../../videos/001-why-inflation-hurts/content.json';
import captionsJson from '../../videos/001-why-inflation-hurts/captions.json';

export interface WhyInflationHurtsProps {
  showSafeZone?: boolean;
}

const content = contentJson as unknown as VideoContent;
const captions = captionsJson as unknown as CaptionToken[];

export const WhyInflationHurts: React.FC<WhyInflationHurtsProps> = ({
  showSafeZone = false,
}) => {
  const scenes = content.scenes;
  const hookData = scenes[0] as HookSceneData;
  const stakesData = scenes[1] as HumanStakesSceneData;
  const mechanismData = scenes[2] as ChartExplainerSceneData;
  const climaxData = scenes[3] as DramaticClimaxSceneData;
  const payoffData = scenes[4] as PayoffSceneData;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070a13', overflow: 'hidden' }}>
      {/* 1. Sequential 5-Beat Narrative Scenes */}
      <Series>
        <Series.Sequence durationInFrames={hookData.durationInFrames}>
          <HookScene data={hookData} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={stakesData.durationInFrames}>
          <AgitationScene data={stakesData} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={mechanismData.durationInFrames}>
          <MechanismScene data={mechanismData} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={climaxData.durationInFrames}>
          <ClimaxScene data={climaxData} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={payoffData.durationInFrames}>
          <PayoffScene data={payoffData} />
        </Series.Sequence>
      </Series>

      {/* 2. Word-by-Word Synchronized Kinetic Subtitles */}
      <KineticCaptions captions={captions} />

      {/* 3. Global Top-of-Screen Viewer Retention Progress Bar */}
      <ProgressBar height={8} />

      {/* 4. Multi-Track Audio Engine with Ducking & Climax Silence */}
      <AudioMixer content={content} />

      {/* 5. Mobile Safe Zone Overlay (toggleable for development review) */}
      <ShortsSafeZone visible={showSafeZone} mode="full" />
    </AbsoluteFill>
  );
};
