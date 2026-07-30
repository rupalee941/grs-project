import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "./CollegeManagement.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const SessionManagement = () => {
  const [data, setData] = useState({ name: "" });
  const [sessions, setSessions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/session/show");
      if (res.data.msg === "Data fetched") {
        setSessions(res.data.Session || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/session/${editingId}`, data);
        if (res.data.msg === "Session Updated successfully") {
          window.alert("Session updated successfully!");
          setEditingId(null);
          setData({ name: "" });
          fetchSessions();
        } else {
          window.alert(res.data.msg || "Failed to update session");
        }
      } else {
        const res = await axios.post("http://localhost:5000/api/session/register", data);
        if (res.data.msg === "Session registered") {
          window.alert("Session registered successfully!");
          setData({ name: "" });
          fetchSessions();
        } else {
          window.alert(res.data.msg || "Failed to register session");
        }
      }
    } catch (err) {
      console.error(err);
      window.alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = (session) => {
    setEditingId(session._id);
    setData({ name: session.name });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setData({ name: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/session/${id}`);
      if (res.data.msg === "session Deleted ") {
        window.alert("Session deleted successfully!");
        fetchSessions();
      } else {
        window.alert(res.data.msg || "Failed to delete session");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error deleting session");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await axios.patch(`http://localhost:5000/api/session/${id}`, {
        status: newStatus,
      });

      if (res.data.msg === "status updated") {
        fetchSessions();
      } else {
        window.alert(res.data.msg || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error updating status");
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const term = searchTerm.toLowerCase();
    return session.name.toLowerCase().includes(term);
  });

  const displayedSessions = filteredSessions.slice(0, entriesPerPage);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="session" />

        <div className="college-page">
          <section className="college-form-card">
            <h2>{editingId ? "Edit Session" : "Add New Session"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="college-field">
                <label htmlFor="sessionValue">Session Value</label>
                <input
                  id="sessionValue"
                  name="name"
                  type="text"
                  placeholder="Enter Session (e.g. 2023-2026)"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="save-college-btn m-0">
                  {editingId ? "Update Session" : "Save Session"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    style={{ borderRadius: "28px", fontSize: "20px", fontWeight: "800" }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="registered-colleges">
            <h3>Registered Sessions</h3>

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

              <input
                type="search"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="college-table">
                <thead>
                  <tr>
                    <th>S NO.</th>
                    <th>SESSION</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedSessions.length > 0 ? (
                    displayedSessions.map((session, index) => (
                      <tr key={session._id}>
                        <td>{index + 1}</td>
                        <td>{session.name}</td>
                        <td>
                          <span
                            className={`badge ${session.status === "active" ? "bg-success" : "bg-secondary"}`}
                            style={{ fontSize: "14px" }}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="edit-btn me-2"
                            onClick={() => handleEdit(session)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            Edit
                          </button>

                          <button
                            type="button"
                            className="edit-btn me-2"
                            style={{
                              borderColor: session.status === "active" ? "#ffc107" : "#198754",
                              color: session.status === "active" ? "#ffc107" : "#198754",
                            }}
                            onClick={() => handleToggleStatus(session._id, session.status)}
                          >
                            <i className={`bi ${session.status === "active" ? "bi-slash-circle" : "bi-check-circle"}`}></i>
                            {session.status === "active" ? "Block" : "Unblock"}
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(session._id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table-cell">
                        No sessions registered
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
