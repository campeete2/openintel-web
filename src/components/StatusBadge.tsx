type Status = "PENDING" | "APPROVED" | "REJECTED";

const styles: Record<Status, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}
