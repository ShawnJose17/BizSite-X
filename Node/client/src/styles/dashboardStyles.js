export const layout = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Inter', sans-serif",
  background: "#fff",
  overflow: "visible",
  position: "relative",
  flexDirection: "row" // default
};

/* THE SOFT BACKGROUND ORBS */
export const bg = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  overflow: "hidden"
};

export const orb = {
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(120px)",
  opacity: 0.25, // Subtle for dashboard
};

/* GLASS SIDEBAR */
export const sidebar = {
  width: "280px",
  padding: "40px 24px",
  display: "flex",
  flexDirection: "column",
  background: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  borderRight: "1px solid rgba(0,0,0,0.05)",
  zIndex: 10,
  transition: "all 0.4s ease"
};

export const sidebarTitle = {
  fontSize: "24px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  marginBottom: "40px",
  color: "#1a1a1a"
};

export const sidebarButton = {
  padding: "12px 16px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  marginBottom: "8px",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "left",
  transition: "all 0.2s ease",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

/* MAIN CONTENT AREA */
export const main = {
  flex: 1,
  padding: "clamp(20px, 5vw, 60px)",
  overflowY: "auto",
  zIndex: 5,
  position: "relative"
};

/* TOP HEADER & SEARCH */
export const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "40px",
  flexWrap: "wrap",
  gap: "20px"
};

export const searchInput = {
  padding: "12px 20px",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.7)",
  width: "300px",
  fontSize: "14px",
  outline: "none",
  backdropFilter: "blur(10px)",
  transition: "all 0.25s ease"
};

/* CARD DESIGN */
export const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: "24px"
};

export const card = {
  padding: "28px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
  animation: "fadeInUp 0.6s ease forwards"
};

export const badge = (isRead) => ({
  padding: "4px 12px",
  borderRadius: "50px",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  width: "fit-content",
  marginBottom: "16px",
  background: isRead ? "rgba(0,0,0,0.05)" : "rgba(37,99,235,0.1)",
  color: isRead ? "#666" : "#2563eb",
});

export const cardTitle = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "4px",
  color: "#111"
};

/* ACTIONS & BUTTONS */
export const buttonPrimary = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
  transition: "0.2s"
};

export const buttonOutline = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "transparent",
  color: "#111",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
  transition: "0.2s"
};

export const logoutButton = {
  padding: "10px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  width: "100%",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

export const badgeStyle = {
  background: "#2563eb",
  color: "white",
  borderRadius: "1000px",
  padding: "2px 0 2px 0",
  marginLeft: "15px",
  fontSize: "12px",
  fontWeight: "600",
  minWidth: "19.7px",
  textAlign: "center"
};

export const modalOverlay = {
  position: "fixed",   // 🔥 MUST be fixed
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999   // higher than EVERYTHING
};