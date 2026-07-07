import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/loginService";
import { useForm } from "../hooks/useForm";
import FormField from "../componentes/FormField";
import "./Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { form, handleChange } = useForm({ username: "", password: "" });
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "https://kanban-react-eight.vercel.app";

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    const getParam = (...keys) => {
      for (const key of keys) {
        const value = searchParams.get(key) || hashParams.get(key);
        if (value) return value;
      }
      return null;
    };

    const token = getParam("token", "accessToken", "access_token");
    const refreshToken = getParam("refreshToken", "refresh_token");
    const username = getParam("username", "user", "email");

    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      if (username) {
        localStorage.setItem("username", username);
      }
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError(null);
    try {
      await login(form);
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 429) setServerError("Demasiados intentos. Espera 1 minuto.");
      else if (err.response?.status === 401) setServerError("Usuario o contraseña incorrectos.");
      else setServerError("Error al conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <nav className="auth-nav">
        <span className="auth-nav-logo" onClick={() => navigate("/")}>
          <span className="auth-nav-dot" />Kanban
        </span>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/registro")}>
          Crear cuenta
        </button>
      </nav>

      <div className="auth-content">
        {/* ---------- Panel izquierdo: branding ---------- */}
        <div className="auth-brand">
          <span className="eyebrow">Bienvenido de nuevo</span>
          <h1 className="auth-title">Retoma tu flujo<br />justo donde quedó</h1>
          <p className="auth-subtitle">
            Tus tableros, columnas y tareas te esperan tal como los dejaste.
          </p>

          <div className="auth-perks">
            <div className="auth-perk accent-violet"><span className="auth-perk-dot" />Acceso a todos tus tableros</div>
            <div className="auth-perk accent-cyan"><span className="auth-perk-dot" />Sincronización en tiempo real</div>
            <div className="auth-perk accent-pink"><span className="auth-perk-dot" />Login con Google en un clic</div>
          </div>

          <div className="auth-preview">
            <div className="auth-preview-topbar">
              <span className="dot dot-pink" style={{ background: "var(--accent-pink)" }} />
              <span className="dot dot-lime" style={{ background: "var(--accent-lime)" }} />
              <span className="dot dot-cyan" style={{ background: "var(--accent-cyan)" }} />
            </div>
            <div className="auth-preview-cols">
              {[
                { name: "Por hacer", accent: "violet" },
                { name: "En progreso", accent: "cyan" },
                { name: "Hecho", accent: "pink" },
              ].map((col) => (
                <div key={col.name} className={`auth-preview-col accent-${col.accent}`}>
                  <div className="auth-preview-col-head">{col.name}</div>
                  <div className="auth-preview-card">
                    <div className="bar bar-long" />
                    <div className="bar bar-short" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Panel derecho: formulario ---------- */}
        <div className="card shadow-sm auth-card" style={{ "--auth-card-max": "440px" }}>
          <div className="card-body p-4">
            <span className="auth-logo mb-1"><span className="auth-logo-dot" />Kanban</span>
            <p className="text-muted mb-4 mt-1">Inicia sesión para continuar</p>

            <form onSubmit={handleSubmit}>
              <FormField id="username" label="Usuario" type="text"     value={form.username} onChange={handleChange} placeholder="tu_usuario" autoComplete="username" />
              <FormField id="password" label="Contraseña" type="password" value={form.password} onChange={handleChange} placeholder="••••••••"  autoComplete="current-password" />

              {serverError && <div className="alert alert-danger">{serverError}</div>}

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => window.location.href = `${apiBaseUrl}/login/google`}
              >
                Continuar con Google
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              ¿No tienes cuenta?{" "}
              <span className="auth-link" onClick={() => navigate("/registro")}>
                Regístrate
              </span>
            </p>
          </div>
        </div>
      </div>

      <footer className="auth-footer">© 2026 Kanban App. Hecho con React + Spring Boot.</footer>
    </div>
  );
}
