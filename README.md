# Finchglow Group Staff Portal (prototype)

One front door for staff across the group. An employee signs in once, sees the alerts that matter to them, reads company news, searches, and launches the tools they use. Switching company re-brands the page and filters the content, but group-wide alerts always stay visible.

This is a front-end prototype. There is no real backend: a small mock API serves invented sample data.

## Run it

```bash
yarn install
yarn dev        # http://localhost:5173
yarn test       # 190 tests
yarn lint
yarn build      # production build into dist/
yarn preview    # serve the production build
```

I developed on Node 24 and use yarn.

**Demo controls:** open `http://localhost:5173/?demo=1` to get a small panel with "Simulate failure", "Slow network", "Break news search" (the search still shows apps) and "Refresh now". It is only loaded when `?demo=1` is in the address.

**Shared device:** open `http://localhost:5173/?device=shared&idle=20` to see the shared-tablet bar. It warns, then signs the person out after 20 seconds without a tap or key press, and removes the saved copies. Without `idle` the wait is 5 minutes.

**Search:** press Command+K (Control+K on Windows and Linux) from anywhere, or press the search field.

## Assumptions I made

1. **Brands.** The brief describes six businesses by type and does not name them. I used the group's public brand names and logos from finchglowholdings.com and mapped them to the brief's roles from the descriptions on that site:

   | Brief | Used here |
   |---|---|
   | Online travel agency | Travelden |
   | B2B platform for agents | Finchglow Travels (described on the site as a travel consolidator selling to agencies) |
   | Travel management company | FCM Travel Nigeria |
   | Holidays company | Finchglow Holidays |
   | Academy | Lagos Aviation Academy |
   | Shared facilities | Finchglow Shared Services, shown with the group logo. The site lists no facilities company |

   This mapping is my interpretation, not an official one. Changing any of it means editing one file (see "Adding a seventh subsidiary"). Logos and names belong to Finchglow Holdings and its brands and are used only for this exercise.
