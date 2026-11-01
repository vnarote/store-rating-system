import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerDashboard, listOwnerRatings } from '../../api/rating.api';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import RatingStars from '../../components/common/RatingStars';
import StatCard from '../../components/common/StatCard';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getOwnerDashboard(), listOwnerRatings({ limit: 5 })])
      .then(([summary, ratings]) => setData({ summary, ratings: ratings.items }))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div>
      <PageHeader title="Store owner dashboard" subtitle="How customers rate your store" />
      <Alert>{error}</Alert>
      {!data && !error && <Loader />}
      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Your stores" value={data.summary.stores.length} />
            <StatCard label="Average rating" value={data.summary.averageRating ?? '—'} />
            <StatCard label="Total ratings" value={data.summary.totalRatings} />
          </div>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Your store information</h2>
            {data.summary.stores.length === 0 ? (
              <EmptyState message="No store is linked to your account yet. Please contact an administrator." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {data.summary.stores.map((store) => (
                  <div key={store.id} className="rounded-lg border border-slate-200 bg-white p-5">
                    <p className="font-semibold">{store.name}</p>
                    <p className="text-sm text-slate-500">{store.address}</p>
                    <p className="text-sm text-slate-500">{store.email}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <RatingStars value={store.averageRating} showValue />
                      <span className="text-xs text-slate-400">({store.ratingCount} ratings)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Latest ratings</h2>
              <Link to="/owner/ratings" className="text-sm font-medium text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
            {data.ratings.length === 0 ? (
              <EmptyState message="No one has rated your store yet" />
            ) : (
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {data.ratings.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div>
                      <p className="font-medium">{item.user.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.store.name} · {formatDate(item.createdAt)}
                      </p>
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
