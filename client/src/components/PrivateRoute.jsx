import { useContext } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../contexts/UserContext";

const PrivateRoute = ({ children }) => {
  const { email } = useContext(UserContext);
  return email ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
