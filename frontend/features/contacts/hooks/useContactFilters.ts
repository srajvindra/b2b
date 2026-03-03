import { useState } from "react"

export interface ContactFiltersState {
  search: string
}

export interface UseContactFiltersResult {
  filters: ContactFiltersState
  setSearch: (value: string) => void
  reset: () => void
}

export function useContactFilters(): UseContactFiltersResult {
  const [search, setSearch] = useState("")

  return {
    filters: { search },
    setSearch,
    reset: () => setSearch(""),
  }
}

