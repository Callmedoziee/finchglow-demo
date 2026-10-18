# Finchglow Group Staff Portal (prototype)

One front door for staff across the group. An employee signs in once, sees the alerts that matter to them, reads company news, searches, and launches the tools they use. Switching company re-brands the page and filters the content, but group-wide alerts always stay visible.

This is a front-end prototype. There is no real backend: a small mock API serves invented sample data.

## Run it

```bash
yarn install
yarn dev        # http://localhost:5173
yarn test       # 107 tests
yarn lint
yarn build      # production build into dist/
yarn preview    # serve the production build
```

I developed on Node 24 and use yarn.

**Demo controls:** open `http://localhost:5173/?demo=1` to get a small panel with "Simulate failure", "Slow network" and "Refresh now". It is only loaded when `?demo=1` is in the address.

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
2. **Sample data is invented.** Alerts, news, apps and the employee ("Amara") are made up.
3. **"Signed in" is simulated.** The mock API returns the employee, as an identity provider would after sign-in.
4. **Brand colours.** I started from each brand's real logo colour. Where it was too light to read (below 4.5:1 against white) I darkened it, keeping the hue, so the portal meets WCAG AA. For example Travelden's orange `#f98836` is 2.4:1 on white, so the portal uses `#be5306`.

## What the brief asked for, and where it lives

| Requirement | Where |
|---|---|
| Personalised greeting, company, launcher grid | `features/home`, `features/launcher` |
| Alerts and news with three severities, critical impossible to miss | `features/alerts`, `features/news` |
| Company switcher that re-themes and filters, group alerts stay visible | `features/company`, `lib/visibility.ts` |
| Search across apps and news with empty and loading states | `features/search`, `services/mockSearch.ts` |
| Responsive and accessible (WCAG 2.1 AA) | whole app, notes in `docs/accessibility.md` |
| **Extra: offline-friendly behaviour** | `features/offline` |
| A seventh subsidiary by configuration, not copied code | `configs/companies.ts` |
| Error handling and loading states, API sometimes fails | `hooks/useAsync.ts`, `components/ui` |
| A few meaningful tests | 107 tests, next to the code they test |
| Bundle size and how it was kept small | below, and `docs/performance.md` |
| Sign-in plan, no secrets | below |

## How it is organised

```
src/
  features/        one folder per feature: its UI, hooks and helpers together
    alerts/  company/  demo/  home/  launcher/  news/  offline/  search/
  components/      only things shared by several features
    ui/  layouts/  icon/
  configs/         companies, apps, severity: the data that drives everything
  services/        the mock API and its search engine
  hooks/  lib/     genuinely shared code (useAsync, toError, visibility filter, date format)
  data/  theme/  types/  test/
```

Rules I followed:
- A feature owns its screens, its hooks and its helpers. If someone asks "where is search?", they open `features/search`.
- Shared folders only hold what more than one feature uses.
- `features/home` is the one place that composes the others. `company` and `offline` depend on no other feature.
- Tests sit next to the code. Tests that exercise several pieces together are named `*.integration.test.tsx`.
- Imports across folders use the `@/` alias (`@/features/search/SearchBar`). Files in the same folder use `./`.

### How the main ideas work

**Company theming.** Each company in `configs/companies.ts` has an accent colour pair. When the selected company changes, `applyTheme` writes three CSS variables onto the page and every component reads those variables. Nothing re-renders styles, and no component mentions a specific company.

**Company filtering.** Apps, alerts and news each carry a `companies` field: a list of company ids, or `'*'` for the whole group. One function, `filterForCompany`, applies it everywhere. Group-wide critical alerts stay visible because they are tagged `'*'`. A test checks this for every company.

**Loading and errors.** `useAsync` turns any request into one of three states: loading, success or error, with a `reload`. Every section handles all three. Errors that matter say so loudly: if alerts fail to load, the page shows an error instead of an empty list that could be mistaken for "all clear".

