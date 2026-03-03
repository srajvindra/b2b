"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

type RightPanelContextType = {
  panel: ReactNode
  setPanel: (content: ReactNode) => void
  clearPanel: () => void
}

const RightPanelContext = createContext<RightPanelContextType | null>(null)

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [panel, setPanelState] = useState<ReactNode>(null)

  const setPanel = useCallback((content: ReactNode) => {
    setPanelState(content)
  }, [])

  const clearPanel = useCallback(() => {
    setPanelState(null)
  }, [])

  return (
    <RightPanelContext.Provider value={{ panel, setPanel, clearPanel }}>
      {children}
    </RightPanelContext.Provider>
  )
}

export function useRightPanel() {
  const ctx = useContext(RightPanelContext)
  if (!ctx) {
    throw new Error("useRightPanel must be used within RightPanelProvider")
  }
  return ctx
}
