import React from 'react';

const Pagination = ({ page, perPage, totalCount, onPageChange }) => {
  const pagesCount = Math.ceil(totalCount / perPage);
  const pages = Array(pagesCount).fill(0).map((_, i) => i + 1);

  return (
    <div>
      {pages.map(p => (
        <button
          key={p}
          className={p === page ? 'Paginate-btn' : 'Paginate-btn_active'}
          onClick={() => onPageChange(p)}
        >
          { p }
        </button>
      ))}
    </div>
  );
};

export default Pagination;