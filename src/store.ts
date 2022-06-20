/* eslint-disable no-unused-vars */
import { Profile } from '@generated/types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  currentUser: Profile | undefined
  setCurrentUser: (currentUser: Profile | undefined) => void
  staffMode: boolean
  setStaffMode: (staffMode: boolean) => void
  profiles: Profile[] | []
  setProfiles: (profiles: Profile[]) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      currentUser: undefined,
      setCurrentUser: (currentUser) => set(() => ({ currentUser })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      profiles: [],
      setProfiles: (profiles) => set(() => ({ profiles }))
    }),
    { name: 'lenster-storage' }
  )
)

export default useAppStore
