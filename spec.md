# Product Spec: Meal Planner App

## 1. Purpose

A meal planning and recipe management tool that helps users organize meals across a weekly schedule. Users can create and store recipes, categorize them by meal type, and assign them to specific days and meal slots.

**Primary audience:** Individuals planning their own meals.

The app operates as a **shared workspace** — all authenticated users interact with the same public recipe library and the same weekly schedule. There is no per-user data isolation.

---

## 2. Feature Scope

### Done

| Feature | Notes |
|---|---|
| User authentication (login / logout) | Email + password via Firebase Auth |
| Protected routes | All routes except `/login` require authentication |
| Add new recipe | Full form with image, ingredients, steps, nutrition, meal type, age group |
| Upload recipe images | PNG, JPG, GIF up to 10MB via Firebase Storage |
| View recipe list | Responsive grid of recipe cards |
| View recipe details | Modal overlay with full recipe info |
| Weekly meal schedule | Accordion view, one section per day |
| Assign recipes to day + meal slot | Modal picker; saves the full list for that slot |
| Multiple meal types per recipe | A recipe can be tagged as breakfast, lunch, and/or dinner |
| Assign a recipe to multiple days/slots | No restriction on reuse across the schedule |
| Responsive layout | Mobile-first, adapts to desktop |

### Planned (Not Yet Built)

| Feature | Notes |
|---|---|
| Edit recipe | No update function exists yet |
| Delete recipe | No delete function exists yet |
| Remove recipe from a schedule slot | Deselecting in the picker and saving achieves this; needs explicit UX |
| Search recipes | No search on the recipe list |
| Filter recipes | e.g., by meal type, age group |
| Improved validation and error handling | Currently uses `alert()` and `console.error()` |
| User registration UI | `registerUser()` exists but no `/register` route or form |

---

## 3. User Flows

### 3.1 Authentication

1. Unauthenticated users are redirected to `/login` from any protected route.
2. User enters email and password.
3. On success, user is redirected to the home page.
4. Logout clears the session and redirects to `/login`.
5. Registration: currently backend-only (`registerUser()`).

### 3.2 Recipe Management

**Create Recipe**
1. User navigates to `/add-recipe`.
2. Fills in:
   - Name (required)
   - Prep time, cook time, servings
   - Ingredients (added one at a time: name + quantity + unit)
   - Steps (entered as newline-separated text, split into an ordered array on save)
   - Meal type (multi-select: breakfast, lunch, dinner)
   - Age group (multi-select: adult, kids)
   - Nutrition (calories, protein, carbohydrates, fats — per serving)
   - Recipe image (optional upload)
3. On submit: image (if provided) is uploaded to Firebase Storage first; then recipe is saved to Firestore.
4. On success: form is cleared. User stays on the page.

**View Recipes**
1. User navigates to `/list-recipe`.
2. All recipes are fetched and displayed in a responsive grid.
3. Clicking a card opens a detail modal.
4. Modal displays full recipe info (ingredients, steps, nutrition, image).
5. Closing the modal returns to the list.

**Edit / Delete Recipe** *(planned)*
- Not yet implemented. No Firestore update or delete functions exist.

### 3.3 Weekly Schedule

**View Schedule**
1. User navigates to `/daily-schedule`.
2. All recipes and all 7 weekday schedule documents are fetched and joined.
3. Days are displayed as an accordion; the current weekday is expanded by default.
4. Each day shows three meal slots: breakfast, lunch, dinner.
5. Each slot shows assigned recipe cards and an "add" icon.

**Assign Recipes to a Slot**
1. User clicks the "add" icon on any meal slot.
2. A modal opens showing all available recipes.
3. Recipes already assigned to that slot are pre-selected.
4. User toggles recipes on/off.
5. User clicks "Assign."
6. The full recipe ID list for that slot is written to Firestore (`updateSchedule`), replacing the previous list.
7. Page reloads to reflect the change. *(Temporary — will be replaced with in-place state updates.)*

**Remove a Recipe from a Slot** *(planned UX)*
- Achieved by opening the assign modal, deselecting the recipe, and saving.
- Removing a recipe from a slot does not delete the recipe from the library.

**View Recipe Details from Schedule**
- Clicking a recipe card in the schedule opens the recipe detail modal.

---

## 4. Auth Rules — Shared Workspace Model

| Rule | Behaviour |
|---|---|
| Access | All routes except `/login` require a valid Firebase Auth session |
| Recipe visibility | All authenticated users can view all recipes |
| Recipe creation | Any authenticated user can add a recipe |
| Schedule access | The weekly schedule is shared; any authenticated user can modify any slot |
| Data isolation | None — no per-user filtering is enforced |
| `createdBy` field | Present on the data model but **not written** to Firestore today (known gap) |

---

## 5. Non-Functional Requirements

### Performance
- Async actions (recipe fetch, schedule load, image upload) must show a loading state.
- Target: page content visible within a few seconds on a standard connection.

### Error Handling
- Errors must be surfaced to the user via UI feedback (e.g., inline messages, toasts).
- `alert()` and `console.error()`-only error handling is not acceptable in production.

### Image Uploads
- Accepted formats: PNG, JPG, GIF
- Maximum file size: 10MB
- Stored in Firebase Cloud Storage; URL saved on the recipe document

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

## 6. Known Gaps & Issues (Current Implementation)

| Issue | Location | Impact |
|---|---|---|
| `createdBy` not written on recipe create | `Recipe.ts: addRecipeToFirebase()` | No audit trail of who created a recipe |
| `sugar` nutrition field has state but no form input | `AddRecipe.tsx` | Sugar is always saved as `0` |
| No user registration UI | No `/register` route | New users cannot self-register via the app |
| Full page reload after schedule update | `DailySchedule.tsx: callbackAfterRecipeChange()` | Unnecessary UX disruption; should use in-place state update |
| Errors use `alert()` and `console.error()` | `AddRecipe.tsx`, `AssignRecipeToWeekDay.tsx` | Not user-friendly; no in-app error feedback |
| No edit or delete for recipes | `Recipe.ts` | Recipes cannot be corrected or removed once added |
| Schedule not scoped per user | `DailySchedule.ts: fetchAllDailySchedules()` | All users share one global weekly schedule |

---

## 7. Out of Scope

The following will not be built:

- Per-user private recipe libraries
- Real-time collaboration
- Offline mode
- Notifications or reminders
- Grocery list generation
- External recipe import (e.g., from a URL)
- Advanced filtering or recommendations
- Pantry / inventory tracking
- Public recipe sharing
