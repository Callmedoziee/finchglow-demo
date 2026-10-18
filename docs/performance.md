# Performance notes

## Bundle size (production build)

| File | Raw | Gzip |
|---|---|---|
| JavaScript (main) | 247 kB | 76.8 kB |
| CSS | 15.6 kB | 3.9 kB |
| Demo controls (loaded only with `?demo=1`) | 1.0 kB | 0.5 kB |
| Brand logo (only the selected company's is downloaded) | 3 to 13 kB each | WebP, already compressed |
| Page weight Lighthouse measured | 103 KiB total | |

Sizes are as reported by Vite (1 kB = 1,000 bytes). Brotli, which most hosts use, is about 15% smaller than gzip.

### What is inside the JavaScript

Measured by mapping the minified bundle back to source files (`yarn build --sourcemap`, then attributing bytes to each file):

| Part | Minified size | Share |
|---|---|---|
| react-dom | 207 kB | 85% |
| React and its scheduler | 12 kB | 5% |
| Our own code | 26 kB | 11% |

So nearly all of the weight is React itself. Our code is small, and part of it is mock data that a real backend would replace.

### What keeps it small

- No UI library, no router, no state library, no date library (`Intl.DateTimeFormat` is built into the browser), and no icon library (icons are small inline SVGs).
- Tailwind generates only the CSS classes actually used, so the stylesheet is 3.8 kB gzipped.
- System fonts, so there are no font downloads and no flash of unstyled text.
- Demo controls are split into their own file and only downloaded when `?demo=1` is present.
- Logos are the only images. They were resized from up to 4096px wide down to 96px tall (enough for sharp display on high-resolution screens) and converted to WebP, which took the largest from 217 kB to 3 kB. Only the selected company's logo is downloaded.

## Lighthouse (mobile, simulated slow 4G, production build served locally)

| | First run | After alerts fix | After real logos and footer |
|---|---|---|---|
| Performance | 77 | 100 | **100** |
| Accessibility | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| Cumulative layout shift | **0.603** | 0.006 | **0** |
| First contentful paint | 1.4 s | 1.4 s | 1.4 s |
| Largest contentful paint | 1.4 s | 1.4 s | 1.5 s |
| Total blocking time | 0 ms | 0 ms | 0 ms |

### The layout shift problem, and the fix

The first run scored 0.603 for layout shift, where under 0.1 is good. Cause: the critical alert arrives from the server a moment after the rest of the page is drawn, and it is inserted above everything, pushing the page down. On a real device that means a link can move just as someone taps it, and for this product it is the worst possible moment for the page to jump.

Fix: alerts settle first. While they load the page shows only "Checking for alerts...". A critical alert then appears before anything else, and nothing below it has been drawn yet, so nothing moves. To stop a slow alerts service blocking the page, the wait is capped at 1.5 seconds (`ALERTS_WAIT_LIMIT_MS`), after which the page shows anyway.

The trade-off: for up to 1.5 seconds staff see a short status line instead of the launcher. I judged that right for a portal whose most important job is delivering critical alerts.

## Limits of these numbers

- One Lighthouse run on a local preview server. Results vary a little between runs.
- The mock API adds a fixed 400 ms delay. A real network and server will behave differently, so treat these as a baseline.
- Lab numbers are not field data. In production I would also measure real users.

### A second layout shift, caused by my own footer

After adding the real branding, layout shift rose to 0.142 and performance dropped to 94. The new footer was visible while the page was still loading, then was pushed down as content arrived. Fix: the main area reserves a full screen of height (`min-h-dvh`), so the footer starts below the fold. Layout shift returned to 0. The lesson is to re-measure after every visual change, because shifts come from anything that appears above something already on screen.

Logo images carry their real `width` and `height` attributes (stored with each company in the config), so the browser reserves their space before they load.
