// src/scenes/ClimaxScene.tsx
import React from 'react';
import { DramaticClimaxSceneData } from '../types/content.types';
import { DramaticQuote } from '../components/storytelling/DramaticQuote';
import { THEME } from '../styles/theme';

export interface ClimaxSceneProps {
  data: DramaticClimaxSceneData;
}

export const ClimaxScene: React.FC<ClimaxSceneProps> = ({ data }) => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: THEME.colors.bgPitch,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 60px',
        overflow: 'hidden',
      }}
    >
      {/* Stark Minimalism & Dramatic Epiphany */}
      <DramaticQuote
        headline={data.epiphanyHeadline}
        punchline={data.punchline}
        startFrame={5}
        pauseFrames={data.dramaticPauseFrames}
      />
    </div>
  );
};
