import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import Loader from './components/common/Loader';
import { useAuth } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import OwnerLayout from './layouts/OwnerLayout';
import UserLayout from './layouts/UserLayout';
import AddStore from './pages/admin/AddStore';
import AddUser from './pages/admin/AddUser';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStores from './pages/admin/Stores';
import AdminUsers from './pages/admin/Users';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/common/ChangePassword';
import NotFound from './pages/common/NotFound';
import OwnerDashboard from './pages/owner/Dashboard';
import StoreRatings from './pages/owner/StoreRatings';
import UserDashboard from './pages/user/Dashboard';
import MyRatings from './pages/user/MyRatings';
import StoreList from './pages/user/StoreList';
import { ROLES, ROLE_HOME } from './utils/constants';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  return <Navigate to={user ? ROLE_HOME[user.role] : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AddUser />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="stores/new" element={<AddStore />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={[ROLES.NORMAL_USER]} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="stores" element={<StoreList />} />
            <Route path="my-ratings" element={<MyRatings />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={[ROLES.STORE_OWNER]} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="ratings" element={<StoreRatings />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
