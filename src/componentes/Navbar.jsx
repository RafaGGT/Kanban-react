import { useNavigate } from "react-router-dom";
import { logout } from "../api/loginService";
import "./Navbar.css";

export default function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // borra el token y redirige a /login
  };

  return (
    <nav className="kb-navbar">
      <span className="kb-navbar-logo" onClick={() => navigate("/home")}>
        <span className="kb-navbar-dot" />
        Kanban
      </span>

      <div className="kb-navbar-right">
        {username && (
          <span className="kb-navbar-user">
            <span className="kb-navbar-avatar">{username[0]?.toUpperCase()}</span>
            {username}
          </span>
        )}
        <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
