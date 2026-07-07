export default function DeleteModal({ isOpen, onConfirm, onCancel, username }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>¿Eliminar cuenta?</h2>
        <p style={styles.message}>
          Estás a punto de eliminar la cuenta{" "}
          <strong>{username}</strong>. Esta acción no se puede deshacer.
        </p>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
          <button style={styles.confirmBtn} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(2, 4, 10, 0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "24px",
  },
  modal: {
    backgroundColor: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "18px",
    padding: "28px 26px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  },
  title: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  message: {
    margin: "0 0 28px 0",
    fontSize: "15px",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-surface-2)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "10px",
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#fff",
    background: "linear-gradient(135deg, var(--accent-pink), #ff6cae)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 0 18px var(--glow-pink)",
  },
};