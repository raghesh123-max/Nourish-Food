import React, { useMemo, useState } from 'react';
import { Search, MapPin, Plus, Minus, SlidersHorizontal, ArrowUpRight, Sparkles } from 'lucide-react';
import {
  CLINICAL_MEALS,
  ClinicalGoal,
  ClinicalMeal,
  DIETARY_FILTERS,
  DietaryTag,
  METRO_HUBS,
} from '../data/clinicalData';
import { MacroSplitBar, MealImage, VerifiedBadge } from './ClinicalVisuals';

interface MenuScreenProps {
  activeHub: string;
  onChangeHub: (hub: string) => void;
  activeGoal: ClinicalGoal;
  dailyCalorieTarget: number;
  excludedAllergens: string[];
  bagQuantities: Record<string, number>;
  onQuickAdd: (meal: ClinicalMeal) => void;
  onDecrementMeal: (mealId: string) => void;
  onInspectMeal: (meal: ClinicalMeal) => void;
  onOpenMetabolicSetup: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  activeHub,
  onChangeHub,
  activeGoal,
  dailyCalorieTarget,
  excludedAllergens,
  bagQuantities,
  onQuickAdd,
  onDecrementMeal,
  onInspectMeal,
  onOpenMetabolicSetup,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All Meals' | DietaryTag>('All Meals');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'protein' | 'gi' | 'price'>('recommended');

