import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cms.png";
import "./UserRegister.css";

function UserRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    name: "",
    father: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    password: "",
    sessionId: "",
    collegeId: "",
    course: "",
    enrollment: "",
    address: "",
  });

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const [collegeRes, sessionRes] = await Promise.all([
          axios.get("http://localhost:5000/api/college/active"),
          axios.get("http://localhost:5000/api/session/active"),
        ]);

        setColleges(collegeRes.data.college || []);
        setSessions(sessionRes.data.session || []);
      } catch (error) {
        console.error("Error loading registration options:", error);
        setMessage("Unable to load colleges and sessions. Please try again.");
      }
    };

    fetchFormOptions();
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (e.currentTarget.form && !e.currentTarget.form.reportValidity()) {
      return;
    }
    setMessage("");
    setStep(2);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setMessage("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/user/register", data);

      if (res.data.success) {
  localStorage.setItem("user", JSON.stringify(res.data.user));
  localStorage.setItem("grsUserEmail", res.data.user.email);
  localStorage.setItem("userId", res.data.user.id);
        window.alert("User registered successfully!");
        navigate("/user/dashboard");
      } else {
        setMessage(res.data.msg || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid register-page">
      <div className="row">

        {/* Left Panel */}

        <div className="col-lg-6 left-panel">

          <div className="left-content">

            <div className="left-icon">
              🎓
            </div>

            <h2>Join the University Portal</h2>

            <p>
              Create your account to submit complaints,
              track them and engage with the university.
            </p>

            <div className="steps">

              <div className="step-item active">

                <div className="circle">1</div>

                <div>
                  <h5>Personal Details</h5>
                  <span>Name, Email, Password & Contact</span>
                </div>

              </div>

              <div className="step-item">

                <div className="circle">2</div>

                <div>
                  <h5>Academic Details</h5>
                  <span>College, Course & Enrollment</span>
                </div>

              </div>

              <div className="step-item">

                <div className="circle">3</div>

                <div>
                  <h5>Start Using GRS</h5>
                  <span>Submit & Track Complaints</span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Right Panel */}

        <div className="col-lg-6 right-panel">

          <div className="register-card">

            <img src={logo} className="top-logo" alt="" />

            <h2>Create Account</h2>

            <p>
              Fill in your personal information to get started.
            </p>

            {/* Progress */}

            <div className="progress-wrapper">

              <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                1
              </div>

              <div className="progress-line"></div>

              <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                2
              </div>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>
              {message && (
                <div className="alert alert-danger py-2" role="alert">
                  {message}
                </div>
              )}

              {/* STEP 1 */}

              {step === 1 && (

                <>

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label>Full Name</label>

                      <input
                        name="name"
                        type="text"
                        className="form-control"
                        placeholder="Your Full Name"
                        value={data.name}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Father's Name</label>

                      <input
                        name="father"
                        type="text"
                        className="form-control"
                        placeholder="Father's Name"
                        value={data.father}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Email</label>

                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="you@email.com"
                        value={data.email}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Mobile Number</label>

                      <input
                        name="mobile"
                        type="tel"
                        className="form-control"
                        placeholder="10-digit mobile"
                        value={data.mobile}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Gender</label>

                      <select
                        name="gender"
                        className="form-select"
                        value={data.gender}
                        onChange={handleChange}
                        required
                      >

                        <option value="">Select Gender</option>

                        <option value="Male">Male</option>

                        <option value="Female">Female</option>

                        <option value="Other">Other</option>

                      </select>

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Date of Birth</label>

                      <input
                        name="dob"
                        type="date"
                        className="form-control"
                        value={data.dob}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-12 mb-4">

                      <label>Password</label>

                      <div className="input-group">

                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Create Password"
                          value={data.password}
                          onChange={handleChange}
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          👁
                        </button>

                      </div>

                    </div>

                  </div>

                    <button
                      type="button"
                      className="btn btn-success next-btn"
                      onClick={nextStep}
                    >
                    Next Step →
                  </button>

                </>

              )}

              {/* STEP 2 */}

              {step === 2 && (

                <>

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label>College</label>

                      <select
                        name="collegeId"
                        className="form-select"
                        value={data.collegeId}
                        onChange={handleChange}
                        required
                      >

                        <option value="">Select College</option>

                        {colleges.map((college) => (
                          <option key={college._id} value={college._id}>
                            {college.name}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Course</label>

                      <select
                        name="course"
                        className="form-select"
                        value={data.course}
                        onChange={handleChange}
                        required
                      >

                        <option value="">Select Course</option>

                        <option value="B.Tech">B.Tech</option>

                        <option value="BCA">BCA</option>

                        <option value="MCA">MCA</option>

                        <option value="MBA">MBA</option>

                      </select>

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Session</label>

                      <select
                        name="sessionId"
                        className="form-select"
                        value={data.sessionId}
                        onChange={handleChange}
                        required
                      >

                        <option value="">Select Session</option>

                        {sessions.map((session) => (
                          <option key={session._id} value={session._id}>
                            {session.name}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div className="col-md-6 mb-3">

                      <label>Enrollment Number</label>

                      <input
                        name="enrollment"
                        type="text"
                        className="form-control"
                        placeholder="Enrollment Number"
                        value={data.enrollment}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-12 mb-4">

                      <label>Address</label>

                      <textarea
                        name="address"
                        className="form-control"
                        rows="4"
                        placeholder="Enter Address"
                        value={data.address}
                        onChange={handleChange}
                        required
                      ></textarea>

                    </div>

                  </div>

                  <div className="d-flex justify-content-between">

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      ← Previous
                    </button>

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Account"}
                    </button>

                  </div>

                </>

              )}

            </form>

            <div className="text-center mt-4">

              Already have an account?

              <Link
                to="/user-login"
                className="ms-2 fw-bold text-success text-decoration-none"
              >
                Sign In
              </Link>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default UserRegister;
