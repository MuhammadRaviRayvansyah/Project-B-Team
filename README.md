# PEPAC

PEPAC (Peminjaman Pakaian untuk Acara) adalah sistem yang digunakan untuk mengelola peminjaman pakaian dan perlengkapan untuk keperluan acara, seperti batik, jas, sepatu, dan lainnya.

## End-user

End-user merupakan pengguna yang menggunakan barang dengan melakukan peminjaman melalui sistem.

### Fitur End-user

- Login
- Melihat daftar barang
- Mencari barang
- Mengajukan peminjaman barang
- Melihat dan memantau status peminjaman
- Melihat riwayat peminjaman

### Alur Peminjaman

Login  
↓  
Lihat / Cari Barang  
↓  
Pilih Barang  
↓  
Ajukan Peminjaman  
↓  
Menunggu Persetujuan Admin  
↓  
Disetujui / Ditolak  
↓  
Pantau Peminjaman  
↓  
Selesai

## Admin-user

Admin digunakan untuk mengelola data barang dan pengajuan peminjaman dari pengguna.

### Fitur Admin-user

- Login
- Melihat pengajuan peminjaman
- Menyetujui atau menolak peminjaman
- Menambah data barang
- Melihat data barang
- Mengubah data barang
- Menghapus data barang
- Mengelola stok barang
- Mengelola ukuran dan jenis barang

### Data Barang

Data yang dapat dikelola oleh admin meliputi:

- Nama barang
- Jenis barang
- Ukuran
- Stok
- Kondisi barang
- Deskripsi
- Foto barang
- Status ketersediaan

## Hak Akses

| Fitur | End-user | Admin-user |
|---|:---:|:---:|
| Login | ✓ | ✓ |
| Lihat barang | ✓ | ✓ |
| Cari barang | ✓ | - |
| Ajukan peminjaman | ✓ | - |
| Pantau peminjaman | ✓ | ✓ |
| Riwayat peminjaman | ✓ | - |
| Approval peminjaman | - | ✓ |
| Tambah barang | - | ✓ |
| Edit barang | - | ✓ |
| Hapus barang | - | ✓ |
| Kelola stok | - | ✓ |
| Kelola ukuran dan jenis | - | ✓ |