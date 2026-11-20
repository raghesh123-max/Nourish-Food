---
name: Clinical Culinary Vitality
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3f4943'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707973'
  outline-variant: '#bfc9c1'
  surface-tint: '#246a4f'
  primary: '#00442f'
  on-primary: '#ffffff'
  primary-container: '#135d43'
  on-primary-container: '#8ed4b2'
  inverse-primary: '#90d5b4'
  secondary: '#a73918'
  on-secondary: '#ffffff'
  secondary-container: '#fe7952'
  on-secondary-container: '#6c1900'
  tertiary: '#144231'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d5a47'
  on-tertiary-container: '#a0cfb8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#abf1cf'
  primary-fixed-dim: '#90d5b4'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#005139'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862201'
  tertiary-fixed: '#bcedd5'
  tertiary-fixed-dim: '#a1d1b9'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#224f3d'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system balances clinical dietary rigor with culinary warmth, specifically tailored for health-conscious users in fast-paced Indian metropolitan markets. It rejects sterile hospital aesthetics and overly rustic earthy tones in favor of an authoritative, science-backed nutritional lifestyle experience. 

The visual movement combines modern clinical minimalism with high-end wellness editorial structure:
- **Clinical Integrity:** Data points, glycemic indices, macro splits, and verification markers are rendered with laboratory precision, strict alignments, and scannable visual anchors.
- **Culinary Warmth:** Backgrounds avoid cold blue-whites, leaning instead into gentle warm oat and sandstone undertones to evoke wholesome preparation and kitchen hospitality.
- **Emotional Resonance:** Users should feel assured, empowered, and nourished—free from nutritional guesswork, supported by certified dietary credibility.

## Colors
The palette bridges therapeutic health standards and appetizing meal delivery. High color contrast ensures compliance with WCAG AA accessibility standards across mobile OLED and LCD displays under variable lighting conditions.

### Palette Architecture
- **Primary Emerald (`#135D43`):** Communicates verification, biological vitality, and scientific wellness. Used for top-level brand actions, verified shields, primary state indications, and key nutritional approvals.
- **Deep Forest (`#0E3E2D`):** Tertiary anchor for high-emphasis editorial headers, dark clinical badges, and high-contrast typographic callouts.
- **Warm Terracotta / Apricot (`#D95D39`):** Secondary culinary accent reserved exclusively for high-intent conversion actions (e.g., "Add to Diet Plan", checkout triggers) and urgent micro-interactions.
- **Canvas & Surface Tier:**
  - Base Screen Background: Oatmeal Sand (`#FBF9F5`)
  - Elevated Underlays & Segment Controls: Soft Bone (`#F4F1EA`)
  - Card & Interactive Modules: Pure Clinical White (`#FFFFFF`)
  - Structural Hairlines & Borders: Stone Divider (`#E8E4DC`)
- **Typography & Neutral Scales:**
  - Primary Content / Titles: Slate Charcoal (`#1F2937`)
  - Secondary Nutrients / Descriptions: Mid Slate (`#4B5563`)
  - Placeholder & De-emphasized Annotations: Muted Slate (`#9CA3AF`)

## Typography
The system employs a dual-typeface structure to articulate clinical authority alongside friendly dietary accessibility:

- **Headlines (`Space Grotesk`):** Provides structured geometric precision, subtle technical nuance, and crisp metrics for meal titles, calorie totals, and clinical lab highlights.
- **Body & Labels (`Plus Jakarta Sans`):** Offers open counters, balanced geometry, and high legibility at micro sizes on compact mobile devices. Used for ingredient lists, allergen disclaimers, macro labels, and operational statuses.

### Typographic Hierarchy Rules
- Numerical nutritional data (kcal, protein grams, glycemic scores) should pair bold weights with tighter tabular alignment.
- Verification statements ("Verified Clinical Fit", "Estimated Range") leverage `label-sm` or `caption` with a slight tracking expansion (+0.02em) to ensure legibility when set in uppercase inside badge containers.

## Layout & Spacing
The layout adheres strictly to an 8pt spatial grid system adapted for native iOS and Android form factors.

