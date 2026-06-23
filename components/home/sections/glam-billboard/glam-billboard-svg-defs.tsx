import { ID } from "./glam-billboard-config";

export function GlamBillboardSvgDefs() {
  return (
    <defs>
      <radialGradient id={ID.orbitDot} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.5" />
        <stop offset="40%" stopColor="var(--color-gold)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={ID.orbitDotPink} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-hot-pink)" stopOpacity="0.5" />
        <stop offset="40%" stopColor="var(--color-hot-pink)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--color-hot-pink)" stopOpacity="0" />
      </radialGradient>

      {/* Traveling dot gradients (td-grad-gold, td-grad-pink) come from FixedTravelingDots in layout.tsx. */}
    </defs>
  );
}
