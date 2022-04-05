import { Card, CardBody } from '@components/UI/Card'
import { BeakerIcon, CurrencyDollarIcon } from '@heroicons/react/outline'

const Announcement: React.FC = () => {
  return (
    <Card className="mb-4 bg-yellow-50 dark:bg-yellow-900 !border-yellow-600">
      <CardBody className="space-y-2.5 text-yellow-600">
        <div className="flex items-center space-x-2 font-bold">
          <BeakerIcon className="w-5 h-5" />
          <p>Beta warning!</p>
        </div>
        <p className="text-sm leading-[22px]">
          Lenster is still in the beta phase and all contents are stored in
          Mumbai testnet.
        </p>
        <div className="flex items-center space-x-1.5 text-sm font-bold">
          <CurrencyDollarIcon className="h-4 w-4" />
          <a
            href="https://faucet.polygon.technology/"
            target="_blank"
            rel="noreferrer"
          >
            Get testnet tokens
          </a>
        </div>
      </CardBody>
    </Card>
  )
}

export default Announcement
