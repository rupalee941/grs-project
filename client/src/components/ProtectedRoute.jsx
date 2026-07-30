import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = role === "admin"
    ? localStorage.getItem("role") === "admin" && Boolean(localStorage.getItem("token"))
    : Boolean(JSON.parse(localStorage.getItem("user") || "{}").id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(role === "admin" ? "/admin-login" : "/user-login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isAuthenticated, location.pathname, navigate, role]);

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
