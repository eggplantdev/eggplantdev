// Measures the real rendered CSS width of every next/image on a route across a
// viewport sweep, then derives the correct `sizes` string from reality.
//
// Why measure instead of compute from grid classes: the effective width cap is
// the MIN of every ancestor max-width, layouts aren't always grid (flex, fixed,
// aspect-ratio, absolute), and gaps/padding bend the vw ratio. The DOM knows the
// truth; class math guesses. See SKILL.md.
//
// Usage:
//   node scripts/measure-image-sizes.mjs --route / --route /about
//   node scripts/measure-image-sizes.mjs --base http://localhost:3000 --route /
//   node scripts/measure-image-sizes.mjs --route / --viewports 360,768,1440,3440
//
// Output: JSON to stdout, one entry per (route, image), with the current `sizes`
// attribute, the recommended one, and whether they differ.

import { chromium } from "@playwright/test";

// Project breakpoints (styles/globals.css --breakpoint-*). Used as min-width
// anchors AND to build the sweep. A custom set can override via --viewports.
const BREAKPOINTS = [360, 450, 640, 768, 1024, 1280, 1440, 1920, 2120];
// Sample above the largest breakpoint so a container max-width clamp is caught
// (ultrawide is where a stale 100vw downloads a giant source for nothing).
const WIDE_SAMPLES = [2560, 3440];

function parseArgs(argv) {
  const routes = [];
  let base = "http://localhost:3000";
  let viewports = null;
  // Merge adjacent bands within these tolerances for a shorter, readable string.
  // Always merge UP (keep the larger value) so we never under-serve. vw in vw
  // units; px as a fraction of the larger value. --vw-tol 0 --px-tol 0 = exact.
  let vwTol = 10;
  let pxTol = 0.1;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--route") routes.push(argv[++i]);
    else if (a === "--base") base = argv[++i];
    else if (a === "--viewports") viewports = argv[++i].split(",").map((n) => parseInt(n, 10));
    else if (a === "--vw-tol") vwTol = parseFloat(argv[++i]);
    else if (a === "--px-tol") pxTol = parseFloat(argv[++i]);
  }
  if (routes.length === 0) routes.push("/");
  return { routes, base, viewports, vwTol, pxTol };
}

// Merge adjacent same-unit bands within tolerance, keeping the larger value so
// the result never under-serves. Greedy until stable. vw bands merge within
// `vwTol` vw; px bands within `pxTol` fraction (a 693px and 747px ceiling are
// "close enough" to collapse to one 747px cap — still kills the ultrawide
// over-fetch, just leaves a few % on the table for a shorter string).
function mergeBands(bands, vwTol, pxTol) {
  const parsed = bands.map((b) => {
    const m = b.value.match(/^(\d+)(vw|px)$/);
    return { start: b.start, num: parseInt(m[1], 10), unit: m[2] };
  });
  let changed = true;
  while (changed && parsed.length > 1) {
    changed = false;
    for (let i = 0; i < parsed.length - 1; i++) {
      const a = parsed[i];
      const b = parsed[i + 1];
      if (a.unit !== b.unit) continue;
      const close =
        a.unit === "vw"
          ? Math.abs(a.num - b.num) <= vwTol
          : Math.abs(a.num - b.num) <= Math.max(a.num, b.num) * pxTol;
      if (close) {
        parsed[i] = { start: a.start, num: Math.max(a.num, b.num), unit: a.unit };
        parsed.splice(i + 1, 1);
        changed = true;
        break;
      }
    }
  }
  return parsed.map((p) => ({ start: p.start, value: `${p.num}${p.unit}` }));
}

// Build the viewport sweep: each breakpoint, the pixel just below it (band top),
// plus the wide samples. Sorted, deduped.
function buildSweep(custom) {
  if (custom) return [...new Set(custom)].sort((a, b) => a - b);
  const s = new Set();
  for (const bp of BREAKPOINTS) {
    s.add(bp);
    if (bp - 1 > 0) s.add(bp - 1);
  }
  for (const w of WIDE_SAMPLES) s.add(w);
  return [...s].sort((a, b) => a - b);
}

