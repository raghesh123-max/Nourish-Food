export type DietaryTag =
  | 'Low Glycemic'
  | 'High Protein'
  | 'PCOS Support'
  | 'Gut Reset'
  | 'Plant-Forward'
  | 'Dairy-Free';

export type MealSlotType = 'Breakfast' | 'Lunch' | 'Afternoon Recovery' | 'Dinner';

export type ClinicalGoal =
  | 'Glycemic Control'
  | 'Lean Muscle Synthesis'
  | 'PCOS Hormonal Balance'
  | 'Cardiometabolic Health';

export interface MealAddon {
  id: string;
  label: string;
  kcalDelta: number;
  proteinDelta: number;
  priceDelta: number;
}

export interface ClinicalMeal {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  priceInr: number;
  servingWeightGrams: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG: number;
  sodiumMg: number;
  glycemicIndex: number;
  glycemicLoad: number;
  verificationStatus: 'verified' | 'estimated';
  verificationLabel: string;
  batchCode: string;
  tags: DietaryTag[];
  bestForSlots: MealSlotType[];
  allergens: string[];
  excludedBy: string[];
  ingredients: {
    name: string;
    provenance: string;
    grams: number;
  }[];
  clinicalNote: string;
  addons: MealAddon[];
}

export interface DaySchedule {
  dayKey: string;
  weekday: string;
  dateNum: string;
  fullDate: string;
  slots: Record<MealSlotType, string | null>;
}

export interface MetabolicDayPoint {
  day: string;
  dateLabel: string;
  peakGlucoseMgDl: number;
  fastingGlucoseMgDl: number;
  proteinGrams: number;
  proteinTarget: number;
  glycemicLoad: number;
  fiberGrams: number;
}

export interface LabAssayRecord {
  id: string;
  batchCode: string;
  mealName: string;
  testedDate: string;
  labName: string;
  accreditationId: string;
  giAssay: number;
  proteinVariancePct: string;
  heavyMetals: 'Clear (<0.01 ppm)';
  pesticideResidue: 'Not Detected';
  coldChainTemp: string;
  status: 'verified' | 'estimated';
  summary: string;
}

export interface ClinicalDietitian {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  cityHub: string;
  experienceYears: number;
  nextSlots: string[];
  consultationFeeInr: number;
}

export const DIETARY_FILTERS: ('All Meals' | DietaryTag)[] = [
  'All Meals',
  'Low Glycemic',
  'High Protein',
  'PCOS Support',
  'Gut Reset',
  'Plant-Forward',
  'Dairy-Free',
];

export const METRO_HUBS = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'Bandra West, Mumbai',
  'DLF Phase IV, Gurugram',
] as const;

