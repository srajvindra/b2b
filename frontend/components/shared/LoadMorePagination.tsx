"use client"

import { Button } from "@/components/ui/button"

interface LoadMorePaginationProps {
  total: number
  visibleCount: number
  label: string // e.g. "contacts", "tasks", "templates"
  onLoadMore: () => void
}

export function LoadMorePagination({ total, visibleCount, label, onLoadMore }: LoadMorePaginationProps) {
  if (total === 0) return null

  const shown = Math.min(visibleCount, total)

  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <span className="text-xs text-muted-foreground">
        Showing {shown} of {total} {label}
      </span>
      {shown < total && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={onLoadMore}
        >
          View More
        </Button>
      )}
    </div>
  )
}

