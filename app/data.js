// Data Users
export const users = [
  { id_user: 1, nama: "Mahasiswa A", email: "mahasiswa.a@kampus.ac.id", no_hp: "081234567890", password: "hashed_password" },
  { id_user: 2, nama: "Mahasiswa B", email: "mahasiswa.b@kampus.ac.id", no_hp: "089876543210", password: "hashed_password" },
];

// Data Kategori
export const kategori = [
  { id_kategori: 1, nama_kategori: "Busana Formal", icon: "checkroom", jumlah_koleksi: 18 },
  { id_kategori: 2, nama_kategori: "Busana Tradisional", icon: "styler", jumlah_koleksi: 24 },
  { id_kategori: 3, nama_kategori: "Alas Kaki & Aksesori", icon: "roller_skating", jumlah_koleksi: 12 },
  { id_kategori: 4, nama_kategori: "Perlengkapan Acara", icon: "camera_alt", jumlah_koleksi: 35 },
];

// Data Barang
export const barang = [
  { id_barang: 1, id_kategori: 1, nama_barang: "Jas Formal Pria Midnight Navy", ukuran: "L", harga_sewa: 50000, stok: 10, deskripsi: "Jas warna navy elegan untuk sidang.", gambar: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&auto=format&fit=crop" },
  { id_barang: 2, id_kategori: 2, nama_barang: "Kebaya Modern Kartini Cream", ukuran: "M", harga_sewa: 45000, stok: 5, deskripsi: "Kebaya modern warna cream.", gambar: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop" },
  { id_barang: 3, id_kategori: 3, nama_barang: "Sepatu Pantofel Oxford Leather", ukuran: "42", harga_sewa: 20000, stok: 0, deskripsi: "Sepatu pantofel pria berbahan kulit.", gambar: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&auto=format&fit=crop" },
  { id_barang: 4, id_kategori: 4, nama_barang: "Kamera DSLR Sony Alpha A7 III", ukuran: "All Size", harga_sewa: 150000, stok: 2, deskripsi: "Kamera untuk dokumentasi acara.", gambar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop" },
  { id_barang: 5, id_kategori: 1, nama_barang: "Toga Wisuda Lengkap", ukuran: "XL", harga_sewa: 35000, stok: 20, deskripsi: "Baju toga lengkap dengan topi dan kalung.", gambar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop" },
];

// Data Peminjaman
export const peminjaman = [
  { id_peminjaman: 1, id_user: 1, id_barang: 1, tanggal_peminjaman: "2026-10-20", tanggal_pengembalian: "2026-10-25", jumlah: 1, harga_sewa: 50000, status: "Sedang Dipinjam", total_harga: 250000 },
  { id_peminjaman: 2, id_user: 1, id_barang: 2, tanggal_peminjaman: "2026-10-24", tanggal_pengembalian: "2026-10-28", jumlah: 1, harga_sewa: 45000, status: "Menunggu Persetujuan", total_harga: 180000 },
  { id_peminjaman: 3, id_user: 1, id_barang: 3, tanggal_peminjaman: "2026-10-22", tanggal_pengembalian: "2026-10-26", jumlah: 1, harga_sewa: 20000, status: "Disetujui", total_harga: 80000 },
  { id_peminjaman: 4, id_user: 1, id_barang: 4, tanggal_peminjaman: "2026-10-15", tanggal_pengembalian: "2026-10-17", jumlah: 1, harga_sewa: 150000, status: "Ditolak", total_harga: 300000 },
  { id_peminjaman: 5, id_user: 1, id_barang: 5, tanggal_peminjaman: "2026-05-20", tanggal_pengembalian: "2026-05-23", jumlah: 1, harga_sewa: 35000, status: "Dikembalikan", total_harga: 105000 },
];

// Data Review
export const review = [
  { id_review: 1, id_user: 1, id_barang: 1, rating: 5, komentar: "Jasnya sangat pas dan wangi.", tanggal_review: "2026-10-26" },
];

