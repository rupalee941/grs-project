import React, { useEffect, useState } from "react";
import axios from "axios";
import "./userdashboard.css";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";

const UserDashboard = () => {
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    closed: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const email = savedUser.email;
      if (!email) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/complaints?email=${email}`);
        if (res.data.complaints) {
          const list = res.data.complaints;
          const total = list.length;
          const pending = list.filter((c) => c.status === "pending" || c.status === "not-processed").length;
          const closed = list.filter((c) => c.status === "closed").length;
          setStats((prev) => ({ ...prev, total, pending, closed }));
        }
      } catch (err) {
        console.error("Error fetching user dashboard stats:", err);
      }
    };

    fetchCounts();
  }, [savedUser.email]);

  const cards = [
    {
      badgeText: "User's",
      badgeCount: stats.total,
      title: "My Complaints",
      icon: "bi-people-fill",
      link: "/user/my-complaints",
    },
    {
      badgeText: "Pending",
      badgeCount: stats.pending,
      title: "Pending Complaints",
      icon: "bi-clock",
      link: "/user/pending",
    },
    {
      badgeText: "Closed Comp.",
      badgeCount: stats.closed,
      title: "Closed Complaints",
      icon: "bi-exclamation-circle-fill",
      link: "/user/closed",
    },
  ];

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content Area */}
      <div className="content">
        {/* Topbar */}
        <UserTopbar />

        {/* Dashboard Grid Container */}
        <div className="student-dashboard-container">
          <div className="cards-wrapper">
            {cards.map((card, index) => (
              <div className="student-card" key={index}>
                {/* Custom Badge at Top */}
                <div className="card-badge">
                  <span className="badge-text">{card.badgeText}</span>
                  <span className="badge-count">{card.badgeCount}</span>
                </div>

                {/* Card Title */}
                <h3>{card.title}</h3>

                {/* Pink/Magenta Icon */}
                <div className="card-icon-container">
                  <i className={`bi ${card.icon}`}></i>
                </div>

                {/* Teal Check Button */}
                <button
                  className="check-btn"
                  onClick={() => (window.location.href = card.link)}
                >
                  Check
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
