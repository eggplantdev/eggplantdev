"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { EggplantLogo } from "@/components/top-navigation/eggplant-logo";
import { MenuButton } from "@/components/top-navigation/menu-button/menu-button";
import { SnakeBorder } from "@/components/top-navigation/snake-border/snake-border";
import { AccessibilityMenu } from "@/components/accessibility/accessibility-menu";
import { MobileMenu } from "@/components/accessibility/mobile-menu";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useMinMD } from "@/hooks/use-media-query";
import { RoundedSeparator } from "@/components/general/rounded-separator";
import { AnimationToggles } from "@/components/accessibility/animation-toggles";
import { useTranslation } from "@/lib/i18n/hooks/use-translation";
import { useBrandIntro } from "@/components/brand/brand-intro-context";

export function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMinMD();
  const { t } = useTranslation("accessibility");
  const phase = useBrandIntro();
  // The brand intro veil is opaque through idle → splash → morph; keep the hamburger/dropdown out of
  // sight behind it so no stray chrome floats over the splash. The logo participates in the morph.
  const chromeHidden = phase === "idle" || phase === "splash" || phase === "morph";
  // Lift the logo's stacking context above the veil (z-100000) while the splash logo morphs into it,
  // otherwise the nav's z-99999 context would trap the morph target behind the still-opaque veil.
  const logoLifted = phase === "morph" || phase === "reveal";
  useClickOutside([menuRef, buttonRef], () => {
    if (isDesktop) setIsOpen(false);
  });

  const handleToggle = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (!isDesktop) {
      document.documentElement.style.overflow = willOpen ? "hidden" : "";
    }
  };

  return (
    <>
      {/* Logo — animated eggplant brand mark, always visible (and the splash's morph target) */}
      <div className={`pointer-events-none fixed top-0 right-0 left-0 ${logoLifted ? "z-100001" : "z-99999"}`}>
        <div className="fest-container flex w-full items-start">
          <EggplantLogo />
        </div>
      </div>

      {/* Hamburger — own layer with mix-blend-difference so it auto-inverts on any background */}
      <div
        className={`pointer-events-none fixed top-0 right-0 left-0 z-99999 mix-blend-difference transition-opacity duration-300 ${chromeHidden ? "opacity-0" : "opacity-100"}`}
      >
        <div className="fest-container flex w-full items-start justify-end">
          <MenuButton ref={buttonRef} className="pointer-events-auto" onClick={handleToggle} isOpen={isOpen} />
        </div>
      </div>

      {/* Desktop dropdown — separate layer, no blend mode */}
      {isDesktop && !chromeHidden && (
        <div className="pointer-events-none fixed top-0 right-0 left-0 z-99998">
          <div className="fest-container flex w-full items-start justify-end">
            <div ref={menuRef} className="pointer-events-auto relative mt-[60px] flex w-[300px] flex-col items-end">
              <SnakeBorder
                isVisible={isOpen}
                borderRadius={6}
                strokeWidth={2.5}
                duration={1}
                className="text-primary rounded-md"
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : -10,
                  }}
                  transition={{
                    opacity: isOpen ? { duration: 0.4, ease: "easeOut", delay: 0.5 } : { duration: 0.4, delay: 0 },
                    y: isOpen ? { duration: 0.4, ease: "easeOut", delay: 0.5 } : { duration: 0.4, delay: 0 },
                  }}
                  data-slot="nav-dropdown"
                  inert={!isOpen ? true : undefined}
                  style={{ pointerEvents: isOpen ? "auto" : "none" }}
                  className="p-[2px]"
                >
                  <div className={`bg-bgc rounded-md`}>
                    <div className="grit text-primary grid-cols-1 p-5">
                      <AccessibilityMenu className="uppercase" />
                      <RoundedSeparator className="my-4" />
                      <p className="text-copy-body scalable pb-4 text-xs text-balance">{t("animationNotice")}</p>
                      <AnimationToggles className="uppercase" />
                    </div>
                  </div>
                </motion.div>
              </SnakeBorder>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: full drawer */}
      {!isDesktop && <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
}
