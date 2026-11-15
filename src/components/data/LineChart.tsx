// src/components/data/LineChart.tsx
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { evolvePath, getLength, getPointAtLength } from '@remotion/paths';
import { THEME } from '../../styles/theme';
import { RipplePing } from '../motion/RipplePing';

export interface LinePoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LinePoint[];
  width?: number;
  height?: number;
  color?: string;
  prefix?: string;
  unit?: string;
  title?: string;
  curved?: boolean;
  showArea?: boolean;
  showGrid?: boolean;
  delayFrames?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 860,
  height = 540,
  color = '#38bdf8',
  prefix = '',
  unit = '',
  title,
  curved = true,
  showArea = true,
  showGrid = true,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const paddingLeft = 70;
  const paddingRight = 50;
  const bottomLabelHeight = 88;
  const topHeaderHeight = title ? 85 : 55;

  const usableWidth = width - paddingLeft - paddingRight;
  const usableHeight = height - bottomLabelHeight - topHeaderHeight;
  const baselineY = topHeaderHeight + usableHeight;

  const minValue = 0;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const gridMax = Math.ceil(maxValue * 1.15);

  // Map data points to SVG coordinates
  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = paddingLeft + (i / Math.max(1, data.length - 1)) * usableWidth;
      const normalizedValue = (d.value - minValue) / (gridMax - minValue);
      const y = baselineY - normalizedValue * usableHeight;
      return { x, y, ...d };
    });
  }, [data, minValue, gridMax, paddingLeft, usableWidth, baselineY, usableHeight]);

  // Construct SVG Path String (smooth bezier or polyline)
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    if (!curved) {
      return points.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '');
    }

    // Smooth Bezier cubic interpolation
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points, curved]);

  // Area under the curve path (for gradient fill)
  const areaD = useMemo(() => {
    if (points.length === 0 || !pathD) return '';
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${pathD} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
  }, [pathD, points, baselineY]);

  // Calculate path metrics
  const totalLength = useMemo(() => {
    return pathD ? getLength(pathD) : 0;
  }, [pathD]);

  // Overall drawing spring animation
  const progressSpring = spring({
    frame: frame - delayFrames,
    fps,
    config: {
      damping: 18,
      mass: 0.9,
      stiffness: 70,
    },
  });

  const progress = Math.min(1, Math.max(0, progressSpring));
  const evolved = pathD ? evolvePath(progress, pathD) : { strokeDasharray: '0', strokeDashoffset: 0 };

  // Calculate the current active tip location for the leading glowing dot
  const currentTip = useMemo(() => {
    if (!pathD || totalLength === 0) return { x: 0, y: 0 };
    const currentLen = Math.min(totalLength, Math.max(0.1, progress * totalLength));
    const pt = getPointAtLength(pathD, currentLen);
    return pt ?? { x: 0, y: 0 };
  }, [pathD, totalLength, progress]);

  // Current interpolated value at the tip
  const currentVal = interpolate(progress, [0, 1], [data[0]?.value || 0, data[data.length - 1]?.value || 0]);

  // Unique ID for SVG gradients/clips
  const chartId = useMemo(() => `chart-${Math.random().toString(36).substring(2, 9)}`, []);

  // Grid steps (4 horizontal dashed reference lines)
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
          {/* Vertical Area Gradient */}
          <linearGradient id={`areaGrad-${chartId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="85%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>

          {/* Stroke Glow Filter */}
          <filter id={`lineGlow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={color} floodOpacity="0.6" />
          </filter>

          {/* Clip path for expanding area under curve */}
          <clipPath id={`areaClip-${chartId}`}>
            <rect
              x={paddingLeft}
              y={topHeaderHeight - 20}
              width={usableWidth * progress}
              height={usableHeight + 40}
            />
          </clipPath>
        </defs>

        {/* Chart Title */}
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
            const gridVal = Math.round(gridMax * stepFraction);
            const gridEntrance = spring({
              frame: frame - delayFrames - i * 2,
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
                  x={paddingLeft - 14}
                  y={gridY + 6}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="20"
                  fontFamily={THEME.fonts.numbers}
                >
                  {prefix}{gridVal.toLocaleString()}{unit}
                </text>
              </g>
            );
          })}

        {/* Baseline Axis */}
        <line
          x1={paddingLeft - 10}
          y1={baselineY}
          x2={width - paddingRight + 10}
          y2={baselineY}
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Area Gradient Under Curve */}
        {showArea && areaD && (
          <path
            d={areaD}
            fill={`url(#areaGrad-${chartId})`}
            clipPath={`url(#areaClip-${chartId})`}
          />
        )}

        {/* Main Evolving Animated Stroke */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
            filter={`url(#lineGlow-${chartId})`}
          />
        )}

        {/* Individual Data Points / Vertices */}
        {points.map((pt, idx) => {
          const pointFraction = idx / Math.max(1, points.length - 1);
          const hasReached = progress >= pointFraction * 0.95;
          const dotEntrance = spring({
            frame: frame - delayFrames - Math.round(pointFraction * 20),
            fps,
            config: THEME.springs.bouncy,
          });

          return (
            <g key={pt.label} opacity={hasReached ? 1 : 0}>
              {/* Outer Pulse Ring */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={10 * dotEntrance}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity={0.4}
              />
              {/* Inner Solid Vertex Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6 * dotEntrance}
                fill="#ffffff"
                stroke={color}
                strokeWidth="2.5"
              />

              {/* X Axis Label */}
              <text
                x={pt.x}
                y={baselineY + 36}
                textAnchor="middle"
                fill={hasReached ? '#ffffff' : '#94a3b8'}
                fontSize="25"
                fontWeight="700"
                fontFamily={THEME.fonts.body}
              >
                {pt.label}
              </text>
            </g>
          );
        })}

        {/* Active Leading Tracker Beacon (Glows at current line tip) */}
        {progress > 0.02 && progress < 0.99 && (
          <g transform={`translate(${currentTip.x}, ${currentTip.y})`}>
            {/* Glowing Beacon Rings */}
            <circle r={14} fill={color} opacity={0.25} />
            <circle r={8} fill={color} opacity={0.6} />
            <circle r={4} fill="#ffffff" />

            {/* Floating Live Value Badge */}
            <g transform="translate(0, -34)">
              <rect
                x={-50}
                y={-16}
                width={100}
                height={30}
                rx={15}
                fill="#0f172a"
                stroke={color}
                strokeWidth="1.5"
              />
              <text
                x={0}
                y={3}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="18"
                fontWeight="bold"
                fontFamily={THEME.fonts.numbers}
              >
                {prefix}{Math.round(currentVal).toLocaleString()}{unit}
              </text>
            </g>
          </g>
        )}

        {/* Final Value Callout & Living Beacon Ping */}
        {progress >= 0.95 && points.length > 0 && (
          <g>
            <RipplePing
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              color={color}
              maxRadius={32}
            />
            <g
              transform={`translate(${points[points.length - 1].x}, ${points[points.length - 1].y - 38})`}
            >
              <rect
                x={-62}
                y={-20}
                width={124}
                height={38}
                rx={19}
                fill="#0284c7"
                stroke="#38bdf8"
                strokeWidth="2"
                filter={`url(#lineGlow-${chartId})`}
              />
              <text
                x={0}
                y={2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="22"
                fontWeight="bold"
                fontFamily={THEME.fonts.numbers}
              >
                {prefix}
                {points[points.length - 1].value % 1 !== 0
                  ? points[points.length - 1].value.toFixed(1)
                  : points[points.length - 1].value.toLocaleString()}
                {unit}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