export const CLINICAL_MEALS: ClinicalMeal[] = [
  {
    id: 'ragi-paneer-bowl',
    name: 'Tandoori Paneer & Sprouted Ragi Bowl',
    subtitle: 'Low Glycemic · Certified Diabetic Friendly',
    description:
      'Char-grilled A2 malai paneer marinated in hung curd and Kashmiri saffron over sprouted Mandya finger millet, roasted broccoli, Hass avocado, and mint-coriander emulsion.',
    image: '/src/assets/images/meal_ragi_paneer_bowl_1795169999602.jpg',
    priceInr: 410,
    servingWeightGrams: 420,
    kcal: 485,
    proteinG: 34,
    carbsG: 38,
    fatsG: 21,
    fiberG: 11,
    sodiumMg: 480,
    glycemicIndex: 36,
    glycemicLoad: 10,
    verificationStatus: 'verified',
    verificationLabel: 'VERIFIED 14 OCT',
    batchCode: 'BLR-K04-281',
    tags: ['Low Glycemic', 'High Protein', 'PCOS Support', 'Plant-Forward'],
    bestForSlots: ['Lunch', 'Dinner'],
    allergens: ['Dairy (A2 Paneer)', 'Mustard'],
    excludedBy: ['Lactose-Free'],
    ingredients: [
      { name: 'Artisanal A2 Low-Fat Paneer', provenance: 'Hesaraghatta Pasture Dairy', grams: 130 },
      { name: 'Sprouted Finger Millet (Ragi)', provenance: 'Mandya Organic Collective', grams: 115 },
      { name: 'Charred Broccoli Florets', provenance: 'Ooty Hydroponic Farm', grams: 85 },
      { name: 'Fresh Hass Avocado & Pomegranate', provenance: 'Coorg Estate Harvest', grams: 55 },
      { name: 'Cold-Pressed Mint Coriander Dressing', provenance: 'House Kitchen Batch', grams: 35 },
    ],
    clinicalNote:
      'Sprouting reduces phytic acid in ragi by 42%, improving calcium and iron bioavailability while keeping post-prandial glucose excursion under 22 mg/dL.',
    addons: [
      { id: 'extra-paneer', label: 'Extra Grilled A2 Paneer (+12g Protein)', kcalDelta: 115, proteinDelta: 12, priceDelta: 85 },
      { id: 'hemp-hearts', label: 'Toasted Himalayan Hemp Hearts (+6g Protein)', kcalDelta: 80, proteinDelta: 6, priceDelta: 55 },
      { id: 'low-sodium', label: 'Cardiometabolic Low-Sodium Prep (-30% Na)', kcalDelta: 0, proteinDelta: 0, priceDelta: 0 },
    ],
  },
  {
    id: 'malabar-fish-quinoa',
    name: 'Malabar Turmeric Sea Bass & Red Quinoa',
    subtitle: 'Omega-3 Rich · Anti-Inflammatory Protocol',
    description:
      'Wild-caught Indian sea bass seared in Alleppey turmeric and cold-pressed coconut oil, plated over nutty Andean-strain red quinoa, curry-leaf French beans, and ginger emulsion.',
    image: '/src/assets/images/meal_malabar_fish_quinoa_1795170003731.jpg',
    priceInr: 520,
    servingWeightGrams: 400,
    kcal: 460,
    proteinG: 41,
    carbsG: 32,
    fatsG: 18,
    fiberG: 8,
    sodiumMg: 440,
    glycemicIndex: 31,
    glycemicLoad: 8,
    verificationStatus: 'verified',
    verificationLabel: 'VERIFIED 16 OCT',
    batchCode: 'BLR-K02-309',
    tags: ['Low Glycemic', 'High Protein', 'PCOS Support', 'Dairy-Free'],
    bestForSlots: ['Lunch', 'Dinner'],
    allergens: ['Fish', 'Tree Nuts (Almond Garnish)'],
    excludedBy: ['Nut-Free'],
    ingredients: [
      { name: 'Wild-Caught Malabar Sea Bass (Bhetki)', provenance: 'Kochi Traceable Day-Boat', grams: 165 },
      { name: 'Sprouted Red Quinoa Pilaf', provenance: 'Anantapur Regenerative Farms', grams: 110 },
      { name: 'Curry-Leaf Tempered Green Beans & Tomatoes', provenance: 'Chikkaballapur Growers', grams: 95 },
      { name: 'Light Coconut-Ginger Emulsion', provenance: 'Pollachi First-Press', grams: 30 },
    ],
    clinicalNote:
      'Delivers 1,420 mg combined EPA/DHA per serving paired with high-curcumin Alleppey turmeric and black pepper piperine for endothelial recovery.',
    addons: [
      { id: 'extra-fillet', label: 'Extra 60g Seared Sea Bass (+14g Protein)', kcalDelta: 95, proteinDelta: 14, priceDelta: 135 },
      { id: 'remove-almonds', label: 'Omit Toasted Almond Garnish (Nut-Free)', kcalDelta: -35, proteinDelta: -1, priceDelta: 0 },
      { id: 'extra-beans', label: 'Double Curry-Leaf Green Beans (+4g Fiber)', kcalDelta: 45, proteinDelta: 2, priceDelta: 40 },
    ],
  },
  {
    id: 'moong-dal-khichdi',
    name: 'Steel-Cut Oat & Yellow Moong Khichdi',
    subtitle: 'Prebiotic Fiber · Gentle Gut Reset',
    description:
      'Slow-simmered split yellow moong dal folded with beta-glucan rich steel-cut oats, roasted cumin tadka, heirloom microgreens, pumpkin seeds, and steamed rainbow roots.',
    image: '/src/assets/images/meal_moong_dal_khichdi_1795170018033.jpg',
    priceInr: 340,
    servingWeightGrams: 440,
    kcal: 395,
    proteinG: 22,
    carbsG: 52,
    fatsG: 10,
    fiberG: 13,
    sodiumMg: 390,
    glycemicIndex: 41,
    glycemicLoad: 14,
    verificationStatus: 'verified',
    verificationLabel: 'VERIFIED 15 OCT',
    batchCode: 'BLR-K01-294',
    tags: ['Gut Reset', 'Plant-Forward', 'Dairy-Free', 'Low Glycemic'],
    bestForSlots: ['Lunch', 'Dinner'],
    allergens: ['None (Certified Top-8 Free)'],
    excludedBy: [],
    ingredients: [
      { name: 'Unpolished Split Yellow Moong Dal', provenance: 'Gulbarga Pulse Co-op', grams: 135 },
      { name: 'Whole Steel-Cut Oats (Beta-Glucan)', provenance: 'Himachal Valley Mill', grams: 95 },
      { name: 'Steamed Asparagus & Heirloom Carrots', provenance: 'Nilgiris Cold-Chain Farm', grams: 120 },
      { name: 'Roasted Pumpkin Seeds & Microgreens', provenance: 'Bengaluru Urban Hydro', grams: 45 },
      { name: 'Cumin, Ginger & Cold-Pressed Sesame Tadka', provenance: 'House Kitchen Batch', grams: 45 },
    ],
    clinicalNote:
      'Provides 4.6g soluble oat beta-glucan and resistant starch to nourish butyrate-producing gut microbiota while maintaining low digestive osmolarity.',
    addons: [
      { id: 'fermented-tofu', label: 'Grilled Smoked Tempeh Cubes (+15g Protein)', kcalDelta: 125, proteinDelta: 15, priceDelta: 90 },
      { id: 'a2-ghee', label: '1 tsp Bilona A2 Cultured Ghee Finish', kcalDelta: 45, proteinDelta: 0, priceDelta: 35 },
      { id: 'low-fodmap', label: 'Low-FODMAP Zero-Garlic Prep', kcalDelta: 0, proteinDelta: 0, priceDelta: 0 },
    ],
  },
  {
    id: 'saffron-chicken-cauliflower',
    name: 'Saffron Herb Chicken & Cauliflower Pilaf',
    subtitle: 'Ultra-Low Carb · Lean Muscle Synthesis',
    description:
      'Antibiotic-free grilled chicken breast marinated in Pampore saffron and crushed fenugreek over spiced riced cauliflower, pickled onion ribbons, toasted almonds, and cucumber raita.',
    image: '/src/assets/images/meal_chicken_tikka_cauliflower_1795170096240.jpg',
    priceInr: 445,
    servingWeightGrams: 410,
    kcal: 420,
    proteinG: 46,
    carbsG: 19,
    fatsG: 17,
    fiberG: 7,
    sodiumMg: 495,
    glycemicIndex: 24,
    glycemicLoad: 4,
    verificationStatus: 'verified',
    verificationLabel: 'VERIFIED 17 OCT',
    batchCode: 'BLR-K03-315',
    tags: ['Low Glycemic', 'High Protein', 'PCOS Support'],
    bestForSlots: ['Lunch', 'Dinner'],
    allergens: ['Dairy (Cucumber Raita)', 'Tree Nuts (Almonds)'],
    excludedBy: ['Lactose-Free', 'Nut-Free'],
    ingredients: [
      { name: 'Free-Range Saffron Grilled Chicken Breast', provenance: 'Mysuru Certified Poultry', grams: 185 },
      { name: 'Turmeric & Jeera Riced Cauliflower', provenance: 'Hosur Residue-Free Farm', grams: 140 },
      { name: 'Probiotic Cucumber Mint Raita', provenance: 'House Cultured Curd', grams: 55 },
      { name: 'Pickled Red Onions & Slivered Almonds', provenance: 'Kashmir Mamra Harvest', grams: 30 },
    ],
    clinicalNote:
      'Contains 4.1g naturally occurring L-leucine to cross the mTOR muscle protein synthesis threshold with a negligible glycemic load of 4.',
    addons: [
      { id: 'double-chicken', label: 'Extra 75g Saffron Chicken (+21g Protein)', kcalDelta: 120, proteinDelta: 21, priceDelta: 110 },
      { id: 'dairy-free-raita', label: 'Swap Raita for Coconut-Mint Chutney (Dairy-Free)', kcalDelta: 10, proteinDelta: -2, priceDelta: 20 },
      { id: 'no-almonds', label: 'Omit Slivered Almonds (Nut-Free)', kcalDelta: -40, proteinDelta: -1, priceDelta: 0 },
    ],
  },
  {
    id: 'cardamom-chia-parfait',
    name: 'Cardamom Pistachio Chia & Fig Parfait',
    subtitle: 'Slow-Release Energy · Morning Cortisol Balance',
    description:
      'Overnight soaked organic black chia infused with Malabar green cardamom, layered with strained Greek yogurt, fresh Poona figs, peeled almonds, and roasted flaxseed granola.',
    image: '/src/assets/images/meal_cardamom_chia_parfait_1795170000117.jpg',
    priceInr: 295,
    servingWeightGrams: 310,
    kcal: 345,
    proteinG: 21,
    carbsG: 29,
    fatsG: 16,
    fiberG: 12,
    sodiumMg: 120,
    glycemicIndex: 29,
    glycemicLoad: 6,
    verificationStatus: 'estimated',
    verificationLabel: 'ESTIMATED RANGE ±4%',
    batchCode: 'BLR-B01-320',
    tags: ['Low Glycemic', 'PCOS Support', 'Gut Reset', 'Plant-Forward'],
    bestForSlots: ['Breakfast', 'Afternoon Recovery'],
    allergens: ['Dairy (Strained Yogurt)', 'Tree Nuts (Pistachio, Almond)'],
    excludedBy: ['Lactose-Free', 'Nut-Free'],
    ingredients: [
      { name: 'Strained High-Protein Greek Yogurt', provenance: 'House Culture Lab', grams: 135 },
      { name: 'Cardamom Soaked Organic Chia Matrix', provenance: 'Neemuch Certified Organic', grams: 90 },
      { name: 'Fresh Sliced Poona Figs', provenance: 'Purandar Orchard Direct', grams: 50 },
      { name: 'Roasted Pistachio, Almond & Flax Crumble', provenance: 'Zero-Sugar House Bake', grams: 35 },
    ],
    clinicalNote:
      'Rich in alpha-linolenic acid (ALA) and mucilage soluble fiber to blunt morning cortisol-driven glycemic spikes without added refined sweeteners.',
    addons: [
      { id: 'whey-isolate', label: 'Blend Unflavored Whey Isolate (+12g Protein)', kcalDelta: 60, proteinDelta: 12, priceDelta: 65 },
      { id: 'coconut-yogurt', label: 'Swap to Probiotic Coconut Yogurt (Dairy-Free)', kcalDelta: 25, proteinDelta: -6, priceDelta: 45 },
      { id: 'cacao-nibs', label: 'Raw Idukki Cacao Nibs Sprinkle', kcalDelta: 35, proteinDelta: 1, priceDelta: 30 },
    ],
  },
];

