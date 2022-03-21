import { BellIcon } from '@heroicons/react/outline'
import Link from 'next/link'

const Notification: React.FC = () => {
  return (
    <Link href="/notifications">
      <a className="flex items-start">
        <BellIcon className="w-6 h-6" />
        <div className="w-2 h-2 -ml-3 bg-red-500 rounded-full" />
      </a>
    </Link>
  )
}

export default Notification
