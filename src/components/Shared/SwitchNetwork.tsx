import { Button } from '@components/UI/Button'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import { FC } from 'react'
import { CHAIN_ID } from 'src/constants'
import { useNetwork } from 'wagmi'

interface Props {
  className?: string
}

const SwitchNetwork: FC<Props> = ({ className = '' }) => {
  const [{}, switchNetwork] = useNetwork()

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      icon={<SwitchHorizontalIcon className="w-4 h-4" />}
      onClick={() => {
        trackEvent('switch network')
        // @ts-ignore
        switchNetwork(CHAIN_ID)
      }}
    >
      Switch Network
    </Button>
  )
}

export default SwitchNetwork
