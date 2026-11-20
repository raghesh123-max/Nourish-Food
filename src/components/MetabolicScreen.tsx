import React, { useState } from 'react';
import { Activity, Check, Sliders } from 'lucide-react';
import {
  ALLERGEN_EXCLUSIONS,
  CLINICAL_GOALS,
  ClinicalGoal,
  METABOLIC_SERIES,
} from '../data/clinicalData';
import { ClinicalCheckbox, VerifiedBadge } from './ClinicalVisuals';

interface MetabolicScreenProps {
  activeGoal: ClinicalGoal;
  onChangeGoal: (goal: ClinicalGoal) => void;
  dailyCalorieTarget: number;
  onChangeCalorieTarget: (kcal: number) => void;
  excludedAllergens: string[];
  onToggleAllergen: (allergen: string) => void;
}

export const MetabolicScreen: React.FC<MetabolicScreenProps> = ({
  activeGoal,
  onChangeGoal,
  dailyCalorieTarget,
  onChangeCalorieTarget,
  excludedAllergens,
  onToggleAllergen,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(METABOLIC_SERIES.length - 1);
  const [metricView, setMetricView] = useState<'glucose' | 'protein'>('glucose');
  const [savedNotice, setSavedNotice] = useState(false);

  const selectedPoint = METABOLIC_SERIES[selectedDayIdx];

  const avgPeakGlucose = Math.round(
    METABOLIC_SERIES.reduce((s, d) => s + d.peakGlucoseMgDl, 0) / METABOLIC_SERIES.length
  );
  const avgGlycemicLoad = Math.round(
    METABOLIC_SERIES.reduce((s, d) => s + d.glycemicLoad, 0) / METABOLIC_SERIES.length
  );
  const avgProtein = Math.round(
    METABOLIC_SERIES.reduce((s, d) => s + d.proteinGrams, 0) / METABOLIC_SERIES.length
  );
  const avgFiber = Math.round(
    METABOLIC_SERIES.reduce((s, d) => s + d.fiberGrams, 0) / METABOLIC_SERIES.length
  );

  // SVG Chart Geometry
  const chartW = 560;
  const chartH = 210;
  const padX = 36;
  const padY = 24;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const getY = (val: number) => {
    if (metricView === 'glucose') {
      const min = 75;
      const max = 140;
      return padY + plotH - ((val - min) / (max - min)) * plotH;
    }
    const min = 80;
    const max = 145;
    return padY + plotH - ((val - min) / (max - min)) * plotH;
  };

  const getX = (idx: number) =>
    padX + (idx / Math.max(METABOLIC_SERIES.length - 1, 1)) * plotW;

  const primaryPoints = METABOLIC_SERIES.map((pt, i) => ({
    x: getX(i),
    y: getY(metricView === 'glucose' ? pt.peakGlucoseMgDl : pt.proteinGrams),
    val: metricView === 'glucose' ? pt.peakGlucoseMgDl : pt.proteinGrams,
  }));

  const polylineStr = primaryPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const areaStr = `${padX},${padY + plotH} ${polylineStr} ${padX + plotW},${padY + plotH}`;
  const thresholdY = getY(metricView === 'glucose' ? 125 : 118);

  return (
    <div className="space-y-8">
      {/* Page Title & Clinical Biomarker KPI Row */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#135D43]">7-Day Metabolic Telemetry</p>
            <h1 className="font-display text-2xl sm:text-[28px] font-bold text-[#0E3E2D] leading-tight mt-0.5">
              Glycemic Stability &amp; Protocol Calibration
            </h1>
          </div>
          <VerifiedBadge status="estimated" label="CGM & DIET LOG SYNC" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#4B5563]">Avg Post-Meal Peak</span>
              <VerifiedBadge status="verified" label="IN RANGE" compact />
            </div>
            <p className="font-display text-3xl font-bold text-[#0E3E2D] tabular-nums">
              {avgPeakGlucose}
              <span className="text-sm font-medium text-[#4B5563] ml-1">mg/dL</span>
            </p>
            <p className="text-xs text-[#4B5563]">Target ceiling &lt; 130 mg/dL (2h post-prandial)</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#4B5563]">Mean Daily Protein</span>
              <VerifiedBadge status="verified" label="99% TARGET" compact />
            </div>
            <p className="font-display text-3xl font-bold text-[#0E3E2D] tabular-nums">
              {avgProtein}
              <span className="text-sm font-medium text-[#4B5563] ml-1">g / day</span>
            </p>
            <p className="text-xs text-[#4B5563]">Assayed bioavailable protein across bowls</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#4B5563]">Daily Glycemic Load</span>
              <VerifiedBadge status="verified" label="LOW GL" compact />
            </div>
            <p className="font-display text-3xl font-bold text-[#0E3E2D] tabular-nums">
              {avgGlycemicLoad}
              <span className="text-sm font-medium text-[#4B5563] ml-1">/ 45 cap</span>
            </p>
            <p className="text-xs text-[#4B5563]">Measured via NABL starch digestibility assays</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#4B5563]">Projected 90d HbA1c</span>
              <VerifiedBadge status="estimated" label="ESTIMATED" compact />
            </div>
            <p className="font-display text-3xl font-bold text-[#0E3E2D] tabular-nums">
              5.3
              <span className="text-sm font-medium text-[#4B5563] ml-1">%</span>
            </p>
            <p className="text-xs text-[#4B5563]">Mean soluble &amp; insoluble fiber {avgFiber}g/day</p>
          </div>
        </div>
      </section>

      {/* Main Split: Interactive Chart + Selected Day Readout | Protocol Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive 7-Day Trend Chart */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E4DC] p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#135D43]" />
              <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
                7-Day Response Curve
              </h2>
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-[#F4F1EA]">
              <button
                type="button"
                onClick={() => setMetricView('glucose')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  metricView === 'glucose'
                    ? 'bg-[#135D43] text-white'
                    : 'text-[#4B5563] hover:text-[#1F2937]'
                }`}
              >
                Peak Glucose (mg/dL)
              </button>
              <button
                type="button"
                onClick={() => setMetricView('protein')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  metricView === 'protein'
                    ? 'bg-[#135D43] text-white'
                    : 'text-[#4B5563] hover:text-[#1F2937]'
                }`}
              >
                Protein Intake (g)
              </button>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full min-w-[420px] h-auto"
              role="img"
              aria-label="7-day clinical metabolic trend chart"
            >
              <defs>
                <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#135D43" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#135D43" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Clinical Reference Threshold Line */}
              <line
                x1={padX}
                x2={chartW - padX}
                y1={thresholdY}
                y2={thresholdY}
                stroke="#D95D39"
                strokeWidth="1.25"
                strokeDasharray="4 4"
              />
              <text
                x={chartW - padX}
                y={thresholdY - 6}
                textAnchor="end"
                fill="#A73918"
                fontSize="10"
                fontWeight="600"
              >
                {metricView === 'glucose' ? '125 mg/dL Optimal Ceiling' : '118g Daily Protein Target'}
              </text>

              {/* Baseline Axis */}
              <line
                x1={padX}
                x2={chartW - padX}
                y1={padY + plotH}
                y2={padY + plotH}
                stroke="#E8E4DC"
                strokeWidth="1"
              />

              {/* Area & Curve */}
              <polygon points={areaStr} fill="url(#emeraldArea)" />
              <polyline
                fill="none"
                stroke="#135D43"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Interactive Data Points */}
              {primaryPoints.map((pt, i) => {
                const isSelected = i === selectedDayIdx;
                const dayObj = METABOLIC_SERIES[i];
                return (
                  <g
                    key={dayObj.day}
                    className="cursor-pointer"
                    onClick={() => setSelectedDayIdx(i)}
                  >
                    <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />
                    {isSelected && (
                      <circle cx={pt.x} cy={pt.y} r={9} fill="#135D43" fillOpacity="0.14" />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 5.5 : 4}
                      fill={isSelected ? '#D95D39' : '#FFFFFF'}
                      stroke={isSelected ? '#D95D39' : '#135D43'}
                      strokeWidth="2.2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      fill={isSelected ? '#0E3E2D' : '#4B5563'}
                      fontSize="11"
                      fontWeight={isSelected ? '700' : '600'}
                    >
                      {pt.val}
                    </text>
                    <text
                      x={pt.x}
                      y={chartH - 4}
                      textAnchor="middle"
                      fill={isSelected ? '#0E3E2D' : '#4B5563'}
                      fontSize="11"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {dayObj.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Day Detailed Clinical Readout */}
          <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
            <div>
              <p className="text-[11px] font-semibold text-[#4B5563]">Selected Day</p>
              <p className="font-display text-base font-bold text-[#0E3E2D] mt-0.5">
                {selectedPoint.day}, {selectedPoint.dateLabel}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#4B5563]">Fasting / Peak</p>
              <p className="font-display text-base font-bold text-[#1F2937] mt-0.5">
                {selectedPoint.fastingGlucoseMgDl} / {selectedPoint.peakGlucoseMgDl}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#4B5563]">Protein Delivered</p>
              <p className="font-display text-base font-bold text-[#135D43] mt-0.5">
                {selectedPoint.proteinGrams}g / {selectedPoint.proteinTarget}g
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#4B5563]">GL · Fiber</p>
              <p className="font-display text-base font-bold text-[#1F2937] mt-0.5">
                GL {selectedPoint.glycemicLoad} · {selectedPoint.fiberGrams}g
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Clinical Protocol & Allergen Configurator */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E4DC] p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#135D43]" />
            <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
              Clinical Goal &amp; Exclusions
            </h2>
          </div>

          {/* Radio-style Goal Selector (spec: Emerald #135D43 fill with white dot) */}
          <div className="space-y-2.5" role="radiogroup" aria-label="Clinical dietary goal">
            {CLINICAL_GOALS.map((goal) => {
              const selected = activeGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    onChangeGoal(goal.id);
                    setSavedNotice(true);
                    setTimeout(() => setSavedNotice(false), 2000);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#EBF3F0]/65 border-[#135D43]'
                      : 'bg-white border-[#E8E4DC] hover:border-[#135D43]/40'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      selected
                        ? 'bg-[#135D43] border border-[#135D43]'
                        : 'bg-white border border-[#9CA3AF]'
                    }`}
                  >
                    {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0E3E2D]">{goal.id}</p>
                    <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">{goal.summary}</p>
                    <p className="text-[11px] font-semibold text-[#135D43] mt-1">
                      {goal.proteinRatio}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Daily Calorie Ceiling Slider */}
          <div className="space-y-2.5 pt-3 border-t border-[#E8E4DC]">
            <div className="flex items-center justify-between">
              <label htmlFor="calorie-target" className="text-sm font-semibold text-[#1F2937]">
                Daily Calorie Target
              </label>
              <span className="font-display text-lg font-bold text-[#0E3E2D] tabular-nums">
                {dailyCalorieTarget} kcal
              </span>
            </div>
            <input
              id="calorie-target"
              type="range"
              min={1350}
              max={2600}
              step={50}
              value={dailyCalorieTarget}
              onChange={(e) => onChangeCalorieTarget(Number(e.target.value))}
              className="w-full accent-[#135D43] cursor-pointer h-2 bg-[#F4F1EA] rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-[#9CA3AF] tabular-nums">
              <span>1,350 kcal</span>
              <span>1,850 kcal</span>
              <span>2,600 kcal</span>
            </div>
          </div>

          {/* Allergen Exclusions */}
          <div className="space-y-2.5 pt-3 border-t border-[#E8E4DC]">
            <p className="text-sm font-semibold text-[#1F2937]">Strict Kitchen Exclusions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALLERGEN_EXCLUSIONS.map((ex) => (
                <ClinicalCheckbox
                  key={ex}
                  checked={excludedAllergens.includes(ex)}
                  onChange={() => onToggleAllergen(ex)}
                  label={ex}
                />
              ))}
            </div>
          </div>

          {savedNotice && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0E3E2D] bg-[#EBF3F0] border border-[#135D43]/20 rounded-xl px-3.5 py-2.5">
              <Check className="w-4 h-4 text-[#135D43]" />
              <span>Protocol updated — menu &amp; daily targets recalibrated.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
