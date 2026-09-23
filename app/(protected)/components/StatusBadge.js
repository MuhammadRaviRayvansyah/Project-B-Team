export function getStatusStyle(rawStatus) {
  const status = String(rawStatus || "").trim().toLowerCase();

  switch (status) {
    case "sedang dipinjam":
      return { bg: "bg-slate-800", text: "text-white", dot: "bg-sky-400" };
    case "menunggu persetujuan":
      return { bg: "bg-amber-900", text: "text-white", dot: "bg-amber-400" };
    case "disetujui":
      return { bg: "bg-emerald-900", text: "text-white", dot: "bg-emerald-400" };
    case "dikembalikan":
      return { bg: "bg-slate-200", text: "text-slate-700", dot: "bg-slate-500" };
    case "ditolak":
      return { bg: "bg-rose-900", text: "text-white", dot: "bg-rose-400" };
    default:
      return { bg: "bg-slate-800", text: "text-white", dot: "bg-slate-400" };
  }
}

export default function StatusBadge({ status }) {
  const s = getStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status || "Tidak Diketahui"}
    </span>
  );
}