import React, { useMemo, useState } from 'react';
import {
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  PackageCheck,
  X,
  Check,
  ShoppingBag,
} from 'lucide-react';
import {
  CLINICAL_MEALS,
  ClinicalMeal,
  DaySchedule,
  MealSlotType,
} from '../data/clinicalData';
import {
  CalorieRing,
  ClinicalCheckbox,
  MacroSplitBar,
  MealImage,
  VerifiedBadge,
} from './ClinicalVisuals';

interface DailyPlanScreenProps {
  weekSchedule: DaySchedule[];
  selectedDayKey: string;
  onSelectDay: (dayKey: string) => void;
  dailyCalorieTarget: number;
  activeHub: string;
  onAssignMealToSlot: (dayKey: string, slot: MealSlotType, mealId: string | null) => void;
  onInspectMeal: (meal: ClinicalMeal) => void;
  onQueueDayToBag: (meals: ClinicalMeal[], dayLabel: string) => void;
}

const SLOT_ORDER: { slot: MealSlotType; window: string }[] = [
  { slot: 'Breakfast', window: '07:45 – 08:30 AM' },
  { slot: 'Lunch', window: '12:30 – 01:15 PM' },
  { slot: 'Afternoon Recovery', window: '04:15 – 04:45 PM' },
  { slot: 'Dinner', window: '07:30 – 08:15 PM' },
];

