import Link from "next/link";

const forms = [
  {
    href: "/submit/osint",
    label: "OSINT",
    description: "Open Source Intelligence — sources, actors, indicators",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    icon: "🔍",
  },
  {
    href: "/submit/asns",
    label: "ASNs",
    description: "Autonomous System Numbers — organizations, IP ranges",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    icon: "🌐",
  },
  {
    href: "/submit/open-source",
    label: "Open Source Data",
    description: "Datasets, reports, repositories, and public feeds",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    icon: "📂",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">OpenIntel</h1>
        <p className="mt-3 text-lg text-gray-500">Intelligence collection and review platform</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          View Dashboard →
        </Link>
      </div>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Submit Intelligence</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {forms.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`rounded-xl border-2 p-6 transition-colors ${f.color}`}
          >
            <div className="mb-2 text-3xl">{f.icon}</div>
            <h3 className="font-semibold text-gray-900">{f.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{f.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
