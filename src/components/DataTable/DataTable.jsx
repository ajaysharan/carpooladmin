
import { ChevronUp } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { TablePagination } from './TablePagination';
import { useEffect, useState } from 'react';

export function DataTable({
  tabletName ,
  data,
  columns,
  searchable = true,
  selectable = true,
  action = false,
  itemsPerPage = 10,
  currentPage,
  totalItems,
  onPageChange,
  searchTerm,
  onSearchChange,
  rowKey = 'id',
  onSortChange,
  sortKey = '',
  sortOrder = 'asc'  
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const getSortIcon = (key) => {
    if (sortKey !== key) return null;
    return (
      <ChevronUp
        className={`h-4 w-4 transition-transform duration-200 ${
          sortOrder === 'asc' ? '' : 'rotate-180'
        }`}
      />
    );
  };

  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  const handleSelectAll = () => {
    if (selectedRows.size === data?.length) {
      setSelectedRows(new Set()); // Unselect all
    } else {
      const newSelection = new Set(data?.map(item => item[rowKey]));
      setSelectedRows(newSelection); // Select all
    }
  };
  
  const handleSelectRow = (id) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const handleSort = (key) => {
    if (!onSortChange) return;
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(key, newOrder);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-1">
      {/* Header */}
      {searchable && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
           {tabletName?tabletName:""}
              </h3>
            <div className="w-80">
              <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={`Search`  }
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 overflow-hidden dark:border-neutral-700">
        <table className="min-w-full text-white border-collapse shadow ">
          <thead className="border-b border-dark-200  bg-gradient-to-b from-slate-900 via-slate-900 to-slate-500
          border-r border-slate-700/50 backdrop-blur-xl ">
            <tr>
              {selectable && (
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data?.length && data?.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-2 text-left text-xs font-medium border border-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <b>{column.label}</b>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {action && (
                <th className="px-4 py-2 text-left text-xs font-medium border border-gray-300 uppercase tracking-wider">
                 <b>Actions</b> 
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-neutral-700">
             {data?.map((item, index) => {
              const isChecked = selectedRows.has(item[rowKey]);
              return (
              <tr key={index} className="border border-gray-300 hover:bg-blue-50 hover:shadow-md transition-shadow duration-200">
                {selectable && (
                  <td className="px-6 py-4 ">
                     <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={isChecked}
                        onChange={() => handleSelectRow(item[rowKey])}/>
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {action && (
                  <td className="px-6 py-4 text-right">
                    {typeof action === 'function' ? action(item) : null}
                  </td>
                )}
              </tr>
               );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty */}
      {data?.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data found.</div>
      )}

      {/* Pagination */}
      <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
    </div>
  );
}