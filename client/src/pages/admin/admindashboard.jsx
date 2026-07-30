import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admindashboard.css";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate, role]);
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("adminName");
    localStorage.removeItem("role");
    navigate("/admin-login");
  }



  const [stats, setStats] = useState({
    totalUsers: 0,
    loggedInUsers: 0,
    blockedUsers: 0,
    totalColleges: 0,
    notProcessed: 0,
    pending: 0,
    closed: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats");
      if (res.data.success && res.data.stats) {
        setStats((prev) => ({ ...prev, ...res.data.stats }));
      }
    } catch (err) {
      console.error("Error fetching admin dashboard stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "REGISTERED USERS",
      value: stats.totalUsers,
      icon: "bi-people-fill",
      color: "primary",
    },
    {
      title: "LOGGED IN USERS",
      value: stats.loggedInUsers,
      icon: "bi-person-check-fill",
      color: "success",
    },
    {
      title: "NOT PROCESSED",
      value: stats.notProcessed,
      icon: "bi-exclamation-circle-fill",
      color: "danger",
    },
    {
      title: "PENDING",
      value: stats.pending,
      icon: "bi-clock-fill",
      color: "warning",
    },
    {
      title: "CLOSED",
      value: stats.closed,
      icon: "bi-check-circle-fill",
      color: "success",
    },
    {
      title: "TOTAL COLLEGES",
      value: stats.totalColleges,
      icon: "bi-bank2",
      color: "secondary",
    },
    {
      title: "BLOCKED USERS",
      value: stats.blockedUsers,
      icon: "bi-slash-circle-fill",
      color: "danger",
    },
  ];

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="Dashboard" />

        <div className="dashboard-container">
          <h2>Dashboard Overview</h2>

          <p>Welcome back, Admin. Here is what is happening today.</p>

          <div className="row g-4">
            {cards.map((item, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div
                  className={`dashboard-card ${item.link ? "clickable" : ""}`}
                  onClick={() => item.link && navigate(item.link)}
                  onKeyDown={(event) => {
                    if (item.link && event.key === "Enter") navigate(item.link);
                  }}
                  role={item.link ? "button" : undefined}
                  tabIndex={item.link ? 0 : undefined}
                >
                  <div className={`icon ${item.color}`}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>

                  <div className="card-info">
                    <h2 className={item.color}>{item.value}</h2>
                    <span>{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
