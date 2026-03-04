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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Something went wrong while deleting.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleToggleRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/contact/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();

      setContacts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_read: data.is_read } : c
        )
      );
    } catch (err) {
      alert("Failed to update read status.");
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "unread") return !contact.is_read;
    if (filter === "read") return contact.is_read;
    return true;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
      
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")} style={{ marginRight: "10px" }}>
          All ({contacts.length})
        </button>

        <button onClick={() => setFilter("unread")} style={{ marginRight: "10px" }}>
          Unread ({contacts.filter(c => !c.is_read).length})
        </button>

        <button onClick={() => setFilter("read")}>
          Read ({contacts.filter(c => c.is_read).length})
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Sort:</label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "800px"
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>IP</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.map((contact) => (
                <tr
                  key={contact.id}
                  style={{
                    backgroundColor: contact.is_read ? "#fff" : "#f0f8ff",
                    fontWeight: contact.is_read ? "normal" : "bold"
                  }}
                >
                  <td style={tdStyle}>{contact.id}</td>
                  <td style={tdStyle}>{contact.name}</td>
                  <td style={tdStyle}>{contact.email}</td>
                  <td
                    style={{
                      ...tdStyle,
                      maxWidth: "300px",
                      wordBreak: "break-word"
                    }}
                  >
                    {contact.message}
                  </td>
                  <td style={tdStyle}>{contact.ip_address}</td>
                  <td style={tdStyle}>
                    {new Date(contact.created_at).toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleToggleRead(contact.id)}
                      style={{
                        marginRight: "8px",
                        padding: "6px 12px",
                        cursor: "pointer"
                      }}
                    >
                      {contact.is_read ? "Mark Unread" : "Mark Read"}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(contact.id)}
                      style={{
                        padding: "6px 12px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f5f5f5",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px"
};

export default Dashboard;