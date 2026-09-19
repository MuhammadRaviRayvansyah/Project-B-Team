import Link from "next/link";
import { getPeminjaman, getBarang } from "@/lib/api";
import StatusBadge from "../components/StatusBadge";

export default async function AdminDashboardPage() {
  let peminjamanList = [];
  let barangList = [];

  try {
    const [pemRes, barRes] = await Promise.all([getPeminjaman(), getBarang()]);
    peminjamanList = Array.isArray(pemRes) ? pemRes : pemRes.data || [];
    barangList = Array.isArray(barRes) ? barRes : barRes.data || [];
  } catch (error) {
    console.error("Gagal memuat data dashboard admin:", error);
  }

  // Hitung ringkasan statistik secara dinamis dari data API
  const total = peminjamanList.length;
  const menunggu = peminjamanList.filter((item) => item.status === "Menunggu Persetujuan").length;
  const dipinjam = peminjamanList.filter((item) => item.status === "Sedang Dipinjam").length;
  const selesai = peminjamanList.filter((item) => item.status === "Dikembalikan").length;

  const statCards = [
    { label: "Total Pengajuan", value: total, icon: "receipt_long", accent: "bg-slate-900 text-white" },
    { label: "Menunggu Persetujuan", value: menunggu, icon: "hourglass_top", accent: "bg-amber-500 text-white" },
    { label: "Sedang Dipinjam", value: dipinjam, icon: "local_shipping", accent: "bg-sky-500 text-white" },
    { label: "Selesai Dikembalikan", value: selesai, icon: "task_alt", accent: "bg-emerald-600 text-white" },
  ];

  // Filter pengajuan yang butuh tindakan cepat dari admin
  const perluTindakan = peminjamanList.filter((item) => item.status === "Menunggu Persetujuan");

  return (
    <div className="flex flex-col gap-6">
      {/* Sambutan */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Halo, Admin 👋</h2>
        <p className="text-sm text-slate-500 mt-1">Berikut ringkasan aktivitas peminjaman hari ini dari server.</p>
      </div>

      {/* Kartu Statistik */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200/60 shadow-sm flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.accent}`}>
              <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1.5">{card.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Perlu Ditindaklanjuti */}
      <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Perlu Ditindaklanjuti</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pengajuan yang masih menunggu persetujuan Anda.</p>
          </div>
          <Link href="/manajemen-peminjaman" className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 shrink-0">
            Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {perluTindakan.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs font-medium">
              Tidak ada pengajuan yang menunggu saat ini. Semua sudah beres 🎉
            </div>
          )}

          {perluTindakan.map((item) => {
            const detailBarang = barangList.find((b) => (b.id_barang || b.id) === (item.id_barang || item.barang_id)) || {};
            return (
              <div key={item.id_peminjaman || item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-slate-100 rounded-lg overflow-hidden relative shrink-0 border border-slate-100">
                    <img src={detailBarang.gambar || detailBarang.img || "/placeholder.png"} alt="Barang" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{detailBarang.nama_barang || detailBarang.nama || "Barang"}</p>
                    <p className="text-xs text-slate-500 truncate">ID User: {item.id_user} • ID TRX: #{item.id_peminjaman || item.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <StatusBadge status={item.status} />
                  <Link href="/manajemen-peminjaman" className="text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
                    Proses
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}