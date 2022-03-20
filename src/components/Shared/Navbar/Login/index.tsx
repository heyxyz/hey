import Create from '@components/Create'
import WalletSelector from '@components/Shared/Navbar/Login/WalletSelector'
import { Button } from '@components/UI/Button'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { useNetwork } from 'wagmi'

const Login: React.FC = () => {
  const [hasConnected, setHasConnected] = useState<boolean>(false)
  const [hasProfile, setHasProfile] = useState<boolean>(true)
  const [{ data: network }, switchNetwork] = useNetwork()

  return (
    <div className="p-5">
      {network.chain?.unsupported && switchNetwork ? (
        <Button
          variant="danger"
          icon={<SwitchHorizontalIcon className="w-4 h-4" />}
          onClick={() => switchNetwork(80001)}
        >
          Switch Network
        </Button>
      ) : hasProfile ? (
        <div className="space-y-5">
          {hasConnected ? (
            <div className="space-y-1">
              <div className="text-xl font-bold">Please sign the message.</div>
              <div className="text-sm text-gray-500">
                LensHub uses this signature to verify that you're the owner of
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
