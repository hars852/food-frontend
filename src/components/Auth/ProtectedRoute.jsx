import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);
  const location = useLocation();
  return token ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
