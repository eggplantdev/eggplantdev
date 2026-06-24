"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { cn } from "@/helpers/cn";
import { useReduceMotion } from "@/hooks/use-reduce-motion";
import { ScrambleTextBeta } from "@/components/general/scramble-text-beta";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// ScrambleText — scroll-triggered text scramble/unscramble animation
// ─────────────────────────────────────────────────────────────────────────────
//
// WHAT IT DOES
//   Renders each character as an individual <span>. On scroll-enter, letters
//   cascade left-to-right from random chars to the correct text (scrambleIn).
//   On scroll-leave, letters cascade right-to-left into random chars and
//   freeze (scrambleOut). All DOM mutations are direct (not React-managed).
//
// RECURRING PROBLEM — TEXT STUCK IN SCRAMBLED STATE
//   The animation starts with random chars and relies on ScrollTrigger to
//   fire scrambleIn. Several conditions can break this chain:
//
//   1. HMR re-render — useGSAP effect re-runs, reinitializes random chars.
//      If ScrollTrigger.refresh() doesn't fire or self.isActive is wrong,
//      text stays scrambled with no recovery.
//
//   2. Mobile timer throttling — browsers throttle setInterval during
//      momentum scrolling. A late interval can fire after the safety net,
//      overwriting correct text with randomChar().
//
//   3. ScrollTrigger refresh storms — resize, layout shift, or other
//      instances mounting trigger ScrollTrigger.refresh(). Each fires
//      onRefresh → scrambleIn, restarting before completion.
//
//   4. Stale trigger positions — parent re-renders (HMR) shift layout
//      without recalculating ScrollTrigger positions. Triggers fire at
//      wrong scroll offsets, causing premature scrambleOut or missed
//      scrambleIn.
//
// DEFENSE LAYERS
//
//   A. Generation counter (generationRef)
//      Every scrambleIn/scrambleOut increments a counter. All timer
//      callbacks compare against it and bail if stale.
//
//   B. Resolved flag (resolvedRef)
//      true = text shows correct characters (after scrambleIn).
//      false = text shows random chars (init, scrambleOut, or mid-animation).
//      Interval callbacks self-terminate when true. onRefresh only fires
//      scrambleIn when false (text is wrong and needs fixing).
//
//   C. State machine (stateRef: "idle" | "scrambling-in" | "scrambling-out")
//      Prevents onRefresh and passive-render refresh from interrupting a
//      running animation. Only scroll callbacks override regardless of state.
//
//   D. Safety net timeout (forceCorrectText)
//      After max theoretical duration, clears all intervals and forces
//      correct text. Last defense against timer edge cases.
//
//   E. Inline style.opacity (not className)
//      React reconciliation resets className on re-render but doesn't touch
//      inline styles. Animation opacity survives HMR re-renders.
//
//   F. Direct viewport check after ScrollTrigger creation
//      Catches cases where onRefresh hasn't fired yet — especially the HMR
//      case where the effect re-runs with the element already visible.
//
//   G. Passive-render refresh (effectRanRef + useEffect)
//      On re-renders where useGSAP did NOT run (parent HMR, unrelated state
//      change), fires a debounced ScrollTrigger.refresh() to recalculate
//      trigger positions that may have shifted with layout changes.
//
// ─────────────────────────────────────────────────────────────────────────────

// Module-level debounced refresh — prevents N instances from firing N global refreshes
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
const debouncedRefresh = () => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
};

// Character pool for random scramble display
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// How fast each letter cycles through random chars (ms between swaps)
const SCRAMBLE_INTERVAL_MS = 20;
// Delay between each letter starting its resolve/unsolve (creates left-to-right cascade)
const CASCADE_DELAY_MS = 50;
// How many random chars a letter shows before locking to the correct one
const SCRAMBLE_CYCLES = 6;
// How long the scramble-out animation runs before restoring readable text
const SCRAMBLE_OUT_DURATION_MS = 500;

