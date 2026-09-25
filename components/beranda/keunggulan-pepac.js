export default function KeunggulanPepac() {
  return (
    <section className="py-12 mb-12 bg-slate-50 rounded-[32px] px-6 sm:px-10 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600">
            Mengapa PEPAC?
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 leading-tight">
            Peminjaman pakaian kampus yang lebih praktis dan terorganisir.
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed mt-4 max-w-lg">
            PEPAC membantu mahasiswa menemukan dan mengajukan peminjaman pakaian
            untuk berbagai kegiatan kampus dengan proses yang lebih mudah.
          </p>
        </div>

        {/* Right Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-600">
                search
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900">Mudah Dicari</h3>

            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Cari pakaian berdasarkan kategori dan kebutuhan acara.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-600">
                bolt
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900">Praktis</h3>

            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Proses peminjaman dilakukan melalui satu sistem terintegrasi.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-600">
                inventory_2
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900">
              Data Terorganisir
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Informasi barang dan ketersediaan tersimpan secara teratur.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-600">
                school
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900">
              Untuk Kegiatan Kampus
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Mendukung kebutuhan pakaian untuk berbagai kegiatan mahasiswa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
