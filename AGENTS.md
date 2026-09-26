# AGENTS.md

## 1. Aturan Utama

Project ini adalah aplikasi React/Next.js untuk sistem PEPAC.

**Prioritas utama:**

* Kerjakan hanya bagian yang diminta user.
* Jangan membaca seluruh project jika tidak diperlukan.
* Jangan melakukan refactor atau perubahan file di luar scope.
* Jangan mengubah business logic jika user hanya meminta perubahan UI.
* Jangan membuat file baru jika perubahan dapat dilakukan pada file yang sudah ada.
* Pertahankan struktur folder dan pola kode yang sudah digunakan.
* Gunakan JavaScript/JSX sesuai file yang sudah ada.
* Jangan mengganti library atau framework tanpa diminta.

---

# 2. STRATEGI PEMBACAAN FILE

## WAJIB: Minimal Context

Sebelum mengubah kode:

1. Baca file target yang disebut user.
2. Baca dependency langsung dari file tersebut hanya jika diperlukan.
3. Baca file tambahan hanya jika:

   * function/component yang dibutuhkan berada di file tersebut;
   * error berasal dari file tersebut;
   * perubahan membutuhkan pemahaman terhadap API atau context;
   * user secara eksplisit meminta perbandingan dengan file lain.

### Jangan membaca secara otomatis

Jangan membaca seluruh:

* `app/`
* `components/`
* `actions/`
* `lib/`
* `images/`

kecuali memang diperlukan.

---

# 3. PRIORITAS FILE

Gunakan aturan berikut ketika menentukan file yang perlu dibaca.

### Jika user meminta perubahan UI satu page

Baca:

```text
file page yang diminta
```

Jika menggunakan component tertentu dan component tersebut perlu diubah:

```text
page target
component terkait
```

Jangan membaca page lain.

---

### Jika user meminta perubahan API

Baca:

```text
page target
lib/api.js
```

Jika menggunakan Server Action:

```text
page target
actions/<action terkait>.js
```

Jangan membaca action lain yang tidak berkaitan.

---

### Jika user meminta perubahan authentication

Baca hanya file yang relevan:

```text
AuthGuard.js
UserContexts.js
token.js
```

dan page/layout yang menggunakan authentication tersebut.

Jangan membaca seluruh `(auth)` dan `(protected)` kecuali diperlukan.

---

### Jika user meminta perubahan halaman protected/admin

Mulai dari:

```text
app/(protected)/<page target>/page.js
```

Kemudian baca hanya dependency langsung yang diperlukan.

Jangan membaca:

```text
dashboard/
manajemen-review/
manajemen-peminjaman/
```

jika tidak berkaitan.

---

### Jika user meminta perubahan halaman public/main

Mulai dari:

```text
app/(main)/<page target>/page.js
```

Baca component yang digunakan page tersebut jika diperlukan.

Jangan membaca seluruh `(main)`.

---

# 4. ATURAN KHUSUS UI

Jika user meminta perubahan UI:

* Pertahankan logic API.
* Pertahankan state.
* Pertahankan function.
* Pertahankan endpoint.
* Pertahankan payload.
* Pertahankan nama variable jika tidak perlu diubah.
* Fokus pada JSX dan Tailwind CSS.
* Jangan mengubah behavior aplikasi tanpa instruksi user.

Jika user meminta "ubah desain", jangan mengubah API atau business logic.

---

# 5. ATURAN COMPONENT

Gunakan component yang sudah tersedia jika memang sesuai.

Component utama:

```text
components/
├── AuthGuard.js
├── EditProfile.js
├── ItemCard.js
├── ProfileSidebar.js
├── RatingStars.js
├── ReviewForm.js
├── ReviewList.js
└── UserContexts.js
```

Shared component:

```text
components/share-main/
├── footer.js
├── header.js
└── navbar.js
```

Jika sebuah component sudah digunakan oleh beberapa page:

* Jangan membuat versi duplikat.
* Ubah component tersebut jika perubahan memang harus berlaku global.
* Jika perubahan hanya untuk satu page, lakukan override di page tersebut bila memungkinkan.

---

# 6. HEADER DAN NAVBAR

Shared main header berada di:

```text
components/share-main/header.js
```

Navbar berada di:

```text
components/share-main/navbar.js
```

Footer berada di:

```text
components/share-main/footer.js
```

Jika user meminta perubahan header/navbar:

1. Baca component yang bersangkutan.
2. Jangan membaca semua page.
3. Periksa penggunaan component hanya jika diperlukan.

---

# 7. AUTHENTICATION

File terkait authentication:

```text
app/(auth)/
├── login/page.js
├── register/page.js
└── layout.js

components/AuthGuard.js
components/UserContexts.js
lib/token.js
actions/auth.js
```

Jangan membaca seluruh file authentication untuk perubahan yang hanya menyangkut satu page.

---

# 8. API

API utama:

```text
lib/api.js
```

Jika page menggunakan API seperti:

```js
getBarang()
getPeminjaman()
getReview()
api.get()
api.post()
api.put()
api.delete()
```

dan user meminta perubahan yang berkaitan dengan request tersebut, baca `lib/api.js`.

Jika user hanya meminta perubahan visual, **jangan membaca `lib/api.js`**.

---

# 9. SERVER ACTIONS

