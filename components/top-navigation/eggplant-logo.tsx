"use client";

import Link from "next/link";
import { AnimatedBrandLogo } from "@/components/brand/animated-brand-logo";
import { cn } from "@/helpers/cn";

export function EggplantLogo({ className, link = true }: { className?: string; link?: boolean }) {
  const eggplantLogo = <AnimatedBrandLogo className={cn("size-10 sm:size-20 lg:size-32", className)} />;

  if (!link) return eggplantLogo;

  return (
    <Link
      href="/"
      className="pointer-events-auto -ml-3 rounded-md py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      onClick={(e) => {
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {eggplantLogo}
    </Link>
  );
}
