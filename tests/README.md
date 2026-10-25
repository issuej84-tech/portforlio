# Browser regression tests

Requires Node.js and Python 3 (the static test server).

```sh
npm ci
npx playwright install chromium
npm test
```

To use an existing compatible Chromium installation instead of downloading one:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium npm test
```

The suite serves the unchanged HTML on port 4173 and runs in desktop and mobile
Chromium viewports. It covers the calculator's initial calculation, live updates,
limits, million-follower label transition, localized amounts and fill percentage,
plus portfolio demo navigation and recovery from the 404 demo. CTA links that are
intentionally `#` placeholders are not treated as working integrations.
