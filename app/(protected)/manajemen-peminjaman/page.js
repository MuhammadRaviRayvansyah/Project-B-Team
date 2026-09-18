"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { peminjaman, users, barang } from "@/app/data";
import StatusBadge from "../components/StatusBadge";

const DATA_PEMINJAMAN_ADMIN = peminjaman.map((p) => {
  const u = users.find((user) => user.id_user === p.id_user);
  const b = barang.find((item) => item.id_barang === p.id_barang);

  return {
    id: `PMJ-${p.id_peminjaman.toString().padStart(3, "0")}`,
    rawId: p.id_peminjaman,
    nama: b ? b.nama_barang : "Barang Tidak Ditemukan",
    img: b ? b.gambar : "/file.svg",
    unitInfo: b ? `Ukuran: ${b.ukuran}` : "-",
    peminjam: u ? u.nama : "Anonim",
    nim: u ? u.email.split("@")[0] : "-",
    tglPinjam: p.tanggal_peminjaman,
    tglKembali: p.tanggal_pengembalian,
    status: p.status,
    catatan: "",
  };
});

export default function ManajemenPeminjamanPage() {
  const [data, setData] = useState(DATA_PEMINJAMAN_ADMIN);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");

  const tabs = [
    "Semua",
    "Menunggu Persetujuan",
    "Disetujui",
    "Sedang Dipinjam",
    "Dikembalikan",
    "Ditolak",
  ];

  const filteredData = data.filter((item) => {
    const matchTab = activeTab === "Semua" || item.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.nama.toLowerCase().includes(q) ||
      item.peminjam.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.nim.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  // Ubah status salah satu peminjaman
  const updateStatus = (id, newStatus, catatan) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, catatan: catatan ?? item.catatan }
          : item,
      ),
    );
  };

  const handleSetujui = (item) => {
    updateStatus(item.id, "Disetujui");
  };

  const handleTolak = (item) => {
    const alasan = window.prompt(
      `Alasan menolak pengajuan "${item.nama}" (opsional):`,
      "",
    );
    if (alasan === null) return; // batal
    updateStatus(item.id, "Ditolak", alasan || "Ditolak oleh admin");
  };

  const handleTandaiDikembalikan = (item) => {
    updateStatus(item.id, "Dikembalikan");
  };

  const handleDetail = (item) => {
    window.alert(
      `Detail Peminjaman\n\nID: ${item.id}\nPeminjam: ${item.peminjam} (${item.nim})\nBarang: ${item.nama}\nPeriode: ${item.tglPinjam} - ${item.tglKembali}\nStatus: ${item.status}${
        item.catatan ? `\nCatatan: ${item.catatan}` : ""
      }`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header halaman */}
      <Hero
        category="ADMIN • PEMINJAMAN"
        title="Manajemen Peminjaman"
        description="Tinjau, setujui, atau tolak pengajuan peminjaman barang dari seluruh pengguna."
      />

      {/* Search */}
      <div className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#575f67] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama peminjam, NIM, ID, atau nama barang..."
            className="w-full bg-[#f1f5f9] text-[#181c20] placeholder-[#575f67] pl-10 pr-4 py-2.5 rounded-lg text-[14px] leading-relaxed border-none focus:outline-none focus:ring-2 focus:ring-[#2f3a4a] transition-all"
          />
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tab === "Semua"
              ? data.length
              : data.filter((d) => d.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab}</span>
              <span className={isActive ? "text-slate-300" : "text-slate-400"}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabel - tampilan desktop */}
      <section className="hidden lg:block bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="px-5 py-3">Barang</th>
              <th className="px-5 py-3">Peminjam</th>
              <th className="px-5 py-3">Periode</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.img}
                      alt={item.nama}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate max-w-[220px]">
                        {item.nama}
                      </p>
                      <p className="text-xs text-slate-500">
                        ID: {item.id} • {item.unitInfo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-800">{item.peminjam}</p>
                  <p className="text-xs text-slate-500">{item.nim}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600">
                  <p>Pinjam: {item.tglPinjam}</p>
                  <p>Kembali: {item.tglKembali}</p>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {item.status === "Menunggu Persetujuan" && (
                      <>
                        <button
                          onClick={() => handleSetujui(item)}
                          className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleTolak(item)}
                          className="text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Tolak
                        </button>
                      </>
                    )}

                    {item.status === "Sedang Dipinjam" && (
                      <button
                        onClick={() => handleTandaiDikembalikan(item)}
                        className="text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        Tandai Kembali
                      </button>
                    )}

                    <button
                      onClick={() => handleDetail(item)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5 transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium">
            Tidak ada peminjaman yang sesuai dengan filter.
          </div>
        )}
      </section>

      {/* Kartu - tampilan mobile/tablet */}
      <section className="lg:hidden space-y-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.img}
                alt={item.nama}
                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {item.nama}
                </p>
                <p className="text-xs text-slate-500">
                  {item.peminjam} • {item.nim}
                </p>
                <p className="text-xs text-slate-400">ID: {item.id}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="text-xs text-slate-600 flex items-center gap-4 border-t border-slate-100 pt-3">
              <span>Pinjam: {item.tglPinjam}</span>
              <span>Kembali: {item.tglKembali}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {item.status === "Menunggu Persetujuan" && (
                <>
                  <button
                    onClick={() => handleSetujui(item)}
                    className="flex-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleTolak(item)}
                    className="flex-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    Tolak
                  </button>
                </>
              )}

              {item.status === "Sedang Dipinjam" && (
                <button
                  onClick={() => handleTandaiDikembalikan(item)}
                  className="flex-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
                >
                  Tandai Kembali
                </button>
              )}

              <button
                onClick={() => handleDetail(item)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-2 transition-colors"
              >
                Detail
              </button>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-sm">
            Tidak ada peminjaman yang sesuai dengan filter.
          </div>
        )}
      </section>
    </div>
  );
}