2. **Sample data is invented.** Alerts, news, apps and the employee ("Amara") are made up. This includes which apps each company gets, the "what it affects" labels on alerts (for example "Payments failing") and the "waiting for you" counts on some apps. The brief does not say which apps a company has, so that mapping is mine and lives in `configs/apps.ts`.
3. **"Signed in" is simulated.** The mock API returns the employee, as an identity provider would after sign-in.
4. **Brand colours.** I started from each brand's real logo colour. Where it was too light to read (below 4.5:1 against white) I darkened it, keeping the hue, so the portal meets WCAG AA. For example Travelden's orange `#f98836` is 2.4:1 on white, so the portal uses `#be5306`.
5. **A shared device is simulated.** In a real build the device set-up or the sign-in service would say that a tablet is shared. Here `?device=shared` stands in for it, and `getSharedDevice` in `features/device/helpers/deviceConfig.ts` is the only place that knows.
6. **Third-party assets.** The icons are a few from [Lucide](https://lucide.dev) (ISC licence), copied into small components. The font is Plus Jakarta Sans (SIL Open Font Licence, licence file in `public/fonts`), self-hosted.

## What the brief asked for, and where it lives

| Requirement | Where |
|---|---|
| Personalised greeting, company, launcher grid | `features/home`, `features/launcher` |
| Alerts and news with three severities, critical impossible to miss | `features/alerts` (the red band and the service status strip), `features/updates` (the Alerts and news card) |
| Company switcher that re-themes and filters, group alerts stay visible | `features/company`, `context/CompanyProvider.tsx`, `utils/helpers/visibility.ts` |
| Search across apps and news with empty and loading states | `features/search`, `services/mockSearch.ts` |
| Responsive and accessible (WCAG 2.1 AA) | whole app, notes in `docs/accessibility.md` |
| **Extra: offline-friendly behaviour**, including a shared-device mode that clears saved data | `features/offline`, `features/device`, `hooks/useCachedAsync.ts` |
| A seventh subsidiary by configuration, not copied code | `configs/companies.ts` |
| Error handling and loading states, API sometimes fails | `hooks/useAsync.ts`, `components/ui` |
| A few meaningful tests | 190 tests, next to the code they test |
| Bundle size and how it was kept small | below, and `docs/performance.md` |
| Sign-in plan, no secrets | below |

## How it is organised

```
src/
  App.tsx, main.tsx
  components/    building blocks shared by several screens
    ui/  layouts/  icon/
  context/       the shared data (company, alerts, apps): each context file with its provider
  hooks/         reusable hooks: useAsync, useCachedAsync, useOnlineStatus, useDebouncedValue, useVisibleAlerts
  utils/
    helpers/     small plain functions: company filter, dates, error conversion, saved-copy storage
    theme/       applying a company's colours, and the contrast formula
  services/      the mock API and its search matching
  configs/       companies, apps, severity: the data that drives everything
  data/  types/
  test-utils/    helpers for tests (setup, rendering the page, picking a company, going offline)
  features/      one folder per screen area
    search/
      Search.tsx          <- the file that says what renders; open this first
      components/         the pieces it is built from
      hooks/              hooks only this feature uses
    alerts/  company/  demo/  device/  home/  launcher/  offline/  updates/   (same shape)
```

Rules I followed:
- **In a feature, the file at the top level is what renders.** Its `components/`, `hooks/` and `helpers/` folders are the building blocks. If someone asks "where is search?", they open `features/search/Search.tsx`.
- **Shared things live in the global folders:** reusable hooks in `hooks/`, plain functions in `utils/helpers/`, shared data in `context/`. If only one feature uses something, it stays inside that feature.
- `features/home` composes the others, and nothing depends on `home`. A few features reuse a small piece of another (the launcher uses the alerts' `incidentFor`, search uses the launcher's icon lookup, the alert band uses the offline bar).
- Tests sit next to the code they test. Tests that exercise several pieces together are named `*.integration.test.tsx`. `test-utils/` holds the helpers the tests share, not tests.
- Imports across folders use the `@/` alias (`@/features/search/Search`). Files in the same folder use `./`.

### How the main ideas work

**Company theming.** Each company in `configs/companies.ts` has an accent colour pair. When the selected company changes, `applyTheme` writes three CSS variables onto the page and every component reads those variables. Nothing re-renders styles, and no component mentions a specific company.

**Company filtering.** Apps, alerts and news each carry a `companies` field: a list of company ids, or `'*'` for the whole group. One function, `filterForCompany`, applies it everywhere. Group-wide critical alerts stay visible because they are tagged `'*'`. A test checks this for every company.

**Loading and errors.** `useAsync` turns any request into one of three states: loading, success or error, with a `reload`. Every section handles all three. Errors that matter say so loudly: if alerts fail to load, the page shows an error instead of an empty list that could be mistaken for "all clear".

**Search.** The search field opens a search box over the page (a native `<dialog>`, so the browser provides the focus trap, Escape to close and returning focus). Typing waits for a short pause (250 ms), then two separate requests run, one for apps and one for news, so if one fails the other's results still show with a Retry for the failed one. The mock API applies the company filter on its side, as a real service would. Every result is a real link, so the arrow keys, Enter and Tab work. Opening a news result jumps to it in the Alerts and news card, because news has no page of its own. (If the Alerts chip is on and hiding that news item, the jump has nothing to land on; pick All first.)

**Status and badges are derived.** An alert can say which apps it affects (`impact`). The service status strip, the red or amber badge on an app tile and the sentence under the greeting are all worked out from the alerts, never stored separately, so they cannot disagree with them. An app can say how much work is waiting for the person (`waiting`), which the greeting also sums.

## Adding a seventh subsidiary

No component changes are needed:

1. Add one entry to `src/configs/companies.ts`: id, name, tagline, logo (path, size, alt text), the colour behind the logo, and the accent colours.
2. Put the logo in `public/brands/`.
3. List the new id in the `companies` field of each app in `src/configs/apps.ts` that the new company should see.
4. Optionally add alerts and news in `src/data/mockData.ts`. Group-wide items appear automatically.

The company then appears in the switcher, gets its own theme, and the existing contrast tests check its colours. `src/features/company/addingACompany.test.tsx` does exactly this with a made-up company and checks the result.

## The extra feature: offline-friendly behaviour

**Why I chose it.** Staff use the portal on phones and tablets that move between buildings with patchy signal. The brief's hardest scenario is a payment-failure alert reaching people on weak signal. A saved copy of the last alerts is the part of that answer I could build and demonstrate honestly. I compared it with dark mode, role-based views and a component library (see the [decision log](docs/decision-log.md)).

**What it does**
- Every successful load of alerts, news and apps is saved on the device with a timestamp.
- If a refresh fails, the page shows the saved copy with a notice: "Showing saved alerts from 17 Oct 2026, 09:05. We could not refresh them." A saved critical alert still appears and is clearly labelled as saved.
- When the browser goes offline, a banner says "You are offline" and explains what the person is seeing.
- When the connection returns, everything refreshes by itself.
- During a retry the saved copy stays on screen, so the page never goes blank while waiting. The last good copy is also kept in memory, so this holds even on a device that cannot save (storage full or blocked, as in some private windows).

**What it does not do.** It is not a full offline-first app. If the page has never loaded on the device, there is nothing to show; that needs a service worker. Both are on the list below.

**Shared devices.** Saved data lives on the device, so on a tablet used by several people the next person could see the previous person's alerts. On a device marked as shared, a bar says so, warns 30 seconds before an inactivity sign-out and offers "Stay signed in". Signing out removes every saved copy and then replaces the whole page, so nothing can save again. A real sign-out would also end the server session.

**To demo it:** load the page, then open `?demo=1`, press "Simulate failure" and "Refresh now". Or open DevTools, Network tab, set throttling to "Offline" for that tab only. Do not reload while offline.

## Accessibility

Target is WCAG 2.1 AA. A real-browser axe-core audit found no violations in all six company themes, with the company list and the search box open, and in the offline and shared-device states. Lighthouse scores 100. Keyboard order, reflow at 320 px and 200% text were checked, and a handful of layout bugs on small screens were found and fixed. Screen reader testing is not done by automation, so it is listed as a manual step. Full details, including what was not checked, are in [docs/accessibility.md](docs/accessibility.md).

## Performance

| | |
|---|---|
| JavaScript (gzipped) | 82.9 kB (budget 95), of which about 80% is React itself |
| CSS (gzipped) | 5.2 kB (budget 6) |
| Font | one self-hosted file, 27 kB |
| Logos | 3 to 13 kB each, only the selected one loads |
| Whole first load | 132 KiB (budget 200) |
| Lighthouse (mobile, simulated slow 4G) | Performance 99, Accessibility 100, Best practices 100 |
| Cumulative layout shift | 0 |

How it was kept small: no UI library, router, state library, date library or icon library; Tailwind only emits the classes used; one font file; demo controls loaded on demand; logos resized and optimised. I set the budget before building and re-measured after every visual change. Details, including three layout-shift problems I found and fixed, are in [docs/performance.md](docs/performance.md).

## How sign-in would plug in

Not built. The plan:

1. **Single sign-on with the group's identity provider** (for example Microsoft Entra ID or Okta) using OpenID Connect with the authorization code flow and PKCE. No passwords are handled by this app.
2. **A small backend-for-frontend** completes the login and keeps the session in an `HttpOnly`, `Secure`, `SameSite` cookie, so tokens never sit in browser storage where scripts could read them.
3. **The employee comes from the session.** `fetchEmployee` in `services/mockApi.ts` is the single call to replace: it would return the signed-in person with their company and roles from the token's claims.
4. **The server enforces access.** Which apps and content a person may see is decided by the API from their claims. The browser-side company filter is for the preview feature and is never the security boundary.
5. **Sign-out clears the saved offline copies**, which matters on shared tablets. The shared-device mode in this prototype already does this on the client.
6. **No secrets in the repo.** There are none today. Real configuration (identity provider address, client id) would come from environment variables at build or deploy time, and only public values would ever be exposed to the browser.

## Testing

`yarn test` runs 190 tests with Vitest, Testing Library and axe. They cover:
- pure rules: company filtering, alert sorting, search matching, contrast ratios, greeting by hour, merging alerts and news, working out which alerts affect which app;
- hooks: loading, errors and recovery, an old response never replacing a newer one, debounce, online status, the offline cache and its failure cases, the inactivity timer;
- whole-screen behaviour: critical alerts announced and kept after switching company, search (including one half failing and a slow old answer arriving late), offline notices, retry and recovery, shared-device sign-out clearing saved data, the demo controls, the error boundary;
- accessibility scans on the main states.

The fake browser used by the tests cannot calculate colour contrast and has no real `<dialog>`, so contrast is checked two other ways (unit tests on the colour values, and axe in a real browser), and the search box's focus trap was checked by hand in a real browser.

## What I cut, and what I would do with another week

Cut on purpose:
- Sign-in (planned above), dark mode, role-based launcher views, highlighting matched words in search results, searching alerts.

With another week:
1. **Reach staff while the page is open.** Alerts load once when the page opens. Add polling or server-sent events with a silent refresh that does not flash the page, then web push for critical alerts.
2. **Service worker** so the app itself loads with no signal, with a retry queue and background sync.
3. **Keep saved data per user** on shared devices, and end the server session on sign-out.
4. **Real sign-in** as described above.
5. **Own navigation per company.** A company that wants its own brand and navigation would get a layout slot in the config, keeping the shared components.
6. **Screen reader and real-device testing** with notes, and an end-to-end test suite in a real browser.
7. **Measure real users** (Core Web Vitals) instead of one lab run.
