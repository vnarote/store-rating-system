import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStore, listAdminStores } from '../../api/store.api';
import usePaginatedList from '../../hooks/usePaginatedList';
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
];

function StoreDetails({ storeId, onClose }) {
  const [store, setStore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStore(storeId).then((data) => setStore(data.store)).catch((err) => setError(getErrorMessage(err)));
  }, [storeId]);

  return (
    <Modal title="Store details" onClose={onClose}>
      <Alert>{error}</Alert>
      {!store && !error && <Loader />}
      {store && (
        <dl className="space-y-3 text-sm">
          {[
            ['Name', store.name],
            ['Email', store.email],
            ['Address', store.address],
            ['Owner', `${store.owner.name} (${store.owner.email})`],
            ['Created', formatDate(store.createdAt)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase text-slate-500">{label}</dt>
              <dd className="mt-0.5 break-words">{value}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs uppercase text-slate-500">Average rating</dt>
            <dd className="mt-0.5">
              <RatingStars value={store.averageRating} showValue /> <span className="text-slate-400">({store.ratingCount} ratings)</span>
            </dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}

export default function Stores() {
  const list = usePaginatedList(listAdminStores, { sortBy: 'name' });
  const [selectedId, setSelectedId] = useState(null);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Rating', sortable: true, render: (store) => <RatingStars value={store.averageRating} showValue /> },
    {
      key: 'actions',
      label: '',
      render: (store) => (
        <button onClick={() => setSelectedId(store.id)} className="font-medium text-indigo-600 hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stores"
        subtitle="All registered stores and their average ratings"
        action={
          <Link to="/admin/stores/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Add store
          </Link>
        }
      />
      <SearchBar fields={FILTERS} onSearch={list.applyFilters} />
      <Alert>{list.error}</Alert>
      <DataTable columns={columns} rows={list.items} loading={list.loading} sort={list.sort} onSort={list.toggleSort} emptyMessage="No stores match your filters" />
      <Pagination pagination={list.pagination} onChange={list.setPage} />
      {selectedId && <StoreDetails storeId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
