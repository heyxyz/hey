/* eslint-disable no-unused-vars */
import { LensterPublication } from '@generated/lenstertypes'
import create from 'zustand'

interface PublicationState {
  showNewPostModal: boolean
  setShowNewPostModal: (showNewPostModal: boolean) => void
  parentPub: LensterPublication | null
  setParentPub: (parentPub: LensterPublication | null) => void
}

export const usePublicationStore = create<PublicationState>((set) => ({
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  parentPub: null,
  setParentPub: (parentPub) => set(() => ({ parentPub }))
}))
