import api from "./axiosConfig";

// POST /login
export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  const { token, refreshToken } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("username", credentials.username);

  return token;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};