import Image from "next/image";
import Link from "next/link";
import { review } from "@/app/data";
import RatingStars from "@/components/RatingStars";

export default function ItemCard({ id_barang, nama_barang, nama_kategori, ukuran, stok, harga_sewa, gambar }) {
  const ulasanBarang = review.filter((r) => r.id_barang === id_barang);
  const avgRating = ulasanBarang.length
    ? ulasanBarang.reduce((total, r) => total + r.rating, 0) / ulasanBarang.length
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
      <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative">
        <Image
          src={gambar}
          alt={nama_barang}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm ${
            stok > 0 ? "bg-emerald-900 text-white" : "bg-slate-800 text-white"
          }`}>
            {stok > 0 ? "Tersedia" : "Habis"}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {nama_kategori}
        </span>

        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
          {nama_barang}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <RatingStars rating={avgRating} size={13} />
          <span className="text-[10px] text-slate-400">
            {ulasanBarang.length > 0 ? `(${ulasanBarang.length})` : "Belum ada ulasan"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span>Ukuran: <strong>{ukuran}</strong></span>
          <span>•</span>
          <span>Stok: <strong>{stok} unit</strong></span>
        </div>

        <Link
          href={`/detail-barang/${id_barang}`}
          className="w-full mt-auto bg-[#1f293d] text-white hover:bg-slate-800 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
        >
          <span>Lihat Detail</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}