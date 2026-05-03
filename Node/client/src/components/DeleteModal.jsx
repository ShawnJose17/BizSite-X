import * as S from "../styles/dashboardStyles";

function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={{ ...S.modalOverlay, backdropFilter: "blur(10px)" }}>
      <div style={{ ...S.card, width: "360px", textAlign: "center", animation: "scaleIn 0.25s ease"}}>
        <h3>Remove Inquiry?</h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
          This action cannot be undone.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
          style={{ ...S.buttonOutline, flex: 1 }}
          onClick={onClose} onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "1";
          }}>
            Cancel
          </button>

          <button
            style={{ ...S.buttonPrimary, background: "#ef4444", flex: 1 }}
            onClick={onConfirm}
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
    </div>
  );
}

export default DeleteModal;