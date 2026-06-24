"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

// Propagates the reduce-motion preference to every Framer Motion component at once.
// "always" hard-disables transform/layout animations (keeping opacity, which is
// considered motion-safe); "user" defers to the OS for visitors who haven't
// flipped the master switch.
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReduceMotion();
  return <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>;
}
