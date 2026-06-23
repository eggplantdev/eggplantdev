"use client";

import { useState } from "react";
import { buildAutoReplyEmail } from "@/helpers/email-templates/templates/auto-reply";
import { buildBlankEmail } from "@/helpers/email-templates/templates/blank";
import { notFound } from "next/navigation";

const templates = [
  {
    id: "auto-reply",
    name: "Auto Reply",
    generate: () => buildAutoReplyEmail("Jan", { preview: true }),
  },
  {
    id: "blank",
    name: "Blank (copy for Apple Mail)",
    generate: () => buildBlankEmail({ preview: true }),
  },
];

export default function EmailPreviewsPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [copied, setCopied] = useState(false);

  const selected = templates.find((t) => t.id === selectedId) ?? templates[0];
  const html = selected.generate();

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bgc mt-28 flex h-screen flex-col font-mono text-white">
      <header className="border-gray7 flex items-center justify-between border-b p-4">
        <h1 className="text-16 font-bold tracking-wider uppercase">Email Templates</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border-gray2 bg-bgc text-16 rounded border px-3 py-2 text-white"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className="border-gray7 text-16 rounded border px-4 py-2 transition hover:border-white"
          >
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>
      </header>

      <main className="flex flex-1 gap-0 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="border-gray7 text-16 text-gray7 flex justify-between border-b px-4 py-2">
            <span>Preview (560px centered)</span>
            <span>{selected.name}</span>
          </div>
          <iframe title="Email Preview" srcDoc={html} className="h-full w-full border-none" />
        </div>
      </main>
    </div>
  );
}
