import { getPeminjaman } from "@/lib/api";
import { editPeminjamanAction } from "@/app/actions/peminjaman";
import Hero from "@/components/Hero";
import Link from "next/link";

export default async function EditPeminjamanPage({ params }) {
  const { id } = await params;
  let detailPeminjaman = null;

  try {
    const res = await getPeminjaman();
    const dataList = Array.isArray(res) ? res : res.data || [];
    detailPeminjaman = dataList.find((item) => String(item.id_peminjaman || item.id) === String(id));
  } catch (error) {}

  if (!detailPeminjaman) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Data Tidak Ditemukan</h2>
        <Link href="/manajemen-peminjaman" className="text-blue-600 hover:underline text-sm mt-4 inline-block">Kembali ke Manajemen Peminjaman</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <Hero
        category="ADMIN • EDIT PEMINJAMAN"
        title="Ubah Data Transaksi"
        description="Perbarui informasi tanggal, biaya, atau status peminjaman secara manual."
      />

      <form action={editPeminjamanAction} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm space-y-5 sm:space-y-6 w-full">
        <input type="hidden" name="id_peminjaman" value={id} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Jumlah Unit</label>
            <input
              type="number"
              name="jumlah"
              required
              defaultValue={detailPeminjaman.jumlah}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Total Biaya Sewa (Rp)</label>
            <input
              type="number"
              name="total_harga"
              required
              defaultValue={detailPeminjaman.total_harga}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Tanggal Pinjam</label>
            <input
              type="date"
              name="tanggal_peminjaman"
              required
              defaultValue={detailPeminjaman.tanggal_peminjaman}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Tanggal Kembali</label>
            <input
              type="date"
              name="tanggal_pengembalian"
              required
              defaultValue={detailPeminjaman.tanggal_pengembalian}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Status Peminjaman</label>
          <select
            name="status"
            required
            defaultValue={detailPeminjaman.status}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Dikembalikan">Dikembalikan (Selesai)</option>
          </select>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-slate-100">
          <Link href="/manajemen-peminjaman" className="w-full sm:w-1/3 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold py-3.5 rounded-xl text-center transition-colors">
            Batal
          </Link>
          <button type="submit" className="w-full sm:w-2/3 bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}