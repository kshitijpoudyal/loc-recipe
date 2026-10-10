# Lochu's Kitchen (loc-recipe)

A recipe library and weekly meal planner. Add your own recipes (or import them
from a recipe website), browse the shared library, and plan breakfast, lunch and
dinner for each day of the week. Installable as a PWA.

Built with Next.js (App Router), React, Tailwind CSS and Firebase
(Auth, Firestore, Storage).

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | What it does                                  |
|:----------------|:----------------------------------------------|
| `npm run dev`   | Start the dev server (Turbopack)              |
| `npm run build` | Production build                              |
| `npm start`     | Serve the production build                    |
| `npm run lint`  | ESLint (flat config in `eslint.config.mjs`)   |
| `npm test`      | Unit tests with Vitest                        |

## Project layout

```
src/app/                 pages, components, Firebase helpers (see data-structure.md)
src/app/api/import-recipe  server route that imports a recipe from a URL
src/lib/importRecipe/    importer parsing helpers and safe fetching
firestore.rules          Firestore security rules
storage.rules            Cloud Storage security rules
```

## Firebase

The web config in `src/app/config/firebaseConfig.ts` is public by design; what
protects the data is the security rules. Deploy rule changes with the Firebase
CLI:

```bash
firebase deploy --only firestore:rules,storage
```

## Docs

- `spec.md` – product spec and feature status
- `data-structure.md` – Firestore / Storage data model
- `design.md` – design system
