import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import "../admin/CollegeManagement.css";

const UserComplaints = ({ status = "all" }) => {
  const [email, setEmail] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return localStorage.getItem("grsUserEmail") || savedUser.email || "";
  });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const statusLabel =
    status === "pending"
      ? "Pending Complaints"
      : status === "closed"
      ? "Closed Complaints"
      : "My Complaints";

  const fetchComplaints = async (userEmail) => {
    if (!userEmail) {
      setComplaints([]);
      return;
    }

    setLoading(true);
    try {
      const params = { email: userEmail };
      if (status === "pending") {
        params.status = "pending,not-processed";
      } else if (status !== "all") {
        params.status = status;
      }
      const res = await axios.get("http://localhost:5000/api/complaints", { params });
      if (res.data.msg === "Data fetched") {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error(err);
      window.alert("Error loading complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchComplaints(email);
    }
  }, [email, status]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      window.alert("Enter your email to load complaint history.");
      return;
    }
    localStorage.setItem("grsUserEmail", email);
    fetchComplaints(email);
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const term = searchTerm.toLowerCase();
    return (
      complaint.complaintTypeName.toLowerCase().includes(term) ||
      complaint.description.toLowerCase().includes(term) ||
      complaint.userName.toLowerCase().includes(term) ||
      complaint.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="student-dashboard">
      <UserSidebar />

      <div className="content">
        <UserTopbar />

        <div className="college-page">
          <section className="registered-colleges">
            <h3>{statusLabel}</h3>

            <div className="table-controls">
              <div className="entries-control">
                <form onSubmit={handleEmailSubmit} className="d-flex gap-2 align-items-center">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="save-college-btn">
                    Load
                  </button>
                </form>
              </div>

              <input
                type="search"
                placeholder="Search records..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="table-responsive">
              <table className="college-table">
                <thead>
                  <tr>
                    <th>S NO.</th>
                    <th>COMPLAINT TYPE</th>
                    <th>DESCRIPTION</th>
                    <th>STATUS</th>
                    <th>SUBMITTED ON</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        Loading complaints...
                      </td>
                    </tr>
                  ) : filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        {email ? "No complaints found." : "Enter your email and click Load to view your complaints."}
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint, index) => (
                      <tr key={complaint._id}>
                        <td>{index + 1}</td>
                        <td>{complaint.complaintTypeName}</td>
                        <td>{complaint.description}</td>
                        <td>
                          <span
                            className={`badge ${
                              complaint.status === "closed"
                                ? "bg-success"
                                : complaint.status === "pending"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }`}
                            style={{ fontSize: "14px" }}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
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

export default UserComplaints;
