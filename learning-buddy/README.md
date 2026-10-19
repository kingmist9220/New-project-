# Learning Buddy

A calm, predictable learning and habits app for autistic children. It runs in any modern browser
and can be installed on a phone or tablet like a normal app. It works offline.

## What's inside

| Area | What it does |
| --- | --- |
| **My Day** | Visual step-by-step routines: morning, hand washing, brushing teeth, getting dressed, tidying up, bedtime. The next step is highlighted and read aloud. Progress resets each day. |
| **Learn** | Six short games of 5 questions each: Colours, Shapes, Counting, Letters, Words, Good Habits. |
| **First, Then** | A first/then board ("First brush teeth, then story") to help with transitions. |
| **Feelings** | Pick how you feel, hear it named, and see ideas that can help (with links to breathing and the timer). |
| **Calm Corner** | A slow breathing bubble with spoken "breathe in / breathe out" cues. |
| **Timer** | A visual countdown pie (1–15 min), so the child can see time passing. |
| **My Stars** | Stars for every step and right answer; every 10 stars unlocks a sticker. |

### Designed for autistic learners

- Soft, low-saturation colours, plus **Night** and **High contrast** themes
- The same big buttons in the same places on every screen; short rounds with a progress bar
- Every prompt is read aloud, with a 🔊 button to hear it again
- Gentle, errorless-style mistakes: no buzzers; a wrong choice fades and the child tries again
- Quiet sounds only, no flashing, and the OS "reduce motion" setting is respected
- Grown-up settings sit behind a **press-and-hold** on ⚙️ (1.5 s) so children don't open them by accident.
  You can set sound, voice, 2/3/4 answer choices, counting range, theme, text size and motion.
- No accounts, ads or tracking. All progress stays on the device (`localStorage`).

## Running it

It's a static site with no build step and no dependencies:

```bash
cd learning-buddy
python3 -m http.server 8080      # or: npx serve .
```

Open http://localhost:8080. On a phone or tablet, use **Add to Home Screen** to install it.

### Online (GitHub Pages)

The app is published at **https://kingmist9220.github.io/New-project-/** by the
`.github/workflows/pages.yml` workflow, which redeploys whenever `learning-buddy/` changes on `main`.
One-time setup: in the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
To publish it, upload the folder to any static host (GitHub Pages, Netlify, and so on). The offline
service worker needs HTTPS or localhost.

## Performance: why it runs smoothly

The app is built so it stays fast even on old or cheap devices:

- **No framework and no downloads:** about 40 KB in total. Pictures are emoji and inline SVG, so there are no image files to load.
- **Offline-first service worker:** after the first visit every screen loads from the device cache, so it starts instantly.
- **GPU-friendly animation:** only `transform` and `opacity` are animated. The timer updates a CSS variable 4 times a second instead of redrawing the page.
- **Cheap rendering:** one DOM write per screen, one delegated click listener, and CSS `contain` on tiles.
- **No background work:** all timers, speech and intervals are stopped when you leave a screen, which saves battery. Storage writes are batched.
- `touch-action: manipulation` removes the 300 ms tap delay, so taps respond immediately.

### Recommended devices

Any device from roughly the last 6–7 years runs it well: a tablet is ideal for little hands.

| | Minimum | Recommended |
| --- | --- | --- |
| Tablet | iPad (6th gen, A10) / Android tablet with 2 GB RAM | iPad 9th gen or newer (A13+), Samsung Galaxy Tab A8/A9 or newer |
| Browser | Chrome / Edge / Safari / Firefox from 2022 or later | Latest version |
| Processor | Any quad-core ARM or x86 chip | Apple A13+ / Snapdragon 680+ / MediaTek Helio G99+ |

For the spoken voice, make sure a text-to-speech voice is installed on the device (it is by default on iOS, Android and Windows).

## Files

```
index.html            app shell
styles.css            themes and layout
app.js                screens, games, routines, settings
sw.js                 offline cache
manifest.webmanifest  install-as-app metadata
icon.svg              app icon
```

To add a routine or a question, edit the content arrays at the top of `app.js`
(`ROUTINES`, `HABITS`, `THINGS`, `FEELINGS`, and so on).
