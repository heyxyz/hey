import { Button } from '@components/UI/Button'
import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { STATIC_ASSETS } from 'src/constants'

export default function Custom404() {
  return (
    <div className="flex-col page-center">
      <img
        src={`${STATIC_ASSETS}/gifs/nyan-cat.gif`}
        alt="Nyan Cat"
        className="h-60"
      />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Oops, Lost‽</h1>
        <div className="mb-4">This page could not be found.</div>
        <Link href="/" passHref>
          <a href="/">
            <Button
              className="flex mx-auto item-center"
              size="lg"
              icon={<HomeIcon className="w-4 h-4" />}
            >
              <div>Go to home</div>
            </Button>
          </a>
        </Link>
      </div>
    </div>
  )
}
