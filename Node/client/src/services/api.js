const API_BASE = "http://localhost:3000";

export const loginAdmin = async (data) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Login failed");
  }

  return result;
};

export const getDashboardData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`${API_BASE}/admin/dashboard-data`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch dashboard data");
  }

  return data;
};

export const getContacts = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch("http://localhost:3000/contact", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch contacts");
  }

  return data;
};