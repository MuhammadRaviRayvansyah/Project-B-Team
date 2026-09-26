"use client";

import { useState, useEffect, useMemo } from "react";
import { getBarang, getKategori, getReview } from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import ItemFilter from "@/components/filter";
import Header from "@/components/share-main/header";

export default function BarangPage() {
  const [barangList, setBarangList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [ukuranAktif, setUkuranAktif] = useState("Semua");
  const [stokFilter, setStokFilter] = useState("Semua");
  const [sortFilter, setSortFilter] = useState("Semua");

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

  // Ambil opsi ukuran unik dari data barang asli
  const sizeOptions = useMemo(() => {
    const set = new Set();
    barangList.forEach((b) => {
      if (b.ukuran && b.ukuran.trim() && b.ukuran !== "-") {
        set.add(b.ukuran.trim());
      }
    });
    return Array.from(set);
  }, [barangList]);

  // Derived data: filter & search gabungan tanpa menghilangkan data asli
  const barangTampil = useMemo(() => {
    let result = [...barangList];

    // 1. Search nama barang
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) =>
        (b.nama_barang || b.nama || "").toLowerCase().includes(q),
      );
    }

    // 2. Filter Kategori
    if (kategoriAktif && kategoriAktif !== "Semua") {
      result = result.filter(
        (b) => String(b.id_kategori || b.kategori_id) === String(kategoriAktif),
      );
    }

    // 3. Filter Ukuran
    if (ukuranAktif && ukuranAktif !== "Semua") {
      result = result.filter((b) => String(b.ukuran) === String(ukuranAktif));
    }

    // 4. Filter Ketersediaan Stok
    if (stokFilter === "tersedia") {
      result = result.filter((b) => Number(b.stok) > 0);
    } else if (stokFilter === "habis") {
      result = result.filter((b) => Number(b.stok) === 0);
    }

    // 5. Urutan Harga
    if (sortFilter === "termurah") {
      result.sort((a, b) => Number(a.harga_sewa || a.hargaPerHari || 0) - Number(b.harga_sewa || b.hargaPerHari || 0));
    } else if (sortFilter === "termahal") {
      result.sort((a, b) => Number(b.harga_sewa || b.hargaPerHari || 0) - Number(a.harga_sewa || a.hargaPerHari || 0));
    }

    return result;
  }, [barangList, searchQuery, kategoriAktif, ukuranAktif, stokFilter, sortFilter]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setKategoriAktif("Semua");
    setUkuranAktif("Semua");
    setStokFilter("Semua");
    setSortFilter("Semua");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Katalog"
          title="Katalog Barang"
          description="Temukan berbagai pakaian dan perlengkapan yang tersedia untuk menunjang kebutuhan kegiatan kampus Anda."
        />

        {/* Filter & Search Bar */}
        <section className="pt-6">
          <ItemFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={kategoriAktif}
            onCategoryChange={setKategoriAktif}
            selectedSize={ukuranAktif}
            onSizeChange={setUkuranAktif}
            selectedStock={stokFilter}
            onStockChange={setStokFilter}
            selectedSort={sortFilter}
            onSortChange={setSortFilter}
            categoryOptions={kategoriList}
            sizeOptions={sizeOptions}
            onReset={handleResetFilter}
          />
        </section>

        {/* Quick Category Pills */}
        <section className="pt-5">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setKategoriAktif("Semua")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                kategoriAktif === "Semua"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-400 hover:text-amber-600"
              }`}
            >
              Semua Kategori
            </button>

            {kategoriList.map((kat) => {
              const katId = kat.id_kategori || kat.id;
              const isActive = String(kategoriAktif) === String(katId);

              return (
                <button
                  key={katId}
                  onClick={() => setKategoriAktif(katId)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {kat.nama_kategori || kat.nama}
                </button>
              );
            })}
          </div>
        </section>

        {/* Grid Barang */}
        <section className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/5] bg-slate-100" />
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
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-slate-400">
                  search_off
                </span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                Barang Tidak Ditemukan
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Tidak ada pakaian atau perlengkapan yang cocok dengan kriteria pencarian dan filter saat ini.
              </p>
              <button
                onClick={handleResetFilter}
                className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>

        {!isLoading && barangTampil.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-bold text-slate-700">
                {barangTampil.length}
              </span>{" "}
              dari {barangList.length} barang
            </p>
            {(searchQuery || kategoriAktif !== "Semua" || ukuranAktif !== "Semua" || stokFilter !== "Semua" || sortFilter !== "Semua") && (
              <button
                onClick={handleResetFilter}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold"
              >
                Hapus Filter
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
