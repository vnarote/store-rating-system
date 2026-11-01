import DashboardLayout from './DashboardLayout';

const LINKS = [
  { to: '/owner', label: 'Dashboard', end: true },
  { to: '/owner/ratings', label: 'Store Ratings' },
  { to: '/owner/change-password', label: 'Change Password' },
];

export default function OwnerLayout() {
  return <DashboardLayout links={LINKS} />;
}
