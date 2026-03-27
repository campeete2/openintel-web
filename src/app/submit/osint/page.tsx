"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/FileUpload";

export default function OsintForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/osint", { method: "POST", body: formData });

    if (res.ok) {
      router.push("/dashboard?submitted=osint");
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Submission failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Submit OSINT Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input name="title" required className={input} placeholder="Brief title for this intelligence" />
        </Field>

        <Field label="Source" required>
          <input name="source" required className={input} placeholder="e.g. Twitter, Telegram, News article" />
        </Field>

        <Field label="Source URL">
          <input name="url" type="url" className={input} placeholder="https://..." />
        </Field>

        <Field label="Description" required>
          <textarea name="description" required rows={4} className={input} placeholder="Detailed description of the intelligence..." />
        </Field>

        <Field label="Tags" hint="Comma-separated">
          <input name="tags" className={input} placeholder="threat, actor, ransomware" />
        </Field>

        <Field label="Attachments" hint="Screenshots, photos, videos, documents">
          <FileUpload name="attachments" />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-gray-400">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const input =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
