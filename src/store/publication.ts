/* eslint-disable no-unused-vars */
import { LensterPost } from '@generated/lenstertypes'
import create from 'zustand'

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
