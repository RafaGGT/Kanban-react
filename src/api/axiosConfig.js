import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Renueva el access token usando el refresh token (sin importar authService)
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No hay refresh token");

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL || "http://localhost:8082"}/login/actualizar-token`,
    refreshToken,
    { headers: { "Content-Type": "text/plain" } }
  );

  const { token, refreshToken: nuevoRefresh } = response.data;
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", nuevoRefresh);
  return token;
};

// Si recibe 401, intenta renovar el token y reintenta el request original
let renovando = false;
let cola = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestOriginal = error.config;

    if (
      error.response?.status === 401 &&
      !requestOriginal._reintentado &&
      !requestOriginal.url.includes("/login")
    ) {
      requestOriginal._reintentado = true;

      if (renovando) {
        return new Promise((resolve, reject) => {
          cola.push({ resolve, reject });
        }).then((token) => {
          requestOriginal.headers.Authorization = `Bearer ${token}`;
          return api(requestOriginal);
        });
      }

      renovando = true;
      try {
        const nuevoToken = await refreshAccessToken();
        cola.forEach(({ resolve }) => resolve(nuevoToken));
        cola = [];
        requestOriginal.headers.Authorization = `Bearer ${nuevoToken}`;
        return api(requestOriginal);
      } catch {
        cola.forEach(({ reject }) => reject(error));
        cola = [];
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        window.location.href = "/login";
      } finally {
        renovando = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;