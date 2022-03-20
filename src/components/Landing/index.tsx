import Home from '@components/Home'
import Signup from '@components/Landing/Signup'
import Hero from '@components/Shared/Hero'
import LandingFooter from '@components/Shared/LandingFooter'
import { Button } from '@components/UI/Button'
import AppContext from '@components/utils/AppContext'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React, { useContext, useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'
import { useNetwork } from 'wagmi'

const WalletSelector = dynamic(() => import('./WalletSelector'), {
  loading: () => (
    <div className="space-y-3">
      <div className="w-full h-12 shimmer rounded-xl" />
      <div className="w-full h-12 shimmer rounded-xl" />
      <div className="w-full h-12 shimmer rounded-xl" />
    </div>
  )
})

const Landing: NextPage = () => {
  const { currentUser } = useContext(AppContext)
  const [hasProfile, setHasProfile] = useState(true)
  const [{ data: network }, switchNetwork] = useNetwork()

  if (currentUser) return <Home />

  return (
    <div className="flex flex-grow">
      <div className="grid w-full grid-cols-12">
        <Hero />
        <div className="flex flex-col col-span-12 px-5 py-8 lg:col-span-5 md:col-span-12 lg:px-14 md:px-10 sm:px-5">
          <div className="flex-grow space-y-7">
            <img
              src={`${STATIC_ASSETS}/emojis/${
                hasProfile ? 'wave' : 'herb'
              }.png`}
              className="w-20"
              alt="Waving Emoji"
            />
            <div className="space-y-3">
              <div className="text-4xl font-extrabold leading-[45px]">
                {hasProfile ? "What's poppin'?" : 'Create your lens account'}
              </div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                Join LensHub today.
              </div>
            </div>
            {network.chain?.unsupported && switchNetwork ? (
              <Button
                variant="danger"
                icon={<SwitchHorizontalIcon className="w-4 h-4" />}
                onClick={() => switchNetwork(80001)}
              >
                Switch Network
              </Button>
            ) : hasProfile ? (
              <WalletSelector setHasProfile={setHasProfile} />
            ) : (
              <Signup />
            )}
          </div>
          <LandingFooter />
        </div>
      </div>
    </div>
  )
}

export default Landing
