import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const [profileData, setProfileData] = useState({
    profilePhoto: null,
    fullName: "",
    fathersName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    course: "",
    college: "",
    session: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userEmail = localStorage.getItem("grsUserEmail");
      if (userEmail) {
        const res = await axios.get(
          `http://localhost:5000/api/user/profile/${userEmail}`
        );
        if (res.data.user) {
          setProfileData(res.data.user);
          if (res.data.user.profilePhoto) {
            setPhotoPreview(res.data.user.profilePhoto);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setProfileData({
          ...profileData,
          profilePhoto: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("fathersName", profileData.fathersName);
      formData.append("gender", profileData.gender);
      formData.append("dateOfBirth", profileData.dateOfBirth);
      formData.append("mobile", profileData.mobile);
      formData.append("address", profileData.address);
      formData.append("city", profileData.city);
      formData.append("pincode", profileData.pincode);
      formData.append("course", profileData.course);
      formData.append("college", profileData.college);
      formData.append("session", profileData.session);

      if (profileData.profilePhoto instanceof File) {
        formData.append("profilePhoto", profileData.profilePhoto);
      }

      const userEmail = localStorage.getItem("grsUserEmail");
      const res = await axios.put(
        `http://localhost:5000/api/user/profile/${userEmail}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <UserSidebar />

      <div className="content">
        <UserTopbar />

        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-header-content">
              <h2 className="profile-title">
                <i className="bi bi-person-circle"></i> My Profile
              </h2>
              <p className="profile-subtitle">Manage your personal information</p>
            </div>
            <div className="profile-avatar">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
              <label htmlFor="profilePhotoInput" className="photo-edit-btn">
                <i className="bi bi-pencil-fill"></i>
              </label>
            </div>
          </div>

          <div className="profile-form-card">
            <form onSubmit={handleSubmit}>
              {/* Profile Photo Section */}
              <section className="form-section">
                <h3 className="section-title">PROFILE PHOTO</h3>
                <div className="photo-upload-area">
                  <input
                    id="profilePhotoInput"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="photo-input"
                  />
                  <label htmlFor="profilePhotoInput" className="photo-upload-label">
                    <i className="bi bi-cloud-arrow-up"></i>
                    <p>Click to upload a new photo (JPG, PNG — max 5 MB)</p>
                  </label>
                </div>
              </section>

              {/* Personal Information Section */}
              <section className="form-section">
                <h3 className="section-title">PERSONAL INFORMATION</h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fathersName">Father's Name</label>
                    <input
                      id="fathersName"
                      name="fathersName"
                      type="text"
                      placeholder="Enter father's name"
                      value={profileData.fathersName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="form-section">
                <h3 className="section-title">CONTACT</h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="email">Email (read-only)</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={profileData.email}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      value={profileData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your address"
                    value={profileData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      value={profileData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="Enter pincode"
                      value={profileData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </section>

              {/* Academic Details Section */}
              <section className="form-section">
                <h3 className="section-title">ACADEMIC DETAILS (set during registration)</h3>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label htmlFor="course">Course</label>
                    <input
                      id="course"
                      name="course"
                      type="text"
                      placeholder="Enter Your course"
                      value={profileData.course}
                      onChange={handleInputChange}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="college">College</label>
                    <input
                      id="college"
                      name="college"
                      type="text"
                      placeholder="Enter Your college"
                      value={profileData.college}
                      onChange={handleInputChange}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="session">Session</label>
                    <input
                      id="session"
                      name="session"
                      type="text"
                      placeholder="Enter Your session"
                      value={profileData.session}
                       onChange={handleInputChange}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </section>

              {/* Success Message */}
              {successMessage && (
                <div className="success-message">
                  <i className="bi bi-check-circle"></i>
                  {successMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={loading}
                >
                  <i className="bi bi-shield-check"></i>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
