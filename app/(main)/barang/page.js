import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import { getBarang, getKategori } from "@/lib/api";

export default async function BarangPage() {
  let barangList = [];
  let kategoriList = [];

  try {
    const [barRes, katRes] = await Promise.all([getBarang(), getKategori()]);
    barangList = Array.isArray(barRes) ? barRes : barRes.data || [];
    kategoriList = Array.isArray(katRes) ? katRes : katRes.data || [];
  } catch (error) {
    console.error("Gagal memuat katalog barang:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          <div className="py-10">
            <Hero
              category="KATALOG INVENTARIS"
              title="Daftar Barang"
              description="Pilih perlengkapan resmi, busana seremonial, dan atribut kampus yang tersedia dari database server."
            />
          </div>

          <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {barangList.length > 0 ? (
                barangList.map((b) => {
                  const matchedKat = kategoriList.find((k) => (k.id_kategori || k.id) === (b.id_kategori || b.kategori_id));
                  return (
                    <ItemCard
                      key={b.id_barang || b.id}
                      id_barang={b.id_barang || b.id}
                      nama_barang={b.nama_barang || b.nama}
                      nama_kategori={matchedKat ? matchedKat.nama_kategori : "Umum"}
                      ukuran={b.ukuran}
                      stok={b.stok}
                      harga_sewa={b.harga_sewa || b.hargaPerHari}
                      gambar={b.gambar || b.img}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium">Belum ada data barang dari server API.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}