// components/Pagination.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pages = [];
  
  // Always include the first page
  pages.push(1);
  
  // Calculate the range of pages to display
  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
  
  // Add ellipsis before the range if needed
  if (rangeStart > 2) {
    pages.push('...');
  }
  
  // Add pages in the range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }
  
  // Add ellipsis after the range if needed
  if (rangeEnd < totalPages - 1) {
    pages.push('...');
  }
  
  // Always include the last page if there's more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return (
    <nav className="flex justify-center">
      <ul className="flex items-center space-x-1">
        {/* Previous Page */}
        {currentPage > 1 && (
          <li>
            <Link
              href={`${basePath}page=${currentPage - 1}`}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </li>
        )}
        
        {/* Page numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center w-10 h-10">...</span>
            ) : (
              <Link
                href={`${basePath}page=${page}`}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* Next Page */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={`${basePath}page=${currentPage + 1}`}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}