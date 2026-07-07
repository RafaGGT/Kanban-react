import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const FEATURES = [
  { title: "Tableros ilimitados", desc: "Crea un tablero por proyecto, equipo o área de tu vida.", accent: "violet", icon: "board" },
  { title: "Columnas a tu medida", desc: "Define el flujo de trabajo exacto que necesitas, sin moldes.", accent: "cyan", icon: "columns" },
  { title: "Arrastra y suelta", desc: "Mueve tareas entre columnas con un gesto, sin fricción.", accent: "pink", icon: "drag" },
  { title: "Equipo conectado", desc: "Asigna tareas a tu equipo y mantén todo sincronizado.", accent: "lime", icon: "team" },
  { title: "Login con Google", desc: "Entra con tu cuenta de Google en un solo clic.", accent: "violet", icon: "lock" },
  { title: "Rápido y ligero", desc: "Interfaz construida con React y Spring Boot.", accent: "cyan", icon: "bolt" },
];

const STEPS = [
  { n: "01", title: "Crea tu tablero", desc: "Ponle nombre a tu proyecto y arráncalo en segundos.", accent: "violet" },
  { n: "02", title: "Define columnas", desc: "Modela tu propio flujo: por hacer, en progreso, hecho, o lo que necesites.", accent: "cyan" },
  { n: "03", title: "Arrastra y avanza", desc: "Mueve tareas entre columnas y mira tu progreso en tiempo real.", accent: "pink" },
];

const STATS = [
  { value: "100%", label: "gratis para empezar" },
  { value: "< 5 min", label: "para tu primer tablero" },
  { value: "∞", label: "tableros y columnas" },
];

const ICONS = {
  board: <path d="M4 5h16v14H4z M4 5v14 M9 5v14 M14 5v14" />,
  columns: <path d="M5 4v16 M12 4v16 M19 4v16" />,
  drag: <path d="M9 5v14 M15 5v14 M6 9l-2 3 2 3 M18 9l2 3-2 3" />,
  team: <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M16 8a3 3 0 1 0 0-6 M22 20c0-2.8-2-5-4.5-5.7" />,
  lock: <path d="M6 11V8a6 6 0 0 1 12 0v3 M4 11h16v9H4z" />,
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
};

function FeatureIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing">
      <nav className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
        <span className="landing-logo"><span className="landing-logo-dot" />Kanban</span>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/registro")}>Registrarse</button>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="landing-hero">
        <div className="landing-hero-text">
          <span className="eyebrow">Organización simple y visual</span>
          <h1 className="landing-title">El flujo de tu trabajo,<br />trazado en tiempo real</h1>
          <p className="landing-subtitle">
            Crea tableros, organiza tareas en columnas y muévelas con un gesto.
            Trabaja solo o en equipo, desde cualquier lugar.
          </p>
          <div className="landing-actions d-flex gap-3 flex-wrap justify-content-center">
            <button className="btn btn-primary" onClick={() => navigate("/registro")}>Empezar gratis</button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/login")}>Ya tengo cuenta</button>
          </div>

          <div className="landing-stats">
            {STATS.map((s) => (
              <div key={s.label} className="landing-stat">
                <span className="landing-stat-value">{s.value}</span>
                <span className="landing-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-preview">
          <div className="landing-preview-topbar">
            <span className="dot dot-pink" /><span className="dot dot-lime" /><span className="dot dot-cyan" />
          </div>

          <svg className="landing-flow" viewBox="0 0 560 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 70 20 H 490" />
            <circle r="4" fill="var(--accent-cyan)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path="M 70 20 H 490" />
            </circle>
            <circle r="3" fill="var(--accent-pink)">
              <animateMotion dur="3.2s" begin="1.1s" repeatCount="indefinite" path="M 70 20 H 490" />
            </circle>
          </svg>

          <div className="landing-preview-cols">
            {[
              { name: "Por hacer", accent: "violet", count: 3 },
              { name: "En progreso", accent: "cyan", count: 2 },
              { name: "Hecho", accent: "lime", count: 4 },
            ].map((col) => (
              <div key={col.name} className={`landing-preview-col accent-${col.accent}`}>
                <div className="landing-preview-col-head">
                  <span>{col.name}</span>
                  <span className="landing-preview-count">{col.count}</span>
                </div>
                {[1, 2].map((j) => (
                  <div key={j} className="landing-preview-card">
                    <div className="bar bar-long" />
                    <div className="bar bar-short" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section className="landing-steps">
        <span className="eyebrow d-block text-center">Cómo funciona</span>
        <h2 className="landing-section-title">De la idea al tablero en tres pasos</h2>

        <div className="landing-steps-row">
          <div className="landing-steps-line" aria-hidden="true" />
          {STEPS.map((step) => (
            <div key={step.n} className={`landing-step accent-${step.accent}`}>
              <span className="landing-step-n">{step.n}</span>
              <h3 className="landing-step-title">{step.title}</h3>
              <p className="landing-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="landing-features">
        <span className="eyebrow d-block text-center">Funcionalidades</span>
        <h2 className="landing-section-title">Todo lo que necesitas</h2>
        <p className="landing-section-subtitle">Sin curva de aprendizaje, sin configuraciones complejas.</p>

        <div className="landing-feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className={`landing-feature-card accent-${f.accent}`}>
              <span className="landing-feature-icon"><FeatureIcon name={f.icon} /></span>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Showcase grande del tablero ---------- */}
      <section className="landing-showcase">
        <div className="landing-showcase-text">
          <span className="eyebrow">En acción</span>
          <h2 className="landing-section-title landing-showcase-title">Tu tablero, siempre a la vista</h2>
          <p className="landing-section-subtitle landing-showcase-subtitle">
            Columnas con color propio, contador de tareas y edición al instante.
            Todo lo que tu equipo necesita ver, en una sola pantalla.
          </p>
        </div>

        <div className="landing-showcase-board">
          {[
            { name: "Backlog", accent: "violet", cards: ["Investigar API", "Definir modelo de datos", "Bocetar UI"] },
            { name: "En progreso", accent: "cyan", cards: ["Login con Google", "Drag & drop"] },
            { name: "Revisión", accent: "pink", cards: ["Tests unitarios"] },
            { name: "Hecho", accent: "lime", cards: ["Setup del proyecto", "CI/CD", "Deploy inicial"] },
          ].map((col) => (
            <div key={col.name} className={`landing-showcase-col accent-${col.accent}`}>
              <div className="landing-showcase-col-head">
                <span>{col.name}</span>
                <span className="landing-preview-count">{col.cards.length}</span>
              </div>
              {col.cards.map((c) => (
                <div key={c} className="landing-showcase-card">{c}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Cita ---------- */}
      <section className="landing-quote">
        <svg className="landing-quote-mark" viewBox="0 0 32 24" width="40" aria-hidden="true">
          <path fill="var(--accent-violet)" d="M0 24V14.4Q0 7.2 3.6 3.6 7.2 0 13.6 0v4.8q-3.6 0-5.6 2-2 2-2 5.6h6.4V24Zm18.4 0V14.4q0-7.2 3.6-10.8Q25.6 0 32 0v4.8q-3.6 0-5.6 2-2 2-2 5.6H30.8V24Z" />
        </svg>
        <p className="landing-quote-text">
          Dejé de perder tareas entre chats y notas sueltas. Ahora todo el equipo ve el mismo tablero, en tiempo real.
        </p>
        <span className="landing-quote-author">Equipo de desarrollo, proyecto universitario</span>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="landing-cta">
        <h2>¿Listo para empezar?</h2>
        <p>Crea tu cuenta gratis y organiza tu primer tablero en minutos.</p>
        <button className="btn btn-primary btn-lg landing-cta-button" onClick={() => navigate("/registro")}>Crear cuenta gratis</button>
      </section>

      <footer className="landing-footer">
        <span className="landing-logo"><span className="landing-logo-dot" />Kanban</span>
        <p>© 2026 Kanban App. Hecho con React + Spring Boot.</p>
      </footer>
    </div>
  );
}