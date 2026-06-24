import { useRef, RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

type UseYoyoOptionsT = {
  /** Vertical offset in px (default: -16) */
  y?: number;
  /** Animation duration in seconds (default: 1.8) */
  duration?: number;
  /** GSAP easing (default: "sine.inOut") */
  ease?: string;
  /** Skip animation entirely (default: false) */
  disabled?: boolean;
  /** Use an external ref instead of creating one */
  ref?: RefObject<HTMLElement | null>;
};

/**
 * Gentle floating yoyo animation — bobs the element up and down infinitely.
 * Respects prefers-reduced-motion.
 *
 * Pass `ref` to animate an existing ref, or omit to get one back.
 */
export function useYoyo(options: UseYoyoOptionsT = {}) {
  const { y = -16, duration = 1.8, ease = "sine.inOut", disabled = false } = options;
  const internalRef = useRef<HTMLElement | null>(null);
  const ref = options.ref ?? internalRef;
  const reduceMotion = useReduceMotion();

  useGSAP(() => {
    if (!ref.current || reduceMotion || disabled) return;

    gsap.to(ref.current, {
      y,
      duration,
      ease,
      yoyo: true,
      repeat: -1,
    });
  }, [reduceMotion, disabled]);

  return ref;
}
