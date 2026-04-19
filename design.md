# Design System: The Digital Epicurean



## 1. Overview & Creative North Star



**Creative North Star: "The Curated Greenhouse"**



This design system rejects the clinical, "app-like" feel of standard recipe managers in favor of a high-end editorial experience. It is designed to feel like a premium lifestyle magazine brought to life—organic, breathing, and intentionally tactile.



We break the "template" look by embracing **Intentional Asymmetry**. Instead of rigid, centered grids, we use staggered image placements and varying container heights to mimic a chef's prep table. We prioritize "white space" as an active ingredient, not just a void. By utilizing overlapping elements—such as a recipe image bleeding slightly off-grid or a floating "Prep Time" chip resting on a card's edge—we create a sense of depth and culinary artistry.



---



## 2. Colors



Our palette is inspired by fresh produce and natural light. It moves beyond flat fills to embrace tonal depth.



### The "No-Line" Rule

**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections or cards. Boundaries must be defined solely through background shifts.

*   **Method:** Place a `surface_container_lowest` card atop a `surface_container_low` background. The change in luminance is your "border."



### Surface Hierarchy & Nesting

Treat the UI as physical layers of fine stationery.

*   **Level 0 (Base):** `surface` (#f8faf6) for the overall page background.

*   **Level 1 (Sections):** `surface_container_low` (#f2f4f0) for large structural areas like a meal plan sidebar.

*   **Level 2 (Cards):** `surface_container_lowest` (#ffffff) for individual recipe cards to make them "pop" with clean light.

*   **Level 3 (Interactive):** `surface_container_highest` (#e1e3df) for active states or drawer handles.



### The "Glass & Gradient" Rule

To evoke the freshness of a garden, use **Glassmorphism** for floating navigation bars or quick-action overlays. Use `surface` at 80% opacity with a `24px` backdrop blur.

*   **Signature Textures:** For high-impact CTAs (e.g., "Start Cooking"), use a subtle linear gradient from `primary` (#3c692f) to `primary_container` (#76a665) at a 135° angle. This adds a "soulful" shimmer that flat buttons lack.



---



## 3. Typography



The interplay between the "Friendly Serif" and "Clean Sans" is the backbone of our editorial authority.



*   **Display & Headlines (Noto Serif):** Used for the "Soul." These should be set with tighter letter-spacing (-0.02em) to feel like a printed cookbook. Use `headline-lg` for recipe names to convey warmth and tradition.

*   **Titles & Body (Plus Jakarta Sans):** Used for the "Science." This typeface is chosen for its high x-height and modern geometry. Use `body-lg` for ingredient lists and `title-md` for instructional steps to ensure maximum legibility during active cooking.

*   **Hierarchy Note:** Always pair a `display-sm` heading with a `label-md` uppercase subheader (using `on_surface_variant`) to create a professional, tiered information architecture.



---



## 4. Elevation & Depth



We avoid the "shadow-heavy" look of the early 2010s. Depth is achieved through **Tonal Layering**.



*   **The Layering Principle:** Instead of a shadow, use `surface_container_high` (#e7e9e5) to suggest an inset area (like a bowl on a counter).

*   **Ambient Shadows:** For elements that truly "float" (e.g., a Bottom Sheet or a FAB), use a custom shadow: `0px 12px 32px rgba(25, 28, 26, 0.06)`. This uses the `on_surface` color as a tint, mimicking natural, diffused kitchen light.

*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast modes), use `outline_variant` (#c2c9ba) at **20% opacity**. It should be felt, not seen.



---



## 5. Components



### Buttons

*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) rounded corners. No border.

*   **Secondary:** `secondary_container` (#fda465) background with `on_secondary_container` text. This "warm orange" should be used for secondary actions like "Add to Plan."

*   **Tertiary:** Ghost style. No background, just `primary` text with an icon.



### Cards (Recipe & Meal Plan)

*   **Construction:** `surface_container_lowest` background, `lg` (1rem) rounded corners.

*   **Rule:** No dividers. Use 24px of vertical padding to separate the image, title, and "Time to Cook" metadata.



### Input Fields

*   **Style:** Minimalist. `surface_container_high` background with a `none` border. On focus, transition the background to `surface_container_lowest` and add a `2px` "Ghost Border" using the `primary` color at 40% opacity.



### The "Flavor" Chip

*   **Usage:** For tags like "Vegan" or "Quick." Use `tertiary_fixed` (#ebe2ce) with `on_tertiary_fixed_variant` (#4c4638) text. These earthy tones provide a sophisticated contrast to the vibrant greens and oranges.



### Contextual Components for Meal Planning

*   **The "Floating Pantry" Drawer:** A semi-transparent (`80%`) glass container that slides from the bottom, allowing the recipe list to blur softly behind it.

*   **Progressive Ingredient Check:** Instead of a standard checkbox, use a `primary_fixed` (#bdf1a8) circle that fills with a checkmark animation, providing a "satisfying" tactile feel.



---



## 6. Do's and Don'ts



### Do

*   **DO** use `xl` (1.5rem) rounded corners for main containers to keep the vibe "friendly and soft."

*   **DO** use `secondary` (warm orange) sparingly as an accent to draw the eye to "Aromatic" elements (e.g., "Special Offers" or "Chef's Notes").

*   **DO** leave at least 32px of margin on mobile screens to ensure the "Airy" feel is maintained.



### Don't

*   **DON'T** use black (#000000). Always use `on_surface` (#191c1a) for text to keep the palette organic.

*   **DON'T** use 1px dividers between list items. Use a 12px gap and a subtle background shift to `surface_container_low` for every other item if necessary.

*   **DON'T** use "Standard Blue" for links. All interactive elements must stay within the Green/Orange/Earth tone spectrum.
