export default function CaraPeminjaman() {
  return (
    <section className="py-12 mb-12">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900 bg-amber-400 px-3.5 py-1.5 rounded-full inline-block mb-3">
          Cara Peminjaman
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Mudah dalam 4 Langkah
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Proses peminjaman pakaian dibuat sederhana agar Anda dapat fokus
          mempersiapkan acara.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Step 1 */}
        <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">
                search
              </span>
            </div>

            <span className="text-3xl font-black text-slate-100">01</span>
          </div>

          <h3 className="font-bold text-slate-900 mb-2">Cari Barang</h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Temukan pakaian yang sesuai dengan kebutuhan acara Anda.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">
                edit_note
              </span>
            </div>

            <span className="text-3xl font-black text-slate-100">02</span>
          </div>

          <h3 className="font-bold text-slate-900 mb-2">Ajukan Peminjaman</h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Pilih barang dan ajukan permintaan peminjaman melalui sistem.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">
                pending_actions
              </span>
            </div>

            <span className="text-3xl font-black text-slate-100">03</span>
          </div>

          <h3 className="font-bold text-slate-900 mb-2">Tunggu Konfirmasi</h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Pengajuan akan diproses dan dikonfirmasi oleh pengelola.
          </p>
        </div>

        {/* Step 4 */}
        <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">
                inventory
              </span>
            </div>

            <span className="text-3xl font-black text-slate-100">04</span>
          </div>

          <h3 className="font-bold text-slate-900 mb-2">Ambil Barang</h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Ambil barang sesuai jadwal dan gunakan untuk kebutuhan acara.
          </p>
        </div>
      </div>
    </section>
  );
}
