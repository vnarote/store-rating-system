import { useState } from 'react';
import { listMyRatings } from '../../api/rating.api';
import usePaginatedList from '../../hooks/usePaginatedList';
import { formatDate } from '../../utils/format';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import RatingStars from '../../components/common/RatingStars';
import RateStoreModal from '../../components/stores/RateStoreModal';

export default function MyRatings() {
  const list = usePaginatedList(listMyRatings, { sortBy: 'updatedAt', sortOrder: 'desc' });
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const columns = [
    { key: 'storeName', label: 'Store', sortable: true, render: (item) => item.store.name },
    { key: 'address', label: 'Address', render: (item) => item.store.address },
    { key: 'rating', label: 'Your rating', sortable: true, render: (item) => <RatingStars value={item.rating} showValue /> },
    { key: 'updatedAt', label: 'Last updated', sortable: true, render: (item) => formatDate(item.updatedAt) },
    {
      key: 'actions',
      label: '',
      render: (item) => (
        <Button variant="secondary" onClick={() => setSelectedStoreId(item.store.id)}>
          Modify
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="My ratings" subtitle="Every store you have rated" />
      <Alert>{list.error}</Alert>
      <DataTable columns={columns} rows={list.items} loading={list.loading} sort={list.sort} onSort={list.toggleSort} emptyMessage="You haven't rated any stores yet" />
      <Pagination pagination={list.pagination} onChange={list.setPage} />
      {selectedStoreId && <RateStoreModal storeId={selectedStoreId} onClose={() => setSelectedStoreId(null)} onSaved={list.reload} />}
    </div>
  );
}
