import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked fade + scale-down on a single element. As the element scrolls
 * up out of view it fades to 0 and shrinks; scrubbed, so scrolling back up
 * reverses it. Returns a ref to attach to the element.
 */
export function useScrollFadeOut() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      opacity: 0,
      scale: 0.85,
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "center top",
        scrub: 1,
      },
    });
  }, []);

  return ref;
}
