import { useState, useEffect } from "react";
import { loginAdmin } from "../services/api";

function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(form);
      localStorage.setItem("token", data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orbs = document.querySelectorAll(".orb");

    orbs.forEach((orb, i) => {
      let x = Math.random() * 50;
      let y = Math.random() * 50;

      let dx = (Math.random() - 0.5) * 0.8;
      let dy = (Math.random() - 0.5) * 0.8;

      function animate() {
        x += dx;
        y += dy;

        if (x > 120 || x < -120) dx *= -1;
        if (y > 120 || y < -120) dy *= -1;

        orb.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      }

      animate();
    });
  }, []);

  return (
    <div style={wrapper}>
      {/* Background Orbs */}
      <div style={bg}>
        <div style={{ ...orb, ...orb1 }} className="orb"></div>
        <div style={{ ...orb, ...orb2 }} className="orb"></div>
        <div style={{ ...orb, ...orb3 }} className="orb"></div>
      </div>

      {/* Login Card */}
      <div style={card}>
        <h2 style={title}>Admin Access</h2>
        <p style={subtitle}>Secure login to dashboard</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{
              ...input,
              boxShadow: "0 0 0 0 rgba(37,99,235,0)",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.2)";
              e.target.style.borderColor = "#2563eb";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "#e5e7eb";
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              ...input,
              boxShadow: "0 0 0 0 rgba(37,99,235,0)",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.2)";
              e.target.style.borderColor = "#2563eb";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "#e5e7eb";
            }}
          />

          <button type="submit"
            style={button}
            disabled={loading}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 20px rgba(37,99,235,0.3)";
            }}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  );
}

/* ===== STYLES (MATCHING YOUR PUBLIC SITE) ===== */

const wrapper = {
  minHeight: "100dvh",   // 🔥 modern fix
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Inter', sans-serif",
  position: "relative",
  overflow: "visible",
  background: "#fff"
};

const bg = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100dvh",
  zIndex: 0,
  overflow: "hidden"
};

const orb = {
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(100px)",
  opacity: 0.4
};

const orb1 = {
  width: "clamp(220px, 35vw, 500px)",
  height: "clamp(220px, 35vw, 500px)",
  background: "#2563eb",
  top: "-10%",
  left: "-10%"
};

const orb2 = {
  width: "clamp(200px, 30vw, 450px)",
  height: "clamp(200px, 30vw, 450px)",
  background: "#9333ea",
  bottom: "-15%",
  right: "-10%"
};

const orb3 = {
  width: "clamp(160px, 25vw, 350px)",
  height: "clamp(160px, 25vw, 350px)",
  background: "#22c55e",
  top: "40%",
  left: "60%"
};

const card = {
  width: "clamp(300px, 92vw, 420px)",
  padding: "clamp(24px, 4vw, 48px)",
  margin: "clamp(16px, 4vw, 32px)",  // 🔥 THIS is what you're missing
  borderRadius: "20px",

  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(25px)",
  WebkitBackdropFilter: "blur(25px)",

  border: "1px solid rgba(255,255,255,0.3)",

  boxShadow: `
    0 25px 60px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.4)
  `,

  textAlign: "center",
  zIndex: 2
};

const title = {
  marginBottom: "10px"
};

const subtitle = {
  color: "#666",
  marginBottom: "25px"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(12px, 3vw, 18px)"
};

const input = {
  padding: "clamp(12px, 2.5vw, 14px)",
  fontSize: "clamp(13px, 2.5vw, 14px)",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  background: "rgba(255,255,255,0.8)",
  transition: "all 0.2s ease",
  outline: "none"
};

const button = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 10px 20px rgba(37,99,235,0.3)"
};

const errorStyle = {
  color: "#ef4444",
  marginTop: "15px"
};

export default AdminLogin;