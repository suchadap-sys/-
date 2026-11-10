import React, { useState } from 'react';
import { RATING_SCALE } from '../data/questions';

interface PieDonutChartProps {
  scoreBreakdown: Record<number, number>;
  scorePercentages: Record<number, number>;
  totalVotes: number;
  overallMean: number;
}

export const PieDonutChart: React.FC<PieDonutChartProps> = ({
  scoreBreakdown,
  scorePercentages,
  totalVotes,
  overallMean
}) => {
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  // Palette with accessible high-contrast colors matching rating scale
  const sliceColors: Record<number, { stroke: string; bg: string; text: string }> = {
    5: { stroke: '#4f46e5', bg: 'bg-indigo-600', text: 'text-indigo-600 dark:text-indigo-400' }, // Indigo (มากที่สุด)
    4: { stroke: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }, // Emerald (มาก)
    3: { stroke: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' }, // Amber (ปานกลาง)
    2: { stroke: '#f97316', bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' }, // Orange (น้อย)
    1: { stroke: '#ef4444', bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' }, // Rose (น้อยที่สุด)
  };

  const size = 220;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute slice offsets
  const scores = [5, 4, 3, 2, 1];
  let accumulatedPercent = 0;

  const slices = scores.map((score) => {
    const count = scoreBreakdown[score] || 0;
    const percent = totalVotes > 0 ? (count / totalVotes) : 0;
    const dashLength = percent * circumference;
    const strokeDashoffset = -(accumulatedPercent * circumference);
    accumulatedPercent += percent;

    return {
      score,
      count,
      percent: scorePercentages[score] || 0,
      fraction: percent,
      dashLength,
      strokeDashoffset,
      color: sliceColors[score]
    };
  });

  const activeSlice = hoveredScore ? slices.find(s => s.score === hoveredScore) : null;

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* SVG Donut / Pie Chart */}
      <div className="relative my-2 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Slices */}
          {totalVotes > 0 &&
            slices.map((slice) => {
              if (slice.count === 0) return null;
              const isHovered = hoveredScore === slice.score;
              return (
                <circle
                  key={slice.score}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color.stroke}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={`${slice.dashLength} ${circumference - slice.dashLength}`}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  style={{ transformOrigin: 'center' }}
                  onMouseEnter={() => setHoveredScore(slice.score)}
                  onMouseLeave={() => setHoveredScore(null)}
                />
              );
            })}
        </svg>

        {/* Center Information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {activeSlice ? (
            <div className="animate-fadeIn">
              <span className="text-xl sm:text-2xl font-extrabold font-mono-nums text-slate-900 dark:text-white leading-tight">
                {activeSlice.percent}%
              </span>
              <p className={`text-xs font-semibold ${activeSlice.color.text} leading-tight`}>
                {activeSlice.score} ดาว ({activeSlice.count} ครั้ง)
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {RATING_SCALE.find(r => r.score === activeSlice.score)?.label}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono-nums text-slate-900 dark:text-white leading-tight">
                {overallMean > 0 ? overallMean.toFixed(2) : '0.00'}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                คะแนนเฉลี่ย
              </p>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono-nums">
                {totalVotes} คำตอบ
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend with interactive hover indicators */}
      <div className="w-full mt-4 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {slices.map((slice) => {
          const scaleInfo = RATING_SCALE.find(r => r.score === slice.score);
          const isHovered = hoveredScore === slice.score;
          return (
            <div
              key={slice.score}
              onMouseEnter={() => setHoveredScore(slice.score)}
              onMouseLeave={() => setHoveredScore(null)}
              className={`flex items-center justify-between text-xs p-1.5 rounded-xl cursor-pointer transition-colors ${
                isHovered
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 transition-transform"
                  style={{
                    backgroundColor: slice.color.stroke,
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                  }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {scaleInfo?.emoji} {slice.score} ดาว ({scaleInfo?.label})
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono-nums">
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {slice.count} ครั้ง
                </span>
                <span className="text-slate-400 text-[11px] w-12 text-right">
                  ({slice.percent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
