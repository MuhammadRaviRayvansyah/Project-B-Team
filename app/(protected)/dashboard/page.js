"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Chart from "chart.js/auto";
import { getPeminjaman, getBarang, getUsers } from "@/lib/api";
import { getUserProfile } from "@/lib/token";
import StatusBadge from "../components/StatusBadge";

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    dipinjam: 0,
    selesai: 0,
    pendapatan: 0,
  });

  const barCanvasRef = useRef(null);
  const doughnutCanvasRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const doughnutChartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = getUserProfile();
        if (profile) {
          setAdminName(profile.nama || profile.name || profile.username || "Admin");
        }

        const [pemRes, barRes, userRes] = await Promise.all([
          getPeminjaman(),
          getBarang(),
          getUsers(),
        ]);
        
        const dataPem = Array.isArray(pemRes) ? pemRes : [];
        const dataBar = Array.isArray(barRes) ? barRes : [];
        const dataUser = Array.isArray(userRes) ? userRes : [];

        setPeminjamanList(dataPem);
        setBarangList(dataBar);

        const uMap = {};
        dataUser.forEach((u) => {
          const id = u.id_user || u.id;
          if (id) {
            uMap[id] = {
              nama: u.nama || u.nama_user || u.name,
              email: u.email,
              no_hp: u.no_hp,
            };
          }
        });
        setUserMap(uMap);

        let totalRev = 0;
        let cMenunggu = 0;
        let cDipinjam = 0;
        let cSelesai = 0;

        dataPem.forEach((p) => {
          const st = String(p.status || "").trim().toLowerCase();
          if (st !== "ditolak" && st !== "dibatalkan") {
            totalRev += Number(p.total_harga || 0);
          }

          if (st === "pending" || st === "menunggu" || st === "menunggu persetujuan") {
            cMenunggu++;
          } else if (st === "disetujui" || st === "dipinjam" || st === "sedang dipinjam") {
            cDipinjam++;
          } else if (st === "selesai" || st === "dikembalikan") {
            cSelesai++;
          }
        });

        setStats({
          total: dataPem.length,
          menunggu: cMenunggu,
          dipinjam: cDipinjam,
          selesai: cSelesai,
          pendapatan: totalRev,
        });

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Inisialisasi Chart 1 (Statistik Bulanan) & Chart 2 (Distribusi Status)
  useEffect(() => {
    if (isLoading || peminjamanList.length === 0) return;

    // --- CHART 1: Statistik Peminjaman Bulanan (Bar Chart) ---
    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const monthlyCounts = {};
    monthsOrder.forEach((m) => { monthlyCounts[m] = 0; });

    peminjamanList.forEach((p) => {
      if (p.tanggal_peminjaman) {
        const d = new Date(p.tanggal_peminjaman);
        if (!isNaN(d.getTime())) {
          const mName = d.toLocaleString("id-ID", { month: "short" });
          // Normalisasi nama bulan id-ID ke monthsOrder
          const matched = monthsOrder.find((item) => mName.toLowerCase().startsWith(item.toLowerCase()));
          const key = matched || mName;
          monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        }
      }
    });

    if (barCanvasRef.current) {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }

      const barCtx = barCanvasRef.current.getContext("2d");
      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: monthsOrder,
          datasets: [
            {
              label: "Jumlah Peminjaman",
              data: monthsOrder.map((m) => monthlyCounts[m] || 0),
              backgroundColor: "rgba(26, 34, 52, 0.9)",
              hoverBackgroundColor: "rgba(245, 158, 11, 0.9)",
              borderRadius: 6,
              borderSkipped: false,
              barThickness: "flex",
              maxBarThickness: 32,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#1a2234",
              titleColor: "#ffffff",
              bodyColor: "#fbbf24",
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (context) => ` ${context.parsed.y} Transaksi Peminjaman`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11, weight: "bold" }, color: "#64748b" },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: { size: 10 },
                color: "#64748b",
              },
              grid: {
                color: "#f1f5f9",
              },
            },
          },
        },
      });
    }

    // --- CHART 2: Status Peminjaman (Doughnut Chart) ---
    const statusCounts = {
      "Menunggu": 0,
      "Disetujui": 0,
      "Dipinjam": 0,
      "Selesai": 0,
      "Ditolak": 0,
    };

    peminjamanList.forEach((p) => {
      const st = String(p.status || "").trim().toLowerCase();
      if (st === "pending" || st === "menunggu" || st === "menunggu persetujuan") {
        statusCounts["Menunggu"]++;
      } else if (st === "disetujui") {
        statusCounts["Disetujui"]++;
      } else if (st === "dipinjam" || st === "sedang dipinjam") {
        statusCounts["Dipinjam"]++;
      } else if (st === "selesai" || st === "dikembalikan") {
        statusCounts["Selesai"]++;
      } else if (st === "ditolak" || st === "dibatalkan") {
        statusCounts["Ditolak"]++;
      }
    });

    const doughnutLabels = Object.keys(statusCounts);
    const doughnutValues = Object.values(statusCounts);
    const doughnutColors = ["#f59e0b", "#0284c7", "#3b82f6", "#10b981", "#f43f5e"];

    if (doughnutCanvasRef.current) {
      if (doughnutChartInstanceRef.current) {
        doughnutChartInstanceRef.current.destroy();
      }

      const doughnutCtx = doughnutCanvasRef.current.getContext("2d");
      doughnutChartInstanceRef.current = new Chart(doughnutCtx, {
        type: "doughnut",
        data: {
          labels: doughnutLabels,
          datasets: [
            {
              data: doughnutValues,
              backgroundColor: doughnutColors,
              borderColor: "#ffffff",
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { size: 11, weight: "bold" },
                color: "#475569",
                boxWidth: 12,
                boxHeight: 12,
                padding: 12,
              },
            },
            tooltip: {
              backgroundColor: "#1a2234",
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (context) => ` ${context.label}: ${context.parsed} Pengajuan`,
              },
            },
          },
          cutout: "68%",
        },
      });
    }

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (doughnutChartInstanceRef.current) {
        doughnutChartInstanceRef.current.destroy();
      }
    };
  }, [peminjamanList, isLoading]);

  const getNamaBarang = (idBarang) => {
    const b = barangList.find((x) => String(x.id_barang || x.id) === String(idBarang));
    return b ? b.nama_barang || b.nama : "Barang Tidak Ditemukan";
  };

  const tabelTerbaru = peminjamanList.slice().reverse().slice(0, 10);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Berikut ringkasan statistik transaksi peminjaman pakaian acara mahasiswa.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? "..." : stats.total}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Total Pengajuan
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? "..." : stats.menunggu}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Menunggu Persetujuan
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? "..." : stats.dipinjam}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Sedang Dipinjam
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? "..." : stats.selesai}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Selesai / Dikembalikan
            </p>
          </div>
        </div>
      </div>

      {/* Grid Grafik Dashboard: Chart 1 (Bar) & Chart 2 (Doughnut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Statistik Peminjaman Bulanan (Bar Chart) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-lg">bar_chart</span>
                Statistik Peminjaman Bulanan
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Frekuensi jumlah transaksi peminjaman pakaian per bulan
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              Tahun Ini
            </span>
          </div>

          <div className="w-full h-64 sm:h-72 relative">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Memuat data grafik...
              </div>
            ) : peminjamanList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-1">
                <span className="material-symbols-outlined text-3xl">insights</span>
                <p className="text-xs font-semibold">Belum ada transaksi peminjaman untuk ditampilkan.</p>
              </div>
            ) : (
              <canvas ref={barCanvasRef} />
            )}
          </div>
        </div>

        {/* Chart 2: Distribusi Status Peminjaman (Doughnut Chart) */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-lg">pie_chart</span>
                Status Peminjaman
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Distribusi status terkini
              </p>
            </div>
          </div>

          <div className="w-full h-64 sm:h-72 relative flex items-center justify-center">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Memuat status...
              </div>
            ) : peminjamanList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-1">
                <span className="material-symbols-outlined text-3xl">donut_large</span>
                <p className="text-xs font-semibold">Belum ada data status.</p>
              </div>
            ) : (
              <canvas ref={doughnutCanvasRef} />
            )}
          </div>
        </div>
      </div>

      {/* Tabel Transaksi Terbaru dengan Nama User (Task 6) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Transaksi Peminjaman Terbaru
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              10 pengajuan peminjaman terakhir yang masuk ke sistem
            </p>
          </div>
          <Link
            href="/manajemen-peminjaman"
            className="text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1 transition-colors shrink-0"
          >
            Lihat Semua Transaksi
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                <th className="px-5 py-3.5 font-bold">ID Transaksi</th>
                <th className="px-5 py-3.5 font-bold">Informasi Barang</th>
                <th className="px-5 py-3.5 font-bold">Nama Peminjam</th>
                <th className="px-5 py-3.5 font-bold">Tgl Pinjam</th>
                <th className="px-5 py-3.5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : tabelTerbaru.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    Tidak ada pengajuan saat ini.
                  </td>
                </tr>
              ) : (
                tabelTerbaru.map((item) => {
                  const itemId = item.id_peminjaman || item.id;
                  const peminjamNama =
                    item.user_nama ||
                    userMap[item.id_user]?.nama ||
                    `User #${item.id_user}`;

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        #{itemId}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">
                            {item.nama_barang || getNamaBarang(item.id_barang)}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            Jumlah: {item.jumlah || 1} Unit • Rp {Number(item.total_harga || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-800">
                          {peminjamNama}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">
                        {item.tanggal_peminjaman || "-"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}