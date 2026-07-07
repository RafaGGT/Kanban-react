import { useState } from "react";
import DeleteModal from "./Deletemodal";
import "./Usecard.css";

export default function UserCard({ user, onEdit, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setModalOpen(false);
    onDelete(user.username);
  };

  return (
    <>
      <div className="kb-user-card">
        <div className="kb-user-avatar">
          {user.username?.[0]?.toUpperCase() ?? "?"}
        </div>

        <div className="kb-user-info">
          <h2 className="kb-user-name">{user.username}</h2>
          <p className="kb-user-email">{user.email}</p>
        </div>

        <div className="kb-user-actions">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => onEdit(user)}>
            Editar
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => setModalOpen(true)}>
            Eliminar
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={modalOpen}
        username={user.username}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
