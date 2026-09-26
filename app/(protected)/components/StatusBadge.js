export function getStatusStyle(rawStatus) {
  const status = String(rawStatus || "").trim().toLowerCase();

  switch (status) {
    case "pending":
    case "menunggu":
    case "menunggu persetujuan":
      return { 
        bg: "bg-amber-50 text-amber-800 border border-amber-200", 
        dot: "bg-amber-500",
        label: "Menunggu"
      };
    case "disetujui":
      return { 
        bg: "bg-sky-50 text-sky-800 border border-sky-200", 
        dot: "bg-sky-500",
        label: "Disetujui"
      };
    case "dipinjam":
    case "sedang dipinjam":
      return { 
        bg: "bg-blue-50 text-blue-800 border border-blue-200", 
        dot: "bg-blue-500",
        label: "Sedang Dipinjam"
      };
    case "dikembalikan":
      return { 
        bg: "bg-emerald-50 text-emerald-800 border border-emerald-200", 
        dot: "bg-emerald-500",
        label: "Dikembalikan"
      };
    case "selesai":
      return { 
        bg: "bg-emerald-50 text-emerald-800 border border-emerald-200", 
        dot: "bg-emerald-500",
        label: "Selesai"
      };
    case "ditolak":
    case "dibatalkan":
      return { 
        bg: "bg-rose-50 text-rose-800 border border-rose-200", 
        dot: "bg-rose-500",
        label: "Ditolak"
      };
    default:
      return { 
        bg: "bg-slate-100 text-slate-700 border border-slate-200", 
        dot: "bg-slate-400",
        label: rawStatus || "Unknown"
      };
  }
}

export default function StatusBadge({ status }) {
  const s = getStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-xs ${s.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}