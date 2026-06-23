/* ═══════════════════════════════════════════════
   Glam Billboard (standalone) — geometry config
   ═══════════════════════════════════════════════
   Forked from the shared GlamCosmicBillboard hero so this pre-contact section can be tuned on its own
   without touching the test-page hero. Free to edit. */

import type { DotPathT } from "@/components/animations/fixed-traveling-dots/traveling-dots";

/* ── Diagonal glam stripes (rendered as <line> elements) ── */
export const GLAM_STRIPES = [
  { y1: 620, y2: 220, stroke: "var(--color-hot-pink)", strokeWidth: 1, opacity: 0.16 },
  { y1: 580, y2: 180, stroke: "var(--color-gold)", strokeWidth: 1, opacity: 0.16 },
] as const;

/* ── Traveling dot paths (3 dots per stripe, staggered durations) ──
   Gradients (td-grad-gold, td-grad-pink) are defined by FixedTravelingDots in layout.tsx. */
export const BILLBOARD_DOT_PATHS: DotPathT[] = [
  { x1: 0, y1: 620, x2: 1200, y2: 220, gradientId: "td-grad-pink", dur: 36 },
  { x1: 0, y1: 620, x2: 1200, y2: 220, gradientId: "td-grad-pink", dur: 30 },
  { x1: 0, y1: 620, x2: 1200, y2: 220, gradientId: "td-grad-pink", dur: 40 },
  { x1: 0, y1: 580, x2: 1200, y2: 180, gradientId: "td-grad-gold", dur: 42 },
  { x1: 0, y1: 580, x2: 1200, y2: 180, gradientId: "td-grad-gold", dur: 34 },
  { x1: 0, y1: 580, x2: 1200, y2: 180, gradientId: "td-grad-gold", dur: 38 },
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
