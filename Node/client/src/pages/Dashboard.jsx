import { useEffect, useState } from "react";
import { getDashboardData } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    getDashboardData()
      .then(setData)
      .catch((err) => {
        console.error(err.message);
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      {data ? (
        <>
          <p>{data.message}</p>
          <p>Admin ID: {data.adminId}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;