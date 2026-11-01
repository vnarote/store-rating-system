import EmptyState from './EmptyState';
import Loader from './Loader';

// columns: [{ key, label, sortable?, render?(row) }]
export default function DataTable({ columns, rows, loading, sort, onSort, emptyMessage, rowKey = 'id' }) {
  if (loading && rows.length === 0) return <Loader />;
  if (!loading && rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-200 bg-white ${loading ? 'opacity-60' : ''}`}>
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
          <tr>
            {columns.map((column) => {
              const active = sort?.sortBy === column.key;
              return (
                <th key={column.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {column.sortable ? (
                    <button type="button" onClick={() => onSort(column.key)} className="inline-flex items-center gap-1 uppercase hover:text-indigo-600">
                      {column.label}
                      <span aria-hidden="true">{active ? (sort.sortOrder === 'asc' ? '▲' : '▼') : '↕'}</span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-middle">
                  {column.render ? column.render(row) : row[column.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
