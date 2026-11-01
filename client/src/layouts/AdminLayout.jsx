import DashboardLayout from './DashboardLayout';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/users/new', label: 'Add User' },
  { to: '/admin/stores', label: 'Stores' },
  { to: '/admin/stores/new', label: 'Add Store' },
  { to: '/admin/change-password', label: 'Change Password' },
];

export default function AdminLayout() {
  return <DashboardLayout links={LINKS} />;
}