  const filteredMeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = CLINICAL_MEALS.filter((meal) => {
      const matchesFilter =
        selectedFilter === 'All Meals' || meal.tags.includes(selectedFilter);
      const matchesQuery =
        !q ||
        meal.name.toLowerCase().includes(q) ||
        meal.subtitle.toLowerCase().includes(q) ||
        meal.description.toLowerCase().includes(q) ||
        meal.ingredients.some((i) => i.name.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'protein') return b.proteinG - a.proteinG;
      if (sortBy === 'gi') return a.glycemicIndex - b.glycemicIndex;
      if (sortBy === 'price') return a.priceInr - b.priceInr;
      // Recommended: prioritize meals matching active goal & not conflicting with allergens
      const aConflict = a.excludedBy.some((e) => excludedAllergens.includes(e)) ? 1 : 0;
      const bConflict = b.excludedBy.some((e) => excludedAllergens.includes(e)) ? 1 : 0;
      if (aConflict !== bConflict) return aConflict - bConflict;
      return a.glycemicLoad - b.glycemicLoad;
    });
  }, [selectedFilter, searchQuery, sortBy, excludedAllergens]);

  const targetProtein = Math.round((dailyCalorieTarget * 0.3) / 4);

  return (
    <div className="space-y-8">
      {/* Editorial Hero & Active Protocol Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#135D43]">
                <MapPin className="w-4 h-4 shrink-0" />
                <label htmlFor="hub-select" className="sr-only">
                  Delivery neighborhood
                </label>
                <select
                  id="hub-select"
                  value={activeHub}
                  onChange={(e) => onChangeHub(e.target.value)}
                  className="bg-transparent text-[#0E3E2D] font-semibold focus:outline-none cursor-pointer pr-1"
                >
                  {METRO_HUBS.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </select>
                <span className="text-[#9CA3AF]" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#4B5563]">35–45 min cold-sealed courier</span>
              </div>

              <VerifiedBadge status="verified" label="NABL KITCHEN VERIFIED" compact />
            </div>

            <div className="space-y-2 max-w-2xl">
              <h1 className="font-display text-[26px] sm:text-[32px] font-bold leading-tight text-[#0E3E2D] text-balance">
                Lab-verified Indian meals calibrated to your daily glycemic budget
              </h1>
              <p className="text-sm sm:text-[15px] leading-relaxed text-[#4B5563]">
                Every bowl is weighed to the gram, tested for starch digestibility, and prepared in
                small batches using cold-pressed oils and traceable regional produce.
              </p>
            </div>
          </div>

          {/* Search & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search millets, paneer, sea bass, or ingredients..."
                aria-label="Search clinical meals"
                className="clinical-input w-full pl-10 pr-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF]"
              />
            </div>
            <div className="sm:col-span-4 relative">
              <SlidersHorizontal className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort meals"
                className="clinical-input w-full pl-10 pr-3 text-sm font-medium text-[#1F2937] cursor-pointer appearance-none"
              >
                <option value="recommended">Protocol Match</option>
                <option value="protein">Highest Protein</option>
                <option value="gi">Lowest Glycemic Index</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Clinical Protocol Summary Card */}
        <div className="lg:col-span-4 bg-[#0E3E2D] text-white rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#90D5B4]">
                Active Dietary Protocol
              </span>
              <button
                type="button"
                onClick={onOpenMetabolicSetup}
                className="text-xs font-semibold text-white/90 hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                Edit targets
              </button>
            </div>
            <h2 className="font-display text-xl font-semibold text-white leading-snug">
              {activeGoal}
            </h2>
            <p className="text-xs leading-relaxed text-[#EBF3F0]/85">
              Menu rankings automatically prioritize low glycemic excursions and exclude your
              selected dietary restrictions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/15">
            <div>
              <p className="text-[11px] text-[#90D5B4] font-medium">Daily Target</p>
              <p className="font-display text-lg font-bold tabular-nums mt-0.5">
                {dailyCalorieTarget}
                <span className="text-xs font-normal text-white/75 ml-0.5">kcal</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#90D5B4] font-medium">Protein Floor</p>
              <p className="font-display text-lg font-bold tabular-nums mt-0.5">
                {targetProtein}
                <span className="text-xs font-normal text-white/75 ml-0.5">g</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#90D5B4] font-medium">Exclusions</p>
              <p className="font-display text-lg font-bold tabular-nums mt-0.5">
                {excludedAllergens.length}
                <span className="text-xs font-normal text-white/75 ml-1">active</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dietary Restriction Filter Chips (per spec: #F4F1EA inactive -> #135D43 active) */}
      <section aria-label="Dietary restriction filters" className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
            Today&apos;s Clinical Kitchen Menu
          </h2>
          <span className="text-xs font-medium text-[#4B5563] tabular-nums">
            Showing {filteredMeals.length} of {CLINICAL_MEALS.length} formulations
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {DIETARY_FILTERS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#135D43] text-white'
                    : 'bg-[#F4F1EA] text-[#4B5563] hover:bg-[#E8E4DC] hover:text-[#1F2937]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Clinical Meal Cards Grid */}
      {filteredMeals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-10 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#0E3E2D]">
            No meals match &ldquo;{searchQuery}&rdquo; under {selectedFilter}
          </p>
          <p className="text-sm text-[#4B5563]">
            Clear your search keyword or reset the dietary restriction filter to browse all
            formulations.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter('All Meals');
              setSearchQuery('');
            }}
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl bg-[#135D43] text-white text-sm font-semibold hover:bg-[#0E3E2D] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => {
            const qty = bagQuantities[meal.id] || 0;
            const conflictingAllergens = meal.excludedBy.filter((ex) =>
              excludedAllergens.includes(ex)
            );

            return (
              <article
                key={meal.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  {/* 4:3 Editorial Meal Photography */}
                  <div className="relative aspect-[4/3] w-full bg-[#F4F1EA] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onInspectMeal(meal)}
                      className="block w-full h-full text-left cursor-pointer focus:outline-none"
                      aria-label={`Inspect nutrition for ${meal.name}`}
                    >
                      <MealImage
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full transition-transform duration-300 hover:scale-[1.03]"
                      />
                    </button>
                    <div className="absolute top-3 left-3">
                      <VerifiedBadge
                        status={meal.verificationStatus}
                        label={meal.verificationLabel}
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold leading-snug text-[#1F2937]">
                          <button
                            type="button"
                            onClick={() => onInspectMeal(meal)}
                            className="text-left hover:text-[#135D43] transition-colors cursor-pointer"
                          >
                            {meal.name}
                          </button>
                        </h3>
                        <span className="font-display text-lg font-bold text-[#0E3E2D] tabular-nums whitespace-nowrap shrink-0">
                          ₹{meal.priceInr}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-[#135D43]">{meal.subtitle}</p>
                    </div>

                    {/* Tabular Clinical Metrics Row */}
                    <div className="flex items-center justify-between text-xs text-[#4B5563] tabular-nums py-2.5 px-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]">
                      <span>
                        <strong className="text-[#1F2937] font-bold">{meal.kcal}</strong> kcal
                      </span>
                      <span className="text-[#E8E4DC]" aria-hidden="true">
                        |
                      </span>
                      <span>
                        GI <strong className="text-[#0E3E2D] font-bold">{meal.glycemicIndex}</strong>
                      </span>
                      <span className="text-[#E8E4DC]" aria-hidden="true">
                        |
                      </span>
                      <span>
                        Fiber <strong className="text-[#1F2937] font-bold">{meal.fiberG}g</strong>
                      </span>
                      <span className="text-[#E8E4DC]" aria-hidden="true">
                        |
                      </span>
                      <span>{meal.servingWeightGrams}g</span>
                    </div>

                    {/* Segmented 4px Macro-Split Bar + Macro Split Pill */}
                    <MacroSplitBar
                      proteinG={meal.proteinG}
                      carbsG={meal.carbsG}
                      fatsG={meal.fatsG}
                    />

                    {conflictingAllergens.length > 0 && (
                      <p className="text-[11px] font-medium text-[#A73918] bg-[#FFF5F2] border border-[#D95D39]/25 rounded-lg px-2.5 py-1.5">
                        Contains {conflictingAllergens.join(', ').replace(/-Free/g, '')} — customize
                        swaps in Nutrition view.
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-4 sm:px-5 pb-5 pt-1 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onInspectMeal(meal)}
                    className="flex-1 min-h-[48px] px-3.5 rounded-xl border border-[#E8E4DC] bg-white text-sm font-semibold text-[#1F2937] hover:bg-[#F4F1EA] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Nutrition
                  </button>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => onQuickAdd(meal)}
                      className="flex-[1.35] min-h-[48px] px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] active:scale-[0.98] text-white text-sm font-semibold transition-all whitespace-nowrap cursor-pointer"
                    >
                      Add to Plan
                    </button>
                  ) : (
                    <div className="flex-[1.35] min-h-[48px] rounded-xl bg-[#135D43] text-white flex items-center justify-between px-2">
                      <button
                        type="button"
                        onClick={() => onDecrementMeal(meal.id)}
                        aria-label={`Remove one ${meal.name}`}
                        className="w-9 h-9 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold tabular-nums">{qty} in Bag</span>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(meal)}
                        aria-label={`Add one more ${meal.name}`}
                        className="w-9 h-9 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {/* 6th Balanced Editorial Card when showing full catalog */}
          {selectedFilter === 'All Meals' && !searchQuery.trim() && (
            <aside className="bg-[#F4F1EA] rounded-2xl border border-[#E8E4DC] p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#EBF3F0] border border-[#135D43]/20 flex items-center justify-center text-[#135D43]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#135D43]">
                    Personalized Tiffin Calibration
                  </p>
                  <h3 className="font-display text-xl font-semibold text-[#0E3E2D] leading-snug">
                    Need custom macro splits for HbA1c, PCOS, or lipid goals?
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4B5563]">
                    Configure your daily caloric ceiling, glycemic load cap, and allergen exclusions
                    to auto-calibrate portion weights across every meal delivery.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E8E4DC]">
                <div className="flex items-center justify-between text-xs text-[#4B5563] tabular-nums">
                  <span>Current Protocol</span>
                  <strong className="text-[#0E3E2D]">{activeGoal}</strong>
                </div>
                <button
                  type="button"
                  onClick={onOpenMetabolicSetup}
                  className="w-full min-h-[48px] px-4 rounded-xl bg-[#135D43] hover:bg-[#0E3E2D] active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Configure Protocol</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </aside>
          )}
        </section>
      )}
    </div>
  );
};
