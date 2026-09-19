import React from "react";
import Hero from "@/components/Hero";
import Image from "next/image";
import { getPeminjaman, getBarang, getKategori } from "@/lib/api";

export default async function PeminjamanSayaPage() {
  let peminjamanList = [];
  let barangList = [];
  let kategoriList = [];

  try {
    const [pemRes, barRes, katRes] = await Promise.all([
      getPeminjaman(),
      getBarang(),
      getKategori(),
    ]);

    peminjamanList = Array.isArray(pemRes) ? pemRes : pemRes.data || [];
    barangList = Array.isArray(barRes) ? barRes : barRes.data || [];
    kategoriList = Array.isArray(katRes) ? katRes : katRes.data || [];
  } catch (error) {
    console.error("Gagal memuat data peminjaman:", error);
  }

  // Filter hanya peminjaman yang aktif (belum dikembalikan/dibatalkan)
  const riwayatAktif = peminjamanList
    .filter((p) => p.status !== "Dikembalikan" && p.status !== "Dibatalkan" && p.status !== "Ditolak")
    .map((p) => {
      const detailBarang = barangList.find((b) => (b.id_barang || b.id) === (p.id_barang || p.barang_id)) || {};
      const detailKategori = kategoriList.find((k) => (k.id_kategori || k.id) === (detailBarang.id_kategori || detailBarang.kategori_id)) || {};
      return {
        ...p,
        nama_barang: detailBarang.nama_barang || detailBarang.nama || "Barang",
        nama_kategori: detailKategori.nama_kategori || "Umum",
        gambar: detailBarang.gambar || detailBarang.img || "",
        ukuran: detailBarang.ukuran || "-",
      };
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          <div className="py-10">
            <Hero category="PEMANTAUAN PEMINJAMAN" title="Peminjaman Saya" description="Pantau status permohonan peminjaman aktif Anda dari server." />
          </div>

          <section className="mb-8 space-y-3 md:space-y-4">
            {riwayatAktif.length > 0 ? (
              riwayatAktif.map((item) => (
                <div key={item.id_peminjaman || item.id} className="bg-white rounded-xl p-4 md:p-6 border border-slate-200/60 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {item.gambar && (
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden relative shrink-0">
                        <Image src={item.gambar} alt={item.nama_barang} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">ID TRX: #{item.id_peminjaman || item.id}</p>
                      <h3 className="text-base font-bold text-slate-900">{item.nama_barang}</h3>
                      <p className="text-xs text-slate-600 mt-1">Status: <strong className="text-blue-600">{item.status || "Menunggu Persetujuan"}</strong></p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-sm">
                Tidak ada peminjaman aktif saat ini.
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}