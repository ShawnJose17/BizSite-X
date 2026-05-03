import * as S from "../styles/dashboardStyles";

function MessageModal({ message, onClose, onDelete }) {
  if (!message) return null;

  return (
    <div
      style={{ ...S.modalOverlay, backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        style={{
          ...S.card,
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          textAlign: "left",
          animation: "scaleIn 0.25s ease"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "16px" }}>
          <h2>{message.name}</h2>
          <p style={{ color: "#2563eb" }}>{message.email}</p>
          <p style={{ fontSize: "12px", color: "#888" }}>
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>

        <div style={{
          fontSize: "15px",
          lineHeight: "1.7",
          marginBottom: "24px",
          whiteSpace: "pre-wrap"
        }}>
          {message.message}
        </div>

        <button
          style={{ ...S.buttonOutline, background: "#ef4444", color: "#fff", width: "50%", display: "block", margin: "0 auto" }}
          onClick={() => onDelete(message.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "1";
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MessageModal;