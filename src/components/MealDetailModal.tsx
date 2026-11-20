import React, { useMemo, useState } from 'react';
import { X, AlertCircle, ShieldCheck, CalendarPlus } from 'lucide-react';
import { ClinicalMeal, MealAddon, MealSlotType } from '../data/clinicalData';
import {
  ClinicalCheckbox,
  MacroSplitBar,
  MealImage,
  VerifiedBadge,
} from './ClinicalVisuals';

interface MealDetailModalProps {
  meal: ClinicalMeal;
  onClose: () => void;
  onAddConfiguredMeal: (meal: ClinicalMeal, addons: MealAddon[], assignSlot?: MealSlotType) => void;
}

const SLOTS: MealSlotType[] = ['Breakfast', 'Lunch', 'Afternoon Recovery', 'Dinner'];

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  onClose,
  onAddConfiguredMeal,
}) => {
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<MealSlotType>(meal.bestForSlots[0] || 'Lunch');
  const [alsoScheduleToday, setAlsoScheduleToday] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeAddons = useMemo(
    () => meal.addons.filter((a) => selectedAddonIds.includes(a.id)),
    [meal.addons, selectedAddonIds]
  );

  const computed = useMemo(() => {
    const kcal = meal.kcal + activeAddons.reduce((s, a) => s + a.kcalDelta, 0);
    const proteinG = meal.proteinG + activeAddons.reduce((s, a) => s + a.proteinDelta, 0);
    const priceInr = meal.priceInr + activeAddons.reduce((s, a) => s + a.priceDelta, 0);
    return { kcal, proteinG, priceInr };
  }, [meal, activeAddons]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0E3E2D]/40 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Clinical nutrition details for ${meal.name}`}
    >
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-[#E8E4DC] shadow-clinical-float max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Modal Bar */}
        <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <VerifiedBadge status={meal.verificationStatus} label={meal.verificationLabel} compact />
            <span className="text-xs font-semibold text-[#4B5563] tabular-nums truncate">
              Batch {meal.batchCode}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close nutrition details"
            className="w-10 h-10 rounded-xl bg-[#F4F1EA] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1F2937] shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Clinical Details */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Header Media + Primary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch">
            <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden bg-[#F4F1EA]">
              <MealImage src={meal.image} alt={meal.name} className="w-full h-full" />
            </div>
            <div className="sm:col-span-7 flex flex-col justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0E3E2D] leading-snug">
                  {meal.name}
                </h2>
                <p className="text-xs font-semibold text-[#135D43] mt-1">{meal.subtitle}</p>
                <p className="text-sm text-[#4B5563] leading-relaxed mt-2">{meal.description}</p>
              </div>

              <MacroSplitBar
                proteinG={computed.proteinG}
                carbsG={meal.carbsG}
                fatsG={meal.fatsG}
              />
            </div>
          </div>

          {/* Laboratory Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]">
              <p className="text-[11px] font-semibold text-[#4B5563]">Energy</p>
              <p className="font-display text-xl font-bold text-[#0E3E2D] mt-0.5">
                {computed.kcal} <span className="text-xs font-normal text-[#4B5563]">kcal</span>
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]">
              <p className="text-[11px] font-semibold text-[#4B5563]">Glycemic Index</p>
              <p className="font-display text-xl font-bold text-[#135D43] mt-0.5">
                {meal.glycemicIndex} <span className="text-xs font-normal text-[#4B5563]">(Low)</span>
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]">
              <p className="text-[11px] font-semibold text-[#4B5563]">Glycemic Load</p>
              <p className="font-display text-xl font-bold text-[#0E3E2D] mt-0.5">
                {meal.glycemicLoad} <span className="text-xs font-normal text-[#4B5563]">/ bowl</span>
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]">
              <p className="text-[11px] font-semibold text-[#4B5563]">Fiber / Sodium</p>
              <p className="font-display text-xl font-bold text-[#1F2937] mt-0.5">
                {meal.fiberG}g{' '}
                <span className="text-xs font-normal text-[#4B5563]">/ {meal.sodiumMg}mg</span>
              </p>
            </div>
          </div>

          {/* Clinical Note */}
          <div className="p-4 rounded-xl bg-[#EBF3F0]/70 border border-[#135D43]/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#135D43] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.02em] text-[#0E3E2D]">
                Dietitian Clinical Rationale
              </p>
              <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed">
                {meal.clinicalNote}
              </p>
            </div>
          </div>

          {/* Clinical Customizations */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-[#0E3E2D]">
              Clinical Preparation &amp; Macro Boosters
            </h3>
            <div className="space-y-2">
              {meal.addons.map((addon) => (
                <ClinicalCheckbox
                  key={addon.id}
                  checked={selectedAddonIds.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  label={addon.label}
                  sublabel={
                    addon.kcalDelta !== 0
                      ? `${addon.kcalDelta > 0 ? '+' : ''}${addon.kcalDelta} kcal · ${
                          addon.proteinDelta >= 0 ? '+' : ''
                        }${addon.proteinDelta}g protein`
                      : 'Zero caloric change'
                  }
                  rightText={addon.priceDelta > 0 ? `+₹${addon.priceDelta}` : 'Complimentary'}
                />
              ))}
            </div>
          </div>

          {/* Optional Direct Scheduling */}
          <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] space-y-3">
            <ClinicalCheckbox
              checked={alsoScheduleToday}
              onChange={() => setAlsoScheduleToday((v) => !v)}
              label="Also assign to Today's Daily Plan"
              sublabel="Updates your Friday, 20 Nov meal timeline automatically"
            />
            {alsoScheduleToday && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-[#135D43] text-white'
                        : 'bg-[#F4F1EA] text-[#4B5563] hover:bg-[#E8E4DC]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ingredient Provenance Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#0E3E2D]">
                Weighed Ingredient Provenance
              </h3>
              <span className="text-xs text-[#4B5563] tabular-nums">
                Total {meal.servingWeightGrams}g net
              </span>
            </div>
            <div className="rounded-xl border border-[#E8E4DC] divide-y divide-[#E8E4DC] bg-white">
              {meal.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="px-4 py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <p className="font-semibold text-[#1F2937]">{ing.name}</p>
                    <p className="text-[#4B5563] mt-0.5">{ing.provenance}</p>
                  </div>
                  <span className="font-bold text-[#0E3E2D] tabular-nums whitespace-nowrap shrink-0">
                    {ing.grams}g
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Allergen Disclaimer */}
          <div className="flex items-start gap-2.5 text-xs text-[#4B5563]">
            <AlertCircle className="w-4 h-4 text-[#A73918] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#1F2937]">Allergen Disclosure:</strong>{' '}
              {meal.allergens.join(', ')}. Prepared in a kitchen following segregated allergen zones.
            </p>
          </div>
        </div>

        {/* Sticky Primary Conversion Footer */}
        <div className="px-5 py-4 border-t border-[#E8E4DC] bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="tabular-nums">
            <p className="text-xs font-medium text-[#4B5563]">
              {computed.kcal} kcal · {computed.proteinG}g Protein
            </p>
            <p className="font-display text-xl font-bold text-[#0E3E2D]">₹{computed.priceInr}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onAddConfiguredMeal(
                meal,
                activeAddons,
                alsoScheduleToday ? selectedSlot : undefined
              );
              onClose();
            }}
            className="flex-1 sm:flex-none sm:min-w-[230px] min-h-[52px] px-6 rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {alsoScheduleToday && <CalendarPlus className="w-4 h-4" />}
            <span>Add to Diet Plan · ₹{computed.priceInr}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
