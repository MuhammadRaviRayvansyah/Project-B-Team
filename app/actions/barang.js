"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBarangAction(formData) {
  const nama_barang = formData.get("nama_barang");
  const id_kategori = formData.get("id_kategori");
  const ukuran = formData.get("ukuran");
  const stok = formData.get("stok");
  const harga_sewa = formData.get("harga_sewa");
  const gambar = formData.get("gambar");
  const deskripsi = formData.get("deskripsi");

  try {
    const res = await api.post("/barang", {
      nama_barang,
      id_kategori: Number(id_kategori),
      ukuran,
      stok: Number(stok),
      harga_sewa: Number(harga_sewa),
      gambar,
      deskripsi,
    });

    if (res && res.success === false) {
      return { error: res.message || "Gagal menambahkan barang." };
    }
  } catch (error) {
    return { error: "Terjadi kesalahan koneksi ke server." };
  }

  revalidatePath("/barang");
  revalidatePath("/dashboard/manajemen-barang");
  redirect("/dashboard/manajemen-barang");
}