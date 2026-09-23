"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBarangAction(formData) {
  try {
    await api.post("/barang", {
      nama_barang: formData.get("nama_barang"),
      id_kategori: Number(formData.get("id_kategori")),
      ukuran: formData.get("ukuran"),
      stok: Number(formData.get("stok")),
      harga_sewa: Number(formData.get("harga_sewa")),
      gambar: formData.get("gambar"),
      deskripsi: formData.get("deskripsi"),
    });
  } catch (error) {
    return { error: "Gagal menambahkan barang" };
  }

  revalidatePath("/barang");
  revalidatePath("/manajemen-barang");
  redirect("/manajemen-barang");
}

export async function updateBarangAction(formData) {
  const id = formData.get("id_barang");
  try {
    await api.put(`/barang/${id}`, {
      nama_barang: formData.get("nama_barang"),
      id_kategori: Number(formData.get("id_kategori")),
      ukuran: formData.get("ukuran"),
      stok: Number(formData.get("stok")),
      harga_sewa: Number(formData.get("harga_sewa")),
      gambar: formData.get("gambar"),
      deskripsi: formData.get("deskripsi"),
    });
  } catch (error) {
    return { error: "Gagal memperbarui barang" };
  }
  
  revalidatePath("/barang");
  revalidatePath("/manajemen-barang");
  redirect("/manajemen-barang");
}

export async function deleteBarangAction(formData) {
  const id = formData.get("id_barang");
  try {
    await api.delete(`/barang/${id}`);
    revalidatePath("/barang");
    revalidatePath("/manajemen-barang");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus barang" };
  }
}