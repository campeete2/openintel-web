"use client";

import { useState } from "react";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface Props {
  id: string;
  currentStatus: Status;
  apiPath: string; // e.g. "/api/osint"
  onUpdate?: (id: string, status: Status, notes: string) => void;
}

export function ApprovalActions({ id, currentStatus, apiPath, onUpdate }: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function updateStatus(status: Status) {
    setLoading(true);
    const res = await fetch(`${apiPath}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    const updated = await res.json();
    setLoading(false);
    setOpen(false);
    onUpdate?.(id, updated.status, updated.notes ?? "");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-blue-600 hover:underline"
      >
        Review
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-10 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase">Reviewer Notes</p>
          <textarea
            className="mb-2 w-full rounded border border-gray-200 p-1.5 text-sm resize-none"
            rows={2}
            placeholder="Optional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              disabled={loading || currentStatus === "APPROVED"}
              onClick={() => updateStatus("APPROVED")}
              className="flex-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-40 hover:bg-green-700"
            >
              Approve
            </button>
            <button
              disabled={loading || currentStatus === "REJECTED"}
              onClick={() => updateStatus("REJECTED")}
              className="flex-1 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-40 hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
