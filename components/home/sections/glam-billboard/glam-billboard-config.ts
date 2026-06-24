/* ═══════════════════════════════════════════════
   Glam Billboard (standalone) — geometry config
   ═══════════════════════════════════════════════
   Forked from the shared GlamCosmicBillboard hero so this pre-contact section can be tuned on its own
   without touching the test-page hero. Free to edit. */

import type { DotPathT } from "@/components/animations/fixed-traveling-dots/traveling-dots";

/* The svg uses preserveAspectRatio="meet", which letterboxes the 1200-wide viewBox to the center of
   this short, wide section. To make the stripes (and the dots riding them) span the FULL width, we draw
   them far past the viewBox on the x-axis; the svg's overflow-hidden clips them to the section box, so
   they read edge-to-edge without bleeding into neighbouring sections. The page is capped at max-w-1440,
   so [-1500, 2700] covers the widest case with margin.

   Crucially the slope must stay GENTLE: the band is short, so a steep line exits through the top/bottom
   edge before reaching the left/right edge (which is why the original 1:3 stripes stopped mid-screen).
   With span ≈ 4200 viewBox units and a band height of 800, |slope| must be < ~0.19 to reach both side
   edges; we use 0.08 so the lines stay well inside the band and clip at the sides. Only the lines are
   reshaped — the rings keep their natural meet sizing. */
const LINE_X_MIN = -1500;
const LINE_X_MAX = 2700;
const LINE_CENTER_X = 600;
const LINE_SLOPE = -0.08; // negative = descends to the right, like the original stripes but far flatter
const LINE_SPAN_SCALE = (LINE_X_MAX - LINE_X_MIN) / 1200; // = 3.5 — keeps dot travel speed constant

/* A near-horizontal line pinned to centerY at the section's horizontal centre, spanning the full width. */
function fullWidthLine(centerY: number) {
  return {
    x1: LINE_X_MIN,
    y1: centerY + LINE_SLOPE * (LINE_X_MIN - LINE_CENTER_X),
    x2: LINE_X_MAX,
    y2: centerY + LINE_SLOPE * (LINE_X_MAX - LINE_CENTER_X),
  };
}

const PINK_LINE = fullWidthLine(440);
const GOLD_LINE = fullWidthLine(380);

/* ── Diagonal glam stripes (rendered as <line> elements), extended to full width ── */
export const GLAM_STRIPES = [
  { ...PINK_LINE, stroke: "var(--color-hot-pink)", strokeWidth: 1, opacity: 0.16 },
  { ...GOLD_LINE, stroke: "var(--color-gold)", strokeWidth: 1, opacity: 0.16 },
] as const;

/* ── Traveling dot paths (3 dots per stripe, staggered durations) ──
   Gradients (td-grad-gold, td-grad-pink) are defined by FixedTravelingDots in layout.tsx.
   Durations are scaled by LINE_SPAN_SCALE so the dots cross the longer (full-width) line at the
   same on-screen speed as before. */
export const BILLBOARD_DOT_PATHS: DotPathT[] = [
  { ...PINK_LINE, gradientId: "td-grad-pink", dur: 36 * LINE_SPAN_SCALE },
  { ...PINK_LINE, gradientId: "td-grad-pink", dur: 30 * LINE_SPAN_SCALE },
  { ...PINK_LINE, gradientId: "td-grad-pink", dur: 40 * LINE_SPAN_SCALE },
  { ...GOLD_LINE, gradientId: "td-grad-gold", dur: 42 * LINE_SPAN_SCALE },
  { ...GOLD_LINE, gradientId: "td-grad-gold", dur: 34 * LINE_SPAN_SCALE },
  { ...GOLD_LINE, gradientId: "td-grad-gold", dur: 38 * LINE_SPAN_SCALE },
];

/* ── Orbital arcs (the rings) ── */
export const ORBITAL_ARCS = [
  { cx: 400, cy: 400, rx: 300, ry: 350, stroke: "var(--color-gold)", strokeWidth: 1.5, opacity: 0.22, rotate: -15 },
  { cx: 800, cy: 400, rx: 280, ry: 320, stroke: "var(--color-hot-pink)", strokeWidth: 1, opacity: 0.24, rotate: 10 },
] as const;

export const ORBIT_DURATION_S = 44;

/* ── SVG IDs — distinct from the shared hero's so both can coexist on one page ── */
export const ID = {
  orbitDot: "glam-billboard-orbit-dot",
  orbitDotPink: "glam-billboard-orbit-dot-pink",
} as const;

/* ── Derived motion paths for the orbiting dots ── */
function buildEllipseMotionPath(arc: (typeof ORBITAL_ARCS)[number]) {
  const rad = (arc.rotate * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const lx = -arc.rx;
  const sx = arc.cx + lx * cos;
  const sy = arc.cy + lx * sin;
  return `M ${sx} ${sy} A ${arc.rx} ${arc.ry} ${arc.rotate} 1 1 ${arc.cx + arc.rx * cos} ${arc.cy + arc.rx * sin} A ${arc.rx} ${arc.ry} ${arc.rotate} 1 1 ${sx} ${sy} Z`;
}

export const ORBIT_PATH = buildEllipseMotionPath(ORBITAL_ARCS[0]);
export const ORBIT_PATH_PINK = buildEllipseMotionPath(ORBITAL_ARCS[1]);
