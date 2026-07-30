import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "./CollegeManagement.css";

const ChangePassword = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="change password" />

        <div className="change-password-page">
          <section className="change-password-card">
            <h2>Change Password</h2>

            <form>
              <input
                type="password"
                placeholder="Enter Your Old Password"
              />

              <input
                type="password"
                placeholder="Enter Your New Password"
              />

              <input
                type="password"
                placeholder="Enter Your New Confirm Password"
              />

              <button type="submit" className="change-password-btn">
                Change Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
