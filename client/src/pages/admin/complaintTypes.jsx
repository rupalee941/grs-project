import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "./CollegeManagement.css";

const ComplaintTypes = () => {
  const [data, setData] = useState({ name: "", description: "" });
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const fetchComplaintTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaint/show");
      if (res.data.msg === "Data fetched") {
        setComplaintTypes(res.data.Complaint || []);
      }
    } catch (err) {
      console.error("Error fetching complaint types:", err);
    }
  };

  useEffect(() => {
    fetchComplaintTypes();
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
        const res = await axios.put(
          `http://localhost:5000/api/complaint/${editingId}`,
          data
        );
        if (res.data.msg === "Complaint Updated successfully") {
          window.alert("Complaint type updated successfully!");
          setEditingId(null);
          setData({ name: "", description: "" });
          fetchComplaintTypes();
        } else {
          window.alert(res.data.msg || "Failed to update complaint type");
        }
      } else {
        const res = await axios.post("http://localhost:5000/api/complaint/register", data);
        if (res.data.msg === "Complaint registered") {
          window.alert("Complaint type registered successfully!");
          setData({ name: "", description: "" });
          fetchComplaintTypes();
        } else {
          window.alert(res.data.msg || "Failed to register complaint type");
        }
      }
    } catch (err) {
      console.error(err);
      window.alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = (complaintType) => {
    setEditingId(complaintType._id);
    setData({
      name: complaintType.name,
      description: complaintType.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setData({ name: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint type?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/complaint/${id}`);
      if (res.data.msg === "Complaint Deleted ") {
        window.alert("Complaint type deleted successfully!");
        fetchComplaintTypes();
      } else {
        window.alert(res.data.msg || "Failed to delete complaint type");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error deleting complaint type");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await axios.patch(`http://localhost:5000/api/complaint/${id}`, {
        status: newStatus,
      });
      if (res.data.msg === "status updated") {
        fetchComplaintTypes();
      } else {
        window.alert(res.data.msg || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error updating status");
    }
  };

  const filteredComplaintTypes = complaintTypes.filter((type) => {
    const term = searchTerm.toLowerCase();
    return (
      type.name.toLowerCase().includes(term) ||
      type.description.toLowerCase().includes(term)
    );
  });

  const displayedComplaintTypes = filteredComplaintTypes.slice(0, entriesPerPage);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="complaint types" />

        <div className="college-page">
          <section className="college-form-card">
            <h2>{editingId ? "Edit Complaint Type" : "Add Complaint Type"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="college-field">
                <label htmlFor="complaintTypeName">Complaint Type</label>
                <input
                  id="complaintTypeName"
                  name="name"
                  type="text"
                  placeholder="Enter Complaint Type"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="college-field">
                <label htmlFor="complaintDescription">Description</label>
                <textarea
                  id="complaintDescription"
                  name="description"
                  rows="4"
                  placeholder="Enter Complaint Type Description"
                  value={data.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="save-college-btn m-0">
                  {editingId ? "Update Complaint Type" : "Save Complaint"}
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
            <h3>Complaint Types</h3>

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
                    <th>COMPLAINT TYPE</th>
                    <th>DESCRIPTION</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedComplaintTypes.length > 0 ? (
                    displayedComplaintTypes.map((type, index) => (
                      <tr key={type._id}>
                        <td>{index + 1}</td>
                        <td>{type.name}</td>
                        <td>{type.description}</td>
                        <td>
                          <span
                            className={`badge ${type.status === "active" ? "bg-success" : "bg-secondary"}`}
                            style={{ fontSize: "14px" }}
                          >
                            {type.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="edit-btn me-2"
                            onClick={() => handleEdit(type)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            Edit
                          </button>

                          <button
                            type="button"
                            className="edit-btn me-2"
                            style={{
                              borderColor: type.status === "active" ? "#ffc107" : "#198754",
                              color: type.status === "active" ? "#ffc107" : "#198754",
                            }}
                            onClick={() => handleToggleStatus(type._id, type.status)}
                          >
                            <i className={`bi ${type.status === "active" ? "bi-slash-circle" : "bi-check-circle"}`}></i>
                            {type.status === "active" ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(type._id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        No complaint types found
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

export default ComplaintTypes;