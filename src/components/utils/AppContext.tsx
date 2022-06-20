import { ApolloError } from '@apollo/client'
import { createContext, Dispatch } from 'react'

export interface ContextType {
  userSigNonce: number
  setUserSigNonce: Dispatch<number>
  staffMode?: boolean
  setStaffMode: Dispatch<boolean>
  currentUserLoading: boolean
  currentUserError?: ApolloError
}

const AppContext = createContext<ContextType>({
  userSigNonce: 0,
  setUserSigNonce: () => {},
  staffMode: false,
  setStaffMode: () => {},
  currentUserLoading: false,
  currentUserError: undefined
})

export default AppContext
