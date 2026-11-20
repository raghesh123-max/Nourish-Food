import React, { useState } from 'react';
import { ShieldCheck, Info, Utensils, Check } from 'lucide-react';

interface VerifiedBadgeProps {
  status: 'verified' | 'estimated';
  label: string;
  compact?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ status, label, compact = false }) => {
  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-[#EBF3F0] border border-[#135D43]/20 text-[#0E3E2D] font-bold uppercase tracking-[0.02em] whitespace-nowrap shrink-0 ${
          compact ? 'px-2 py-0.5 text-[10px] leading-3' : 'px-2.5 py-1 text-[11px] leading-[14px]'
        }`}
      >
        <ShieldCheck className={compact ? 'w-3 h-3 text-[#135D43]' : 'w-3.5 h-3.5 text-[#135D43]'} strokeWidth={2.2} />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[#F4F1EA] border border-[#E8E4DC] text-[#4B5563] font-bold uppercase tracking-[0.02em] whitespace-nowrap shrink-0 ${
        compact ? 'px-2 py-0.5 text-[10px] leading-3' : 'px-2.5 py-1 text-[11px] leading-[14px]'
      }`}
    >
      <Info className={compact ? 'w-3 h-3 text-[#4B5563]' : 'w-3.5 h-3.5 text-[#4B5563]'} strokeWidth={2} />
      <span>{label}</span>
    </span>
  );
};

interface MacroSplitBarProps {
  proteinG: number;
  carbsG: number;
  fatsG: number;
  showPillLegend?: boolean;
}

export const MacroSplitBar: React.FC<MacroSplitBarProps> = ({
  proteinG,
  carbsG,
  fatsG,
  showPillLegend = true,
}) => {
  const totalGrams = Math.max(proteinG + carbsG + fatsG, 1);
  const pPct = (proteinG / totalGrams) * 100;
  const cPct = (carbsG / totalGrams) * 100;
  const fPct = 100 - pPct - cPct;

  return (
    <div className="space-y-2">
      {/* 4px segmented horizontal bar per Clinical Culinary Vitality spec */}
      <div
        className="w-full h-1 rounded-full bg-[#F4F1EA] overflow-hidden flex gap-[2px]"
        role="img"
        aria-label={`Macro split: ${proteinG}g protein, ${carbsG}g carbs, ${fatsG}g healthy fats`}
      >
        <div
          className="h-full bg-[#135D43] rounded-l-full"
          style={{ width: `${pPct}%` }}
        />
        <div
          className="h-full bg-[#D95D39]"
          style={{ width: `${cPct}%` }}
        />
        <div
          className="h-full bg-[#C88A2E] rounded-r-full"
          style={{ width: `${fPct}%` }}
        />
      </div>

      {showPillLegend && (
        <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-[#FBF9F5] border border-[#E8E4DC] px-2.5 py-1 text-[11px] font-semibold text-[#4B5563] tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#135D43] shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-[#1F2937]">{proteinG}g</strong> Pro
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D95D39] shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-[#1F2937]">{carbsG}g</strong> Carb
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C88A2E] shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-[#1F2937]">{fatsG}g</strong> Fat
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

interface MealImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const MealImage: React.FC<MealImageProps> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F1EA] to-[#EBF3F0] text-[#135D43] p-4 text-center ${className}`}
      >
        <Utensils className="w-7 h-7 mb-1.5 opacity-70" />
        <span className="text-xs font-medium text-[#4B5563] line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};

interface CalorieRingProps {
  current: number;
  target: number;
  size?: number;
}

export const CalorieRing: React.FC<CalorieRingProps> = ({ current, target, size = 128 }) => {
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(current / Math.max(target, 1), 1);
  const dashOffset = circumference * (1 - ratio);
  const overTarget = current > target;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F4F1EA"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={overTarget ? '#D95D39' : '#135D43'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-2xl font-bold text-[#0E3E2D] tabular-nums leading-none">
          {current}
        </span>
        <span className="text-[11px] font-semibold text-[#4B5563] tabular-nums mt-1">
          of {target} kcal
        </span>
      </div>
    </div>
  );
};

interface ClinicalCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  sublabel?: string;
  rightText?: string;
}

export const ClinicalCheckbox: React.FC<ClinicalCheckboxProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  rightText,
}) => {
  return (
    <button
      type="button"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-colors min-h-[48px] ${
        checked
          ? 'bg-[#EBF3F0]/60 border-[#135D43]/40'
          : 'bg-white border-[#E8E4DC] hover:border-[#135D43]/30'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
            checked
              ? 'bg-[#135D43] border border-[#135D43] text-white'
              : 'bg-white border border-[#9CA3AF]'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1F2937] leading-snug">{label}</p>
          {sublabel && <p className="text-xs text-[#4B5563] mt-0.5">{sublabel}</p>}
        </div>
      </div>
      {rightText && (
        <span className="text-xs font-semibold text-[#0E3E2D] tabular-nums whitespace-nowrap shrink-0">
          {rightText}
        </span>
      )}
    </button>
  );
};
