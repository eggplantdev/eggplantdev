"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import strings from "@/data/ui-copy.json";

const contactEmail = process.env.NEXT_PUBLIC_EMAIL_USER ?? "";

type ErrorOverlayPropsT = {
  isOpen: boolean;
  onClose: () => void;
};

export function ErrorOverlay({ isOpen, onClose }: ErrorOverlayPropsT) {
  const t = strings.form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex h-dvh w-dvw max-w-none cursor-pointer items-center justify-center bg-black"
        onClick={onClose}
      >
        <div className="grit-subtle pointer-events-none absolute inset-0" />
        <DialogTitle className="sr-only">{t.errorTitle}</DialogTitle>
        <div className="relative flex flex-col items-center gap-6 px-4">
          <p className="text-24 md:text-28 max-w-2xl text-center font-mono text-balance text-red-500 uppercase">
            {t.errorMessage}
          </p>
          <p className="text-16 text-copy-muted text-center">{t.errorEmailFallback}</p>
          <a
            href={`mailto:${contactEmail}`}
            onClick={(e) => e.stopPropagation()}
            className="text-16 md:text-20 hover:text-copy-muted text-primary font-mono underline underline-offset-4 transition-colors"
          >
            {contactEmail}
          </a>
          <p className="text-16 text-copy-muted mt-4">{t.clickToClose}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
