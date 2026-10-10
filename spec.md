# Product Spec: Meal Planner App

## 1. Purpose

A meal planning and recipe management tool that helps users organize meals across a weekly schedule. Users can create and store recipes, categorize them by meal type, and assign them to specific days and meal slots.

**Primary audience:** Individuals and families planning their own meals.

Each user has a **private** recipe collection and weekly schedule. Users can publish a recipe to a **shared library** that everyone can browse and add to their own plan.

---

## 2. Feature Scope

### Done

| Feature | Notes |
|---|---|
| Sign in / register / sign out | Email + password or Google, via Firebase Auth |
| Forgot password | Password-reset email |
| Protected routes | Planner, add recipe and mock-data pages require sign-in |
| Add recipe | Full form: image, ingredients, steps, nutrition, meal type, age group |
| Import recipe from a URL | Server route reads schema.org JSON-LD or microdata; requires sign-in |
| Import recipe from pasted JSON | Same fields as the form |
| Edit and delete own recipes | Owner only |
| Publish / unpublish a recipe | Copies the recipe into the shared library |
| Browse, search and filter recipes | Home page; filter by meal type or "my recipes" |
| Recipe details | Modal with ingredients, steps, nutrition, image |
| Weekly meal schedule | Per user; current weekday selected by default |
| Assign recipes to a day + meal slot | Picker with search and filters; deselect to remove |
| Installable PWA | Manifest + service worker |
| Responsive layout | Mobile-first, adapts to desktop |

### Planned

| Feature | Notes |
|---|---|
| Shared `RecipeForm` component | Add and Edit duplicate the same form; mobile and desktop markup is also duplicated |
| Week-specific schedules | Today the plan is a single repeating week |

---

## 3. User Flows

### 3.1 Authentication

1. Visitors can browse the shared library on the home page without signing in.
2. Protected pages redirect signed-out users to `/login`.
3. Users sign in with email + password or Google (popup on desktop, redirect on mobile).
4. New users register at `/register`; a profile (`users/{uid}`) stores the display name.
5. `/forgot-password` sends a reset email.

### 3.2 Recipe Management

**Create**
1. `/add-recipe`: optionally import from a URL or pasted JSON to pre-fill the form.
2. Fill in name, times, servings, meal type, age group, ingredients (amount + name), steps, nutrition and an image.
3. On save: the image (if any) is uploaded, then the recipe is written to `users/{uid}/recipe`.
4. A success or error message is shown; on success the form is cleared.

**Browse**
- The home page lists the shared library plus the user's own recipes, with a daily featured pick, search and filters.

**Edit / Delete / Publish** (owner only)
- From the details modal. Edits to a published recipe are also written to its shared-library copy.
- Deleting or unpublishing removes the shared-library copy.

### 3.3 Weekly Schedule

1. `/daily-schedule` loads the user's recipes and their 7 weekday documents.
2. Each day has breakfast, lunch and dinner slots.
3. The "add" button on a slot opens a picker (search, meal and owner filters) with current recipes pre-selected.
4. Saving writes the full list of recipe IDs for that slot; the day refreshes in place.
5. If a save fails, the picker stays open and shows an error.

---

## 4. Access Rules

Enforced by `firestore.rules` and `storage.rules`.

| Data | Read | Write |
|---|---|---|
| `users/{uid}` profile | Owner | Owner |
| `users/{uid}/recipe` | Owner | Owner (`createdBy` must equal owner) |
| `users/{uid}/dailySchedule` | Owner | Owner |
| Shared library recipes | Anyone | The recipe's author (`createdBy`), or the library account |
| Recipe images | Signed-in users (and anyone holding a download URL) | Uploader, in their own folder, images ≤ 10MB |
| `/mock-data` page | Library account only | — |

---

## 5. Non-Functional Requirements

### Performance
- Async actions (recipe fetch, schedule load, image upload) must show a loading state.
- Target: page content visible within a few seconds on a standard connection.

### Error Handling
- Errors must be surfaced to the user via UI feedback (e.g., inline messages, toasts).
- `alert()` and `console.error()`-only error handling is not acceptable in production.

### Image Uploads
- Accepted formats: PNG, JPG, GIF, WebP
- Maximum file size: 10MB (checked in the app and in `storage.rules`)
- Stored at `recipe/{uid}/{uuid}-{filename}` in Firebase Cloud Storage; download URL saved on the recipe
- Imported recipes may instead link to the source site's image URL

### Responsive Design
- Mobile-first. Layouts adapt from single-column (mobile) to multi-column (tablet/desktop).
- Minimum 32px horizontal margin on mobile screens.

### Accessibility
- All form inputs must have associated `<label>` elements.
- Interactive elements must be keyboard-navigable.
- Color contrast must meet WCAG AA as a baseline.
- Decorative icons should use `aria-hidden="true"`.

### Not Required
- Offline support
- Pagination
- Advanced search or filtering
- Real-time collaborative updates

---

## 6. Known Gaps

| Issue | Location | Impact |
|---|---|---|
| Add/Edit forms duplicated, plus separate mobile and desktop markup | `AddRecipe.tsx`, `EditRecipe.tsx`, `DailySchedule.tsx` | Changes must be made in several places |
| Data loading inside effects | `RecipeProvider`, `DailySchedule`, `PWAInstallProvider` | Shown as React Compiler lint warnings |
| Fractional amounts stored as text | Ingredient `unit` field | "½ cup" keeps `quantity: 0`, so amounts can't be scaled yet |
| Old images at `recipe/{filename}` | Cloud Storage | Read-only; new uploads use per-user folders |

---

## 7. Out of Scope

- Real-time collaboration
- Offline editing
- Notifications or reminders
- Grocery list generation
- Pantry / inventory tracking
