import { createContext, useContext } from 'react'

interface AddContentContextValue {
  open: (initialUrl?: string) => void
}

export const AddContentContext = createContext<AddContentContextValue>({ open: () => {} })
export const useAddContent = () => useContext(AddContentContext)
