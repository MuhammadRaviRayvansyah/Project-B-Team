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
  const durasi = Math.max(Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)), 1);
  const total_harga = harga_sewa * jumlah * durasi;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_profile")?.value;

  if (!userCookie) return { error: "Anda harus login untuk meminjam barang." };

  let id_user;
  try {
    const user = JSON.parse(userCookie);
    id_user = Number(user.id_user || user.id);
  } catch (error) {
    return { error: "Sesi tidak valid, silakan login kembali." };
  }

  try {
    await api.post("/peminjaman", {
      id_user, id_barang, jumlah, harga_sewa, total_harga, tanggal_peminjaman, tanggal_pengembalian, status: "Menunggu Persetujuan",
    });
  } catch (error) {
    return { error: "Terjadi kesalahan koneksi ke server." };
  }

  revalidatePath("/peminjaman");
  redirect("/peminjaman");
}

export async function updateStatusPeminjamanAction(idPeminjaman, newStatus, catatanBaru = "") {
  try {
    await api.put(`/peminjaman/${idPeminjaman}`, { status: newStatus, catatan: catatanBaru });
    revalidatePath("/manajemen-peminjaman");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deletePeminjamanAction(idPeminjaman) {
  try {
    await api.delete(`/peminjaman/${idPeminjaman}`);
    revalidatePath("/manajemen-peminjaman");
  } catch (error) {}
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
  } catch (error) {}
  revalidatePath("/manajemen-peminjaman");
  redirect("/manajemen-peminjaman");
}