export const INITIAL_WEEK_SCHEDULE: DaySchedule[] = [
  {
    dayKey: 'thu-19',
    weekday: 'Thu',
    dateNum: '19',
    fullDate: 'Thursday, 19 Nov',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'ragi-paneer-bowl',
      'Afternoon Recovery': null,
      Dinner: 'malabar-fish-quinoa',
    },
  },
  {
    dayKey: 'fri-20',
    weekday: 'Fri',
    dateNum: '20',
    fullDate: 'Friday, 20 Nov · Today',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'saffron-chicken-cauliflower',
      'Afternoon Recovery': 'moong-dal-khichdi',
      Dinner: 'malabar-fish-quinoa',
    },
  },
  {
    dayKey: 'sat-21',
    weekday: 'Sat',
    dateNum: '21',
    fullDate: 'Saturday, 21 Nov',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'ragi-paneer-bowl',
      'Afternoon Recovery': null,
      Dinner: 'moong-dal-khichdi',
    },
  },
  {
    dayKey: 'sun-22',
    weekday: 'Sun',
    dateNum: '22',
    fullDate: 'Sunday, 22 Nov',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'malabar-fish-quinoa',
      'Afternoon Recovery': null,
      Dinner: 'saffron-chicken-cauliflower',
    },
  },
  {
    dayKey: 'mon-23',
    weekday: 'Mon',
    dateNum: '23',
    fullDate: 'Monday, 23 Nov',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'saffron-chicken-cauliflower',
      'Afternoon Recovery': null,
      Dinner: 'ragi-paneer-bowl',
    },
  },
  {
    dayKey: 'tue-24',
    weekday: 'Tue',
    dateNum: '24',
    fullDate: 'Tuesday, 24 Nov',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'moong-dal-khichdi',
      'Afternoon Recovery': null,
      Dinner: 'malabar-fish-quinoa',
    },
  },
  {
    dayKey: 'wed-25',
    weekday: 'Wed',
    dateNum: '25',
    fullDate: 'Wednesday, 25 Nov',
    slots: {
      Breakfast: 'cardamom-chia-parfait',
      Lunch: 'ragi-paneer-bowl',
      'Afternoon Recovery': null,
      Dinner: 'saffron-chicken-cauliflower',
    },
  },
];

