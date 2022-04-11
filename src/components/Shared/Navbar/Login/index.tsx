import WalletSelector from '@components/Shared/Navbar/Login/WalletSelector'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { FC, useState } from 'react'
import { useNetwork } from 'wagmi'

import Create from './Create'

const Login: FC = () => {
  const [hasConnected, setHasConnected] = useState<boolean>(false)
  const [hasProfile, setHasProfile] = useState<boolean>(true)
  const { switchNetwork, activeChain } = useNetwork()

  return (
    <div className="p-5">
      {activeChain?.unsupported && switchNetwork ? (
        <SwitchNetwork />
      ) : hasProfile ? (
        <div className="space-y-5">
          {hasConnected ? (
            <div className="space-y-1">
              <div className="text-xl font-bold">Please sign the message.</div>
              <div className="text-sm text-gray-500">
                Lenster uses this signature to verify that you're the owner of
                this address.
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xl font-bold">Connect your wallet.</div>
              <div className="text-sm text-gray-500">
                Connect with one of our available wallet providers or create a
                new one.
              </div>
            </div>
          )}
          <WalletSelector
            setHasConnected={setHasConnected}
            setHasProfile={setHasProfile}
          />
        </div>
      ) : (
        <Create />
      )}
    </div>
  )
}

export default Login
