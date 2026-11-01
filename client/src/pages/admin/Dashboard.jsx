import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/user.api';
import { getErrorMessage } from '../../utils/errors';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats().then(setStats).catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div>
      <PageHeader title="Admin dashboard" subtitle="Platform overview" />
      <Alert>{error}</Alert>
      {!stats && !error && <Loader />}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total users" value={stats.totalUsers} />
          <StatCard label="Total stores" value={stats.totalStores} />
          <StatCard label="Total ratings submitted" value={stats.totalRatings} />
        </div>
      )}
    </div>
  );
}
