/* eslint-disable no-unused-vars */
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface PublicationPersistState {
  persistedPublication: string
  setPersistedPublication: (persistedPublication: string) => void
}

export const usePublicationPersistStore = create(
  persist<PublicationPersistState>(
    (set) => ({
      persistedPublication: '',
      setPersistedPublication: (persistedPublication) =>
        set(() => ({ persistedPublication }))
    }),
    { name: 'lenster.store' }
  )
)
