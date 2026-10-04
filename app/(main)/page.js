"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ItemCard from "@/components/share-main/item-card";
import { getKategori, getBarang } from "@/lib/api";
import {
  ArrowRight,
  Shirt,
  Package,
  Wallet,
  Droplets,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";

// Variasi Animasi Reusable
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const KATEGORI_MANUAL = [
  {
    id: "batik",
    nama: "Batik & Ethnik",
    deskripsi: "Batik Solo, Jogja, & Ethnik Modern untuk kuliah & seminar.",
    icon: Shirt,
    bgIcon: "bg-amber-500/20 text-amber-400",
    titleColor: "text-white",
    linkColor: "text-amber-400",
    href: "/barang?kategori=batik",
  },
  {
    id: "jas",
    nama: "Jas & Blazer",
    deskripsi: "Jas pria/wanita, blazer slimfit, & kemeja formal sidang.",
    icon: Shirt,
    bgIcon: "bg-cyan-500/20 text-cyan-400",
    titleColor: "text-white",
    linkColor: "text-cyan-400",
    href: "/barang?kategori=jas",
  },
  {
    id: "kebaya",
    nama: "Kebaya & Gaun",
    deskripsi: "Kebaya wisuda elegan, dress pesta, & gaun keakraban.",
    icon: Shirt,
    bgIcon: "bg-purple-500/20 text-purple-400",
    titleColor: "text-white",
    linkColor: "text-purple-400",
    href: "/barang?kategori=kebaya",
  },
  {
    id: "aksesoris",
    nama: "Aksesoris",
    deskripsi: "Dasi kupu-kupu, sabuk kulit, pin jas, & pita formal.",
    icon: Package,
    bgIcon: "bg-teal-500/20 text-teal-400",
    titleColor: "text-white",
    linkColor: "text-teal-400",
    href: "/barang?kategori=aksesoris",
  },
];

export default function BerandaPage() {
  const [barangList, setBarangList] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
  const [kategoriCounts, setKategoriCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Handler Smooth Scroll JavaScript Murni
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [katRes, barRes] = await Promise.all([
          getKategori(),
          getBarang(),
        ]);

        const rawKat = Array.isArray(katRes) ? katRes : [];
        const rawBar = Array.isArray(barRes) ? barRes : [];

        setBarangList(rawBar.slice(0, 4));

        const kMap = {};
        rawKat.forEach((k) => {
          const id = k.id_kategori || k.id;
          if (id) kMap[id] = k.nama_kategori || "Umum";
        });
        setKategoriMap(kMap);

        // Hitung jumlah barang per kategori berdasarkan nama kategori
        const kCounts = {};
        rawBar.forEach((b) => {
          const catId = b.id_kategori || b.kategori_id;
          const catName = (kMap[catId] || b.nama_kategori || b.kategori || "").toLowerCase();

          KATEGORI_MANUAL.forEach((km) => {
            if (catName.includes(km.id)) {
              kCounts[km.id] = (kCounts[km.id] || 0) + 1;
            }
          });
        });
        setKategoriCounts(kCounts);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#06131a] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* ================= BACKGROUND GRID ================= */}
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

      {/* ================= GLOW EFFECTS ================= */}
      <div className="fixed top-[15%] left-[-10%] w-[120%] h-[500px] pointer-events-none z-0 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-emerald-500/20 blur-[120px]" />
      <div className="fixed top-[45%] left-[-10%] w-[120%] h-[350px] pointer-events-none z-0 rounded-full bg-gradient-to-r from-indigo-500/10 via-transparent to-emerald-500/10 blur-[140px]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* ================= HERO SECTION ================= */}
          <section className="relative my-6 lg:my-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Kolom Kiri */}
              <motion.div
                className="lg:col-span-7 space-y-6"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#22d3ee]" />
                  <span>PEPAC - PEMINJAMAN PAKAIAN ACARA</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                  Tampil Rapi &amp; Percaya Diri di Setiap{" "}
                  <span className="text-amber-400">Acara</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                    Kampus
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Temukan dan pinjam batik premium, jas formal, gaun, sepatu,
                  hingga aksesoris pendukung acara secara praktis, higienis,
                  hemat, dan terintegrasi khusus civitas akademika.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/barang"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold rounded-full text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Mulai Cari Barang</span>
                  </Link>

                  <a
                    href="#cara-pinjam"
                    onClick={(e) => handleScrollToSection(e, "cara-pinjam")}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-white font-medium rounded-full text-sm backdrop-blur-md transition-all hover:border-slate-500 cursor-pointer"
                  >
                    <span>Lihat Cara Pinjam</span>
                  </a>
                </div>
              </motion.div>

              {/* Kolom Kanan Gambar */}
              <motion.div
                className="lg:col-span-5 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              >
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-md group">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden">
                    <img
                      src="/images/bg-beranda.jpg"
                      alt="Pakaian Formal Kampus"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06131a] via-transparent to-transparent opacity-80" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ================= KATEGORI SECTION ================= */}
          <section id="kategori" className="py-8 my-4">
            <motion.div
              className="text-center max-w-xl mx-auto mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full inline-block mb-3">
                Kategori Pakaian
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Pilihan Kategori Busana
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Temukan berbagai pilihan pakaian berdasarkan kebutuhan acara Anda
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {KATEGORI_MANUAL.map((cat) => {
                const IconComponent = cat.icon;
                const itemCount = kategoriCounts[cat.id] || 0;

                return (
                  <motion.div key={cat.id} variants={fadeInUp} whileHover={{ y: -6 }}>
                    <Link
                      href={cat.href}
                      className="group relative rounded-2xl bg-[#091823]/80 border border-slate-800/80 p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-full overflow-hidden hover:bg-[#0d212f] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgIcon}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full">
                            {isLoading ? "..." : `${itemCount} Item`}
                          </span>
                        </div>
                        <h3 className={`text-base font-bold mb-2 tracking-wide ${cat.titleColor}`}>
                          {cat.nama}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                          {cat.deskripsi}
                        </p>
                      </div>

                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${cat.linkColor} group-hover:translate-x-0.5 transition-transform`}>
                        <span>Eksplorasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* ================= KATALOG BARANG ================= */}
          <section id="katalog" className="py-12">
            <motion.div
              className="flex items-end justify-between mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/20 border border-purple-400/20 px-4 py-1.5 rounded-full inline-block mb-3">
                  Katalog Pilihan
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Koleksi Siap Sewa
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Koleksi busana dan perlengkapan yang siap dipinjam
                </p>
              </div>

              <Link
                href="/barang"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-slate-900/50 hover:border-amber-400/50 hover:text-amber-400 transition-all text-xs sm:text-sm font-semibold text-slate-300 group"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-amber-400" />
              </Link>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] rounded-2xl bg-slate-900/60 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="p-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-300 text-sm">
                Gagal memuat katalog barang.
              </div>
            ) : barangList.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {barangList.map((b) => {
                  const bId = b.id_barang || b.id;
                  const catId = b.id_kategori || b.kategori_id;

                  return (
                    <motion.div key={bId} variants={fadeInUp} whileHover={{ y: -6 }}>
                      <ItemCard
                        id_barang={bId}
                        nama_barang={b.nama_barang || b.nama}
                        nama_kategori={kategoriMap[catId] || "Umum"}
                        ukuran={b.ukuran}
                        stok={b.stok}
                        harga_sewa={b.harga_sewa || b.hargaPerHari}
                        gambar={b.gambar || b.img}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/50 text-slate-400 text-center text-sm">
                Belum ada barang tersedia saat ini.
              </div>
            )}
          </section>
          
          {/* ================= CARA PEMINJAMAN PAKAIAN ================= */}
          <section id="cara-pinjam" className="py-12 my-8 scroll-mt-20">
            <motion.div
              className="text-center max-w-xl mx-auto mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block mb-3">
                ALUR RINGKAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Cara Peminjaman Pakaian
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Proses cepat 4 langkah mudah langsung terhubung ke Booth PEPAC Kampus.
              </p>
            </motion.div>

            {/* Grid Langkah dengan Stagger Animation */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {[
                {
                  num: "01",
                  style: "bg-teal-500/10 text-teal-400 border border-teal-500/30",
                  title: "Pilih Pakaian",
                  desc: "Cari pakaian sesuai jenis acara, ukuran tubuh, dan jadwal kegiatan Anda.",
                },
                {
                  num: "02",
                  style: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
                  title: "Atur Tanggal",
                  desc: "Tentukan durasi sewa & upload dokumen KTM terverifikasi secara online.",
                },
                {
                  num: "03",
                  style: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
                  title: "Ambil di Booth",
                  desc: "Tunjukkan QR Code pemesanan saat mengambil barang di Student Center.",
                },
                {
                  num: "04",
                  style: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                  title: "Kembalikan Bebas Repot",
                  desc: "Selesai pakai langsung kembalikan. Bebas cuci karena tim kami yang mengurus!",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl bg-[#091823]/80 border border-slate-800/80 p-6 backdrop-blur-md overflow-hidden transition-colors duration-300 hover:bg-[#0d212f] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                >
                  <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm mb-5 ${step.style}`}>
                    {step.num}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ================= MENGAPA PEPAC ================= */}
          <section id="mengapa-pepac" className="py-12 my-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <motion.div
                className="lg:col-span-5 flex flex-col justify-between space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full inline-block mb-3 ">
                    MENGAPA PEPAC?
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Solusi Hemat Cerdas Mahasiswa Masa Kini
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Acara kampus hanya sementara? Tidak perlu beli baju baru yang jarang terpakai. PEPAC memberi akses sewa pakaian berkualitas tinggi, wangi, dan steril dengan harga terjangkau.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {[
                  {
                    icon: Wallet,
                    color: "bg-amber-500/20 text-amber-400",
                    title: "Ramah Kantong",
                    desc: "Tarif fleksibel terjangkau mulai Rp 50.000/hari tanpa deposit rumit.",
                  },
                  {
                    icon: Droplets,
                    color: "bg-cyan-500/20 text-cyan-400",
                    title: "Tanpa Beban Cuci",
                    desc: "Tidak perlu repot cuci & setrika. Kembalikan pakaian apa adanya.",
                  },
                  {
                    icon: MapPin,
                    color: "bg-purple-500/20 text-purple-400",
                    title: "Booth Strategis",
                    desc: "Lokasi pengambilan berada langsung di pusat gedung Student Center.",
                  },
                  {
                    icon: Clock,
                    color: "bg-teal-500/20 text-teal-400",
                    title: "Perpanjangan Instan",
                    desc: "Tambah masa pinjam dalam beberapa klik langsung via dashboard web.",
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={fadeInUp}
                      whileHover={{ y: -4 }}
                      className="group relative rounded-2xl bg-[#091823]/80 border border-slate-800/80 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-[#0d212f] hover:border-cyan-500/40"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}