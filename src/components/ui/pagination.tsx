import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  siblingCount?: number;
}

export function Pagination({
  className,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  // Generate the list of page numbers to display
  const generatePagination = () => {
    // If there are 7 or fewer pages, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the range of pages to show around the current page
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    // Include ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first and last page
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: totalPages - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "...", ...rightRange];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from(
        { length: rightSiblingIndex },
        (_, i) => i + 1
      );
      return [...leftRange, "...", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = generatePagination();

  return (
    <div
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      {...props}
    >
      <PaginationButton
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>
      {pages.map((pageNumber, i) => (
        <React.Fragment key={i}>
          {pageNumber === "..." ? (
            <PaginationEllipsis />
          ) : (
            <PaginationButton
              isActive={pageNumber === page}
              onClick={() => onPageChange(pageNumber as number)}
              aria-label={`Go to page ${pageNumber}`}
            >
              {pageNumber}
            </PaginationButton>
          )}
        </React.Fragment>
      ))}
      <PaginationButton
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || totalPages === 0}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </div>
  );
}

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export function PaginationButton({
  className,
  isActive,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "outline",
          size: "icon",
        }),
        "h-8 w-8 rounded-md p-0",
        className
      )}
      {...props}
    />
  );
}

export function PaginationEllipsis() {
  return (
    <div className="flex h-8 w-8 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
    </div>
  );
}