# Data Structure: LOC Recipe

## 1. Overview

The app uses **Firebase Firestore** for data, **Cloud Storage** for recipe images and **Firebase Auth** for users. All data lives under the owning user's document. A special **library account** (`globalUserId` in `src/app/config/firebase.ts`) holds the shared library: copies of recipes that users have published.

```
Firebase Project: loc-recipe
│
├── Auth                      email/password and Google accounts
├── Firestore
│   └── users/{uid}           profile: { displayName, email }
│       ├── recipe/{id}       the user's recipes
│       └── dailySchedule/{weekday}
│   └── users/{globalUserId}/recipe/{id}   shared library (published copies)
└── Storage
    ├── recipe/{uid}/{uuid}-{filename}     uploads (current)
    └── recipe/{filename}                  older uploads (read-only)
```

Access rules: see `firestore.rules`, `storage.rules`, and section 4 of `spec.md`.

---

## 2. Core Data Models

### 2.1 Recipe

**Collection:** `users/{uid}/recipe` (own) and `users/{globalUserId}/recipe` (shared library)
**Document ID:** auto-generated. A published copy keeps the **same ID** as the original, so the merged list in `fetchAllRecipes` prefers the user's own copy.

```typescript
interface Recipe {
  recipeId?: string;          // Firestore document ID (not stored in the doc)
  name: string;
  prepTime?: number;          // minutes
  cookTime?: number;          // minutes
  servings?: number;
  mealType?: string[];        // "breakfast" | "lunch" | "dinner"
  ingredients?: Ingredients[];
  steps?: string[];           // ordered
  ageGroup?: string[];        // "adult" | "kids"
  nutrition?: {               // per serving
    calories?: number; protein?: number; carbohydrates?: number;
    fats?: number; fiber?: number; sugar?: number;   // grams except calories
  };
  imageUrl?: string;          // Storage download URL, or an imported site's image URL
  isPublic?: boolean;         // true when a copy exists in the shared library
  createdAt?: Date;
  createdBy?: string;         // author uid (required by the rules)
  createdByName?: string;     // author display name, shown on cards
}
```

**Ingredients**
```typescript
type Ingredients = {
  name: string;      // "flour"
  quantity: number;  // leading number of the amount, or 0 if none
  unit: string;      // rest of the amount as typed: "cups", "½ tsp", "a pinch"
}
```
The form has a single free-text amount field. `splitAmount()` in `src/app/utils/ingredientUtils.ts` stores a leading plain number as `quantity` and keeps the remainder in `unit`; `joinAmount()` reverses it for editing. Fractions stay in `unit` so they display exactly as typed.

**Example**
```json
{
  "name": "Chicken Curry",
  "prepTime": 15, "cookTime": 30, "servings": 4,
  "mealType": ["lunch", "dinner"],
  "ageGroup": ["adult"],
  "ingredients": [
    { "name": "chicken breast", "quantity": 500, "unit": "g" },
    { "name": "curry paste", "quantity": 2, "unit": "tbsp" },
    { "name": "salt", "quantity": 0, "unit": "a pinch" }
  ],
  "steps": ["Dice the chicken.", "Fry the paste.", "Add chicken and simmer."],
  "nutrition": { "calories": 320, "protein": 38, "carbohydrates": 12, "fats": 14, "fiber": 2 },
  "imageUrl": "https://firebasestorage.googleapis.com/...",
  "isPublic": false,
  "createdAt": "2026-01-15T10:30:00Z",
  "createdBy": "uid_xyz789",
  "createdByName": "Kshitij"
}
```

### 2.2 DailySchedule

**Collection:** `users/{uid}/dailySchedule`
**Document ID:** weekday value (`"monday"` … `"sunday"`)

```typescript
interface DailySchedule {
  scheduleId?: string;   // document ID (mirrors weekday)
  weekday: string;
  breakfast: string[];   // recipe IDs (own or shared library)
  lunch: string[];
  dinner: string[];
}
```
`updateSchedule` writes one slot with `merge: true` and de-duplicates the IDs. IDs that no longer resolve to a recipe (e.g. deleted) are skipped when the schedule is displayed.

---

## 3. Constants (`src/app/data/ConstData.ts`)

- `WEEK_DAYS` – ordered `{ id, name, value }` for Monday–Sunday
- `MEAL_TYPES` – `["breakfast", "lunch", "dinner"]`
- `DEFAULT_RECIPE` – empty recipe used as a placeholder

---

## 4. Derived Structures

**Mapped schedule** – `mapAllRecipesToSchedule(recipes, schedules)` returns
`Record<weekday, Record<MealType, Recipe[]>>`, with every weekday present and duplicate or unknown IDs skipped.

---

## 5. Firebase Helpers

### Recipe (`src/app/utils/firebaseUtils/Recipe.ts`)

| Function | Description |
|---|---|
| `fetchAllRecipes(uid?)` | Shared library merged with the user's own recipes |
| `findRecipeById(recipes, id)` | Find in an already-loaded list |
| `uploadImage(file, uid)` | Validate type/size, upload to `recipe/{uid}/…`, return download URL |
| `addRecipeToFirebase(recipe, uid)` | Create in `users/{uid}/recipe` |
| `updateRecipeInFirebase(id, recipe)` | Update the owner's copy, and the library copy if public |
| `toggleRecipePublic(recipe)` | Publish (copy to library) or unpublish (delete copy) |
| `deleteRecipeFromFirebase(id, ownerUid, isPublic)` | Delete the recipe and any library copy |

### DailySchedule (`src/app/utils/firebaseUtils/DailySchedule.ts`)

| Function | Description |
|---|---|
| `fetchAllDailySchedules(uid)` | All weekday docs for the user |
| `updateSchedule(weekday, mealType, ids, uid)` | Replace one slot; throws on failure |
| `mapAllRecipesToSchedule(recipes, schedules)` | Build the mapped schedule |

### User (`src/app/utils/firebaseUtils/User.ts`)

| Function | Description |
|---|---|
| `registerWithEmail(name, email, password)` | Create account and profile |
| `authenticateUser(email, password)` | Email sign-in |
| `signInWithGoogle()` / `handleGoogleRedirectResult()` | Google sign-in (popup or redirect) |
| `saveUserProfile(uid, name, email)` / `getUserDisplayName(uid)` | Profile doc |
| `sendPasswordReset(email)` | Reset email |
| `getSignedInUser()` / `logoutUser()` | Session |

---

## 6. Recipe Import

`POST /api/import-recipe` with `{ url }` and an `Authorization: Bearer <Firebase ID token>` header.

1. The token is verified server-side; unsigned requests get 401.
2. The URL must be http(s) and resolve to a public address (private, loopback and link-local ranges are refused, including after redirects); responses are capped at 3MB.
3. The page is parsed for schema.org `Recipe` JSON-LD, falling back to microdata (`src/lib/importRecipe/parse.ts`).
4. The response pre-fills the Add Recipe form; nothing is saved until the user submits.
