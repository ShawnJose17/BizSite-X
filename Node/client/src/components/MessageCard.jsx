import * as S from "../styles/dashboardStyles";

function MessageCard({ contact, index, onOpen, onToggleRead, onDelete, isMobile }) {
  return (
    <div
      style={{ ...S.card, animationDelay: `${index * 0.05}s`, cursor: "pointer" }}
      onClick={() => onOpen(contact)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.opacity = "1";
      }}
    >
      <div style={S.badge(contact.is_read)}>
        <span style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: contact.is_read ? "#999" : "#2563eb"
        }} />
        {contact.is_read ? "Archived" : "New Inquiry"}
      </div>

      <h3 style={S.cardTitle}>{contact.name}</h3>
      <p style={{ fontSize: "13px", color: "#2563eb", fontWeight: "500", marginBottom: "16px" }}>
        {contact.email}
      </p>

      <p style={{
        fontSize: "14px",
        color: "#444",
        lineHeight: "1.6",
        flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>
        {contact.message}
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead(contact.id);
          }}
          style={{...S.buttonPrimary, padding: isMobile ? "12px" : "10px 18px"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "1";
          }}
        >
          {contact.is_read ? "Unread" : "Mark Read"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(contact.id);
          }}
          style={{...S.buttonOutline, padding: isMobile ? "12px" : "10px 18px"}}
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

      <span style={{ fontSize: "11px", color: "#aaa", marginTop: "15px" }}>
        {new Date(contact.created_at).toLocaleDateString()} at{" "}
        {new Date(contact.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

export default MessageCard;