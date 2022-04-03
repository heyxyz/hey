import { Card, CardBody } from '@components/UI/Card'
import { BeakerIcon } from '@heroicons/react/outline'

const Announcement: React.FC = () => {
  return (
    <Card className="mb-4 bg-yellow-50 dark:bg-yellow-900 !border-yellow-600">
      <CardBody className="space-y-2.5">
        <div className="flex items-center space-x-2 font-bold text-yellow-600">
          <BeakerIcon className="w-5 h-5 text-yellow-600" />
          <p>Beta warning!</p>
        </div>
        <p className="text-yellow-600 text-sm leading-[22px]">
          Lenster is still in the beta phase and all contents are stored in
          Mumbai testnet.
        </p>
      </CardBody>
    </Card>
  )
}

export default Announcement
