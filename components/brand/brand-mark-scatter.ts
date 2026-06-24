// Entrance-scatter math for the animated brand mark: where each dot starts before it flies into its
// grid position. Separate from brand-mark-dots (the static geometry/colour of the mark) because this is
// an animation-start concern with its own reason to change — the mark can be reshaped without touching
// the scatter, and vice versa.

import { VIEWBOX } from "./brand-mark-dots";

// Deterministic [0,1) hash for the entrance scatter: a given index always hashes the same way, with no
// per-call state. (A Math.random() scatter would differ between SSR and hydration.)
export function rand(seed: number) {
  const x = Math.sin(seed * 99.13) * 43758.5453;
  return x - Math.floor(x);
}

// Where dot `i` starts before it flies in: pushed out from its final (cx,cy) along a hashed angle by a
// large hashed distance, so the grid begins as a loose cloud and converges inward.
//
// Rounded to whole viewBox units on purpose. This position is written straight into the SSR'd
// <circle cx/cy>, and Math.sin/Math.cos are NOT bit-identical between Node's V8 (server) and the
// browser's V8 (client) — the raw float diverges in its low digits and trips a React hydration
// mismatch. The dots are off-screen cloud points that immediately spring to rest, so integer-snapping
// the start position is visually invisible while making both engines serialize the same attribute.
export function scatter(i: number, cx: number, cy: number) {
  const angle = rand(i + 1) * Math.PI * 2;
  const dist = (0.7 + rand(i * 2 + 5) * 0.9) * VIEWBOX.width;
  return { x: Math.round(cx + Math.cos(angle) * dist), y: Math.round(cy + Math.sin(angle) * dist) };
}
