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
    localStorage.setItem("user_profile", JSON.stringify(user));
  }
};

export const getUserProfile = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user_profile");
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        return null;
      }
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