Server Actions berada di:

```text
app/actions/
├── auth.js
├── barang.js
├── peminjaman.js
└── review.js
```

Hanya baca action yang relevan.

Contoh:

Jika masalah tentang barang:

```text
actions/barang.js
```

Tidak perlu membaca:

```text
actions/auth.js
actions/peminjaman.js
actions/review.js
```

---

# 10. IMAGE ASSETS

Asset berada di:

```text
images/
├── bg-auth.jpg
├── bg-beranda.jpg
└── logo.jpeg
```

Jangan membaca atau memproses asset gambar kecuali:

* user meminta perubahan gambar;
* page menggunakan gambar tersebut dan informasi asset diperlukan;
* terjadi masalah rendering gambar.

---

# 11. ROUTING

### Public / Main

```text
app/(main)/
├── page.js
├── barang/page.js
├── detail-barang/[id]/page.js
├── peminjaman/page.js
├── review/page.js
└── riwayat/page.js
```

### Authentication

```text
app/(auth)/
├── login/page.js
└── register/page.js
```

### Protected / Admin

```text
app/(protected)/
├── dashboard/page.js
├── manajemen-barang/page.js
├── manajemen-barang/tambah/page.js
├── manajemen-barang/edit/[id]/page.js
├── manajemen-peminjaman/page.js
├── manajemen-peminjaman/[id]/page.js
└── manajemen-review/page.js
```

Jika user menyebut route tertentu, fokus hanya pada route tersebut.

---

# 12. CONTOH SCOPE

## User meminta:

"Perbaiki UI manajemen barang."

Baca:

```text
app/(protected)/manajemen-barang/page.js
```

Jika diperlukan:

```text
components/share-admin/*
```

Jangan membaca seluruh project.

---

## User meminta:

"Perbaiki fitur edit barang."

Baca:

```text
app/(protected)/manajemen-barang/edit/[id]/page.js
```

Jika API diperlukan:

```text
lib/api.js
```

Jika form tambah digunakan sebagai referensi dan user meminta disamakan:

```text
app/(protected)/manajemen-barang/tambah/page.js
```

Jangan membaca page dashboard atau manajemen lainnya.

---

## User meminta:

"Perbaiki login."

Baca:

```text
app/(auth)/login/page.js
```

Kemudian hanya jika diperlukan:

```text
actions/auth.js
lib/api.js
lib/token.js
components/UserContexts.js
```

---

## User meminta:

"Perbaiki tampilan Review."

Baca:

```text
app/(main)/review/page.js
app/(main)/review/ReviewClient.js
```

Jika component review diperlukan:

```text
components/ReviewForm.js
components/ReviewList.js
components/RatingStars.js
```

Jangan membaca halaman barang, peminjaman, atau riwayat kecuali user meminta perbandingan.

---

# 13. JANGAN MELAKUKAN SCAN BESAR

Hindari tindakan seperti:

```text
scan seluruh repository
baca semua page
baca semua component
baca semua action
baca semua CSS
```

kecuali user secara eksplisit meminta:

* audit seluruh project;
* debugging global;
* refactor seluruh project;
* pengecekan arsitektur;
* pengecekan dependency;
* pengecekan konsistensi seluruh aplikasi.

---

# 14. DEPENDENCY CHAIN

Gunakan pendekatan:

```text
User Request
    ↓
Target File
    ↓
Direct Dependency
    ↓
Only if needed → Secondary Dependency
```

Jangan melakukan:

```text
User Request
    ↓
Scan seluruh repository
```

---

# 15. PERUBAHAN MINIMAL

Selalu prioritaskan perubahan minimal.

Jika user meminta:

> "ubah warna tombol"

Jangan:

* refactor component;
* mengganti struktur state;
* mengganti API;
* mengganti routing;
* mengubah database;
* mengubah file lain.

Cukup ubah class Tailwind yang diperlukan.

---

# 16. JANGAN MENGHAPUS LOGIC

Jangan menghapus:

* API request;
* state;
* validation;
* error handling;
* loading state;
* authentication;
* routing;
* function handler;

hanya karena tidak terlihat berhubungan dengan UI.

Jika logic terlihat bermasalah tetapi user tidak meminta perubahan logic:

1. Jangan ubah otomatis.
2. Informasikan masalahnya.
3. Tunggu instruksi jika perubahan diperlukan.

---

# 17. RESPONSE SETELAH PERUBAHAN

Setelah melakukan perubahan:

Berikan ringkasan singkat:

```text
Perubahan:
- ...
- ...
- ...

File:
- ...

Logic yang dipertahankan:
- ...
```

Jangan memberikan penjelasan panjang jika user hanya meminta perubahan kode.

---

# 18. PRIORITAS INSTRUKSI

Urutan prioritas:

1. Instruksi user terbaru.
2. Instruksi dalam `AGENTS.md`.
3. Struktur dan pola project yang sudah ada.
4. Perubahan minimal.
5. Jangan mengubah bagian yang tidak diminta.

---

# 19. PRINSIP UTAMA

> Baca sesedikit mungkin, ubah sesedikit mungkin, dan hanya pada bagian yang diperlukan.

Project ini tidak membutuhkan full repository scan untuk perubahan kecil.

Selalu mulai dari file yang disebut user.
