import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import "../assets/styles/Pagination.css"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 4;
    const isTooManyPages = totalPages > maxPagesToShow;

    if (isTooManyPages) {
      pages.push(1);
      let startPage, endPage;

      if (currentPage <= 2) {
        startPage = 2;
        endPage = maxPagesToShow - 1;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - (maxPagesToShow - 2);
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      pages.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <BootstrapPagination className="justify-content-center mt-4 container-pagination">
      <BootstrapPagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <BootstrapPagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      {pages.map((page, index) => (
        <React.Fragment key={page}>
          {index > 0 && pages[index - 1] !== page - 1 && (
            <BootstrapPagination.Ellipsis disabled />
          )}
          <BootstrapPagination.Item
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BootstrapPagination.Item>
        </React.Fragment>
      ))}
      <BootstrapPagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <BootstrapPagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
    </BootstrapPagination>
  );
};

export default Pagination;
