import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers at once
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust start and end to ensure we show maxPagesToShow - 2 pages (excluding first and last)
      if (endPage - startPage < maxPagesToShow - 3) {
        if (startPage === 2) {
          endPage = Math.min(totalPages - 1, startPage + (maxPagesToShow - 3));
        } else if (endPage === totalPages - 1) {
          startPage = Math.max(2, endPage - (maxPagesToShow - 3));
        }
      }
      
      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center mt-6 space-x-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-primary hover:bg-primary hover:bg-opacity-10 transition-colors'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`px-3 py-1 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-primary text-white font-medium'
              : page === '...'
              ? 'text-gray-500 cursor-default'
              : 'hover:bg-primary hover:bg-opacity-10 text-primary'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-primary hover:bg-primary hover:bg-opacity-10 transition-colors'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;