import { getToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3";
const PROJECT = process.env.NEXT_PUBLIC_PROJECT_ID || "pepac";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "pk_pepac_95a8363fde15d4a6";

async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}/${PROJECT}${cleanEndpoint}`;

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-API-Key": API_KEY,
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let reqMethod = options.method ? options.method.toUpperCase() : "GET";

  if (reqMethod === "PUT" || reqMethod === "DELETE") {
    headers["X-HTTP-Method-Override"] = reqMethod;
    reqMethod = "POST";
  }

  const config = {
    cache: "no-store",
    ...options,
    method: reqMethod,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    if (response.status === 204) return null;
    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

const normalizeArray = (res) => (Array.isArray(res) ? res : res?.data || []);

export async function getKategori() {
  try {
    const res = await api.get("/kategori");
    return normalizeArray(res);
  } catch (error) {
    return [];
  }
}

export async function getBarang(idKategori) {
  try {
    const url = idKategori && idKategori !== "Semua" ? `/barang?id_kategori=${idKategori}` : "/barang";
    const res = await api.get(url);
    return normalizeArray(res);
  } catch (error) {
    return [];
  }
}

export async function getDetailBarang(id) {
  try {
    const res = await api.get(`/barang/${id}`);
    return res?.data || res || null;
  } catch (error) {
    return null;
  }
}

export async function getPeminjaman() {
  try {
    const res = await api.get("/peminjaman");
    return normalizeArray(res);
  } catch (error) {
    return [];
  }
}

export async function getReview() {
  try {
    const res = await api.get("/review");
    return normalizeArray(res);
  } catch (error) {
    return [];
  }
}