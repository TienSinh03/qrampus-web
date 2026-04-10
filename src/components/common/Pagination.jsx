import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  hideOnSinglePage = true,
  className = "",
  disabled = false,
}) => {
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);

  if (hideOnSinglePage && safeTotalPages <= 1) return null;

  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    const totalButtons = totalNumbers + 2; // +2 for ellipsis

    if (totalButtons >= safeTotalPages) {
      return range(1, safeTotalPages);
    }

    const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, boundaryCount);
    const rightSiblingIndex = Math.min(
      safeCurrentPage + siblingCount,
      safeTotalPages - boundaryCount
    );

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 1;
    const shouldShowRightDots = rightSiblingIndex < safeTotalPages - boundaryCount;

    const firstPages = range(1, boundaryCount);
    const lastPages = range(safeTotalPages - boundaryCount + 1, safeTotalPages);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [...range(1, 3 + siblingCount * 2), "dots", ...lastPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [...firstPages, "dots", ...range(safeTotalPages - (3 + siblingCount * 2) + 1, safeTotalPages)];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        ...firstPages,
        "dots",
        ...range(leftSiblingIndex, rightSiblingIndex),
        "dots",
        ...lastPages,
      ];
    }

    return range(1, safeTotalPages);
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-1 md:gap-2 ${className}`}
      aria-label="Pagination"
    >
      {/* First */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1 || disabled}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft size={18} />
        </button>
      )}

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={safeCurrentPage === 1 || disabled}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === "dots") {
          return (
            <span
              key={`dots-${index}`}
              className="inline-flex h-9 w-9 items-center justify-center text-slate-500"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            disabled={disabled}
            className={`
              inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors
              ${
                currentPage === page
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "text-slate-700 hover:bg-slate-100"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage === safeTotalPages || disabled}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>

      {/* Last */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages || disabled}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight size={18} />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
