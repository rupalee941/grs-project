import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import "./AddComplaint.css";

const AddComplaint = () => {
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    complaintType: "",
    description: "",
  });
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/complaint/active");
        if (res.data.msg === "Complaint fetched") {
          setComplaintTypes(res.data.Complaint || []);
        }
      } catch (err) {
        console.error("Error fetching complaint types:", err);
      }
    };

    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.name || !user.email) {
      window.alert("Please register or sign in before submitting a complaint.");
      return;
    }

    if (!form.complaintType || !form.description) {
      window.alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/complaints/register", {
        userName: user.name,
        userEmail: user.email,
        mobile: user.mobile || "",
        complaintType: form.complaintType,
        description: form.description,
      });

      if (res.data.success) {
        window.alert("Complaint submitted successfully!");
        setForm({
          complaintType: "",
          description: "",
        });
      } else {
        window.alert(res.data.msg || "Unable to submit complaint.");
      }
    } catch (err) {
      console.error(err);
      window.alert("Server error while submitting complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <UserSidebar />

      <div className="content">
        <UserTopbar />

        <div className="complaint-modal-container">
          <div className="complaint-modal-card">
            <h2>Add Complain</h2>
            {savedUser.name && (
              <p className="mb-3 text-muted">
                Submitting as {savedUser.name}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="complaint-field-group">
                <label htmlFor="complaintType">Select Complaint Type</label>
                <select
                  id="complaintType"
                  name="complaintType"
                  value={form.complaintType}
                  onChange={handleChange}
                  className="complaint-select"
                  required
                >
                  <option value="">--Compalint Type--</option>
                  

                  {complaintTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="complaint-field-group">
                <label htmlFor="description">Enter Your Complain</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  placeholder="please enter Your complain"
                  value={form.description}
                  onChange={handleChange}
                  className="complaint-textarea"
                  required
                />
              </div>

              {/* <div className="complaint-field-group">
                <label htmlFor="document">Attach Document (Optional)</label>
                <div className="file-input-wrapper">
                  <input
                    id="document"
                    name="document"
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="document" className="file-label">
                    Choose File
                  </label>
                  <span className="file-name">
                    {form.document ? form.document.name : "No file chosen"}
                  </span>
                </div>
              </div> */}

              <div className="complaint-button-group">
                <button type="submit" className="submit-complaint-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Complain"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComplaint;
