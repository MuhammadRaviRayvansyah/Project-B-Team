"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { SearchX, RotateCcw, AlertCircle } from "lucide-react";
import { getBarang, getKategori, getReview } from "@/lib/api";
import ItemCard from "@/components/share-main/item-card";
import ItemFilter from "@/components/barang/filter";
import Header from "@/components/share-main/header";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const QUICK_CATEGORIES = ["Semua", "Batik", "Jas", "Kebaya", "Aksesoris"];

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
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
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
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lookup map untuk kategori (O(1) access)
  const kategoriMap = useMemo(() => {
    const map = new Map();
    kategoriList.forEach((k) => {
      const id = String(k.id_kategori || k.id);
      const name = (k.nama_kategori || k.nama || "").toLowerCase();
      map.set(id, name);
    });
    return map;
  }, [kategoriList]);

  // Map review berdasarkan id_barang untuk menghindari O(N^2) `.filter()` pada render
  const reviewMap = useMemo(() => {
    const map = new Map();
    reviewList.forEach((rev) => {
      const key = String(rev.id_barang);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(rev);
    });
    return map;
  }, [reviewList]);

  const sizeOptions = useMemo(() => {
    const set = new Set();
    barangList.forEach((b) => {
      if (b.ukuran && b.ukuran.trim() && b.ukuran !== "-") {
        set.add(b.ukuran.trim());
      }
    });
    return Array.from(set);
  }, [barangList]);

  const barangTampil = useMemo(() => {
    let result = [...barangList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) =>
        (b.nama_barang || b.nama || "").toLowerCase().includes(q)
      );
    }

    if (kategoriAktif && kategoriAktif !== "Semua") {
      const katAktifStr = String(kategoriAktif).toLowerCase();
      result = result.filter((b) => {
        const katId = String(b.id_kategori || b.kategori_id || "");
        if (katId === String(kategoriAktif)) return true;

        const namaKatFromMap = kategoriMap.get(katId);
        if (namaKatFromMap && namaKatFromMap.includes(katAktifStr)) return true;

        const itemKatName = (b.nama_kategori || b.kategori || "").toLowerCase();
        return itemKatName.includes(katAktifStr);
      });
    }

    if (ukuranAktif && ukuranAktif !== "Semua") {
      result = result.filter((b) => String(b.ukuran) === String(ukuranAktif));
    }

    if (stokFilter === "tersedia") {
      result = result.filter((b) => Number(b.stok) > 0);
    } else if (stokFilter === "habis") {
      result = result.filter((b) => Number(b.stok) === 0);
    }

    if (sortFilter === "termurah") {
      result.sort(
        (a, b) =>
          Number(a.harga_sewa || a.hargaPerHari || 0) -
          Number(b.harga_sewa || b.hargaPerHari || 0)
      );
    } else if (sortFilter === "termahal") {
      result.sort(
        (a, b) =>
          Number(b.harga_sewa || b.hargaPerHari || 0) -
          Number(a.harga_sewa || a.hargaPerHari || 0)
      );
    }

    return result;
  }, [
    barangList,
    kategoriMap,
    searchQuery,
    kategoriAktif,
    ukuranAktif,
    stokFilter,
    sortFilter,
  ]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setKategoriAktif("Semua");
    setUkuranAktif("Semua");
    setStokFilter("Semua");
    setSortFilter("Semua");
  };

  return (
    <div className="min-h-screen bg-[#06131a] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden pb-20">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="fixed top-[15%] left-[-10%] w-[120%] h-[500px] pointer-events-none z-0 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-emerald-500/20 blur-[120px]" />
      <div className="fixed top-[45%] left-[-10%] w-[120%] h-[350px] pointer-events-none z-0 rounded-full bg-gradient-to-r from-indigo-500/10 via-transparent to-emerald-500/10 blur-[140px]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header
            category="Katalog Pilihan"
            title="Katalog Barang"
            description="Temukan berbagai pakaian dan perlengkapan yang tersedia untuk menunjang kebutuhan kegiatan kampus Anda."
          />

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

          <section className="pt-5">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {QUICK_CATEGORIES.map((katName) => {
                const isActive =
                  katName === "Semua"
                    ? kategoriAktif === "Semua"
                    : String(kategoriAktif).toLowerCase() === katName.toLowerCase();

                return (
                  <button
                    key={katName}
                    onClick={() => setKategoriAktif(katName)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                        : "bg-[#091823]/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white backdrop-blur-md"
                    }`}
                  >
                    {katName === "Semua" ? "Semua Kategori" : katName}
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
                    className="aspect-[4/5] rounded-2xl bg-[#091823]/80 border border-slate-800/80 animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="border border-red-500/20 bg-red-950/10 rounded-3xl py-16 px-6 text-center backdrop-blur-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-900/30 border border-red-800/50 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  Gagal Memuat Data
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Terjadi kesalahan saat mengambil data dari server. Silakan coba beberapa saat lagi.
                </p>
                <button
                  onClick={fetchData}
                  className="mt-6 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            ) : barangTampil.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {barangTampil.map((item) => {
                  const itemId = item.id_barang || item.id;
                  const ulasanItem = reviewMap.get(String(itemId)) || [];

                  return (
                    <motion.div key={itemId} variants={fadeInUp} whileHover={{ y: -6 }}>
                      <ItemCard {...item} ulasan={ulasanItem} />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="border border-slate-800/80 bg-[#091823]/80 rounded-3xl py-16 px-6 text-center backdrop-blur-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <SearchX className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  Barang Tidak Ditemukan
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Tidak ada pakaian atau perlengkapan yang cocok dengan kriteria
                  pencarian dan filter saat ini.
                </p>
              </div>
            )}
          </section>

          {!isLoading && !isError && barangTampil.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <p>
                Menampilkan{" "}
                <span className="font-bold text-amber-400">
                  {barangTampil.length}
                </span>{" "}
                dari {barangList.length} barang
              </p>
              {(searchQuery ||
                kategoriAktif !== "Semua" ||
                ukuranAktif !== "Semua" ||
                stokFilter !== "Semua" ||
                sortFilter !== "Semua") && (
                <button
                  onClick={handleResetFilter}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}