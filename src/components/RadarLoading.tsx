import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface RadarLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  label?: string;
  subLabel?: string;
  progress?: number;
  className?: string;
}

interface RadarBlip {
  id: string;
  angle: number; // degrees 0-360
  distance: number; // 0 to 1 (from center to radius)
  isHostile?: boolean;
  label?: string;
  pingTime: number;
}

export default function RadarLoading({
  size = 'md',
  label = 'در حال پویش راداری و پردازش...',
  subLabel = 'سیستم پایش و امنیت اتاق جنگ',
  progress,
  className = ''
}: RadarLoadingProps) {
  const [currentAngle, setCurrentAngle] = useState(0);

  // Tactical target blips as depicted in the tactical radar scope
  const blips: RadarBlip[] = [
    { id: 't1', angle: 65, distance: 0.58, isHostile: true, label: 'TGT-01', pingTime: 0 },
    { id: 't2', angle: 335, distance: 0.68, isHostile: false, label: 'DEF-04', pingTime: 0 },
    { id: 't3', angle: 305, distance: 0.42, isHostile: false, label: 'DEF-02', pingTime: 0 },
    { id: 't4', angle: 255, distance: 0.76, isHostile: false, label: 'PATROL', pingTime: 0 },
    { id: 't5', angle: 220, distance: 0.64, isHostile: false, label: 'SCAN', pingTime: 0 },
    { id: 't6', angle: 135, distance: 0.82, isHostile: false, label: 'OUTPOST', pingTime: 0 },
  ];

  useEffect(() => {
    let animationFrameId: number;
    let start = performance.now();

    const updateRadar = (now: number) => {
      const elapsed = (now - start) / 1000;
      // 360 degrees rotation every 2.8 seconds (clockwise)
      const deg = (elapsed * (360 / 2.8)) % 360;
      setCurrentAngle(deg);
      animationFrameId = requestAnimationFrame(updateRadar);
    };

    animationFrameId = requestAnimationFrame(updateRadar);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Compute dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 180, height: 180, stroke: 1, textScale: 0.7 };
      case 'lg':
        return { width: 380, height: 380, stroke: 1.2, textScale: 1.1 };
      case 'fullscreen':
        return { width: 420, height: 420, stroke: 1.2, textScale: 1.15 };
      case 'md':
      default:
        return { width: 290, height: 290, stroke: 1, textScale: 0.95 };
    }
  };

  const { width, height } = getDimensions();
  const radius = width / 2;
  const cx = radius;
  const cy = radius;
  const scopeRadius = radius - 24; // boundary for radar display

  // Range rings (Concentric clean rings)
  const rangeRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Outer cardinal markers: N, E, S, W
  const cardinalMarkers = [
    { angle: 0, label: 'N' },
    { angle: 90, label: 'E' },
    { angle: 180, label: 'S' },
    { angle: 270, label: 'W' },
  ];

  // Outer ticks every 15 degrees for clean minimal dial
  const tickSteps: { angle: number; isMajor: boolean }[] = [];
  for (let i = 0; i < 360; i += 15) {
    tickSteps.push({
      angle: i,
      isMajor: i % 90 === 0,
    });
  }

  const isFullscreen = size === 'fullscreen';

  const content = (
    <div
      className={`flex flex-col items-center justify-center select-none font-sans ${className}`}
      dir="rtl"
    >
      {/* Tactical Radar Display Container */}
      <div className="relative flex items-center justify-center p-2">
        {/* Ambient Phosphor Backglow */}
        <div
          className="absolute rounded-full pointer-events-none blur-3xl opacity-35 bg-emerald-500"
          style={{ width: `${width}px`, height: `${height}px` }}
        />

        {/* SVG Radar Instrument */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]"
          style={{ maxWidth: '92vw', maxHeight: '92vw' }}
        >
          <defs>
            {/* Radar Sweep Gradient Cone */}
            <radialGradient id="radarSweepGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </radialGradient>

            {/* Background Grid Pattern */}
            <pattern id="radarGridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(16, 185, 129, 0.08)"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>

          {/* 1. Radar Base Disc Background with Subtle Grid */}
          <circle
            cx={cx}
            cy={cy}
            r={scopeRadius}
            fill="#031007"
            stroke="#10b981"
            strokeWidth="2"
            strokeOpacity="0.7"
          />
          <circle
            cx={cx}
            cy={cy}
            r={scopeRadius}
            fill="url(#radarGridPattern)"
          />

          {/* 2. Concentric Range Rings (Clean, without number clutter) */}
          {rangeRings.map((ratio, idx) => {
            const r = scopeRadius * ratio;
            return (
              <circle
                key={`ring-${idx}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#10b981"
                strokeWidth={idx === rangeRings.length - 1 ? '1.5' : '0.8'}
                strokeOpacity={idx === rangeRings.length - 1 ? '0.6' : '0.25'}
                strokeDasharray={idx % 2 === 0 ? 'none' : '4 4'}
              />
            );
          })}

          {/* 3. Crosshair Axes & Diagonal Accent Marks */}
          <line
            x1={cx - scopeRadius}
            y1={cy}
            x2={cx + scopeRadius}
            y2={cy}
            stroke="#10b981"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <line
            x1={cx}
            y1={cy - scopeRadius}
            x2={cx}
            y2={cy + scopeRadius}
            stroke="#10b981"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Diagonal 45-degree Guide Lines */}
          <line
            x1={cx - scopeRadius * 0.7}
            y1={cy - scopeRadius * 0.7}
            x2={cx + scopeRadius * 0.7}
            y2={cy + scopeRadius * 0.7}
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.18"
            strokeDasharray="3 3"
          />
          <line
            x1={cx + scopeRadius * 0.7}
            y1={cy - scopeRadius * 0.7}
            x2={cx - scopeRadius * 0.7}
            y2={cy + scopeRadius * 0.7}
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.18"
            strokeDasharray="3 3"
          />

          {/* 4. Outer Clean Ticks */}
          {tickSteps.map((tick, idx) => {
            const rad = ((tick.angle - 90) * Math.PI) / 180;
            const innerR = scopeRadius - (tick.isMajor ? 7 : 4);
            const outerR = scopeRadius;
            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy + innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy + outerR * Math.sin(rad);

            return (
              <line
                key={`tick-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#34d399"
                strokeWidth={tick.isMajor ? '1.5' : '0.75'}
                strokeOpacity={tick.isMajor ? '0.85' : '0.4'}
              />
            );
          })}

          {/* 5. Clean Cardinal Direction Markers (N, E, S, W) */}
          {cardinalMarkers.map((item) => {
            const rad = ((item.angle - 90) * Math.PI) / 180;
            const textR = scopeRadius - 13;
            const tx = cx + textR * Math.cos(rad);
            const ty = cy + textR * Math.sin(rad) + 3;

            return (
              <text
                key={`cardinal-${item.label}`}
                x={tx}
                y={ty}
                fill="#34d399"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="900"
                textAnchor="middle"
                opacity="0.9"
              >
                {item.label}
              </text>
            );
          })}

          {/* 6. Sweeping Radar Beam (Rotating Cone & Leading Edge Line) */}
          <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
            {/* Sweep Pie Wedge Arc (45-degree fading trail) */}
            <path
              d={`M ${cx} ${cy} L ${cx + scopeRadius * Math.cos((-45 * Math.PI) / 180)} ${
                cy + scopeRadius * Math.sin((-45 * Math.PI) / 180)
              } A ${scopeRadius} ${scopeRadius} 0 0 1 ${cx + scopeRadius} ${cy} Z`}
              fill="url(#radarSweepGradient)"
              opacity="0.45"
            />
            {/* Bright Beam Leading Line */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + scopeRadius}
              y2={cy}
              stroke="#6ee7b7"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_#34d399]"
            />
          </g>

          {/* 6. Tactical Target Blips with Reticle Brackets */}
          {blips.map((blip) => {
            const blipRad = ((blip.angle - 90) * Math.PI) / 180;
            const bx = cx + scopeRadius * blip.distance * Math.cos(blipRad);
            const by = cy + scopeRadius * blip.distance * Math.sin(blipRad);

            // Compute angle difference to determine brightness pulse as sweep passes
            const angleDiff = ((currentAngle - blip.angle + 360) % 360);
            const isJustScanned = angleDiff < 60;
            const brightness = isJustScanned ? 1 - angleDiff / 60 : 0.25;

            const bracketSize = 8;
            const color = blip.isHostile ? '#ef4444' : '#34d399';
            const pulseGlow = blip.isHostile ? 'rgba(239, 68, 68, 0.9)' : 'rgba(52, 211, 153, 0.9)';

            return (
              <g
                key={blip.id}
                opacity={Math.max(0.35, brightness)}
                className="transition-opacity duration-300"
              >
                {/* Target Center Dot */}
                <circle
                  cx={bx}
                  cy={by}
                  r={blip.isHostile ? '3.5' : '2.5'}
                  fill={color}
                  style={{
                    filter: isJustScanned
                      ? `drop-shadow(0 0 6px ${pulseGlow})`
                      : 'none',
                  }}
                />

                {/* Radar Ping Wave on Active Scan */}
                {isJustScanned && (
                  <circle
                    cx={bx}
                    cy={by}
                    r="9"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity={brightness}
                  />
                )}

                {/* Tactical Reticle Bracket [ ] */}
                {/* Top-Left */}
                <path
                  d={`M ${bx - bracketSize} ${by - bracketSize + 3} L ${bx - bracketSize} ${by - bracketSize} L ${bx - bracketSize + 3} ${by - bracketSize}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={isJustScanned ? 1 : 0.6}
                />
                {/* Top-Right */}
                <path
                  d={`M ${bx + bracketSize - 3} ${by - bracketSize} L ${bx + bracketSize} ${by - bracketSize} L ${bx + bracketSize} ${by - bracketSize + 3}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={isJustScanned ? 1 : 0.6}
                />
                {/* Bottom-Left */}
                <path
                  d={`M ${bx - bracketSize} ${by + bracketSize - 3} L ${bx - bracketSize} ${by + bracketSize} L ${bx - bracketSize + 3} ${by + bracketSize}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={isJustScanned ? 1 : 0.6}
                />
                {/* Bottom-Right */}
                <path
                  d={`M ${bx + bracketSize - 3} ${by + bracketSize} L ${bx + bracketSize} ${by + bracketSize} L ${bx + bracketSize} ${by + bracketSize - 3}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={isJustScanned ? 1 : 0.6}
                />
              </g>
            );
          })}

          {/* 7. Center Origin Hub */}
          <circle
            cx={cx}
            cy={cy}
            r="4.5"
            fill="#022c15"
            stroke="#34d399"
            strokeWidth="1.5"
          />
          <circle cx={cx} cy={cy} r="1.5" fill="#a7f3d0" />
        </svg>
      </div>

      {/* Label & Status Text */}
      <div className="flex flex-col items-center text-center mt-3 space-y-1 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-emerald-300 font-bold text-sm sm:text-base tracking-wide drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]">
            {label}
          </h3>
        </div>
        {subLabel && (
          <p className="text-[11px] font-mono text-emerald-400/70">{subLabel}</p>
        )}

        {/* Optional Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-48 sm:w-56 mt-2 space-y-1">
            <div className="w-full h-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 overflow-hidden p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-green-300 shadow-[0_0_8px_#34d399]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-emerald-400/80 px-0.5">
              <span>پایش فعال</span>
              <span className="font-bold">{progress}٪</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#020904]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {content}
      </div>
    );
  }

  return content;
}
