"use server";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createReviewAction(formData) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_profile")?.value;
  if (!userCookie) throw new Error("Anda harus login untuk memberikan ulasan.");

  let id_user;
  try {
    const user = JSON.parse(userCookie);
    id_user = Number(user.id_user || user.id);
  } catch (error) {
    throw new Error("Sesi tidak valid, silakan login kembali.");
  }

  try {
    await api.post("/review", {
      id_user,
      id_barang: Number(formData.get("id_barang")),
      rating: Number(formData.get("rating")),
      komentar: formData.get("komentar"),
    });
  } catch (error) {}

  revalidatePath("/review");
  revalidatePath("/barang/[id]", "page");
}