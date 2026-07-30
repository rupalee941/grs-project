import React, { useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userEmail = localStorage.getItem("grsUserEmail");

    if (!userEmail) {
      window.alert("Please log in first to change your password.");
      return;
    }

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      window.alert("Please complete all password fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      window.alert("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch("http://localhost:5000/api/user/change-password", {
        email: userEmail,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      if (res.data.msg === "Password updated") {
        window.alert("Password changed successfully.");
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        window.alert(res.data.msg || "Unable to change password.");
      }
    } catch (error) {
      console.error(error);
      window.alert("Error changing password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <UserSidebar />

      <div className="content">
        <UserTopbar />

        <div className="change-password-page">
          <section className="change-password-card user-change-password-card">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                placeholder="Enter Your Old Password"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter Your New Password"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Your New Confirm Password"
                required
              />
              <button type="submit" className="change-password-btn" disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
