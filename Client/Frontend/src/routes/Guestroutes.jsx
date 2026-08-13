import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default GuestRoutes;
