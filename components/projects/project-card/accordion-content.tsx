import * as Accordion from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { GlowWrapper } from "@/components/general/glow-wrapper";
import strings from "@/data/ui-copy.json";

type AccordionContentPropsT = {
  isOpen: boolean;
  description: string;
  tags: string[];
  url: string | undefined;
};

// forceMount keeps Radix from unmounting so AnimatePresence can run exit animations.
export function AccordionContentPanel({ isOpen, description, tags, url }: AccordionContentPropsT) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <Accordion.Content forceMount asChild className={`overflow-visible`}>
          <motion.div
            initial={{ height: 0, opacity: 0, y: 8 }}
            animate={{
              height: "auto",
              opacity: 1,
              y: 0,
              transition: {
                height: { duration: 0.4, ease: [0.87, 0, 0.13, 1] },
                opacity: { duration: 0.4, delay: 0.25, ease: "easeOut" },
                y: { duration: 0.4, delay: 0.25, ease: "easeOut" },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.25, ease: [0.87, 0, 0.13, 1] },
            }}
            className="overflow-hidden"
          >
            <ContentInner description={description} tags={tags} url={url} />
          </motion.div>
        </Accordion.Content>
      )}
    </AnimatePresence>
  );
}

type ContentInnerPropsT = Omit<AccordionContentPropsT, "isOpen">;

// Exported for reuse in the offscreen measurement container (projects-accordion.tsx)
// that calculates the tallest panel height before any user interaction.
export function ContentInner({ description, tags, url }: ContentInnerPropsT) {
  const t = strings.projects;

  return (
    <div className="scalable grid gap-6 pr-10 pb-12">
      <p className="text-16 text-hero-title-secondary text-balance whitespace-pre-wrap">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="border-gold-caption/40 text-16 text-gold-caption/40 rounded-lg border px-3">
              {tag}
            </span>
          ))}
        </div>
      )}

      {url && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-16 text-hero-title-secondary hover:text-copy-strong relative w-fit transition-colors duration-300"
        >
          <GlowWrapper className={`-inset-x-5 -inset-y-3`}>{t.visitWebsite}</GlowWrapper>
        </Link>
      )}
    </div>
  );
}