type ScrambleTextPropsT = {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
  beta?: boolean;
};

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const ScrambleTextDefault = ({ text, className, triggerOnMount = false }: Omit<ScrambleTextPropsT, "beta">) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  // Separate tracking for timeouts and intervals — avoids double-clear ambiguity
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());
  // Guards against stale callbacks from a previous animation cycle mutating the DOM
  const generationRef = useRef(0);
  // Prevents late/throttled interval callbacks from overwriting resolved text
  const resolvedRef = useRef(false);
  // Keeps refresh/HMR sync logic from interrupting an active animation
  const stateRef = useRef<"idle" | "scrambling-in" | "scrambling-out">("idle");
  const isEnabled = !useReduceMotion();

  // Recalculate trigger positions after re-renders where the useGSAP effect
  // did NOT run (parent HMR, unrelated state change). The effect handles its
  // own refresh via debouncedRefresh(), so this only fires on "passive" renders.
  const effectRanRef = useRef(false);
  useEffect(() => {
    if (!effectRanRef.current) debouncedRefresh();
    effectRanRef.current = false;
  });

  useGSAP(
    () => {
      effectRanRef.current = true;

      const container = containerRef.current;
      if (!container) return;

      const chars = text.split("");
      const spans = container.children as HTMLCollectionOf<HTMLSpanElement>;

      // Skip animation entirely when disabled — show final text immediately
      if (!isEnabled) {
        chars.forEach((ch, i) => {
          spans[i].textContent = ch;
          spans[i].style.opacity = "1";
        });
        return;
      }

      // Force correct text + mark as resolved — used by scrambleIn safety net and init
      const forceCorrectText = () => {
        resolvedRef.current = true;
        stateRef.current = "idle";
        chars.forEach((char, i) => {
          spans[i].textContent = char;
          spans[i].style.opacity = "1";
        });
      };

      // Initialize with random chars — the visual starting state.
      // If the element is in viewport, scrambleIn fires immediately below
      // to resolve this. If off-screen, random chars are invisible (fine).
      resolvedRef.current = false;
      stateRef.current = "idle";
      chars.forEach((ch, i) => {
        spans[i].textContent = ch === " " ? " " : randomChar();
        spans[i].style.opacity = "0.7";
      });

      // Kill all running timers — called before starting any new animation
      // to prevent overlapping scramble-in and scramble-out from conflicting
      const clearTimers = () => {
        timeoutsRef.current.forEach((id) => clearTimeout(id));
        intervalsRef.current.forEach((id) => clearInterval(id));
        timeoutsRef.current.clear();
        intervalsRef.current.clear();
      };

      // Self-cleaning timeout — removes its own ID from the set after firing
      const addTimeout = (fn: () => void, ms: number) => {
        const id = setTimeout(() => {
          timeoutsRef.current.delete(id);
          fn();
        }, ms);
        timeoutsRef.current.add(id);
      };

      // Tracked interval — stored in set so clearTimers can kill it
      const addInterval = (fn: () => void, ms: number) => {
        const id = setInterval(fn, ms);
        intervalsRef.current.add(id);
        return id;
      };

      // Scroll enters viewport → resolve letters left-to-right
      // Each letter: wait (cascade delay) → cycle through random chars → lock to correct char
      const scrambleIn = () => {
        clearTimers();
        resolvedRef.current = false;
        stateRef.current = "scrambling-in";
        const gen = ++generationRef.current;

        chars.forEach((char, i) => {
          // Spaces stay as spaces for word wrapping — just toggle opacity with the cascade
          if (char === " ") {
            const delay = i * CASCADE_DELAY_MS;
            addTimeout(
              () => {
                if (generationRef.current !== gen) return;
                spans[i].style.opacity = "1";
              },
              delay + SCRAMBLE_CYCLES * SCRAMBLE_INTERVAL_MS,
            );
            return;
          }

          let cycles = 0;
          // Each letter starts its animation later than the previous → cascade effect
          const delay = i * CASCADE_DELAY_MS;

          addTimeout(() => {
            if (generationRef.current !== gen) return;
            // Rapidly swap this letter through random chars
            const intervalId = addInterval(() => {
              if (generationRef.current !== gen || resolvedRef.current) {
                clearInterval(intervalId);
                intervalsRef.current.delete(intervalId);
                return;
              }
              cycles++;

              // After enough random cycles, lock to the correct character
              if (cycles >= SCRAMBLE_CYCLES) {
                clearInterval(intervalId);
                intervalsRef.current.delete(intervalId);
                spans[i].textContent = char;
                spans[i].style.opacity = "1";
                return;
              }

              // Still scrambling — show a random character
              spans[i].textContent = randomChar();
            }, SCRAMBLE_INTERVAL_MS);
          }, delay);
        });

        // Safety net — force correct text after the animation's max theoretical duration.
        const maxDuration = chars.length * CASCADE_DELAY_MS + SCRAMBLE_CYCLES * SCRAMBLE_INTERVAL_MS + 200;
        addTimeout(() => {
          if (generationRef.current !== gen) return;
          intervalsRef.current.forEach((id) => clearInterval(id));
          intervalsRef.current.clear();
          forceCorrectText();
        }, maxDuration);
      };

      // Scroll leaves viewport → scramble right-to-left, then freeze on random chars
      const scrambleOut = () => {
        clearTimers();
        resolvedRef.current = false;
        stateRef.current = "scrambling-out";
        const gen = ++generationRef.current;

        // Reverse order so the last letter unsettles first → right-to-left cascade
        const reversed = [...chars.keys()].reverse();

        reversed.forEach((i, order) => {
          if (chars[i] === " ") {
            const delay = order * CASCADE_DELAY_MS;
            addTimeout(() => {
              if (generationRef.current !== gen) return;
              spans[i].style.opacity = "0.7";
            }, delay);
            return;
          }

          const delay = order * CASCADE_DELAY_MS;

          addTimeout(() => {
            if (generationRef.current !== gen) return;
            spans[i].style.opacity = "0.7";

            const intervalId = addInterval(() => {
              if (generationRef.current !== gen || resolvedRef.current) {
                clearInterval(intervalId);
                intervalsRef.current.delete(intervalId);
                return;
              }
              spans[i].textContent = randomChar();
            }, SCRAMBLE_INTERVAL_MS);
          }, delay);
        });

        // Freeze — stop cycling but leave random chars visible.
        // resolvedRef stays false so onRefresh can fix this if the element
        // becomes visible again (layout shift, resize, HMR).
        addTimeout(() => {
          if (generationRef.current !== gen) return;
          stateRef.current = "idle";
          intervalsRef.current.forEach((id) => clearInterval(id));
          intervalsRef.current.clear();
        }, SCRAMBLE_OUT_DURATION_MS);
      };

      if (triggerOnMount) {
        scrambleIn();
      } else {
        // Wire up GSAP ScrollTrigger — fires scrambleIn/Out as element enters/leaves viewport
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "bottom bottom-=10%",
          end: "top top+=10%",
          onEnter: scrambleIn,
          onLeave: scrambleOut,
          onEnterBack: scrambleIn,
          onLeaveBack: scrambleOut,
          onRefresh: (self) => {
            // Don't interrupt a running animation
            if (stateRef.current !== "idle") return;
            // Element visible + text is random (from init or scrambleOut) → resolve it
            if (self.isActive && !resolvedRef.current) scrambleIn();
          },
          markers: false,
        });

        // Direct viewport check — catches the initial case where onRefresh
        // hasn't fired yet, and the HMR case where the effect re-runs with
        // the element already in viewport
        if (ScrollTrigger.isInViewport(container, 0.2)) {
          scrambleIn();
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
    <span ref={containerRef} className={cn("wrap-break-words block whitespace-pre-wrap", className)}>
      {text.split("").map((_, i) => (
        <span key={i} className="opacity-70" />
      ))}
    </span>
  );
};

export const ScrambleText = ({ beta = false, ...props }: ScrambleTextPropsT) => {
  if (beta) {
    return <ScrambleTextBeta {...props} />;
  }

  return <ScrambleTextDefault {...props} />;
};

export type { ScrambleTextPropsT };
