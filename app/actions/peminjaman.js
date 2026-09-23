"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createPeminjamanAction(formData) {
  const id_barang = Number(formData.get("id_barang"));
  const jumlah = Number(formData.get("jumlah"));
  const harga_sewa = Number(formData.get("harga_sewa"));
  const tanggal_peminjaman = formData.get("tanggal_peminjaman");
  const tanggal_pengembalian = formData.get("tanggal_pengembalian");

  const start = new Date(tanggal_peminjaman);
  const end = new Date(tanggal_pengembalian);
  
  if (start > end) {
    return { error: "Tanggal kembali tidak valid" };
  }

  const durasi = Math.max(Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)), 1);
  const total_harga = harga_sewa * jumlah * durasi;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_profile")?.value;

  if (!userCookie) return { error: "Harus login" };

  let id_user;
  try {
    const user = JSON.parse(userCookie);
    id_user = Number(user.id_user || user.id);
  } catch (error) {
    return { error: "Sesi tidak valid" };
  }

  try {
    await api.post("/peminjaman", {
      id_user, 
      id_barang, 
      jumlah, 
      harga_sewa, 
      total_harga, 
      tanggal_peminjaman, 
      tanggal_pengembalian, 
      status: "Menunggu Persetujuan",
    });
  } catch (error) {
    return { error: "Terjadi kesalahan koneksi" };
  }

  revalidatePath("/peminjaman");
  revalidatePath("/manajemen-peminjaman");
  redirect("/peminjaman");
}

export async function updateStatusPeminjamanAction(idPeminjaman, newStatus) {
  try {
    await api.put(`/peminjaman/${idPeminjaman}`, { status: newStatus });
    revalidatePath("/peminjaman");
    revalidatePath("/manajemen-peminjaman");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui status" };
  }
}

export async function editPeminjamanAction(formData) {
  const id = formData.get("id_peminjaman");
  try {
    await api.put(`/peminjaman/${id}`, {
      jumlah: Number(formData.get("jumlah")),
      total_harga: Number(formData.get("total_harga")),
      tanggal_peminjaman: formData.get("tanggal_peminjaman"),
      tanggal_pengembalian: formData.get("tanggal_pengembalian"),
      status: formData.get("status"),
    });
  } catch (error) {
    return { error: "Gagal menyimpan perubahan" };
  }
  
  revalidatePath("/peminjaman");
  revalidatePath("/manajemen-peminjaman");
  redirect("/manajemen-peminjaman");
}

export async function deletePeminjamanAction(formData) {
  const id = formData.get("id_peminjaman") || formData;
  try {
    await api.delete(`/peminjaman/${id}`);
    revalidatePath("/peminjaman");
    revalidatePath("/manajemen-peminjaman");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus" };
  }
}