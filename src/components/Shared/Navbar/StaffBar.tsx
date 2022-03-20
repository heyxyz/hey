import {
  ChipIcon,
  HashtagIcon,
  ShieldCheckIcon,
  TerminalIcon
} from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { GIT_COMMIT_REF, GIT_COMMIT_SHA, REACT_VERSION } from 'src/constants'

interface Props {
  children: React.ReactNode
}

const Badge: React.FC<Props> = ({ children }) => (
  <span className="text-xs font-bold bg-gray-300 dark:bg-gray-900 py-0.5 px-1.5 rounded-md">
    {children}
  </span>
)

const StaffBar: React.FC = () => {
  return (
    <div className="flex justify-between px-3 py-1 text-sm bg-gray-200 dark:bg-black">
      <div className="flex items-center space-x-2">
        {GIT_COMMIT_REF && (
          <div className="flex items-center space-x-1" title="Git commit ref">
            <TerminalIcon className="w-4 h-4" />
            <Badge>{GIT_COMMIT_REF}</Badge>
          </div>
        )}
        {GIT_COMMIT_SHA && (
          <div className="flex items-center space-x-1" title="Git commit SHA">
            <HashtagIcon className="w-4 h-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </div>
        )}
        <div className="flex items-center space-x-1" title="React.js Version">
          <ChipIcon className="w-4 h-4" />
          <span>
            React.js <Badge>v{REACT_VERSION}</Badge>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/stafftools" passHref>
          <a title="Staff panel">
            <ShieldCheckIcon className="w-4 h-4" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default StaffBar
