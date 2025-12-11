import { useContext } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { id, role } = useContext(UserContext);

  if (!id) return <Navigate to="/login" replace />;

  if (requiredRole && (!role || role.toUpperCase() !== requiredRole.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
