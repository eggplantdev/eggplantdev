// Radial-gradient defs for the orbiting dots — a soft gold dot and a hot-pink one. Parameterized by the
// two gradient ids so the glam-billboard section and the glam-cosmic-billboard hero each keep
// collision-free ids while sharing the identical gradient markup.
export function OrbitDotDefs({ goldId, pinkId }: { goldId: string; pinkId: string }) {
  return (
    <defs>
      <radialGradient id={goldId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.5" />
        <stop offset="40%" stopColor="var(--color-gold)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={pinkId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-hot-pink)" stopOpacity="0.5" />
        <stop offset="40%" stopColor="var(--color-hot-pink)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--color-hot-pink)" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}
