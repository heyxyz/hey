import React, { FC } from 'react'

const Hero: FC = () => {
  return (
    <div className="py-12 mb-4 bg-white border-b bg-hero">
      <div className="container px-5 mx-auto max-w-screen-xl">
        <div className="flex items-stretch py-8 w-full text-center sm:py-12 sm:text-left">
          <div className="flex-1 flex-shrink-0 space-y-3">
            <div className="text-2xl font-extrabold text-black sm:text-4xl">
              Welcome to Lenster 👋
            </div>
            <div className="leading-7 text-gray-700">
              Lenster is a composable, decentralized, and permissionless social
              media web app built with Lens Protocol 🌿
            </div>
          </div>
          <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
        </div>
      </div>
    </div>
  )
}

export default Hero
