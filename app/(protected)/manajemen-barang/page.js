import Link from "next/link";
import { getBarang } from "@/lib/api";
import Hero from "@/components/Hero";

export default async function ManajemenBarangPage() {
  let barangList = [];
  try {
    const res = await getBarang();
    barangList = Array.isArray(res) ? res : res.data || [];
  } catch (error) {}

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Hero
          category="ADMIN • BARANG"
          title="Manajemen Barang"
          description="Kelola katalog barang, edit detail, atau hapus item dari sistem."
        />
        <Link 
          href="/manajemen-barang/tambah" 
          className="bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm text-center shrink-0"
        >
          + Tambah Barang
        </Link>
      </div>

      <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200/60">
                <th className="py-4 px-4 sm:px-6 whitespace-nowrap">Barang</th>
                <th className="py-4 px-4 sm:px-6 whitespace-nowrap">Kategori & Ukuran</th>
                <th className="py-4 px-4 sm:px-6 whitespace-nowrap">Stok</th>
                <th className="py-4 px-4 sm:px-6 whitespace-nowrap">Harga Sewa</th>
                <th className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {barangList.length > 0 ? (
                barangList.map((item) => (
                  <tr key={item.id_barang || item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          <img src={item.gambar || item.img || "/placeholder.png"} alt={item.nama_barang || item.nama} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-semibold text-slate-900 line-clamp-2 min-w-[120px]">{item.nama_barang || item.nama}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-slate-600">
                      ID Kategori: {item.id_kategori} <br/> <span className="text-[10px] sm:text-xs text-slate-400">Ukuran: {item.ukuran || "-"}</span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-slate-900 font-medium">
                      {item.stok || 0} Unit
                    </td>
                    <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-emerald-600 font-bold">
                      Rp {(item.harga_sewa || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/manajemen-barang/edit/${item.id_barang || item.id}`} className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-2 rounded-lg font-bold transition-colors text-[10px] sm:text-xs whitespace-nowrap">
                          Edit
                        </Link>
                        {/* Form delete bisa ditambahkan di sini dengan Server Action */}
                        <button className="bg-slate-50 text-slate-500 hover:bg-rose-500 hover:text-white px-3 py-2 rounded-lg font-bold transition-colors text-[10px] sm:text-xs whitespace-nowrap">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium text-sm">
                    Belum ada data barang di server.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}