export const METABOLIC_SERIES: MetabolicDayPoint[] = [
  { day: 'Sat', dateLabel: '14 Nov', peakGlucoseMgDl: 126, fastingGlucoseMgDl: 91, proteinGrams: 108, proteinTarget: 118, glycemicLoad: 38, fiberGrams: 34 },
  { day: 'Sun', dateLabel: '15 Nov', peakGlucoseMgDl: 119, fastingGlucoseMgDl: 89, proteinGrams: 115, proteinTarget: 118, glycemicLoad: 32, fiberGrams: 37 },
  { day: 'Mon', dateLabel: '16 Nov', peakGlucoseMgDl: 122, fastingGlucoseMgDl: 88, proteinGrams: 121, proteinTarget: 118, glycemicLoad: 34, fiberGrams: 39 },
  { day: 'Tue', dateLabel: '17 Nov', peakGlucoseMgDl: 116, fastingGlucoseMgDl: 87, proteinGrams: 124, proteinTarget: 118, glycemicLoad: 29, fiberGrams: 41 },
  { day: 'Wed', dateLabel: '18 Nov', peakGlucoseMgDl: 121, fastingGlucoseMgDl: 88, proteinGrams: 112, proteinTarget: 118, glycemicLoad: 35, fiberGrams: 36 },
  { day: 'Thu', dateLabel: '19 Nov', peakGlucoseMgDl: 114, fastingGlucoseMgDl: 85, proteinGrams: 119, proteinTarget: 118, glycemicLoad: 28, fiberGrams: 42 },
  { day: 'Fri', dateLabel: '20 Nov', peakGlucoseMgDl: 112, fastingGlucoseMgDl: 84, proteinGrams: 126, proteinTarget: 118, glycemicLoad: 26, fiberGrams: 40 },
];

