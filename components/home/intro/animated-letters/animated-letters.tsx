import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useRef } from "react";
import useWindowSize from "@/hooks/use-window-size";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useI18nContext } from "@/lib/i18n/translations-provider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Overlay-mask variant (inspired by aaronmcguire.design).
 * Instead of animating backgroundSize on the text, this places a solid
 * overlay div (.line-mask) on each line and shrinks its width from 103% → 0%.
 * The text is always fully rendered underneath; the mask just covers it.
 */
export const AnimatedLettersMask = ({ text = "" }) => {
  const lettersRef = useRef<HTMLDivElement>(null);
  const { clientWidth } = useWindowSize();
  const { locale } = useI18nContext();
  const splitRef = useRef<SplitType | null>(null);
  const isEnabled = usePreferencesStore((s) => s.letterAnimations);

  useGSAP(
    () => {
      if (!isEnabled) return;

      splitRef.current = new SplitType("#target-mask", { types: "lines" });

      gsap.utils.toArray<HTMLElement>("#target-mask .line").forEach((line) => {
        line.style.position = "relative";

        // Use the line's actual text width (+ small buffer) so the mask
        // matches the content length, not the full container width.
        const textWidth = line.scrollWidth + 4;

        const mask = document.createElement("div");
        mask.classList.add("line-mask-overlay");
        line.appendChild(mask);

        gsap.fromTo(
          mask,
          {
            backgroundColor: "var(--color-bgc)",
            opacity: 0.9,
            width: textWidth,
            height: "100%",
            right: 0,
            top: 0,
            position: "absolute",
            zIndex: 20,
            pointerEvents: "none",
          },
          {
            width: "0%",
            scrollTrigger: {
              trigger: line,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 1,
            },
          },
        );
      });

      const timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.querySelectorAll("#target-mask .line-mask-overlay").forEach((el) => el.remove());
        splitRef.current?.revert();
      };
    },
    { scope: lettersRef, dependencies: [clientWidth, isEnabled], revertOnUpdate: true },
  );

  return (
    <div className={`fest-container`}>
      <div
        ref={lettersRef}
        className={`flex flex-col overflow-x-clip pr-12 sm:w-[calc(340/360*100vw)] md:w-[calc(590/768*100vw)] md:pt-[120px] md:pr-0 lg:w-[calc(740/1024*100vw)] lg:max-w-[940px]`}
      >
        <div
          id="target-mask"
          className={`text-hero-title-secondary wrap-break-words text-34 450:text-34 md:text-64 lg:text-80 xl:text-96 font-mono font-medium tracking-tight uppercase ${locale === "pl" ? "leading-[1.2]" : ""}`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
