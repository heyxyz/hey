import { CursorClickIcon, UserIcon } from '@heroicons/react/outline'
import { FC } from 'react'
import { APP_NAME } from 'src/constants'

const ProfileWarning: FC = () => {
  return (
    <div className="p-5 border-b border-b-yellow-400 bg-yellow-50 dark:bg-yellow-900 space-y-2.5 text-yellow-600">
      <div className="flex items-center space-x-2">
        <UserIcon className="w-5 h-5" />
        <b>You don't have lens profile!</b>
        <p className="text-sm leading-[22px]">
          Claim your Lens profile to enjoy all features in Lens and {APP_NAME}
        </p>
        <span>—</span>
        <div className="flex items-center space-x-1.5 text-sm font-bold">
          <CursorClickIcon className="w-4 h-4" />
          <a
            href="https://claim.lens.xyz"
            target="_blank"
            rel="noreferrer noopener"
          >
            Cliam your profile here
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProfileWarning
