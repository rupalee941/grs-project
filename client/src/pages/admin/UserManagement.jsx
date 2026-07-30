import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "./CollegeManagement.css";

const userColumns = [
  "S NO.",
  "NAME",
  "FATHER NAME",
  "GENDER",
  "EMAIL",
  "MOBILE",
  "COURSE",
  "ENROLLMENT",
  "ADDRESS",
  "COLLEGE",
  "STATUS",
  "ACTIONS",
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user");
      if (res.data.user) {
        setUsers(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/user/${id}`);
      if (res.data.msg === "User deleted") {
        window.alert("User deleted successfully!");
        fetchUsers();
      } else {
        window.alert(res.data.msg || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error deleting user");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await axios.patch(`http://localhost:5000/api/user/${id}`, {
        status: newStatus,
      });
      if (res.data.msg === "status updated") {
        fetchUsers();
      } else {
        window.alert(res.data.msg || "Failed to update user status");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error updating user status");
    }
  };

  const activeCount = users.filter((user) => user.status === "active").length;
  const inactiveCount = users.filter((user) => user.status === "inactive").length;
  const totalCount = activeCount + inactiveCount;

  const filteredUsers = users.filter((user) => {
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false;
    }

    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.father?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.mobile?.toLowerCase().includes(term) ||
      user.course?.toLowerCase().includes(term) ||
      user.enrollment?.toLowerCase().includes(term) ||
      user.address?.toLowerCase().includes(term) ||
      user.collegeId?.name?.toLowerCase().includes(term)
    );
  });

  const displayedUsers = filteredUsers.slice(0, entriesPerPage);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="users" />

        <div className="college-page">
          <section className="status-summary">
            <div className="status-card">
              <h4>Total Students</h4>
              <p>{totalCount}</p>
            </div>
            <div className="status-card">
              <h4>Active Students</h4>
              <p>{activeCount}</p>
            </div>
            <div className="status-card">
              <h4>Inactive Students</h4>
              <p>{inactiveCount}</p>
            </div>
          </section>

          <section className="registered-colleges">
            <h3>User Log Management</h3>

            <div className="table-controls">
              <div className="entries-control">
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>entries per page</span>
              </div>

              <div className="table-search-and-filter">
                <input
                  type="search"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="status-filter-buttons">
                  {['all', 'active', 'inactive'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`filter-button ${statusFilter === status ? 'active' : ''}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="college-table">
                <thead>
                  <tr>
                    {userColumns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.father}</td>
                        <td>{user.gender}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.course}</td>
                        <td>{user.enrollment}</td>
                        <td>{user.address}</td>
                        <td>{user.collegeId?.name || "-"}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.status === "active" ? "bg-success" : "bg-secondary"
                            }`}
                            style={{ fontSize: "14px" }}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="edit-btn me-2"
                            style={{
                              borderColor: user.status === "active" ? "#ffc107" : "#198754",
                              color: user.status === "active" ? "#ffc107" : "#198754",
                            }}
                            onClick={() => handleToggleStatus(user._id, user.status)}
                          >
                            <i className={`bi ${user.status === "active" ? "bi-slash-circle" : "bi-check-circle"}`}></i>
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(user._id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={userColumns.length} className="empty-table-cell">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Showing {displayedUsers.length > 0 ? 1 : 0} to {displayedUsers.length} of {filteredUsers.length} entries
              </span>

              <div className="pagination">
                <button type="button" className="page-btn" disabled>
                  &laquo;
                </button>
                <button type="button" className="page-btn" disabled>
                  &lsaquo;
                </button>
                <button type="button" className="page-btn active">
                  1
                </button>
                <button type="button" className="page-btn" disabled>
                  &rsaquo;
                </button>
                <button type="button" className="page-btn" disabled>
                  &raquo;
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
