import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ScrambleText } from "@/components/general/scramble-text";
import { GlowArrow } from "@/components/general/glow-arrow";
import { GlowWrapper } from "@/components/general/glow-wrapper";
import { cn } from "@/helpers/cn";

type AccordionTriggerPropsT = {
  name: string;
  year: string | undefined;
  domains: string[] | undefined;
  isOpen: boolean;
  hasUrl: boolean;
  nameFontClass: string;
};

export function AccordionTrigger({ name, year, domains, isOpen, hasUrl, nameFontClass }: AccordionTriggerPropsT) {
  return (
    <Accordion.Trigger className="group/trigger w-full cursor-pointer transition-transform duration-300 group-hover/card:translate-y-[-6px]">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-6">
        <div className="flex flex-col items-start gap-1">
          <GlowWrapper
            className="w-fit"
            glowClassName="-inset-x-5 -inset-y-3 rounded-full group-hover/trigger:opacity-100"
          >
            <ScrambleText
              className={cn("text-24 text-hero-title-secondary leading-none uppercase", nameFontClass)}
              text={name}
              triggerOnMount
              beta
            />
            {/* <h3 className="text-24 text-hero-title-secondary font-mono uppercase">{name}</h3> */}
          </GlowWrapper>
          {year && <p className="text-16 text-gold-caption/40 scalable">{year}</p>}
          {domains && domains.length > 0 && (
            <p className="text-12 text-gold-caption/70 scalable font-mono tracking-widest uppercase">
              {domains.join(" · ")}
            </p>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: [0.87, 0, 0.13, 1] }}
          className="self-center"
        >
          <GlowArrow inactive={!hasUrl} />
        </motion.div>
      </div>
    </Accordion.Trigger>
  );
}
