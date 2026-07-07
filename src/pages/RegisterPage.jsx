import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userService";
import { useForm } from "../hooks/useForm";
import FormField from "../componentes/FormField";
import "./Auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { form, errors, setErrors, handleChange } = useForm({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "El nombre de usuario es obligatorio.";
    else if (form.username.length < 3) newErrors.username = "Mínimo 3 caracteres.";
    if (!form.email.trim()) newErrors.email = "El email es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email no válido.";
    if (!form.password) newErrors.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) newErrors.password = "Mínimo 6 caracteres.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    setLoading(true);
    try {
      await createUser({ username: form.username, email: form.email, password: form.password });
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 429) setServerError("Demasiados intentos. Espera 1 minuto.");
      else if (err.response?.status === 409) setServerError("El nombre de usuario o email ya está en uso.");
      else if (err.response?.status === 400) setServerError("Datos inválidos. Revisa los campos e intenta de nuevo.");
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
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </nav>

      <div className="auth-content">
        {/* ---------- Panel izquierdo: branding ---------- */}
        <div className="auth-brand">
          <span className="eyebrow">Organización simple y visual</span>
          <h1 className="auth-title">Crea tu cuenta y<br />ordena tu primer flujo</h1>
          <p className="auth-subtitle">
            Tableros, columnas y tareas listos en minutos. Sin configuraciones complejas.
          </p>

          <div className="auth-perks">
            <div className="auth-perk accent-violet"><span className="auth-perk-dot" />Tableros y columnas ilimitados</div>
            <div className="auth-perk accent-cyan"><span className="auth-perk-dot" />Arrastra y suelta tareas al instante</div>
            <div className="auth-perk accent-pink"><span className="auth-perk-dot" />100% gratis para empezar</div>
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
        <div className="card shadow-sm auth-card" style={{ "--auth-card-max": "480px" }}>
          <div className="card-body p-4">
            <span className="auth-logo mb-1"><span className="auth-logo-dot" />Crear cuenta</span>
            <p className="text-muted mb-4 mt-1">Únete a Kanban</p>

            <form onSubmit={handleSubmit}>
              <FormField id="username" label="Nombre de usuario" type="text"        value={form.username}        onChange={handleChange} placeholder="tu_usuario"  error={errors.username}        autoComplete="username" />
              <FormField id="email"    label="Email"              type="email"       value={form.email}           onChange={handleChange} placeholder="tu@email.com" error={errors.email}           autoComplete="email" />
              <FormField id="password" label="Contraseña"         type="password"    value={form.password}        onChange={handleChange} placeholder="••••••••"     error={errors.password}        autoComplete="new-password" />
              <FormField id="confirmPassword" label="Confirmar contraseña" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} autoComplete="new-password" />

              {serverError && <div className="alert alert-danger">{serverError}</div>}

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              ¿Ya tienes cuenta?{" "}
              <span className="auth-link" onClick={() => navigate("/login")}>
                Inicia sesión
              </span>
            </p>
          </div>
        </div>
      </div>

      <footer className="auth-footer">© 2026 Kanban App. Hecho con React + Spring Boot.</footer>
    </div>
  );
}