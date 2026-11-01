import { useState } from 'react';
import { listStores } from '../../api/store.api';
import usePaginatedList from '../../hooks/usePaginatedList';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import RatingStars from '../../components/common/RatingStars';
import SearchBar from '../../components/common/SearchBar';
import RateStoreModal from '../../components/stores/RateStoreModal';

const FILTERS = [
  { name: 'name', label: 'Store name' },
  { name: 'address', label: 'Address' },
];

export default function StoreList() {
  const list = usePaginatedList(listStores, { sortBy: 'name' });
  const [selectedId, setSelectedId] = useState(null);

  const columns = [
    { key: 'name', label: 'Store name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'averageRating',
      label: 'Overall rating',
      sortable: true,
      render: (store) => (
        <span className="inline-flex items-center gap-1">
          <RatingStars value={store.averageRating} showValue />
          {store.ratingCount > 0 && <span className="text-xs text-slate-400">({store.ratingCount})</span>}
        </span>
      ),
    },
    { key: 'myRating', label: 'Your rating', render: (store) => <RatingStars value={store.myRating} /> },
    {
      key: 'actions',
      label: '',
      render: (store) => (
        <Button variant={store.myRating ? 'secondary' : 'primary'} onClick={() => setSelectedId(store.id)}>
          {store.myRating ? 'Modify rating' : 'Rate'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Browse stores" subtitle="Search stores, view ratings and share your own" />
      <SearchBar fields={FILTERS} onSearch={list.applyFilters} />
      <Alert>{list.error}</Alert>
      <DataTable columns={columns} rows={list.items} loading={list.loading} sort={list.sort} onSort={list.toggleSort} emptyMessage="No stores found" />
      <Pagination pagination={list.pagination} onChange={list.setPage} />
      {selectedId && <RateStoreModal storeId={selectedId} onClose={() => setSelectedId(null)} onSaved={list.reload} />}
    </div>
  );
}
