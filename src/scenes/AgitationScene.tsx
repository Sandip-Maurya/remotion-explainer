// src/scenes/AgitationScene.tsx
import React from 'react';
import { HumanStakesSceneData } from '../types/content.types';
import { HumanStakesCard } from '../components/storytelling/HumanStakesCard';
import { TensionVignette } from '../components/storytelling/TensionVignette';
import { MetaphorIcon } from '../components/storytelling/MetaphorIcon';
import { THEME } from '../styles/theme';

export interface AgitationSceneProps {
  data: HumanStakesSceneData;
}

export const AgitationScene: React.FC<AgitationSceneProps> = ({ data }) => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: THEME.colors.bgCharcoal,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 60px',
        overflow: 'hidden',
      }}
    >
      {/* Psychological Tension Vignette */}
      <TensionVignette intensity={0.65} pulse={true} color="rgba(11, 9, 20, 0.85)" />

      {/* Metaphor Icon */}
      <div style={{ marginBottom: 28, zIndex: 10 }}>
        <MetaphorIcon type="empty-cart" size={180} color={THEME.colors.accentRed} />
      </div>

      {/* Human Stakes Dual Comparison Card */}
      <div style={{ zIndex: 10 }}>
        <HumanStakesCard
          personaLabel={data.personaLabel}
          pastLabel={data.comparison.pastLabel}
          pastValue={data.comparison.pastValue}
          presentLabel={data.comparison.presentLabel}
          presentValue={data.comparison.presentValue}
          impactStatement={data.impactStatement}
          startFrame={5}
        />
      </div>
    </div>
  );
};