export const DailyPlanScreen: React.FC<DailyPlanScreenProps> = ({
  weekSchedule,
  selectedDayKey,
  onSelectDay,
  dailyCalorieTarget,
  activeHub,
  onAssignMealToSlot,
  onInspectMeal,
  onQueueDayToBag,
}) => {
  const [swappingSlot, setSwappingSlot] = useState<MealSlotType | null>(null);
  const [insulatedTiffin, setInsulatedTiffin] = useState(true);
  const [lowOilPrep, setLowOilPrep] = useState(true);
  const [cutleryFree, setCutleryFree] = useState(true);

  const activeDay = useMemo(
    () => weekSchedule.find((d) => d.dayKey === selectedDayKey) || weekSchedule[0],
    [weekSchedule, selectedDayKey]
  );

  const mealById = useMemo(() => {
    const map: Record<string, ClinicalMeal> = {};
    for (const m of CLINICAL_MEALS) map[m.id] = m;
    return map;
  }, []);

  const scheduledMeals = useMemo(() => {
    const list: ClinicalMeal[] = [];
    for (const { slot } of SLOT_ORDER) {
      const id = activeDay.slots[slot];
      if (id && mealById[id]) list.push(mealById[id]);
    }
    return list;
  }, [activeDay, mealById]);

  const totals = useMemo(() => {
    return scheduledMeals.reduce(
      (acc, m) => ({
        kcal: acc.kcal + m.kcal,
        proteinG: acc.proteinG + m.proteinG,
        carbsG: acc.carbsG + m.carbsG,
        fatsG: acc.fatsG + m.fatsG,
        fiberG: acc.fiberG + m.fiberG,
        glycemicLoad: acc.glycemicLoad + m.glycemicLoad,
        priceInr: acc.priceInr + m.priceInr,
      }),
      { kcal: 0, proteinG: 0, carbsG: 0, fatsG: 0, fiberG: 0, glycemicLoad: 0, priceInr: 0 }
    );
  }, [scheduledMeals]);

  const proteinTarget = Math.round((dailyCalorieTarget * 0.3) / 4);
  const carbsTarget = Math.round((dailyCalorieTarget * 0.38) / 4);
  const fatsTarget = Math.round((dailyCalorieTarget * 0.32) / 9);
  const fiberTarget = 35;

  const progressBars = [
    { label: 'Protein', current: totals.proteinG, target: proteinTarget, unit: 'g', color: '#135D43' },
    { label: 'Complex Carbs', current: totals.carbsG, target: carbsTarget, unit: 'g', color: '#D95D39' },
    { label: 'Healthy Fats', current: totals.fatsG, target: fatsTarget, unit: 'g', color: '#C88A2E' },
    { label: 'Dietary Fiber', current: totals.fiberG, target: fiberTarget, unit: 'g', color: '#0E3E2D' },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Horizontal Date Scroller */}
      <section className="bg-white rounded-2xl border border-[#E8E4DC] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#135D43]">Scheduled Clinical Tiffin</p>
            <h1 className="font-display text-2xl sm:text-[28px] font-bold text-[#0E3E2D] leading-tight mt-0.5">
              {activeDay.fullDate}
            </h1>
          </div>
          <p className="text-xs font-medium text-[#4B5563]">
            Dispatching from <strong className="text-[#1F2937]">{activeHub}</strong> Kitchen
          </p>
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
          role="tablist"
          aria-label="Select plan date"
        >
          {weekSchedule.map((day) => {
            const isSelected = day.dayKey === activeDay.dayKey;
            const mealCount = Object.values(day.slots).filter(Boolean).length;
            return (
              <button
                key={day.dayKey}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectDay(day.dayKey)}
                className={`min-w-[74px] min-h-[68px] px-3 py-2.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#135D43] border-[#135D43] text-white'
                    : 'bg-[#F4F1EA] border-transparent text-[#4B5563] hover:border-[#E8E4DC] hover:text-[#1F2937]'
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
                  {day.weekday}
                </span>
                <span className="font-display text-lg font-bold tabular-nums leading-tight">
                  {day.dateNum}
                </span>
                <span
                  className={`text-[10px] font-medium tabular-nums ${
                    isSelected ? 'text-[#90D5B4]' : 'text-[#4B5563]'
                  }`}
                >
                  {mealCount} {mealCount === 1 ? 'meal' : 'meals'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split Grid: Left Budget & Preferences | Right Meal Slot Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Nutritional Budget + Delivery Preferences */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
                Daily Nutritional Budget
              </h2>
              <VerifiedBadge
                status={totals.glycemicLoad <= 42 ? 'verified' : 'estimated'}
                label={`GL ${totals.glycemicLoad}`}
                compact
              />
            </div>

            <div className="flex items-center gap-5">
              <CalorieRing current={totals.kcal} target={dailyCalorieTarget} size={120} />
              <div className="space-y-1.5 text-xs text-[#4B5563]">
                <p>
                  Remaining:{' '}
                  <strong className="text-[#0E3E2D] tabular-nums">
                    {Math.max(dailyCalorieTarget - totals.kcal, 0)} kcal
                  </strong>
                </p>
                <p>
                  Cumulative GL:{' '}
                  <strong className="text-[#1F2937] tabular-nums">{totals.glycemicLoad} / 45</strong>
                </p>
                <p>
                  Day Total:{' '}
                  <strong className="text-[#0E3E2D] tabular-nums">₹{totals.priceInr}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E8E4DC]">
              {progressBars.map((bar) => {
                const pct = Math.min((bar.current / Math.max(bar.target, 1)) * 100, 100);
                return (
                  <div key={bar.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs tabular-nums">
                      <span className="font-semibold text-[#1F2937]">{bar.label}</span>
                      <span className="text-[#4B5563]">
                        <strong className="text-[#1F2937]">{bar.current}</strong> / {bar.target}
                        {bar.unit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#F4F1EA] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: bar.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={scheduledMeals.length === 0}
              onClick={() => onQueueDayToBag(scheduledMeals, activeDay.fullDate)}
              className="w-full min-h-[52px] px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] disabled:bg-[#E8E4DC] disabled:text-[#9CA3AF] active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                Add Day&apos;s Meals to Bag · ₹{totals.priceInr}
              </span>
            </button>
          </div>

          {/* Kitchen & Courier Preferences */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#135D43]" />
              <h3 className="font-display text-base font-semibold text-[#0E3E2D]">
                Kitchen &amp; Tiffin Directives
              </h3>
            </div>
            <div className="space-y-2.5">
              <ClinicalCheckbox
                checked={insulatedTiffin}
                onChange={() => setInsulatedTiffin((v) => !v)}
                label="Returnable Steel Thermal Tiffin"
                sublabel="Zero-plastic vacuum-sealed courier exchange"
                rightText="Free"
              />
              <ClinicalCheckbox
                checked={lowOilPrep}
                onChange={() => setLowOilPrep((v) => !v)}
                label="Cold-Pressed Oil Ceiling (<= 5ml)"
                sublabel="Strict lipid control across all cooked courses"
              />
              <ClinicalCheckbox
                checked={cutleryFree}
                onChange={() => setCutleryFree((v) => !v)}
                label="Skip Disposable Cutlery"
                sublabel="Includes printed macro & batch QR card only"
              />
            </div>
          </div>
        </aside>

        {/* Right Scheduled Meal Slots */}
        <section className="lg:col-span-8 space-y-4">
          {SLOT_ORDER.map(({ slot, window }) => {
            const assignedId = activeDay.slots[slot];
            const meal = assignedId ? mealById[assignedId] : null;

            return (
              <div
                key={slot}
                className="bg-white rounded-2xl border border-[#E8E4DC] p-4 sm:p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8E4DC]">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-base font-semibold text-[#0E3E2D]">{slot}</h3>
                    <span className="text-[#9CA3AF]" aria-hidden="true">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4B5563] tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#135D43]" />
                      {window}
                    </span>
                  </div>

                  {meal ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSwappingSlot(slot)}
                        className="min-h-[38px] px-3 rounded-lg bg-[#F4F1EA] hover:bg-[#E8E4DC] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#135D43]" />
                        Swap
                      </button>
                      <button
                        type="button"
                        onClick={() => onAssignMealToSlot(activeDay.dayKey, slot, null)}
                        aria-label={`Remove ${meal.name} from ${slot}`}
                        className="min-h-[38px] min-w-[38px] rounded-lg border border-[#E8E4DC] hover:bg-[#FFF5F2] hover:border-[#D95D39]/40 text-[#4B5563] hover:text-[#A73918] inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSwappingSlot(slot)}
                      className="min-h-[38px] px-3.5 rounded-lg bg-[#135D43] hover:bg-[#0E3E2D] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Assign Meal
                    </button>
                  )}
                </div>

                {meal ? (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <button
                      type="button"
                      onClick={() => onInspectMeal(meal)}
                      className="sm:col-span-4 aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F1EA] block w-full cursor-pointer"
                    >
                      <MealImage src={meal.image} alt={meal.name} className="w-full h-full" />
                    </button>
                    <div className="sm:col-span-8 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <button
                            type="button"
                            onClick={() => onInspectMeal(meal)}
                            className="font-display text-lg font-semibold text-[#1F2937] hover:text-[#135D43] text-left cursor-pointer"
                          >
                            {meal.name}
                          </button>
                          <p className="text-xs font-medium text-[#135D43] mt-0.5">
                            {meal.subtitle}
                          </p>
                        </div>
                        <VerifiedBadge
                          status={meal.verificationStatus}
                          label={meal.verificationLabel}
                          compact
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4B5563] tabular-nums">
                        <span>
                          <strong className="text-[#1F2937]">{meal.kcal}</strong> kcal
                        </span>
                        <span>
                          GI <strong className="text-[#0E3E2D]">{meal.glycemicIndex}</strong> · GL{' '}
                          <strong className="text-[#0E3E2D]">{meal.glycemicLoad}</strong>
                        </span>
                        <span>
                          Batch <strong className="text-[#1F2937]">{meal.batchCode}</strong>
                        </span>
                        <span className="font-semibold text-[#0E3E2D]">₹{meal.priceInr}</span>
                      </div>

                      <MacroSplitBar
                        proteinG={meal.proteinG}
                        carbsG={meal.carbsG}
                        fatsG={meal.fatsG}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-5 px-4 rounded-xl bg-[#FBF9F5] border border-dashed border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">
                        No meal scheduled for {slot}
                      </p>
                      <p className="text-xs text-[#4B5563] mt-0.5">
                        Optional metabolic recovery window — add a high-protein or gut-reset bowl if
                        training today.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSwappingSlot(slot)}
                      className="min-h-[42px] px-4 rounded-xl border border-[#135D43]/30 bg-[#EBF3F0] text-[#0E3E2D] text-xs font-semibold hover:bg-[#135D43] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Browse Formulations
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      {/* Quick Swap Modal */}
      {swappingSlot && (
        <div
          className="fixed inset-0 z-50 bg-[#0E3E2D]/35 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Choose meal for ${swappingSlot}`}
        >
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl border border-[#E8E4DC] shadow-clinical-float max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.03em] text-[#135D43]">
                  {activeDay.fullDate}
                </p>
                <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
                  Select {swappingSlot} Formulation
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSwappingSlot(null)}
                aria-label="Close meal selector"
                className="w-10 h-10 rounded-xl bg-[#F4F1EA] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1F2937] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              {CLINICAL_MEALS.map((candidate) => {
                const isCurrent = activeDay.slots[swappingSlot] === candidate.id;
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => {
                      onAssignMealToSlot(activeDay.dayKey, swappingSlot, candidate.id);
                      setSwappingSlot(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center gap-3.5 transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#EBF3F0] border-[#135D43]'
                        : 'bg-white border-[#E8E4DC] hover:border-[#135D43]/40 hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <MealImage
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-20 h-16 rounded-lg shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-display text-sm font-semibold text-[#1F2937] truncate">
                          {candidate.name}
                        </p>
                        <span className="text-xs font-bold text-[#0E3E2D] tabular-nums shrink-0">
                          ₹{candidate.priceInr}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5563] tabular-nums mt-0.5">
                        {candidate.kcal} kcal · {candidate.proteinG}g Pro · GI{' '}
                        {candidate.glycemicIndex}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="w-6 h-6 rounded-full bg-[#135D43] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
