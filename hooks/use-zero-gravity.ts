import { RefObject, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

export type ZeroGravityModeT =
  /** Slow rotation + drift on X/Y — like an object tumbling in microgravity */
  | "tumble"
  /** Subtle scale wobble while floating — soft object wiggling in zero-g */
  | "jelly"
  /** Looping figure-8 path with tilt — caught in a weak gravitational field */
  | "orbital";

type UseZeroGravityOptionsT = {
  mode?: ZeroGravityModeT;
  /** Scale multiplier for the effect intensity (default: 1) */
  intensity?: number;
  disabled?: boolean;
  ref?: RefObject<HTMLElement | null>;
};

export function useZeroGravity(options: UseZeroGravityOptionsT = {}) {
  const { mode = "tumble", intensity = 1, disabled = false } = options;
  const internalRef = useRef<HTMLElement | null>(null);
  const ref = options.ref ?? internalRef;
  const reduceMotion = useReduceMotion();

  useGSAP(() => {
    if (!ref.current || reduceMotion || disabled) return;
    const el = ref.current;
    const s = intensity;

    if (mode === "tumble") {
      /* ── A) Gentle tumble ──
         Slow rotation combined with independent X/Y drift.
         Each axis runs at a different duration so the motion
         never loops the same way — feels organic. */
      gsap.to(el, { y: -14 * s, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(el, { x: 8 * s, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(el, { rotation: 3 * s, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }

    if (mode === "jelly") {
      /* ── B) Jelly wobble ──
         Float up/down + subtle squish/stretch deformation.
         scaleX and scaleY oscillate at different rates,
         making it look like a soft body reacting to drift. */
      gsap.to(el, { y: -12 * s, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(el, { scaleX: 1 + 0.03 * s, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(el, { scaleY: 1 + 0.04 * s, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.3 });
      gsap.to(el, { rotation: 1.5 * s, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }

    if (mode === "orbital") {
      /* ── C) Orbital drift ──
         Figure-8 / lemniscate path using a proxy angle.
         The element traces a lazy horizontal figure-8 while
         gently tilting — like something in a slow orbit. */
      const proxy = { angle: 0 };
      const radiusX = 12 * s;
      const radiusY = 8 * s;

      gsap.to(proxy, {
        angle: Math.PI * 2,
        duration: 8 / Math.max(s, 0.5),
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          const x = Math.sin(proxy.angle) * radiusX;
          const y = Math.sin(proxy.angle * 2) * radiusY;
          const tilt = Math.sin(proxy.angle) * 2.5 * s;
          gsap.set(el, { x, y, rotation: tilt });
        },
      });
    }
  }, [mode, intensity, reduceMotion, disabled]);

  return ref;
}
