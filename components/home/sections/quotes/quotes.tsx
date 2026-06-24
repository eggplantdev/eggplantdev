"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/helpers/cn";
import { useReduceMotion } from "@/hooks/use-reduce-motion";
import { QuoteT } from "@/types/home-page-types";

const AUTOPLAY_DELAY = 10000;

type QuotesPropsT = {
  data: QuoteT[];
};

export const Quotes = ({ data }: QuotesPropsT) => {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReduceMotion();

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % data.length);
  }, [data.length]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [next, reduceMotion]);

  return (
    <section ref={quoteRef} className={`fest-grid group relative`}>
      <div className={cn(`640:col-span-7 relative col-span-full md:col-span-8`)}>
        {/* All quotes rendered; tallest sets the container height naturally.
            Only the active one is visible via opacity. */}
        <div className="relative">
          {data.map((q, i) => (
            <motion.div
              key={q.name}
              className={cn(i === 0 ? "relative" : "absolute inset-0", i !== activeIndex && "pointer-events-none")}
              animate={{
                opacity: i === activeIndex ? 1 : 0,
                y: i === activeIndex ? 0 : 6,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              aria-hidden={i !== activeIndex}
            >
              <QuoteContent q={q} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const QuoteContent = ({ q }: { q: QuoteT }) => (
  <>
    <p className="text-16 text-copy-body md:text-20 shrink-0 pt-20 lg:pt-25 xl:pt-30">{q.quote}</p>
    <div className="xxl:pt-17 flex w-full flex-col pt-8 md:pt-10">
      <p className="text-16 text-copy-strong md:text-20">{q.name}</p>
      <p className="text-16 text-copy-body">{q.title}</p>
    </div>
  </>
);
