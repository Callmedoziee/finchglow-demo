# Accessibility notes

Target: WCAG 2.1 AA. This page records what was checked, how, what was found and what was not checked.

## How it was checked

| Check | How | Result |
|---|---|---|
| Automated rules in tests | `vitest-axe` on the shell, home, search results and offline states (`yarn test`) | No violations. Note: the fake browser used by the tests cannot calculate colour contrast, so this does not cover contrast |
| Automated rules in a real browser | axe-core 4.14 injected into the running app, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice` | 0 violations in all six company themes, and in the search results, empty search and offline states. The contrast rule ran on 44 elements and the target-size rule on 8 |
| Brand and severity contrast | Unit tests calculate the WCAG contrast ratio for every company accent and every severity colour pair (`companies.test.ts`, `severity.test.ts`) | All pass 4.5:1 for text and 3:1 for borders |
| Keyboard | Pressed the real Tab key through the page and read the focused element's computed style | Order follows the visual order: skip link, company, search, then each app. Every stop shows a solid 3px outline in the company accent colour |
| Reflow | 320px wide viewport | No sideways scrolling |
| Text size | Root text size at 150% and 200% on a 320px viewport | No sideways scrolling after the fixes below |
| Structure | One `h1`, headings in order, one `main`, one `header`, one search landmark, lists for groups of apps and alerts | axe `heading-order`, `landmark-one-main`, `region`, `list` all pass |

## What was found and fixed

1. **Company dropdown wider than a small screen at 200% text.** It now fills the available width on small screens (`w-full min-w-0`).
2. **Alerts column pushed the page sideways at 200% text.** A grid column will not shrink below its content unless told to. Fixed with `grid-cols-1`, `min-w-0` on the sections, and `wrap-anywhere` on alert cards so a long unbreakable word such as "INFORMATION" can wrap as a last resort.
3. **A failed retry hid the saved critical alert.** Found by a test, not by a user: while "Try again" was running the page went blank. It now keeps the saved copy visible with "Checking for updates...".

## Design choices that support accessibility

- Critical alerts use an icon, the word "Critical", a solid high-contrast block and `role="alert"`. Severity never depends on colour alone.
- Native controls (`select`, `input type="search"`, `a`, `button`) instead of custom widgets.
- Every control is at least 44px tall.
- Status messages (loading, search result counts, offline, saved data) use `role="status"` regions that already exist on the page, so changes are announced politely.
- Errors that need attention use `role="alert"`.
- If alerts fail to load the page says so, so an empty list is never mistaken for "all clear".

## Not checked, and why it matters

- **Screen readers.** No screen reader was run. Automated tools catch roughly a third of real problems. Before presenting, run the checklist below with VoiceOver (Mac, Cmd+F5) and record what you hear.
- **Real phones and tablets.** Layout was checked by resizing a desktop browser, not on devices.
- **Colour-blindness simulation** and Windows high-contrast mode.
- **Dark mode** is not built (see the README for why offline was chosen as the extra).
- **Reduced motion.** The app has no animation, so there is nothing to reduce.
- **The sign-in screen**, because sign-in is not built.

## Manual screen reader checklist (about 10 minutes)

1. Start VoiceOver, load the page. Does it announce the page title and the critical alert?
2. Press Tab once. Is "Skip to main content" announced? Activate it. Does focus move to the content?
3. Open the rotor (Control+Option+U) and list **Landmarks**: you should hear banner, main and search.
4. Rotor, **Headings**: one level 1 ("Good afternoon, ..."), then level 2 sections and level 3 groups, in order.
5. Change the company with the keyboard. Is the new company's name announced and the content updated?
6. Type a search. Is "N results for ..." announced without moving focus?
7. Turn the network off for the tab (DevTools, Network, Offline). Is "You are offline" announced?
8. Note anything confusing and fix or list it.