export const LAB_ASSAY_RECORDS: LabAssayRecord[] = [
  {
    id: 'assay-01',
    batchCode: 'BLR-K04-281',
    mealName: 'Tandoori Paneer & Sprouted Ragi Bowl',
    testedDate: '14 Oct 2026',
    labName: 'Eurofins Analytical Services, Bengaluru',
    accreditationId: 'NABL TC-5436',
    giAssay: 36,
    proteinVariancePct: '+1.8%',
    heavyMetals: 'Clear (<0.01 ppm)',
    pesticideResidue: 'Not Detected',
    coldChainTemp: '3.4°C Verified',
    status: 'verified',
    summary:
      'In-vitro starch digestibility assay confirms low glycemic release curve (GI 36 ± 2.1). A2 dairy lipid profile verified free of adulterants and synthetic hormones.',
  },
  {
    id: 'assay-02',
    batchCode: 'BLR-K02-309',
    mealName: 'Malabar Turmeric Sea Bass & Red Quinoa',
    testedDate: '16 Oct 2026',
    labName: 'TUV SUD South Asia Food Lab',
    accreditationId: 'NABL TC-5460',
    giAssay: 31,
    proteinVariancePct: '+2.4%',
    heavyMetals: 'Clear (<0.01 ppm)',
    pesticideResidue: 'Not Detected',
    coldChainTemp: '2.8°C Verified',
    status: 'verified',
    summary:
      'Mercury and cadmium levels verified 8x below FSSAI ceiling. Omega-3 fatty acid chromatography confirms 1,420 mg EPA+DHA per 400g sealed portion.',
  },
  {
    id: 'assay-03',
    batchCode: 'BLR-K01-294',
    mealName: 'Steel-Cut Oat & Yellow Moong Khichdi',
    testedDate: '15 Oct 2026',
    labName: 'Eurofins Analytical Services, Bengaluru',
    accreditationId: 'NABL TC-5436',
    giAssay: 41,
    proteinVariancePct: '+0.9%',
    heavyMetals: 'Clear (<0.01 ppm)',
    pesticideResidue: 'Not Detected',
    coldChainTemp: '4.1°C Verified',
    status: 'verified',
    summary:
      'Aflatoxin and glyphosate screening returned below limit of quantification. Soluble beta-glucan content assayed at 4.6g per serving.',
  },
  {
    id: 'assay-04',
    batchCode: 'BLR-K03-315',
    mealName: 'Saffron Herb Chicken & Cauliflower Pilaf',
    testedDate: '17 Oct 2026',
    labName: 'SGS India Life Sciences Lab',
    accreditationId: 'NABL TC-6021',
    giAssay: 24,
    proteinVariancePct: '+3.1%',
    heavyMetals: 'Clear (<0.01 ppm)',
    pesticideResidue: 'Not Detected',
    coldChainTemp: '3.1°C Verified',
    status: 'verified',
    summary:
      'Zero antibiotic residue (tetracycline/fluoroquinolone panel negative). Kjeldahl nitrogen assay confirms 46.2g bioavailable protein per bowl.',
  },
  {
    id: 'assay-05',
    batchCode: 'BLR-B01-320',
    mealName: 'Cardamom Pistachio Chia & Fig Parfait',
    testedDate: 'Scheduled 22 Nov',
    labName: 'Aahara In-House Nutritional Calculation',
    accreditationId: 'USDA / ICMR-NIN Ref',
    giAssay: 29,
    proteinVariancePct: '±4.0% Est.',
    heavyMetals: 'Clear (<0.01 ppm)',
    pesticideResidue: 'Not Detected',
    coldChainTemp: '3.9°C Verified',
    status: 'estimated',
    summary:
      'Seasonal fresh Poona fig harvest introduces minor natural fructose variance (±4%). Full NABL batch verification scheduled following orchard lot lock.',
  },
];

