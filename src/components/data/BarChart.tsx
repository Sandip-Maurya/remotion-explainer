// src/components/data/BarChart.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../../styles/theme';

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
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  unit = '',
  prefix = '',
  highlightIndex,
  width = 860,
  height = 540,
  showGrid = true,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  // Round up max for clean grid ticks
  const gridMax = Math.ceil(maxValue * 1.15);
  const barCount = data.length;

  const paddingLeft = 60;
  const paddingRight = 40;
  const bottomLabelHeight = 80;
  const topHeaderHeight = title ? 70 : 50;
  const usableHeight = height - bottomLabelHeight - topHeaderHeight;
  const usableWidth = width - paddingLeft - paddingRight;

  const gap = barCount <= 3 ? 40 : barCount <= 5 ? 24 : 16;
  const barWidth = Math.min(140, Math.max(50, (usableWidth - (barCount - 1) * gap) / barCount));

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
            x={paddingLeft}
            y={36}
            fill="#ffffff"
            fontSize="30"
            fontWeight="bold"
            fontFamily={THEME.fonts.heading}
          >
            {title}
          </text>
        )}

        {/* Background Grid Lines */}
        {showGrid &&
          gridSteps.map((stepFraction, i) => {
            const gridY = topHeaderHeight + (usableHeight - usableHeight * stepFraction);
            const gridVal = Math.round(gridMax * stepFraction);
            const gridEntrance = spring({
              frame: frame - i * 3,
              fps,
              config: THEME.springs.gentle,
            });

            return (
              <g key={stepFraction} opacity={gridEntrance * 0.4}>
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
                  y={gridY + 5}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="18"
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

          const displayedValue = Math.round(interpolate(entrance, [0, 1], [0, item.value]));

          // Fill source
          const barFill = item.color
            ? item.color
            : isHighlighted
            ? 'url(#barGlowGrad)'
            : 'url(#barMutedGrad)';

          // Delta tag entrance (pops in when bar finishes growing)
          const deltaEntrance = spring({
            frame: frame - (index * 5 + 12),
            fps,
            config: THEME.springs.snappy,
          });

          return (
            <g key={item.label}>
              {/* Animated Value Counter */}
              <text
                x={x + barWidth / 2}
                y={y - 12}
                textAnchor="middle"
                fill={isHighlighted ? '#ffffff' : '#94a3b8'}
                fontSize={isHighlighted ? '28' : '24'}
                fontWeight="bold"
                fontFamily={THEME.fonts.numbers}
                opacity={Math.min(1, entrance * 1.5)}
              >
                {prefix}
                {displayedValue.toLocaleString()}
                {unit}
              </text>

              {/* Delta Badge (if present, e.g. "+35%") */}
              {item.delta && (
                <g
                  transform={`translate(${x + barWidth / 2}, ${y - 44}) scale(${deltaEntrance})`}
                  opacity={deltaEntrance}
                >
                  <rect
                    x={-45}
                    y={-18}
                    width={90}
                    height={28}
                    rx={14}
                    fill={item.delta.startsWith('+') ? '#065f46' : '#7f1d1d'}
                    stroke={item.delta.startsWith('+') ? '#10b981' : '#ef4444'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={0}
                    y={2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={item.delta.startsWith('+') ? '#34d399' : '#f87171'}
                    fontSize="16"
                    fontWeight="bold"
                    fontFamily={THEME.fonts.numbers}
                  >
                    {item.delta}
                  </text>
                </g>
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
                y={topHeaderHeight + usableHeight + 30}
                textAnchor="middle"
                fill={isHighlighted ? '#ffffff' : '#94a3b8'}
                fontSize="22"
                fontWeight="600"
                fontFamily={THEME.fonts.body}
              >
                {item.label}
              </text>

              {/* Optional Sublabel */}
              {item.sublabel && (
                <text
                  x={x + barWidth / 2}
                  y={topHeaderHeight + usableHeight + 52}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="16"
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
