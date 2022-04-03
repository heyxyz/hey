import { Card, CardBody } from '@components/UI/Card'
import { BeakerIcon } from '@heroicons/react/outline'

const Announcement: React.FC = () => {
  return (
    <Card className="mb-4 bg-yellow-50 dark:bg-yellow-900 !border-yellow-500">
      <CardBody className="space-y-3">
        <div className="flex font-bold text-yellow-500 items-center space-x-2">
          <BeakerIcon className="h-5 w-5 text-yellow-500" />
          <p>Beta warning!</p>
        </div>
        <p className="text-yellow-500">
          Lenster is still in beta phase and all contents are stored in Mumbai
          testnet.
        </p>
      </CardBody>
    </Card>
  )
}

export default Announcement
