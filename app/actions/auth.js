"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3";
const PROJECT = process.env.NEXT_PUBLIC_PROJECT_ID || "pepac";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "pk_pepac_95a8363fde15d4a6";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch(`${BASE_URL}/${PROJECT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success || !data.token) {
      return { error: data.message || "Login gagal" };
    }

    const role = data.user.role || (email.includes("admin") ? "admin" : "user");
    const userData = { ...data.user, role };

    const cookieStore = await cookies();
    cookieStore.set("session_token", data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("user_profile", JSON.stringify(userData), {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    return { error: "Terjadi kesalahan koneksi ke server" };
  }

  redirect("/");
}

export async function registerAction(formData) {
  const nama = formData.get("nama");
  const email = formData.get("email");
  const no_hp = formData.get("no_hp");
  const password = formData.get("password");

  try {
    const res = await fetch(`${BASE_URL}/${PROJECT}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({ nama, email, no_hp, password }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      return { error: data.message || "Registrasi gagal" };
    }
  } catch (error) {
    return { error: "Terjadi kesalahan koneksi ke server" };
  }

  redirect("/login");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  cookieStore.delete("user_profile");
  redirect("/login");
}