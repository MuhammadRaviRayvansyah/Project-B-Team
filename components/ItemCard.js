import Link from "next/link";

export default function ItemCard({
  id_barang,
  nama_barang,
  nama_kategori,
  ukuran,
  stok,
  harga_sewa,
  gambar,
}) {
  return (
    <Link 
      href={`/barang/${id_barang}`}
      className="group flex flex-col bg-transparent transition-all"
    >
      {/* Card Image */}
      <div className="w-full aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden relative mb-3">
        <img
          src={gambar || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"}
          alt={nama_barang}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {stok > 0 ? (
          <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-semibold text-slate-800 shadow-sm">
            Tersedia: {stok}
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-3 py-1 bg-rose-500/90 text-white rounded-full text-[10px] font-semibold shadow-sm">
            Habis
          </span>
        )}
      </div>

      {/* Info Details */}
      <div className="px-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {nama_kategori} {ukuran ? `• ${ukuran}` : ""}
          </span>
          {harga_sewa && (
            <span className="text-xs font-bold text-slate-900">
              Rp {Number(harga_sewa).toLocaleString("id-ID")}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-1">
          {nama_barang}
        </h3>
      </div>
    </Link>
  );
}