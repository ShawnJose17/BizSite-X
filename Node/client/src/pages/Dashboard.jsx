import { useEffect, useState } from "react";
import { getContacts } from "../services/api";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getContacts()
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/contact/${selectedId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setContacts((prev) => prev.filter((c) => c.id !== selectedId));

    setDeleteModal(false);
    setToast("Message deleted");

    setTimeout(() => setToast(""), 3000);
  };

  const handleToggleRead = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/contact/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });

    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_read: !c.is_read } : c
      )
    );
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "unread") return !contact.is_read;
    if (filter === "read") return contact.is_read;
    return true;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === "oldest")
      return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === "name")
      return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "30px" }}>Asterra</h2>

        {["all", "unread", "read"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              ...sidebarButton,
              backgroundColor:
                filter === type ? "#2563eb" : "transparent",
              color:
                filter === type ? "white" : "#1a1a1a"
            }}
            onMouseEnter={(e) => {
              if (filter !== type)
                e.currentTarget.style.backgroundColor =
                  "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (filter !== type)
                e.currentTarget.style.backgroundColor =
                  "transparent";
            }}
          >
            {type === "all" &&
              `All (${contacts.length})`}
            {type === "unread" &&
              `Unread (${contacts.filter(c => !c.is_read).length})`}
            {type === "read" &&
              `Read (${contacts.filter(c => c.is_read).length})`}
          </button>
        ))}

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={logoutButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={mainContentStyle}>
        <h1 style={{ marginBottom: "25px" }}>Messages</h1>

        {/* Sort */}
        <div style={sortContainer}>
          <span style={{ fontWeight: "500" }}>
            Sort by:
          </span>

          {["newest", "oldest", "name"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              style={{
                ...sortButton,
                backgroundColor:
                  sortBy === type
                    ? "#2563eb"
                    : "#e5e7eb",
                color:
                  sortBy === type
                    ? "white"
                    : "#1a1a1a"
              }}
              onMouseEnter={(e) => {
                if (sortBy !== type)
                  e.currentTarget.style.backgroundColor =
                    "#d1d5db";
              }}
              onMouseLeave={(e) => {
                if (sortBy !== type)
                  e.currentTarget.style.backgroundColor =
                    "#e5e7eb";
              }}
            >
              {type === "newest" && "Newest"}
              {type === "oldest" && "Oldest"}
              {type === "name" && "Name A-Z"}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={cardContainer}>
            {sortedContacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  ...cardStyle,
                  borderLeft: contact.is_read
                    ? "4px solid #e5e7eb"
                    : "4px solid #2563eb",
                  backgroundColor: contact.is_read
                    ? "#ffffff"
                    : "#f0f7ff"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                <h3>{contact.name}</h3>
                <p style={{ color: "#666" }}>
                  {contact.email}
                </p>
                <p style={{ marginTop: "12px" }}>
                  {contact.message}
                </p>

                <div style={actionContainer}>
                  <button
                    onClick={() =>
                      handleToggleRead(contact.id)
                    }
                    style={{
                      ...actionButton,
                      backgroundColor: contact.is_read
                        ? "#f59e0b"
                        : "#10b981"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.05)";
                      e.currentTarget.style.opacity =
                        "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1)";
                      e.currentTarget.style.opacity =
                        "1";
                    }}
                  >
                    {contact.is_read
                      ? "Mark Unread"
                      : "Mark Read"}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedId(contact.id);
                      setDeleteModal(true);
                    }}
                    style={{
                      ...actionButton,
                      backgroundColor: "#ef4444"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.05)";
                      e.currentTarget.style.opacity =
                        "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1)";
                      e.currentTarget.style.opacity =
                        "1";
                    }}
                  >
                    Delete
                  </button>
                </div>

                <small style={dateStyle}>
                  {new Date(
                    contact.created_at
                  ).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
      {deleteModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Delete Message</h3>
            <p>Are you sure you want to delete this message?</p>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button style={cancelBtn} onClick={() => setDeleteModal(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1.05)";
                  e.currentTarget.style.opacity =
                    "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1)";
                  e.currentTarget.style.opacity =
                    "1";
                }}>
                Cancel
              </button>

              <button style={confirmBtn} onClick={confirmDelete}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1.05)";
                  e.currentTarget.style.opacity =
                    "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1)";
                  e.currentTarget.style.opacity =
                    "1";
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}
    </div>
  );
}

/* Layout */

const layoutStyle = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Inter', sans-serif"
};

const sidebarStyle = {
  width: "240px",
  backgroundColor: "#f9fafb",
  borderRight: "1px solid #e5e7eb",
  padding: "30px",
  display: "flex",
  flexDirection: "column"
};

const sidebarButton = {
  marginBottom: "10px",
  padding: "10px",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  borderRadius: "6px",
  transition: "all 0.2s ease"
};

const logoutButton = {
  padding: "10px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  cursor: "pointer",
  width: "100%",
  borderRadius: "6px",
  transition: "all 0.2s ease"
};

const mainContentStyle = {
  flex: 1,
  padding: "40px",
  backgroundColor: "#ffffff",
  overflowY: "auto"
};

const sortContainer = {
  marginBottom: "30px",
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const sortButton = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontWeight: "500"
};

const cardContainer = {
  display: "grid",
  gap: "20px"
};

const cardStyle = {
  padding: "22px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  transition: "all 0.25s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
};

const actionContainer = {
  marginTop: "18px",
  display: "flex",
  gap: "10px"
};

const actionButton = {
  padding: "7px 14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  color: "white",
  transition: "all 0.2s ease",
  fontWeight: "500"
};

const dateStyle = {
  display: "block",
  marginTop: "12px",
  fontSize: "12px",
  color: "#888"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "fadeIn 0.2s ease"
};

const modalBox = {
  backgroundColor: "white",
  padding: "28px",
  borderRadius: "10px",
  width: "320px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
};

const cancelBtn = {
  flex: 1,
  padding: "8px",
  border: "1px solid #e5e7eb",
  background: "white",
  borderRadius: "6px",
  cursor: "pointer"
};



const confirmBtn = {
  flex: 1,
  padding: "8px",
  border: "none",
  backgroundColor: "#ef4444",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer"
};

const toastStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  backgroundColor: "#111827",
  color: "white",
  padding: "12px 18px",
  borderRadius: "8px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
};

export default Dashboard;