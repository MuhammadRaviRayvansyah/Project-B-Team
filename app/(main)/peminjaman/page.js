"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import { getPeminjaman, getBarang, getKategori } from "@/lib/api";

export default function PeminjamanSayaPage() {
  const [riwayatAktif, setRiwayatAktif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pemRes, barRes, katRes] = await Promise.all([
          getPeminjaman(),
          getBarang(),
          getKategori(),
        ]);

        const rawPeminjaman = Array.isArray(pemRes) ? pemRes : [];
        const rawBarang = Array.isArray(barRes) ? barRes : [];
        const rawKategori = Array.isArray(katRes) ? katRes : [];

        const kategoriMap = {};
        rawKategori.forEach((k) => {
          const id = k.id_kategori || k.id;
          if (id) kategoriMap[id] = k.nama_kategori || k.nama;
        });

        const barangMap = {};
        rawBarang.forEach((b) => {
          const id = b.id_barang || b.id;
          const catId = b.id_kategori || b.kategori_id;
          if (id) {
            barangMap[id] = {
              nama: b.nama_barang || b.nama,
              kategori: kategoriMap[catId] || "Umum",
              gambar: b.gambar || b.img || "",
              ukuran: b.ukuran || "-",
            };
          }
        });

        const aktif = rawPeminjaman
          .filter((p) => !["Dikembalikan", "Dibatalkan", "Ditolak"].includes(p.status))
          .map((p) => {
            const bId = p.id_barang || p.barang_id;
            const detailBarang = barangMap[bId] || {};
            return {
              ...p,
              nama_barang: detailBarang.nama || "Barang",
              nama_kategori: detailBarang.kategori || "Umum",
              gambar: detailBarang.gambar || "",
              ukuran: detailBarang.ukuran || "-",
            };
          });

        setRiwayatAktif(aktif);
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
            <Hero 
              category="PEMANTAUAN PEMINJAMAN" 
              title="Peminjaman Saya" 
              description="Pantau status permohonan peminjaman aktif Anda dari server." 
            />
          </div>

          <section className="mb-8 space-y-3 md:space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500 font-medium">Memuat data...</div>
            ) : isError ? (
              <div className="text-center py-12 text-rose-600 font-medium bg-rose-50 rounded-xl border border-rose-100 shadow-sm">
                Gagal memuat riwayat peminjaman dari server.
              </div>
            ) : riwayatAktif.length > 0 ? (
              riwayatAktif.map((item) => (
                <div key={item.id_peminjaman || item.id} className="bg-white rounded-xl p-4 md:p-6 border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {item.gambar && (
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden relative shrink-0">
                        <Image src={item.gambar} alt={item.nama_barang} fill sizes="64px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1">ID TRX: #{item.id_peminjaman || item.id}</p>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">{item.nama_barang}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{item.nama_kategori}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:text-right mt-2 md:mt-0 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    <p className="text-xs text-slate-500 font-medium">Status Peminjaman</p>
                    <p className={`text-sm font-bold mt-1 ${item.status === 'Disetujui' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {item.status || "Menunggu Persetujuan"}
                    </p>
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