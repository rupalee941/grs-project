import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        data
      );

      console.log(res.data);

      // Check the backend's response
      if (res.data.msg === "success") {

        alert("Login Successful");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("adminId", res.data.adminId);
        localStorage.setItem("adminName", res.data.name);
        localStorage.setItem("role", "admin");

        navigate("/admin/dashboard");

      } else {
        alert(res.data.msg);
      }

    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data.msg || "Login Failed");
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background:
          "linear-gradient(135deg,#171c35,#2c2a72,#171c35)",
      }}
    >
      <div
        className="card border-0.5 shadow-lg"
        style={{

          width: "490px",
          borderRadius: "18px",
          overflow: "hidden",
          marginTop:"15px"
        }}
      >
        {/* Header */}
        <div
          className="text-center text-white p-5"
          style={{
            background:
              "linear-gradient(135deg,#2f3a8f,#6d28d9)",
          }}
        >
          <div
            className="mx-auto mb-3 d-flex justify-content-center align-items-center"
            style={{
              width: "80px",
              height: "75px",
              borderRadius: "20px",
              background: "rgba(255,255,255,.15)",
              fontSize: "40px",
            }}
          >
            <i className="bi bi-shield-lock-fill"></i>
          </div>

          <h2 className="fw-bold">Admin Portal</h2>

          <p className="mb-0 fs-5 text-light">
            LNM University Grievance Redressal System
          </p>
        </div>

        {/* Body */}
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <span
              className="badge rounded-pill px-4 py-3"
              style={{
                background: "#efe9ff",
                color: "#5b3df5",
                border: "1px solid #cfc4ff",
                fontSize: "15px",
              }}
            >
              <i className="bi bi-lock-fill me-2"></i>
              RESTRICTED ACCESS
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Admin Email
              </label>

              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="admin@university.edu"
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="Enter admin password"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn text-white w-100 py-3 fw-bold"
              style={{
                background:
                  "linear-gradient(90deg,#4f46e5,#7c3aed)",
                borderRadius: "12px",
                fontSize: "22px",
              }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Sign In as Admin
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-decoration-none fw-semibold">
              Forgot password?
            </a>

            <span className="mx-2">•</span>

            <Link to="/" className="text-decoration-none fw-semibold">
              ← Back to Home
            </Link>
          </div>

          <hr className="my-4" />

          <p className="text-center text-secondary small mb-0">
            ©2026 LNM University • Admin access is logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
