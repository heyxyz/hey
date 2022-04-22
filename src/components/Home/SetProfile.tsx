import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import { CurrencyDollarIcon, PhotographIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { FC, useContext } from 'react'

const SetProfile: FC = () => {
  const { currentUser, profiles } = useContext(AppContext)
  const hasDefaultProfile = !!profiles.find((o) => o.isDefault)

  if (!hasDefaultProfile || currentUser?.name) return null

  return (
    <Card className="mb-4 bg-green-50 dark:bg-green-900 !border-green-600">
      <CardBody className="space-y-2.5 text-green-600">
        <div className="flex items-center space-x-2 font-bold">
          <PhotographIcon className="w-5 h-5" />
          <p>Setup your profile</p>
        </div>
        <p className="text-sm leading-[22px]"></p>
        <div className="flex items-center space-x-1.5 text-sm font-bold">
          <CurrencyDollarIcon className="w-4 h-4" />
          <Link href="/settings/account">
            <a href="/settings/account">Set default profile here</a>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export default SetProfile
