export default function CategoryCard({ icon, nama_kategori, jumlah_koleksi }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 w-full h-full">
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-slate-700 text-2xl">
          {icon}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">
          {nama_kategori}
        </h3>
        <p className="text-xs font-medium text-slate-500">
          {jumlah_koleksi} Koleksi
        </p>
      </div>
    </div>
  );
}