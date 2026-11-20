/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  UtensilsCrossed,
  CalendarDays,
  Activity,
  FlaskConical,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import {
  ClinicalGoal,
  ClinicalMeal,
  DaySchedule,
  INITIAL_WEEK_SCHEDULE,
  METRO_HUBS,
  MealAddon,
  MealSlotType,
} from './data/clinicalData';
import { MenuScreen } from './components/MenuScreen';
import { DailyPlanScreen } from './components/DailyPlanScreen';
import { MetabolicScreen } from './components/MetabolicScreen';
import { LabsScreen } from './components/LabsScreen';
import { MealDetailModal } from './components/MealDetailModal';
import { BagDrawer, BagItem } from './components/BagDrawer';

type ScreenTab = 'menu' | 'plan' | 'metabolic' | 'labs';

const NAV_ITEMS: { id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'plan', label: 'Daily Plan', icon: CalendarDays },
  { id: 'metabolic', label: 'Metabolic', icon: Activity },
  { id: 'labs', label: 'Labs', icon: FlaskConical },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('menu');
  const [activeHub, setActiveHub] = useState<string>(METRO_HUBS[0]);
  const [activeGoal, setActiveGoal] = useState<ClinicalGoal>('Glycemic Control');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number>(1850);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>(['No Refined Oils']);

  // 7-day meal schedule state
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>(INITIAL_WEEK_SCHEDULE);
  const [selectedDayKey, setSelectedDayKey] = useState<string>('fri-20');

  // Diet Bag state
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);

  // Meal detail modal state
  const [inspectedMeal, setInspectedMeal] = useState<ClinicalMeal | null>(null);

  // Subtle confirmation toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const bagQuantitiesByMealId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of bagItems) {
      counts[item.meal.id] = (counts[item.meal.id] || 0) + item.quantity;
    }
    return counts;
  }, [bagItems]);

  const totalBagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.quantity, 0),
    [bagItems]
  );

  const addMealToBag = (
    meal: ClinicalMeal,
    addons: MealAddon[] = [],
    assignSlot?: MealSlotType
  ) => {
    const sortedAddonIds = [...addons]
      .map((a) => a.id)
      .sort()
      .join(',');
    const key = `${meal.id}::${sortedAddonIds}`;

    setBagItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { key, meal, addons, quantity: 1 }];
    });

    if (assignSlot) {
      handleAssignMealToSlot(selectedDayKey, assignSlot, meal.id);
      showToast(`Added ${meal.name} to Bag & ${assignSlot}`);
    } else {
      showToast(`Added ${meal.name} to Diet Bag`);
    }
  };

  const decrementMealInBag = (mealId: string) => {
    setBagItems((prev) => {
      const idx = prev.findIndex((i) => i.meal.id === mealId);
      if (idx === -1) return prev;
      const target = prev[idx];
      if (target.quantity <= 1) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const updateBagItemQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleAssignMealToSlot = (
    dayKey: string,
    slot: MealSlotType,
    mealId: string | null
  ) => {
    setWeekSchedule((prev) =>
      prev.map((day) =>
        day.dayKey === dayKey
          ? { ...day, slots: { ...day.slots, [slot]: mealId } }
          : day
      )
    );
  };

  const handleQueueDayToBag = (meals: ClinicalMeal[], dayLabel: string) => {
    setBagItems((prev) => {
      const next = [...prev];
      for (const meal of meals) {
        const key = `${meal.id}::`;
        const existingIdx = next.findIndex((i) => i.key === key);
        if (existingIdx >= 0) {
          next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + 1 };
        } else {
          next.push({ key, meal, addons: [], quantity: 1 });
        }
      }
      return next;
    });
    showToast(`Queued ${meals.length} meals from ${dayLabel}`);
    setIsBagOpen(true);
  };

  const handleToggleAllergen = (allergen: string) => {
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1F2937] flex flex-col">
      {/* Desktop & Mobile Top Navigation Bar (Strict 3-Zone Top Bar Contract on desktop) */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#0E3E2D] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Aahara Clinical
          </button>

          {/* Zone 2: 4 Clean Single-Line Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5563]"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-[#0E3E2D] font-semibold border-[#135D43]'
                      : 'border-transparent hover:text-[#0E3E2D] hover:border-[#E8E4DC]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="min-h-[40px] sm:min-h-[42px] px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Diet Bag{totalBagCount > 0 ? ` (${totalBagCount})` : ''}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-14">
        {activeTab === 'menu' && (
          <MenuScreen
            activeHub={activeHub}
            onChangeHub={setActiveHub}
            activeGoal={activeGoal}
            dailyCalorieTarget={dailyCalorieTarget}
            excludedAllergens={excludedAllergens}
            bagQuantities={bagQuantitiesByMealId}
            onQuickAdd={(meal) => addMealToBag(meal)}
            onDecrementMeal={decrementMealInBag}
            onInspectMeal={(meal) => setInspectedMeal(meal)}
            onOpenMetabolicSetup={() => setActiveTab('metabolic')}
          />
        )}

        {activeTab === 'plan' && (
          <DailyPlanScreen
            weekSchedule={weekSchedule}
            selectedDayKey={selectedDayKey}
            onSelectDay={setSelectedDayKey}
            dailyCalorieTarget={dailyCalorieTarget}
            activeHub={activeHub}
            onAssignMealToSlot={handleAssignMealToSlot}
            onInspectMeal={(meal) => setInspectedMeal(meal)}
            onQueueDayToBag={handleQueueDayToBag}
          />
        )}

        {activeTab === 'metabolic' && (
          <MetabolicScreen
            activeGoal={activeGoal}
            onChangeGoal={setActiveGoal}
            dailyCalorieTarget={dailyCalorieTarget}
            onChangeCalorieTarget={setDailyCalorieTarget}
            excludedAllergens={excludedAllergens}
            onToggleAllergen={handleToggleAllergen}
          />
        )}

        {activeTab === 'labs' && <LabsScreen />}
      </main>

      {/* Quiet Editorial Footer (Desktop & Tablet) */}
      <footer className="hidden md:block border-t border-[#E8E4DC] bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#4B5563]">
          <p className="font-medium text-[#0E3E2D]">
            Aahara Clinical Kitchens · FSSAI Lic. 11226334001982 · NABL Accredited Assays
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('labs')}
              className="hover:text-[#0E3E2D] transition-colors cursor-pointer"
            >
              Lab Certificates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metabolic')}
              className="hover:text-[#0E3E2D] transition-colors cursor-pointer"
            >
              Protocol Targets
            </button>
            <span>Bengaluru · Mumbai · Gurugram</span>
          </div>
        </div>
      </footer>

      {/* Mobile Thumb-Zone Bottom Tab Bar (hidden on md+) */}
      <nav
        aria-label="Mobile screen navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E4DC]"
      >
        <div className="grid grid-cols-4 h-16 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  isActive ? 'text-[#135D43]' : 'text-[#9CA3AF]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'text-[#0E3E2D]' : 'text-[#4B5563]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Subtle Toast Confirmation */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0E3E2D] text-white px-4 py-2.5 rounded-full shadow-clinical-float flex items-center gap-2 text-xs font-semibold whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 text-[#90D5B4] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Meal Clinical Detail Modal */}
      {inspectedMeal && (
        <MealDetailModal
          meal={inspectedMeal}
          onClose={() => setInspectedMeal(null)}
          onAddConfiguredMeal={addMealToBag}
        />
      )}

      {/* Diet Bag & Checkout Slide-Over Drawer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        activeHub={activeHub}
        onUpdateQty={updateBagItemQty}
        onClearBag={() => setBagItems([])}
      />
    </div>
  );
}
