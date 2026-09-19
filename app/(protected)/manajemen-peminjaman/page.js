import Link from "next/link";
import { getPeminjaman, getBarang } from "@/lib/api";
import { updateStatusPeminjamanAction, deletePeminjamanAction } from "@/app/actions/peminjaman";
import Hero from "@/components/Hero";

export default async function ManajemenPeminjamanPage() {
  const [pemRes, barRes] = await Promise.all([getPeminjaman(), getBarang()]);
  const peminjamanList = Array.isArray(pemRes) ? pemRes : pemRes.data || [];
  const barangList = Array.isArray(barRes) ? barRes : barRes.data || [];

  const formattedData = peminjamanList.map((item) => {
    const brg = barangList.find((b) => (b.id_barang || b.id) === (item.id_barang || item.barang_id)) || {};
    return { ...item, nama_barang: brg.nama_barang || brg.nama, img: brg.gambar || brg.img, ukuran: brg.ukuran };
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <Hero category="ADMIN • PEMINJAMAN" title="Manajemen Peminjaman" description="Kelola seluruh transaksi peminjaman." />
      <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 text-xs sm:text-sm font-semibold text-slate-500 uppercase border-b">
                <th className="py-4 px-4 sm:px-6">Peminjam</th><th className="py-4 px-4 sm:px-6">Barang</th>
                <th className="py-4 px-4 sm:px-6">Durasi & Biaya</th><th className="py-4 px-4 sm:px-6">Status</th>
                <th className="py-4 px-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {formattedData.map((item) => (
                <tr key={item.id_peminjaman || item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 sm:px-6">
                    <p className="font-semibold">{item.nama_peminjam || `User #${item.id_user}`}</p>
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img src={item.img || "/placeholder.png"} alt="img" className="w-10 h-10 rounded-lg object-cover" />
                      <div><p className="font-semibold">{item.nama_barang}</p><p className="text-[10px]">Uk: {item.ukuran} | {item.jumlah} Unit</p></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6"><p>{item.tanggal_peminjaman} s/d {item.tanggal_pengembalian}</p><p className="font-bold text-emerald-600">Rp {item.total_harga}</p></td>
                  <td className="py-3 px-4 sm:px-6"><span className="px-2 py-1 rounded bg-slate-100">{item.status}</span></td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                      {item.status === 'Menunggu Persetujuan' && (
                        <><form action={updateStatusPeminjamanAction.bind(null, item.id_peminjaman || item.id, 'Disetujui', '')}><button type="submit" className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-bold text-xs">Setujui</button></form>
                        <form action={updateStatusPeminjamanAction.bind(null, item.id_peminjaman || item.id, 'Ditolak', '')}><button type="submit" className="bg-rose-50 text-rose-700 px-3 py-2 rounded-lg font-bold text-xs">Tolak</button></form></>
                      )}
                      {item.status === 'Disetujui' && (
                        <form action={updateStatusPeminjamanAction.bind(null, item.id_peminjaman || item.id, 'Dikembalikan', '')}><button type="submit" className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-bold text-xs">Selesai</button></form>
                      )}
                      <Link href={`/manajemen-peminjaman/edit/${item.id_peminjaman || item.id}`} className="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg font-bold text-xs">Edit</Link>
                      <form action={deletePeminjamanAction.bind(null, item.id_peminjaman || item.id)}><button type="submit" className="bg-slate-50 text-slate-500 px-3 py-2 rounded-lg font-bold text-xs">Hapus</button></form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}