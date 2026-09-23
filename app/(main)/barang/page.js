"use client";

import { useState, useEffect } from "react";
import { getBarang, getKategori, getReview } from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import Hero from "@/components/Hero";

export default function BarangPage() {
  const [barangList, setBarangList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barRes, katRes, revRes] = await Promise.all([
          getBarang(),
          getKategori(),
          getReview()
        ]);
        setBarangList(Array.isArray(barRes) ? barRes : []);
        setKategoriList(Array.isArray(katRes) ? katRes : []);
        setReviewList(Array.isArray(revRes) ? revRes : []);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const barangTampil = kategoriAktif === "Semua"
    ? barangList
    : barangList.filter((b) => Number(b.id_kategori) === Number(kategoriAktif));

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-6">
        <Hero
          category="KATALOG KAMPUS"
          title="Koleksi Barang"
          description="Eksplorasi perlengkapan dan pakaian yang tersedia untuk menunjang kegiatan Anda."
        />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setKategoriAktif("Semua")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              kategoriAktif === "Semua" ? "bg-[#181c20] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Semua
          </button>
          {kategoriList.map((kat) => (
            <button
              key={kat.id_kategori || kat.id}
              onClick={() => setKategoriAktif(kat.id_kategori || kat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                kategoriAktif === (kat.id_kategori || kat.id) ? "bg-[#181c20] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {kat.nama_kategori || kat.nama}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Memuat katalog...</div>
        ) : barangTampil.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {barangTampil.map((item) => {
              const ulasanItem = reviewList.filter((r) => String(r.id_barang) === String(item.id_barang || item.id));
              return (
                <ItemCard 
                  key={item.id_barang || item.id} 
                  {...item} 
                  ulasan={ulasanItem}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium">
            Tidak ada barang di kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}