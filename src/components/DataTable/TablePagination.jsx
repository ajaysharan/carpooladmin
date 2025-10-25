import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TablePagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange
}) => {
  const totalPagesSafe = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(2, currentPage - 2);
    let end = Math.min(totalPagesSafe - 1, currentPage + 2);

    if (currentPage <= 3) {
      start = 2;
      end = Math.min(totalPagesSafe - 1, 5);
    }

    if (currentPage >= totalPagesSafe - 2) {
      start = Math.max(2, totalPagesSafe - 4);
      end = totalPagesSafe - 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* First Page */}
            <button
              onClick={() => onPageChange(1)}
              className={`px-4 py-2 border text-sm font-medium ${
                currentPage === 1
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              1
            </button>

            {/* Dots before middle pages */}
            {totalPagesSafe > 5 && currentPage > 4 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}

            {/* Middle Pages */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 border text-sm font-medium transition ${
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Dots after middle pages */}
            {totalPagesSafe > 5 && currentPage < totalPagesSafe - 3 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}

            {/* Last Page */}
            {totalPagesSafe > 1 && (
              <button
                onClick={() => onPageChange(totalPagesSafe)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currentPage === totalPagesSafe
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {totalPagesSafe}
              </button>
            )}

            {/* Next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPagesSafe}
              className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
