"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import { getPeminjaman, getBarang } from "@/lib/api";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  } catch (e) {
    return dateString;
  }
};

export default function RiwayatSayaPage() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pemRes, barRes] = await Promise.all([getPeminjaman(), getBarang()]);
        
        const rawPeminjaman = Array.isArray(pemRes) ? pemRes : [];
        const rawBarang = Array.isArray(barRes) ? barRes : [];

        const barangMap = {};
        rawBarang.forEach((b) => {
          const id = b.id_barang || b.id;
          if (id) {
            barangMap[id] = {
              nama_barang: b.nama_barang || b.nama,
              gambar: b.gambar || b.img || "",
            };
          }
        });

        const completed = rawPeminjaman
          .filter((p) => p.status === "Dikembalikan" || p.status === "Ditolak")
          .map((p) => {
            const bId = p.id_barang || p.barang_id;
            const detailBarang = barangMap[bId] || { nama_barang: "Barang Tidak Ditemukan", gambar: "" };
            return {
              ...p,
              nama_barang: detailBarang.nama_barang,
              gambar: detailBarang.gambar,
            };
          });

        setHistoryData(completed);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          <div className="py-10">
            <Hero category="RIWAYAT PEMINJAMAN" title="Riwayat Saya" description="Arsip transaksi peminjaman perlengkapan kampus yang telah selesai atau ditolak." />
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
                  {isLoading ? (
                    <tr><td colSpan="4" className="py-8 text-center text-slate-500">Memuat data...</td></tr>
                  ) : isError ? (
                    <tr><td colSpan="4" className="py-8 text-center text-rose-500 font-medium bg-rose-50/50">Gagal memuat data.</td></tr>
                  ) : historyData.length > 0 ? (
                    historyData.map((row) => (
                      <tr key={row.id_peminjaman || row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{row.nama_barang}</td>
                        <td className="py-3 px-4 text-slate-600">{formatDate(row.tanggal_peminjaman)}</td>
                        <td className="py-3 px-4 text-slate-600">{formatDate(row.tanggal_pengembalian)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                            row.status === "Dikembalikan" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-8 text-center text-slate-400">Belum ada riwayat.</td></tr>
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