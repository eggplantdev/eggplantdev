"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { cn } from "@/helpers/cn";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

gsap.registerPlugin(ScrollTrigger);

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
const debouncedRefresh = () => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLE_INTERVAL_MS = 20;
const CASCADE_DELAY_MS = 50;
const SCRAMBLE_CYCLES = 6;
const SCRAMBLE_OUT_DURATION_MS = 500;

type ScrambleTextBetaPropsT = {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
};

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export const ScrambleTextBeta = ({ text, className, triggerOnMount = false }: ScrambleTextBetaPropsT) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());
  const generationRef = useRef(0);
  const resolvedRef = useRef(false);
  const stateRef = useRef<"idle" | "scrambling-in" | "scrambling-out">("idle");
  const isEnabled = !useReduceMotion();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars = text.split("");
      const baseText = container.querySelector<HTMLElement>("[data-scramble-base]");
      const overlayContainer = container.querySelector<HTMLElement>("[data-scramble-overlay]");
      if (!baseText || !overlayContainer) return;

      const overlaySpans = overlayContainer.children as HTMLCollectionOf<HTMLSpanElement>;

      const hideOverlay = () => {
        resolvedRef.current = true;
        stateRef.current = "idle";
        baseText.style.opacity = "1";
        chars.forEach((char, i) => {
          overlaySpans[i].textContent = char;
          overlaySpans[i].style.opacity = "0";
        });
      };

      if (!isEnabled) {
        hideOverlay();
        return;
      }

      hideOverlay();

      const clearTimers = () => {
        timeoutsRef.current.forEach((id) => clearTimeout(id));
        intervalsRef.current.forEach((id) => clearInterval(id));
        timeoutsRef.current.clear();
        intervalsRef.current.clear();
      };

      const addTimeout = (fn: () => void, ms: number) => {
        const id = setTimeout(() => {
          timeoutsRef.current.delete(id);
          fn();
        }, ms);
        timeoutsRef.current.add(id);
      };

      const addInterval = (fn: () => void, ms: number) => {
        const id = setInterval(fn, ms);
        intervalsRef.current.add(id);
        return id;
      };

      const scrambleIn = () => {
        clearTimers();
        resolvedRef.current = false;
        stateRef.current = "scrambling-in";
        const gen = ++generationRef.current;
        baseText.style.opacity = "0";

        chars.forEach((char, i) => {
          overlaySpans[i].textContent = char === " " ? " " : randomChar();
          overlaySpans[i].style.opacity = char === " " ? "0" : "1";
        });

        chars.forEach((char, i) => {
          if (char === " ") return;

          let cycles = 0;
          const delay = i * CASCADE_DELAY_MS;

          addTimeout(() => {
            if (generationRef.current !== gen) return;
            const intervalId = addInterval(() => {
              if (generationRef.current !== gen || resolvedRef.current) {
                clearInterval(intervalId);
                intervalsRef.current.delete(intervalId);
                return;
              }

              cycles++;

              if (cycles >= SCRAMBLE_CYCLES) {
                clearInterval(intervalId);
                intervalsRef.current.delete(intervalId);
                overlaySpans[i].textContent = char;
                overlaySpans[i].style.opacity = "0";
                return;
              }

              overlaySpans[i].textContent = randomChar();
            }, SCRAMBLE_INTERVAL_MS);
          }, delay);
        });

        const maxDuration = chars.length * CASCADE_DELAY_MS + SCRAMBLE_CYCLES * SCRAMBLE_INTERVAL_MS + 200;
        addTimeout(() => {
          if (generationRef.current !== gen) return;
          intervalsRef.current.forEach((id) => clearInterval(id));
          intervalsRef.current.clear();
          hideOverlay();
        }, maxDuration);
      };

      const syncResolvedText = () => {
        clearTimers();
        ++generationRef.current;
        hideOverlay();
      };

      const scrambleOut = () => {
        if (!ScrollTrigger.isScrolling() || ScrollTrigger.isInViewport(container, 0.2)) {
          syncResolvedText();
          return;
        }

        clearTimers();
        resolvedRef.current = false;
        stateRef.current = "scrambling-out";
        const gen = ++generationRef.current;
        baseText.style.opacity = "0";
        const reversed = [...chars.keys()].reverse();

        reversed.forEach((i, order) => {
          if (chars[i] === " ") return;

          const delay = order * CASCADE_DELAY_MS;

          addTimeout(() => {
            if (generationRef.current !== gen) return;
            overlaySpans[i].textContent = randomChar();
            overlaySpans[i].style.opacity = "0.92";

            const intervalId = addInterval(() => {
              if (generationRef.current !== gen || resolvedRef.current) {
                clearInterval(intervalId);
                intervalsRef.current.delete(intervalId);
                return;
              }

              overlaySpans[i].textContent = randomChar();
            }, SCRAMBLE_INTERVAL_MS);
          }, delay);
        });

        addTimeout(() => {
          if (generationRef.current !== gen) return;
          intervalsRef.current.forEach((id) => clearInterval(id));
          intervalsRef.current.clear();
          hideOverlay();
        }, SCRAMBLE_OUT_DURATION_MS);
      };

      if (triggerOnMount) {
        scrambleIn();
      } else {
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "bottom bottom-=10%",
          end: "top top+=10%",
          onEnter: scrambleIn,
          onLeave: scrambleOut,
          onEnterBack: scrambleIn,
          onLeaveBack: scrambleOut,
          onRefresh: (self) => {
            if (stateRef.current !== "idle") return;
            syncResolvedText();
            if (self.isActive) scrambleIn();
          },
        });

        if (ScrollTrigger.isInViewport(container, 0.2)) {
          scrambleIn();
        } else {
          syncResolvedText();
        }

        debouncedRefresh();

        return () => {
          trigger.kill();
          clearTimers();
        };
      }

      return () => {
        clearTimers();
      };
    },
    { scope: containerRef, dependencies: [text, isEnabled], revertOnUpdate: true },
  );

  return (
    <span ref={containerRef} className={cn("wrap-break-words relative block whitespace-pre-wrap", className)}>
      <span data-scramble-base className="transition-opacity duration-150 ease-out">
        {text}
      </span>
      <span
        aria-hidden="true"
        data-scramble-overlay
        className="pointer-events-none absolute inset-0 block whitespace-pre-wrap"
      >
        {text.split("").map((char, i) => (
          <span key={i} className="transition-opacity duration-150 ease-out">
            {char}
          </span>
        ))}
      </span>
    </span>
  );
};
