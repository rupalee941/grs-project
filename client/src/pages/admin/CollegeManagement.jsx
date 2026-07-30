import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "./CollegeManagement.css";
import React,{useState, useEffect} from "react";
import axios from "axios";

const CollegeManagement = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });
  const [colleges, setColleges] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const fetchColleges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/college/show");
      if (res.data.msg === "Data fetched") {
        setColleges(res.data.College || []);
      }
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };

  useEffect(() => {
    fetchColleges();
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
        // Update mode
        const res = await axios.put(
          `http://localhost:5000/api/college/${editingId}`,
          data
        );
        if (res.data.msg === "College Updated successfully") {
          window.alert("College updated successfully!");
          setEditingId(null);
          setData({ name: "", description: "" });
          fetchColleges();
        } else {
          window.alert(res.data.msg || "Failed to update college");
        }
      } else {
        // Register mode
        const res = await axios.post(
          "http://localhost:5000/api/college/register",
          data
        );
        if (res.data.msg === "College registered") {
          window.alert("College registered successfully!");
          setData({ name: "", description: "" });
          fetchColleges();
        } else {
          window.alert(res.data.msg || "Failed to register college");
        }
      }
    } catch (er) {
      console.error(er);
      window.alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = (college) => {
    setEditingId(college._id);
    setData({
      name: college.name,
      description: college.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setData({ name: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/college/${id}`);
      if (res.data.msg === "college Deleted ") {
        window.alert("College deleted successfully!");
        fetchColleges();
      } else {
        window.alert(res.data.msg || "Failed to delete college");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error deleting college");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/college/${id}`,
        { status: newStatus }
      );
      if (res.data.msg === "status updated") {
        fetchColleges();
      } else {
        window.alert(res.data.msg || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error updating status");
    }
  };

  // Filtered colleges list based on search term
  const filteredColleges = colleges.filter((college) => {
    const term = searchTerm.toLowerCase();
    return (
      college.name.toLowerCase().includes(term) ||
      college.description.toLowerCase().includes(term)
    );
  });

  // Limit entries displayed
  const displayedColleges = filteredColleges.slice(0, entriesPerPage);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="college" />

        <div className="college-page">
          <section className="college-form-card">
            <h2>{editingId ? "Edit College" : "Add New College"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="college-field">
                <label htmlFor="collegeName">College Name</label>
                <input
                  id="collegeName"
                  name="name"
                  type="text"
                  placeholder="Enter College Name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="college-field">
                <label htmlFor="collegeDescription">Description</label>
                <textarea
                  id="collegeDescription"
                  name="description"
                  rows="4"
                  placeholder="Enter College Description"
                  value={data.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="save-college-btn m-0">
                  {editingId ? "Update College" : "Save College"}
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
            <h3>Registered Colleges</h3>

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
                    <th>COLLEGE NAME</th>
                    <th>DESCRIPTION</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedColleges.length > 0 ? (
                    displayedColleges.map((college, index) => (
                      <tr key={college._id}>
                        <td>{index + 1}</td>
                        <td>{college.name}</td>
                        <td>{college.description}</td>
                        <td>
                          <span
                            className={`badge ${
                              college.status === "active"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                            style={{ fontSize: "14px" }}
                          >
                            {college.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="edit-btn me-2"
                            onClick={() => handleEdit(college)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            Edit
                          </button>

                          <button
                            type="button"
                            className="edit-btn me-2"
                            style={{
                              borderColor: college.status === "active" ? "#ffc107" : "#198754",
                              color: college.status === "active" ? "#ffc107" : "#198754"
                            }}
                            onClick={() => handleToggleStatus(college._id, college.status)}
                          >
                            <i className={`bi ${college.status === "active" ? "bi-slash-circle" : "bi-check-circle"}`}></i>
                            {college.status === "active" ? "Block" : "Unblock"}
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(college._id)}
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
                        No colleges registered
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

export default CollegeManagement;
