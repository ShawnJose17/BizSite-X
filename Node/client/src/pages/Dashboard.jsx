import { useEffect, useState } from "react";
import { getContacts } from "../services/api";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleRead = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/contact/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
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

        <button
          onClick={() => setFilter("all")}
          style={{
            ...sidebarButton,
            backgroundColor: filter === "all" ? "#2563eb" : "transparent",
            color: filter === "all" ? "white" : "#1a1a1a"
          }}
        >
          All ({contacts.length})
        </button>

        <button
          onClick={() => setFilter("unread")}
          style={{
            ...sidebarButton,
            backgroundColor: filter === "unread" ? "#2563eb" : "transparent",
            color: filter === "unread" ? "white" : "#1a1a1a"
          }}
        >
          Unread ({contacts.filter(c => !c.is_read).length})
        </button>

        <button
          onClick={() => setFilter("read")}
          style={{
            ...sidebarButton,
            backgroundColor: filter === "read" ? "#2563eb" : "transparent",
            color: filter === "read" ? "white" : "#1a1a1a"
          }}
        >
          Read ({contacts.filter(c => c.is_read).length})
        </button>

        <div style={{ marginTop: "auto" }}>
          <button onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <h1 style={{ marginBottom: "25px" }}>Messages</h1>

        {/* Modern Sort Controls */}
        <div style={sortContainer}>
          <span style={{ fontWeight: "500" }}>Sort by:</span>

          {["newest", "oldest", "name"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              style={{
                ...sortButton,
                backgroundColor:
                  sortBy === type ? "#2563eb" : "#e5e7eb",
                color: sortBy === type ? "white" : "#1a1a1a"
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
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                <h3>{contact.name}</h3>
                <p style={{ color: "#666" }}>{contact.email}</p>
                <p style={{ marginTop: "10px" }}>{contact.message}</p>

                {/* Action Buttons */}
                <div style={actionContainer}>
                  <button
                    onClick={() => handleToggleRead(contact.id)}
                    style={{
                      ...actionButton,
                      backgroundColor: contact.is_read
                        ? "#f59e0b"
                        : "#10b981"
                    }}
                  >
                    {contact.is_read ? "Mark Unread" : "Mark Read"}
                  </button>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    style={{
                      ...actionButton,
                      backgroundColor: "#ef4444"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.85";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Delete
                  </button>
                </div>

                <small style={dateStyle}>
                  {new Date(contact.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
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
  borderRadius: "6px"
};

const logoutButton = {
  padding: "10px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  cursor: "pointer",
  width: "100%",
  borderRadius: "6px"
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
  marginTop: "15px",
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
  marginTop: "10px",
  fontSize: "12px",
  color: "#888"
};

export default Dashboard;