- **Canvas & Grids:** A 4-column fluid mobile grid with 16px (`1rem`) gutters and 16px screen edge margins. For larger mobile views or foldable screens, the layout expands to 6 columns while maintaining a max readable width of 480px for core card contents.
- **Vertical Rhythm:**
  - `space-xs` (4px): Micro-gaps between related badge icons and text.
  - `space-sm` (8px): Distances between title and descriptive metadata, or internal button icon-to-label spacing.
  - `space-md` (16px): Default padding within white container cards and separation between sequential list items.
  - `space-lg` (24px): Padding between distinct meal card modules and sectional categories.
  - `space-xl` (32px): Major thematic transitions (e.g., moving from daily meal schedule into metabolic progress).

## Elevation & Depth
The design system avoids heavy drop shadows to prevent visual fatigue and clutter. Instead, it relies on soft tonal layers, crisp card separations, and delicate border lines.

- **Surface Tiers:**
  - **Level 0 (Background Canvas):** Warm Oat Sand (`#FBF9F5`), flat and unbordered.
  - **Level 1 (Clinical Cards & Sheets):** Pure White (`#FFFFFF`) with a 1px continuous hairline outline using `#E8E4DC`. Shadows are absent by default to preserve a clinical, printed editorial feel.
  - **Level 2 (Interactive Floating CTAs & Modals):** Pure White (`#FFFFFF`) lifted by an ambient, diffused shadow: `box-shadow: 0 8px 24px -4px rgba(19, 93, 67, 0.08)`. The shadow is tinted with the Primary Emerald hue rather than pure black to maintain chromatic warmth.

## Shapes
Geometry is modern, approachable, and humanized without losing architectural integrity:
- **Cards & Content Modules:** Styled with `rounded-2xl` (16px / `1rem`), providing a soft, protective feel for nutrition containers.
- **Buttons & Input Elements:** Built with `rounded-xl` (12px / `0.75rem`), maintaining structured touch targets.
- **Badges & Micro Chips:** Utilize full pill geometry (`rounded-full` / `9999px`) to immediately convey status, diagnostic verifications, and dietary tags.

## Components

### Buttons
- **Primary Conversion Button:** Background in Terracotta (`#D95D39`), text in Pure White (`#FFFFFF`), `rounded-xl`, height 52px for mobile ergonomics. Active states depress slightly (`scale(0.98)`).
- **Secondary / Action Button:** Background in Primary Emerald (`#135D43`), text in Pure White (`#FFFFFF`), `rounded-xl`.
- **Outline / Nutritional Detail Button:** 1px border in `#E8E4DC`, background transparent or `#FFFFFF`, text in `#1F2937`.

### Verification & Status Badges
- **Verified Clinical Badge:** Pill shape (`rounded-full`), background in `#EBF3F0` (light tint of primary), 1px border in `#135D43` at 20% opacity. Contains a green shield check icon followed by uppercase `label-sm` text (e.g., "VERIFIED 14 OCT").
- **Estimated Metric Badge:** Pill shape (`rounded-full`), background in `#F4F1EA`, 1px border in `#E8E4DC`, text in Slate Grey (`#4B5563`).

### Cards & Nutrition Modules
- Built on `#FFFFFF` base, `rounded-2xl`, with a 1px solid `#E8E4DC` border.
- Cards host segmented macro-split bars: thin 4px horizontal bars color-coded for protein, carbs, and healthy fats.
- Micro-copy beneath titles highlights dietary compatibility (e.g., "Low Glycemic • Certified Diabetic Friendly").

### Form Controls (Inputs, Checkboxes, Radios)
- **Text Inputs:** Height 48px, background `#FFFFFF`, 1px border `#E8E4DC`, `rounded-xl`. On focus, border shifts to `#135D43` with a 2px outer ring in `#135D43` at 15% opacity.
- **Checkboxes & Radios:** Emerald fill (`#135D43`) with crisp white check/dot markers when selected. Inactive state features an unselected border in `#9CA3AF`.

### Specialized Health Food Delivery Modules
- **Macro Split Pill:** Multi-segment pill visualizer displaying numeric grams alongside a color dot indicator.
- **Dietary Restriction Filter Chips:** Pill-shaped toggle chips with gentle `#F4F1EA` inactive backgrounds, converting to `#135D43` with white text when active.