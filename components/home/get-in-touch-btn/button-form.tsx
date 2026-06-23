"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { ConfirmOverlay } from "@/components/general/confirm-overlay";
import { ErrorOverlay } from "@/components/general/error-overlay";
import { sendEmail } from "@/helpers/send-email";
import { quickContactSchema } from "@/helpers/contact-schema";
import { useFormStatus } from "@/hooks/use-form-status";
import { Spinner } from "@/components/general/spinner";
import { FieldErrors } from "@/components/ui/field-errors";
import { SubmitButton } from "@/components/ui/submit-button";
import strings from "@/data/ui-copy.json";

type ButtonFormPropsT = {
  closeBtn: () => void;
  open: boolean;
};

// do not remove!
export function ButtonForm({ closeBtn, open }: ButtonFormPropsT) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const t = strings.form;

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: quickContactSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await sendEmail({ ...value });
      setIsError(!result.success);
      setIsSuccess(result.success);
      if (result.success) {
        form.reset();
        closeBtn();
      }
    },
  });

  const { isSubmitting, canSubmit } = useFormStatus(form);

  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

  return (
    <>
      <p className="text-16 w-[170px] pt-6 text-start">{t.quickContactPrompt}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <div className="relative">
              <input
                className="border-copy-muted text-16 placeholder:text-copy-muted mt-6 h-12 w-full border-b outline-none"
                type="email"
                placeholder={t.email}
                aria-label={t.email}
                autoComplete="email"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={field.state.meta.errors.length > 0 ? "quick-email-error" : undefined}
              />
              <FieldErrors errors={field.state.meta.errors} id="quick-email-error" />
            </div>
          )}
        </form.Field>
        <SubmitButton isSubmitting={isSubmitting} canSubmit={canSubmit} className="pt-5" />
      </form>
      <ConfirmOverlay isOpen={isSuccess} onClose={() => setIsSuccess(false)} />
      <ErrorOverlay isOpen={isError} onClose={() => setIsError(false)} />
    </>
  );
}
