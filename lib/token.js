export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setUserProfile = (user) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("user_profile", JSON.stringify(user));
    } catch (e) {
      console.error("Gagal menyimpan profil ke localStorage:", e);
    }
  }
};

export const getUserProfile = () => {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem("user_profile");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Gagal mengambil profil dari localStorage:", e);
      return null;
    }
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user_profile");
  }
};