import { useTheme } from 'next-themes'
import { FC } from 'react'
import { useAppPersistStore } from 'src/store/app'
import { useDisconnect } from 'wagmi'

const CreateProfile: FC = () => {
  const { theme, setTheme } = useTheme()
  const { disconnect } = useDisconnect()

  const {
    isConnected,
    isAuthenticated,
    currentUser,
    setCurrentUser,
    staffMode,
    setStaffMode
  } = useAppPersistStore()

  return <div>gm</div>
}

export default CreateProfile
