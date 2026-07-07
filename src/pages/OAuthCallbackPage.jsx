import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const ejecutado = useRef(false);

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const username = params.get("username");

    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#888" }}>Iniciando sesión con Google...</p>
    </div>
  );
}