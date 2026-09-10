'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const kategori = [
  { 
    icon: 'checkroom', 
    nama: 'Kebaya', 
    jumlah: '18 Koleksi' 
  },
  { 
    icon: 'dry_cleaning', 
    nama: 'Jas', 
    jumlah: '24 Koleksi' 
  },
  { 
    icon: 'steps', 
    nama: 'Sepatu', 
    jumlah: '12 Koleksi' 
  },
  { 
    icon: 'widgets', 
    nama: 'Lainnya', 
    jumlah: '35 Koleksi' 
  },
];

const barang = [
  { 
    nama: 'Kebaya Modern', 
    ukuran: 'M', 
    stok: '3',
    hargaPerHari: 25000, 
    img:'https://i.pinimg.com/736x/61/df/1f/61df1f028afca87a6f03cff66996a097.jpg' 
  },
  { 
    nama: 'Jas Formal Pria Hitam', 
    ukuran: 'L', 
    stok: '5', 
    hargaPerHari: 35000, 
    img: 'https://i.pinimg.com/736x/59/8d/1d/598d1dc1a16b9e0f121aeb2ac5f7242f.jpg' 
  },
  { 
    nama: 'Stiletto Heels', 
    ukuran: '39', 
    stok: '1', 
    hargaPerHari: 15000, 
    img: 'https://i.pinimg.com/736x/1d/b5/e7/1db5e774c7a1690d8dd8e80c68f3095f.jpg' 
  },
  { 
    nama: 'Kebaya Janggan', 
    ukuran: 'L', 
    stok: '4', 
    hargaPerHari: 30000, 
    img: 'https://i.pinimg.com/1200x/c1/9b/f8/c19bf8f0454c548da3fb6a6ff9ce3f06.jpg' 
  },
  { 
    nama: 'Baju Batik Pria', 
    ukuran: 'L', 
    stok: '5', 
    hargaPerHari: 20000, 
    img: 'https://i.pinimg.com/1200x/c3/28/ac/c328acf970c388b97a434345748fac10.jpg' 
  },
  { 
    nama: 'Sepatu Pantofel Oxford', 
    ukuran: '42', 
    stok: '2', 
    hargaPerHari: 20000, 
    img: 'https://i.pinimg.com/1200x/06/84/25/06842523eaf3e70e1efb923f3272d058.jpg' 
  },
];

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

