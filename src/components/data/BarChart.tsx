// src/components/data/BarChart.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';
import { RipplePing } from '../motion/RipplePing';

export interface BarData {
  label: string;
  value: number;
  delta?: string;
  color?: string;
  sublabel?: string;
}

export interface BarChartProps {
  data: BarData[];
  unit?: string;
  prefix?: string;
  highlightIndex?: number;
  width?: number;
  height?: number;
  showGrid?: boolean;
  title?: string;
  decimals?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  unit = '',
  prefix = '',
  highlightIndex,
  width = 880,
  height = 540,
  showGrid = true,
  title,
  decimals,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const gridMax = Math.ceil(maxValue * 1.15);
  const barCount = data.length;

  const hasDecimals = decimals !== undefined ? decimals > 0 : data.some((d) => d.value % 1 !== 0);

  const paddingLeft = 65;
  const paddingRight = 45;
  const bottomLabelHeight = 105;
  // Generous top buffer for delta badges and titles
  const topHeaderHeight = title ? 115 : 85;
  const usableHeight = height - bottomLabelHeight - topHeaderHeight;
  const usableWidth = width - paddingLeft - paddingRight;

  const gap = barCount <= 3 ? 44 : barCount <= 5 ? 28 : 18;
  const barWidth = Math.min(145, Math.max(50, (usableWidth - (barCount - 1) * gap) / barCount));

  // Grid steps (4 horizontal guidelines)
  const gridSteps = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{ width, height, position: 'relative' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradient for Highlighted Bar */}
          <linearGradient id="barGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>

          {/* Gradient for Standard Bars */}
          <linearGradient id="barMutedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
          </linearGradient>

          {/* Warning / Climax Gradient */}
          <linearGradient id="barAlertGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="1" />
            <stop offset="100%" stopColor="#be123c" stopOpacity="0.85" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="barDropGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#38bdf8" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Optional Title */}
        {title && (
          <text
            x={width / 2}
            y={42}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="30"
            fontWeight="bold"
            fontFamily={THEME.fonts.heading}
            letterSpacing="1"
          >
            {title}
          </text>
        )}

        {/* Background Grid Lines */}
        {showGrid &&
          gridSteps.map((stepFraction, i) => {
            const gridY = topHeaderHeight + (usableHeight - usableHeight * stepFraction);
            const gridVal = (gridMax * stepFraction).toFixed(hasDecimals ? 1 : 0);
            const gridEntrance = spring({
              frame: frame - i * 3,
              fps,
              config: THEME.springs.gentle,
            });

            return (
              <g key={stepFraction} opacity={gridEntrance * 0.35}>
                <line
                  x1={paddingLeft}
                  y1={gridY}
                  x2={width - paddingRight}
                  y2={gridY}
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <text
                  x={paddingLeft - 12}
                  y={gridY + 6}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="20"
                  fontFamily={THEME.fonts.numbers}
                >
                  {prefix}{gridVal}{unit}
                </text>
              </g>
            );
          })}

        {/* Baseline X Axis */}
        <line
          x1={paddingLeft - 10}
          y1={topHeaderHeight + usableHeight}
          x2={width - paddingRight + 10}
          y2={topHeaderHeight + usableHeight}
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Data Bars */}
        {data.map((item, index) => {
          // Staggered entrance for each bar
          const entrance = spring({
            frame: frame - index * 5,
            fps,
            config: THEME.springs.bouncy,
          });

          const isHighlighted = highlightIndex === undefined || highlightIndex === index;
          const targetBarHeight = (item.value / gridMax) * usableHeight;
          const currentHeight = interpolate(entrance, [0, 1], [0, targetBarHeight]);

          const x = paddingLeft + index * (barWidth + gap);
          const y = topHeaderHeight + (usableHeight - currentHeight);

          const rawInterpolated = interpolate(entrance, [0, 1], [0, item.value]);
          const displayedValue = hasDecimals
            ? rawInterpolated.toFixed(decimals ?? 1)
            : Math.round(rawInterpolated).toLocaleString();

          // Fill source
          const barFill = item.color
            ? item.color
            : isHighlighted
            ? 'url(#barGlowGrad)'
            : 'url(#barMutedGrad)';

          // Delta tag entrance (pops in when bar finishes growing)
          const deltaEntrance = spring({
            frame: frame - (index * 5 + 14),
            fps,
            config: THEME.springs.snappy,
          });

          return (
            <g key={item.label}>
              {/* Delta Badge (Cleanly elevated to y - 62 to prevent any overlap with value text) */}
              {item.delta && (
                <g
                  transform={`translate(${x + barWidth / 2}, ${y - 62}) scale(${deltaEntrance})`}
                  opacity={deltaEntrance}
                >
                  <rect
                    x={-52}
                    y={-17}
                    width={104}
                    height={32}
                    rx={16}
                    fill={item.delta.startsWith('+') || item.delta === 'Biggest' ? '#065f46' : '#7f1d1d'}
                    stroke={item.delta.startsWith('+') || item.delta === 'Biggest' ? '#10b981' : '#ef4444'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={0}
                    y={2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={item.delta.startsWith('+') || item.delta === 'Biggest' ? '#34d399' : '#f87171'}
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily={THEME.fonts.numbers}
                  >
                    {item.delta}
                  </text>
                </g>
              )}

              {/* Animated Value Counter */}
              <text
                x={x + barWidth / 2}
                y={y - 14}
                textAnchor="middle"
                fill={isHighlighted ? '#ffffff' : '#94a3b8'}
                fontSize={isHighlighted ? '30' : '26'}
                fontWeight="900"
                fontFamily={THEME.fonts.numbers}
                opacity={Math.min(1, entrance * 1.5)}
              >
                {prefix}
                {displayedValue}
                {unit}
              </text>

              {/* Ripple Beacon for focal bar */}
              {isHighlighted && entrance > 0.95 && (
                <RipplePing
                  cx={x + barWidth / 2}
                  cy={y}
                  color="#38bdf8"
                  maxRadius={24}
                />
              )}

              {/* SVG Animated Rounded Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(0, currentHeight)}
                rx={10}
                ry={10}
                fill={barFill}
                filter={isHighlighted && entrance > 0.6 ? 'url(#barDropGlow)' : undefined}
              />

              {/* Subtle Highlighting Cap on top of bar */}
              {isHighlighted && currentHeight > 10 && (
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={barWidth - 4}
                  height={6}
                  rx={3}
                  fill="#ffffff"
                  opacity={0.4}
                />
              )}

              {/* X-Axis Main Label */}
              <text
                x={x + barWidth / 2}
                y={topHeaderHeight + usableHeight + 36}
                textAnchor="middle"
                fill={isHighlighted ? '#ffffff' : '#94a3b8'}
                fontSize="25"
                fontWeight="800"
                fontFamily={THEME.fonts.body}
              >
                {item.label}
              </text>

              {/* Optional Sublabel */}
              {item.sublabel && (
                <text
                  x={x + barWidth / 2}
                  y={topHeaderHeight + usableHeight + 68}
                  textAnchor="middle"
                  fill={isHighlighted ? '#e2e8f0' : '#94a3b8'}
                  fontSize="20"
                  fontWeight="600"
                  fontFamily={THEME.fonts.body}
                >
                  {item.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
