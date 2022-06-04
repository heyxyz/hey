import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import {
  MinusCircleIcon,
  PencilAltIcon,
  PhotographIcon
} from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { FC, useContext } from 'react'

interface StatusProps {
  finished: boolean
  title: string
}

const Status: FC<StatusProps> = ({ finished, title }) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <MinusCircleIcon className="w-5 h-5 text-yellow-500" />
    )}
    <div className={clsx(finished ? 'text-green-500' : 'text-yellow-500')}>
      {title}
    </div>
  </div>
)

const SetProfile: FC = () => {
  const { currentUser, profiles } = useContext(AppContext)
  const hasDefaultProfile = !!profiles.find((o) => o.isDefault)
  const doneSetup =
    !!currentUser?.name && !!currentUser?.bio && !!currentUser?.picture

  if (!hasDefaultProfile || doneSetup) return null

  return (
    <Card className="mb-4 bg-green-50 dark:bg-green-900 !border-green-600">
      <CardBody className="space-y-4 text-green-600">
        <div className="flex items-center space-x-2 font-bold">
          <PhotographIcon className="w-5 h-5" />
          <p>Setup your Lenster profile</p>
        </div>
        <div className="space-y-1 text-sm leading-[22px]">
          <Status finished={!!currentUser?.name} title="Set profile name" />
          <Status finished={!!currentUser?.bio} title="Set profile bio" />
          <Status finished={!!currentUser?.picture} title="Set your avatar" />
        </div>
        <div className="flex items-center space-x-1.5 text-sm font-bold">
          <PencilAltIcon className="w-4 h-4" />
          <Link href="/settings" prefetch={false}>
            <a href="/settings">Update profile here</a>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export default SetProfile
