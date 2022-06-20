import { createContext, Dispatch } from 'react'

export interface ContextType {
  userSigNonce: number
  setUserSigNonce: Dispatch<number>
}

const AppContext = createContext<ContextType>({
  userSigNonce: 0,
  setUserSigNonce: () => {}
})

export default AppContext