// next/image rendered <img>s carry an optimizer srcset. Match those so we ignore
// plain decorative <img>/background images the audit shouldn't touch.
const COLLECT = () =>
  [...document.querySelectorAll("img")]
    .filter((img) => (img.getAttribute("srcset") || img.currentSrc || "").includes("/_next/image"))
    .map((img) => {
      const r = img.getBoundingClientRect();
      // Decode the original source path out of the optimizer URL for a stable key.
      const src = img.currentSrc || img.getAttribute("src") || "";
      const m = src.match(/[?&]url=([^&]+)/);
      const key = m ? decodeURIComponent(m[1]) : src;
      return { key, sizes: img.getAttribute("sizes") || "", width: Math.round(r.width) };
    });

// Given viewport->width samples, derive a `sizes` string using min-width anchors
// descending. Per band decide vw (width scales with viewport) vs px (width is
// clamped constant). Then collapse equal adjacent bands for a readable string.
function deriveSizes(samples, sweep, vwTol, pxTol) {
  const anchors = BREAKPOINTS.filter((b) => b > BREAKPOINTS[0]); // smallest is the mobile base
  const maxViewport = sweep[sweep.length - 1];
  const bands = [];
  const edges = [...anchors, Infinity];
  let lo = BREAKPOINTS[0];
  // Walk bands low->high: [base..anchor0), [anchor0..anchor1), ...
  const lowerEdges = [BREAKPOINTS[0], ...anchors];
  for (let i = 0; i < lowerEdges.length; i++) {
    const start = lowerEdges[i];
    const end = i + 1 < lowerEdges.length ? lowerEdges[i + 1] : Infinity;
    const inBand = samples.filter((s) => s.vp >= start && s.vp < end && s.vp <= maxViewport);
    if (inBand.length === 0) continue;
    const widths = inBand.map((s) => s.width);
    const maxW = Math.max(...widths);
    const minW = Math.min(...widths);
    const top = inBand.reduce((a, b) => (b.vp > a.vp ? b : a));
    const scaling = maxW - minW > 2; // width tracks the viewport in this band
    bands.push({
      start,
      // For a scaling band, the worst case (largest px) is the band top; use its
      // ratio so we never under-serve. For a clamped band, fix the px.
      value: scaling ? `${Math.round((top.width / top.vp) * 100)}vw` : `${maxW}px`,
    });
  }
  // Merge near-equal adjacent bands (also collapses exact dupes) for a readable
  // string that still never under-serves.
  const collapsed = mergeBands(bands, vwTol, pxTol);
  // Emit min-width segments descending; the base band drops its min-width.
  const segs = [];
  for (let i = collapsed.length - 1; i >= 0; i--) {
    const b = collapsed[i];
    if (b.start === BREAKPOINTS[0]) segs.push(b.value);
    else segs.push(`(min-width: ${b.start}px) ${b.value}`);
  }
  return segs.join(", ");
}

async function main() {
  const { routes, base, viewports, vwTol, pxTol } = parseArgs(process.argv);
  const sweep = buildSweep(viewports);
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const results = [];

  for (const route of routes) {
    const url = base.replace(/\/$/, "") + route;
    // Per image key: { sizes, samples: [{vp, width}] }
    const byKey = new Map();
    await page.goto(url, { waitUntil: "networkidle" });
    for (const vp of sweep) {
      await page.setViewportSize({ width: vp, height: 1000 });
      await page.waitForTimeout(120); // let layout settle after resize
      const imgs = await page.evaluate(COLLECT);
      for (const img of imgs) {
        if (!byKey.has(img.key)) byKey.set(img.key, { sizes: img.sizes, samples: [] });
        const rec = byKey.get(img.key);
        if (img.sizes) rec.sizes = img.sizes;
        rec.samples.push({ vp, width: img.width });
      }
    }
    for (const [key, rec] of byKey) {
      const recommended = deriveSizes(rec.samples, sweep, vwTol, pxTol);
      results.push({
        route,
        image: key,
        current: rec.sizes || "(none)",
        recommended,
        matches: rec.sizes === recommended,
        samples: rec.samples,
      });
    }
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
