import { getDetailBarang } from "@/lib/api";
import { createPeminjamanAction } from "@/app/actions/peminjaman";
import Hero from "@/components/Hero";

export default async function DetailBarangPage({ params }) {
  const { id } = await params;
  let barang = {};

  try {
    const res = await getDetailBarang(id);
    barang = res.data || res;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-8">
        <Hero
          category="DETAIL BARANG"
          title={barang.nama_barang || barang.nama || "Detail Barang"}
          description="Periksa detail barang dan ajukan peminjaman dengan mengisi form di bawah ini."
        />

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64 md:h-auto bg-slate-100 relative">
            <img
              src={barang.gambar || barang.img || "/placeholder.png"}
              alt={barang.nama_barang || barang.nama || "Gambar Barang"}
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>

          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="mb-6">
              <div className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Stok Tersedia: {barang.stok || 0} Unit
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {barang.nama_barang || barang.nama}
              </h1>
              <p className="text-xl font-bold text-emerald-600 mb-4">
                Rp {barang.harga_sewa?.toLocaleString() || 0} <span className="text-sm text-slate-500 font-medium">/ hari</span>
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {barang.deskripsi || "Belum ada deskripsi untuk barang ini."}
              </p>
              {barang.ukuran && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Ukuran:</span>
                  <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">
                    {barang.ukuran}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Form Pengajuan Peminjaman</h3>
              <form action={createPeminjamanAction} className="flex flex-col gap-4">
                <input type="hidden" name="id_barang" value={barang.id_barang || barang.id} />
                <input type="hidden" name="harga_sewa" value={barang.harga_sewa || 0} />
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jumlah Unit</label>
                  <input 
                    type="number" 
                    name="jumlah" 
                    min="1" 
                    max={barang.stok || 1} 
                    defaultValue="1" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal Pinjam</label>
                    <input 
                      type="date" 
                      name="tanggal_peminjaman" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal Kembali</label>
                    <input 
                      type="date" 
                      name="tanggal_pengembalian" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm mt-2"
                >
                  Ajukan Peminjaman Sekarang
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}