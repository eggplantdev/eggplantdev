"use client";

import { cn } from "@/helpers/cn";
import strings from "@/data/ui-copy.json";

type SubmitButtonPropsT = {
  isSubmitting: boolean;
  canSubmit: boolean;
  className?: string;
};

export function SubmitButton({ isSubmitting, canSubmit, className }: SubmitButtonPropsT) {
  const t = strings.common;

  return (
    <button
      type="submit"
      disabled={!canSubmit}
      className={cn("text-24 w-full cursor-pointer text-start font-mono uppercase disabled:opacity-50", className)}
    >
      <span className={`text-black`}>{isSubmitting ? t.sending : t.submit}</span>
    </button>
  );
}
