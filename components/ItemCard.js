import Link from "next/link";
import RatingStars from "@/components/RatingStars";

export default function ItemCard({ id_barang, nama_barang, nama_kategori, ukuran, stok, harga_sewa, gambar, ulasan = [] }) {
  const avgRating = ulasan.length ? ulasan.reduce((sum, r) => sum + r.rating, 0) / ulasan.length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all h-full">
      <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
        <img 
          src={gambar || "/placeholder.png"} 
          alt={nama_barang || "Barang"} 
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => { e.target.src = "/placeholder.png"; }}
        />
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm ${stok > 0 ? "bg-emerald-900 text-white" : "bg-slate-800 text-white"}`}>
            {stok > 0 ? "Tersedia" : "Habis"}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{nama_kategori || "Umum"}</span>
        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">{nama_barang}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars rating={avgRating} size={14} />
          <span className="text-[10px] text-slate-500 font-medium">{ulasan.length > 0 ? `${avgRating.toFixed(1)} (${ulasan.length} ulasan)` : "Belum dinilai"}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span>Ukuran: <strong className="text-slate-700">{ukuran || "-"}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Stok: <strong className="text-slate-700">{stok || 0}</strong></span>
        </div>
        <div className="mb-4 mt-auto pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Harga Sewa / Hari</p>
          <p className="text-sm font-bold text-emerald-600">Rp {(harga_sewa || 0).toLocaleString("id-ID")}</p>
        </div>
        <Link href={`/detail-barang/${id_barang}`} className="w-full mt-auto bg-[#1f293d] text-white hover:bg-slate-800 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors">
          <span>Lihat Detail</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}