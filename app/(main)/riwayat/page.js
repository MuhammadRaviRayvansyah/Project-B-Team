import React from "react";
import Hero from "@/components/Hero";
import { getPeminjaman, getBarang } from "@/lib/api";

export default async function RiwayatSayaPage() {
  let peminjamanList = [];
  let barangList = [];

  try {
    const [pemRes, barRes] = await Promise.all([getPeminjaman(), getBarang()]);
    peminjamanList = Array.isArray(pemRes) ? pemRes : pemRes.data || [];
    barangList = Array.isArray(barRes) ? barRes : barRes.data || [];
  } catch (error) {
    console.error("Gagal memuat riwayat:", error);
  }

  // Filter hanya riwayat yang sudah selesai
  const historyData = peminjamanList
    .filter((p) => p.status === "Dikembalikan" || p.status === "Ditolak")
    .map((p) => {
      const detailBarang = barangList.find((b) => (b.id_barang || b.id) === (p.id_barang || p.barang_id)) || {};
      return {
        ...p,
        nama_barang: detailBarang.nama_barang || detailBarang.nama || "Barang Tidak Ditemukan",
        gambar: detailBarang.gambar || detailBarang.img || "",
      };
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          <div className="py-10">
            <Hero category="RIWAYAT PEMINJAMAN" title="Riwayat Saya" description="Arsip transaksi peminjaman perlengkapan kampus yang telah selesai." />
          </div>

          <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200/60">
                    <th className="py-3 px-4">Barang</th>
                    <th className="py-3 px-4">Tanggal Pinjam</th>
                    <th className="py-3 px-4">Tanggal Kembali</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {historyData.length > 0 ? (
                    historyData.map((row) => (
                      <tr key={row.id_peminjaman || row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{row.nama_barang}</td>
                        <td className="py-3 px-4 text-slate-600">{row.tanggal_peminjaman}</td>
                        <td className="py-3 px-4 text-slate-600">{row.tanggal_pengembalian}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400">
                        Tidak ada riwayat peminjaman ditemukan dari server.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}