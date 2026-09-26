"use client";

import { useState, useEffect } from "react";
import { getBarang, getKategori, getReview } from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import Header from "@/components/share-main/header";

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
          getReview(),
        ]);

        setBarangList(Array.isArray(barRes) ? barRes : []);
        setKategoriList(Array.isArray(katRes) ? katRes : []);
        setReviewList(Array.isArray(revRes) ? revRes : []);
      } catch (error) {
        console.error("Gagal memuat data katalog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter barang berdasarkan kategori
  const barangTampil =
    kategoriAktif === "Semua"
      ? barangList
      : barangList.filter(
          (b) => Number(b.id_kategori) === Number(kategoriAktif),
        );

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Katalog"
          title="Katalog Barang"
          description="Temukan berbagai pakaian dan perlengkapan yang tersedia untuk
              menunjang kebutuhan kegiatan kampus Anda."
        />
        <section className="pt-8">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Pilih Kategori
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Tampilkan barang berdasarkan kategori pakaian
            </p>
          </div>

          {/* Category Pills */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {/* Semua */}
            <button
              onClick={() => setKategoriAktif("Semua")}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                kategoriAktif === "Semua"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-amber-400 hover:text-amber-600"
              }`}
            >
              Semua
            </button>

            {/* Kategori dari API */}
            {kategoriList.map((kat) => {
              const katId = kat.id_kategori || kat.id;

              const isActive = String(kategoriAktif) === String(katId);

              return (
                <button
                  key={katId}
                  onClick={() => setKategoriAktif(katId)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {kat.nama_kategori || kat.nama}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="aspect-[4/5] bg-slate-100" />

                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />

                    <div className="h-4 bg-slate-100 rounded w-4/5" />

                    <div className="h-3 bg-slate-100 rounded w-1/2" />

                    <div className="h-8 bg-slate-100 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : barangTampil.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {barangTampil.map((item) => {
                const itemId = item.id_barang || item.id;

                const ulasanItem = reviewList.filter(
                  (r) => String(r.id_barang) === String(itemId),
                );

                return <ItemCard key={itemId} {...item} ulasan={ulasanItem} />;
              })}
            </div>
          ) : (
            <div className="border border-slate-200 bg-slate-50 rounded-3xl py-20 px-6 text-center">
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                Barang Tidak Ditemukan
              </h3>
            </div>
          )}
        </section>

        {!isLoading && barangTampil.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-bold text-slate-700">
                {barangTampil.length}
              </span>{" "}
              barang
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
