import { useEffect, useMemo, useState } from 'react';
import { getOwnerStores, listOwnerRatings } from '../../api/rating.api';
import usePaginatedList from '../../hooks/usePaginatedList';
import { formatDate } from '../../utils/format';
import Alert from '../../components/common/Alert';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import RatingStars from '../../components/common/RatingStars';
import SearchBar from '../../components/common/SearchBar';

export default function StoreRatings() {
  const list = usePaginatedList(listOwnerRatings, { sortBy: 'createdAt', sortOrder: 'desc' });
  const [stores, setStores] = useState([]);

  useEffect(() => {
    getOwnerStores().then((data) => setStores(data.stores)).catch(() => setStores([]));
  }, []);

  // A store filter is only useful when the owner has more than one store.
  const filters = useMemo(
    () =>
      stores.length > 1
        ? [{ name: 'storeId', label: 'Store', type: 'select', options: stores.map((s) => ({ value: s.id, label: s.name })) }]
        : [],
    [stores],
  );

  const columns = [
    { key: 'userName', label: 'User', sortable: true, render: (item) => item.user.name },
    { key: 'email', label: 'Email', render: (item) => item.user.email },
    { key: 'storeName', label: 'Store', sortable: true, render: (item) => item.store.name },
    { key: 'rating', label: 'Rating', sortable: true, render: (item) => <RatingStars value={item.rating} showValue /> },
    { key: 'createdAt', label: 'Date', sortable: true, render: (item) => formatDate(item.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="Store ratings" subtitle="Users who rated your store" />
      {filters.length > 0 && <SearchBar fields={filters} onSearch={list.applyFilters} />}
      <Alert>{list.error}</Alert>
      <DataTable columns={columns} rows={list.items} loading={list.loading} sort={list.sort} onSort={list.toggleSort} emptyMessage="No ratings received yet" />
      <Pagination pagination={list.pagination} onChange={list.setPage} />
    </div>
  );
}
