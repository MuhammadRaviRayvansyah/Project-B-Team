"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPeminjaman, getBarang } from "@/lib/api";
import { getUserProfile } from "@/lib/token";

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    dipinjam: 0,
    selesai: 0,
    pendapatan: 0
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = getUserProfile();
        if (profile) {
          setAdminName(profile.nama || profile.name || profile.username || "Admin");
        }

        const [pemRes, barRes] = await Promise.all([
          getPeminjaman(),
          getBarang()
        ]);
        
        const dataPem = Array.isArray(pemRes) ? pemRes : [];
        const dataBar = Array.isArray(barRes) ? barRes : [];

        setPeminjamanList(dataPem);
        setBarangList(dataBar);

        let totalRev = 0;
        const monthlyRev = {};

        dataPem.forEach(p => {
          const st = (p.status || "").toLowerCase();
          if (st !== "ditolak" && st !== "dibatalkan") {
            const val = Number(p.total_harga || 0);
            totalRev += val;
            
            if (p.tanggal_peminjaman) {
              const d = new Date(p.tanggal_peminjaman);
              if (!isNaN(d)) {
                const monthName = d.toLocaleString('id-ID', { month: 'short' });
                monthlyRev[monthName] = (monthlyRev[monthName] || 0) + val;
              }
            }
          }
        });

        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const processedChart = monthsOrder
          .map(m => ({ label: m, value: monthlyRev[m] || 0 }))
          .filter(m => m.value > 0);

        if (processedChart.length === 0) {
          processedChart.push({ label: 'Bulan Ini', value: 0 });
        }

        setChartData(processedChart);

        setStats({
          total: dataPem.length,
          menunggu: dataPem.filter(p => (p.status || "").toLowerCase() === "pending").length,
          dipinjam: dataPem.filter(p => ["disetujui", "dipinjam"].includes((p.status || "").toLowerCase())).length,
          selesai: dataPem.filter(p => ["selesai", "dikembalikan"].includes((p.status || "").toLowerCase())).length,
          pendapatan: totalRev
        });

      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getNamaBarang = (idBarang) => {
    const b = barangList.find(x => String(x.id_barang || x.id) === String(idBarang));
    return b ? (b.nama_barang || b.nama) : "Barang Tidak Ditemukan";
  };

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);
  const tabelTerbaru = peminjamanList.slice().reverse().slice(0, 10);

  return (
    <div className="grid grid-cols-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 gap-6 md:gap-8">
      
      <div className="w-full min-w-0">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          Halo, {adminName} <span className="text-xl md:text-2xl">👋</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 truncate">Berikut ringkasan aktivitas peminjaman dan pendapatan server hari ini.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#1a2234] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">receipt_long</span>
          </div>
          <div className="truncate">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-0.5">{isLoading ? "..." : stats.total}</h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Total Pengajuan</p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">hourglass_empty</span>
          </div>
          <div className="truncate">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-0.5">{isLoading ? "..." : stats.menunggu}</h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Menunggu Acc</p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">local_shipping</span>
          </div>
          <div className="truncate">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-0.5">{isLoading ? "..." : stats.dipinjam}</h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Sedang Dipinjam</p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">task_alt</span>
          </div>
          <div className="truncate">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-0.5">{isLoading ? "..." : stats.selesai}</h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Selesai / Kembali</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col w-full min-w-0 overflow-hidden">
          <div className="mb-6">
            <h3 className="text-sm md:text-base font-bold text-slate-900">Grafik Pendapatan</h3>
            <p className="text-[11px] md:text-xs text-slate-500 mt-1">Total: Rp {stats.pendapatan.toLocaleString('id-ID')}</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-40 mt-auto border-b border-slate-100 pb-2 w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 gap-2 group min-w-[30px]">
                <div 
                  className="w-full bg-[#1a2234] rounded-t-md hover:bg-emerald-600 transition-colors relative"
                  style={{ height: `${(data.value / maxChartValue) * 100}%`, minHeight: '4px' }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap pointer-events-none transition-opacity z-10">
                    Rp {data.value.toLocaleString('id-ID')}
                  </div>
                </div>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase truncate w-full text-center">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 w-full min-w-0 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm md:text-base font-bold text-slate-900 truncate">Data Peminjaman</h3>
            <Link href="/manajemen-peminjaman" className="text-[11px] md:text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0">
              Lihat Semua <span className="material-symbols-outlined text-[14px] md:text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-full whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] md:text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold">ID</th>
                  <th className="px-4 py-3 font-bold">Barang & User</th>
                  <th className="px-4 py-3 font-bold">Tgl Pinjam</th>
                  <th className="px-4 py-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">Memuat data...</td></tr>
                ) : tabelTerbaru.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">Tidak ada pengajuan saat ini.</td></tr>
                ) : (
                  tabelTerbaru.map((item) => (
                    <tr key={item.id_peminjaman || item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        #{item.id_peminjaman || item.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{getNamaBarang(item.id_barang)}</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">User ID: {item.id_user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {item.tanggal_peminjaman || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-block px-2 py-1 text-[9px] sm:text-[10px] font-bold rounded-md uppercase tracking-wide
                          ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                            ['disetujui', 'dipinjam'].includes(item.status) ? 'bg-blue-100 text-blue-700' : 
                            ['selesai', 'dikembalikan'].includes(item.status) ? 'bg-emerald-100 text-emerald-700' : 
                            'bg-rose-100 text-rose-700'}`}
                        >
                          {item.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}