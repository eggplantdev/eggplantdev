// Builds the SVG path an orbiting dot travels: a full ellipse (two arc segments) sized and rotated to
// match a ring. Shared by the glam-billboard section and the glam-cosmic-billboard hero — both render
// dots riding their own orbital arcs, but the path math is identical.

export type ArcGeometryT = { cx: number; cy: number; rx: number; ry: number; rotate: number };

export function buildEllipseMotionPath(arc: ArcGeometryT) {
  const rad = (arc.rotate * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const lx = -arc.rx;
  const sx = arc.cx + lx * cos;
  const sy = arc.cy + lx * sin;
  return `M ${sx} ${sy} A ${arc.rx} ${arc.ry} ${arc.rotate} 1 1 ${arc.cx + arc.rx * cos} ${arc.cy + arc.rx * sin} A ${arc.rx} ${arc.ry} ${arc.rotate} 1 1 ${sx} ${sy} Z`;
}
