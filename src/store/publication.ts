/* eslint-disable no-unused-vars */
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface PublicationState {
  persistedPublication: string
  setPersistedPublication: (persistedPublication: string) => void
}

export const usePublicationStore = create(
  persist<PublicationState>(
    (set) => ({
      persistedPublication: '',
      setPersistedPublication: (persistedPublication) =>
        set(() => ({ persistedPublication }))
    }),
    { name: 'lenster.store' }
  )
)
