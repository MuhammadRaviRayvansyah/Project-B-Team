"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createReviewAction(formData) {
  const id_barang = Number(formData.get("id_barang"));
  const rating = Number(formData.get("rating"));
  const komentar = formData.get("komentar");

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_profile")?.value;

  if (!userCookie) {
    return { error: "Harus login" };
  }

  let id_user;
  try {
    const user = JSON.parse(userCookie);
    id_user = Number(user.id_user || user.id);
  } catch (error) {
    return { error: "Sesi tidak valid" };
  }

  try {
    await api.post("/review", {
      id_user,
      id_barang,
      rating,
      komentar,
    });
  } catch (error) {
    return { error: "Gagal mengirim ulasan" };
  }

  revalidatePath("/review");
  revalidatePath("/manajemen-review");
  return { success: true };
}

export async function deleteReviewAction(formData) {
  const id = formData.get("id_review");
  try {
    await api.delete(`/review/${id}`);
    revalidatePath("/review");
    revalidatePath("/manajemen-review");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus ulasan" };
  }
}