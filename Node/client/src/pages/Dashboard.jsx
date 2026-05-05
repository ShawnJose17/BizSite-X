import { useEffect, useState, useMemo } from "react";
import { getContacts } from "../services/api";
import * as S from "../styles/dashboardStyles";
import MessageCard from "../components/MessageCard";
import MessageModal from "../components/MessageModal";
import DeleteModal from "../components/DeleteModal";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // Pagination
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // run once
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      setToast("Message Deleted");

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
    <div style={{ ...S.layout, flexDirection: isMobile ? "column" : "row"}}>

      {/* 1. BACKGROUND ORBS (System DNA) */}
      <div style={S.bg}>
        <div style={{ ...S.orb, width: '600px', height: '600px', background: '#2563eb', top: '-10%', left: '-5%' }}></div>
        <div style={{ ...S.orb, width: '500px', height: '500px', background: '#9333ea', bottom: '-10%', right: '-5%' }}></div>
      </div>

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 9998
          }}
        />
      )}

      {/* 2. GLASS SIDEBAR */}
      <div
        style={{
          ...S.sidebar,
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: isMobile ? (sidebarOpen ? "0" : "-100%") : "0",
          height: isMobile ? "100vh" : "auto",
          width: isMobile ? "260px" : "280px",
          zIndex: 9999,
          transition: "left 0.3s ease",
          boxShadow: isMobile ? "0 0 20px rgba(0,0,0,0.2)" : "none"
        }}
      >

        <h2 style={S.sidebarTitle}>Asterra</h2>
        
        <nav style={{ flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "column",
          gap: isMobile ? "8px" : "0" }}>
          {["all", "unread", "read"].map((type) => (
            <button
              key={type}
              onClick={() => { setFilter(type); setVisibleCount(6); if (isMobile) setSidebarOpen(false); }}
              style={{
                ...S.sidebarButton,
                minWidth: isMobile ? "120px" : "auto",
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

        <button
          onClick={handleLogout}
          style={{...S.logoutButton, marginTop: "20px", bottom: "20px", position: "sticky"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "1";
          }}>
            Logout
        </button>
      </div>

      {/* 3. MAIN CONTENT */}
      <div style={S.main}>
        <header style={{
          ...S.topBar,
          position: "relative",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "flex-start"
        }}>

          {/* HAMBURGER (LEFT FIXED) */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: "absolute",
                left: "10px",
                top: "40px",
                fontSize: "22px",
                background: "transparent",
                border: "none",
                cursor: "pointer"
              }}
            >
              ☰
            </button>
          )}

          {/* TITLE (CENTERED) */}
          <div style={{
            width: "100%",
            textAlign: isMobile ? "center" : "left"
          }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Messages</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Real-time message management
            </p>
          </div>
          
          <input 
            type="text" 
            placeholder="Search messages" 
            style={{
              ...S.searchInput,
              width: isMobile ? "85%" : "300px",
              maxWidth: isMobile ? "340px" : "300px",
              alignSelf: isMobile ? "center" : "auto"
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => {
              e.target.style.border = "1px solid #2563eb";
              e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(0,0,0,0.08)";
              e.target.style.boxShadow = "none";
            }}
          />
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>Initializing Dashboard...</div>
        ) : (
          <>
            <div style={{...S.grid,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))"}}>
              {processedContacts.slice(0, visibleCount).map((contact, index) => (
                <MessageCard
                  key={contact.id}
                  contact={contact}
                  index={index}
                  onOpen={openMessage}
                  onToggleRead={handleToggleRead}
                  onDelete={(id) => {
                    setSelectedId(id);
                    setDeleteModal(true);
                  }}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {/* 4. PAGINATION / LOAD MORE */}
            {processedContacts.length > visibleCount && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)} 
                  style={{ ...S.buttonOutline, padding: '12px 40px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Load More Messages
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* DELETE MODAL (Glassmorphism style) */}
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <MessageModal
        message={activeMessage}
        onClose={() => setActiveMessage(null)}
        onDelete={(id) => {
          setSelectedId(id);
          setActiveMessage(null);
          setDeleteModal(true);
        }}
      />

      <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      `}
      </style>

      <style>{`
        .form-toast {
          position: fixed;
          top: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(-100px);
          padding: 16px 24px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          z-index: 99999;
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s;
        }

        .form-toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .form-toast.success {
          background: #10b981;
          color: #fff;
          box-shadow: 0 10px 25px rgba(16,185,129,0.3);
        }

        .form-toast.error {
          background: #ef4444;
          color: #fff;
          box-shadow: 0 10px 25px rgba(239,68,68,0.3);
        }

        .toast-icon {
          flex: 0 0 28px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}
      </style>

      {toast && (
        <div className={`form-toast ${toast.includes("failed") ? "error" : "success"} show`}>
          <div className="toast-icon">
            {toast.includes("failed") ? "✕" : "✓"}
          </div>
          <span>{toast}</span>
        </div>
      )}
      
    </div>
  );
}

export default Dashboard;