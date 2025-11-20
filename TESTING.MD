TESTING GUIDE

This file documents how to run the automated tests, E2E tests, manual cross-device checklist, and accessibility guidance for the EduHub project.

1) Backend (API) tests

- Location: `backend/tests`
- Test runner: Jest
- How to run (PowerShell):

```powershell
cd "c:\Users\USER\Documents\MERN PLP\week-8\mern-final-project-Kimberly-ops177\backend"
npm install
npm test
```

Notes:
- Tests use `mongodb-memory-server` so they run without a local MongoDB instance.
- The server is guarded from auto-starting during tests. Tests import the Express `app` from `src/server.js`.

2) Frontend unit tests

- Location: `frontend/src/__tests__`
- Test runner: Jest
- How to run (PowerShell):

```powershell
cd "c:\Users\USER\Documents\MERN PLP\week-8\mern-final-project-Kimberly-ops177\frontend"
npm install
npm test
```

Notes:
- Jest is configured with `babel-jest` and `babel.config.cjs` to handle JSX/ESM.
- Mock providers are used in tests so components that rely on `AuthContext` can be tested without the full provider.

3) End-to-end (E2E) tests

- Location: `frontend/tests` (Playwright)
- How to run (PowerShell):

Start the backend and frontend servers in separate terminals:

```powershell
# Terminal A: Backend
cd "c:\Users\USER\Documents\MERN PLP\week-8\mern-final-project-Kimberly-ops177\backend"
npm run dev

# Terminal B: Frontend
cd "c:\Users\USER\Documents\MERN PLP\week-8\mern-final-project-Kimberly-ops177\frontend"
npm run dev
```

Then run Playwright tests:

```powershell
cd "c:\Users\USER\Documents\MERN PLP\week-8\mern-final-project-Kimberly-ops177\frontend"
npm install
npx playwright install
npm run test:e2e
```

Notes:
- Playwright tests assume the frontend is available at `http://localhost:5173` (adjust `FRONTEND_URL` env var or `playwright.config.cjs`).
- These tests are lightweight smoke tests; expand them to include register/login/enroll flows. For flows requiring the backend, ensure test data exists or create setup scripts.

4) Accessibility

- Automated a11y checks are recommended. Two options:
  - Unit-level: use `jest-axe` in component tests (not currently added due to package version constraints). Requires adding `jest-axe` and small DOM checks.
  - E2E-level: use `axe-core` with Playwright to run accessibility scans across real pages. This is recommended for CI and covers keyboard focus, ARIA, color contrast, etc.

Quick manual accessibility checklist for common issues:
- Ensure all inputs have associated <label> elements.
- Ensure interactive controls are reachable and usable via keyboard (Tab, Enter/Space).
- Use semantic HTML elements where possible (header, main, nav, footer, button, form).
- Provide visible focus styles for interactive elements.
- Provide text alternatives for images (alt attributes).
- Ensure sufficient color contrast for text (WCAG AA).

5) Manual cross-device & browser testing checklist

- Browsers to test: Chrome, Edge, Firefox, Safari (macOS/iOS), Mobile Chrome (Android).
- Devices: Desktop (various widths), Mobile (portrait/landscape), Tablet.
- Flows to manually verify:
  - Register -> Login -> Browse courses -> Enroll in course -> View lessons
  - Instructor flows: create course/module/lesson
  - Responsiveness: navbar, course cards, forms
  - Media: video playback, images
- Network conditions: test on slow 3G throttle and offline fallback for cached pages if applicable.

6) Code review and refactor guidance

- Focus on making controllers and services small and testable.
- Export pure helper functions for logic-heavy code so unit tests can target them without full HTTP wiring.
- Ensure error paths are tested and return useful messages.

7) Quality gates

- Build: `frontend` build via `npm run build` (frontend), backend has no build step beyond linting.
- Lint: Add ESLint if desired and create lint scripts.
- Tests: both backend and frontend `npm test` should be part of CI. Add `npm run test:e2e` for E2E.
