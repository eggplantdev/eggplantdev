"use server";

import nodemailer from "nodemailer";
import { env } from "@/helpers/env";
import { buildAutoReplyEmail } from "@/helpers/email-templates/templates/auto-reply";

type SendEmailDataT = {
  name?: string;
  email: string;
  message?: string;
};

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: env.NEXT_PUBLIC_EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendEmail(data: SendEmailDataT) {
  if (!data.email) {
    throw new Error("Email is required");
  }

  try {
    await transporter.sendMail({
      from: env.NEXT_PUBLIC_EMAIL_USER,
      to: env.EMAIL_TO,
      replyTo: data.email,
      subject: `Portfolio contact: ${data.name ?? data.email}`,
      text: [
        `Name: ${data.name ?? "N/A"}`,
        `Email: ${data.email}`,
        "",
        `message: ${data.message ?? "(no message)"}`,
      ].join("\n"),
    });

    await transporter.sendMail({
      from: env.NEXT_PUBLIC_EMAIL_USER,
      to: data.email,
      subject: "Thanks for reaching out!",
      html: buildAutoReplyEmail(data.name),
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Send email failed:", message);
    return { success: false };
  }
}
