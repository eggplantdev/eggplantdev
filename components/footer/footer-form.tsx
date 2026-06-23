"use client";

import { useState } from "react";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { sendEmail } from "@/helpers/send-email";
import { contactFormSchema } from "@/helpers/contact-schema";
import { useFormStatus } from "@/hooks/use-form-status";
import { ConfirmOverlay } from "@/components/general/confirm-overlay";
import { ErrorOverlay } from "@/components/general/error-overlay";
import { cn } from "@/helpers/cn";
import { FieldErrors } from "@/components/ui/field-errors";
import { SubmitButton } from "@/components/ui/submit-button";
import strings from "@/data/ui-copy.json";

function fieldProps(field: AnyFieldApi) {
  const hasErrors = field.state.meta.errors.length > 0;
  const errorId = `${field.name}-error`;
  return {
    name: field.name,
    value: field.state.value as string,
    onBlur: field.handleBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => field.handleChange(e.target.value),
    "aria-invalid": hasErrors,
    "aria-describedby": hasErrors ? errorId : undefined,
  } as const;
}

export function FooterForm({ className }: { className?: string }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const t = strings.form;

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await sendEmail({ ...value });
      setIsError(!result.success);
      setIsSuccess(result.success);
      if (result.success) form.reset();
    },
  });

  const { isSubmitting, canSubmit } = useFormStatus(form);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className={cn(`text-16 scalable text-black`, className)}
      >
        <form.Field name="name">
          {(field) => (
            <div className="relative">
              <input
                className={`border-copy-muted placeholder:text-16 placeholder:text-copy-muted h-12 w-full border-b lg:h-14`}
                type="text"
                placeholder={t.name}
                aria-label={t.name}
                autoComplete="name"
                {...fieldProps(field)}
              />
              <FieldErrors errors={field.state.meta.errors} id="name-error" />
            </div>
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <div className="relative">
              <input
                className={`border-copy-muted placeholder:text-16 placeholder:text-copy-muted h-12 w-full border-b lg:h-14`}
                type="email"
                placeholder={t.email}
                aria-label={t.email}
                autoComplete="email"
                {...fieldProps(field)}
              />
              <FieldErrors errors={field.state.meta.errors} id="email-error" />
            </div>
          )}
        </form.Field>
        <form.Field name="message">
          {(field) => (
            <div className="relative">
              <textarea
                className={`border-copy-muted placeholder:text-copy-muted field-sizing-content min-h-32 w-full border-b py-3`}
                placeholder={t.projectDetails}
                aria-label={t.projectDetails}
                {...fieldProps(field)}
              />
              <FieldErrors errors={field.state.meta.errors} id="message-error" className="bottom-2" />
            </div>
          )}
        </form.Field>
        <SubmitButton isSubmitting={isSubmitting} canSubmit={canSubmit} className="pt-3" />
      </form>
      <ConfirmOverlay isOpen={isSuccess} onClose={() => setIsSuccess(false)} />
      <ErrorOverlay isOpen={isError} onClose={() => setIsError(false)} />
    </>
  );
}