export const CLINICAL_DIETITIANS: ClinicalDietitian[] = [
  {
    id: 'dt-kavya',
    name: 'Dr. Kavya Nair',
    credentials: 'RD, CDE · PhD Metabolic Nutrition',
    specialty: 'Glycemic Control & Type-2 Reversal',
    cityHub: 'Indiranagar Clinical Studio',
    experienceYears: 12,
    nextSlots: ['Today, 4:30 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:15 PM'],
    consultationFeeInr: 0,
  },
  {
    id: 'dt-meenakshi',
    name: 'Meenakshi Deshmukh',
    credentials: 'MSc Clinical Dietetics · IDA Registered',
    specialty: 'PCOS Insulin Sensitivity & Gut Microbiome',
    cityHub: 'Bandra West Hub · Tele-Consult',
    experienceYears: 9,
    nextSlots: ['Today, 6:00 PM', 'Tomorrow, 11:30 AM', 'Sun, 10:30 AM'],
    consultationFeeInr: 0,
  },
  {
    id: 'dt-arjun',
    name: 'Dr. Arjun Subramanian',
    credentials: 'MBBS, PG Dip Sports & Lipid Nutrition',
    specialty: 'Lean Body Recomposition & ApoB Optimization',
    cityHub: 'Koramangala Clinical Studio',
    experienceYears: 11,
    nextSlots: ['Tomorrow, 9:15 AM', 'Tomorrow, 5:00 PM', 'Mon, 11:00 AM'],
    consultationFeeInr: 499,
  },
];

export const ALLERGEN_EXCLUSIONS = [
  'Lactose-Free',
  'Nut-Free',
  'Gluten-Free',
  'No Refined Oils',
  'Low FODMAP',
] as const;

export const CLINICAL_GOALS: {
  id: ClinicalGoal;
  summary: string;
  proteinRatio: string;
  targetGl: number;
}[] = [
  {
    id: 'Glycemic Control',
    summary: 'Stabilize post-meal glucose < 130 mg/dL via low-GI millets and viscous fiber.',
    proteinRatio: '30% Protein · 35% Complex Carb · 35% Fat',
    targetGl: 35,
  },
  {
    id: 'Lean Muscle Synthesis',
    summary: 'Hit > 120g daily leucine-rich protein across 3–4 metabolic meal windows.',
    proteinRatio: '38% Protein · 32% Complex Carb · 30% Fat',
    targetGl: 45,
  },
  {
    id: 'PCOS Hormonal Balance',
    summary: 'Anti-inflammatory omega-3 lipids paired with slow-release insulin-sparing bowls.',
    proteinRatio: '32% Protein · 30% Complex Carb · 38% Fat',
    targetGl: 32,
  },
  {
    id: 'Cardiometabolic Health',
    summary: 'ApoB-friendly soluble beta-glucans, low sodium (< 1,800 mg), and potassium balance.',
    proteinRatio: '28% Protein · 42% Complex Carb · 30% Fat',
    targetGl: 40,
  },
];
