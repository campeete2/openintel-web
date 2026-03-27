"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { ApprovalActions } from "@/components/ApprovalActions";
import { Suspense } from "react";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface OsintEntry {
  id: string; title: string; source: string; url?: string;
  description: string; tags: string[]; status: Status; notes?: string;
  createdAt: string; attachments: string[];
}
interface AsnEntry {
  id: string; asn: string; organization: string; country?: string;
  ipRanges: string[]; description?: string; tags: string[];
  status: Status; notes?: string; createdAt: string; attachments: string[];
}
interface OpenSourceEntry {
  id: string; title: string; dataType: string; sourceUrl?: string;
  description: string; tags: string[]; status: Status; notes?: string;
  createdAt: string; attachments: string[];
}

type ActiveTab = "osint" | "asns" | "open-source";
type StatusFilter = "ALL" | Status;

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    (searchParams.get("submitted") as ActiveTab) ?? "osint"
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [osint, setOsint] = useState<OsintEntry[]>([]);
  const [asns, setAsns] = useState<AsnEntry[]>([]);
  const [openSource, setOpenSource] = useState<OpenSourceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setOsint(data.osint);
        setAsns(data.asns);
        setOpenSource(data.openSource);
        setLoading(false);
      });
  }, []);

  function handleOsintUpdate(id: string, status: Status, notes: string) {
    setOsint((prev) => prev.map((e) => (e.id === id ? { ...e, status, notes } : e)));
  }
  function handleAsnUpdate(id: string, status: Status, notes: string) {
    setAsns((prev) => prev.map((e) => (e.id === id ? { ...e, status, notes } : e)));
  }
  function handleOsUpdate(id: string, status: Status, notes: string) {
    setOpenSource((prev) => prev.map((e) => (e.id === id ? { ...e, status, notes } : e)));
  }

  const tabs: { key: ActiveTab; label: string; count: number }[] = [
    { key: "osint", label: "OSINT", count: osint.length },
    { key: "asns", label: "ASNs", count: asns.length },
    { key: "open-source", label: "Open Source", count: openSource.length },
  ];

  const filterStatuses: StatusFilter[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Intelligence Dashboard</h1>
        <div className="flex gap-2">
          <a href="/submit/osint" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">+ OSINT</a>
          <a href="/submit/asns" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">+ ASN</a>
          <a href="/submit/open-source" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">+ Open Source</a>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
              {loading ? "…" : tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="mb-4 flex gap-2">
        {filterStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              statusFilter === s
                ? "bg-gray-800 text-white border-gray-800"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">Loading...</div>
      ) : (
        <>
          {activeTab === "osint" && (
            <OsintTable
              entries={osint.filter((e) => statusFilter === "ALL" || e.status === statusFilter)}
              onUpdate={handleOsintUpdate}
            />
          )}
          {activeTab === "asns" && (
            <AsnTable
              entries={asns.filter((e) => statusFilter === "ALL" || e.status === statusFilter)}
              onUpdate={handleAsnUpdate}
            />
          )}
          {activeTab === "open-source" && (
            <OpenSourceTable
              entries={openSource.filter((e) => statusFilter === "ALL" || e.status === statusFilter)}
              onUpdate={handleOsUpdate}
            />
          )}
        </>
      )}
    </main>
  );
}

function OsintTable({ entries, onUpdate }: { entries: OsintEntry[]; onUpdate: (id: string, status: Status, notes: string) => void }) {
  if (!entries.length) return <Empty />;
  return (
    <table className="w-full text-sm">
      <thead><tr className={th}>
        <Th>Title</Th><Th>Source</Th><Th>Tags</Th><Th>Status</Th><Th>Submitted</Th><Th>Actions</Th>
      </tr></thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{e.title}</p>
              {e.url && <a href={e.url} target="_blank" className="text-xs text-blue-500 hover:underline">{e.url}</a>}
            </td>
            <td className="px-4 py-3 text-gray-600">{e.source}</td>
            <td className="px-4 py-3"><Tags tags={e.tags} /></td>
            <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
            <td className="px-4 py-3 text-gray-400">{fmt(e.createdAt)}</td>
            <td className="px-4 py-3">
              <ApprovalActions id={e.id} currentStatus={e.status} apiPath="/api/osint" onUpdate={onUpdate} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AsnTable({ entries, onUpdate }: { entries: AsnEntry[]; onUpdate: (id: string, status: Status, notes: string) => void }) {
  if (!entries.length) return <Empty />;
  return (
    <table className="w-full text-sm">
      <thead><tr className={th}>
        <Th>ASN</Th><Th>Organization</Th><Th>Country</Th><Th>IP Ranges</Th><Th>Status</Th><Th>Actions</Th>
      </tr></thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-mono font-medium text-gray-900">{e.asn}</td>
            <td className="px-4 py-3 text-gray-700">{e.organization}</td>
            <td className="px-4 py-3 text-gray-500">{e.country ?? "—"}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {e.ipRanges.map((r) => <span key={r} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">{r}</span>)}
              </div>
            </td>
            <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
            <td className="px-4 py-3">
              <ApprovalActions id={e.id} currentStatus={e.status} apiPath="/api/asns" onUpdate={onUpdate} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OpenSourceTable({ entries, onUpdate }: { entries: OpenSourceEntry[]; onUpdate: (id: string, status: Status, notes: string) => void }) {
  if (!entries.length) return <Empty />;
  return (
    <table className="w-full text-sm">
      <thead><tr className={th}>
        <Th>Title</Th><Th>Type</Th><Th>Tags</Th><Th>Status</Th><Th>Submitted</Th><Th>Actions</Th>
      </tr></thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{e.title}</p>
              {e.sourceUrl && <a href={e.sourceUrl} target="_blank" className="text-xs text-blue-500 hover:underline">{e.sourceUrl}</a>}
            </td>
            <td className="px-4 py-3 capitalize text-gray-600">{e.dataType}</td>
            <td className="px-4 py-3"><Tags tags={e.tags} /></td>
            <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
            <td className="px-4 py-3 text-gray-400">{fmt(e.createdAt)}</td>
            <td className="px-4 py-3">
              <ApprovalActions id={e.id} currentStatus={e.status} apiPath="/api/open-source" onUpdate={onUpdate} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{t}</span>
      ))}
    </div>
  );
}

function Empty() {
  return <div className="py-16 text-center text-sm text-gray-400">No entries found.</div>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{children}</th>;
}

const th = "border-b border-gray-200 bg-gray-50";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
