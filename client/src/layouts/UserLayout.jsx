import DashboardLayout from './DashboardLayout';

const LINKS = [
  { to: '/user', label: 'Dashboard', end: true },
  { to: '/user/stores', label: 'Browse Stores' },
  { to: '/user/my-ratings', label: 'My Ratings' },
  { to: '/user/change-password', label: 'Change Password' },
];

export default function UserLayout() {
  return <DashboardLayout links={LINKS} />;
}
