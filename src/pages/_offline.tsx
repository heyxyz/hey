import { Button } from '@components/UI/Button'
import { RefreshIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { STATIC_ASSETS } from 'src/constants'

export default function Offline() {
  return (
    <div className="flex-col page-center">
      <img
        src={`${STATIC_ASSETS}/gifs/nyan-cat.gif`}
        alt="Nyan Cat"
        className="h-60"
      />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">You are offline!</h1>
        <div className="mb-4">
          Please check your internet connection and reload.
        </div>
        <Link href="/" passHref>
          <a href="/">
            <Button
              className="flex mx-auto item-center"
              size="lg"
              icon={<RefreshIcon className="w-4 h-4" />}
            >
              <div>Reload</div>
            </Button>
          </a>
        </Link>
      </div>
    </div>
  )
}
