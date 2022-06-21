/* eslint-disable no-unused-vars */
import { Profile } from '@generated/types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  currentUser: Profile | undefined
  setCurrentUser: (currentUser: Profile | undefined) => void
  staffMode: boolean
  setStaffMode: (staffMode: boolean) => void
  profiles: Profile[] | []
  setProfiles: (profiles: Profile[]) => void
  userSigNonce: number
  setUserSigNonce: (userSigNonce: number) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      currentUser: undefined,
      setCurrentUser: (currentUser) => set(() => ({ currentUser })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      profiles: [],
      setProfiles: (profiles) => set(() => ({ profiles })),
      userSigNonce: 0,
      setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce }))
    }),
    { name: 'lenster.store' }
  )
)

export default useAppStore