**Search.** Typing waits for a short pause (250 ms), then asks the mock API. The mock API applies the company filter on its side, as a real service would. Results replace the launcher while a search is active. Critical alerts stay on screen.

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
- During a retry the saved copy stays on screen, so the page never goes blank while waiting.

**What it does not do.** It is not a full offline-first app. If the page has never loaded on the device, there is nothing to show; that needs a service worker. Saved data lives on the device, so on a shared tablet it could show a previous person's company until sign-out clears it. Both are on the list below.

**To demo it:** load the page, then open `?demo=1`, press "Simulate failure" and "Refresh now". Or open DevTools, Network tab, set throttling to "Offline" for that tab only. Do not reload while offline.

## Accessibility

Target is WCAG 2.1 AA. A real-browser axe-core audit found no violations in all six company themes and in the search and offline states, and Lighthouse scores 100. Keyboard order, reflow at 320 px and 200% text were checked, and two layout bugs were found and fixed. Screen reader testing is not done by automation, so it is listed as a manual step. Full details, including what was not checked, are in [docs/accessibility.md](docs/accessibility.md).

## Performance

| | |
|---|---|
| JavaScript (gzipped) | 76.8 kB, of which about 85% is React itself |
| CSS (gzipped) | 3.9 kB |
| Logos | 3 to 13 kB each, only the selected one loads |
| Lighthouse (mobile, simulated slow 4G) | Performance 100, Accessibility 100, Best practices 100 |
| Cumulative layout shift | 0 |

How it was kept small: no UI library, router, state library, date library or icon library; Tailwind only emits the classes used; system fonts; demo controls loaded on demand; logos resized and converted to WebP. Details, including a layout-shift problem I found and fixed, are in [docs/performance.md](docs/performance.md).

## How sign-in would plug in

Not built. The plan:

1. **Single sign-on with the group's identity provider** (for example Microsoft Entra ID or Okta) using OpenID Connect with the authorization code flow and PKCE. No passwords are handled by this app.
2. **A small backend-for-frontend** completes the login and keeps the session in an `HttpOnly`, `Secure`, `SameSite` cookie, so tokens never sit in browser storage where scripts could read them.
3. **The employee comes from the session.** `fetchEmployee` in `services/mockApi.ts` is the single call to replace: it would return the signed-in person with their company and roles from the token's claims.
4. **The server enforces access.** Which apps and content a person may see is decided by the API from their claims. The browser-side company filter is for the preview feature and is never the security boundary.
5. **Sign-out clears the saved offline copies**, which matters on shared tablets.
6. **No secrets in the repo.** There are none today. Real configuration (identity provider address, client id) would come from environment variables at build or deploy time, and only public values would ever be exposed to the browser.

## Testing

`yarn test` runs 107 tests with Vitest, Testing Library and axe. They cover:
- pure rules: company filtering, alert sorting, search matching, contrast ratios, greeting by hour;
- hooks: loading, errors and recovery, debounce, online status, the offline cache and its failure cases;
- whole-screen behaviour: critical alerts announced and kept after switching company, search states, offline notices, retry and recovery, the demo controls, the error boundary;
- accessibility scans on the main states.

The fake browser used by the tests cannot calculate colour contrast, so contrast is checked two other ways: unit tests on the colour values, and axe in a real browser.

## What I cut, and what I would do with another week

Cut on purpose:
- Sign-in (planned above), dark mode, role-based launcher views, highlighting matched words in search results.

With another week:
1. **Reach staff while the page is open.** Alerts load once when the page opens. Add polling or server-sent events with a silent refresh that does not flash the page, then web push for critical alerts.
2. **Service worker** so the app itself loads with no signal, with a retry queue and background sync.
3. **Clear saved data on sign-out**, and keep saved data per user on shared devices.
4. **Real sign-in** as described above.
5. **Own navigation per company.** A company that wants its own brand and navigation would get a layout slot in the config, keeping the shared components.
6. **Screen reader and real-device testing** with notes, and an end-to-end test suite in a real browser.
7. **Measure real users** (Core Web Vitals) instead of one lab run.
