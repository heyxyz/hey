import { Profile } from '@generated/types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  currentUser: Profile | undefined
  setCurrentUser: (currentUser: Profile | undefined) => void
  profiles: Profile[] | []
  setProfiles: (profiles: Profile[]) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      currentUser: undefined,
      setCurrentUser: (currentUser) => set(() => ({ currentUser })),
      profiles: [],
      setProfiles: (profiles) => set(() => ({ profiles }))
    }),
    { name: 'lenster-storage' }
  )
)

export default useAppStore
