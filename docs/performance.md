# Performance notes

## Budget

I set these limits before building, and re-checked them after every change to the page:

| | Limit | Now |
|---|---|---|
| JavaScript (gzipped) | 95 kB | 82.9 kB |
| CSS (gzipped) | 6 kB | 5.2 kB |
| Font | 30 kB | 27 kB |
| One logo | 15 kB | 3 to 13 kB |
| Whole first load (Lighthouse) | 200 KiB | 132 KiB |
| Lighthouse performance (mobile) | 95 or more | 99 |
| Cumulative layout shift | 0.05 or less | 0 |

CSS has the least room left (0.8 kB), so a large styling change needs another look at this table.

## Bundle size (production build)

| File | Raw | Gzip |
|---|---|---|
| JavaScript (main) | 268 kB | 82.9 kB |
| CSS | 21.2 kB | 5.2 kB |
| Demo controls (loaded only with `?demo=1`) | 1.3 kB | 0.6 kB |
| Font (Plus Jakarta Sans, Latin, all weights) | 27.3 kB | already compressed (woff2) |
| Brand logo (only the selected company's is downloaded) | 3.5 to 12.6 kB each | SVG, PNG or WebP |
| Page weight Lighthouse measured | 132 KiB total | |

Sizes are as reported by Vite (1 kB = 1,000 bytes). Brotli, which most hosts use, is about 15% smaller than gzip.

### What is inside the JavaScript

Measured by mapping the minified bundle back to source files (`yarn build --sourcemap`, then attributing bytes to each file):

| Part | Minified size | Share |
|---|---|---|
| react-dom | 207 kB | 77% |
| React and its scheduler | 12 kB | 4% |
| Our own code | 49 kB | 18% |

Most of the weight is still React itself. Our code is larger than at the start because the page now has more features (search palette, status strip, shared-device bar), and part of it is mock data that a real backend would replace.

### What keeps it small

- No UI library, no router, no state library, no date library (`Intl.DateTimeFormat` is built into the browser) and no icon library. The icons are the SVG paths of a few Lucide icons (ISC licence) copied into small components.
- Tailwind generates only the CSS classes actually used.
- One font file, self-hosted, only the Latin part of the variable font, with `font-display: swap` so text shows at once and swaps when the font arrives. It is preloaded so it starts downloading early.
- The demo controls are split into their own file and only downloaded when `?demo=1` is present.
- Logos are the only images. Colour logos were resized and converted to WebP; the white logos are SVGs run through svgo. Only the selected company's logo is downloaded.

## Lighthouse (mobile, simulated slow 4G, production build served locally)

| | First build | After alerts gate | After real logos | Final |
|---|---|---|---|---|
| Performance | 77 | 100 | 100 | **99** |
| Accessibility | 100 | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 | 100 |
| Cumulative layout shift | **0.603** | 0.006 | 0 | **0** |
| Largest contentful paint | 1.4 s | 1.4 s | 1.5 s | 1.8 s |
| Total blocking time | 0 ms | 0 ms | 0 ms | 0 to 10 ms |

The final column is the median of three runs. Largest contentful paint is slightly slower than at the start because the font is now downloaded instead of using system fonts; I accepted that for a consistent brand look.

## Layout shift: three problems, and what fixed them

Layout shift is the page jumping because something appears above something already on screen. For this product it matters most: a link can move just as someone taps it. Each of these was found by measuring, not by looking.

**1. The critical alert arriving late (0.603).** The alert comes from the server a moment after the rest of the page is drawn and is inserted at the top. Fix: the alerts and the apps are requested together and the page is drawn only once both have settled ("Loading your portal..."). The wait is capped at 1.5 seconds so a slow service cannot hold the page, and it only ever applies to the first load, so a later retry cannot hide an alert that is already on screen. Trade-off: for up to 1.5 seconds staff see a status line instead of the launcher.

**2. The footer (0.142).** After adding the real branding the footer was visible while the page loaded, then pushed down. Fix: the main area reserves a full screen of height (`min-h-dvh`), so the footer starts below the fold.

**3. The company button on a phone (0.218).** Replacing the company dropdown with a button made it only as wide as its text. On a phone the "Online, synced" chip started beside it, then wrapped onto its own row when its real text arrived, making the header 44 px taller and pushing everything down. My desktop check missed it; Lighthouse's phone profile found it. Fix: the button is full width on phones, as the old dropdown was, so the chip always has its own row.

Logo images carry their real `width` and `height` (stored with each company in the config), so the browser reserves their space before they load.

The lesson is to re-measure on the production build with phone emulation after every visual change, not only in a desktop browser.

## Limits of these numbers

- Lighthouse runs on a local preview server and varies a little between runs (one run in a series scored 90 where three repeats scored 99). Treat single scores with care.
- The mock API adds a fixed 400 ms delay. A real network and server will behave differently, so treat these as a baseline.
- Lab numbers are not field data. In production I would also measure real users.
- Layout shift is measured on first load. Switching company, or the shared-device countdown, moves content by design and is not part of that number.
