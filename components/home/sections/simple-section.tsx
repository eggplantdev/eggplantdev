import Link from "next/link";
import { SimpleHeader } from "@/components/general/simple-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/helpers/cn";

export type SimpleSectionPropsT = {
  id?: string;
  titleLine?: string[];
  text?: string;
  paragraphs?: string[];
  buttons?: {
    label: string;
    href: string;
  }[];
  className?: string;
  aside?: React.ReactNode;
};

export const SimpleSection = ({ id, titleLine, text, paragraphs, buttons, className, aside }: SimpleSectionPropsT) => {
  const resolvedParagraphs = paragraphs?.length ? paragraphs : text ? [text] : [];

  return (
    <section id={id} className={cn("fest-grid", className)}>
      <div className={cn("col-span-full", aside ? "640:col-span-7 1280:col-span-8" : "640:col-span-7")}>
        {titleLine && <SimpleHeader title={titleLine} />}

        {resolvedParagraphs.length > 0 && (
          <div className={`text-16 text-hero-title-secondary md:text-20 scalable space-y-5 pt-10 lg:pt-16`}>
            {resolvedParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        {buttons?.length ? (
          <div className="flex flex-wrap gap-3 pt-10 lg:pt-14">
            {buttons.map((button) => (
              <Button key={button.href + button.label} asChild className="font-mono uppercase">
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {aside && (
        <div className="640:col-span-5 1280:col-span-8 1280:col-start-9 1280:mt-0 1280:justify-end col-span-full mt-12 flex items-center justify-center overflow-hidden">
          {aside}
        </div>
      )}
    </section>
  );
};
