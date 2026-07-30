import { useEffect, useState } from "react";

const AdminTopbar = ({ breadcrumb }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <nav className="topbar">
      <div className="left">
        <button className="menu-btn" type="button">
          <i className="bi bi-list"></i>
        </button>

        <div className="page-title">
          <strong>Admin Panel</strong>
          <span> / {breadcrumb}</span>
        </div>
      </div>

      <div className="right">
        <div className="time">
          <h6>{formattedTime}</h6>
          <small>{formattedDate}</small>
        </div>

        <div className="profile">
          <i className="bi bi-person-fill"></i>
        </div>
      </div>
    </nav>
  );
};

export default AdminTopbar;
