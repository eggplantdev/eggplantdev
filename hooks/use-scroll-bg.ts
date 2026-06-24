import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

gsap.registerPlugin(ScrollTrigger);

type UseScrollBgOptionsT = {
  /** Background color when fully visible (default: "#0a0806") */
  color?: string;
  /** ScrollTrigger start for fade-in (default: "top 80%") */
  enterStart?: string;
  /** ScrollTrigger end for fade-in (default: "top 20%") */
  enterEnd?: string;
  /** ScrollTrigger start for fade-out (default: "bottom 80%") */
  leaveStart?: string;
  /** ScrollTrigger end for fade-out (default: "bottom 20%") */
  leaveEnd?: string;
};

/**
 * Scroll-triggered background color animation on the section itself.
 * Animates the section's backgroundColor from transparent → color → transparent
 * as it enters and leaves the viewport.
 *
 * Returns a ref to attach to the section container.
 */
export function useScrollBg() {
  const bgcRef = useRef(null);
  const bgcContainer = useRef(null);
  const reduceMotion = useReduceMotion();

  useGSAP(
    () => {
      if (reduceMotion) return;
      gsap.to(bgcRef.current, {
        opacity: "0",
        scrollTrigger: {
          trigger: bgcContainer.current,
          start: "bottom bottom",
          end: "bottom center",
          scrub: 1,
        },
      });
    },
    { scope: bgcContainer, dependencies: [reduceMotion] },
  );
  return { bgcContainer, bgcRef };
}
