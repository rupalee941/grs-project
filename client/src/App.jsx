import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/admindashboard";

import CollegeManagement from "./pages/admin/CollegeManagement";
import SessionManagement from "./pages/admin/SessionManagement";
import ComplaintTypes from "./pages/admin/complaintTypes";
import Complaints from "./pages/admin/Complaints";
import UserManagement from "./pages/admin/UserManagement";
import BlockedUsers from "./pages/admin/BlockedUsers";
import AdminDiscussionForum from "./pages/admin/DiscussionForum";
import AdminChangePassword from "./pages/admin/ChangePassword";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/user/userdashboard";
import AddComplaint from "./pages/user/AddComplaint";
import UserComplaints from "./pages/user/UserComplaints";
import UpdateProfile from "./pages/user/UpdateProfile";
import DiscussionForum from "./pages/user/DiscussionForum";
import ChangePassword from "./pages/user/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/college-management" element={<CollegeManagement />} />
          <Route path="/admin/session-management" element={<SessionManagement />} />
          <Route path="/admin/complaint-types" element={<ComplaintTypes />} />
          <Route path="/admin/complaints/all" element={<Complaints type="all" />} />
          <Route path="/admin/complaints/pending" element={<Complaints type="pending" />} />
          <Route path="/admin/complaints/not-processed" element={<Complaints type="not-processed" />} />
          <Route path="/admin/complaints/closed" element={<Complaints type="closed" />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/blocked-users" element={<BlockedUsers />} />
          <Route path="/admin/discussion-forum" element={<AdminDiscussionForum />} />
          <Route path="/admin/change-password" element={<AdminChangePassword />} />
        </Route>
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/add-complaint" element={<AddComplaint />} />
          <Route path="/user/my-complaints" element={<UserComplaints status="all" />} />
          <Route path="/user/pending" element={<UserComplaints status="pending" />} />
          <Route path="/user/closed" element={<UserComplaints status="closed" />} />
          <Route path="/user/discussion-forum" element={<DiscussionForum />} />
          <Route path="/user/change-password" element={<ChangePassword />} />
          <Route path="/user/update-profile" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
