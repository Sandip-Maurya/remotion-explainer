// src/components/graphics/StepTimeline.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

export interface TimelineStep {
  stepNumber: number;
  title: string;
  description: string;
  badgeColor?: string;
  isAlert?: boolean;
}

export interface StepTimelineProps {
  steps: TimelineStep[];
  width?: number;
  activeStepIndex?: number;
  staggerDelay?: number;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({
  steps,
  width = 860,
  activeStepIndex = steps.length - 1,
  staggerDelay = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ width, position: 'relative', display: 'flex', flexDirection: 'column', gap: 36 }}>
      {steps.map((step, index) => {
        // Step entrance spring
        const entrance = spring({
          frame: frame - index * staggerDelay,
          fps,
          config: THEME.springs.bouncy,
        });

        // Connector line drawing progress towards next step
        const isLast = index === steps.length - 1;
        const lineProgress = isLast
          ? 0
          : spring({
              frame: frame - index * staggerDelay - 8,
              fps,
              config: THEME.springs.snappy,
            });

        const isCurrent = activeStepIndex === index;
        const defaultColor = step.isAlert ? THEME.colors.accentRed : THEME.colors.accentBlue;
        const badgeColor = step.badgeColor || defaultColor;

        const translateX = interpolate(entrance, [0, 1], [-40, 0]);
        const opacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <div
            key={step.stepNumber}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 28,
              position: 'relative',
              opacity,
              transform: `translateX(${translateX}px)`,
            }}
          >
            {/* Left Column: Numbered Badge & Connector Spine */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge Circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: isCurrent ? badgeColor : '#1e293b',
                  border: `3px solid ${badgeColor}`,
                  boxShadow: isCurrent ? `0 0 24px ${badgeColor}80` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCurrent ? '#070a13' : '#ffffff',
                  fontFamily: THEME.fonts.heading,
                  fontSize: 24,
                  fontWeight: 900,
                  transform: `scale(${entrance})`,
                  zIndex: 2,
                }}
              >
                {step.stepNumber}
              </div>

              {/* Connecting Vertical Line to Next Step */}
              {!isLast && (
                <div
                  style={{
                    width: 4,
                    height: 80,
                    backgroundColor: '#1e293b',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    marginTop: 8,
                    marginBottom: -8,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${Math.min(100, lineProgress * 100)}%`,
                      backgroundColor: badgeColor,
                      boxShadow: `0 0 8px ${badgeColor}`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Step Content Card */}
            <div
              style={{
                flex: 1,
                backgroundColor: isCurrent ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.5)',
                border: `1.5px solid ${isCurrent ? badgeColor : '#334155'}`,
                borderRadius: 16,
                padding: '18px 24px',
                boxShadow: isCurrent ? `0 8px 30px rgba(0,0,0,0.5)` : 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontFamily: THEME.fonts.heading,
                  fontSize: 26,
                  fontWeight: 800,
                  color: isCurrent ? '#ffffff' : '#cbd5e1',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{step.title}</span>
                {step.isAlert && (
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    CRITICAL
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.body,
                  fontSize: 20,
                  lineHeight: 1.4,
                  color: isCurrent ? '#94a3b8' : '#64748b',
                }}
              >
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