export default function BerandaPage() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Cari:', query);
  };

  const handleDetail = (nama) => {
    console.log('Lihat detail:', nama);
  };

  return (
    <div className="bg-[#f7f9ff] text-[14px] leading-[20px] text-[#181c20] antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] pt-16 flex-1">
        <div className="flex flex-col w-full">
          {/* Hero */}
          <section className="py-[2rem] md:py-[3rem] bg-[#f1f4f9] rounded-xl px-[1rem] md:px-[2rem] mb-[2rem]">
            <div className="max-w-2xl">
              <span className="text-[11px] leading-[14px] tracking-[0.02em] font-semibold uppercase tracking-wider text-[#575f67] mb-[0.5rem] block">
                Sistem Informasi Penyewaan Perlengkapan Acara
              </span>
              <h1 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-[#181c20] mb-[0.5rem]">Selamat Datang</h1>
              <p className="text-[16px] leading-[24px] text-[#44474c] mb-[1.5rem]">
                Temukan barang untuk kebutuhan acara Anda.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-[0.5rem] bg-white p-[0.25rem] rounded-lg shadow-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <div className="flex-1 flex items-center px-[0.75rem] gap-[0.5rem]">
                  <span className="material-symbols-outlined text-[#575f67] text-[20px]">search</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent text-[#181c20] placeholder:text-[#575f67] text-[14px] focus:outline-none py-[0.5rem]"
                    placeholder="Cari barang..."
                    type="text"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-[#2f3a4a] text-white hover:opacity-90 text-[14px] font-medium px-[1.5rem] py-[0.5rem] rounded-lg transition-colors flex items-center justify-center gap-[0.5rem] h-10"
                >
                  <span>Cari</span>
                </button>
              </form>
            </div>
          </section>

          {/* Kategori */}
          <section className="mb-[2rem]">
            <div className="flex items-center justify-between mb-[1rem]">
              <div>
                <h2 className="text-[24px] leading-[32px] tracking-[-0.015em] font-semibold text-[#181c20]">Kategori</h2>
                <p className="text-[13px] leading-[18px] tracking-[0.01em] text-[#44474c]">Pilih perlengkapan sesuai jenis acara</p>
              </div>
              <Link href="#" className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#2f3a4a] hover:underline flex items-center gap-[0.25rem]">
                Semua Kategori <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1rem]">
              {kategori.map((k) => (
                <Link
                  key={k.nama}
                  href="#"
                  className="bg-white p-[1rem] rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#ebeef3] flex items-center justify-center text-[#181c20] mb-[0.75rem] group-hover:bg-[#2f3a4a] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">{k.icon}</span>
                  </div>
                  <span className="text-[15px] leading-[22px] font-semibold text-[#181c20]">{k.nama}</span>
                  <span className="text-[11px] leading-[14px] tracking-[0.02em] font-semibold text-[#575f67] mt-[0.25rem]">{k.jumlah}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Barang Tersedia */}
          <section className="mb-[3rem]">
            <div className="flex items-center justify-between mb-[1rem]">
              <div>
                <h2 className="text-[24px] leading-[32px] tracking-[-0.015em] font-semibold text-[#181c20]">Barang Tersedia</h2>
                <p className="text-[13px] leading-[18px] tracking-[0.01em] text-[#44474c]">Daftar perlengkapan yang tersedia minggu ini</p>
              </div>
              <Link href="#" className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#575f67] hover:text-[#181c20] flex items-center gap-[0.25rem]">
                Lihat Katalog Penuh <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
              {barang.map((b) => (
                <div
                  key={b.nama}
                  className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md"
                >
                  <div className="relative w-full aspect-[4/3] bg-[#ebeef3] overflow-hidden">
                    <img className="w-full h-full object-cover" src={b.img} alt={b.nama} />
                    <div className="absolute top-[0.5rem] right-[0.5rem]">
                      <span className="bg-white/95 text-[#181c20] px-[0.5rem] py-[0.25rem] rounded text-[11px] leading-[14px] tracking-[0.02em] font-semibold flex items-center gap-1 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                        Tersedia
                      </span>
                    </div>
                  </div>
                  <div className="p-[1rem] flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-[0.5rem] mb-[0.25rem]">
                        <h3 className="text-[16px] leading-[24px] font-semibold text-[#181c20]">{b.nama}</h3>
                        <span className="shrink-0 text-[15px] leading-[22px] font-semibold text-[#2f3a4a]">
                          {formatRupiah(b.hargaPerHari)}
                          <span className="text-[11px] font-medium text-[#575f67]">/hari</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-[1rem] py-[0.5rem] text-[#575f67] text-[13px] leading-[18px]
                       tracking-[0.01em] mb-[0.75rem]">   
                        <div className="flex items-center gap-[0.25rem]">
                          <span className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#181c20]">Ukuran:</span>
                          <span>{b.ukuran}</span>
                        </div>
                        <span className="text-[#d7dadf]">•</span>
                        <div className="flex items-center gap-[0.25rem]">
                          <span className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#181c20]">Stok:</span>
                          <span>{b.stok}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-[0.5rem]">
                      <button
                        type="button"
                        onClick={() => handleDetail(b.nama)}
                        className="w-full bg-[#2f3a4a] text-white hover:opacity-90 text-[14px] font-medium py-[0.5rem] 
                        rounded-lg transition-colors flex items-center justify-center gap-[0.5rem] h-10"
                      >
                        <span>Lihat Detail</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}