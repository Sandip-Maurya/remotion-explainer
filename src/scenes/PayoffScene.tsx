// src/scenes/PayoffScene.tsx
import React from 'react';
import { PayoffSceneData } from '../types/content.types';
import { EndCard } from '../components/core/EndCard';
import { THEME } from '../styles/theme';

export interface PayoffSceneProps {
  data: PayoffSceneData;
}

export const PayoffScene: React.FC<PayoffSceneProps> = ({ data }) => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: THEME.colors.bgEmerald,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 60px',
        overflow: 'hidden',
      }}
    >
      {/* Background Luminous Growth Glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(10, 22, 18, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* End Card with Takeaway and Loop Bridge */}
      <div style={{ zIndex: 10 }}>
        <EndCard
          coreLesson={data.coreLesson}
          callToAction={data.callToAction}
          loopBridge={data.loopTransitionPhrase}
          startFrame={5}
        />
      </div>
    </div>
  );
};
