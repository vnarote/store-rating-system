import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

const EMPTY_PAGINATION = { page: 1, limit: 10, total: 0, totalPages: 1 };

// Handles fetching, filtering, sorting and paging for any list endpoint.
// `fetchFn` must be a stable function (e.g. an imported API function).
export default function usePaginatedList(fetchFn, { sortBy, sortOrder = 'asc', limit = 10 } = {}) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortBy, sortOrder });
  const [state, setState] = useState({
    items: [],
    pagination: EMPTY_PAGINATION,
    loading: true,
    error: '',
  });
  const latestRequest = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const data = await fetchFn({ ...filters, page, limit, ...sort });
      if (requestId === latestRequest.current) {
        setState({ items: data.items, pagination: data.pagination, loading: false, error: '' });
      }
    } catch (error) {
      if (requestId === latestRequest.current) {
        setState((current) => ({ ...current, loading: false, error: getErrorMessage(error) }));
      }
    }
  }, [fetchFn, filters, page, limit, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const applyFilters = (values) => {
    const cleaned = Object.fromEntries(Object.entries(values).filter(([, value]) => value));
    setFilters(cleaned);
    setPage(1);
  };

  const toggleSort = (field) => {
    setSort((current) => ({
      sortBy: field,
      sortOrder: current.sortBy === field && current.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  };

  return { ...state, page, setPage, sort, toggleSort, applyFilters, reload: load };
}
