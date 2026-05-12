const BASE_URL = import.meta.env.VITE_API_URL;

export const loginAdmin = async (data) => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
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

export const getContacts = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/contact`, {
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

export const getDashboardData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`/dashboard-data`, {
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