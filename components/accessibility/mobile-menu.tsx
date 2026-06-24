"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AccessibilityMenu } from "./accessibility-menu";
import strings from "@/data/ui-copy.json";
import { AnimationToggles } from "./animation-toggles";
import { RoundedSeparator } from "../general/rounded-separator";

type MobileMenuPropsT = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function MobileMenu({ isOpen, setIsOpen }: MobileMenuPropsT) {
  const t = strings.accessibility;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="preferences menu"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.87, 0, 0.13, 1] }}
          className="bg-bgc text-primary no-scrollbar fixed inset-0 z-9999 flex flex-col font-mono"
        >
          <div className="fest-container mt-auto flex flex-col overflow-x-hidden overflow-y-auto pt-40 pb-6">
            <div className="grid grid-cols-1">
              <RoundedSeparator className="my-6" />

              <AccessibilityMenu className="uppercase" />
              <RoundedSeparator className="my-6" />
              <p className="text-16 text-hero-title-secondary scalable pb-6 text-balance">{t.animationNotice}</p>
              <AnimationToggles className="uppercase" />
              <RoundedSeparator className="my-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
