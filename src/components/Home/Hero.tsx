import React, { FC } from 'react'
import { APP_NAME } from 'src/constants'

const Hero: FC = () => {
  return (
    <div className="py-12 mb-4 border-b bg-hero dark:border-b-gray-700/80">
      <div className="container px-5 mx-auto max-w-screen-xl">
        <div className="flex items-stretch py-8 w-full text-center sm:py-12 sm:text-left">
          <div className="flex-1 flex-shrink-0 space-y-3">
            <div className="text-2xl font-extrabold text-black sm:text-4xl">
              Welcome to {APP_NAME} 👋
            </div>
            <div className="leading-7 text-gray-700">
              {APP_NAME} is a decentralized, and permissionless social media app
              built with Lens Protocol 🌿
            </div>
          </div>
          <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
        </div>
      </div>
    </div>
  )
}

export default Hero
