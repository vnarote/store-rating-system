import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyRatings } from '../../api/rating.api';
import { listStores } from '../../api/store.api';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import RatingStars from '../../components/common/RatingStars';
import StatCard from '../../components/common/StatCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listStores({ limit: 1 }), listMyRatings({ limit: 5 })])
      .then(([stores, ratings]) => setData({ stores: stores.pagination.total, ratings }))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div>
      <PageHeader title={`Hello, ${user.name}`} subtitle="Discover stores and share your experience" />
      <Alert>{error}</Alert>
      {!data && !error && <Loader />}
      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Registered stores" value={data.stores} />
            <StatCard label="Stores you have rated" value={data.ratings.pagination.total} />
          </div>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent ratings</h2>
              <Link to="/user/stores" className="text-sm font-medium text-indigo-600 hover:underline">
                Browse stores
              </Link>
            </div>
            {data.ratings.items.length === 0 ? (
              <EmptyState message="You haven't rated any stores yet" />
            ) : (
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {data.ratings.items.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div>
                      <p className="font-medium">{item.store.name}</p>
                      <p className="text-xs text-slate-500">Updated {formatDate(item.updatedAt)}</p>
                    </div>
                    <RatingStars value={item.rating} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
