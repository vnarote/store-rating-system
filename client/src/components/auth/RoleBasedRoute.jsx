import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../utils/constants';

export default function RoleBasedRoute({ allowedRoles }) {
  const { user } = useAuth();
  if (!allowedRoles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <Outlet />;
}
