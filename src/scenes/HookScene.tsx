// src/scenes/HookScene.tsx
import React from 'react';
import { HookSceneData } from '../types/content.types';
import { Title } from '../components/core/Title';
import { MetaphorIcon } from '../components/storytelling/MetaphorIcon';
import { THEME } from '../styles/theme';

export interface HookSceneProps {
  data: HookSceneData;
}

export const HookScene: React.FC<HookSceneProps> = ({ data }) => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: THEME.colors.bgMidnight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 60px',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(7, 10, 19, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Visual Metaphor Icon */}
      <div style={{ marginBottom: 36 }}>
        <MetaphorIcon type={data.metaphor ?? 'dollar-burn'} size={220} color={THEME.colors.accentAmber} />
      </div>

      {/* Kinetic Headline */}
      <Title
        headline={data.headline}
        subtext={data.subtext}
        highlightWord={data.highlightWord}
        highlightColor={THEME.colors.accentAmber}
        startFrame={5}
        align="center"
      />
    </div>
  );
};
