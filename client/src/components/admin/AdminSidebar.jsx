import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const complaintLinks = [
  {
    path: "/admin/complaints/all",
    label: "All Complaints",
    icon: "bi-list-ul",
  },
  {
    path: "/admin/complaints/pending",
    label: "Pending",
    icon: "bi-clock",
  },
  {
    path: "/admin/complaints/not-processed",
    label: "Not Processed",
    icon: "bi-exclamation-circle",
  },
  {
    path: "/admin/complaints/closed",
    label: "Closed",
    icon: "bi-check-circle",
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const isComplaintsSection = location.pathname.startsWith("/admin/complaints");
  const [complaintsOpen, setComplaintsOpen] = useState(isComplaintsSection);
  const navigate = useNavigate();

  useEffect(() => {
    if (isComplaintsSection) {
      setComplaintsOpen(true);
    }
  }, [isComplaintsSection]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  return (
    <div className="sidebar">
      <div>
        <div className="logo-section">
          <div className="logo-box">
            <i className="bi bi-bank"></i>
          </div>

          <div>
            <h5>LNM University</h5>
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="menu-title">MAIN</div>

        <ul className="menu">
          <Link to="/admin/dashboard" className="menu-link">
            <li className={isActive("/admin/dashboard") ? "active" : ""}>
              <i className="bi bi-speedometer2"></i>
              Dashboard
            </li>
          </Link>

          <div className="menu-title">MANAGEMENT</div>

          <Link to="/admin/college-management" className="menu-link">
            <li className={isActive("/admin/college-management") ? "active" : ""}>
              <i className="bi bi-bank"></i>
              College Management
            </li>
          </Link>

          <Link to="/admin/session-management" className="menu-link">
            <li className={isActive("/admin/session-management") ? "active" : ""}>
              <i className="bi bi-calendar-event"></i>
              Session Management
            </li>
          </Link>

          <Link to="/admin/complaint-types" className="menu-link">
            <li className={isActive("/admin/complaint-types") ? "active" : ""}>
              <i className="bi bi-tags"></i>
              Complaint Types
            </li>
          </Link>

          <li
            className={`menu-dropdown ${isComplaintsSection ? "active" : ""}`}
            onClick={() => setComplaintsOpen((open) => !open)}
          >
            <i className="bi bi-file-earmark-text"></i>
            Complaints
            <i
              className={`bi bi-chevron-${complaintsOpen ? "down" : "right"} ms-auto`}
            ></i>
          </li>

          {complaintsOpen && (
            <ul className="submenu">
              {complaintLinks.map((item) => (
                <Link key={item.path} to={item.path} className="menu-link">
                  <li className={isActive(item.path) ? "active" : ""}>
                    <i className={`bi ${item.icon}`}></i>
                    {item.label}
                  </li>
                </Link>
              ))}
            </ul>
          )}

          <div className="menu-title">USERS</div>

          <Link to="/admin/user-management" className="menu-link">
            <li className={isActive("/admin/user-management") ? "active" : ""}>
              <i className="bi bi-people-fill"></i>
              User Management
            </li>
          </Link>

          <Link to="/admin/blocked-users" className="menu-link">
            <li className={isActive("/admin/blocked-users") ? "active" : ""}>
              <i className="bi bi-slash-circle"></i>
              Blocked Users
            </li>
          </Link>

          <div className="menu-title">COMMUNITY</div>

          <Link to="/admin/discussion-forum" className="menu-link">
            <li className={isActive("/admin/discussion-forum") ? "active" : ""}>
              <i className="bi bi-chat-left-dots"></i>
              Discussion Forum
            </li>
          </Link>

          <div className="menu-title">ACCOUNT</div>

          <Link to="/admin/change-password" className="menu-link">
            <li className={isActive("/admin/change-password") ? "active" : ""}>
              <i className="bi bi-lock"></i>
              Change Password
            </li>
          </Link>
        </ul>
      </div>

      <div className="logout" onClick={handleLogout} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleLogout()}>
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </div>
    </div>
  );
};

export default AdminSidebar;
