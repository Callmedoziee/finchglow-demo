# Accessibility notes

Target: WCAG 2.1 AA. This page records what was checked, how, what was found and what was not checked.

## How it was checked

| Check | How | Result |
|---|---|---|
| Automated rules in tests | `vitest-axe` on the shell, home, search palette, company switcher, shared-device bar and offline states (`yarn test`) | No violations. Note: the fake browser used by the tests cannot calculate colour contrast, so this does not cover contrast |
| Automated rules in a real browser | axe-core 4.14 injected into the running app, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice` | 0 violations in all six company themes, including with the company switcher open and the search palette open with results showing, and in the offline and shared-device states |
| Brand and severity contrast | Unit tests calculate the WCAG contrast ratio for every company accent and every severity colour pair (`companies.test.ts`, `severity.test.ts`) | All pass 4.5:1 for text and 3:1 for borders |
| Keyboard | Pressed the real Tab key through the page and read the focused element's computed style | Order follows the visual order: skip link, company, search, service status, then each app. Every stop shows a solid 3px outline in the company accent colour |
| Reflow | 320px wide viewport | No sideways scrolling |
| Text size | Root text size at 150% and 200% on a 320px viewport | No sideways scrolling after the fixes below |
| Structure | One `h1`, headings in order, one `main`, one `header`, one search landmark, lists for apps and for alerts and news | axe `heading-order`, `landmark-one-main`, `region`, `list` all pass |

## What was found and fixed

1. **Company dropdown wider than a small screen at 200% text.** It now fills the available width on small screens (`w-full min-w-0`).
2. **Alerts column pushed the page sideways at 200% text.** A grid column will not shrink below its content unless told to. Fixed with `grid-cols-1`, `min-w-0` on the sections, and `wrap-anywhere` on alert cards so a long unbreakable word such as "INFORMATION" can wrap as a last resort.
3. **A failed retry hid the saved critical alert.** Found by a test, not by a user: while "Try again" was running the page went blank. It now keeps the saved copy visible with "Checking for updates...".
4. **Search palette overflowing on a phone** and **company list cut off on a phone.** Both found by looking at a 375 px viewport in a real browser. The list is now anchored to the left edge on small screens, and the palette fits inside the screen with a margin.
5. **Shared-device text squeezed into a thin column on a phone.** The text now takes the full row and the buttons wrap beneath it.

## Design choices that support accessibility

- Critical alerts use an icon, the word "Critical", a solid high-contrast block and `role="alert"`. Severity never depends on colour alone.
- Native controls (`dialog`, `a`, `button`, `input`) instead of custom widgets. The search palette is a native `<dialog>`, so the browser provides the focus trap, Escape to close and returning focus. Every search result is a real link, so arrow keys, Enter and Tab work without special roles.
- The company list is a button that shows or hides a list of buttons (`aria-expanded`, `aria-controls`, `aria-current` on the chosen company). Escape closes it and returns focus to the button.
- A timeout on a shared device warns 30 seconds ahead and offers "Stay signed in", so nobody is signed out without notice.
- Chips and badges always carry a word ("Critical", "Warning", "3 waiting for you"), never only a colour or a dot.
- Every control is at least 44px tall.
- Status messages (loading, search result counts, offline, saved data) use `role="status"` regions that already exist on the page, so changes are announced politely.
- Errors that need attention use `role="alert"`.
- If alerts fail to load the page says so, so an empty list is never mistaken for "all clear".

## Not checked, and why it matters

- **Screen readers.** No screen reader was run. Automated tools catch roughly a third of real problems. Before presenting, run the checklist below with VoiceOver (Mac, Cmd+F5) and record what you hear.
- **Real phones and tablets.** Layout was checked by resizing a desktop browser, not on devices.
- **Colour-blindness simulation** and Windows high-contrast mode.
- **Dark mode** is not built (see the README for why offline was chosen as the extra).
- **Reduced motion.** The only animation is the loading placeholder in search, and it is switched off when the person asks for reduced motion.
- **Focus trap and page behind the search palette.** These come from the browser's native dialog. The test environment cannot reproduce them, so they were checked by hand in a real browser, not by an automated test.
- **The sign-in screen**, because sign-in is not built.

## Manual screen reader checklist (about 10 minutes)

1. Start VoiceOver, load the page. Does it announce the page title and the critical alert?
2. Press Tab once. Is "Skip to main content" announced? Activate it. Does focus move to the content?
3. Open the rotor (Control+Option+U) and list **Landmarks**: you should hear banner, main and search.
4. Rotor, **Headings**: one level 1 ("Good afternoon, ..."), then level 2 sections and level 3 groups, in order.
5. Open the company list with the keyboard, choose another company and press Enter. Is the new company's name announced and the content updated?
6. Press Command+K. Is the search dialog announced? Type a word: is "N results in ..." announced without moving focus out of the box? Press the Down arrow: is the first result announced as a link? Press Escape: does focus return to where it was?
7. Turn the network off for the tab (DevTools, Network, Offline). Is "You are offline" announced?
8. Note anything confusing and fix or list it.
