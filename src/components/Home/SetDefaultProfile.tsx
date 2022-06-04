import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import { CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { FC, useContext } from 'react'

const SetDefaultProfile: FC = () => {
  const { profiles } = useContext(AppContext)
  const hasDefaultProfile = !!profiles.find((o) => o.isDefault)
  const count = profiles.length

  if (hasDefaultProfile) return null

  return (
    <Card className="mb-4 bg-green-50 dark:bg-green-900 !border-green-600">
      <CardBody className="space-y-2.5 text-green-600">
        <div className="flex items-center space-x-2 font-bold">
          <UserCircleIcon className="w-5 h-5" />
          <p>Set default profile</p>
        </div>
        <p className="text-sm leading-[22px]">
          You have owned {count} {count > 1 ? 'profiles' : 'profile'} but you
          don&rsquo;t have any default account.
        </p>
        <div className="flex items-center space-x-1.5 text-sm font-bold">
          <CurrencyDollarIcon className="w-4 h-4" />
          <Link href="/settings/account" prefetch={false}>
            <a href="/settings/account">Set default profile here</a>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export default SetDefaultProfile
