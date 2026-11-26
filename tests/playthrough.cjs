// Automated play-through of every activity (dev tool).
//   python3 -m http.server 8765   (in the repo root)
//   node tests/playthrough.cjs [shotsDir] [width] [height] [unitFilter]
// Uses ?fast so speech does not wait; answers are found via data-answer
// markers that exist only in that test mode.

const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:8765/index.html?fast';
const SHOTS = process.argv[2] || '';
const W = +(process.argv[3] || 1180);
const H = +(process.argv[4] || 820);
const ONLY = process.argv[5] || '';

// filled from js/characters.js once the page is loaded
let PARTS = {};
let ZONES = {};

async function artPoint(page, vx, vy) {
  const r = await page.$eval('.buddy-art', (el) => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
  return { x: r.x + (vx / 200) * r.w, y: r.y + (vy / 240) * r.h };
}

async function clickIf(page, sel) {
  const el = await page.$(sel);
  if (!el) return false;
  try {
    await el.click({ force: true, timeout: 1500 });
    return true;
  } catch {
    return false;
  }
}

async function solve(page, label) {
  const t0 = Date.now();
  let shot = false;
  const explored = new Set();
  while (Date.now() - t0 < 90000) {
    if (await page.$('.overlay')) return true;
    if (!shot && SHOTS && Date.now() - t0 > 350) {
      shot = true;
      await page.screenshot({ path: `${SHOTS}/${label}.png` });
    }
    if (await clickIf(page, '.card.flip.closed')) continue;
    if (await clickIf(page, '.mic-btn.ready')) continue;
    if (await clickIf(page, '.choice:not(.fade):not(.picked)')) { await page.waitForTimeout(300); continue; }
    if (await clickIf(page, '.buddy.tappable .buddy-art')) { await page.waitForTimeout(120); continue; }
    if (await clickIf(page, '.item[data-answer]:not(.used):not(.gone)')) { await page.waitForTimeout(900); continue; }
    if (await clickIf(page, '.thing:not(.counted)')) { await page.waitForTimeout(60); continue; }
    if (await clickIf(page, 'button[data-answer]:not(.popped):not(.right):not(.used)')) { await page.waitForTimeout(400); continue; }
    if (await page.$('.prop')) await clickIf(page, '.prop');

    // touch: explore mode
    if (await page.$('.chips')) {
      const char = await page.$eval('.buddy', (b) => b.dataset.char);
      for (const [p, pt] of Object.entries(PARTS)) {
        if (explored.has(p)) continue;
        const [vx, vy] = p === 'ears' ? pt[char] : pt;
        const c = await artPoint(page, vx, vy);
        await page.mouse.click(c.x, c.y);
        explored.add(p);
        await page.waitForTimeout(80);
      }
    }
    // scrub
    const want = await page.$eval('.buddy-art[data-answer]', (el) => el.dataset.answer).catch(() => null);
    if (want && ZONES[want] && (await page.$('.tool'))) {
      const tb = await (await page.$('.tool')).boundingBox();
      const z = await artPoint(page, ...ZONES[want]);
      await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
      await page.mouse.down();
      await page.mouse.move(z.x, z.y, { steps: 8 });
      for (let i = 0; i < 14; i++) {
        await page.mouse.move(z.x + 18, z.y + 4, { steps: 3 });
        await page.mouse.move(z.x - 18, z.y - 4, { steps: 3 });
      }
      await page.mouse.up();
      await page.waitForTimeout(200);
      continue;
    }
    // touch: quiz mode
    if (want && PARTS[want]) {
      const char = await page.$eval('.buddy', (b) => b.dataset.char);
      const [vx, vy] = want === 'ears' ? PARTS.ears[char] : PARTS[want];
      const c = await artPoint(page, vx, vy);
      await page.mouse.click(c.x, c.y);
      await page.waitForTimeout(300);
      continue;
    }
    await page.waitForTimeout(150);
  }
  return false;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(BASE);
  await page.click('.big-play', { force: true });
  await page.waitForTimeout(500);
  const geo = await page.evaluate(async () => {
    const m = await import('./js/characters.js');
    const parts = { ears: {} };
    for (const [k, v] of Object.entries(m.PARTS)) if (v.pts) parts[k] = v.pts[0];
    for (const id of m.ORDER) parts.ears[id] = m.CHARS[id].ears[0];
    const zones = {};
    for (const [k, v] of Object.entries(m.ZONES)) zones[k] = v.pts[0];
    return { parts, zones };
  });
  PARTS = geo.parts;
  ZONES = geo.zones;
  const units = await page.evaluate(async () => (await import('./js/content/units.js')).UNITS.map((u) => ({ id: u.id, n: u.activities.length, types: u.activities.map((a) => a.type) })));
  let ok = 0, fail = 0;
  for (const u of units) {
    if (ONLY && u.id !== ONLY) continue;
    for (let i = 0; i < u.n; i++) {
      const label = `${u.id}-${i}-${u.types[i]}`;
      const before = errors.length;
      await page.evaluate((h) => (location.hash = h), `#/play/${u.id}/${i}`);
      await page.waitForTimeout(150);
      const t = Date.now();
      const done = await solve(page, label);
      const errs = errors.slice(before);
      console.log(`${done ? 'OK  ' : 'FAIL'} ${label} (${((Date.now() - t) / 1000).toFixed(1)}s)${errs.length ? '  ERRORS: ' + errs.join(' | ') : ''}`);
      if (done && !errs.length) ok++;
      else fail++;
      if (!done && SHOTS) await page.screenshot({ path: `${SHOTS}/FAIL-${label}.png` });
    }
  }
  // reward + sticker screens
  if (SHOTS) {
    await page.screenshot({ path: `${SHOTS}/zz-reward.png` });
    await page.evaluate(() => (location.hash = '#/'));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/zz-home-progress.png` });
    await page.evaluate(() => (location.hash = '#/stickers'));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/zz-stickers.png` });
    await page.evaluate(() => (location.hash = '#/parent'));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/zz-parent.png`, fullPage: true });
  }
  console.log(`\n${ok} passed, ${fail} failed. Other errors: ${errors.length}`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
