import type { ContactPageType, Contact } from "../types"

export interface UseContactsResult {
  contacts: Contact[]
  isLoading: boolean
}

export function useContacts(_type: ContactPageType): UseContactsResult {
  // Placeholder implementation – wire up to real data or services later.
  return {
    contacts: [],
    isLoading: false,
  }
}

