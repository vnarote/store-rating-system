import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser, listUsers } from '../../api/user.api';
import usePaginatedList from '../../hooks/usePaginatedList';
import { ROLE_LABELS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';
import Alert from '../../components/common/Alert';
import DataTable from '../../components/common/DataTable';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import RatingStars from '../../components/common/RatingStars';
import SearchBar from '../../components/common/SearchBar';

const FILTERS = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'address', label: 'Address' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
  },
];

function UserDetails({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUser(userId).then((data) => setUser(data.user)).catch((err) => setError(getErrorMessage(err)));
  }, [userId]);

  return (
    <Modal title="User details" onClose={onClose}>
      <Alert>{error}</Alert>
      {!user && !error && <Loader />}
      {user && (
        <dl className="space-y-3 text-sm">
          {[
            ['Name', user.name],
            ['Email', user.email],
            ['Address', user.address || '—'],
            ['Role', ROLE_LABELS[user.role]],
            ['Joined', formatDate(user.createdAt)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase text-slate-500">{label}</dt>
              <dd className="mt-0.5 break-words">{value}</dd>
            </div>
          ))}
          {user.role === 'STORE_OWNER' && (
            <>
              <div>
                <dt className="text-xs uppercase text-slate-500">Overall store rating</dt>
                <dd className="mt-0.5">
                  <RatingStars value={user.rating} showValue /> <span className="text-slate-400">({user.totalRatings} ratings)</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">Stores</dt>
                <dd className="mt-1 space-y-1">
                  {user.stores.length === 0 && <span className="text-slate-400">No stores yet</span>}
                  {user.stores.map((store) => (
                    <p key={store.id}>
                      {store.name} — <RatingStars value={store.averageRating} showValue />
                    </p>
                  ))}
                </dd>
              </div>
            </>
          )}
        </dl>
      )}
    </Modal>
  );
}

export default function Users() {
  const list = usePaginatedList(listUsers, { sortBy: 'name' });
  const [selectedId, setSelectedId] = useState(null);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (user) => ROLE_LABELS[user.role] },
    {
      key: 'actions',
      label: '',
      render: (user) => (
        <button onClick={() => setSelectedId(user.id)} className="font-medium text-indigo-600 hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Administrators, normal users and store owners"
        action={
          <Link to="/admin/users/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Add user
          </Link>
        }
      />
      <SearchBar fields={FILTERS} onSearch={list.applyFilters} />
      <Alert>{list.error}</Alert>
      <DataTable columns={columns} rows={list.items} loading={list.loading} sort={list.sort} onSort={list.toggleSort} emptyMessage="No users match your filters" />
      <Pagination pagination={list.pagination} onChange={list.setPage} />
      {selectedId && <UserDetails userId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
