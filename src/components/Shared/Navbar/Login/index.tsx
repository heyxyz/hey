import Create from '@components/Create'
import WalletSelector from '@components/Shared/Navbar/Login/WalletSelector'
import { Button } from '@components/UI/Button'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { useNetwork } from 'wagmi'

const Login: React.FC = () => {
  const [hasProfile, setHasProfile] = useState(true)
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
        <WalletSelector setHasProfile={setHasProfile} />
      ) : (
        <Create />
      )}
    </div>
  )
}

export default Login
