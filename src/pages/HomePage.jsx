import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/Navbar";
import { getBoards, createBoard, deleteBoard } from "../api/boardService";
import "./HomePage.css";

const ACCENTS = ["violet", "cyan", "pink", "lime"];

function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v14H4z M4 5v14 M9 5v14 M14 5v14" />
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBoards();
      setBoards(data ?? []);
    } catch (err) {
      if (err.response?.status === 204) {
        setBoards([]);
      } else {
        setError("Error al cargar los tableros.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    setCreating(true);
    try {
      await createBoard({ name: newBoardName.trim() });
      setNewBoardName("");
      setShowForm(false);
      await fetchBoards();
    } catch {
      setError("Error al crear el tablero.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async (id) => {
    if (!window.confirm("¿Eliminar este tablero?")) return;
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("Error al eliminar el tablero.");
    }
  };

  return (
    <div className="app-shell">
      <Navbar username={username} />

      <div className="container py-5">
        {/* ---------- Encabezado ---------- */}
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3 home-header">
          <div>
            <span className="eyebrow">Espacio de trabajo</span>
            <h1 className="home-title">
              Hola{username ? `, ${username}` : ""}<br />aquí están tus tableros
            </h1>
            {!loading && (
              <div className="home-stats">
                <span className="home-stat">
                  <span className="home-stat-value">{boards.length}</span> tablero{boards.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancelar" : "+ Nuevo tablero"}
          </button>
        </div>

        {/* ---------- Formulario nuevo tablero ---------- */}
        {showForm && (
          <div className="card shadow-sm mb-4 home-new-board-card">
            <div className="card-body">
              <form onSubmit={handleCreateBoard} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del tablero"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  autoFocus
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={creating} style={{ whiteSpace: "nowrap" }}>
                  {creating ? "Creando..." : "Crear"}
                </button>
              </form>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {loading && <div className="text-center py-5 text-muted">Cargando tableros...</div>}

        {/* ---------- Sin tableros ---------- */}
        {!loading && boards.length === 0 && (
          <div className="home-empty">
            <div className="home-empty-preview">
              <div className="home-empty-topbar">
                <span className="dot" style={{ background: "var(--accent-pink)" }} />
                <span className="dot" style={{ background: "var(--accent-lime)" }} />
                <span className="dot" style={{ background: "var(--accent-cyan)" }} />
              </div>
              <div className="home-empty-cols">
                {["Por hacer", "En progreso", "Hecho"].map((name, i) => (
                  <div key={name} className={`home-empty-col accent-${ACCENTS[i]}`}>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-muted mb-3 mt-4">Aún no tienes tableros.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Crear mi primer tablero
            </button>
          </div>
        )}

        {/* ---------- Grid de tableros ---------- */}
        {!loading && boards.length > 0 && (
          <div className="row g-3">
            {boards.map((board, i) => (
              <div key={board.id} className="col-12 col-sm-6 col-lg-4">
                <div className={`card shadow-sm h-100 home-board-card accent-${ACCENTS[i % ACCENTS.length]}`}>
                  <div className="card-body d-flex flex-column">
                    <span className="home-board-icon"><BoardIcon /></span>
                    <h5 className="card-title mt-3">{board.name}</h5>
                    {board.description && (
                      <p className="card-text text-muted" style={{ fontSize: 14 }}>
                        {board.description}
                      </p>
                    )}
                    <div className="mt-auto d-flex gap-2 pt-3">
                      <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => navigate(`/tablero/${board.id}`)}>
                        Abrir
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteBoard(board.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}