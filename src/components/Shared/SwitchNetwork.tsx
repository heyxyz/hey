import { Button } from '@components/UI/Button'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { useNetwork } from 'wagmi'

interface Props {
  className?: string
}

const SwitchNetwork: React.FC<Props> = ({ className = '' }) => {
  const [{}, switchNetwork] = useNetwork()

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      icon={<SwitchHorizontalIcon className="w-4 h-4" />}
      // @ts-ignore
      onClick={() => switchNetwork(80001)}
    >
      Switch Network
    </Button>
  )
}

export default SwitchNetwork
