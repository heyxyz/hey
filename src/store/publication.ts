/* eslint-disable no-unused-vars */
import { LensterPost } from '@generated/lenstertypes'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface PublicationState {
  showNewPostModal: boolean
  setShowNewPostModal: (showNewPostModal: boolean) => void
  parentPub: LensterPost | null
  setParentPub: (parentPub: LensterPost | null) => void
}

export const usePublicationStore = create<PublicationState>((set) => ({
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  parentPub: null,
  setParentPub: (parentPub) => set(() => ({ parentPub }))
}))

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
