import { useEffect, useState, useMemo } from "react";
import { getContacts } from "../services/api";
import * as S from "../styles/dashboardStyles";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // Pagination
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

  // --- Search & Filter Logic ---
  const processedContacts = useMemo(() => {
    return contacts
      .filter(c => {
        const matchesFilter = filter === "unread" ? !c.is_read : filter === "read" ? c.is_read : true;
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [contacts, filter, searchTerm]);

  const handleToggleRead = async (id) => {
    const token = localStorage.getItem("token");
    setContacts(prev => prev.map(c => c.id === id ? { ...c, is_read: !c.is_read } : c));
    
    await fetch(`http://localhost:3000/contact/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/contact/${selectedId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setContacts((prev) => prev.filter((c) => c.id !== selectedId));

      setDeleteModal(false);
      setToast("Message deleted");

      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error(err);
      setToast("Delete failed");
    }
  };

  const [activeMessage, setActiveMessage] = useState(null);

  const openMessage = async (contact) => {
    setActiveMessage(contact);

    // Only update if it's unread
    if (!contact.is_read) {
      const token = localStorage.getItem("token");

      // Optimistic UI update
      setContacts(prev =>
        prev.map(c =>
          c.id === contact.id ? { ...c, is_read: true } : c
        )
      );

      try {
        await fetch(`http://localhost:3000/contact/${contact.id}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to mark as read");
      }
    }
  };

  return (
    <div style={S.layout}>
      {/* 1. BACKGROUND ORBS (System DNA) */}
      <div style={S.bg}>
        <div style={{ ...S.orb, width: '600px', height: '600px', background: '#2563eb', top: '-10%', left: '-5%' }}></div>
        <div style={{ ...S.orb, width: '500px', height: '500px', background: '#9333ea', bottom: '-10%', right: '-5%' }}></div>
      </div>

      {/* 2. GLASS SIDEBAR */}
      <div style={S.sidebar}>
        <h2 style={S.sidebarTitle}>Asterra</h2>
        
        <nav style={{ flex: 1 }}>
          {["all", "unread", "read"].map((type) => (
            <button
              key={type}
              onClick={() => { setFilter(type); setVisibleCount(6); }}
              style={{
                ...S.sidebarButton,
                background: filter === type ? "rgba(37,99,235,0.1)" : "transparent",
                color: filter === type ? "#2563eb" : "#555"
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
              <span style={S.badgeStyle}>
                {contacts.filter(c => type === 'all' ? true : type === 'unread' ? !c.is_read : c.is_read).length}
              </span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={S.logoutButton} onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.opacity = "0.9";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "1";
  }}>Logout</button>
      </div>

      {/* 3. MAIN CONTENT */}
      <div style={S.main}>
        <header style={S.topBar}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Messages</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Real-time message management</p>
          </div>
          
          <input 
            type="text" 
            placeholder="Search messages..." 
            style={S.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>Initializing Dashboard...</div>
        ) : (
          <>
            <div style={S.grid}>
              {processedContacts.slice(0, visibleCount).map((contact, index) => (
                <div key={contact.id} style={{ ...S.card, animationDelay: `${index * 0.05}s`, cursor: 'pointer'}} onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.opacity = "0.9";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "1";
  }}>
                  <div style={S.badge(contact.is_read)}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: contact.is_read ? '#999' : '#2563eb' }}></span>
                    {contact.is_read ? "Archived" : "New Inquiry"}
                  </div>
                  
                  <h3 style={S.cardTitle}>{contact.name}</h3>
                  <p style={{ fontSize: '13px', color: '#2563eb', fontWeight: '500', marginBottom: '16px' }}>{contact.email}</p>
                  
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#444",
                      lineHeight: "1.6",
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      cursor: "pointer"
                    }}
                    onClick={() => openMessage(contact)}
                  >
                    {contact.message}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                    <button onClick={() => handleToggleRead(contact.id)} style={S.buttonPrimary} onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.opacity = "0.9";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "1";
  }}>
                      {contact.is_read ? "Unread" : "Mark Read"}
                    </button>
                    <button onClick={() => { setSelectedId(contact.id); setDeleteModal(true); }} style={S.buttonOutline} onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.opacity = "0.9";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "1";
  }}>
                      Delete
                    </button>
                  </div>
                  
                  <span style={{ fontSize: '11px', color: '#aaa', marginTop: '15px' }}>
                    {new Date(contact.created_at).toLocaleDateString()} at {new Date(contact.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
            </div>

            {/* 4. PAGINATION / LOAD MORE */}
            {processedContacts.length > visibleCount && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)} 
                  style={{ ...S.buttonOutline, padding: '12px 40px' }}
                >
                  Load More Messages
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* DELETE MODAL (Glassmorphism style) */}
      {deleteModal && (
        <div
          style={{
            ...S.modalOverlay,
            backdropFilter: "blur(10px)",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div
            style={{
              ...S.card,
              width: "360px",
              textAlign: "center",
              animation: "scaleIn 0.2s ease"
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Remove Inquiry?</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...S.buttonOutline, flex: 1 }}
                onClick={() => setDeleteModal(false)}
                onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.opacity = "0.9";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "1";
  }}
              >
                Cancel
              </button>

              <button
                style={{ ...S.buttonPrimary, background: "#ef4444", flex: 1 }}
                onClick={confirmDelete}
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
        
      )}

      {activeMessage && (
        <div
          style={{
            ...S.modalOverlay,
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setActiveMessage(null)}
        >
          <div
            style={{
              ...S.card,
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              textAlign: "left",
              animation: "scaleIn 0.25s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ marginBottom: "4px" }}>{activeMessage.name}</h2>
              <p style={{ color: "#2563eb", fontSize: "14px" }}>
                {activeMessage.email}
              </p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                {new Date(activeMessage.created_at).toLocaleString()}
              </p>
            </div>

            <div
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#333",
                marginBottom: "24px",
                whiteSpace: "pre-wrap"
              }}
            >
              {activeMessage.message}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>

              <button
                style={{ ...S.buttonOutline, color: "#ffffff", backgroundColor: "#ef4444", flex: 0.5, display: "block", margin: "0 auto"}}
                onClick={() => {
                  setSelectedId(activeMessage.id);
                  setActiveMessage(null);
                  setDeleteModal(true);
                }}
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
      )}

      <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      `}</style>
      
    </div>
  );
}

export default Dashboard;